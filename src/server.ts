/**
 * SAP ABAP MCP Server
 * Main server class that handles MCP protocol communication and tool execution
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ADTClient } from './clients/adt-client.js';
import { Logger, parseLogLevel } from './utils/logger.js';
import { MCPError, ADTError, wrapError, ErrorCodes } from './utils/errors.js';
import { encodeObjectNameForUri, encodeFunctionGroupForUri } from './utils/uri-helpers.js';
import { 
  SAPConnectionConfig, 
  MCPServerConfig,
  CreateDataElementInput,
  CreateDomainInput,
  CreateTableInput,
  CreateClassInput,
  CreateCDSViewInput,
  ExecuteQueryInput,
  RunUnitTestsInput
} from './types/index.js';

// Import Input types from tools
import {
  // DDIC types
  CreateStructureInput,
  CreateTableTypeInput,
  GetDDICObjectInput,
  ActivateDDICObjectInput,
  DeleteDDICObjectInput,
  // Program types
  CreateInterfaceInput,
  CreateFunctionGroupInput,
  CreateFunctionModuleInput,
  CreateReportProgramInput,
  GetSourceCodeInput,
  UpdateSourceCodeInput,
  CheckSyntaxInput,
  ActivateObjectInput,
  SearchObjectsInput,
  WhereUsedInput,
  GetObjectMetadataInput,
  DeleteObjectInput,
  // CDS types
  CreateServiceDefinitionInput,
  CreateServiceBindingInput,
  GetCDSViewInput,
  GetCDSSourceInput,
  UpdateCDSSourceInput,
  ActivateCDSObjectInput,
  GetServiceBindingUrlInput,
  // Testing types
  GetTestCoverageInput,
  GetTestResultsInput,
  AnalyzeTestClassInput,
  // System types
  GetSystemInfoInput,
  GetPackageInfoInput,
  CreatePackageInput,
  GetMessageClassInput,
  CreateMessageClassInput,
  GetNumberRangeInput,
  CreateNumberRangeInput,
  // Transport types
  GetTransportRequestsInput,
  CreateTransportRequestInput,
  ReleaseTransportRequestInput,
  AddObjectToTransportInput,
  GetTransportContentsInput
} from './tools/index.js';

// Tool handlers will be imported here
import { DDICToolHandler } from './tools/ddic-tools.js';
import { ProgramToolHandler } from './tools/program-tools.js';
import { CDSToolHandler } from './tools/cds-tools.js';
import { TestingToolHandler } from './tools/testing-tools.js';
import { SystemToolHandler } from './tools/system-tools.js';
import { TransportToolHandler } from './tools/transport-tools.js';

/**
 * Tool definition with handler
 */
interface ToolDefinition {
  tool: Tool;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * SAP ABAP MCP Server class
 * Manages MCP protocol communication and routes tool calls to appropriate handlers
 */
export class SAPABAPMCPServer {
  private server: Server;
  private adtClient: ADTClient;
  private logger: Logger;
  private tools: Map<string, ToolDefinition> = new Map();

  // Tool handlers
  private ddicHandler!: DDICToolHandler;
  private programHandler!: ProgramToolHandler;
  private cdsHandler!: CDSToolHandler;
  private testingHandler!: TestingToolHandler;
  private systemHandler!: SystemToolHandler;
  private transportHandler!: TransportToolHandler;

  constructor(
    private config: MCPServerConfig,
    private sapConfig: SAPConnectionConfig
  ) {
    this.logger = new Logger({ level: parseLogLevel(config.logLevel || 'info') });
    
    // Initialize ADT client
    this.adtClient = new ADTClient({ 
      connection: sapConfig, 
      logger: this.logger,
      timeout: config.timeout,
      retryAttempts: config.maxRetries
    });

    // Initialize MCP server
    this.server = new Server(
      {
        name: 'sap-abap-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize tool handlers
    this.initializeToolHandlers();

    // Register all tools
    this.registerTools();

    // Set up request handlers
    this.setupRequestHandlers();

    // Error handling
    this.server.onerror = (error) => {
      this.logger.error('MCP Server Error', error);
    };
  }

  /**
   * Initialize all tool handlers
   */
  private initializeToolHandlers(): void {
    this.ddicHandler = new DDICToolHandler(this.adtClient, this.logger);
    this.programHandler = new ProgramToolHandler(this.adtClient, this.logger);
    this.cdsHandler = new CDSToolHandler(this.adtClient, this.logger);
    this.testingHandler = new TestingToolHandler(this.adtClient, this.logger);
    this.systemHandler = new SystemToolHandler(this.adtClient, this.logger);
    this.transportHandler = new TransportToolHandler(this.adtClient, this.logger);
  }

  /**
   * Register all available tools
   */
  private registerTools(): void {
    // DDIC Tools (P0 - Core)
    this.registerDDICTools();

    // Program Tools (P0 - Core)
    this.registerProgramTools();

    // CDS/OData Tools (P0 - Core)
    this.registerCDSTools();

    // Testing Tools (P0 - Core)
    this.registerTestingTools();

    // System Tools (P0 - Core)
    this.registerSystemTools();

    // Transport Tools (P0 - Core)
    this.registerTransportTools();

    this.logger.info(`Registered ${this.tools.size} tools`);
  }

  /**
   * Register DDIC tools
   */
  private registerDDICTools(): void {
    // create_data_element
    this.tools.set('create_data_element', {
      tool: {
        name: 'create_data_element',
        description: 'Create a new ABAP Data Element in the Data Dictionary',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Data element name (e.g., ZMYFIELD)' },
            description: { type: 'string', description: 'Short description' },
            domain: { type: 'string', description: 'Reference domain name (optional)' },
            dataType: { type: 'string', description: 'Built-in data type if no domain (e.g., CHAR, NUMC, DEC)' },
            length: { type: 'number', description: 'Field length' },
            decimals: { type: 'number', description: 'Decimal places for numeric types' },
            fieldLabels: {
              type: 'object',
              properties: {
                short: { type: 'string', description: 'Short label (10 chars)' },
                medium: { type: 'string', description: 'Medium label (20 chars)' },
                long: { type: 'string', description: 'Long label (40 chars)' },
                heading: { type: 'string', description: 'Column heading (55 chars)' },
              },
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => this.ddicHandler.createDataElement(this.mapArgs<CreateDataElementInput>(args)),
    });

    // create_domain
    this.tools.set('create_domain', {
      tool: {
        name: 'create_domain',
        description: 'Create a new ABAP Domain in the Data Dictionary',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Domain name (e.g., ZMYDOMAIN)' },
            description: { type: 'string', description: 'Short description' },
            dataType: { type: 'string', description: 'Built-in ABAP type (CHAR, NUMC, DEC, DATS, TIMS, etc.)' },
            length: { type: 'number', description: 'Field length' },
            decimals: { type: 'number', description: 'Decimal places for numeric types' },
            outputLength: { type: 'number', description: 'Output length for display' },
            conversionExit: { type: 'string', description: 'Conversion exit name' },
            signFlag: { type: 'boolean', description: 'Allow negative values' },
            lowercase: { type: 'boolean', description: 'Allow lowercase input' },
            fixedValues: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  low: { type: 'string' },
                  high: { type: 'string' },
                  description: { type: 'string' },
                },
              },
              description: 'Fixed values/value range',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'dataType', 'length'],
        },
      },
      handler: (args) => this.ddicHandler.createDomain(this.mapArgs<CreateDomainInput>(args)),
    });

    // create_database_table
    this.tools.set('create_database_table', {
      tool: {
        name: 'create_database_table',
        description: 'Create a new transparent database table',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Table name (e.g., ZMYTABLE)' },
            description: { type: 'string', description: 'Short description' },
            deliveryClass: { type: 'string', enum: ['A', 'C', 'L', 'G', 'E', 'S', 'W'], description: 'Delivery class' },
            maintenanceFlag: { type: 'string', enum: ['X', ' '], description: 'Maintenance allowed' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Field name' },
                  dataElement: { type: 'string', description: 'Data element reference' },
                  isKey: { type: 'boolean', description: 'Key field flag' },
                  isNotNull: { type: 'boolean', description: 'Not null flag' },
                },
                required: ['name', 'dataElement'],
              },
              description: 'Table fields definition',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'deliveryClass', 'fields'],
        },
      },
      handler: (args) => this.ddicHandler.createDatabaseTable(this.mapArgs<CreateTableInput>(args)),
    });

    // create_structure
    this.tools.set('create_structure', {
      tool: {
        name: 'create_structure',
        description: 'Create a new ABAP structure in the Data Dictionary',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Structure name (e.g., ZMYSTRUCTURE)' },
            description: { type: 'string', description: 'Short description' },
            components: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Component name' },
                  type: { type: 'string', description: 'Data element or built-in type' },
                },
                required: ['name', 'type'],
              },
              description: 'Structure components',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'components'],
        },
      },
      handler: (args) => this.ddicHandler.createStructure(this.mapArgs<CreateStructureInput>(args)),
    });

    // create_table_type
    this.tools.set('create_table_type', {
      tool: {
        name: 'create_table_type',
        description: 'Create a new ABAP table type in the Data Dictionary',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Table type name (e.g., ZMYTABLETYPE)' },
            description: { type: 'string', description: 'Short description' },
            lineType: { type: 'string', description: 'Line type (structure or data element)' },
            accessMode: { type: 'string', enum: ['STANDARD', 'SORTED', 'HASHED'], description: 'Table access mode' },
            keyDefinition: { type: 'string', enum: ['DEFAULT', 'EMPTY', 'COMPONENTS'], description: 'Key definition type' },
            keyComponents: {
              type: 'array',
              items: { type: 'string' },
              description: 'Key component names',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'lineType'],
        },
      },
      handler: (args) => this.ddicHandler.createTableType(this.mapArgs<CreateTableTypeInput>(args)),
    });

    // get_ddic_object
    this.tools.set('get_ddic_object', {
      tool: {
        name: 'get_ddic_object',
        description: 'Get details of a DDIC object (table, data element, domain, structure, table type)',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['TABL', 'DTEL', 'DOMA', 'STRU', 'TTYP'], description: 'DDIC object type' },
            objectName: { type: 'string', description: 'Object name' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.ddicHandler.getDDICObject(this.mapDDICObjectArgs(args) as unknown as GetDDICObjectInput),
    });

    // activate_ddic_object
    this.tools.set('activate_ddic_object', {
      tool: {
        name: 'activate_ddic_object',
        description: 'Activate a DDIC object',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['TABL', 'DTEL', 'DOMA', 'STRU', 'TTYP'], description: 'DDIC object type' },
            objectName: { type: 'string', description: 'Object name' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.ddicHandler.activateDDICObject(this.mapDDICObjectArgs(args) as unknown as ActivateDDICObjectInput),
    });

    // delete_ddic_object
    this.tools.set('delete_ddic_object', {
      tool: {
        name: 'delete_ddic_object',
        description: 'Delete a DDIC object (data element, domain, table, structure, table type)',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Object name' },
            objectType: { type: 'string', enum: ['DTEL', 'DOMA', 'TABL', 'STRU', 'TTYP'], description: 'DDIC object type' },
            transportRequest: { type: 'string', description: 'Transport request number (optional for $TMP objects)' },
          },
          required: ['name', 'objectType'],
        },
      },
      handler: (args) => this.ddicHandler.deleteDDICObject(args as unknown as DeleteDDICObjectInput),
    });
  }

  /**
   * Register Program tools
   */
  private registerProgramTools(): void {
    // create_class
    this.tools.set('create_class', {
      tool: {
        name: 'create_class',
        description: 'Create a new ABAP class',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Class name (e.g., ZCL_MYCLASS)' },
            description: { type: 'string', description: 'Short description' },
            superClass: { type: 'string', description: 'Super class name (optional)' },
            interfaces: {
              type: 'array',
              items: { type: 'string' },
              description: 'Interfaces to implement',
            },
            isAbstract: { type: 'boolean', description: 'Abstract class flag' },
            isFinal: { type: 'boolean', description: 'Final class flag' },
            visibility: { type: 'string', enum: ['PUBLIC', 'PROTECTED', 'PRIVATE'], description: 'Default visibility' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => this.programHandler.createClass(this.mapArgs<CreateClassInput>(args)),
    });

    // create_interface
    this.tools.set('create_interface', {
      tool: {
        name: 'create_interface',
        description: 'Create a new ABAP interface',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Interface name (e.g., ZIF_MYINTERFACE)' },
            description: { type: 'string', description: 'Short description' },
            methods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  importing: { type: 'array', items: { type: 'object' } },
                  exporting: { type: 'array', items: { type: 'object' } },
                  returning: { type: 'object' },
                  exceptions: { type: 'array', items: { type: 'string' } },
                },
                required: ['name'],
              },
              description: 'Interface methods',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => this.programHandler.createInterface(this.mapArgs<CreateInterfaceInput>(args)),
    });

    // create_function_group
    this.tools.set('create_function_group', {
      tool: {
        name: 'create_function_group',
        description: 'Create a new function group',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Function group name (e.g., ZMYFUGR)' },
            description: { type: 'string', description: 'Short description' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => this.programHandler.createFunctionGroup(this.mapArgs<CreateFunctionGroupInput>(args)),
    });

    // create_function_module
    this.tools.set('create_function_module', {
      tool: {
        name: 'create_function_module',
        description: 'Create a new function module',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Function module name (e.g., Z_MY_FUNCTION)' },
            functionGroup: { type: 'string', description: 'Function group name' },
            description: { type: 'string', description: 'Short description' },
            importing: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  optional: { type: 'boolean' },
                  default: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['name', 'type'],
              },
              description: 'Importing parameters',
            },
            exporting: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['name', 'type'],
              },
              description: 'Exporting parameters',
            },
            changing: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  optional: { type: 'boolean' },
                  description: { type: 'string' },
                },
                required: ['name', 'type'],
              },
              description: 'Changing parameters',
            },
            tables: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  optional: { type: 'boolean' },
                  description: { type: 'string' },
                },
                required: ['name', 'type'],
              },
              description: 'Tables parameters',
            },
            exceptions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exceptions',
            },
            isRFC: { type: 'boolean', description: 'RFC enabled flag' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'functionGroup', 'description'],
        },
      },
      handler: (args) => this.programHandler.createFunctionModule(this.mapFunctionModuleArgs(args)),
    });

    // create_report
    this.tools.set('create_report', {
      tool: {
        name: 'create_report',
        description: 'Create a new ABAP report program',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Report name (e.g., ZMYREPORT)' },
            description: { type: 'string', description: 'Short description' },
            reportType: { type: 'string', enum: ['EXECUTABLE', 'INCLUDE', 'MODULE_POOL'], description: 'Report type' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => {
        // Map 'reportType' to 'programType' and inject packageName from config
        const mappedArgs = {
          ...args,
          packageName: this.config.packageName,
          programType: this.mapReportType((args as Record<string, unknown>).reportType as string),
        };
        return this.programHandler.createReportProgram(mappedArgs as unknown as CreateReportProgramInput);
      },
    });

    // get_source_code
    this.tools.set('get_source_code', {
      tool: {
        name: 'get_source_code',
        description: 'Get the source code of an ABAP object (class, interface, program, function module, include)',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'PROG', 'FUGR', 'FUNC', 'INCL'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.programHandler.getSourceCode(this.mapObjectTypeNameToUri(args) as unknown as GetSourceCodeInput),
    });

    // update_source_code
    this.tools.set('update_source_code', {
      tool: {
        name: 'update_source_code',
        description: `Update the source code of an ABAP object (class, interface, program, function module, include).

**IMPORTANT for Function Module (FUNC) updates:**
When updating a Function Module's source code, you MUST use the ADT format (as returned by get_source_code), NOT the SE37 format.

**Correct ADT format example:**
\`\`\`abap
FUNCTION Z_MY_FUNCTION
  IMPORTING
    VALUE(IV_PARAM1) TYPE STRING
    VALUE(IV_PARAM2) TYPE I OPTIONAL
  EXPORTING
    VALUE(EV_RESULT) TYPE STRING
  EXCEPTIONS
    MY_EXCEPTION.

* Your implementation code here
DATA: lv_temp TYPE string.
lv_temp = iv_param1.
ev_result = lv_temp.

ENDFUNCTION.
\`\`\`

**WRONG SE37 format (DO NOT USE):**
\`\`\`
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_PARAM1) TYPE  STRING
...
\`\`\`

**Key rules:**
1. Do NOT include lines starting with *" - these are SE37 display format, not ADT format
2. Always include the full function signature (IMPORTING/EXPORTING/CHANGING/TABLES/EXCEPTIONS sections)
3. Do NOT omit or skip the parameter declaration lines when updating code
4. The function signature and ENDFUNCTION statement must be present`,
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'PROG', 'FUGR', 'FUNC', 'INCL'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type)' },
            source: { type: 'string', description: 'New source code' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['objectType', 'objectName', 'source'],
        },
      },
      handler: (args) => this.programHandler.updateSourceCode(this.mapObjectTypeNameToUri(args) as unknown as UpdateSourceCodeInput),
    });

    // search_objects
    this.tools.set('search_objects', {
      tool: {
        name: 'search_objects',
        description: 'Search for ABAP objects by name pattern',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query (supports wildcards *)' },
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'PROG', 'FUGR', 'FUNC', 'TABL', 'DTEL', 'DOMA'], description: 'Filter by object type' },
            maxResults: { type: 'number', description: 'Maximum number of results (default 100)' },
          },
          required: ['query'],
        },
      },
      handler: (args) => this.programHandler.searchObjects(args as unknown as SearchObjectsInput),
    });

    // where_used
    this.tools.set('where_used', {
      tool: {
        name: 'where_used',
        description: 'Find where an object is used',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'PROG', 'FUGR', 'FUNC', 'TABL', 'DTEL', 'DOMA'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.programHandler.whereUsed(this.mapObjectTypeNameToUri(args) as unknown as WhereUsedInput),
    });

    // get_object_metadata
    this.tools.set('get_object_metadata', {
      tool: {
        name: 'get_object_metadata',
        description: 'Get metadata information about an ABAP object',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'PROG', 'FUGR', 'FUNC', 'TABL', 'DTEL', 'DOMA'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.programHandler.getObjectMetadata(this.mapObjectTypeNameToUri(args) as unknown as GetObjectMetadataInput),
    });

    // activate_object
    this.tools.set('activate_object', {
      tool: {
        name: 'activate_object',
        description: 'Activate an ABAP object (class, interface, function module, report, include)',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'FUGR', 'FUNC', 'PROG', 'INCL'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.programHandler.activateObject(this.mapObjectTypeNameToUri(args) as unknown as ActivateObjectInput),
    });

    // check_syntax
    this.tools.set('check_syntax', {
      tool: {
        name: 'check_syntax',
        description: 'Check syntax of an ABAP object (class, interface, function module, report, include)',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'FUGR', 'FUNC', 'PROG', 'INCL'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.programHandler.checkSyntax(this.mapObjectTypeNameToUri(args) as unknown as CheckSyntaxInput),
    });

    // delete_object
    this.tools.set('delete_object', {
      tool: {
        name: 'delete_object',
        description: 'Delete an ABAP object (class, interface, function group, function module, report, include). For function modules (FUNC type), the functionGroup parameter is required.',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'INTF', 'FUGR', 'FUNC', 'PROG', 'INCL'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            functionGroup: { type: 'string', description: 'Function group name (required for FUNC type to build correct URI)' },
            transportRequest: { type: 'string', description: 'Transport request number (optional for $TMP objects)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => {
        // Map 'objectName' to 'name' as expected by DeleteObjectInput
        const mapped: Record<string, unknown> = { ...args };
        if ('objectName' in args && !('name' in args)) {
          mapped.name = args.objectName;
        }
        // functionGroup is already in args and will be passed through
        return this.programHandler.deleteObject(mapped as unknown as DeleteObjectInput);
      },
    });
  }

  /**
   * Register CDS/OData tools
   */
  private registerCDSTools(): void {
    // create_cds_view
    this.tools.set('create_cds_view', {
      tool: {
        name: 'create_cds_view',
        description: 'Create a new CDS view',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'CDS view name (e.g., ZCDS_MYVIEW)' },
            description: { type: 'string', description: 'Short description' },
            sqlViewName: { type: 'string', description: 'SQL view name (max 16 chars)' },
            dataSource: { type: 'string', description: 'Primary data source (table or CDS view)' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  source: { type: 'string' },
                  alias: { type: 'string' },
                },
                required: ['name'],
              },
              description: 'Field definitions',
            },
            associations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  target: { type: 'string' },
                  cardinality: { type: 'string' },
                  condition: { type: 'string' },
                },
                required: ['name', 'target'],
              },
              description: 'Association definitions',
            },
            annotations: {
              type: 'array',
              items: { type: 'string' },
              description: 'CDS annotations',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'sqlViewName', 'dataSource', 'fields'],
        },
      },
      handler: (args) => this.cdsHandler.createCDSView(this.mapArgs<CreateCDSViewInput>(args)),
    });

    // create_service_definition
    this.tools.set('create_service_definition', {
      tool: {
        name: 'create_service_definition',
        description: 'Create a new OData service definition',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Service definition name (e.g., ZSRV_MYSERVICE)' },
            description: { type: 'string', description: 'Short description' },
            exposedEntities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cdsView: { type: 'string' },
                  alias: { type: 'string' },
                },
                required: ['cdsView'],
              },
              description: 'Entities to expose',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'exposedEntities'],
        },
      },
      handler: (args) => this.cdsHandler.createServiceDefinition(this.mapArgs<CreateServiceDefinitionInput>(args)),
    });

    // create_service_binding
    this.tools.set('create_service_binding', {
      tool: {
        name: 'create_service_binding',
        description: 'Create a new OData service binding',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Service binding name (e.g., ZSRVB_MYSERVICE)' },
            description: { type: 'string', description: 'Short description' },
            serviceDefinition: { type: 'string', description: 'Service definition name' },
            bindingType: { type: 'string', enum: ['ODATA_V2', 'ODATA_V4'], description: 'OData version' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'serviceDefinition', 'bindingType'],
        },
      },
      handler: (args) => this.cdsHandler.createServiceBinding(this.mapArgs<CreateServiceBindingInput>(args)),
    });

    // get_cds_view
    this.tools.set('get_cds_view', {
      tool: {
        name: 'get_cds_view',
        description: 'Get CDS view definition and metadata',
        inputSchema: {
          type: 'object',
          properties: {
            cdsViewName: { type: 'string', description: 'CDS view name' },
          },
          required: ['cdsViewName'],
        },
      },
      handler: (args) => {
        // Map 'cdsViewName' to 'name' as expected by GetCDSViewInput
        const mappedArgs = { name: (args as Record<string, unknown>).cdsViewName as string };
        return this.cdsHandler.getCDSView(mappedArgs as GetCDSViewInput);
      },
    });

    // get_service_binding_url
    this.tools.set('get_service_binding_url', {
      tool: {
        name: 'get_service_binding_url',
        description: 'Get the URL of a service binding',
        inputSchema: {
          type: 'object',
          properties: {
            serviceBindingName: { type: 'string', description: 'Service binding name' },
          },
          required: ['serviceBindingName'],
        },
      },
      handler: (args) => this.cdsHandler.getServiceBindingUrl(args as unknown as GetServiceBindingUrlInput),
    });

    // get_cds_source
    this.tools.set('get_cds_source', {
      tool: {
        name: 'get_cds_source',
        description: 'Get the source code of a CDS view',
        inputSchema: {
          type: 'object',
          properties: {
            cdsViewName: { type: 'string', description: 'CDS view name' },
          },
          required: ['cdsViewName'],
        },
      },
      handler: (args) => {
        // Map 'cdsViewName' to 'name' as expected by GetCDSSourceInput
        // Support both 'cdsViewName' and 'name' parameters
        const typedArgs = args as Record<string, unknown>;
        const name = (typedArgs.cdsViewName || typedArgs.name) as string;
        const mappedArgs = { name };
        return this.cdsHandler.getCDSSource(mappedArgs as GetCDSSourceInput);
      },
    });

    // update_cds_source
    this.tools.set('update_cds_source', {
      tool: {
        name: 'update_cds_source',
        description: 'Update the source code of a CDS view',
        inputSchema: {
          type: 'object',
          properties: {
            cdsViewName: { type: 'string', description: 'CDS view name' },
            source: { type: 'string', description: 'New source code' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['cdsViewName', 'source'],
        },
      },
      handler: (args) => {
        // Map 'cdsViewName' to 'name' as expected by UpdateCDSSourceInput
        const typedArgs = args as Record<string, unknown>;
        const mappedArgs = {
          name: typedArgs.cdsViewName as string,
          source: typedArgs.source as string,
          transportRequest: typedArgs.transportRequest as string | undefined,
        };
        return this.cdsHandler.updateCDSSource(mappedArgs as UpdateCDSSourceInput);
      },
    });

    // activate_cds_object
    this.tools.set('activate_cds_object', {
      tool: {
        name: 'activate_cds_object',
        description: 'Activate a CDS view or service',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['DDLS', 'SRVD', 'SRVB'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => {
        // Map 'objectName' to 'name' as expected by ActivateCDSObjectInput
        const typedArgs = args as Record<string, unknown>;
        const mappedArgs = {
          name: typedArgs.objectName as string,
          objectType: typedArgs.objectType as 'DDLS' | 'DCLS' | 'DDLX' | 'SRVD' | 'SRVB',
        };
        return this.cdsHandler.activateCDSObject(mappedArgs as ActivateCDSObjectInput);
      },
    });

    // delete_cds_object
    this.tools.set('delete_cds_object', {
      tool: {
        name: 'delete_cds_object',
        description: 'Delete a CDS object (CDS view, service definition, or service binding)',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['DDLS', 'SRVD', 'SRVB'], description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            transportRequest: { type: 'string', description: 'Transport request number (optional for $TMP objects)' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => {
        // Map 'objectName' to 'name' as expected by DeleteCDSObjectInput
        const typedArgs = args as Record<string, unknown>;
        const mappedArgs = {
          name: typedArgs.objectName as string,
          objectType: typedArgs.objectType as 'DDLS' | 'DCLS' | 'DDLX' | 'SRVD' | 'SRVB',
          transportRequest: typedArgs.transportRequest as string | undefined,
        };
        return this.cdsHandler.deleteCDSObject(mappedArgs);
      },
    });
  }

  /**
   * Register Testing tools
   */
  private registerTestingTools(): void {
    // run_unit_tests
    this.tools.set('run_unit_tests', {
      tool: {
        name: 'run_unit_tests',
        description: 'Run ABAP unit tests for a class or package',
        inputSchema: {
          type: 'object',
          properties: {
            objectType: { type: 'string', enum: ['CLAS', 'DEVC'], description: 'Object type (class or package)' },
            objectName: { type: 'string', description: 'Object name' },
            withCoverage: { type: 'boolean', description: 'Include code coverage' },
          },
          required: ['objectType', 'objectName'],
        },
      },
      handler: (args) => this.testingHandler.runUnitTests(args as unknown as RunUnitTestsInput),
    });

    // get_test_coverage
    this.tools.set('get_test_coverage', {
      tool: {
        name: 'get_test_coverage',
        description: 'Get code coverage results for a class',
        inputSchema: {
          type: 'object',
          properties: {
            className: { type: 'string', description: 'Class name' },
          },
          required: ['className'],
        },
      },
      handler: (args) => this.testingHandler.getTestCoverage(args as unknown as GetTestCoverageInput),
    });

    // get_test_results
    this.tools.set('get_test_results', {
      tool: {
        name: 'get_test_results',
        description: 'Get results of a previous test run',
        inputSchema: {
          type: 'object',
          properties: {
            runId: { type: 'string', description: 'Test run ID' },
          },
          required: ['runId'],
        },
      },
      handler: (args) => this.testingHandler.getTestResults(args as unknown as GetTestResultsInput),
    });

    // analyze_test_class
    this.tools.set('analyze_test_class', {
      tool: {
        name: 'analyze_test_class',
        description: 'Analyze a test class structure and methods',
        inputSchema: {
          type: 'object',
          properties: {
            className: { type: 'string', description: 'Test class name' },
          },
          required: ['className'],
        },
      },
      handler: (args) => this.testingHandler.analyzeTestClass(args as unknown as AnalyzeTestClassInput),
    });
  }

  /**
   * Register System tools
   */
  private registerSystemTools(): void {
    // get_system_info
    this.tools.set('get_system_info', {
      tool: {
        name: 'get_system_info',
        description: 'Get SAP system information',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      handler: (args) => this.systemHandler.getSystemInfo(args as unknown as GetSystemInfoInput),
    });

    // get_package_info
    this.tools.set('get_package_info', {
      tool: {
        name: 'get_package_info',
        description: 'Get package information and contents',
        inputSchema: {
          type: 'object',
          properties: {
            packageName: { type: 'string', description: 'Package name' },
          },
          required: ['packageName'],
        },
      },
      handler: (args) => this.systemHandler.getPackageInfo(args as unknown as GetPackageInfoInput),
    });

    // create_package
    this.tools.set('create_package', {
      tool: {
        name: 'create_package',
        description: 'Create a new package',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Package name' },
            description: { type: 'string', description: 'Package description' },
            superPackage: { type: 'string', description: 'Super package (optional)' },
            softwareComponent: { type: 'string', description: 'Software component (optional)' },
            applicationComponent: { type: 'string', description: 'Application component (optional)' },
            transportLayer: { type: 'string', description: 'Transport layer (optional)' },
            packageType: { type: 'string', enum: ['development', 'structure', 'main'], description: 'Package type' },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => this.systemHandler.createPackage(args as unknown as CreatePackageInput),
    });

    // get_message_class
    this.tools.set('get_message_class', {
      tool: {
        name: 'get_message_class',
        description: 'Get message class definition',
        inputSchema: {
          type: 'object',
          properties: {
            messageClassName: { type: 'string', description: 'Message class name' },
          },
          required: ['messageClassName'],
        },
      },
      handler: (args) => this.systemHandler.getMessageClass(args as unknown as GetMessageClassInput),
    });

    // create_message_class
    this.tools.set('create_message_class', {
      tool: {
        name: 'create_message_class',
        description: 'Create a new message class',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Message class name' },
            description: { type: 'string', description: 'Description' },
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  number: { type: 'string', description: 'Message number (000-999)' },
                  shortText: { type: 'string', description: 'Message text' },
                  selfExplanatory: { type: 'boolean', description: 'Self-explanatory flag' },
                },
                required: ['number', 'shortText'],
              },
              description: 'Message definitions',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description'],
        },
      },
      handler: (args) => this.systemHandler.createMessageClass(this.mapArgs<CreateMessageClassInput>(args)),
    });

    // get_number_range
    this.tools.set('get_number_range', {
      tool: {
        name: 'get_number_range',
        description: 'Get number range object definition',
        inputSchema: {
          type: 'object',
          properties: {
            objectName: { type: 'string', description: 'Number range object name' },
          },
          required: ['objectName'],
        },
      },
      handler: (args) => this.systemHandler.getNumberRange(args as unknown as GetNumberRangeInput),
    });

    // create_number_range
    this.tools.set('create_number_range', {
      tool: {
        name: 'create_number_range',
        description: 'Create a new number range object',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Number range object name' },
            description: { type: 'string', description: 'Description' },
            domainName: { type: 'string', description: 'Domain name (optional)' },
            numberLength: { type: 'number', description: 'Number length' },
            percentage: { type: 'number', description: 'Warning percentage (optional)' },
            intervals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  subObject: { type: 'string', description: 'Sub-object (optional)' },
                  fromNumber: { type: 'string', description: 'From number' },
                  toNumber: { type: 'string', description: 'To number' },
                  currentNumber: { type: 'string', description: 'Current number (optional)' },
                  external: { type: 'boolean', description: 'External number assignment' },
                },
                required: ['fromNumber', 'toNumber'],
              },
              description: 'Number range intervals',
            },
            transportRequest: { type: 'string', description: 'Transport request number' },
          },
          required: ['name', 'description', 'numberLength', 'intervals'],
        },
      },
      handler: (args) => this.systemHandler.createNumberRange(this.mapArgs<CreateNumberRangeInput>(args)),
    });
  }

  /**
   * Register Transport tools
   */
  private registerTransportTools(): void {
    // get_transport_requests
    this.tools.set('get_transport_requests', {
      tool: {
        name: 'get_transport_requests',
        description: 'Get list of transport requests',
        inputSchema: {
          type: 'object',
          properties: {
            user: { type: 'string', description: 'Filter by user (optional)' },
            status: { type: 'string', enum: ['MODIFIABLE', 'RELEASED', 'ALL'], description: 'Filter by status' },
            type: { type: 'string', enum: ['WORKBENCH', 'CUSTOMIZING', 'ALL'], description: 'Filter by type' },
          },
          required: [],
        },
      },
      handler: (args) => this.transportHandler.getTransportRequests(args as unknown as GetTransportRequestsInput),
    });

    // create_transport_request
    this.tools.set('create_transport_request', {
      tool: {
        name: 'create_transport_request',
        description: 'Create a new transport request',
        inputSchema: {
          type: 'object',
          properties: {
            description: { type: 'string', description: 'Transport request description' },
            type: { type: 'string', enum: ['WORKBENCH', 'CUSTOMIZING'], description: 'Request type' },
            targetSystem: { type: 'string', description: 'Target system (optional)' },
          },
          required: ['description', 'type'],
        },
      },
      handler: (args) => this.transportHandler.createTransportRequest(args as unknown as CreateTransportRequestInput),
    });

    // add_object_to_transport
    this.tools.set('add_object_to_transport', {
      tool: {
        name: 'add_object_to_transport',
        description: 'Add an object to a transport request',
        inputSchema: {
          type: 'object',
          properties: {
            requestNumber: { type: 'string', description: 'Transport request number' },
            pgmid: { type: 'string', description: 'Program ID (e.g., R3TR, LIMU)' },
            objectType: { type: 'string', description: 'Object type' },
            objectName: { type: 'string', description: 'Object name' },
            taskNumber: { type: 'string', description: 'Task number (optional)' },
          },
          required: ['requestNumber', 'pgmid', 'objectType', 'objectName'],
        },
      },
      handler: (args) => this.transportHandler.addObjectToTransport(args as unknown as AddObjectToTransportInput),
    });

    // release_transport_request
    this.tools.set('release_transport_request', {
      tool: {
        name: 'release_transport_request',
        description: 'Release a transport request',
        inputSchema: {
          type: 'object',
          properties: {
            requestNumber: { type: 'string', description: 'Transport request number' },
            releaseTasks: { type: 'boolean', description: 'Release tasks first if present' },
          },
          required: ['requestNumber'],
        },
      },
      handler: (args) => this.transportHandler.releaseTransportRequest(args as unknown as ReleaseTransportRequestInput),
    });

    // get_transport_contents
    this.tools.set('get_transport_contents', {
      tool: {
        name: 'get_transport_contents',
        description: 'Get objects in a transport request',
        inputSchema: {
          type: 'object',
          properties: {
            requestNumber: { type: 'string', description: 'Transport request number' },
            includeTasks: { type: 'boolean', description: 'Include task details' },
          },
          required: ['requestNumber'],
        },
      },
      handler: (args) => this.transportHandler.getTransportContents(args as unknown as GetTransportContentsInput),
    });
  }

  /**
   * Set up MCP request handlers
   */
  private setupRequestHandlers(): void {
    // Handle list tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map((t) => t.tool);
      return { tools };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const startTime = Date.now();

      this.logger.mcpToolCall(name, args as Record<string, unknown>);

      const toolDef = this.tools.get(name);
      if (!toolDef) {
        const error = `Unknown tool: ${name}`;
        this.logger.mcpToolResult(name, false, Date.now() - startTime);
        return {
          content: [{ type: 'text', text: JSON.stringify({ error }) }],
          isError: true,
        };
      }

      try {
        const result = await toolDef.handler(args || {});
        this.logger.mcpToolResult(name, true, Date.now() - startTime);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        const wrappedError = wrapError(error, ErrorCodes.TOOL_EXECUTION_FAILED);
        this.logger.mcpToolResult(name, false, Date.now() - startTime);
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: wrappedError.message, code: wrappedError.code }) }],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    // Test connection to SAP system
    this.logger.info('Testing connection to SAP system...');
    const connected = await this.adtClient.testConnection();
    if (!connected) {
      throw new ADTError('Failed to connect to SAP system', ErrorCodes.CONNECTION_FAILED);
    }
    this.logger.info('Successfully connected to SAP system');

    // Start MCP server with stdio transport
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('SAP ABAP MCP Server started');
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    await this.server.close();
    this.logger.info('SAP ABAP MCP Server stopped');
  }

  /**
   * Map objectType + objectName to objectUri
   * Converts MCP schema input (objectType, objectName) to handler input (objectUri)
   * 
   * IMPORTANT: Object names containing namespace slashes (e.g., /SMB98/OBJECT_NAME)
   * must be properly URL-encoded to avoid being interpreted as path separators.
   * For example:
   * - Input: /SMB98/PARAMS_FROM_FILENAME
   * - Encoded: %2fsmb98%2fparams_from_filename
   */
  private mapObjectTypeNameToUri(args: Record<string, unknown>): Record<string, unknown> {
    const mapped: Record<string, unknown> = { ...args };
    
    // If objectUri is already provided, use it directly
    if (args.objectUri) {
      return mapped;
    }
    
    const objectType = args.objectType as string;
    const objectName = args.objectName as string;
    const functionGroup = args.functionGroup as string;
    
    if (!objectType || !objectName) {
      return mapped;
    }
    
    // Special handling for FUNC type - requires functionGroup
    if (objectType.toUpperCase() === 'FUNC') {
      if (functionGroup) {
        // Correct URI format: /sap/bc/adt/functions/groups/{group_name}/fmodules/{func_name}
        // Both functionGroup and objectName need to be encoded for namespace support
        const encodedGroup = encodeFunctionGroupForUri(functionGroup);
        const encodedName = encodeObjectNameForUri(objectName);
        mapped.objectUri = `/sap/bc/adt/functions/groups/${encodedGroup}/fmodules/${encodedName}`;
      } else {
        // Fallback - may not work correctly without function group
        this.logger.warn(`FUNC type without functionGroup parameter - URI may be incorrect for: ${objectName}`);
        const encodedName = encodeObjectNameForUri(objectName);
        mapped.objectUri = `/sap/bc/adt/functions/groups/unknown/fmodules/${encodedName}`;
      }
      return mapped;
    }
    
    // URI prefix mapping based on object type
    const uriPrefixes: Record<string, string> = {
      'CLAS': '/sap/bc/adt/oo/classes/',
      'INTF': '/sap/bc/adt/oo/interfaces/',
      'FUGR': '/sap/bc/adt/functions/groups/',
      'PROG': '/sap/bc/adt/programs/programs/',
      'REPS': '/sap/bc/adt/programs/programs/',
      'INCL': '/sap/bc/adt/programs/includes/',
    };
    
    const prefix = uriPrefixes[objectType.toUpperCase()];
    if (prefix) {
      // Encode the object name to handle namespace slashes
      const encodedName = encodeObjectNameForUri(objectName);
      mapped.objectUri = `${prefix}${encodedName}`;
    }
    
    return mapped;
  }

  /**
   * Map report type from MCP schema values to CreateReportProgramInput values
   */
  private mapReportType(reportType: string | undefined): 'executable' | 'include' | 'modulePool' | 'subroutinePool' {
    if (!reportType) return 'executable';
    
    const mapping: Record<string, 'executable' | 'include' | 'modulePool' | 'subroutinePool'> = {
      'EXECUTABLE': 'executable',
      'INCLUDE': 'include',
      'MODULE_POOL': 'modulePool',
      'SUBROUTINE_POOL': 'subroutinePool',
      // Also support lowercase
      'executable': 'executable',
      'include': 'include',
      'modulePool': 'modulePool',
      'subroutinePool': 'subroutinePool',
    };
    
    return mapping[reportType] || 'executable';
  }

  /**
   * Map MCP schema property names to handler input property names
   * Common mappings:
   * - Inject packageName from config (SAP_PACKAGE_NAME env var)
   * - 'domain' -> 'domainName'  
   */
  private mapArgs<T>(args: Record<string, unknown>): T {
    const mapped: Record<string, unknown> = { ...args };
    
    // Inject packageName from config (SAP_PACKAGE_NAME env var)
    // This is mandatory for create operations
    if (this.config.packageName && !('packageName' in args)) {
      mapped.packageName = this.config.packageName;
    }
    
    // Map 'domain' to 'domainName' for data elements
    if ('domain' in args && !('domainName' in args)) {
      mapped.domainName = args.domain;
    }
    
    return mapped as T;
  }

  /**
   * Map DDIC object args from MCP schema to handler input
   * Converts 'objectName' to 'name' as required by GetDDICObjectInput/ActivateDDICObjectInput
   */
  private mapDDICObjectArgs(args: Record<string, unknown>): Record<string, unknown> {
    const mapped: Record<string, unknown> = { ...args };
    
    // Map 'objectName' to 'name' for DDIC object handlers
    if ('objectName' in args && !('name' in args)) {
      mapped.name = args.objectName;
    }
    
    return mapped;
  }

  /**
   * Map function module args from MCP schema to handler input
   * MCP schema uses: importing, exporting, changing, tables with type/optional/default
   * Handler expects: importParameters, exportParameters, changingParameters, tableParameters with typeName/isOptional/defaultValue
   */
  private mapFunctionModuleArgs(args: Record<string, unknown>): CreateFunctionModuleInput {
    const mapped: Record<string, unknown> = { ...args };
    
    // Inject packageName from config (SAP_PACKAGE_NAME env var)
    if (this.config.packageName && !('packageName' in args)) {
      mapped.packageName = this.config.packageName;
    }

    // Helper function to map parameter array properties
    const mapParameterArray = (params: unknown[]): Array<{
      name: string;
      typeName: string;
      isOptional?: boolean;
      defaultValue?: string;
      description?: string;
    }> => {
      return params.map((p: unknown) => {
        const param = p as Record<string, unknown>;
        return {
          name: param.name as string,
          typeName: (param.type || param.typeName) as string,
          isOptional: param.optional !== undefined ? param.optional as boolean : param.isOptional as boolean | undefined,
          defaultValue: (param.default || param.defaultValue) as string | undefined,
          description: param.description as string | undefined,
        };
      });
    };

    // Map 'importing' to 'importParameters'
    if (Array.isArray(args.importing) && args.importing.length > 0) {
      mapped.importParameters = mapParameterArray(args.importing);
    }

    // Map 'exporting' to 'exportParameters'
    if (Array.isArray(args.exporting) && args.exporting.length > 0) {
      mapped.exportParameters = mapParameterArray(args.exporting);
    }

    // Map 'changing' to 'changingParameters'
    if (Array.isArray(args.changing) && args.changing.length > 0) {
      mapped.changingParameters = mapParameterArray(args.changing);
    }

    // Map 'tables' to 'tableParameters'
    if (Array.isArray(args.tables) && args.tables.length > 0) {
      mapped.tableParameters = mapParameterArray(args.tables);
    }

    // Map 'exceptions' from string array to object array
    // MCP schema defines exceptions as string array: ["EXCEPTION_NAME"]
    // Handler expects object array: [{name: "EXCEPTION_NAME", description?: string}]
    if (Array.isArray(args.exceptions) && args.exceptions.length > 0) {
      mapped.exceptions = args.exceptions.map((e: unknown) => {
        if (typeof e === 'string') {
          return { name: e };
        }
        // If already an object, return as-is
        return e;
      });
    }

    return mapped as unknown as CreateFunctionModuleInput;
  }
}
