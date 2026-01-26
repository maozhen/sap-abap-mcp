/**
 * MCP Tool Test Helper
 * Provides direct MCP tool invocation for integration tests
 * 
 * This helper simulates the MCP protocol by directly calling tools
 * through the same interface as the MCP server, ensuring no functionality
 * is missed in testing.
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { Logger, parseLogLevel } from '../../src/utils/logger';
import { DDICToolHandler } from '../../src/tools/ddic-tools';
import { ProgramToolHandler } from '../../src/tools/program-tools';
import { CDSToolHandler } from '../../src/tools/cds-tools';
import { TestingToolHandler } from '../../src/tools/testing-tools';
import { SystemToolHandler } from '../../src/tools/system-tools';
import { TransportToolHandler } from '../../src/tools/transport-tools';

dotenv.config();

// Color codes for console output
export const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

export interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  toolName?: string;
}

export interface MCPToolResponse<T = unknown> {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  data?: T;
}

/**
 * MCP Tool Test Client
 * Provides direct access to MCP tools for testing
 */
export class MCPToolTestClient {
  private adtClient: ADTClient;
  private logger: Logger;
  private tools: Map<string, { handler: (args: Record<string, unknown>) => Promise<unknown> }> = new Map();

  // Tool handlers
  private ddicHandler: DDICToolHandler;
  private programHandler: ProgramToolHandler;
  private cdsHandler: CDSToolHandler;
  private testingHandler: TestingToolHandler;
  private systemHandler: SystemToolHandler;
  private transportHandler: TransportToolHandler;

  constructor() {
    // Validate environment - support both SAP_URL and SAP_HOST/SAP_PORT formats
    const { SAP_URL, SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD, SAP_SSL } = process.env;
    
    let host: string;
    let port: number;
    let isHttps: boolean;
    
    // Support both SAP_SSL and SAP_USE_TLS for TLS configuration
    const SAP_USE_TLS = process.env.SAP_USE_TLS;
    
    if (SAP_URL) {
      // Parse SAP_URL if provided
      const sapUrl = new URL(SAP_URL);
      isHttps = sapUrl.protocol === 'https:';
      host = sapUrl.hostname;
      port = sapUrl.port ? parseInt(sapUrl.port, 10) : (isHttps ? 443 : 80);
    } else if (SAP_HOST && SAP_PORT) {
      // Use SAP_HOST and SAP_PORT
      host = SAP_HOST;
      port = parseInt(SAP_PORT, 10);
      // Support both SAP_SSL and SAP_USE_TLS environment variables
      isHttps = SAP_SSL === 'true' || SAP_USE_TLS === 'true';
    } else {
      throw new Error('Missing required environment variables: Either SAP_URL or (SAP_HOST + SAP_PORT) must be provided, along with SAP_CLIENT, SAP_USER, SAP_PASSWORD');
    }
    
    if (!SAP_CLIENT || !SAP_USER || !SAP_PASSWORD) {
      throw new Error('Missing required environment variables: SAP_CLIENT, SAP_USER, SAP_PASSWORD');
    }

    this.logger = new Logger({ level: parseLogLevel('info') });

    // Initialize ADT client
    this.adtClient = new ADTClient({
      connection: {
        host,
        port,
        https: isHttps,
        client: SAP_CLIENT,
        username: SAP_USER,
        password: SAP_PASSWORD,
        allowInsecure: true,
      },
      logger: this.logger,
    });

    // Initialize tool handlers
    this.ddicHandler = new DDICToolHandler(this.adtClient, this.logger);
    this.programHandler = new ProgramToolHandler(this.adtClient, this.logger);
    this.cdsHandler = new CDSToolHandler(this.adtClient, this.logger);
    this.testingHandler = new TestingToolHandler(this.adtClient, this.logger);
    this.systemHandler = new SystemToolHandler(this.adtClient, this.logger);
    this.transportHandler = new TransportToolHandler(this.adtClient, this.logger);

    // Register all tools (same as server.ts)
    this.registerAllTools();
  }

  /**
   * Register all MCP tools
   * Mirrors the tool registration in SAPABAPMCPServer
   */
  private registerAllTools(): void {
    // DDIC Tools
    this.registerDDICTools();
    
    // Program Tools
    this.registerProgramTools();
    
    // CDS Tools
    this.registerCDSTools();
    
    // Testing Tools
    this.registerTestingTools();
    
    // System Tools
    this.registerSystemTools();
    
    // Transport Tools
    this.registerTransportTools();
  }

  private registerDDICTools(): void {
    this.tools.set('create_data_element', {
      handler: (args) => this.ddicHandler.createDataElement(this.mapArgs(args)),
    });
    
    this.tools.set('create_domain', {
      handler: (args) => this.ddicHandler.createDomain(this.mapArgs(args)),
    });
    
    this.tools.set('create_database_table', {
      handler: (args) => this.ddicHandler.createDatabaseTable(this.mapArgs(args)),
    });
    
    this.tools.set('create_structure', {
      handler: (args) => {
        const mappedArgs = this.mapArgs<Record<string, unknown>>(args);
        // Map components 'type' to 'dataElement' (MCP schema uses 'type', handler expects 'dataElement')
        if (Array.isArray(mappedArgs.components)) {
          mappedArgs.components = (mappedArgs.components as Array<Record<string, unknown>>).map(comp => {
            const mappedComp = { ...comp };
            if ('type' in comp && !('dataElement' in comp)) {
              mappedComp.dataElement = comp.type;
              delete mappedComp.type;
            }
            return mappedComp;
          });
        }
        return this.ddicHandler.createStructure(mappedArgs as any);
      },
    });
    
    this.tools.set('create_table_type', {
      handler: (args) => this.ddicHandler.createTableType(this.mapArgs(args)),
    });
    
    this.tools.set('get_ddic_object', {
      handler: (args) => {
        // Map objectName to name (MCP schema uses objectName, handler uses name)
        const mappedArgs = {
          ...args,
          name: args.objectName as string,
        };
        return this.ddicHandler.getDDICObject(mappedArgs as any);
      },
    });
    
    this.tools.set('activate_ddic_object', {
      handler: (args) => {
        // Map objectName to name (MCP schema uses objectName, handler uses name)
        const mappedArgs = {
          ...args,
          name: args.objectName as string,
        };
        return this.ddicHandler.activateDDICObject(mappedArgs as any);
      },
    });
    
    this.tools.set('delete_ddic_object', {
      handler: (args) => {
        const mappedArgs = {
          ...args,
          name: args.name as string,
        };
        return this.ddicHandler.deleteDDICObject(mappedArgs as any);
      },
    });
    
    this.tools.set('update_structure', {
      handler: (args) => {
        const mappedArgs = this.mapArgs<Record<string, unknown>>(args);
        // Map components 'type' to 'dataElement' (MCP schema uses 'type', handler expects 'dataElement')
        if (Array.isArray(mappedArgs.components)) {
          mappedArgs.components = (mappedArgs.components as Array<Record<string, unknown>>).map(comp => {
            const mappedComp = { ...comp };
            if ('type' in comp && !('dataElement' in comp)) {
              mappedComp.dataElement = comp.type;
              delete mappedComp.type;
            }
            return mappedComp;
          });
        }
        return this.ddicHandler.updateStructure(mappedArgs as any);
      },
    });
    
    this.tools.set('update_database_table', {
      handler: (args) => {
        const mappedArgs = this.mapArgs<Record<string, unknown>>(args);
        return this.ddicHandler.updateDatabaseTable(mappedArgs as any);
      },
    });
  }

  private registerProgramTools(): void {
    this.tools.set('create_class', {
      handler: (args) => this.programHandler.createClass(this.mapArgs(args)),
    });
    
    this.tools.set('create_interface', {
      handler: (args) => this.programHandler.createInterface(this.mapArgs(args)),
    });
    
    this.tools.set('create_function_group', {
      handler: (args) => this.programHandler.createFunctionGroup(this.mapArgs(args)),
    });
    
    this.tools.set('create_function_module', {
      handler: (args) => this.programHandler.createFunctionModule(this.mapArgs(args)),
    });
    
    this.tools.set('create_report', {
      handler: (args) => {
        const mappedArgs = {
          ...args,
          packageName: args.package as string,
          programType: this.mapReportType(args.reportType as string),
        };
        return this.programHandler.createReportProgram(mappedArgs as any);
      },
    });
    
    this.tools.set('get_source_code', {
      handler: (args) => {
        const mappedArgs = this.mapObjectTypeNameToUri(args);
        return this.programHandler.getSourceCode(mappedArgs as any);
      },
    });
    
    this.tools.set('update_source_code', {
      handler: (args) => {
        const mappedArgs = this.mapObjectTypeNameToUri(args);
        return this.programHandler.updateSourceCode(mappedArgs as any);
      },
    });
    
    this.tools.set('check_syntax', {
      handler: (args) => {
        const mappedArgs = this.mapObjectTypeNameToUri(args);
        return this.programHandler.checkSyntax(mappedArgs as any);
      },
    });
    
    this.tools.set('activate_object', {
      handler: (args) => {
        const mappedArgs = this.mapObjectTypeNameToUri(args);
        return this.programHandler.activateObject(mappedArgs as any);
      },
    });
    
    this.tools.set('search_objects', {
      handler: (args) => {
        // Map 'pattern' to 'query' if needed
        const mappedArgs = {
          ...args,
          query: args.query || args.pattern as string,
        };
        return this.programHandler.searchObjects(mappedArgs as any);
      },
    });
    
    this.tools.set('where_used', {
      handler: (args) => {
        const mappedArgs = this.mapObjectTypeNameToUri(args);
        return this.programHandler.whereUsed(mappedArgs as any);
      },
    });
    
    this.tools.set('get_object_metadata', {
      handler: (args) => {
        const mappedArgs = this.mapObjectTypeNameToUri(args);
        return this.programHandler.getObjectMetadata(mappedArgs as any);
      },
    });
  }

  private registerCDSTools(): void {
    this.tools.set('create_cds_view', {
      handler: (args) => this.cdsHandler.createCDSView(this.mapArgs(args)),
    });
    
    this.tools.set('create_service_definition', {
      handler: (args) => this.cdsHandler.createServiceDefinition(this.mapArgs(args)),
    });
    
    this.tools.set('create_service_binding', {
      handler: (args) => this.cdsHandler.createServiceBinding(this.mapArgs(args)),
    });
    
    this.tools.set('get_cds_view', {
      handler: (args) => this.cdsHandler.getCDSView(args as any),
    });
    
    this.tools.set('get_service_binding_url', {
      handler: (args) => this.cdsHandler.getServiceBindingUrl(args as any),
    });
    
    this.tools.set('get_cds_source', {
      handler: (args) => this.cdsHandler.getCDSSource(args as any),
    });
    
    this.tools.set('update_cds_source', {
      handler: (args) => this.cdsHandler.updateCDSSource(args as any),
    });
    
    this.tools.set('activate_cds_object', {
      handler: (args) => this.cdsHandler.activateCDSObject(args as any),
    });
  }

  private registerTestingTools(): void {
    this.tools.set('run_unit_tests', {
      handler: (args) => this.testingHandler.runUnitTests(args as any),
    });
    
    this.tools.set('get_test_coverage', {
      handler: (args) => this.testingHandler.getTestCoverage(args as any),
    });
    
    this.tools.set('get_test_results', {
      handler: (args) => this.testingHandler.getTestResults(args as any),
    });
    
    this.tools.set('analyze_test_class', {
      handler: (args) => this.testingHandler.analyzeTestClass(args as any),
    });
  }

  private registerSystemTools(): void {
    this.tools.set('get_system_info', {
      handler: (args) => this.systemHandler.getSystemInfo(args as any),
    });
    
    this.tools.set('get_package_info', {
      handler: (args) => this.systemHandler.getPackageInfo(args as any),
    });
    
    this.tools.set('create_package', {
      handler: (args) => this.systemHandler.createPackage(args as any),
    });
    
    this.tools.set('get_message_class', {
      handler: (args) => this.systemHandler.getMessageClass(args as any),
    });
    
    this.tools.set('create_message_class', {
      handler: (args) => this.systemHandler.createMessageClass(args as any),
    });
    
    this.tools.set('get_number_range', {
      handler: (args) => this.systemHandler.getNumberRange(args as any),
    });
    
    this.tools.set('create_number_range', {
      handler: (args) => this.systemHandler.createNumberRange(args as any),
    });
  }

  private registerTransportTools(): void {
    this.tools.set('get_transport_requests', {
      handler: (args) => this.transportHandler.getTransportRequests(args as any),
    });
    
    this.tools.set('create_transport_request', {
      handler: (args) => this.transportHandler.createTransportRequest(args as any),
    });
    
    this.tools.set('add_object_to_transport', {
      handler: (args) => this.transportHandler.addObjectToTransport(args as any),
    });
    
    this.tools.set('release_transport_request', {
      handler: (args) => this.transportHandler.releaseTransportRequest(args as any),
    });
    
    this.tools.set('get_transport_contents', {
      handler: (args) => this.transportHandler.getTransportContents(args as any),
    });
  }

  /**
   * Map MCP schema property names to handler input property names
   */
  private mapArgs<T>(args: Record<string, unknown>): T {
    const mapped: Record<string, unknown> = { ...args };
    
    // Map 'package' to 'packageName'
    if ('package' in args && !('packageName' in args)) {
      mapped.packageName = args.package;
    }
    
    // Map 'domain' to 'domainName' for data elements
    if ('domain' in args && !('domainName' in args)) {
      mapped.domainName = args.domain;
    }
    
    return mapped as T;
  }

  /**
   * Map objectType + objectName to objectUri
   * Converts MCP schema input (objectType, objectName) to handler input (objectUri)
   */
  private mapObjectTypeNameToUri(args: Record<string, unknown>): Record<string, unknown> {
    const mapped: Record<string, unknown> = { ...args };
    
    // If objectUri is already provided, use it directly
    if (args.objectUri) {
      return mapped;
    }
    
    const objectType = args.objectType as string;
    const objectName = args.objectName as string;
    
    if (!objectType || !objectName) {
      return mapped;
    }
    
    // URI prefix mapping based on object type
    const uriPrefixes: Record<string, string> = {
      'CLAS': '/sap/bc/adt/oo/classes/',
      'INTF': '/sap/bc/adt/oo/interfaces/',
      'FUGR': '/sap/bc/adt/functions/groups/',
      'FUNC': '/sap/bc/adt/functions/',
      'PROG': '/sap/bc/adt/programs/programs/',
      'REPS': '/sap/bc/adt/programs/programs/',
      'INCL': '/sap/bc/adt/programs/includes/',
    };
    
    const prefix = uriPrefixes[objectType.toUpperCase()];
    if (prefix) {
      mapped.objectUri = `${prefix}${objectName.toLowerCase()}`;
    }
    
    return mapped;
  }

  /**
   * Map report type from MCP schema values to handler input values
   */
  private mapReportType(reportType: string | undefined): 'executable' | 'include' | 'modulePool' | 'subroutinePool' {
    if (!reportType) return 'executable';
    
    const mapping: Record<string, 'executable' | 'include' | 'modulePool' | 'subroutinePool'> = {
      'EXECUTABLE': 'executable',
      'INCLUDE': 'include',
      'MODULE_POOL': 'modulePool',
      'SUBROUTINE_POOL': 'subroutinePool',
      'executable': 'executable',
      'include': 'include',
      'modulePool': 'modulePool',
      'subroutinePool': 'subroutinePool',
    };
    
    return mapping[reportType] || 'executable';
  }

  /**
   * Call an MCP tool directly
   * This simulates the MCP protocol call
   */
  async callTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<MCPToolResponse<T>> {
    const startTime = Date.now();
    
    const toolDef = this.tools.get(name);
    if (!toolDef) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
        isError: true,
      };
    }

    try {
      const result = await toolDef.handler(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        data: result as T,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: errorMsg }) }],
        isError: true,
      };
    }
  }

  /**
   * List all available tools
   */
  listTools(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Get tool count
   */
  getToolCount(): number {
    return this.tools.size;
  }

  /**
   * Get connection info for logging
   */
  getConnectionInfo(): { url: string; client: string; user: string } {
    const { SAP_URL, SAP_HOST, SAP_PORT, SAP_SSL, SAP_CLIENT, SAP_USER } = process.env;
    let url = SAP_URL || '';
    if (!url && SAP_HOST && SAP_PORT) {
      const protocol = SAP_SSL === 'true' ? 'https' : 'http';
      url = `${protocol}://${SAP_HOST}:${SAP_PORT}`;
    }
    return {
      url,
      client: SAP_CLIENT || '',
      user: SAP_USER || '',
    };
  }
}

// Test configuration
export const TEST_PREFIX = 'YMCP_';
export const PACKAGE_NAME = '$TMP';

/**
 * Logging utility
 */
export function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Test runner utility
 */
export class TestRunner {
  private results: TestResult[] = [];
  private client: MCPToolTestClient;
  private categoryName: string;

  constructor(client: MCPToolTestClient, categoryName: string) {
    this.client = client;
    this.categoryName = categoryName;
  }

  /**
   * Run a test that calls an MCP tool
   */
  async runToolTest(
    testName: string,
    toolName: string,
    args: Record<string, unknown>,
    validator?: (response: MCPToolResponse) => void
  ): Promise<void> {
    const start = Date.now();
    log(`\n▶ Running: ${testName}`, 'cyan');
    log(`  Tool: ${toolName}`, 'gray');
    
    try {
      const response = await this.client.callTool(toolName, args);
      
      if (response.isError) {
        throw new Error(`Tool returned error: ${response.content[0]?.text}`);
      }
      
      if (validator) {
        validator(response);
      }
      
      const duration = Date.now() - start;
      this.results.push({ name: testName, success: true, duration, toolName });
      log(`✓ ${testName} passed (${duration}ms)`, 'green');
    } catch (error) {
      const duration = Date.now() - start;
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.results.push({ name: testName, success: false, duration, error: errorMsg, toolName });
      log(`✗ ${testName} failed: ${errorMsg}`, 'red');
    }
  }

  /**
   * Run a custom test
   */
  async runTest(testName: string, fn: () => Promise<void>): Promise<void> {
    const start = Date.now();
    log(`\n▶ Running: ${testName}`, 'cyan');
    
    try {
      await fn();
      const duration = Date.now() - start;
      this.results.push({ name: testName, success: true, duration });
      log(`✓ ${testName} passed (${duration}ms)`, 'green');
    } catch (error) {
      const duration = Date.now() - start;
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.results.push({ name: testName, success: false, duration, error: errorMsg });
      log(`✗ ${testName} failed: ${errorMsg}`, 'red');
    }
  }

  /**
   * Print test summary
   */
  printSummary(): void {
    log('\n' + '='.repeat(60), 'cyan');
    log(`${this.categoryName.toUpperCase()} MCP TOOLS INTEGRATION TEST SUMMARY`, 'cyan');
    log('='.repeat(60), 'cyan');
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    // Group results by tool name
    const toolResults = new Map<string, TestResult[]>();
    for (const result of this.results) {
      const key = result.toolName || 'custom';
      if (!toolResults.has(key)) {
        toolResults.set(key, []);
      }
      toolResults.get(key)!.push(result);
    }
    
    for (const [toolName, results] of toolResults) {
      log(`\n${toolName}:`, 'blue');
      for (const result of results) {
        const icon = result.success ? '✓' : '✗';
        const color = result.success ? 'green' : 'red';
        log(`  ${icon} ${result.name} (${result.duration}ms)`, color);
        if (result.error) {
          log(`    Error: ${result.error}`, 'gray');
        }
      }
    }
    
    log('\n' + '-'.repeat(60), 'cyan');
    log(`Total: ${passed + failed} tests, ${passed} passed, ${failed} failed`, passed === this.results.length ? 'green' : 'red');
    log(`Duration: ${totalDuration}ms`, 'gray');
  }

  /**
   * Get test results
   */
  getResults(): TestResult[] {
    return this.results;
  }

  /**
   * Get failed count
   */
  getFailedCount(): number {
    return this.results.filter(r => !r.success).length;
  }

  /**
   * Get client
   */
  getClient(): MCPToolTestClient {
    return this.client;
  }
}