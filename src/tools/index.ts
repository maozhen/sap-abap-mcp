/**
 * SAP ABAP MCP Server Tools
 * Central export file for all tool handlers
 */

// DDIC Tools - Data Dictionary operations
export {
  DDICToolHandler,
  CreateStructureInput,
  CreateTableTypeInput,
  GetDDICObjectInput,
  ActivateDDICObjectInput,
  DeleteDDICObjectInput,
} from './ddic-tools';

// Program Tools - ABAP program development
export {
  ProgramToolHandler,
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
} from './program-tools';

// CDS Tools - Core Data Services
export {
  CDSToolHandler,
  CreateServiceDefinitionInput,
  CreateServiceBindingInput,
  GetCDSViewInput,
  GetCDSSourceInput,
  UpdateCDSSourceInput,
  ActivateCDSObjectInput,
  GetServiceBindingUrlInput,
} from './cds-tools';

// Testing Tools - Unit testing and coverage
export {
  TestingToolHandler,
  GetTestCoverageInput,
  GetTestResultsInput,
  AnalyzeTestClassInput,
  TestClassAnalysis,
  TestMethodInfo,
} from './testing-tools';

// System Tools - Package and system management
export {
  SystemToolHandler,
  GetSystemInfoInput,
  GetPackageInfoInput,
  CreatePackageInput,
  GetMessageClassInput,
  CreateMessageClassInput,
  GetNumberRangeInput,
  CreateNumberRangeInput,
  SystemInfo,
  PackageInfo,
  PackageObjectInfo,
  MessageClass,
  MessageEntry,
  MessageDefinition,
  NumberRangeObject,
  NumberRangeInterval,
  NumberRangeIntervalInfo,
} from './system-tools';

// Transport Tools - CTS operations
export {
  TransportToolHandler,
  GetTransportRequestsInput,
  CreateTransportRequestInput,
  ReleaseTransportRequestInput,
  AddObjectToTransportInput,
  GetTransportContentsInput,
  TransportRequestList,
  TransportCreationResult,
  TransportReleaseResult,
  AddObjectResult,
  TransportContents,
} from './transport-tools';

// Re-export types from main types file for convenience
export type {
  ToolResponse,
  ToolError,
  CreateClassInput,
  CreateCDSViewInput,
  RunUnitTestsInput,
  DataElement,
  Domain,
  DatabaseTable,
  Structure,
  TableType,
  ABAPClass,
  ABAPInterface,
  FunctionGroup,
  FunctionModule,
  ReportProgram,
  CDSView,
  ServiceDefinition,
  ServiceBinding,
  UnitTestResult,
  TestRunSummary,
  CodeCoverageResult,
  TransportRequest,
  TransportTask,
  TransportObject,
  SyntaxCheckResult,
  ActivationResult,
  ObjectSearchResult,
  WhereUsedResult,
  ADTObject,
  ADTObjectType,
} from '../types';

/**
 * Tool handler factory - creates all tool handlers with shared ADT client
 */
import { ADTClient } from '../clients/adt-client';
import { Logger } from '../utils/logger';

// Direct imports for tool handler classes (needed for createToolHandlers function)
import { DDICToolHandler } from './ddic-tools';
import { ProgramToolHandler } from './program-tools';
import { CDSToolHandler } from './cds-tools';
import { TestingToolHandler } from './testing-tools';
import { SystemToolHandler } from './system-tools';
import { TransportToolHandler } from './transport-tools';

export interface ToolHandlers {
  ddic: DDICToolHandler;
  program: ProgramToolHandler;
  cds: CDSToolHandler;
  testing: TestingToolHandler;
  system: SystemToolHandler;
  transport: TransportToolHandler;
}

/**
 * Create all tool handlers with shared ADT client
 */
export function createToolHandlers(adtClient: ADTClient, logger?: Logger): ToolHandlers {
  return {
    ddic: new DDICToolHandler(adtClient, logger),
    program: new ProgramToolHandler(adtClient, logger),
    cds: new CDSToolHandler(adtClient, logger),
    testing: new TestingToolHandler(adtClient, logger),
    system: new SystemToolHandler(adtClient, logger),
    transport: new TransportToolHandler(adtClient, logger),
  };
}

/**
 * Tool metadata for MCP registration
 */
export const TOOL_DEFINITIONS = {
  // DDIC Tools
  createDataElement: {
    name: 'create_data_element',
    description: 'Create a new ABAP Data Element in the Data Dictionary',
    handler: 'ddic',
    method: 'createDataElement',
  },
  createDomain: {
    name: 'create_domain',
    description: 'Create a new ABAP Domain in the Data Dictionary',
    handler: 'ddic',
    method: 'createDomain',
  },
  createDatabaseTable: {
    name: 'create_database_table',
    description: 'Create a new ABAP Database Table',
    handler: 'ddic',
    method: 'createDatabaseTable',
  },
  createStructure: {
    name: 'create_structure',
    description: 'Create a new ABAP Structure',
    handler: 'ddic',
    method: 'createStructure',
  },
  createTableType: {
    name: 'create_table_type',
    description: 'Create a new ABAP Table Type',
    handler: 'ddic',
    method: 'createTableType',
  },
  getDDICObject: {
    name: 'get_ddic_object',
    description: 'Get DDIC object metadata (Data Element, Domain, Table, Structure, Table Type)',
    handler: 'ddic',
    method: 'getDDICObject',
  },
  activateDDICObject: {
    name: 'activate_ddic_object',
    description: 'Activate a DDIC object',
    handler: 'ddic',
    method: 'activateDDICObject',
  },
  deleteDDICObject: {
    name: 'delete_ddic_object',
    description: 'Delete a DDIC object (data element, domain, table, structure, table type)',
    handler: 'ddic',
    method: 'deleteDDICObject',
  },

  // Program Tools
  createClass: {
    name: 'create_class',
    description: 'Create a new ABAP Class',
    handler: 'program',
    method: 'createClass',
  },
  createInterface: {
    name: 'create_interface',
    description: 'Create a new ABAP Interface',
    handler: 'program',
    method: 'createInterface',
  },
  createFunctionGroup: {
    name: 'create_function_group',
    description: 'Create a new ABAP Function Group',
    handler: 'program',
    method: 'createFunctionGroup',
  },
  createFunctionModule: {
    name: 'create_function_module',
    description: 'Create a new ABAP Function Module',
    handler: 'program',
    method: 'createFunctionModule',
  },
  createReport: {
    name: 'create_report',
    description: 'Create a new ABAP Report Program',
    handler: 'program',
    method: 'createReport',
  },
  getSourceCode: {
    name: 'get_source_code',
    description: 'Get source code of an ABAP object',
    handler: 'program',
    method: 'getSourceCode',
  },
  updateSourceCode: {
    name: 'update_source_code',
    description: 'Update source code of an ABAP object',
    handler: 'program',
    method: 'updateSourceCode',
  },
  checkSyntax: {
    name: 'check_syntax',
    description: 'Check syntax of an ABAP object',
    handler: 'program',
    method: 'checkSyntax',
  },
  activateObject: {
    name: 'activate_object',
    description: 'Activate an ABAP object',
    handler: 'program',
    method: 'activateObject',
  },
  searchObjects: {
    name: 'search_objects',
    description: 'Search for ABAP objects',
    handler: 'program',
    method: 'searchObjects',
  },
  getWhereUsed: {
    name: 'get_where_used',
    description: 'Get where-used list for an ABAP object',
    handler: 'program',
    method: 'getWhereUsed',
  },
  deleteObject: {
    name: 'delete_object',
    description: 'Delete an ABAP object (class, interface, program, function group, function module)',
    handler: 'program',
    method: 'deleteObject',
  },

  // CDS Tools
  createCDSView: {
    name: 'create_cds_view',
    description: 'Create a new CDS View',
    handler: 'cds',
    method: 'createCDSView',
  },
  createServiceDefinition: {
    name: 'create_service_definition',
    description: 'Create a new Service Definition',
    handler: 'cds',
    method: 'createServiceDefinition',
  },
  createServiceBinding: {
    name: 'create_service_binding',
    description: 'Create a new Service Binding',
    handler: 'cds',
    method: 'createServiceBinding',
  },
  getCDSSource: {
    name: 'get_cds_source',
    description: 'Get CDS view source code',
    handler: 'cds',
    method: 'getCDSSource',
  },
  analyzeCDSDependencies: {
    name: 'analyze_cds_dependencies',
    description: 'Analyze CDS view dependencies',
    handler: 'cds',
    method: 'analyzeCDSDependencies',
  },
  validateCDS: {
    name: 'validate_cds',
    description: 'Validate CDS view syntax and semantics',
    handler: 'cds',
    method: 'validateCDS',
  },
  getCDSAnnotations: {
    name: 'get_cds_annotations',
    description: 'Get CDS view annotations',
    handler: 'cds',
    method: 'getCDSAnnotations',
  },

  // Testing Tools
  runUnitTests: {
    name: 'run_unit_tests',
    description: 'Run ABAP Unit tests',
    handler: 'testing',
    method: 'runUnitTests',
  },
  getTestCoverage: {
    name: 'get_test_coverage',
    description: 'Get code coverage for an ABAP object',
    handler: 'testing',
    method: 'getTestCoverage',
  },
  getTestResults: {
    name: 'get_test_results',
    description: 'Get detailed test results',
    handler: 'testing',
    method: 'getTestResults',
  },
  analyzeTestClass: {
    name: 'analyze_test_class',
    description: 'Analyze test class structure',
    handler: 'testing',
    method: 'analyzeTestClass',
  },

  // System Tools
  getSystemInfo: {
    name: 'get_system_info',
    description: 'Get SAP system information',
    handler: 'system',
    method: 'getSystemInfo',
  },
  getPackageInfo: {
    name: 'get_package_info',
    description: 'Get ABAP package information',
    handler: 'system',
    method: 'getPackageInfo',
  },
  createPackage: {
    name: 'create_package',
    description: 'Create a new ABAP package',
    handler: 'system',
    method: 'createPackage',
  },
  getMessageClass: {
    name: 'get_message_class',
    description: 'Get message class information',
    handler: 'system',
    method: 'getMessageClass',
  },
  createMessageClass: {
    name: 'create_message_class',
    description: 'Create a new message class',
    handler: 'system',
    method: 'createMessageClass',
  },
  getNumberRange: {
    name: 'get_number_range',
    description: 'Get number range object information',
    handler: 'system',
    method: 'getNumberRange',
  },
  createNumberRange: {
    name: 'create_number_range',
    description: 'Create a new number range object',
    handler: 'system',
    method: 'createNumberRange',
  },

  // Transport Tools
  getTransportRequests: {
    name: 'get_transport_requests',
    description: 'Get transport requests list',
    handler: 'transport',
    method: 'getTransportRequests',
  },
  createTransportRequest: {
    name: 'create_transport_request',
    description: 'Create a new transport request',
    handler: 'transport',
    method: 'createTransportRequest',
  },
  releaseTransportRequest: {
    name: 'release_transport_request',
    description: 'Release a transport request',
    handler: 'transport',
    method: 'releaseTransportRequest',
  },
  addObjectToTransport: {
    name: 'add_object_to_transport',
    description: 'Add an object to a transport request',
    handler: 'transport',
    method: 'addObjectToTransport',
  },
  getTransportContents: {
    name: 'get_transport_contents',
    description: 'Get transport request contents',
    handler: 'transport',
    method: 'getTransportContents',
  },
} as const;

export type ToolName = keyof typeof TOOL_DEFINITIONS;