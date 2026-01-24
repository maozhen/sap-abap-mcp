/**
 * CDS Tools Handler
 * Handles creation and management of CDS views, service definitions, and bindings
 */

import { ADTClient, LockHandle } from '../clients/adt-client';
import {
  ToolResponse,
  CDSView,
  CDSAssociation,
  CDSField,
  CDSParameter,
  CDSAnnotation,
  ServiceDefinition,
  ServiceBinding,
  ExposedEntity,
  ADTObject,
  ADTObjectType,
  ActivationResult,
  CreateCDSViewInput,
} from '../types';
import { buildXML, parseXML, getAttribute, getElement, ensureArray } from '../utils/xml-parser';
import { Logger, logger as defaultLogger } from '../utils/logger';

// ============================================================================
// Input Interfaces
// ============================================================================

export interface CreateServiceDefinitionInput {
  name: string;
  description: string;
  exposedEntities: Array<{
    entityName: string;
    alias?: string;
    repositoryName?: string;
  }>;
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

export interface CreateServiceBindingInput {
  name: string;
  description: string;
  serviceDefinition: string;
  bindingType: 'ODATA_V2' | 'ODATA_V4' | 'ODATA_V2_UI' | 'ODATA_V4_UI';
  packageName: string;
  transportRequest?: string;
}

export interface GetCDSViewInput {
  name: string;
}

export interface GetCDSSourceInput {
  name: string;
}

export interface UpdateCDSSourceInput {
  name: string;
  source: string;
  transportRequest?: string;
}

export interface ActivateCDSObjectInput {
  name: string;
  objectType: 'DDLS' | 'DCLS' | 'DDLX' | 'SRVD' | 'SRVB';
}

export interface GetServiceBindingUrlInput {
  name: string;
}

// ============================================================================
// URI Prefixes
// ============================================================================

const CDS_URI_PREFIXES: Record<string, string> = {
  DDLS: '/ddic/ddl/sources',
  DCLS: '/acm/dcl/sources',
  DDLX: '/ddic/ddlx/sources',
  SRVD: '/ddic/srvd/sources',
  SRVB: '/businessservices/bindings',
};

// ============================================================================
// CDS Tool Handler
// ============================================================================

export class CDSToolHandler {
  private readonly adtClient: ADTClient;
  private readonly logger: Logger;

  constructor(adtClient: ADTClient, logger?: Logger) {
    this.adtClient = adtClient;
    this.logger = logger ?? defaultLogger.child({ module: 'cds-tools' });
  }

  // ==========================================================================
  // Create Operations
  // ==========================================================================

  /**
   * Create a new CDS view
   */
  async createCDSView(args: CreateCDSViewInput): Promise<ToolResponse<CDSView>> {
    this.logger.info(`Creating CDS view: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.DDLS}/${args.name.toLowerCase()}`;

    try {
      const requestXml = this.buildCDSViewXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.ddic.ddl.sources.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      // If source code is provided, update it after creation
      if (args.sourceCode) {
        try {
          const lockHandle = await this.adtClient.lockObject(uri);
          await this.adtClient.updateObjectSource(uri, args.sourceCode, lockHandle.lockHandle);
          await this.adtClient.unlockObject(uri, lockHandle.lockHandle);
        } catch (sourceError) {
          this.logger.warn(`CDS view created but failed to set source: ${sourceError}`);
        }
      }

      const cdsView = this.parseCDSViewResponse(response.raw || '', args);
      this.logger.info(`CDS view ${args.name} created successfully`);
      return { success: true, data: cdsView };
    } catch (error) {
      this.logger.error(`Failed to create CDS view ${args.name}`, error);
      return this.createErrorResponse('CREATE_CDS_FAILED', `Failed to create CDS view: ${error}`, error);
    }
  }

  /**
   * Create a new service definition
   */
  async createServiceDefinition(args: CreateServiceDefinitionInput): Promise<ToolResponse<ServiceDefinition>> {
    this.logger.info(`Creating service definition: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.SRVD}/${args.name.toLowerCase()}`;

    try {
      const requestXml = this.buildServiceDefinitionXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.ddic.srvd.sources.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      // If source code is provided, update it after creation
      if (args.sourceCode) {
        try {
          const lockHandle = await this.adtClient.lockObject(uri);
          await this.adtClient.updateObjectSource(uri, args.sourceCode, lockHandle.lockHandle);
          await this.adtClient.unlockObject(uri, lockHandle.lockHandle);
        } catch (sourceError) {
          this.logger.warn(`Service definition created but failed to set source: ${sourceError}`);
        }
      }

      const serviceDefinition = this.parseServiceDefinitionResponse(response.raw || '', args);
      this.logger.info(`Service definition ${args.name} created successfully`);
      return { success: true, data: serviceDefinition };
    } catch (error) {
      this.logger.error(`Failed to create service definition ${args.name}`, error);
      return this.createErrorResponse('CREATE_SRVD_FAILED', `Failed to create service definition: ${error}`, error);
    }
  }

  /**
   * Create a new service binding
   */
  async createServiceBinding(args: CreateServiceBindingInput): Promise<ToolResponse<ServiceBinding>> {
    this.logger.info(`Creating service binding: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.SRVB}/${args.name.toLowerCase()}`;

    try {
      const requestXml = this.buildServiceBindingXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.businessservices.bindings.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const serviceBinding = this.parseServiceBindingResponse(response.raw || '', args);
      this.logger.info(`Service binding ${args.name} created successfully`);
      return { success: true, data: serviceBinding };
    } catch (error) {
      this.logger.error(`Failed to create service binding ${args.name}`, error);
      return this.createErrorResponse('CREATE_SRVB_FAILED', `Failed to create service binding: ${error}`, error);
    }
  }

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  /**
   * Get CDS view metadata and details
   */
  async getCDSView(args: GetCDSViewInput): Promise<ToolResponse<CDSView>> {
    this.logger.info(`Getting CDS view: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.DDLS}/${args.name.toLowerCase()}`;

    try {
      const response = await this.adtClient.getObject(uri);
      const parsed = parseXML<Record<string, unknown>>(response.data);

      // Get source code
      let sourceCode: string | undefined;
      try {
        sourceCode = await this.adtClient.getObjectSource(uri);
      } catch (sourceError) {
        this.logger.warn(`Failed to get CDS source: ${sourceError}`);
      }

      const cdsView = this.parseCDSViewFromXML(parsed, args.name, sourceCode);
      this.logger.info(`CDS view ${args.name} retrieved successfully`);
      return { success: true, data: cdsView };
    } catch (error) {
      this.logger.error(`Failed to get CDS view ${args.name}`, error);
      return this.createErrorResponse('GET_CDS_FAILED', `Failed to get CDS view: ${error}`, error);
    }
  }

  /**
   * Get CDS source code
   */
  async getCDSSource(args: GetCDSSourceInput): Promise<ToolResponse<string>> {
    this.logger.info(`Getting CDS source: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.DDLS}/${args.name.toLowerCase()}`;

    try {
      const source = await this.adtClient.getObjectSource(uri);
      this.logger.info(`CDS source retrieved successfully for ${args.name}`);
      return { success: true, data: source };
    } catch (error) {
      this.logger.error(`Failed to get CDS source for ${args.name}`, error);
      return this.createErrorResponse('GET_CDS_SOURCE_FAILED', `Failed to get CDS source: ${error}`, error);
    }
  }

  // ==========================================================================
  // Update Operations
  // ==========================================================================

  /**
   * Update CDS source code
   */
  async updateCDSSource(args: UpdateCDSSourceInput): Promise<ToolResponse<void>> {
    this.logger.info(`Updating CDS source: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.DDLS}/${args.name.toLowerCase()}`;

    let lockHandle: LockHandle | undefined;

    try {
      // Lock the object
      lockHandle = await this.adtClient.lockObject(uri);
      this.logger.debug(`CDS object locked: ${lockHandle.lockHandle}`);

      // Update source
      await this.adtClient.updateObjectSource(uri, args.source, lockHandle.lockHandle);

      // Unlock the object
      await this.adtClient.unlockObject(uri, lockHandle.lockHandle);
      lockHandle = undefined;

      this.logger.info(`CDS source updated successfully for ${args.name}`);
      return { success: true };
    } catch (error) {
      // Ensure unlock on error
      if (lockHandle) {
        try {
          await this.adtClient.unlockObject(uri, lockHandle.lockHandle);
        } catch (unlockError) {
          this.logger.warn(`Failed to unlock CDS object after error: ${unlockError}`);
        }
      }
      this.logger.error(`Failed to update CDS source for ${args.name}`, error);
      return this.createErrorResponse('UPDATE_CDS_SOURCE_FAILED', `Failed to update CDS source: ${error}`, error);
    }
  }

  // ==========================================================================
  // Activation Operations
  // ==========================================================================

  /**
   * Activate CDS object
   */
  async activateCDSObject(args: ActivateCDSObjectInput): Promise<ToolResponse<ActivationResult>> {
    this.logger.info(`Activating CDS object: ${args.objectType}/${args.name}`);

    try {
      const uriPrefix = CDS_URI_PREFIXES[args.objectType];
      if (!uriPrefix) {
        return this.createErrorResponse('INVALID_OBJECT_TYPE', `Invalid CDS object type: ${args.objectType}`);
      }

      const uri = `${uriPrefix}/${args.name.toLowerCase()}`;
      const result = await this.adtClient.activate(uri);

      const activationResult: ActivationResult = {
        success: result.success,
        activated: result.success ? [args.name] : [],
        failed: result.success ? [] : [args.name],
        messages: result.messages.map(msg => ({
          objectName: args.name,
          objectType: args.objectType,
          severity: msg.type === 'E' || msg.type === 'error' ? 'error' : msg.type === 'W' || msg.type === 'warning' ? 'warning' : 'info',
          message: msg.message,
        })),
      };

      this.logger.info(`CDS object ${args.name} activation ${result.success ? 'successful' : 'failed'}`);
      return {
        success: result.success,
        data: activationResult,
        warnings: activationResult.messages.filter(m => m.severity === 'warning').map(m => m.message),
      };
    } catch (error) {
      this.logger.error(`Failed to activate CDS object ${args.name}`, error);
      return this.createErrorResponse('ACTIVATE_CDS_FAILED', `Failed to activate CDS object: ${error}`, error);
    }
  }

  // ==========================================================================
  // Service Binding Operations
  // ==========================================================================

  /**
   * Get service binding URL
   */
  async getServiceBindingUrl(args: GetServiceBindingUrlInput): Promise<ToolResponse<{ serviceUrl: string; metadataUrl: string }>> {
    this.logger.info(`Getting service binding URL: ${args.name}`);
    const uri = `${CDS_URI_PREFIXES.SRVB}/${args.name.toLowerCase()}`;

    try {
      const response = await this.adtClient.getObject(uri);
      const parsed = parseXML<Record<string, unknown>>(response.data);

      // Extract service URL from response - skip XML declaration (keys starting with '?')
      const root = this.getXMLRootElement(parsed);
      const serviceUrl = root ? (getAttribute(root, 'serviceUrl') || '') : '';
      const metadataUrl = serviceUrl ? `${serviceUrl}/$metadata` : '';

      this.logger.info(`Service binding URL retrieved for ${args.name}`);
      return {
        success: true,
        data: { serviceUrl, metadataUrl },
      };
    } catch (error) {
      this.logger.error(`Failed to get service binding URL for ${args.name}`, error);
      return this.createErrorResponse('GET_SRVB_URL_FAILED', `Failed to get service binding URL: ${error}`, error);
    }
  }

  // ==========================================================================
  // XML Building Methods
  // ==========================================================================

  private buildCDSViewXML(args: CreateCDSViewInput): string {
    const obj = {
      'ddl:ddlSource': {
        '@_xmlns:ddl': 'http://www.sap.com/adt/ddic/ddl/sources',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:packageRef': args.packageName,
        ...(args.sqlViewName && { '@_ddl:sqlViewName': args.sqlViewName }),
      },
    };
    return buildXML(obj);
  }

  private buildServiceDefinitionXML(args: CreateServiceDefinitionInput): string {
    const exposedEntitiesXml = args.exposedEntities.map(entity => ({
      '@_srvd:entityName': entity.entityName,
      ...(entity.alias && { '@_srvd:alias': entity.alias }),
      ...(entity.repositoryName && { '@_srvd:repositoryName': entity.repositoryName }),
    }));

    const obj = {
      'srvd:srvdSource': {
        '@_xmlns:srvd': 'http://www.sap.com/adt/ddic/srvd/sources',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:packageRef': args.packageName,
        ...(exposedEntitiesXml.length > 0 && {
          'srvd:exposedEntities': {
            'srvd:entity': exposedEntitiesXml,
          },
        }),
      },
    };
    return buildXML(obj);
  }

  private buildServiceBindingXML(args: CreateServiceBindingInput): string {
    const bindingTypeMap: Record<string, string> = {
      ODATA_V2: 'ODATA_V2_UI',
      ODATA_V4: 'ODATA_V4_UI',
      ODATA_V2_UI: 'ODATA_V2_UI',
      ODATA_V4_UI: 'ODATA_V4_UI',
    };

    const obj = {
      'srvb:serviceBinding': {
        '@_xmlns:srvb': 'http://www.sap.com/adt/businessservices/bindings',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:packageRef': args.packageName,
        '@_srvb:serviceDefinition': args.serviceDefinition.toUpperCase(),
        '@_srvb:bindingType': bindingTypeMap[args.bindingType] || args.bindingType,
      },
    };
    return buildXML(obj);
  }

  // ==========================================================================
  // Response Parsing Methods
  // ==========================================================================

  private parseCDSViewResponse(xml: string, input: CreateCDSViewInput): CDSView {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      sqlViewName: input.sqlViewName,
      dataSource: '',
      sourceCode: input.sourceCode,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseServiceDefinitionResponse(xml: string, input: CreateServiceDefinitionInput): ServiceDefinition {
    const exposedEntities: ExposedEntity[] = input.exposedEntities.map(e => ({
      entityName: e.entityName,
      alias: e.alias,
      repositoryName: e.repositoryName,
    }));

    return {
      name: input.name.toUpperCase(),
      description: input.description,
      exposedEntities,
      sourceCode: input.sourceCode,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseServiceBindingResponse(xml: string, input: CreateServiceBindingInput): ServiceBinding {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      serviceDefinition: input.serviceDefinition.toUpperCase(),
      bindingType: input.bindingType,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseCDSViewFromXML(parsed: Record<string, unknown>, name: string, sourceCode?: string): CDSView {
    // Skip XML declaration (keys starting with '?') to get actual root element
    const root = this.getXMLRootElement(parsed);

    // Parse associations from XML if present
    const associations: CDSAssociation[] = [];
    const associationElements = this.findElements(parsed, 'association');
    for (const assoc of associationElements) {
      if (typeof assoc === 'object' && assoc !== null) {
        const assocObj = assoc as Record<string, unknown>;
        associations.push({
          name: getAttribute(assocObj, 'name') || '',
          targetEntity: getAttribute(assocObj, 'targetEntity') || '',
          cardinality: getAttribute(assocObj, 'cardinality') || '',
          onCondition: getAttribute(assocObj, 'onCondition') || '',
        });
      }
    }

    // Parse fields from XML if present
    const fields: CDSField[] = [];
    const fieldElements = this.findElements(parsed, 'field');
    for (const field of fieldElements) {
      if (typeof field === 'object' && field !== null) {
        const fieldObj = field as Record<string, unknown>;
        fields.push({
          name: getAttribute(fieldObj, 'name') || '',
          alias: getAttribute(fieldObj, 'alias'),
          expression: getAttribute(fieldObj, 'expression'),
        });
      }
    }

    // Parse parameters from XML if present
    const parameters: CDSParameter[] = [];
    const paramElements = this.findElements(parsed, 'parameter');
    for (const param of paramElements) {
      if (typeof param === 'object' && param !== null) {
        const paramObj = param as Record<string, unknown>;
        parameters.push({
          name: getAttribute(paramObj, 'name') || '',
          typeName: getAttribute(paramObj, 'type') || '',
          defaultValue: getAttribute(paramObj, 'defaultValue'),
        });
      }
    }

    return {
      name: root ? (getAttribute(root, 'name') || name.toUpperCase()) : name.toUpperCase(),
      description: root ? (getAttribute(root, 'description') || '') : '',
      sqlViewName: root ? getAttribute(root, 'sqlViewName') : undefined,
      dataSource: root ? (getAttribute(root, 'dataSource') || '') : '',
      associations: associations.length > 0 ? associations : undefined,
      fields: fields.length > 0 ? fields : undefined,
      parameters: parameters.length > 0 ? parameters : undefined,
      sourceCode,
      packageName: root ? (getAttribute(root, 'packageRef') || '') : '',
    };
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Get the actual XML root element, skipping XML declaration (keys starting with '?')
   */
  private getXMLRootElement(parsed: Record<string, unknown>): Record<string, unknown> | undefined {
    const rootKey = Object.keys(parsed).find(key => !key.startsWith('?'));
    return rootKey ? (parsed[rootKey] as Record<string, unknown>) : undefined;
  }

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
        if (key === tagName || key.endsWith(`:${tagName}`)) {
          const value = record[key];
          if (Array.isArray(value)) {
            results.push(...value);
          } else {
            results.push(value);
          }
        }
        search(record[key]);
      }
    };

    search(obj);
    return results;
  }

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

export default CDSToolHandler;