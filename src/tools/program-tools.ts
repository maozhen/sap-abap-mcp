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
import { encodeObjectNameForUri, buildObjectUri, buildFunctionModuleUri } from '../utils/uri-helpers';

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

export interface DeleteObjectInput {
  name: string;
  objectType: 'CLAS' | 'INTF' | 'PROG' | 'FUGR' | 'FUNC';
  /** Required for FUNC type - the function group containing the function module */
  functionGroup?: string;
  transportRequest?: string;
}

/**
 * Where Used scope data structure
 * Contains configuration returned from the scope API call
 */
interface WhereUsedScopeData {
  objectIdentifier: {
    displayName: string;
    globalType: string;
  };
  grade: {
    definitions: boolean;
    elements: boolean;
    indirectReferences: boolean;
  };
  objectTypes: Array<{
    name: string;
    isDefault: boolean;
    isSelected: boolean;
  }>;
  payload: string;
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
  INCL: '/programs/includes',
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
   * 
   * SAP ADT requires a three-step process (based on ADT HTTP trace):
   * 1. POST to create the function module shell (no parameters in XML)
   * 2. GET source code to confirm creation (contains template text)
   * 3. PUT to /source/main to replace template text with parameter signature
   * 
   * Initial source code format after creation:
   * FUNCTION <function name>
   *  " You can use the template 'functionModuleParameter' to add here the signature!
   * .
   * 
   * ENDFUNCTION.
   */
  async createFunctionModule(args: CreateFunctionModuleInput): Promise<ToolResponse<FunctionModule>> {
    this.logger.info(`Creating function module: ${args.name}`);
    // POST to the fmodules collection within the function group
    // Use encodeObjectNameForUri to handle namespace objects (e.g., /SMB98/FUNC_GROUP)
    const uri = buildFunctionModuleUri(args.functionGroup);

    let lockHandle: LockHandle | undefined;
    const fmUri = buildFunctionModuleUri(args.functionGroup, args.name);
    const sourceUri = `${fmUri}/source/main`;

    try {
      // Step 1: POST to create the function module shell (no parameters in XML)
      // ADT only expects basic info: name, description, containerRef
      const requestXml = this.buildFunctionModuleShellXML(args);
      this.logger.debug(`Creating function module shell with XML:\n${requestXml}`);
      
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.functions.fmodules+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });
      this.logger.info(`Function module ${args.name} shell created`);

      // Check if we have parameters to set
      const hasParameters = (args.importParameters && args.importParameters.length > 0) ||
                           (args.exportParameters && args.exportParameters.length > 0) ||
                           (args.changingParameters && args.changingParameters.length > 0) ||
                           (args.tableParameters && args.tableParameters.length > 0) ||
                           (args.exceptions && args.exceptions.length > 0);

      if (hasParameters || args.sourceCode) {
        // Step 2: GET source code to confirm creation and get initial template
        this.logger.info(`Function module ${args.name} created, now getting initial source code`);
        const initialSource = await this.adtClient.getObjectSource(sourceUri);
        this.logger.debug(`Initial source code:\n${initialSource}`);

        // Step 3: Replace template text with parameter signature and update
        this.logger.info(`Updating source code with parameter signature`);

        // Lock the object
        lockHandle = await this.adtClient.lockObject(fmUri);
        this.logger.debug(`Function module locked: ${lockHandle.lockHandle}`);

        // Build new source code with parameter signature
        const newSourceCode = this.buildFunctionModuleSourceWithSignature(args, initialSource);
        this.logger.debug(`New source code with signature:\n${newSourceCode}`);

        // Update source code
        await this.adtClient.updateObjectSource(sourceUri, newSourceCode, lockHandle.lockHandle);
        this.logger.info(`Function module ${args.name} source code updated with parameters`);

        // Unlock the object
        await this.adtClient.unlockObject(fmUri, lockHandle.lockHandle);
        lockHandle = undefined;
      } else {
        this.logger.info(`Function module ${args.name} created (no parameters to set)`);
      }

      const functionModule = this.parseFunctionModuleResponse(response.raw || '', args);
      this.logger.info(`Function module ${args.name} created successfully`);
      return { success: true, data: functionModule };
    } catch (error) {
      // Ensure unlock on error
      if (lockHandle) {
        try {
          await this.adtClient.unlockObject(fmUri, lockHandle.lockHandle);
        } catch (unlockError) {
          this.logger.warn(`Failed to unlock function module after error: ${unlockError}`);
        }
      }
      this.logger.error(`Failed to create function module ${args.name}`, error);
      return this.createErrorResponse('CREATE_FUNC_FAILED', `Failed to create function module: ${error}`, error);
    }
  }

  /**
   * Build function module source code text
   * 
   * IMPORTANT: SAP ADT does NOT allow manual writing of parameter signature blocks
   * (the *" comment blocks). SAP generates these automatically based on the XML
   * metadata when the function module is created/activated.
   * 
   * Attempting to write parameter blocks results in error FUNC_ADT028:
   * "Parameter comment blocks are not allowed"
   * 
   * This method only generates:
   * - FUNCTION statement
   * - User-provided implementation code (if any)
   * - ENDFUNCTION statement
   */
  private buildFunctionModuleSourceCode(args: CreateFunctionModuleInput): string {
    const lines: string[] = [];
    
    // Function header
    lines.push(`FUNCTION ${args.name.toUpperCase()}.`);
    
    // Add user-provided source code if any
    if (args.sourceCode) {
      lines.push('');
      lines.push(args.sourceCode);
    }
    
    // Ensure there's a blank line before ENDFUNCTION for readability
    lines.push('');
    
    // Function end
    lines.push('ENDFUNCTION.');
    
    return lines.join('\n');
  }

  /**
   * Create a new report program
   * POST to collection URL: 
   * - For executable/modulePool/subroutinePool: /programs/programs
   * - For include: /programs/includes
   */
  async createReportProgram(args: CreateReportProgramInput): Promise<ToolResponse<ReportProgram>> {
    this.logger.info(`Creating report program: ${args.name} (type: ${args.programType})`);
    // POST to collection URL - use different URI for include programs
    const uri = args.programType === 'include' 
      ? PROGRAM_URI_PREFIXES.INCL 
      : PROGRAM_URI_PREFIXES.PROG;

    try {
      const requestXml = this.buildReportProgramXML(args);
      // Use different content type for include programs
      const contentType = args.programType === 'include'
        ? 'application/vnd.sap.adt.programs.includes.v2+xml'
        : 'application/vnd.sap.adt.programs.programs.v2+xml';
      
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': contentType },
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
  // Delete Operations
  // ==========================================================================

  /**
   * Delete an ABAP object (class, interface, program, function group, function module)
   * Uses the ADT delete flow: lock -> DELETE -> unlock (on failure)
   * 
   * For function modules (FUNC), the functionGroup parameter is required.
   * The URI format is: /functions/groups/{group}/fmodules/{name}
   */
  async deleteObject(args: DeleteObjectInput): Promise<ToolResponse<{ deleted: boolean; name: string; objectType: string }>> {
    this.logger.info(`Deleting object: ${args.name} (${args.objectType})`);

    // Special handling for function modules - requires function group
    if (args.objectType === 'FUNC') {
      if (!args.functionGroup) {
        this.logger.error('Function group is required for deleting function modules');
        return this.createErrorResponse(
          'MISSING_FUNCTION_GROUP',
          'Function group is required for deleting function modules (FUNC type)'
        );
      }

      // Build function module URI: /functions/groups/{group}/fmodules/{name}
      // Use encodeObjectNameForUri to handle namespace objects (e.g., /SMB98/FUNC_NAME)
      const uri = buildFunctionModuleUri(args.functionGroup, args.name);

      try {
        await this.adtClient.deleteObject(uri, args.transportRequest);
        this.logger.info(`Function module ${args.name} deleted successfully`);
        return {
          success: true,
          data: {
            deleted: true,
            name: args.name.toUpperCase(),
            objectType: args.objectType,
          },
        };
      } catch (error) {
        this.logger.error(`Failed to delete function module ${args.name}`, error);
        return this.createErrorResponse('DELETE_OBJECT_FAILED', `Failed to delete function module: ${error}`, error);
      }
    }

    // Get URI prefix for other object types
    const uriPrefix = PROGRAM_URI_PREFIXES[args.objectType];
    if (!uriPrefix) {
      this.logger.error(`Invalid object type: ${args.objectType}`);
      return this.createErrorResponse(
        'INVALID_OBJECT_TYPE',
        `Invalid object type: ${args.objectType}. Supported types: CLAS, INTF, PROG, FUGR, FUNC`
      );
    }

    // Build the object URI with proper encoding for namespace objects
    const uri = buildObjectUri(uriPrefix, args.name);

    try {
      // Use ADT client's deleteObject method (handles lock/delete/unlock)
      await this.adtClient.deleteObject(uri, args.transportRequest);

      this.logger.info(`Object ${args.name} deleted successfully`);
      return {
        success: true,
        data: {
          deleted: true,
          name: args.name.toUpperCase(),
          objectType: args.objectType,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to delete object ${args.name}`, error);
      return this.createErrorResponse('DELETE_OBJECT_FAILED', `Failed to delete object: ${error}`, error);
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
   * SAP ADT API uses a two-step process:
   * 1. POST to /usageReferences/scope to get scope configuration
   * 2. POST to /usageReferences with the scope to execute the query
   * 
   * The uri parameter must be passed as a query parameter
   */
  async whereUsed(args: WhereUsedInput): Promise<ToolResponse<WhereUsedResult>> {
    this.logger.info(`Finding where used: ${args.objectName}`);

    try {
      // Normalize the URI - ensure it starts with /sap/bc/adt
      let normalizedUri = args.objectUri;
      if (!normalizedUri.startsWith('/sap/bc/adt')) {
        normalizedUri = `/sap/bc/adt${normalizedUri.startsWith('/') ? '' : '/'}${normalizedUri}`;
      }

      // Step 1: Get scope configuration
      const scopeRequestXml = this.buildWhereUsedScopeRequestXML();
      this.logger.debug(`Where used scope request for URI: ${normalizedUri}`);
      
      const scopeResponse = await this.adtClient.post(
        '/repository/informationsystem/usageReferences/scope',
        scopeRequestXml,
        {
          params: { uri: normalizedUri },
          headers: {
            'Content-Type': 'application/vnd.sap.adt.repository.usagereferences.scope.request.v1+xml',
            'Accept': 'application/vnd.sap.adt.repository.usagereferences.scope.response.v1+xml',
          },
        }
      );

      // Parse scope response to get objectIdentifier, grade, objectTypes, and payload
      const scopeData = this.parseWhereUsedScopeResponse(scopeResponse.raw || '');
      this.logger.debug(`Scope data received: ${JSON.stringify(scopeData)}`);

      // Step 2: Execute where used query with scope
      const queryRequestXml = this.buildWhereUsedQueryRequestXML(scopeData);
      
      const response = await this.adtClient.post(
        '/repository/informationsystem/usageReferences',
        queryRequestXml,
        {
          params: { uri: normalizedUri },
          headers: {
            'Content-Type': 'application/vnd.sap.adt.repository.usagereferences.request.v1+xml',
            'Accept': 'application/vnd.sap.adt.repository.usagereferences.result.v1+xml',
          },
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

  /**
   * Build XML for function module shell creation (Step 1)
   * Based on ADT HTTP trace - only includes basic info: name, description, containerRef
   * NO parameters should be included in this XML
   * 
   * Example from ADT trace:
   * <?xml version="1.0" encoding="UTF-8"?>
   * <fmodule:abapFunctionModule xmlns:adtcore="http://www.sap.com/adt/core" 
   *   xmlns:fmodule="http://www.sap.com/adt/functions/fmodules" 
   *   adtcore:description="ZMCPTESET" adtcore:name="ZMCPTESET" adtcore:type="FUGR/FF">
   *   <adtcore:containerRef adtcore:name="ZTEST_MCP_FG" adtcore:type="FUGR/F" 
   *     adtcore:uri="/sap/bc/adt/functions/groups/ztest_mcp_fg"/>
   * </fmodule:abapFunctionModule>
   */
  private buildFunctionModuleShellXML(args: CreateFunctionModuleInput): string {
    const obj = {
      'fmodule:abapFunctionModule': {
        '@_xmlns:fmodule': 'http://www.sap.com/adt/functions/fmodules',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'FUGR/FF',
        'adtcore:containerRef': {
          '@_adtcore:name': args.functionGroup.toUpperCase(),
          '@_adtcore:type': 'FUGR/F',
          '@_adtcore:uri': `/sap/bc/adt/functions/groups/${args.functionGroup.toLowerCase()}`,
        },
      },
    };
    return buildXML(obj);
  }

  /**
   * Build function module source code with parameter signature (Step 3)
   * 
   * Generates source code in correct ABAP format:
   * FUNCTION Z_TEST_FM_PARAMS
   *   IMPORTING
   *     VALUE(IV_INPUT) TYPE STRING
   *   EXPORTING
   *     VALUE(EV_OUTPUT) TYPE STRING
   *   TABLES
   *     ET_RESULT STRUCTURE STRING_TABLE
   *   EXCEPTIONS
   *     INVALID_INPUT.
   * 
   * 
   * 
   * ENDFUNCTION.
   * 
   * NOTE: The signature ends with a period (.) directly after the last parameter/exception
   * 
   * @param args Function module creation input with parameters
   * @param initialSource Initial source code from SAP (ignored - we generate fresh)
   * @returns New source code with parameter signature
   */
  private buildFunctionModuleSourceWithSignature(args: CreateFunctionModuleInput, initialSource: string): string {
    // Build parameter signature lines
    const signatureLines: string[] = [];

    // IMPORTING parameters
    if (args.importParameters && args.importParameters.length > 0) {
      signatureLines.push('  IMPORTING');
      for (const param of args.importParameters) {
        let line = `    VALUE(${param.name.toUpperCase()}) TYPE ${param.typeName.toUpperCase()}`;
        if (param.defaultValue) {
          line += ` DEFAULT ${param.defaultValue}`;
        }
        if (param.isOptional && !param.defaultValue) {
          line += ' OPTIONAL';
        }
        signatureLines.push(line);
      }
    }

    // EXPORTING parameters
    if (args.exportParameters && args.exportParameters.length > 0) {
      signatureLines.push('  EXPORTING');
      for (const param of args.exportParameters) {
        signatureLines.push(`    VALUE(${param.name.toUpperCase()}) TYPE ${param.typeName.toUpperCase()}`);
      }
    }

    // CHANGING parameters
    if (args.changingParameters && args.changingParameters.length > 0) {
      signatureLines.push('  CHANGING');
      for (const param of args.changingParameters) {
        let line = `    VALUE(${param.name.toUpperCase()}) TYPE ${param.typeName.toUpperCase()}`;
        if (param.isOptional) {
          line += ' OPTIONAL';
        }
        signatureLines.push(line);
      }
    }

    // TABLES parameters
    // Format: ET_RESULT TYPE STRING_TABLE (or LIKE <structure>)
    if (args.tableParameters && args.tableParameters.length > 0) {
      signatureLines.push('  TABLES');
      for (const param of args.tableParameters) {
        let line = `    ${param.name.toUpperCase()} TYPE ${param.typeName.toUpperCase()}`;
        if (param.isOptional) {
          line += ' OPTIONAL';
        }
        signatureLines.push(line);
      }
    }

    // EXCEPTIONS
    if (args.exceptions && args.exceptions.length > 0) {
      signatureLines.push('  EXCEPTIONS');
      for (const exc of args.exceptions) {
        if (exc && exc.name) {
          signatureLines.push(`    ${exc.name.toUpperCase()}`);
        }
      }
    }

    // Build the new source code
    // Format: FUNCTION name\n  signature.\n\n\nENDFUNCTION.
    const lines: string[] = [];
    lines.push(`FUNCTION ${args.name.toUpperCase()}`);
    
    // Add parameter signature if any, with period at the end
    if (signatureLines.length > 0) {
      // Add all signature lines
      for (let i = 0; i < signatureLines.length; i++) {
        if (i === signatureLines.length - 1) {
          // Last line gets a period
          lines.push(signatureLines[i] + '.');
        } else {
          lines.push(signatureLines[i]);
        }
      }
    } else {
      // No parameters - just add period after FUNCTION name
      lines[0] = lines[0] + '.';
    }

    // Add user-provided source code if any
    if (args.sourceCode) {
      lines.push('');
      lines.push(args.sourceCode);
    }

    // Add blank lines and ENDFUNCTION (SAP standard format)
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('ENDFUNCTION.');

    return lines.join('\n');
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

    const exceptions = args.exceptions?.filter(e => e && e.name).map(e => ({
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
    // Include programs use a different XML structure
    if (args.programType === 'include') {
      return this.buildIncludeProgramXML(args);
    }

    const programTypeMap: Record<string, string> = {
      executable: '1',
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

  /**
   * Build XML for Include program creation
   * Include programs use namespace http://www.sap.com/adt/programs/includes
   * and type PROG/I
   */
  private buildIncludeProgramXML(args: CreateReportProgramInput): string {
    const obj = {
      'include:abapInclude': {
        '@_xmlns:include': 'http://www.sap.com/adt/programs/includes',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'PROG/I',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
      },
    };
    return buildXML(obj);
  }

  /**
   * Build XML for Where Used scope request
   * Based on SAP ADT HTTP trace - uses namespace http://www.sap.com/adt/ris/usageReferences
   */
  private buildWhereUsedScopeRequestXML(): string {
    const obj = {
      'usagereferences:usageScopeRequest': {
        '@_xmlns:usagereferences': 'http://www.sap.com/adt/ris/usageReferences',
        'usagereferences:affectedObjects': {},
      },
    };
    return buildXML(obj);
  }

  /**
   * Parse Where Used scope response to extract scope configuration
   */
  private parseWhereUsedScopeResponse(xml: string): WhereUsedScopeData {
    const defaultScope: WhereUsedScopeData = {
      objectIdentifier: { displayName: '', globalType: '' },
      grade: { definitions: true, elements: true, indirectReferences: true },
      objectTypes: [],
      payload: '',
    };

    if (!xml) return defaultScope;

    try {
      const parsed = parseXML<Record<string, unknown>>(xml);
      
      // Find objectIdentifier
      const objectIdentifiers = this.findElements(parsed, 'objectIdentifier');
      if (objectIdentifiers.length > 0) {
        const objId = objectIdentifiers[0] as Record<string, unknown>;
        defaultScope.objectIdentifier = {
          displayName: getAttribute(objId, 'displayName') || '',
          globalType: getAttribute(objId, 'globalType') || '',
        };
      }

      // Find grade
      const grades = this.findElements(parsed, 'grade');
      if (grades.length > 0) {
        const grade = grades[0] as Record<string, unknown>;
        defaultScope.grade = {
          definitions: getAttribute(grade, 'definitions') === 'true',
          elements: getAttribute(grade, 'elements') === 'true',
          indirectReferences: getAttribute(grade, 'indirectReferences') === 'true',
        };
      }

      // Find objectTypes
      const types = this.findElements(parsed, 'type');
      defaultScope.objectTypes = types.map(t => {
        const typeObj = t as Record<string, unknown>;
        return {
          name: getAttribute(typeObj, 'name') || '',
          isDefault: getAttribute(typeObj, 'isDefault') === 'true',
          isSelected: getAttribute(typeObj, 'isSelected') === 'true',
        };
      });

      // Find payload
      const payloads = this.findElements(parsed, 'payload');
      if (payloads.length > 0) {
        defaultScope.payload = String(payloads[0]) || '';
      }

    } catch (error) {
      this.logger.warn(`Failed to parse where used scope response: ${error}`);
    }

    return defaultScope;
  }

  /**
   * Build XML for Where Used query request with scope data
   * Based on SAP ADT HTTP trace
   */
  private buildWhereUsedQueryRequestXML(scopeData: WhereUsedScopeData): string {
    // Build objectTypes array
    const objectTypes = scopeData.objectTypes.map(t => ({
      '@_isDefault': t.isDefault,
      '@_isSelected': t.isSelected,
      '@_name': t.name,
    }));

    const obj = {
      'usagereferences:usageReferenceRequest': {
        '@_xmlns:usagereferences': 'http://www.sap.com/adt/ris/usageReferences',
        'usagereferences:affectedObjects': {},
        'usagereferences:scope': {
          '@_localUsage': 'false',
          'usagereferences:objectIdentifier': {
            '@_displayName': scopeData.objectIdentifier.displayName,
            '@_globalType': scopeData.objectIdentifier.globalType,
          },
          'usagereferences:grade': {
            '@_definitions': scopeData.grade.definitions,
            '@_elements': scopeData.grade.elements,
            '@_indirectReferences': scopeData.grade.indirectReferences,
          },
          'usagereferences:objectTypes': {
            'usagereferences:type': objectTypes.length > 0 ? objectTypes : [
              // Default types if none provided
              { '@_isDefault': true, '@_isSelected': true, '@_name': 'CLAS/OC' },
              { '@_isDefault': true, '@_isSelected': true, '@_name': 'INTF/OI' },
              { '@_isDefault': true, '@_isSelected': true, '@_name': 'PROG/P' },
              { '@_isDefault': true, '@_isSelected': true, '@_name': 'FUGR/F' },
              { '@_isDefault': true, '@_isSelected': true, '@_name': 'FUNC/F' },
            ],
          },
          ...(scopeData.payload && { 'usagereferences:payload': scopeData.payload }),
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
      
      // The API returns referencedObject elements, each containing an adtObject
      // Structure: referencedObjects/referencedObject/adtObject
      const referencedObjects = this.findElements(parsed, 'referencedObject');

      for (const refObj of referencedObjects) {
        if (typeof refObj === 'object' && refObj !== null) {
          const refRecord = refObj as Record<string, unknown>;
          
          // Get URI from referencedObject element
          const uri = getAttribute(refRecord, 'uri') || '';
          const usageInfo = getAttribute(refRecord, 'usageInformation') || 'reference';
          
          // Find the nested adtObject element which contains name and type
          const adtObjects = this.findElements(refRecord, 'adtObject');
          
          if (adtObjects.length > 0) {
            const adtObj = adtObjects[0] as Record<string, unknown>;
            const name = getAttribute(adtObj, 'name') || '';
            const type = getAttribute(adtObj, 'type') || 'PROG';
            
            // Extract the base object type (e.g., "DDLS/DF" -> "DDLS")
            const baseType = type.split('/')[0] as ADTObjectType;
            
            entries.push({
              objectName: name,
              objectType: baseType,
              uri: uri,
              usageType: usageInfo,
              line: undefined,
              column: undefined,
            });
          }
        }
      }
      
      this.logger.debug(`Parsed ${entries.length} where used entries from response`);
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