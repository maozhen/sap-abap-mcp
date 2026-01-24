/**
 * Transport Tools Handler
 * Handles CTS (Change and Transport System) operations
 */

import { ADTClient } from '../clients/adt-client';
import {
  ToolResponse,
  TransportRequest,
  TransportTask,
  TransportObject,
} from '../types';
import { buildXML, parseXML } from '../utils/xml-parser';
import { Logger, logger as defaultLogger } from '../utils/logger';

// ============================================================================
// Input Interfaces
// ============================================================================

export interface GetTransportRequestsInput {
  /** Filter by user (default: current user) */
  user?: string;
  /** Filter by request types: 'K' (workbench), 'W' (customizing) */
  requestTypes?: ('K' | 'W')[];
  /** Filter by status: 'D' (modifiable), 'R' (released), 'O' (locked) */
  status?: ('D' | 'R' | 'O')[];
  /** Target system filter */
  targetSystem?: string;
  /** Maximum results to return */
  maxResults?: number;
}

export interface CreateTransportRequestInput {
  /** Transport request description */
  description: string;
  /** Request type: 'workbench' or 'customizing' */
  type: 'workbench' | 'customizing';
  /** Target system */
  targetSystem?: string;
  /** Package to associate with */
  packageName?: string;
}

export interface ReleaseTransportRequestInput {
  /** Transport request number (e.g., 'DEVK900001') */
  requestNumber: string;
  /** Release tasks first if present */
  releaseTasks?: boolean;
}

export interface AddObjectToTransportInput {
  /** Transport request number */
  requestNumber: string;
  /** Object program ID (e.g., 'R3TR', 'LIMU') */
  pgmid: string;
  /** Object type (e.g., 'CLAS', 'TABL', 'PROG') */
  objectType: string;
  /** Object name */
  objectName: string;
  /** Task number (optional, uses default task if not specified) */
  taskNumber?: string;
}

export interface GetTransportContentsInput {
  /** Transport request number */
  requestNumber: string;
  /** Include task details */
  includeTasks?: boolean;
}

// ============================================================================
// Output Interfaces
// ============================================================================

export interface TransportRequestList {
  requests: TransportRequest[];
  totalCount: number;
}

export interface TransportCreationResult {
  requestNumber: string;
  taskNumber?: string;
  description: string;
  owner: string;
}

export interface TransportReleaseResult {
  requestNumber: string;
  released: boolean;
  releasedAt?: Date;
  releasedTasks?: string[];
  messages?: string[];
}

export interface AddObjectResult {
  requestNumber: string;
  taskNumber: string;
  object: TransportObject;
  added: boolean;
}

export interface TransportContents {
  request: TransportRequest;
  tasks: TransportTask[];
  totalObjects: number;
}

// ============================================================================
// Constants
// ============================================================================

const TRANSPORT_BASE_URI = '/cts/transportrequests';

// ============================================================================
// Transport Tool Handler Class
// ============================================================================

export class TransportToolHandler {
  private readonly adtClient: ADTClient;
  private readonly logger: Logger;

  constructor(adtClient: ADTClient, logger?: Logger) {
    this.adtClient = adtClient;
    this.logger = logger ?? defaultLogger.child({ module: 'transport-tools' });
  }

  /**
   * Get transport requests list
   * ADT URI: /sap/bc/adt/cts/transportrequests
   */
  async getTransportRequests(args: GetTransportRequestsInput = {}): Promise<ToolResponse<TransportRequestList>> {
    this.logger.info('Getting transport requests', { user: args.user, types: args.requestTypes });

    try {
      const params: Record<string, string> = {};
      
      if (args.user) {
        params.user = args.user;
      }
      if (args.requestTypes && args.requestTypes.length > 0) {
        params.requestTypes = args.requestTypes.join(',');
      }
      if (args.status && args.status.length > 0) {
        params.status = args.status.join(',');
      }
      if (args.targetSystem) {
        params.target = args.targetSystem;
      }
      if (args.maxResults) {
        params.maxResults = args.maxResults.toString();
      }

      const response = await this.adtClient.get(TRANSPORT_BASE_URI, { params });
      const requests = this.parseTransportRequestsResponse(response.raw || '');

      this.logger.info(`Retrieved ${requests.length} transport requests`);
      return {
        success: true,
        data: {
          requests,
          totalCount: requests.length,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get transport requests', error);
      return this.createErrorResponse('GET_TRANSPORTS_FAILED', `Failed to get transport requests: ${error}`, error);
    }
  }

  /**
   * Create a new transport request
   * ADT URI: POST /sap/bc/adt/cts/transportrequests
   */
  async createTransportRequest(args: CreateTransportRequestInput): Promise<ToolResponse<TransportCreationResult>> {
    this.logger.info(`Creating transport request: ${args.description}`);

    try {
      const requestXml = this.buildCreateTransportXML(args);
      
      const response = await this.adtClient.post(TRANSPORT_BASE_URI, requestXml, {
        headers: {
          'Content-Type': 'application/vnd.sap.adt.transportrequests.v1+xml',
        },
      });

      const result = this.parseTransportCreationResponse(response.raw || '', args);
      this.logger.info(`Transport request ${result.requestNumber} created successfully`);
      
      return { success: true, data: result };
    } catch (error) {
      this.logger.error('Failed to create transport request', error);
      return this.createErrorResponse('CREATE_TRANSPORT_FAILED', `Failed to create transport request: ${error}`, error);
    }
  }

  /**
   * Release a transport request
   * ADT URI: POST /sap/bc/adt/cts/transportrequests/{number}?_action=RELEASE
   */
  async releaseTransportRequest(args: ReleaseTransportRequestInput): Promise<ToolResponse<TransportReleaseResult>> {
    this.logger.info(`Releasing transport request: ${args.requestNumber}`);

    try {
      const releasedTasks: string[] = [];
      const messages: string[] = [];

      // If releaseTasks is true, first release all tasks
      if (args.releaseTasks) {
        const contentsResponse = await this.getTransportContents({ 
          requestNumber: args.requestNumber, 
          includeTasks: true 
        });
        
        if (contentsResponse.success && contentsResponse.data) {
          for (const task of contentsResponse.data.tasks) {
            if (task.status === 'modifiable') {
              try {
                await this.releaseTask(task.number);
                releasedTasks.push(task.number);
                this.logger.info(`Task ${task.number} released`);
              } catch (taskError) {
                messages.push(`Warning: Failed to release task ${task.number}: ${taskError}`);
                this.logger.warn(`Failed to release task ${task.number}`, taskError);
              }
            }
          }
        }
      }

      // Release the request
      const uri = `${TRANSPORT_BASE_URI}/${args.requestNumber}`;
      const response = await this.adtClient.post(`${uri}?_action=RELEASE`);

      const result: TransportReleaseResult = {
        requestNumber: args.requestNumber,
        released: true,
        releasedAt: new Date(),
        releasedTasks: releasedTasks.length > 0 ? releasedTasks : undefined,
        messages: messages.length > 0 ? messages : undefined,
      };

      // Check for errors in response
      if (response.raw) {
        const releaseMessages = this.parseReleaseMessages(response.raw);
        if (releaseMessages.length > 0) {
          result.messages = [...(result.messages || []), ...releaseMessages];
        }
      }

      this.logger.info(`Transport request ${args.requestNumber} released successfully`);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Failed to release transport request ${args.requestNumber}`, error);
      return this.createErrorResponse('RELEASE_TRANSPORT_FAILED', `Failed to release transport request: ${error}`, error);
    }
  }

  /**
   * Add an object to a transport request
   * ADT URI: POST /sap/bc/adt/cts/transportrequests/{number}/tasks/{task}/objects
   */
  async addObjectToTransport(args: AddObjectToTransportInput): Promise<ToolResponse<AddObjectResult>> {
    this.logger.info(`Adding object ${args.objectType}/${args.objectName} to transport ${args.requestNumber}`);

    try {
      // Get task number if not provided
      let taskNumber = args.taskNumber;
      if (!taskNumber) {
        const contentsResponse = await this.getTransportContents({ 
          requestNumber: args.requestNumber, 
          includeTasks: true 
        });
        
        if (contentsResponse.success && contentsResponse.data && contentsResponse.data.tasks.length > 0) {
          // Use the first modifiable task
          const modifiableTask = contentsResponse.data.tasks.find(t => t.status === 'modifiable');
          if (modifiableTask) {
            taskNumber = modifiableTask.number;
          } else {
            return this.createErrorResponse(
              'NO_MODIFIABLE_TASK',
              `No modifiable task found in transport request ${args.requestNumber}`
            );
          }
        } else {
          return this.createErrorResponse(
            'NO_TASKS_FOUND',
            `No tasks found in transport request ${args.requestNumber}`
          );
        }
      }

      const requestXml = this.buildAddObjectXML(args);
      const uri = `${TRANSPORT_BASE_URI}/${args.requestNumber}/tasks/${taskNumber}/objects`;
      
      await this.adtClient.post(uri, requestXml, {
        headers: {
          'Content-Type': 'application/vnd.sap.adt.transportrequests.v1+xml',
        },
      });

      const result: AddObjectResult = {
        requestNumber: args.requestNumber,
        taskNumber: taskNumber!,
        object: {
          pgmid: args.pgmid,
          objectType: args.objectType,
          objectName: args.objectName,
        },
        added: true,
      };

      this.logger.info(`Object ${args.objectName} added to transport ${args.requestNumber}`);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Failed to add object to transport ${args.requestNumber}`, error);
      return this.createErrorResponse('ADD_OBJECT_FAILED', `Failed to add object to transport: ${error}`, error);
    }
  }

  /**
   * Get transport request contents (tasks and objects)
   * ADT URI: GET /sap/bc/adt/cts/transportrequests/{number}
   */
  async getTransportContents(args: GetTransportContentsInput): Promise<ToolResponse<TransportContents>> {
    this.logger.info(`Getting contents of transport request: ${args.requestNumber}`);

    try {
      const uri = `${TRANSPORT_BASE_URI}/${args.requestNumber}`;
      const response = await this.adtClient.get(uri);
      
      const contents = this.parseTransportContentsResponse(response.raw || '', args.requestNumber);
      
      this.logger.info(`Retrieved contents for transport ${args.requestNumber}: ${contents.totalObjects} objects`);
      return { success: true, data: contents };
    } catch (error) {
      this.logger.error(`Failed to get transport contents for ${args.requestNumber}`, error);
      return this.createErrorResponse('GET_CONTENTS_FAILED', `Failed to get transport contents: ${error}`, error);
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Release a single task
   */
  private async releaseTask(taskNumber: string): Promise<void> {
    const uri = `${TRANSPORT_BASE_URI}/${taskNumber}`;
    await this.adtClient.post(`${uri}?_action=RELEASE`);
  }

  /**
   * Build XML for creating a transport request
   */
  private buildCreateTransportXML(args: CreateTransportRequestInput): string {
    const requestType = args.type === 'workbench' ? 'K' : 'W';
    
    const obj = {
      'tm:root': {
        '@_xmlns:tm': 'http://www.sap.com/cts/adt/tm',
        '@_tm:useraction': 'newrequest',
        'tm:request': {
          '@_tm:desc': args.description,
          '@_tm:type': requestType,
          ...(args.targetSystem && { '@_tm:target': args.targetSystem }),
          ...(args.packageName && { '@_tm:target_package': args.packageName }),
        },
      },
    };
    
    return buildXML(obj);
  }

  /**
   * Build XML for adding an object to transport
   */
  private buildAddObjectXML(args: AddObjectToTransportInput): string {
    const obj = {
      'tm:root': {
        '@_xmlns:tm': 'http://www.sap.com/cts/adt/tm',
        'tm:object': {
          '@_tm:pgmid': args.pgmid,
          '@_tm:type': args.objectType,
          '@_tm:name': args.objectName,
        },
      },
    };
    
    return buildXML(obj);
  }

  /**
   * Parse transport requests list response
   */
  private parseTransportRequestsResponse(xml: string): TransportRequest[] {
    if (!xml) return [];

    try {
      const parsed = parseXML<Record<string, unknown>>(xml);
      const requests: TransportRequest[] = [];
      
      const requestElements = this.findElements(parsed, 'request');
      
      for (const req of requestElements) {
        const reqObj = req as Record<string, unknown>;
        const request = this.parseTransportRequestElement(reqObj);
        if (request) {
          requests.push(request);
        }
      }
      
      return requests;
    } catch (error) {
      this.logger.warn('Failed to parse transport requests response', error);
      return [];
    }
  }

  /**
   * Parse a single transport request element
   */
  private parseTransportRequestElement(element: Record<string, unknown>): TransportRequest | null {
    const number = this.getAttr(element, 'number') || this.getAttr(element, 'tm:number');
    if (!number) return null;

    const statusCode = this.getAttr(element, 'status') || this.getAttr(element, 'tm:status') || 'D';
    const typeCode = this.getAttr(element, 'type') || this.getAttr(element, 'tm:type') || 'K';

    return {
      number,
      description: this.getAttr(element, 'desc') || this.getAttr(element, 'tm:desc') || '',
      owner: this.getAttr(element, 'owner') || this.getAttr(element, 'tm:owner') || '',
      status: this.mapStatus(statusCode),
      type: typeCode === 'W' ? 'customizing' : 'workbench',
      targetSystem: this.getAttr(element, 'target') || this.getAttr(element, 'tm:target'),
    };
  }

  /**
   * Parse transport creation response
   */
  private parseTransportCreationResponse(xml: string, input: CreateTransportRequestInput): TransportCreationResult {
    let requestNumber = '';
    let taskNumber: string | undefined;

    if (xml) {
      try {
        const parsed = parseXML<Record<string, unknown>>(xml);
        
        // Try to find request number in response
        const requestElements = this.findElements(parsed, 'request');
        if (requestElements.length > 0) {
          const req = requestElements[0] as Record<string, unknown>;
          requestNumber = this.getAttr(req, 'number') || this.getAttr(req, 'tm:number') || '';
        }
        
        // Try to find task number
        const taskElements = this.findElements(parsed, 'task');
        if (taskElements.length > 0) {
          const task = taskElements[0] as Record<string, unknown>;
          taskNumber = this.getAttr(task, 'number') || this.getAttr(task, 'tm:number');
        }
      } catch (error) {
        this.logger.warn('Failed to parse transport creation response', error);
      }
    }

    return {
      requestNumber,
      taskNumber,
      description: input.description,
      owner: '', // Will be current user
    };
  }

  /**
   * Parse transport contents response
   */
  private parseTransportContentsResponse(xml: string, requestNumber: string): TransportContents {
    const tasks: TransportTask[] = [];
    let totalObjects = 0;
    let request: TransportRequest = {
      number: requestNumber,
      description: '',
      owner: '',
      status: 'modifiable',
      type: 'workbench',
    };

    if (xml) {
      try {
        const parsed = parseXML<Record<string, unknown>>(xml);
        
        // Parse request info
        const requestElements = this.findElements(parsed, 'request');
        if (requestElements.length > 0) {
          const reqElement = requestElements[0] as Record<string, unknown>;
          const parsedRequest = this.parseTransportRequestElement(reqElement);
          if (parsedRequest) {
            request = parsedRequest;
          }
        }
        
        // Parse tasks
        const taskElements = this.findElements(parsed, 'task');
        for (const taskEl of taskElements) {
          const task = this.parseTaskElement(taskEl as Record<string, unknown>);
          if (task) {
            tasks.push(task);
            totalObjects += task.objects?.length || 0;
          }
        }
      } catch (error) {
        this.logger.warn('Failed to parse transport contents response', error);
      }
    }

    return {
      request,
      tasks,
      totalObjects,
    };
  }

  /**
   * Parse a single task element
   */
  private parseTaskElement(element: Record<string, unknown>): TransportTask | null {
    const number = this.getAttr(element, 'number') || this.getAttr(element, 'tm:number');
    if (!number) return null;

    const statusCode = this.getAttr(element, 'status') || this.getAttr(element, 'tm:status') || 'D';
    
    // Parse objects within task
    const objects: TransportObject[] = [];
    const objectElements = this.findElements(element, 'object');
    for (const objEl of objectElements) {
      const obj = objEl as Record<string, unknown>;
      objects.push({
        pgmid: this.getAttr(obj, 'pgmid') || this.getAttr(obj, 'tm:pgmid') || 'R3TR',
        objectType: this.getAttr(obj, 'type') || this.getAttr(obj, 'tm:type') || '',
        objectName: this.getAttr(obj, 'name') || this.getAttr(obj, 'tm:name') || '',
        lockFlag: this.getAttr(obj, 'lock') || this.getAttr(obj, 'tm:lock'),
      });
    }

    return {
      number,
      description: this.getAttr(element, 'desc') || this.getAttr(element, 'tm:desc') || '',
      owner: this.getAttr(element, 'owner') || this.getAttr(element, 'tm:owner') || '',
      status: statusCode === 'R' ? 'released' : 'modifiable',
      objects: objects.length > 0 ? objects : undefined,
    };
  }

  /**
   * Parse release messages from response
   */
  private parseReleaseMessages(xml: string): string[] {
    const messages: string[] = [];
    
    try {
      const parsed = parseXML<Record<string, unknown>>(xml);
      const msgElements = this.findElements(parsed, 'message');
      
      for (const msg of msgElements) {
        const msgObj = msg as Record<string, unknown>;
        const text = (msgObj['#text'] || msgObj['text'] || String(msg)) as string;
        if (text) {
          messages.push(text);
        }
      }
    } catch (error) {
      // Ignore parsing errors
    }
    
    return messages;
  }

  /**
   * Map status code to status string
   */
  private mapStatus(statusCode: string): 'modifiable' | 'released' | 'locked' {
    switch (statusCode.toUpperCase()) {
      case 'R': return 'released';
      case 'O': return 'locked';
      case 'D':
      default: return 'modifiable';
    }
  }

  /**
   * Get attribute value from element (handles namespaced attributes)
   */
  private getAttr(element: Record<string, unknown>, attrName: string): string | undefined {
    // Try with @ prefix
    let value = element[`@_${attrName}`] || element[`@_tm:${attrName}`];
    
    // Try direct property
    if (!value) {
      value = element[attrName] || element[`tm:${attrName}`];
    }
    
    return value ? String(value) : undefined;
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
        if (key === tagName || key.endsWith(`:${tagName}`) || key === `tm:${tagName}`) {
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
   * Create error response
   */
  private createErrorResponse<T>(code: string, message: string, error?: unknown): ToolResponse<T> {
    return {
      success: false,
      error: {
        code,
        message,
        details: error instanceof Error ? error.message : String(error),
        innerError: error instanceof Error ? error : undefined,
      },
    };
  }
}

export default TransportToolHandler;