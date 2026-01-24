/**
 * Program Tools Handler
 * Handles creation and management of ABAP programs, classes, interfaces, and function modules
 */

import { ADTClient, LockHandle } from '../clients/adt-client';
import {
  ToolResponse,
  ABAPClass,
  ABAPInterface,
  FunctionGroup,
  FunctionModule,
  ReportProgram,
  ADTObject,
  ADTObjectType,
  ActivationResult,
  SyntaxCheckResult,
  ObjectSearchResult,
  WhereUsedResult,
  WhereUsedEntry,
  CreateClassInput,
  MethodParameter,
  ClassAttribute,
  ClassMethod,
  InterfaceAttribute,
  InterfaceMethod,
  FunctionParameter,
  FunctionException,
} from '../types';
import { buildXML, parseXML, getAttribute, getElement, ensureArray } from '../utils/xml-parser';
import { Logger, logger as defaultLogger } from '../utils/logger';

// ============================================================================
// Input Interfaces
// ============================================================================

export interface CreateInterfaceInput {
  name: string;
  description: string;
  interfaces?: string[];
  packageName: string;
  transportRequest?: string;
}

export interface CreateFunctionGroupInput {
  name: string;
  description: string;
  packageName: string;
  transportRequest?: string;
}

export interface CreateFunctionModuleInput {
  name: string;
  functionGroup: string;
  description: string;
  importParameters?: Array<{
    name: string;
    typeName: string;
    isOptional?: boolean;
    defaultValue?: string;
    description?: string;
  }>;
  exportParameters?: Array<{
    name: string;
    typeName: string;
    description?: string;
  }>;
  changingParameters?: Array<{
    name: string;
    typeName: string;
    isOptional?: boolean;
    description?: string;
  }>;
  tableParameters?: Array<{
    name: string;
    typeName: string;
    isOptional?: boolean;
    description?: string;
  }>;
  exceptions?: Array<{
    name: string;
    description?: string;
  }>;
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

export interface CreateReportProgramInput {
  name: string;
  description: string;
  programType: 'executable' | 'include' | 'modulePool' | 'subroutinePool';
  fixedPointArithmetic?: boolean;
  unicodeCheck?: boolean;
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

export interface GetSourceCodeInput {
  objectUri: string;
}

export interface UpdateSourceCodeInput {
  objectUri: string;
  source: string;
  transportRequest?: string;
}

export interface CheckSyntaxInput {
  objectUri: string;
}

export interface ActivateObjectInput {
  objectUri: string | string[];
  preauditRequested?: boolean;
}

export interface SearchObjectsInput {
  query: string;
  objectType?: ADTObjectType | ADTObjectType[];
  packageName?: string;
  maxResults?: number;
}

export interface GetObjectMetadataInput {
  objectUri: string;
}

export interface WhereUsedInput {
  objectUri: string;
  objectName: string;
  objectType: ADTObjectType;
}

// ============================================================================
// URI Prefixes
// ============================================================================

const PROGRAM_URI_PREFIXES: Record<string, string> = {
  CLAS: '/oo/classes',
  INTF: '/oo/interfaces',
  FUGR: '/functions/groups',
  FUNC: '/functions',
  PROG: '/programs/programs',
};

// ============================================================================
// Program Tool Handler
// ============================================================================

export class ProgramToolHandler {
  private readonly adtClient: ADTClient;
  private readonly logger: Logger;

  constructor(adtClient: ADTClient, logger?: Logger) {
    this.adtClient = adtClient;
    this.logger = logger ?? defaultLogger.child({ module: 'program-tools' });
  }

  // ==========================================================================
  // Create Operations
  // ==========================================================================

  /**
   * Create a new ABAP class
   * POST to collection URL: /oo/classes (not /oo/classes/{name})
   */
  async createClass(args: CreateClassInput): Promise<ToolResponse<ABAPClass>> {
    this.logger.info(`Creating class: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = PROGRAM_URI_PREFIXES.CLAS;

    try {
      const requestXml = this.buildClassXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.oo.classes.v4+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const abapClass = this.parseClassResponse(response.raw || '', args);
      this.logger.info(`Class ${args.name} created successfully`);
      return { success: true, data: abapClass };
    } catch (error) {
      this.logger.error(`Failed to create class ${args.name}`, error);
      return this.createErrorResponse('CREATE_CLASS_FAILED', `Failed to create class: ${error}`, error);
    }
  }

  /**
   * Create a new ABAP interface
   * POST to collection URL: /oo/interfaces (not /oo/interfaces/{name})
   */
  async createInterface(args: CreateInterfaceInput): Promise<ToolResponse<ABAPInterface>> {
    this.logger.info(`Creating interface: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = PROGRAM_URI_PREFIXES.INTF;

    try {
      const requestXml = this.buildInterfaceXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.oo.interfaces.v4+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const abapInterface = this.parseInterfaceResponse(response.raw || '', args);
      this.logger.info(`Interface ${args.name} created successfully`);
      return { success: true, data: abapInterface };
    } catch (error) {
      this.logger.error(`Failed to create interface ${args.name}`, error);
      return this.createErrorResponse('CREATE_INTF_FAILED', `Failed to create interface: ${error}`, error);
    }
  }

  /**
   * Create a new function group
   * POST to collection URL: /functions/groups (not /functions/groups/{name})
   */
  async createFunctionGroup(args: CreateFunctionGroupInput): Promise<ToolResponse<FunctionGroup>> {
    this.logger.info(`Creating function group: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = PROGRAM_URI_PREFIXES.FUGR;

    try {
      const requestXml = this.buildFunctionGroupXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.functions.groups.v3+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const functionGroup = this.parseFunctionGroupResponse(response.raw || '', args);
      this.logger.info(`Function group ${args.name} created successfully`);
      return { success: true, data: functionGroup };
    } catch (error) {
      this.logger.error(`Failed to create function group ${args.name}`, error);
      return this.createErrorResponse('CREATE_FUGR_FAILED', `Failed to create function group: ${error}`, error);
    }
  }

  /**
   * Create a new function module
   * POST to collection URL: /functions/groups/{group}/fmodules
   */
  async createFunctionModule(args: CreateFunctionModuleInput): Promise<ToolResponse<FunctionModule>> {
    this.logger.info(`Creating function module: ${args.name}`);
    // POST to the fmodules collection within the function group
    const uri = `/functions/groups/${args.functionGroup.toLowerCase()}/fmodules`;

    try {
      const requestXml = this.buildFunctionModuleXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.functions.v3+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const functionModule = this.parseFunctionModuleResponse(response.raw || '', args);
      this.logger.info(`Function module ${args.name} created successfully`);
      return { success: true, data: functionModule };
    } catch (error) {
      this.logger.error(`Failed to create function module ${args.name}`, error);
      return this.createErrorResponse('CREATE_FUNC_FAILED', `Failed to create function module: ${error}`, error);
    }
  }

  /**
   * Create a new report program
   * POST to collection URL: /programs/programs (not /programs/programs/{name})
   */
  async createReportProgram(args: CreateReportProgramInput): Promise<ToolResponse<ReportProgram>> {
    this.logger.info(`Creating report program: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = PROGRAM_URI_PREFIXES.PROG;

    try {
      const requestXml = this.buildReportProgramXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.programs.programs.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const reportProgram = this.parseReportProgramResponse(response.raw || '', args);
      this.logger.info(`Report program ${args.name} created successfully`);
      return { success: true, data: reportProgram };
    } catch (error) {
      this.logger.error(`Failed to create report program ${args.name}`, error);
      return this.createErrorResponse('CREATE_PROG_FAILED', `Failed to create report program: ${error}`, error);
    }
  }

  // ==========================================================================
  // Source Code Operations
  // ==========================================================================

  /**
   * Get source code of an object
   */
  async getSourceCode(args: GetSourceCodeInput): Promise<ToolResponse<string>> {
    this.logger.info(`Getting source code: ${args.objectUri}`);

    try {
      const source = await this.adtClient.getObjectSource(args.objectUri);
      this.logger.info(`Source code retrieved successfully for ${args.objectUri}`);
      return { success: true, data: source };
    } catch (error) {
      this.logger.error(`Failed to get source code for ${args.objectUri}`, error);
      return this.createErrorResponse('GET_SOURCE_FAILED', `Failed to get source code: ${error}`, error);
    }
  }

  /**
   * Update source code of an object
   */
  async updateSourceCode(args: UpdateSourceCodeInput): Promise<ToolResponse<void>> {
    this.logger.info(`Updating source code: ${args.objectUri}`);

    let lockHandle: LockHandle | undefined;

    try {
      // Lock the object
      lockHandle = await this.adtClient.lockObject(args.objectUri);
      this.logger.debug(`Object locked: ${lockHandle.lockHandle}`);

      // Update source
      await this.adtClient.updateObjectSource(args.objectUri, args.source, lockHandle.lockHandle);

      // Unlock the object
      await this.adtClient.unlockObject(args.objectUri, lockHandle.lockHandle);
      lockHandle = undefined;

      this.logger.info(`Source code updated successfully for ${args.objectUri}`);
      return { success: true };
    } catch (error) {
      // Ensure unlock on error
      if (lockHandle) {
        try {
          await this.adtClient.unlockObject(args.objectUri, lockHandle.lockHandle);
        } catch (unlockError) {
          this.logger.warn(`Failed to unlock object after error: ${unlockError}`);
        }
      }
      this.logger.error(`Failed to update source code for ${args.objectUri}`, error);
      return this.createErrorResponse('UPDATE_SOURCE_FAILED', `Failed to update source code: ${error}`, error);
    }
  }

  // ==========================================================================
  // Validation Operations
  // ==========================================================================

  /**
   * Check syntax of an object
   */
  async checkSyntax(args: CheckSyntaxInput): Promise<ToolResponse<SyntaxCheckResult>> {
    this.logger.info(`Checking syntax: ${args.objectUri}`);

    try {
      const result = await this.adtClient.checkSyntax(args.objectUri);

      const syntaxResult: SyntaxCheckResult = {
        hasErrors: result.hasErrors,
        hasWarnings: result.messages.some(m => m.type === 'warning'),
        messages: result.messages.map(msg => ({
          severity: msg.type === 'error' ? 'error' : msg.type === 'warning' ? 'warning' : 'info',
          message: msg.message,
          line: msg.line,
          column: msg.column,
        })),
      };

      this.logger.info(`Syntax check completed for ${args.objectUri}: ${result.hasErrors ? 'errors found' : 'no errors'}`);
      return { success: true, data: syntaxResult };
    } catch (error) {
      this.logger.error(`Failed to check syntax for ${args.objectUri}`, error);
      return this.createErrorResponse('SYNTAX_CHECK_FAILED', `Failed to check syntax: ${error}`, error);
    }
  }

  /**
   * Activate object(s)
   */
  async activateObject(args: ActivateObjectInput): Promise<ToolResponse<ActivationResult>> {
    const uris = Array.isArray(args.objectUri) ? args.objectUri : [args.objectUri];
    this.logger.info(`Activating objects: ${uris.join(', ')}`);

    try {
      const result = await this.adtClient.activate(uris, { preauditRequested: args.preauditRequested });

      const activationResult: ActivationResult = {
        success: result.success,
        activated: result.success ? uris.map(u => this.extractNameFromUri(u)) : [],
        failed: result.success ? [] : uris.map(u => this.extractNameFromUri(u)),
        messages: result.messages.map(msg => ({
          objectName: '',
          objectType: '',
          severity: msg.type === 'E' || msg.type === 'error' ? 'error' : msg.type === 'W' || msg.type === 'warning' ? 'warning' : 'info',
          message: msg.message,
        })),
      };

      this.logger.info(`Activation ${result.success ? 'successful' : 'failed'}`);
      return {
        success: result.success,
        data: activationResult,
        warnings: activationResult.messages.filter(m => m.severity === 'warning').map(m => m.message),
      };
    } catch (error) {
      this.logger.error(`Failed to activate objects`, error);
      return this.createErrorResponse('ACTIVATION_FAILED', `Failed to activate objects: ${error}`, error);
    }
  }

  // ==========================================================================
  // Search Operations
  // ==========================================================================

  /**
   * Search for objects
   */
  async searchObjects(args: SearchObjectsInput): Promise<ToolResponse<ObjectSearchResult>> {
    this.logger.info(`Searching objects: ${args.query}`);

    try {
      const objectType = Array.isArray(args.objectType) ? args.objectType[0] : args.objectType;
      const results = await this.adtClient.searchObjects(args.query, {
        objectType,
        maxResults: args.maxResults,
        packageName: args.packageName,
      });

      const searchResult: ObjectSearchResult = {
        objects: results.map(r => ({
          name: r.name,
          type: r.type as ADTObjectType,
          uri: r.uri,
          packageName: r.package,
        })),
        totalCount: results.length,
        hasMore: args.maxResults ? results.length >= args.maxResults : false,
      };

      this.logger.info(`Search completed: ${results.length} results found`);
      return { success: true, data: searchResult };
    } catch (error) {
      this.logger.error(`Failed to search objects`, error);
      return this.createErrorResponse('SEARCH_FAILED', `Failed to search objects: ${error}`, error);
    }
  }

  /**
   * Get object metadata
   */
  async getObjectMetadata(args: GetObjectMetadataInput): Promise<ToolResponse<ADTObject>> {
    this.logger.info(`Getting object metadata: ${args.objectUri}`);

    try {
      const metadata = await this.adtClient.getObjectMetadata(args.objectUri);
      const root = Object.values(metadata)[0] as Record<string, unknown> | undefined;

      const adtObject: ADTObject = {
        name: root ? (getAttribute(root, 'name') || this.extractNameFromUri(args.objectUri)) : this.extractNameFromUri(args.objectUri),
        type: this.detectObjectType(args.objectUri),
        uri: args.objectUri,
        packageName: root ? getAttribute(root, 'packageRef') : undefined,
        description: root ? getAttribute(root, 'description') : undefined,
        responsible: root ? getAttribute(root, 'responsible') : undefined,
        createdAt: root ? getAttribute(root, 'createdAt') : undefined,
        changedAt: root ? getAttribute(root, 'changedAt') : undefined,
        changedBy: root ? getAttribute(root, 'changedBy') : undefined,
      };

      this.logger.info(`Object metadata retrieved for ${args.objectUri}`);
      return { success: true, data: adtObject };
    } catch (error) {
      this.logger.error(`Failed to get object metadata for ${args.objectUri}`, error);
      return this.createErrorResponse('GET_METADATA_FAILED', `Failed to get object metadata: ${error}`, error);
    }
  }

  /**
   * Find where an object is used
   * SAP ADT API requires the 'uri' query parameter with the full object URI
   */
  async whereUsed(args: WhereUsedInput): Promise<ToolResponse<WhereUsedResult>> {
    this.logger.info(`Finding where used: ${args.objectName}`);

    try {
      // Normalize the URI - ensure it starts with /sap/bc/adt
      let normalizedUri = args.objectUri;
      if (!normalizedUri.startsWith('/sap/bc/adt')) {
        normalizedUri = `/sap/bc/adt${normalizedUri.startsWith('/') ? '' : '/'}${normalizedUri}`;
      }

      // SAP ADT Where Used API requires 'uri' query parameter
      // The URI must be the full path including /sap/bc/adt prefix
      const response = await this.adtClient.post(
        '/repository/informationsystem/usageReferences',
        '', // Empty body - SAP ADT expects uri as query parameter
        {
          headers: { 
            'Accept': 'application/vnd.sap.adt.repository.usagereferences.result.v1+xml, application/xml, */*'
          },
          params: {
            uri: normalizedUri
          }
        }
      );

      const usages = this.parseWhereUsedResponse(response.raw || '');

      const result: WhereUsedResult = {
        objectName: args.objectName,
        objectType: args.objectType,
        usages,
      };

      this.logger.info(`Where used completed: ${usages.length} usages found`);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Failed to find where used for ${args.objectName}`, error);
      return this.createErrorResponse('WHERE_USED_FAILED', `Failed to find where used: ${error}`, error);
    }
  }

  // ==========================================================================
  // XML Building Methods
  // ==========================================================================

  private buildClassXML(args: CreateClassInput): string {
    const obj = {
      'class:abapClass': {
        '@_xmlns:class': 'http://www.sap.com/adt/oo/classes',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'CLAS/OC',
        '@_adtcore:masterLanguage': 'EN',
        '@_class:final': args.isFinal || false,
        '@_class:visibility': 'public',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'class:include': {
          '@_adtcore:name': 'CLAS/OC',
          '@_adtcore:type': 'CLAS/OC',
          '@_class:includeType': 'testclasses',
        },
        'class:superClassRef': args.superClass ? { '@_adtcore:name': args.superClass } : {},
        ...(args.interfaces && args.interfaces.length > 0 && {
          'class:interfaces': {
            'class:interface': args.interfaces.map(intf => ({ '@_adtcore:name': intf })),
          },
        }),
      },
    };
    return buildXML(obj);
  }

  private buildInterfaceXML(args: CreateInterfaceInput): string {
    const obj = {
      'intf:abapInterface': {
        '@_xmlns:intf': 'http://www.sap.com/adt/oo/interfaces',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'INTF/OI',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        ...(args.interfaces && args.interfaces.length > 0 && {
          'intf:interfaces': {
            'intf:interface': args.interfaces.map(intf => ({ '@_adtcore:name': intf })),
          },
        }),
      },
    };
    return buildXML(obj);
  }

  private buildFunctionGroupXML(args: CreateFunctionGroupInput): string {
    const obj = {
      'group:abapFunctionGroup': {
        '@_xmlns:group': 'http://www.sap.com/adt/functions/groups',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'FUGR/F',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
      },
    };
    return buildXML(obj);
  }

  private buildFunctionModuleXML(args: CreateFunctionModuleInput): string {
    // SAP ADT expects namespace 'fmodules' for function modules
    // The namespace URI is http://www.sap.com/adt/functions/fmodules
    const importParams = args.importParameters?.map(p => ({
      '@_fmodules:name': p.name.toUpperCase(),
      '@_fmodules:type': p.typeName,
      '@_fmodules:optional': p.isOptional || false,
      ...(p.defaultValue && { '@_fmodules:default': p.defaultValue }),
      ...(p.description && { '@_fmodules:description': p.description }),
    })) || [];

    const exportParams = args.exportParameters?.map(p => ({
      '@_fmodules:name': p.name.toUpperCase(),
      '@_fmodules:type': p.typeName,
      ...(p.description && { '@_fmodules:description': p.description }),
    })) || [];

    const changingParams = args.changingParameters?.map(p => ({
      '@_fmodules:name': p.name.toUpperCase(),
      '@_fmodules:type': p.typeName,
      '@_fmodules:optional': p.isOptional || false,
      ...(p.description && { '@_fmodules:description': p.description }),
    })) || [];

    const tableParams = args.tableParameters?.map(p => ({
      '@_fmodules:name': p.name.toUpperCase(),
      '@_fmodules:type': p.typeName,
      '@_fmodules:optional': p.isOptional || false,
      ...(p.description && { '@_fmodules:description': p.description }),
    })) || [];

    const exceptions = args.exceptions?.map(e => ({
      '@_fmodules:name': e.name.toUpperCase(),
      ...(e.description && { '@_fmodules:description': e.description }),
    })) || [];

    const obj = {
      'fmodules:abapFunctionModule': {
        '@_xmlns:fmodules': 'http://www.sap.com/adt/functions/fmodules',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        ...(importParams.length > 0 && { 'fmodules:importing': { 'fmodules:parameter': importParams } }),
        ...(exportParams.length > 0 && { 'fmodules:exporting': { 'fmodules:parameter': exportParams } }),
        ...(changingParams.length > 0 && { 'fmodules:changing': { 'fmodules:parameter': changingParams } }),
        ...(tableParams.length > 0 && { 'fmodules:tables': { 'fmodules:parameter': tableParams } }),
        ...(exceptions.length > 0 && { 'fmodules:exceptions': { 'fmodules:exception': exceptions } }),
      },
    };
    return buildXML(obj);
  }

  private buildReportProgramXML(args: CreateReportProgramInput): string {
    const programTypeMap: Record<string, string> = {
      executable: '1',
      include: 'I',
      modulePool: 'M',
      subroutinePool: 'S',
    };

    const obj = {
      'program:abapProgram': {
        '@_xmlns:program': 'http://www.sap.com/adt/programs/programs',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'PROG/P',
        '@_adtcore:masterLanguage': 'EN',
        '@_program:programType': programTypeMap[args.programType] || '1',
        '@_program:fixedPointArithmetic': args.fixedPointArithmetic !== false,
        '@_program:unicodeCheck': args.unicodeCheck !== false,
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
      },
    };
    return buildXML(obj);
  }

  private buildWhereUsedRequestXML(args: WhereUsedInput): string {
    const obj = {
      'usagereferences:usageReferenceRequest': {
        '@_xmlns:usagereferences': 'http://www.sap.com/adt/repository/informationsystem/usageReferences',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        'usagereferences:objectReference': {
          '@_adtcore:uri': args.objectUri,
          '@_adtcore:name': args.objectName.toUpperCase(),
          '@_adtcore:type': args.objectType,
        },
      },
    };
    return buildXML(obj);
  }

  // ==========================================================================
  // Response Parsing Methods
  // ==========================================================================

  private parseClassResponse(xml: string, input: CreateClassInput): ABAPClass {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      superClass: input.superClass,
      interfaces: input.interfaces,
      visibility: 'public',
      isFinal: input.isFinal,
      isAbstract: input.isAbstract,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseInterfaceResponse(xml: string, input: CreateInterfaceInput): ABAPInterface {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      interfaces: input.interfaces,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseFunctionGroupResponse(xml: string, input: CreateFunctionGroupInput): FunctionGroup {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseFunctionModuleResponse(xml: string, input: CreateFunctionModuleInput): FunctionModule {
    const importParams: FunctionParameter[] = input.importParameters?.map(p => ({
      name: p.name.toUpperCase(),
      typeName: p.typeName,
      isOptional: p.isOptional,
      defaultValue: p.defaultValue,
      description: p.description,
    })) || [];

    const exportParams: FunctionParameter[] = input.exportParameters?.map(p => ({
      name: p.name.toUpperCase(),
      typeName: p.typeName,
      description: p.description,
    })) || [];

    const changingParams: FunctionParameter[] = input.changingParameters?.map(p => ({
      name: p.name.toUpperCase(),
      typeName: p.typeName,
      isOptional: p.isOptional,
      description: p.description,
    })) || [];

    const tableParams: FunctionParameter[] = input.tableParameters?.map(p => ({
      name: p.name.toUpperCase(),
      typeName: p.typeName,
      isOptional: p.isOptional,
      description: p.description,
    })) || [];

    const exceptions: FunctionException[] = input.exceptions?.map(e => ({
      name: e.name.toUpperCase(),
      description: e.description,
    })) || [];

    return {
      name: input.name.toUpperCase(),
      functionGroup: input.functionGroup.toUpperCase(),
      description: input.description,
      importParameters: importParams,
      exportParameters: exportParams,
      changingParameters: changingParams,
      tableParameters: tableParams,
      exceptions,
      sourceCode: input.sourceCode,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseReportProgramResponse(xml: string, input: CreateReportProgramInput): ReportProgram {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      programType: input.programType,
      fixedPointArithmetic: input.fixedPointArithmetic !== false,
      unicodeCheck: input.unicodeCheck !== false,
      sourceCode: input.sourceCode,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseWhereUsedResponse(xml: string): WhereUsedEntry[] {
    const entries: WhereUsedEntry[] = [];

    if (!xml) return entries;

    try {
      const parsed = parseXML<Record<string, unknown>>(xml);
      const references = this.findElements(parsed, 'objectReference');

      for (const ref of references) {
        if (typeof ref === 'object' && ref !== null) {
          const refObj = ref as Record<string, unknown>;
          entries.push({
            objectName: (getAttribute(refObj, 'name') || '').toString(),
            objectType: (getAttribute(refObj, 'type') || 'PROG') as ADTObjectType,
            uri: (getAttribute(refObj, 'uri') || '').toString(),
            usageType: (getAttribute(refObj, 'usageType') || 'reference').toString(),
            line: getAttribute(refObj, 'line') ? parseInt(getAttribute(refObj, 'line') || '0', 10) : undefined,
            column: getAttribute(refObj, 'column') ? parseInt(getAttribute(refObj, 'column') || '0', 10) : undefined,
          });
        }
      }
    } catch (error) {
      this.logger.warn(`Failed to parse where used response: ${error}`);
    }

    return entries;
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  private extractNameFromUri(uri: string): string {
    const parts = uri.split('/');
    return parts[parts.length - 1] || uri;
  }

  private detectObjectType(uri: string): ADTObjectType {
    if (uri.includes('/oo/classes')) return 'CLAS';
    if (uri.includes('/oo/interfaces')) return 'INTF';
    if (uri.includes('/functions/groups')) return 'FUGR';
    if (uri.includes('/functions')) return 'FUNC';
    if (uri.includes('/programs')) return 'PROG';
    if (uri.includes('/ddic/dataelements')) return 'DTEL';
    if (uri.includes('/ddic/domains')) return 'DOMA';
    if (uri.includes('/ddic/tables')) return 'TABL';
    if (uri.includes('/ddic/structures')) return 'STRU';
    if (uri.includes('/ddic/tabletypes')) return 'TTYP';
    if (uri.includes('/ddls')) return 'DDLS';
    return 'PROG';
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

export default ProgramToolHandler;