/**
 * ADT (ABAP Development Tools) Client
 * HTTP client for SAP ADT REST API communication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SAPConnectionConfig } from '../types';
import { Logger, logger as defaultLogger } from '../utils/logger';
import {
  ADTError,
  AuthenticationError,
  ConnectionError,
  CSRFTokenError,
  createErrorFromResponse,
  parseADTErrorMessage,
  ErrorCodes
} from '../utils/errors';
import { parseXML, buildXML } from '../utils/xml-parser';

/**
 * ADT Client configuration
 */
export interface ADTClientConfig {
  connection: SAPConnectionConfig;
  logger?: Logger;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * ADT request options
 */
export interface ADTRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
  skipCSRF?: boolean;
}

/**
 * ADT response wrapper
 */
export interface ADTResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  raw?: string;
}

/**
 * Lock handle for ADT objects
 */
export interface LockHandle {
  lockHandle: string;
  objectUri: string;
  expiresAt?: Date;
}

/**
 * ADT Client for SAP system communication
 */
export class ADTClient {
  private readonly config: ADTClientConfig;
  private readonly httpClient: AxiosInstance;
  private readonly logger: Logger;
  private csrfToken: string | null = null;
  private csrfTokenExpiry: Date | null = null;
  private sessionCookies: string | null = null;
  private readonly activeLocks: Map<string, LockHandle> = new Map();
  
  // Session management for stateful operations (required for lock/unlock)
  private sessionType: 'stateful' | 'stateless' = 'stateless';
  private readonly connectionId: string;

  constructor(config: ADTClientConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };
    this.logger = config.logger ?? defaultLogger.child({ module: 'adt-client' });
    
    // Generate a unique connection ID for correlating lock and update requests
    // This is similar to how Eclipse ADT generates sap-adt-connection-id
    this.connectionId = this.generateConnectionId();
    this.logger.debug(`Generated connection ID: ${this.connectionId}`);

    // Create axios instance with base configuration
    this.httpClient = axios.create({
      baseURL: this.buildBaseURL(),
      timeout: this.config.timeout,
      headers: {
        'Accept': 'application/xml, application/atom+xml, text/plain, */*',
        'Content-Type': 'application/xml'
      },
      // Disable automatic response transformation
      transformResponse: [(data) => data],
      // Accept self-signed certificates (common in SAP dev systems)
      httpsAgent: this.config.connection.allowInsecure
        ? new (require('https').Agent)({ rejectUnauthorized: false })
        : undefined,
      // Enable cookie jar for session continuity (critical for CSRF token)
      withCredentials: true
    });

    // Add request interceptor for authentication
    this.httpClient.interceptors.request.use(
      (config) => {
        // Add basic authentication
        const auth = Buffer.from(
          `${this.config.connection.username}:${this.config.connection.password}`
        ).toString('base64');
        config.headers['Authorization'] = `Basic ${auth}`;

        // Add SAP client if specified
        if (this.config.connection.client) {
          config.headers['sap-client'] = this.config.connection.client;
        }

        // Add language if specified
        if (this.config.connection.language) {
          config.headers['sap-language'] = this.config.connection.language;
        }

        // Add session cookies for CSRF token continuity
        // This is critical in Node.js where withCredentials doesn't work
        if (this.sessionCookies) {
          config.headers['Cookie'] = this.sessionCookies;
        }
        
        // Add session type header for stateful operations
        // This is CRITICAL for lock operations to work correctly
        config.headers['X-sap-adt-sessiontype'] = this.sessionType;
        
        // Add connection ID to correlate lock and update requests
        config.headers['sap-adt-connection-id'] = this.connectionId;

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for logging and cookie management
    this.httpClient.interceptors.response.use(
      (response) => {
        this.logger.httpResponse(response.status, response.statusText);
        
        // Save session cookies from all responses for session continuity
        // This is critical for lock operations where SAP may issue new session cookies
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
          this.updateSessionCookies(setCookieHeader);
        }
        
        return response;
      },
      (error) => {
        if (error.response) {
          this.logger.httpResponse(error.response.status, error.response.statusText);
          
          // Also capture cookies from error responses
          const setCookieHeader = error.response.headers['set-cookie'];
          if (setCookieHeader) {
            this.updateSessionCookies(setCookieHeader);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Build base URL from connection config
   */
  private buildBaseURL(): string {
    const { host, port, https = true } = this.config.connection;
    const protocol = https ? 'https' : 'http';
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}://${host}${portSuffix}/sap/bc/adt`;
  }

  /**
   * Test connection to SAP system
   */
  async testConnection(): Promise<boolean> {
    this.logger.info('Testing connection to SAP system');
    try {
      const response = await this.get('/discovery', { skipCSRF: true });
      this.logger.info('Connection test successful');
      return response.status === 200;
    } catch (error) {
      this.logger.error('Connection test failed', error);
      return false;
    }
  }

  /**
   * Fetch CSRF token for write operations
   */
  async fetchCSRFToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.csrfToken && this.csrfTokenExpiry && this.csrfTokenExpiry > new Date()) {
      this.logger.debug(`Using cached CSRF token (expires: ${this.csrfTokenExpiry.toISOString()})`);
      return this.csrfToken;
    }

    this.logger.debug('Fetching new CSRF token from /discovery endpoint');

    try {
      const response = await this.httpClient.get('/discovery', {
        headers: {
          'X-CSRF-Token': 'Fetch',
          'Accept': 'application/atomsvc+xml'
        }
      });

      // Log all response headers for debugging
      this.logger.debug(`Response status: ${response.status}`);
      this.logger.debug(`Response headers: ${JSON.stringify(response.headers, null, 2)}`);

      // Session cookies are now automatically saved by the response interceptor
      // using the updateSessionCookies method which properly parses and merges cookies

      // Try both lowercase and original case for the token header
      let token = response.headers['x-csrf-token'];
      if (!token) {
        // axios normalizes headers to lowercase, but let's check all variations
        for (const [key, value] of Object.entries(response.headers)) {
          if (key.toLowerCase() === 'x-csrf-token') {
            token = value as string;
            this.logger.debug(`Found CSRF token under header key: ${key}`);
            break;
          }
        }
      }

      this.logger.debug(`CSRF token value: ${token ? `${token.substring(0, 20)}...` : 'null/undefined'}`);

      if (!token || token === 'unsafe') {
        this.logger.error(`Invalid CSRF token received: ${token}`);
        throw new CSRFTokenError('Failed to fetch valid CSRF token', {
          receivedToken: token,
          responseHeaders: Object.keys(response.headers)
        });
      }

      this.csrfToken = token;
      // Token typically valid for 30 minutes, refresh after 25
      this.csrfTokenExpiry = new Date(Date.now() + 25 * 60 * 1000);

      this.logger.debug(`CSRF token fetched successfully: ${token.substring(0, 20)}...`);
      return token;
    } catch (error) {
      if (error instanceof CSRFTokenError) {
        throw error;
      }
      this.logger.error('Failed to fetch CSRF token', error);
      throw new CSRFTokenError('Failed to fetch CSRF token', {
        originalError: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Clear cached CSRF token
   */
  clearCSRFToken(): void {
    this.csrfToken = null;
    this.csrfTokenExpiry = null;
    // Also clear session cookies when clearing token, as they are tied together
    this.sessionCookies = null;
  }

  /**
   * Perform GET request
   */
  async get<T = string>(
    path: string,
    options?: ADTRequestOptions
  ): Promise<ADTResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  /**
   * Perform POST request
   */
  async post<T = string>(
    path: string,
    data?: string | Record<string, unknown>,
    options?: ADTRequestOptions
  ): Promise<ADTResponse<T>> {
    return this.request<T>('POST', path, data, options);
  }

  /**
   * Perform PUT request
   */
  async put<T = string>(
    path: string,
    data?: string | Record<string, unknown>,
    options?: ADTRequestOptions
  ): Promise<ADTResponse<T>> {
    return this.request<T>('PUT', path, data, options);
  }

  /**
   * Perform DELETE request
   */
  async delete<T = string>(
    path: string,
    options?: ADTRequestOptions
  ): Promise<ADTResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  /**
   * Core request method with retry logic
   */
  private async request<T>(
    method: string,
    path: string,
    data?: string | Record<string, unknown>,
    options?: ADTRequestOptions
  ): Promise<ADTResponse<T>> {
    const { headers = {}, params, timeout, skipCSRF = false } = options ?? {};

    // Ensure CSRF token for write operations
    if (!skipCSRF && ['POST', 'PUT', 'DELETE'].includes(method)) {
      this.logger.debug(`Fetching CSRF token for ${method} request to ${path}`);
      const csrfToken = await this.fetchCSRFToken();
      headers['X-CSRF-Token'] = csrfToken;
      this.logger.debug(`Added CSRF token to headers: ${csrfToken.substring(0, 20)}...`);
    }

    const config: AxiosRequestConfig = {
      method,
      url: path,
      headers,
      params,
      timeout: timeout ?? this.config.timeout
    };

    // Log the full request configuration for debugging
    this.logger.debug(`Request config: ${JSON.stringify({
      method: config.method,
      url: config.url,
      headers: config.headers,
      params: config.params
    }, null, 2)}`);

    // Handle request body
    if (data !== undefined) {
      if (typeof data === 'string') {
        config.data = data;
      } else {
        config.data = buildXML(data);
      }
    }

    this.logger.httpRequest(method, path, headers);

    let lastError: Error | null = null;
    const retryAttempts = this.config.retryAttempts ?? 3;
    const retryDelay = this.config.retryDelay ?? 1000;

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const response = await this.httpClient.request(config);
        return this.wrapResponse<T>(response);
      } catch (error) {
        lastError = this.handleRequestError(error, attempt, retryAttempts);

        // Don't retry if error is not retryable
        if (lastError instanceof ADTError && !lastError.isRetryable) {
          throw lastError;
        }

        // Don't retry on last attempt
        if (attempt < retryAttempts) {
          this.logger.debug(`Retrying request (attempt ${attempt + 1}/${retryAttempts})`);
          await this.sleep(retryDelay * attempt);

          // Refresh CSRF token on 403 errors
          if (
            lastError instanceof AuthenticationError ||
            (lastError instanceof ADTError && lastError.statusCode === 403)
          ) {
            this.clearCSRFToken();
          }
        }
      }
    }

    throw lastError ?? new ConnectionError('Request failed after all retries');
  }

  /**
   * Wrap axios response in ADTResponse
   */
  private wrapResponse<T>(response: AxiosResponse): ADTResponse<T> {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') {
        headers[key.toLowerCase()] = value;
      }
    }

    return {
      data: response.data as T,
      status: response.status,
      headers,
      raw: typeof response.data === 'string' ? response.data : undefined
    };
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: unknown, attempt: number, maxAttempts: number): Error {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response) {
        const { status, statusText, data } = response;

        // Try to parse ADT error message from response
        let message = statusText;
        if (typeof data === 'string') {
          const adtMessage = parseADTErrorMessage(data);
          if (adtMessage) {
            message = adtMessage;
          }
        }

        this.logger.warn(
          `Request failed (attempt ${attempt}/${maxAttempts}): ${status} ${message}`
        );

        return createErrorFromResponse(status, message, data);
      }

      // Network error
      if (error.code === 'ECONNREFUSED') {
        return new ConnectionError(`Connection refused to ${this.config.connection.host}`);
      }
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return new ConnectionError('Connection timeout', { code: error.code });
      }
      if (error.code === 'ENOTFOUND') {
        return new ConnectionError(`Host not found: ${this.config.connection.host}`);
      }

      return new ConnectionError(error.message);
    }

    return error instanceof Error ? error : new Error(String(error));
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Normalize URI by removing /sap/bc/adt prefix if present
   * This prevents URI duplication since baseURL already includes /sap/bc/adt
   */
  private normalizeUri(uri: string): string {
    if (!uri) {
      throw new ADTError(
        'URI cannot be undefined or empty',
        ErrorCodes.INVALID_INPUT,
        undefined,
        { uri }
      );
    }
    if (uri.startsWith('/sap/bc/adt')) {
      return uri.substring('/sap/bc/adt'.length);
    }
    return uri;
  }

  // ============================================
  // ADT Object Operations
  // ============================================

  /**
   * Get ADT object by URI
   */
  async getObject(objectUri: string): Promise<ADTResponse<string>> {
    const normalizedUri = this.normalizeUri(objectUri);
    this.logger.adtOperation('getObject', undefined, normalizedUri);
    return this.get(normalizedUri);
  }

  /**
   * Get ADT object source code
   */
  async getObjectSource(objectUri: string): Promise<string> {
    const normalizedUri = this.normalizeUri(objectUri);
    this.logger.adtOperation('getSource', undefined, normalizedUri);
    const sourceUri = normalizedUri.endsWith('/source/main')
      ? normalizedUri
      : `${normalizedUri}/source/main`;
    const response = await this.get<string>(sourceUri, {
      headers: { 'Accept': 'text/plain' }
    });
    return response.data;
  }

  /**
   * Update ADT object source code
   * SAP ADT requires lockHandle as a URL query parameter for source updates
   * 
   * Important: The lock handle must be passed as a URL query parameter.
   * The lock is acquired at the program level (/programs/programs/{name}),
   * and the source update should also use the same path.
   */
  async updateObjectSource(
    objectUri: string,
    source: string,
    lockHandle: string
  ): Promise<void> {
    const normalizedUri = this.normalizeUri(objectUri);
    
    // Use the same URI path as the lock operation
    // No conversion needed - both lock and update use /programs/programs/
    let sourceUri = normalizedUri;
    
    // Add /source/main suffix if not present
    if (!sourceUri.endsWith('/source/main')) {
      sourceUri = `${sourceUri}/source/main`;
    }
    
    // Log the actual URI being used for the update
    this.logger.adtOperation('updateSource', undefined, sourceUri);
    this.logger.debug(`Updating source at URI: ${sourceUri} with lockHandle: ${lockHandle.substring(0, 20)}...`);
    
    // SAP ADT requires lockHandle as a URL query parameter for source updates
    await this.put(sourceUri, source, {
      headers: {
        'Content-Type': 'text/plain'
      },
      params: {
        'lockHandle': lockHandle
      }
    });
  }

  /**
   * Lock ADT object for editing
   * 
   * For ABAP programs, locking is done at the program level:
   *   - Lock URI: /programs/programs/{name}
   * 
   * The lock handle returned is bound to this URI and must be used
   * with the same URI path for source updates.
   * 
   * IMPORTANT: Lock operations require stateful session mode.
   * The X-sap-adt-sessiontype header must be set to 'stateful'.
   * 
   * NOTE: Different object types require different Accept headers.
   * DDIC objects (tables, structures, etc.) require specific content types.
   */
  async lockObject(objectUri: string): Promise<LockHandle> {
    const normalizedUri = this.normalizeUri(objectUri);
    
    // For source URIs, remove the /source/main suffix first
    let lockUri = normalizedUri;
    if (normalizedUri.includes('/source/')) {
      lockUri = normalizedUri.split('/source/')[0];
    }
    
    // No conversion needed - lock at the same level as the object URI
    // For programs, use /programs/programs/{name}
    
    this.logger.adtOperation('lock', undefined, lockUri);
    this.logger.debug(`Locking object at URI: ${lockUri}`);

    // CRITICAL: Set session type to stateful before lock operation
    // This tells SAP to maintain the lock state in a stateful session
    const previousSessionType = this.sessionType;
    this.sessionType = 'stateful';

    // Determine the appropriate Accept header based on object type
    // Different ADT object types require different content types
    const acceptHeader = this.getAcceptHeaderForUri(lockUri);
    
    const response = await this.post(`${lockUri}?_action=LOCK&accessMode=MODIFY`, undefined, {
      headers: {
        'Accept': acceptHeader
      }
    });

    // Parse lock handle from response
    const lockHandleMatch = response.raw?.match(
      /<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i
    );

    if (!lockHandleMatch) {
      throw new ADTError(
        'Failed to obtain lock handle',
        ErrorCodes.ADT_OBJECT_LOCKED,
        undefined,
        { objectUri, lockUri }
      );
    }

    const handle: LockHandle = {
      lockHandle: lockHandleMatch[1],
      objectUri: lockUri, // Store the actual locked URI
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes default
    };

    // Store lock handle
    this.activeLocks.set(lockUri, handle);
    if (lockUri !== normalizedUri) {
      this.activeLocks.set(normalizedUri, handle);
    }
    
    this.logger.debug(`Lock acquired: ${handle.lockHandle.substring(0, 20)}...`);
    
    return handle;
  }

  /**
   * Unlock ADT object
   * 
   * SAP ADT requires lockHandle as a URL query parameter for unlock operations.
   * Unlocking uses the same URI path as the lock operation.
   * 
   * Note: Unlock can be done in stateless mode after the lock and update are complete.
   */
  async unlockObject(objectUri: string, lockHandle: string): Promise<void> {
    const normalizedUri = this.normalizeUri(objectUri);
    
    // For source URIs, remove the /source/main suffix
    let unlockUri = normalizedUri;
    if (normalizedUri.includes('/source/')) {
      unlockUri = normalizedUri.split('/source/')[0];
    }
    
    this.logger.adtOperation('unlock', undefined, unlockUri);
    this.logger.debug(`Unlocking object at URI: ${unlockUri}`);

    // Unlock can be done in stateless mode
    // Switch back to stateless after unlock
    const previousSessionType = this.sessionType;

    try {
      // SAP ADT requires lockHandle as a URL query parameter for unlock
      // The format is: POST /sap/bc/adt/...?_action=UNLOCK&lockHandle=XXX
      await this.post(unlockUri, undefined, {
        params: {
          '_action': 'UNLOCK',
          'lockHandle': lockHandle
        }
      });
    } finally {
      // Reset to stateless mode after unlock
      this.sessionType = 'stateless';
    }

    // Remove lock handle from cache
    this.activeLocks.delete(unlockUri);
    this.activeLocks.delete(normalizedUri);
    
    this.logger.debug(`Lock released for ${unlockUri}`);
  }

  /**
   * Get active lock for object
   */
  getActiveLock(objectUri: string): LockHandle | undefined {
    const normalizedUri = this.normalizeUri(objectUri);
    return this.activeLocks.get(normalizedUri);
  }

  /**
   * Delete ADT object using the ADT Deletion API
   * 
   * This method uses the newer ADT Deletion API which does NOT require locking first.
   * This is essential for deleting objects that cannot be locked (e.g., empty function modules).
   * 
   * API Flow:
   * 1. POST /sap/bc/adt/deletion/check - Check if object can be deleted
   * 2. POST /sap/bc/adt/deletion/delete - Execute the deletion
   * 
   * @param objectUri - The object URI (e.g., /sap/bc/adt/functions/groups/zfgr_todo/fmodules/z_todo_create)
   * @param transportRequest - Optional transport request number (empty for $TMP objects)
   */
  async deleteObject(objectUri: string, transportRequest?: string): Promise<void> {
    // For deletion API, we need the FULL URI with /sap/bc/adt prefix
    const fullUri = objectUri.startsWith('/sap/bc/adt') 
      ? objectUri 
      : `/sap/bc/adt${this.normalizeUri(objectUri)}`;
    
    this.logger.adtOperation('delete', undefined, fullUri);
    this.logger.info(`Deleting object using ADT Deletion API: ${fullUri}`);
    
    try {
      // Step 1: Check if object can be deleted
      await this.deletionCheck(fullUri);
      this.logger.debug(`Deletion check passed for: ${fullUri}`);
      
      // Step 2: Execute the deletion
      await this.deletionExecute(fullUri, transportRequest);
      this.logger.info(`Object deleted successfully: ${fullUri}`);
      
    } catch (error) {
      this.logger.error(`Failed to delete object: ${fullUri}`, error);
      throw error;
    }
  }

  /**
   * Check if an object can be deleted using ADT Deletion API
   * 
   * Request:
   *   POST /sap/bc/adt/deletion/check
   *   Content-Type: application/vnd.sap.adt.deletion.check.request.v1+xml
   *   Accept: application/vnd.sap.adt.deletion.check.response.v1+xml
   *   Body: <del:checkRequest><del:object adtcore:uri="..."/></del:checkRequest>
   * 
   * @param fullUri - Full object URI with /sap/bc/adt prefix
   */
  private async deletionCheck(fullUri: string): Promise<void> {
    const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<del:checkRequest xmlns:adtcore="http://www.sap.com/adt/core" xmlns:del="http://www.sap.com/adt/deletion">
  <del:object adtcore:uri="${fullUri}"/>
</del:checkRequest>`;

    this.logger.debug(`Deletion check request body:\n${requestBody}`);

    const response = await this.post('/deletion/check', requestBody, {
      headers: {
        'Content-Type': 'application/vnd.sap.adt.deletion.check.request.v1+xml',
        'Accept': 'application/vnd.sap.adt.deletion.check.response.v1+xml, application/xml, */*'
      }
    });

    this.logger.debug(`Deletion check response: ${response.status}\n${response.raw}`);

    // Parse response to check for errors
    if (response.raw) {
      const parsed = parseXML(response.raw);
      
      // Check for error messages in the response
      const errorElements = this.findElements(parsed, 'error');
      if (errorElements.length > 0) {
        const errorRecord = errorElements[0] as Record<string, unknown>;
        const errorMessage = String(errorRecord['#text'] || errorRecord['message'] || 'Deletion check failed');
        throw new ADTError(
          `Cannot delete object: ${errorMessage}`,
          ErrorCodes.ADT_OPERATION_FAILED,
          undefined,
          { uri: fullUri }
        );
      }

      // Also check for deletion not allowed indicators
      const notAllowedElements = this.findElements(parsed, 'notAllowed');
      if (notAllowedElements.length > 0) {
        throw new ADTError(
          'Object deletion is not allowed',
          ErrorCodes.ADT_OPERATION_FAILED,
          undefined,
          { uri: fullUri }
        );
      }
    }
  }

  /**
   * Execute object deletion using ADT Deletion API
   * 
   * Request:
   *   POST /sap/bc/adt/deletion/delete
   *   Content-Type: application/vnd.sap.adt.deletion.request.v1+xml
   *   Accept: application/vnd.sap.adt.deletion.response.v1+xml
   *   Body: <del:deletionRequest><del:object adtcore:uri="..."><del:transportNumber>...</del:transportNumber></del:object></del:deletionRequest>
   * 
   * @param fullUri - Full object URI with /sap/bc/adt prefix
   * @param transportRequest - Optional transport request number (empty for $TMP objects)
   */
  private async deletionExecute(fullUri: string, transportRequest?: string): Promise<void> {
    // Transport number is empty for local $TMP objects
    const transportNumber = transportRequest || '';
    
    const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<del:deletionRequest xmlns:adtcore="http://www.sap.com/adt/core" xmlns:del="http://www.sap.com/adt/deletion">
  <del:object adtcore:uri="${fullUri}">
    <del:transportNumber>${transportNumber}</del:transportNumber>
  </del:object>
</del:deletionRequest>`;

    this.logger.debug(`Deletion execute request body:\n${requestBody}`);

    const response = await this.post('/deletion/delete', requestBody, {
      headers: {
        'Content-Type': 'application/vnd.sap.adt.deletion.request.v1+xml',
        'Accept': 'application/vnd.sap.adt.deletion.response.v1+xml, application/xml, */*'
      }
    });

    this.logger.debug(`Deletion execute response: ${response.status}\n${response.raw}`);

    // Parse response to check for errors
    if (response.raw) {
      const parsed = parseXML(response.raw);
      
      // Check for error messages
      const errorElements = this.findElements(parsed, 'error');
      if (errorElements.length > 0) {
        const errorRecord = errorElements[0] as Record<string, unknown>;
        const errorMessage = String(errorRecord['#text'] || errorRecord['message'] || 'Deletion failed');
        throw new ADTError(
          `Failed to delete object: ${errorMessage}`,
          ErrorCodes.ADT_OPERATION_FAILED,
          undefined,
          { uri: fullUri }
        );
      }

      // Check for failure status in deletionResponse
      const failedElements = this.findElements(parsed, 'failed');
      if (failedElements.length > 0) {
        throw new ADTError(
          'Object deletion failed',
          ErrorCodes.ADT_OPERATION_FAILED,
          undefined,
          { uri: fullUri }
        );
      }
    }
  }

  /**
   * Legacy delete method using lock/DELETE workflow
   * Kept for objects that require locking before deletion
   * 
   * @param objectUri - The object URI
   * @param transportRequest - Optional transport request number
   */
  async deleteObjectWithLock(objectUri: string, transportRequest?: string): Promise<void> {
    const normalizedUri = this.normalizeUri(objectUri);
    this.logger.adtOperation('deleteWithLock', undefined, normalizedUri);
    
    let lockHandle: LockHandle | undefined;
    
    try {
      // Step 1: Lock the object
      lockHandle = await this.lockObject(normalizedUri);
      this.logger.debug(`Object locked for deletion: ${normalizedUri}`);
      
      // Step 2: Send DELETE request with lock handle
      const params: Record<string, string> = {
        lockHandle: lockHandle.lockHandle
      };
      
      // Add transport request if provided
      if (transportRequest) {
        params.corrNr = transportRequest;
      }
      
      await this.delete(normalizedUri, { params });
      this.logger.info(`Object deleted successfully: ${normalizedUri}`);
      
      // Remove lock from cache (object no longer exists)
      this.activeLocks.delete(normalizedUri);
      
    } catch (error) {
      // If deletion fails, try to unlock the object
      if (lockHandle) {
        try {
          await this.unlockObject(normalizedUri, lockHandle.lockHandle);
          this.logger.debug(`Object unlocked after failed deletion: ${normalizedUri}`);
        } catch (unlockError) {
          this.logger.warn(`Failed to unlock object after deletion error: ${normalizedUri}`, unlockError);
        }
      }
      throw error;
    }
  }

  /**
   * Release all active locks
   */
  async releaseAllLocks(): Promise<void> {
    this.logger.info(`Releasing ${this.activeLocks.size} active locks`);

    const releases = Array.from(this.activeLocks.entries()).map(
      async ([uri, handle]) => {
        try {
          await this.unlockObject(uri, handle.lockHandle);
        } catch (error) {
          this.logger.warn(`Failed to release lock for ${uri}`, error);
        }
      }
    );

    await Promise.all(releases);
    this.activeLocks.clear();
  }

  // ============================================
  // Activation Operations
  // ============================================

  /**
   * Activate ADT object(s)
   * 
   * SAP ADT activation API requires:
   * 1. Full URI with /sap/bc/adt prefix in objectReference
   * 2. Object type in the format like DOMA/DD, DTEL/DE, TABL/DT, etc.
   * 3. Object name in uppercase
   * 
   * @param objectUris - Single URI or array of URIs (normalized, without /sap/bc/adt prefix)
   * @param options - Activation options
   */
  async activate(
    objectUris: string | string[],
    options?: { 
      preauditRequested?: boolean;
      objectTypes?: string | string[];  // Object types like DOMA/DD, DTEL/DE
    }
  ): Promise<{ success: boolean; messages: Array<{ type: string; message: string }> }> {
    const uris = Array.isArray(objectUris) ? objectUris : [objectUris];
    const types = options?.objectTypes 
      ? (Array.isArray(options.objectTypes) ? options.objectTypes : [options.objectTypes])
      : [];
    
    this.logger.adtOperation('activate', undefined, uris.join(', '));

    // Build activation request body
    // SAP ADT requires full URI with /sap/bc/adt prefix
    const entriesXml = uris
      .map((uri, index) => {
        const normalizedUri = this.normalizeUri(uri);
        const fullUri = `/sap/bc/adt${normalizedUri}`;
        const objectName = this.extractNameFromUri(normalizedUri).toUpperCase();
        const objectType = types[index] || this.inferObjectTypeFromUri(normalizedUri);
        
        return `  <adtcore:objectReference adtcore:uri="${fullUri}" adtcore:type="${objectType}" adtcore:name="${objectName}"/>`;
      })
      .join('\n');

    const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
${entriesXml}
</adtcore:objectReferences>`;

    this.logger.debug(`Activation request body:\n${requestBody}`);

    const response = await this.post('/activation', requestBody, {
      headers: {
        'Content-Type': 'application/xml'
      },
      params: {
        method: 'activate',
        preauditRequested: options?.preauditRequested !== false ? 'true' : 'false'
      }
    });

    // Parse activation response
    const messages: Array<{ type: string; message: string }> = [];
    let success = true;

    if (response.raw) {
      this.logger.debug(`Activation response:\n${response.raw}`);
      const parsed = parseXML(response.raw);
      
      // ADT returns messages in <msg> elements, not <message>
      // Format: <msg type="E" code="...">Error text</msg>
      // Also check for <chkl:msg> elements (with namespace prefix)
      const msgElements = this.findElements(parsed, 'msg');
      
      for (const msg of msgElements) {
        const msgRecord = msg as Record<string, unknown>;
        
        // Get message type: E=error, W=warning, I=info, S=success
        const msgType = String(msgRecord['@_type'] || 'I');
        const type = msgType === 'E' ? 'error' : msgType === 'W' ? 'warning' : msgType === 'S' ? 'success' : 'info';
        
        // Get message text - can be in #text, shortText/txt, or direct content
        let messageText = '';
        
        // Try #text first (direct text content)
        if (msgRecord['#text']) {
          messageText = String(msgRecord['#text']);
        }
        // Try shortText/txt structure (used in syntax check responses)
        else if (msgRecord['shortText']) {
          const shortText = msgRecord['shortText'] as Record<string, unknown>;
          const txt = shortText['txt'];
          if (txt && typeof txt === 'object' && '#text' in (txt as object)) {
            messageText = String((txt as Record<string, unknown>)['#text']);
          } else if (typeof txt === 'string') {
            messageText = txt;
          } else {
            messageText = String(txt || '');
          }
        }
        // Fallback to objDescr attribute or stringify the object
        else {
          messageText = String(msgRecord['@_objDescr'] || JSON.stringify(msg));
        }
        
        messages.push({ type, message: messageText });
        
        // Mark as failure if any error messages
        if (msgType === 'E') {
          success = false;
        }
      }
      
      // Also check for <message> elements (some ADT responses use this)
      const messageElements = this.findElements(parsed, 'message');
      for (const msg of messageElements) {
        const msgRecord = msg as Record<string, unknown>;
        const msgType = String(msgRecord['@_type'] || msgRecord['@_severity'] || 'I');
        const type = msgType === 'E' ? 'error' : msgType === 'W' ? 'warning' : msgType === 'S' ? 'success' : 'info';
        const text = String(msgRecord['#text'] || msgRecord['text'] || msg);
        messages.push({ type, message: text });
        if (msgType === 'E') {
          success = false;
        }
      }
    }

    return { success, messages };
  }

  /**
   * Check syntax of ADT object
   * 
   * SAP ADT uses POST to /activation endpoint with preauditRequested=true for syntax checking.
   * This performs a "preaudit" which checks syntax without actually activating the object.
   * 
   * Request format:
   *   POST /sap/bc/adt/activation?method=activate&preauditRequested=true
   *   Body: <adtcore:objectReferences><adtcore:objectReference adtcore:uri="..." adtcore:name="..."/></adtcore:objectReferences>
   * 
   * Response format:
   *   <chkl:messages><msg objDescr="..." type="E" line="1" href="...#start=line,col;end=line,col"><shortText><txt>Error text</txt></shortText></msg></chkl:messages>
   */
  async checkSyntax(objectUri: string): Promise<{
    hasErrors: boolean;
    messages: Array<{ line?: number; column?: number; type: string; message: string }>;
  }> {
    const normalizedUri = this.normalizeUri(objectUri);
    this.logger.adtOperation('checkSyntax', undefined, normalizedUri);

    // Build the activation request XML with preauditRequested=true
    // SAP ADT requires the full URI with /sap/bc/adt prefix in the objectReference
    const fullUri = `/sap/bc/adt${normalizedUri}`;
    const objectName = this.extractNameFromUri(normalizedUri).toUpperCase();
    
    const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:objectReference adtcore:uri="${fullUri}" adtcore:name="${objectName}"/>
</adtcore:objectReferences>`;

    this.logger.debug(`Check syntax request body:\n${requestBody}`);

    const response = await this.post('/activation', requestBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml, */*'
      },
      params: {
        'method': 'activate',
        'preauditRequested': 'true'
      }
    });

    this.logger.debug(`Check syntax response:\n${response.raw}`);

    const messages: Array<{ line?: number; column?: number; type: string; message: string }> = [];
    let hasErrors = false;

    if (response.raw) {
      const parsed = parseXML(response.raw);
      
      // Parse messages from response - handle multiple formats:
      // 1. <chkrun:checkMessage> elements (from checkruns API)
      // 2. <msg> elements (from activation API)
      
      // First, try to find checkMessage elements (checkruns API response format)
      // Format: <chkrun:checkMessage chkrun:uri="...#start=8,10;end=8,16" chkrun:type="E" chkrun:shortText="Error text" .../>
      const checkMessageElements = this.findElements(parsed, 'checkMessage');
      
      for (const checkMsg of checkMessageElements) {
        const msgRecord = checkMsg as Record<string, unknown>;
        
        // Get message type from chkrun:type or type attribute
        // E=error, W=warning, I=info
        const msgType = String(
          msgRecord['@_chkrun:type'] || 
          msgRecord['@_type'] || 
          'I'
        );
        const type = msgType === 'E' ? 'error' : msgType === 'W' ? 'warning' : 'info';
        
        // Get message text from chkrun:shortText or shortText attribute
        const messageText = String(
          msgRecord['@_chkrun:shortText'] || 
          msgRecord['@_shortText'] || 
          ''
        );
        
        // Parse line and column from chkrun:uri or uri attribute
        // Format: "/sap/bc/adt/.../source/main#start=8,10;end=8,16"
        let line: number | undefined;
        let column: number | undefined;
        
        const uri = String(
          msgRecord['@_chkrun:uri'] || 
          msgRecord['@_uri'] || 
          ''
        );
        const uriMatch = uri.match(/#start=(\d+),(\d+)/);
        if (uriMatch) {
          line = parseInt(uriMatch[1], 10);
          column = parseInt(uriMatch[2], 10);
        }
        
        if (messageText) {
          messages.push({
            line,
            column,
            type,
            message: messageText
          });
          
          if (type === 'error') {
            hasErrors = true;
          }
        }
      }
      
      // If no checkMessage elements found, try msg elements (activation API response format)
      // Format: <msg type="E" line="295" href="...#start=295,2;end=295,10"><shortText><txt>Error text</txt></shortText></msg>
      if (checkMessageElements.length === 0) {
        const messageElements = this.findElements(parsed, 'msg');
        
        for (const msg of messageElements) {
          const msgRecord = msg as Record<string, unknown>;
          
          // Get message type: E=error, W=warning, I=info
          const msgType = String(msgRecord['@_type'] || 'I');
          const type = msgType === 'E' ? 'error' : msgType === 'W' ? 'warning' : 'info';
          
          // Get line number from line attribute or parse from href
          let line: number | undefined;
          let column: number | undefined;
          
          // First try the line attribute
          if (msgRecord['@_line']) {
            line = parseInt(String(msgRecord['@_line']), 10);
          }
          
          // Also try to parse from href which contains more precise location
          // Format: href="...#start=295,2;end=295,10"
          const href = String(msgRecord['@_href'] || '');
          const hrefMatch = href.match(/#start=(\d+),(\d+)/);
          if (hrefMatch) {
            line = parseInt(hrefMatch[1], 10);
            column = parseInt(hrefMatch[2], 10);
          }
          
          // Get message text from shortText/txt element
          let messageText = '';
          const shortText = msgRecord['shortText'] as Record<string, unknown> | undefined;
          if (shortText) {
            const txt = shortText['txt'];
            if (txt && typeof txt === 'object' && '#text' in (txt as object)) {
              messageText = String((txt as Record<string, unknown>)['#text']);
            } else if (typeof txt === 'string') {
              messageText = txt;
            } else {
              messageText = String(txt || '');
            }
          }
          
          // Fallback: try direct text content or objDescr attribute
          if (!messageText) {
            messageText = String(msgRecord['#text'] || msgRecord['@_objDescr'] || msg);
          }
          
          messages.push({
            line,
            column,
            type,
            message: messageText
          });
          
          if (type === 'error') {
            hasErrors = true;
          }
        }
      }

      // Also check for inactiveObjects to see if there are errors preventing activation
      const inactiveObjects = this.findElements(parsed, 'inactiveObject');
      if (inactiveObjects.length > 0 && messages.length === 0) {
        // If there are inactive objects but no explicit error messages,
        // check if there are any link entries which indicate errors
        const linkEntries = this.findElements(parsed, 'link');
        for (const link of linkEntries) {
          const linkRecord = link as Record<string, unknown>;
          const rel = String(linkRecord['@_rel'] || '');
          if (rel.includes('error') || rel.includes('message')) {
            hasErrors = true;
            messages.push({
              type: 'error',
              message: 'Object has syntax errors and cannot be activated'
            });
            break;
          }
        }
      }
    }

    return { hasErrors, messages };
  }

  // ============================================
  // Search and Discovery
  // ============================================

  /**
   * Search for ADT objects
   */
  async searchObjects(
    query: string,
    options?: {
      objectType?: string;
      maxResults?: number;
      packageName?: string;
    }
  ): Promise<Array<{ uri: string; name: string; type: string; package?: string }>> {
    this.logger.adtOperation('search', options?.objectType, query);

    const params: Record<string, string> = {
      operation: 'quickSearch',
      query: query
    };

    if (options?.objectType) {
      params.objectType = options.objectType;
    }
    if (options?.maxResults) {
      params.maxResults = options.maxResults.toString();
    }
    if (options?.packageName) {
      params.packageName = options.packageName;
    }

    const response = await this.get('/repository/informationsystem/search', { params });

    const results: Array<{ uri: string; name: string; type: string; package?: string }> = [];

    if (response.raw) {
      const parsed = parseXML(response.raw);
      const entries = this.findElements(parsed, 'objectReference');
      for (const entry of entries) {
        const entryRecord = entry as Record<string, unknown>;
        results.push({
          uri: String(entryRecord['@_adtcore:uri'] || entryRecord['@_uri'] || ''),
          name: String(entryRecord['@_adtcore:name'] || entryRecord['@_name'] || ''),
          type: String(entryRecord['@_adtcore:type'] || entryRecord['@_type'] || ''),
          package: entryRecord['@_adtcore:packageName'] || entryRecord['@_packageName'] 
            ? String(entryRecord['@_adtcore:packageName'] || entryRecord['@_packageName'])
            : undefined
        });
      }
    }

    return results;
  }

  /**
   * Get object metadata
   * Uses a wildcard Accept header to handle different object types
   */
  async getObjectMetadata(objectUri: string): Promise<Record<string, unknown>> {
    const normalizedUri = this.normalizeUri(objectUri);
    
    // SAP ADT returns different content types for different objects
    // Use a wildcard Accept header to accept any XML format
    const response = await this.get(normalizedUri, {
      headers: { 
        'Accept': 'application/vnd.sap.adt.oo.classes.v4+xml, application/vnd.sap.adt.oo.interfaces.v4+xml, application/vnd.sap.adt.programs.programs.v2+xml, application/vnd.sap.adt.functions.v3+xml, application/xml, */*' 
      }
    });

    if (response.raw) {
      return parseXML(response.raw);
    }

    return {};
  }

  // ============================================
  // Transport Operations
  // ============================================

  /**
   * Get transport requests for user
   */
  async getTransportRequests(
    options?: { user?: string; requestTypes?: string[] }
  ): Promise<Array<{ number: string; description: string; owner: string; status: string }>> {
    this.logger.adtOperation('getTransports');

    const params: Record<string, string> = {};
    if (options?.user) {
      params.user = options.user;
    }
    if (options?.requestTypes) {
      params.requestTypes = options.requestTypes.join(',');
    }

    const response = await this.get('/cts/transportrequests', { params });

    const requests: Array<{ number: string; description: string; owner: string; status: string }> = [];

    if (response.raw) {
      const parsed = parseXML(response.raw);
      const entries = this.findElements(parsed, 'tm:request');
      for (const entry of entries) {
        const entryRecord = entry as Record<string, unknown>;
        requests.push({
          number: String(entryRecord['@_tm:number'] || entryRecord['@_number'] || ''),
          description: String(entryRecord['@_tm:desc'] || entryRecord['@_desc'] || ''),
          owner: String(entryRecord['@_tm:owner'] || entryRecord['@_owner'] || ''),
          status: String(entryRecord['@_tm:status'] || entryRecord['@_status'] || '')
        });
      }
    }

    return requests;
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Extract object name from URI
   */
  private extractNameFromUri(uri: string): string {
    const parts = uri.split('/');
    return parts[parts.length - 1] || uri;
  }

  /**
   * Find elements in parsed XML by tag name (handles namespaces)
   */
  private findElements(obj: unknown, tagName: string): unknown[] {
    const results: unknown[] = [];

    const search = (current: unknown): void => {
      if (!current || typeof current !== 'object') return;

      if (Array.isArray(current)) {
        for (const item of current) {
          search(item);
        }
        return;
      }

      const record = current as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        // Check if key matches tag name (with or without namespace prefix)
        if (key === tagName || key.endsWith(`:${tagName}`)) {
          const value = record[key];
          if (Array.isArray(value)) {
            results.push(...value);
          } else {
            results.push(value);
          }
        }
        // Recurse into nested objects
        search(record[key]);
      }
    };

    search(obj);
    return results;
  }

  /**
   * Update session cookies from response headers
   * Merges new cookies with existing ones, replacing cookies with the same name
   */
  private updateSessionCookies(setCookieHeader: string | string[]): void {
    const newCookies = Array.isArray(setCookieHeader) 
      ? setCookieHeader 
      : [setCookieHeader];
    
    // Parse existing cookies into a map
    const cookieMap = new Map<string, string>();
    
    if (this.sessionCookies) {
      // Parse existing cookies
      const existingCookies = this.sessionCookies.split('; ');
      for (const cookie of existingCookies) {
        const [name] = cookie.split('=');
        if (name) {
          cookieMap.set(name.trim(), cookie);
        }
      }
    }
    
    // Add/update with new cookies
    for (const setCookie of newCookies) {
      // Extract the cookie name=value part (before any attributes like Path, Expires, etc.)
      const cookiePart = setCookie.split(';')[0];
      if (cookiePart) {
        const [name] = cookiePart.split('=');
        if (name) {
          cookieMap.set(name.trim(), cookiePart.trim());
        }
      }
    }
    
    // Rebuild the cookie string
    this.sessionCookies = Array.from(cookieMap.values()).join('; ');
    this.logger.debug(`Session cookies updated: ${this.sessionCookies.substring(0, 100)}...`);
  }

  /**
   * Get connection info for logging/debugging
   */
  getConnectionInfo(): { host: string; client?: string; user: string } {
    return {
      host: this.config.connection.host,
      client: this.config.connection.client,
      user: this.config.connection.username
    };
  }

  /**
   * Generate a unique connection ID for correlating lock and update requests
   * Format similar to Eclipse ADT: 32 hex characters (UUID without dashes)
   */
  private generateConnectionId(): string {
    // Use crypto.randomUUID if available (Node.js 19+), otherwise generate manually
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID().replace(/-/g, '');
    }
    // Fallback: generate 32 random hex characters
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  /**
   * Set session type for subsequent requests
   * @param type 'stateful' for lock operations, 'stateless' for normal operations
   */
  setSessionType(type: 'stateful' | 'stateless'): void {
    this.sessionType = type;
    this.logger.debug(`Session type set to: ${type}`);
  }

  /**
   * Infer object type from URI for activation
   * Maps URI paths to ADT object types (e.g., DOMA/DD, DTEL/DE, TABL/DT)
   * 
   * @param uri - The object URI (normalized, without /sap/bc/adt prefix)
   * @returns The inferred object type
   */
  private inferObjectTypeFromUri(uri: string): string {
    // DDIC Domains: /ddic/domains/{name} -> DOMA/DD
    if (uri.includes('/ddic/domains/')) {
      return 'DOMA/DD';
    }
    
    // DDIC Data Elements: /ddic/dataelements/{name} -> DTEL/DE
    if (uri.includes('/ddic/dataelements/')) {
      return 'DTEL/DE';
    }
    
    // DDIC Tables: /ddic/tables/{name} -> TABL/DT
    if (uri.includes('/ddic/tables/')) {
      return 'TABL/DT';
    }
    
    // DDIC Structures: /ddic/structures/{name} -> STRU/I (or TABL/DS for append structures)
    if (uri.includes('/ddic/structures/')) {
      return 'STRU/I';
    }
    
    // DDIC Table Types: /ddic/tabletypes/{name} -> TTYP/DA
    if (uri.includes('/ddic/tabletypes/')) {
      return 'TTYP/DA';
    }
    
    // ABAP Classes: /oo/classes/{name} -> CLAS/OC
    if (uri.includes('/oo/classes/')) {
      return 'CLAS/OC';
    }
    
    // ABAP Interfaces: /oo/interfaces/{name} -> INTF/OI
    if (uri.includes('/oo/interfaces/')) {
      return 'INTF/OI';
    }
    
    // ABAP Programs/Reports: /programs/programs/{name} -> PROG/P
    if (uri.includes('/programs/programs/')) {
      return 'PROG/P';
    }
    
    // Include Programs: /programs/includes/{name} -> PROG/I
    if (uri.includes('/programs/includes/')) {
      return 'PROG/I';
    }
    
    // Function Groups: /functions/groups/{name} -> FUGR/F
    if (uri.includes('/functions/groups/')) {
      return 'FUGR/F';
    }
    
    // Function Modules: /functions/groups/{group}/fmodules/{name} -> FUGR/FF
    if (uri.includes('/fmodules/')) {
      return 'FUGR/FF';
    }
    
    // CDS Views: /ddls/sources/{name} -> DDLS/DF
    if (uri.includes('/ddls/sources/')) {
      return 'DDLS/DF';
    }
    
    // Service Definitions: /srvd/sources/{name} -> SRVD/SRV
    if (uri.includes('/srvd/sources/')) {
      return 'SRVD/SRV';
    }
    
    // Service Bindings: /srvb/sources/{name} -> SRVB/SVB
    if (uri.includes('/srvb/sources/')) {
      return 'SRVB/SVB';
    }
    
    // Default fallback - use generic type
    this.logger.warn(`Could not infer object type from URI: ${uri}, using default`);
    return 'UNKN/XX';
  }

  /**
   * Determine the appropriate Accept header based on object URI
   * Different ADT object types require different content types for lock operations
   * 
   * IMPORTANT: Lock operations for DDIC objects require 'application/vnd.sap.as+xml'
   * This is different from the content-type used for GET operations.
   * 
   * @param uri - The object URI (normalized, without /sap/bc/adt prefix)
   * @returns The appropriate Accept header value
   */
  private getAcceptHeaderForUri(uri: string): string {
    // DDIC objects (tables, structures, data elements, domains)
    // Lock operations require 'application/vnd.sap.as+xml' - tested and confirmed working
    if (uri.startsWith('/ddic/')) {
      // All DDIC object locks use the same Accept header
      return 'application/vnd.sap.as+xml';
    }
    
    // OO objects (classes, interfaces)
    if (uri.startsWith('/oo/')) {
      if (uri.includes('/classes/')) {
        return 'application/vnd.sap.adt.oo.classes.v4+xml, application/vnd.sap.adt.oo.classes.v2+xml, application/xml, */*';
      }
      if (uri.includes('/interfaces/')) {
        return 'application/vnd.sap.adt.oo.interfaces.v4+xml, application/vnd.sap.adt.oo.interfaces.v2+xml, application/xml, */*';
      }
    }
    
    // Programs (reports, includes)
    if (uri.startsWith('/programs/')) {
      return 'application/vnd.sap.adt.programs.programs.v2+xml, application/xml, */*';
    }
    
    // Function groups and function modules
    if (uri.startsWith('/functions/')) {
      return 'application/vnd.sap.adt.functions.v3+xml, application/vnd.sap.adt.functions.v2+xml, application/xml, */*';
    }
    
    // CDS views
    if (uri.startsWith('/ddls/')) {
      return 'application/vnd.sap.adt.ddls.v1+xml, application/xml, */*';
    }
    
    // Default fallback - accept multiple XML formats
    return 'application/vnd.sap.adt.repository.object.v1+xml, application/xml, application/atom+xml, */*';
  }
}

/**
 * Create ADT client from connection config
 */
export function createADTClient(
  connection: SAPConnectionConfig,
  options?: Partial<Omit<ADTClientConfig, 'connection'>>
): ADTClient {
  return new ADTClient({
    connection,
    ...options
  });
}

export default ADTClient;