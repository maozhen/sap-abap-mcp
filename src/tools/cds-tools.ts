/**
 * CDS Tools Handler
 * Handles creation and management of CDS views, service definitions, and bindings
 */

import { ADTClient, LockHandle } from '../clients/adt-client';
import { encodeObjectNameForUri, buildObjectUri } from '../utils/uri-helpers';
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

export interface DeleteCDSObjectInput {
  name: string;
  objectType: 'DDLS' | 'DCLS' | 'DDLX' | 'SRVD' | 'SRVB';
  transportRequest?: string;
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
   * Uses two-step approach like Database Table:
   * 1. POST to collection URL to create basic CDS view (metadata only)
   * 2. Lock -> updateObjectSource -> unlock to set DDL source
   * 
   * Note: SAP ADT requires POST to collection URL (/ddic/ddl/sources), 
   * not object URL (/ddic/ddl/sources/{name})
   */
  async createCDSView(args: CreateCDSViewInput): Promise<ToolResponse<CDSView>> {
    this.logger.info(`Creating CDS view: ${args.name}`);
    // POST to collection URL, not object URL (same pattern as Domain/DataElement/Table)
    const collectionUri = CDS_URI_PREFIXES.DDLS;
    const objectUri = buildObjectUri(CDS_URI_PREFIXES.DDLS, args.name);

    try {
      // Step 1: Create basic CDS view (metadata only)
      const requestXml = this.buildCDSViewXML(args);
      this.logger.debug(`CDS view creation XML:\n${requestXml}`);
      
      await this.adtClient.post(collectionUri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.ddlSource+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });
      this.logger.info(`CDS view ${args.name} basic structure created`);

      // Step 2: If source code is provided, update it after creation
      if (args.sourceCode) {
        try {
          const lockHandle = await this.adtClient.lockObject(objectUri);
          this.logger.debug(`CDS view ${args.name} locked with handle: ${lockHandle.lockHandle}`);
          
          await this.adtClient.updateObjectSource(objectUri, args.sourceCode, lockHandle.lockHandle);
          this.logger.info(`CDS view ${args.name} source updated`);
          
          await this.adtClient.unlockObject(objectUri, lockHandle.lockHandle);
          this.logger.debug(`CDS view ${args.name} unlocked`);
        } catch (sourceError) {
          this.logger.warn(`CDS view created but failed to set source: ${sourceError}`);
        }
      }

      const cdsView = this.parseCDSViewResponse('', args);
      this.logger.info(`CDS view ${args.name} created successfully`);
      return { success: true, data: cdsView };
    } catch (error) {
      this.logger.error(`Failed to create CDS view ${args.name}`, error);
      return this.createErrorResponse('CREATE_CDS_FAILED', `Failed to create CDS view: ${error}`, error);
    }
  }

  /**
   * Create a new service definition
   * Uses two-step approach:
   * 1. POST to collection URL to create basic service definition (metadata only)
   * 2. Lock -> updateObjectSource -> unlock to set source
   * 
   * Note: SAP ADT requires POST to collection URL (/ddic/srvd/sources), 
   * not object URL (/ddic/srvd/sources/{name})
   */
  async createServiceDefinition(args: CreateServiceDefinitionInput): Promise<ToolResponse<ServiceDefinition>> {
    this.logger.info(`Creating service definition: ${args.name}`);
    // POST to collection URL, not object URL
    const collectionUri = CDS_URI_PREFIXES.SRVD;
    const objectUri = buildObjectUri(CDS_URI_PREFIXES.SRVD, args.name);

    try {
      // Step 1: Create basic service definition (metadata only)
      const requestXml = this.buildServiceDefinitionXML(args);
      this.logger.debug(`Service definition creation XML:\n${requestXml}`);
      
      await this.adtClient.post(collectionUri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.ddic.srvd.v1+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });
      this.logger.info(`Service definition ${args.name} basic structure created`);

      // Step 2: If source code is provided, update it after creation
      if (args.sourceCode) {
        try {
          const lockHandle = await this.adtClient.lockObject(objectUri);
          this.logger.debug(`Service definition ${args.name} locked with handle: ${lockHandle.lockHandle}`);
          
          await this.adtClient.updateObjectSource(objectUri, args.sourceCode, lockHandle.lockHandle);
          this.logger.info(`Service definition ${args.name} source updated`);
          
          await this.adtClient.unlockObject(objectUri, lockHandle.lockHandle);
          this.logger.debug(`Service definition ${args.name} unlocked`);
        } catch (sourceError) {
          this.logger.warn(`Service definition created but failed to set source: ${sourceError}`);
        }
      }

      const serviceDefinition = this.parseServiceDefinitionResponse('', args);
      this.logger.info(`Service definition ${args.name} created successfully`);
      return { success: true, data: serviceDefinition };
    } catch (error) {
      this.logger.error(`Failed to create service definition ${args.name}`, error);
      return this.createErrorResponse('CREATE_SRVD_FAILED', `Failed to create service definition: ${error}`, error);
    }
  }

  /**
   * Create a new service binding
   * Uses single-step approach:
   * POST to collection URL to create service binding
   * 
   * Note: SAP ADT requires POST to collection URL (/businessservices/bindings), 
   * not object URL (/businessservices/bindings/{name})
   */
  async createServiceBinding(args: CreateServiceBindingInput): Promise<ToolResponse<ServiceBinding>> {
    this.logger.info(`Creating service binding: ${args.name}`);
    // POST to collection URL, not object URL
    const collectionUri = CDS_URI_PREFIXES.SRVB;

    try {
      const requestXml = this.buildServiceBindingXML(args);
      this.logger.debug(`Service binding creation XML:\n${requestXml}`);
      
      await this.adtClient.post(collectionUri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.businessservices.servicebinding.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const serviceBinding = this.parseServiceBindingResponse('', args);
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
    const uri = buildObjectUri(CDS_URI_PREFIXES.DDLS, args.name);

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
    const uri = buildObjectUri(CDS_URI_PREFIXES.DDLS, args.name);

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
    const uri = buildObjectUri(CDS_URI_PREFIXES.DDLS, args.name);

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

      const uri = buildObjectUri(uriPrefix, args.name);
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

  // ==========================================================================
  // Delete Operations
  // ==========================================================================

  /**
   * Delete a CDS object (DDLS, DCLS, DDLX, SRVD, SRVB)
   * Uses ADT Deletion API which does NOT require locking.
   * This avoids CSRF token issues that can occur with lock-based deletion.
   * 
   * API Flow:
   * 1. POST /sap/bc/adt/deletion/check - Check if object can be deleted
   * 2. POST /sap/bc/adt/deletion/delete - Execute the deletion
   */
  async deleteCDSObject(args: DeleteCDSObjectInput): Promise<ToolResponse<void>> {
    this.logger.info(`Deleting CDS object: ${args.objectType}/${args.name}`);

    const uriPrefix = CDS_URI_PREFIXES[args.objectType];
    if (!uriPrefix) {
      return this.createErrorResponse('INVALID_OBJECT_TYPE', `Invalid CDS object type: ${args.objectType}`);
    }

    const uri = buildObjectUri(uriPrefix, args.name);

    try {
      // Use ADT Deletion API - no locking required
      // This method handles the full deletion workflow:
      // 1. Check if object can be deleted
      // 2. Execute the deletion
      await this.adtClient.deleteObject(uri, args.transportRequest);

      this.logger.info(`CDS object ${args.name} deleted successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete CDS object ${args.name}`, error);
      return this.createErrorResponse('DELETE_CDS_FAILED', `Failed to delete CDS object: ${error}`, error);
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
    const uri = buildObjectUri(CDS_URI_PREFIXES.SRVB, args.name);

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
    // SAP ADT expects namespace: http://www.sap.com/adt/ddic/ddlsources (plural, no slash)
    // Package must be passed as child element, not attribute (same as DDIC objects)
    // 
    // Based on comparison with working DDIC objects (Domain, DataElement, Table):
    // - Type code 'DDLS/DF' is required for CDS Data Definition (DDL Source)
    // - This follows the pattern: DTEL/DE, DOMA/DD, TABL/DT, etc.
    // - Without type code, SAP ADT returns "Check of condition failed" on packageRef
    const obj = {
      'ddlSource:ddlSource': {
        '@_xmlns:ddlSource': 'http://www.sap.com/adt/ddic/ddlsources',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:type': 'DDLS/DF',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        ...(args.sqlViewName && { '@_ddlSource:sqlViewName': args.sqlViewName }),
      },
    };
    return buildXML(obj);
  }

  private buildServiceDefinitionXML(args: CreateServiceDefinitionInput): string {
    // Based on analysis of existing SRVD objects (e.g., /AIF/MESSAGEMONITOR):
    // - Response Content-Type: application/vnd.sap.adt.ddic.srvd.v1+xml
    // - namespace prefix: srvd (not srvdSource)
    // - namespace URI: http://www.sap.com/adt/ddic/srvdsources
    // - Element name: srvd:srvdSource
    // - Required attributes from existing SRVD:
    //   srvd:sourceOrigin="0" (ABAP Development Tools)
    //   srvd:srvdSourceType="S" (Definition)
    // - exposedEntities should NOT be included in creation XML
    //   (entities are defined via source code, not XML attributes)
    // 
    // Note: The actual service content (expose statements) is set via updateObjectSource
    // using ABAP-style syntax like:
    //   @EndUserText.label: 'My Service'
    //   define service ZSRVD_NAME {
    //     expose Z_CDS_VIEW as Entity;
    //   }

    const obj = {
      'srvd:srvdSource': {
        '@_xmlns:srvd': 'http://www.sap.com/adt/ddic/srvdsources',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:type': 'SRVD/SRV',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:masterLanguage': 'EN',
        '@_srvd:sourceOrigin': '0',
        '@_srvd:srvdSourceType': 'S',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
      },
    };
    return buildXML(obj);
  }

  private buildServiceBindingXML(args: CreateServiceBindingInput): string {
    // SAP ADT expects namespace: http://www.sap.com/adt/ddic/ServiceBindings (CamelCase)
    // Package must be passed as child element, not attribute (same as DDIC objects)
    // 
    // Based on analysis of existing service bindings, the XML structure requires:
    // - srvb:services element with service definition reference
    // - srvb:binding element with type="ODATA", version="V2"/"V4", category="0"/"1"
    // - srvb:implementation element within binding
    //
    // Binding type mapping:
    // - ODATA_V2 -> type="ODATA", version="V2", category="0"
    // - ODATA_V4 -> type="ODATA", version="V4", category="0"
    // - ODATA_V2_UI -> type="ODATA", version="V2", category="1"
    // - ODATA_V4_UI -> type="ODATA", version="V4", category="1"
    
    const bindingConfig: Record<string, { version: string; category: string }> = {
      ODATA_V2: { version: 'V2', category: '0' },
      ODATA_V4: { version: 'V4', category: '0' },
      ODATA_V2_UI: { version: 'V2', category: '1' },
      ODATA_V4_UI: { version: 'V4', category: '1' },
    };
    
    const config = bindingConfig[args.bindingType] || { version: 'V4', category: '0' };
    const serviceDefName = args.serviceDefinition.toUpperCase();
    const bindingName = args.name.toUpperCase();

    const obj = {
      'srvb:serviceBinding': {
        '@_xmlns:srvb': 'http://www.sap.com/adt/ddic/ServiceBindings',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:type': 'SRVB/SVB',
        '@_adtcore:name': bindingName,
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'srvb:services': {
          '@_srvb:name': serviceDefName,
          'srvb:content': {
            '@_srvb:version': '0001',
            '@_srvb:releaseState': 'NOT_RELEASED',
            'srvb:serviceDefinition': {
              '@_adtcore:type': 'SRVD/SRV',
              '@_adtcore:name': serviceDefName,
            },
          },
        },
        'srvb:binding': {
          '@_srvb:type': 'ODATA',
          '@_srvb:version': config.version,
          '@_srvb:category': config.category,
          'srvb:implementation': {
            '@_adtcore:name': bindingName,
          },
        },
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