/**
 * SAP ABAP MCP Server Type Definitions
 * Core types for ADT API integration and MCP tools
 */

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * SAP System Connection Configuration
 */
export interface SAPConnectionConfig {
  /** SAP system host (e.g., myserver.sap.com) */
  host: string;
  /** SAP system port (e.g., 443, 44300) */
  port?: number;
  /** Use HTTPS (default: true) */
  https?: boolean;
  /** SAP system base URL (e.g., https://host:port) - alternative to host/port */
  baseUrl?: string;
  /** SAP client number */
  client: string;
  /** Username for authentication */
  username: string;
  /** Password for authentication */
  password: string;
  /** Allow insecure connections (self-signed certificates) */
  allowInsecure?: boolean;
  /** Optional: SSL certificate validation (deprecated, use allowInsecure) */
  rejectUnauthorized?: boolean;
  /** Optional: Request timeout in milliseconds */
  timeout?: number;
  /** Optional: Language key (e.g., 'EN', 'DE') */
  language?: string;
}

/**
 * MCP Server Configuration
 */
export interface MCPServerConfig {
  /** Server name */
  name: string;
  /** Server version */
  version: string;
  /** SAP connection configuration */
  sapConnection: SAPConnectionConfig;
  /** Enable debug logging */
  debug?: boolean;
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Default package name for creating objects (from SAP_PACKAGE_NAME env var) */
  packageName?: string;
}

// ============================================================================
// ADT API Types
// ============================================================================

/**
 * ADT Discovery Response
 */
export interface ADTDiscovery {
  collections: ADTCollection[];
}

export interface ADTCollection {
  href: string;
  title: string;
  accept?: string[];
  categories?: ADTCategory[];
}

export interface ADTCategory {
  term: string;
  scheme: string;
}

/**
 * ADT Object Types
 */
export type ADTObjectType = 
  | 'TABL'   // Database Table
  | 'DTEL'   // Data Element
  | 'DOMA'   // Domain
  | 'STRU'   // Structure
  | 'TTYP'   // Table Type
  | 'PROG'   // Report Program
  | 'CLAS'   // Class
  | 'INTF'   // Interface
  | 'FUGR'   // Function Group
  | 'FUNC'   // Function Module
  | 'DDLS'   // CDS Data Definition
  | 'DCLS'   // CDS Access Control
  | 'DDLX'   // CDS Metadata Extension
  | 'SRVD'   // Service Definition
  | 'SRVB'   // Service Binding
  | 'DEVC'   // Package
  | 'MSAG'   // Message Class
  | 'NROB'   // Number Range Object
  | 'ENHO'   // Enhancement Implementation
  | 'ENHS'   // Enhancement Spot
  | 'BADI';  // BAdI Implementation

/**
 * ADT Object Base Interface
 */
export interface ADTObject {
  name: string;
  type: ADTObjectType;
  uri: string;
  packageName?: string;
  description?: string;
  responsible?: string;
  createdAt?: string;
  changedAt?: string;
  changedBy?: string;
  masterLanguage?: string;
}

/**
 * ADT Lock Handle
 */
export interface ADTLockHandle {
  lockHandle: string;
  objectUri: string;
  objectType: ADTObjectType;
  lockedAt: Date;
}

// ============================================================================
// DDIC Types
// ============================================================================

/**
 * Data Element Definition
 */
export interface DataElement {
  name: string;
  description: string;
  domainName?: string;
  dataType?: string;
  length?: number;
  decimals?: number;
  fieldLabels?: {
    short?: string;
    medium?: string;
    long?: string;
    heading?: string;
  };
  searchHelp?: string;
  packageName: string;
  transportRequest?: string;
}

/**
 * Domain Definition
 */
export interface Domain {
  name: string;
  description: string;
  dataType: string;
  length: number;
  decimals?: number;
  outputLength?: number;
  conversionRoutine?: string;
  signFlag?: boolean;
  lowercase?: boolean;
  fixedValues?: DomainFixedValue[];
  valueTable?: string;
  packageName: string;
  transportRequest?: string;
}

export interface DomainFixedValue {
  low: string;
  high?: string;
  description: string;
}

/**
 * Database Table Definition
 */
export interface DatabaseTable {
  name: string;
  description: string;
  deliveryClass: 'A' | 'C' | 'L' | 'G' | 'E' | 'S' | 'W';
  maintenanceFlag: boolean;
  fields: TableField[];
  primaryKeys: string[];
  foreignKeys?: ForeignKey[];
  technicalSettings?: TableTechnicalSettings;
  packageName: string;
  transportRequest?: string;
}

export interface TableField {
  name: string;
  dataElement?: string;
  dataType?: string;
  length?: number;
  decimals?: number;
  isKey: boolean;
  isNotNull: boolean;
  description?: string;
}

export interface ForeignKey {
  fieldName: string;
  checkTable: string;
  checkField: string;
  cardinalityLeft: '1' | 'C' | 'N' | 'CN';
  cardinalityRight: '1' | 'C' | 'N' | 'CN';
}

export interface TableTechnicalSettings {
  dataClass: string;
  sizeCategory: number;
  buffering?: 'none' | 'full' | 'single' | 'generic';
  bufferKeyFields?: number;
  logChanges?: boolean;
}

/**
 * Structure Definition
 */
export interface Structure {
  name: string;
  description: string;
  components: StructureComponent[];
  includeStructures?: string[];
  packageName: string;
  transportRequest?: string;
}

export interface StructureComponent {
  name: string;
  dataElement?: string;
  dataType?: string;
  length?: number;
  decimals?: number;
  description?: string;
}

/**
 * Table Type Definition
 */
export interface TableType {
  name: string;
  description: string;
  lineType: string;
  lineTypeKind: 'structure' | 'dataElement' | 'predefined';
  accessMode: 'standard' | 'sorted' | 'hashed' | 'index';
  keyDefinition?: 'standard' | 'empty' | 'components';
  keyComponents?: string[];
  primaryKeyType?: 'unique' | 'nonUnique';
  packageName: string;
  transportRequest?: string;
}

// ============================================================================
// Program Types
// ============================================================================

/**
 * ABAP Class Definition
 */
export interface ABAPClass {
  name: string;
  description: string;
  superClass?: string;
  interfaces?: string[];
  visibility: 'public' | 'protected' | 'private';
  isFinal?: boolean;
  isAbstract?: boolean;
  isForTesting?: boolean;
  friendClasses?: string[];
  attributes?: ClassAttribute[];
  methods?: ClassMethod[];
  packageName: string;
  transportRequest?: string;
}

export interface ClassAttribute {
  name: string;
  visibility: 'public' | 'protected' | 'private';
  isStatic?: boolean;
  isReadOnly?: boolean;
  isConstant?: boolean;
  typeName: string;
  defaultValue?: string;
  description?: string;
}

export interface ClassMethod {
  name: string;
  visibility: 'public' | 'protected' | 'private';
  isStatic?: boolean;
  isAbstract?: boolean;
  isFinal?: boolean;
  isRedefinition?: boolean;
  isForTesting?: boolean;
  parameters?: MethodParameter[];
  exceptions?: string[];
  description?: string;
}

export interface MethodParameter {
  name: string;
  direction: 'importing' | 'exporting' | 'changing' | 'returning';
  typeName: string;
  isOptional?: boolean;
  defaultValue?: string;
  description?: string;
}

/**
 * ABAP Interface Definition
 */
export interface ABAPInterface {
  name: string;
  description: string;
  interfaces?: string[];
  attributes?: InterfaceAttribute[];
  methods?: InterfaceMethod[];
  packageName: string;
  transportRequest?: string;
}

export interface InterfaceAttribute {
  name: string;
  isStatic?: boolean;
  isConstant?: boolean;
  typeName: string;
  defaultValue?: string;
  description?: string;
}

export interface InterfaceMethod {
  name: string;
  isStatic?: boolean;
  parameters?: MethodParameter[];
  exceptions?: string[];
  description?: string;
}

/**
 * Function Group Definition
 */
export interface FunctionGroup {
  name: string;
  description: string;
  functionModules?: string[];
  packageName: string;
  transportRequest?: string;
}

/**
 * Function Module Definition
 */
export interface FunctionModule {
  name: string;
  functionGroup: string;
  description: string;
  importParameters?: FunctionParameter[];
  exportParameters?: FunctionParameter[];
  changingParameters?: FunctionParameter[];
  tableParameters?: FunctionParameter[];
  exceptions?: FunctionException[];
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

export interface FunctionParameter {
  name: string;
  typeName: string;
  isOptional?: boolean;
  defaultValue?: string;
  description?: string;
}

export interface FunctionException {
  name: string;
  description?: string;
}

/**
 * Report Program Definition
 */
export interface ReportProgram {
  name: string;
  description: string;
  programType: 'executable' | 'include' | 'modulePool' | 'subroutinePool';
  fixedPointArithmetic?: boolean;
  unicodeCheck?: boolean;
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

// ============================================================================
// CDS Types
// ============================================================================

/**
 * CDS View Definition
 */
export interface CDSView {
  name: string;
  description: string;
  sqlViewName?: string;
  dataSource: string;
  associations?: CDSAssociation[];
  fields?: CDSField[];
  parameters?: CDSParameter[];
  annotations?: CDSAnnotation[];
  whereCondition?: string;
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

export interface CDSAssociation {
  name: string;
  targetEntity: string;
  cardinality: string;
  onCondition: string;
}

export interface CDSField {
  name: string;
  alias?: string;
  expression?: string;
  annotations?: CDSAnnotation[];
}

export interface CDSParameter {
  name: string;
  typeName: string;
  defaultValue?: string;
  annotations?: CDSAnnotation[];
}

export interface CDSAnnotation {
  name: string;
  value: string | number | boolean | object;
}

/**
 * Service Definition
 */
export interface ServiceDefinition {
  name: string;
  description: string;
  exposedEntities: ExposedEntity[];
  sourceCode?: string;
  packageName: string;
  transportRequest?: string;
}

export interface ExposedEntity {
  entityName: string;
  alias?: string;
  repositoryName?: string;
}

/**
 * Service Binding Definition
 */
export interface ServiceBinding {
  name: string;
  description: string;
  serviceDefinition: string;
  bindingType: 'ODATA_V2' | 'ODATA_V4' | 'ODATA_V2_UI' | 'ODATA_V4_UI';
  serviceUrl?: string;
  packageName: string;
  transportRequest?: string;
}

// ============================================================================
// Testing Types
// ============================================================================

/**
 * Unit Test Result
 */
export interface UnitTestResult {
  className: string;
  methodName: string;
  status: 'passed' | 'failed' | 'skipped' | 'error';
  duration: number;
  message?: string;
  details?: string;
  assertions?: AssertionResult[];
}

export interface AssertionResult {
  type: string;
  expected?: string;
  actual?: string;
  message?: string;
  passed: boolean;
}

/**
 * Test Run Summary
 */
export interface TestRunSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  errors: number;
  duration: number;
  timestamp: Date;
  results: UnitTestResult[];
}

/**
 * Code Coverage Result
 */
export interface CodeCoverageResult {
  objectName: string;
  objectType: ADTObjectType;
  statementCoverage: number;
  branchCoverage?: number;
  procedureCoverage?: number;
  coveredStatements: number;
  totalStatements: number;
  uncoveredLines?: number[];
}

// ============================================================================
// Transport Types
// ============================================================================

/**
 * Transport Request
 */
export interface TransportRequest {
  number: string;
  description: string;
  owner: string;
  status: 'modifiable' | 'released' | 'locked';
  type: 'workbench' | 'customizing';
  targetSystem?: string;
  tasks?: TransportTask[];
  createdAt?: Date;
  releasedAt?: Date;
}

export interface TransportTask {
  number: string;
  description: string;
  owner: string;
  status: 'modifiable' | 'released';
  objects?: TransportObject[];
}

export interface TransportObject {
  pgmid: string;
  objectType: string;
  objectName: string;
  lockFlag?: string;
}

// ============================================================================
// Syntax Check Types
// ============================================================================

/**
 * Syntax Check Result
 */
export interface SyntaxCheckResult {
  hasErrors: boolean;
  hasWarnings: boolean;
  messages: SyntaxMessage[];
}

export interface SyntaxMessage {
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  offset?: number;
  length?: number;
  source?: string;
}

// ============================================================================
// Activation Types
// ============================================================================

/**
 * Activation Result
 */
export interface ActivationResult {
  success: boolean;
  activated: string[];
  failed: string[];
  messages: ActivationMessage[];
}

export interface ActivationMessage {
  objectName: string;
  objectType: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

// ============================================================================
// Search Types
// ============================================================================

/**
 * Object Search Parameters
 */
export interface ObjectSearchParams {
  query: string;
  objectType?: ADTObjectType | ADTObjectType[];
  packageName?: string;
  owner?: string;
  maxResults?: number;
  changedAfter?: Date;
  changedBefore?: Date;
}

/**
 * Object Search Result
 */
export interface ObjectSearchResult {
  objects: ADTObject[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Code Search Parameters
 */
export interface CodeSearchParams {
  pattern: string;
  isRegex?: boolean;
  caseSensitive?: boolean;
  objectType?: ADTObjectType | ADTObjectType[];
  packageName?: string;
  maxResults?: number;
}

/**
 * Code Search Result
 */
export interface CodeSearchResult {
  matches: CodeMatch[];
  totalCount: number;
  hasMore: boolean;
}

export interface CodeMatch {
  objectName: string;
  objectType: ADTObjectType;
  uri: string;
  line: number;
  column: number;
  matchedText: string;
  context: string;
}

// ============================================================================
// Where-Used Types
// ============================================================================

/**
 * Where-Used Result
 */
export interface WhereUsedResult {
  objectName: string;
  objectType: ADTObjectType;
  usages: WhereUsedEntry[];
}

export interface WhereUsedEntry {
  objectName: string;
  objectType: ADTObjectType;
  uri: string;
  usageType: string;
  line?: number;
  column?: number;
}

// ============================================================================
// Debug Types
// ============================================================================

/**
 * Debug Session
 */
export interface DebugSession {
  sessionId: string;
  programName: string;
  status: 'running' | 'suspended' | 'terminated';
  currentLine?: number;
  currentInclude?: string;
  callStack?: StackFrame[];
}

export interface StackFrame {
  level: number;
  programName: string;
  includeName?: string;
  line: number;
  eventType: string;
  eventName: string;
}

/**
 * Breakpoint
 */
export interface Breakpoint {
  id: string;
  programName: string;
  line: number;
  isEnabled: boolean;
  condition?: string;
  hitCount?: number;
}

/**
 * Variable Value
 */
export interface VariableValue {
  name: string;
  type: string;
  value: string;
  isComplex: boolean;
  children?: VariableValue[];
}

// ============================================================================
// Tool Response Types
// ============================================================================

/**
 * Generic Tool Response
 */
export interface ToolResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ToolError;
  warnings?: string[];
}

export interface ToolError {
  code: string;
  message: string;
  details?: string;
  innerError?: Error;
}

/**
 * MCP Tool Input Schemas
 */
export interface CreateDataElementInput {
  name: string;
  description: string;
  domainName?: string;
  dataType?: string;
  length?: number;
  decimals?: number;
  shortText?: string;
  mediumText?: string;
  longText?: string;
  headingText?: string;
  packageName: string;
  transportRequest?: string;
}

export interface CreateDomainInput {
  name: string;
  description: string;
  dataType: string;
  length: number;
  decimals?: number;
  outputLength?: number;
  signFlag?: boolean;
  lowercase?: boolean;
  fixedValues?: Array<{
    low: string;
    high?: string;
    description: string;
  }>;
  packageName: string;
  transportRequest?: string;
}

export interface CreateTableInput {
  name: string;
  description: string;
  deliveryClass: 'A' | 'C' | 'L' | 'G' | 'E' | 'S' | 'W';
  fields: Array<{
    name: string;
    dataElement?: string;
    dataType?: string;
    length?: number;
    decimals?: number;
    isKey: boolean;
    isNotNull: boolean;
  }>;
  packageName: string;
  transportRequest?: string;
}

export interface CreateClassInput {
  name: string;
  description: string;
  superClass?: string;
  interfaces?: string[];
  isAbstract?: boolean;
  isFinal?: boolean;
  packageName: string;
  transportRequest?: string;
}

export interface CreateCDSViewInput {
  name: string;
  description: string;
  sqlViewName?: string;
  sourceCode: string;
  packageName: string;
  transportRequest?: string;
}

export interface ExecuteQueryInput {
  query: string;
  maxRows?: number;
  packageName?: string;
}

export interface RunUnitTestsInput {
  objectName: string;
  objectType: ADTObjectType;
  testMethods?: string[];
  withCoverage?: boolean;
}