/**
 * Error Handling Utility for SAP ABAP MCP Server
 * Custom error classes and error handling utilities for ADT API operations
 */

/**
 * Base error class for SAP ABAP MCP Server
 */
export class MCPError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    code: string,
    details?: Record<string, unknown>,
    isRetryable = false
  ) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isRetryable = isRetryable;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for MCP response
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      isRetryable: this.isRetryable,
      stack: this.stack
    };
  }

  /**
   * Convert to MCP tool error response format
   */
  toMCPError(): { isError: true; content: Array<{ type: 'text'; text: string }> } {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: this.code,
            message: this.message,
            details: this.details,
            isRetryable: this.isRetryable
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Error codes for the MCP server
 */
export const ErrorCodes = {
  // Connection errors
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  CSRF_TOKEN_FAILED: 'CSRF_TOKEN_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // ADT API errors
  ADT_REQUEST_FAILED: 'ADT_REQUEST_FAILED',
  ADT_OPERATION_FAILED: 'ADT_OPERATION_FAILED',
  ADT_OBJECT_NOT_FOUND: 'ADT_OBJECT_NOT_FOUND',
  ADT_OBJECT_EXISTS: 'ADT_OBJECT_EXISTS',
  ADT_OBJECT_LOCKED: 'ADT_OBJECT_LOCKED',
  ADT_ACTIVATION_FAILED: 'ADT_ACTIVATION_FAILED',
  ADT_SYNTAX_ERROR: 'ADT_SYNTAX_ERROR',
  ADT_TRANSPORT_ERROR: 'ADT_TRANSPORT_ERROR',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_OBJECT_TYPE: 'INVALID_OBJECT_TYPE',
  INVALID_OBJECT_NAME: 'INVALID_OBJECT_NAME',

  // XML parsing errors
  XML_PARSE_ERROR: 'XML_PARSE_ERROR',
  XML_BUILD_ERROR: 'XML_BUILD_ERROR',
  INVALID_RESPONSE_FORMAT: 'INVALID_RESPONSE_FORMAT',

  // Tool errors
  TOOL_NOT_FOUND: 'TOOL_NOT_FOUND',
  TOOL_EXECUTION_FAILED: 'TOOL_EXECUTION_FAILED',

  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Connection error - thrown when unable to connect to SAP system
 */
export class ConnectionError extends MCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCodes.CONNECTION_FAILED, details, true);
    this.name = 'ConnectionError';
  }
}

/**
 * Authentication error - thrown when authentication fails
 */
export class AuthenticationError extends MCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCodes.AUTHENTICATION_FAILED, details, false);
    this.name = 'AuthenticationError';
  }
}

/**
 * CSRF token error - thrown when CSRF token fetch fails
 */
export class CSRFTokenError extends MCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCodes.CSRF_TOKEN_FAILED, details, true);
    this.name = 'CSRFTokenError';
  }
}

/**
 * ADT API error - thrown for ADT API failures
 */
export class ADTError extends MCPError {
  public readonly statusCode?: number;
  public readonly adtErrorType?: string;

  constructor(
    message: string,
    code: ErrorCode = ErrorCodes.ADT_REQUEST_FAILED,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    // Determine if retryable based on status code
    const isRetryable = statusCode !== undefined && (statusCode >= 500 || statusCode === 429);
    super(message, code, { ...details, statusCode }, isRetryable);
    this.name = 'ADTError';
    this.statusCode = statusCode;
  }

  static notFound(objectType: string, objectName: string): ADTError {
    return new ADTError(
      `${objectType} '${objectName}' not found`,
      ErrorCodes.ADT_OBJECT_NOT_FOUND,
      404,
      { objectType, objectName }
    );
  }

  static alreadyExists(objectType: string, objectName: string): ADTError {
    return new ADTError(
      `${objectType} '${objectName}' already exists`,
      ErrorCodes.ADT_OBJECT_EXISTS,
      409,
      { objectType, objectName }
    );
  }

  static locked(objectType: string, objectName: string, lockedBy?: string): ADTError {
    return new ADTError(
      `${objectType} '${objectName}' is locked${lockedBy ? ` by ${lockedBy}` : ''}`,
      ErrorCodes.ADT_OBJECT_LOCKED,
      423,
      { objectType, objectName, lockedBy }
    );
  }

  static activationFailed(objectName: string, errors: string[]): ADTError {
    return new ADTError(
      `Activation failed for '${objectName}'`,
      ErrorCodes.ADT_ACTIVATION_FAILED,
      undefined,
      { objectName, errors }
    );
  }

  static syntaxError(objectName: string, errors: Array<{ line?: number; message: string }>): ADTError {
    return new ADTError(
      `Syntax errors in '${objectName}'`,
      ErrorCodes.ADT_SYNTAX_ERROR,
      undefined,
      { objectName, errors }
    );
  }
}

/**
 * Validation error - thrown for input validation failures
 */
export class ValidationError extends MCPError {
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(message: string, field?: string, value?: unknown) {
    super(message, ErrorCodes.VALIDATION_ERROR, { field, value }, false);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }

  static missingField(field: string): ValidationError {
    return new ValidationError(`Missing required field: ${field}`, field);
  }

  static invalidValue(field: string, value: unknown, reason?: string): ValidationError {
    const msg = reason
      ? `Invalid value for '${field}': ${reason}`
      : `Invalid value for '${field}'`;
    return new ValidationError(msg, field, value);
  }

  static invalidObjectName(name: string, rules?: string): ValidationError {
    const msg = rules
      ? `Invalid object name '${name}': ${rules}`
      : `Invalid object name '${name}'. Must follow SAP naming conventions.`;
    return new ValidationError(msg, 'name', name);
  }
}

/**
 * XML parsing error - thrown when XML parsing fails
 */
export class XMLParseError extends MCPError {
  constructor(message: string, xmlContent?: string) {
    super(message, ErrorCodes.XML_PARSE_ERROR, { xmlContent: xmlContent?.substring(0, 500) }, false);
    this.name = 'XMLParseError';
  }
}

/**
 * Configuration error - thrown for configuration issues
 */
export class ConfigurationError extends MCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCodes.CONFIGURATION_ERROR, details, false);
    this.name = 'ConfigurationError';
  }
}

/**
 * Not implemented error - thrown for features not yet implemented
 */
export class NotImplementedError extends MCPError {
  constructor(feature: string) {
    super(`Feature not implemented: ${feature}`, ErrorCodes.NOT_IMPLEMENTED, { feature }, false);
    this.name = 'NotImplementedError';
  }
}

/**
 * Error handler utility functions
 */

/**
 * Check if error is an MCPError
 */
export function isMCPError(error: unknown): error is MCPError {
  return error instanceof MCPError;
}

/**
 * Wrap any error as an MCPError
 */
export function wrapError(error: unknown, defaultCode: ErrorCode = ErrorCodes.INTERNAL_ERROR): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  if (error instanceof Error) {
    return new MCPError(error.message, defaultCode, { originalError: error.name });
  }

  return new MCPError(String(error), defaultCode);
}

/**
 * Create error from HTTP response
 */
export function createErrorFromResponse(
  statusCode: number,
  statusText: string,
  body?: string | Record<string, unknown>
): MCPError {
  const details: Record<string, unknown> = {
    statusCode,
    statusText,
    body: typeof body === 'string' ? body.substring(0, 1000) : body
  };

  switch (statusCode) {
    case 401:
      return new AuthenticationError('Authentication required', details);
    case 403:
      return new AuthenticationError('Access forbidden', details);
    case 404:
      return new ADTError('Resource not found', ErrorCodes.ADT_OBJECT_NOT_FOUND, statusCode, details);
    case 409:
      return new ADTError('Resource conflict', ErrorCodes.ADT_OBJECT_EXISTS, statusCode, details);
    case 423:
      return new ADTError('Resource is locked', ErrorCodes.ADT_OBJECT_LOCKED, statusCode, details);
    case 429:
      return new MCPError('Rate limit exceeded', ErrorCodes.ADT_REQUEST_FAILED, details, true);
    default:
      if (statusCode >= 500) {
        return new MCPError(`Server error: ${statusText}`, ErrorCodes.ADT_REQUEST_FAILED, details, true);
      }
      return new MCPError(`Request failed: ${statusText}`, ErrorCodes.ADT_REQUEST_FAILED, details, false);
  }
}

/**
 * Parse error message from ADT XML response
 */
export function parseADTErrorMessage(xmlContent: string): string | undefined {
  // Try to extract error message from ADT XML response
  const messageMatch = xmlContent.match(/<message[^>]*>([^<]+)<\/message>/i);
  if (messageMatch) {
    return messageMatch[1];
  }

  const exceptionMatch = xmlContent.match(/<exception[^>]*text="([^"]+)"/i);
  if (exceptionMatch) {
    return exceptionMatch[1];
  }

  const errorTextMatch = xmlContent.match(/<error[^>]*>([^<]+)<\/error>/i);
  if (errorTextMatch) {
    return errorTextMatch[1];
  }

  return undefined;
}

/**
 * Safe error message extraction for logging
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return String(error);
}

/**
 * Format error for MCP tool response
 */
export function formatMCPToolError(error: unknown): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} {
  if (error instanceof MCPError) {
    return error.toMCPError();
  }

  const wrapped = wrapError(error);
  return wrapped.toMCPError();
}

/**
 * Assert condition or throw validation error
 */
export function assert(condition: unknown, message: string, field?: string): asserts condition {
  if (!condition) {
    throw new ValidationError(message, field);
  }
}

/**
 * Assert value is not null/undefined
 */
export function assertDefined<T>(
  value: T | null | undefined,
  name: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw ValidationError.missingField(name);
  }
}

/**
 * Validate SAP object name format
 * SAP naming rules: 
 * - Max 30 characters for most objects
 * - Only uppercase letters, numbers, underscores
 * - Must start with Z or Y (customer namespace) or match package prefix
 */
export function validateObjectName(
  name: string,
  options?: {
    maxLength?: number;
    allowLowercase?: boolean;
    requireCustomerNamespace?: boolean;
  }
): void {
  const {
    maxLength = 30,
    allowLowercase = false,
    requireCustomerNamespace = false
  } = options ?? {};

  if (!name || name.trim().length === 0) {
    throw ValidationError.missingField('name');
  }

  if (name.length > maxLength) {
    throw ValidationError.invalidObjectName(
      name,
      `Maximum length is ${maxLength} characters`
    );
  }

  const pattern = allowLowercase ? /^[A-Za-z_][A-Za-z0-9_]*$/ : /^[A-Z_][A-Z0-9_]*$/;
  if (!pattern.test(name)) {
    throw ValidationError.invalidObjectName(
      name,
      allowLowercase
        ? 'Must contain only letters, numbers, and underscores, starting with a letter or underscore'
        : 'Must contain only uppercase letters, numbers, and underscores, starting with a letter or underscore'
    );
  }

  if (requireCustomerNamespace && !/^[ZY]/.test(name.toUpperCase())) {
    throw ValidationError.invalidObjectName(
      name,
      'Must start with Z or Y (customer namespace)'
    );
  }
}

/**
 * Validate package name
 */
export function validatePackageName(packageName: string): void {
  validateObjectName(packageName, { maxLength: 30 });

  // Package names can be $TMP for local objects
  if (packageName !== '$TMP' && !/^[ZY$]/.test(packageName)) {
    throw ValidationError.invalidValue(
      'package',
      packageName,
      'Must start with Z, Y, or $ (for local objects like $TMP)'
    );
  }
}

export default {
  MCPError,
  ErrorCodes,
  ConnectionError,
  AuthenticationError,
  CSRFTokenError,
  ADTError,
  ValidationError,
  XMLParseError,
  ConfigurationError,
  NotImplementedError,
  isMCPError,
  wrapError,
  createErrorFromResponse,
  parseADTErrorMessage,
  getErrorMessage,
  formatMCPToolError,
  assert,
  assertDefined,
  validateObjectName,
  validatePackageName
};