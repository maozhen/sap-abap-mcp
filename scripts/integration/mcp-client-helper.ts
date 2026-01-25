/**
 * MCP Client Test Helper
 * Provides true MCP client that spawns server process and communicates via stdio
 * 
 * This helper creates a real MCP client that:
 * 1. Spawns the MCP server as a child process
 * 2. Connects via stdio transport (just like production)
 * 3. Calls tools through MCP protocol
 * 
 * This ensures test environment matches production environment.
 */

import * as dotenv from 'dotenv';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

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
 * True MCP Client for Integration Tests
 * Spawns server process and communicates via MCP protocol
 */
export class MCPClientTestHelper {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private serverProcess: ChildProcess | null = null;
  private connected: boolean = false;

  constructor() {
    // Validate environment variables
    const { SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD } = process.env;
    
    if (!SAP_HOST || !SAP_PORT || !SAP_CLIENT || !SAP_USER || !SAP_PASSWORD) {
      throw new Error(
        'Missing required environment variables: SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD'
      );
    }
  }

  /**
   * Connect to the MCP server
   * Spawns the server process and establishes stdio connection
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    // Build environment variables for the server process
    // Filter out undefined values to satisfy Record<string, string> type
    const baseEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        baseEnv[key] = value;
      }
    }
    
    // Override with required SAP config (we've validated these exist in constructor)
    const serverEnv: Record<string, string> = {
      ...baseEnv,
      SAP_HOST: process.env.SAP_HOST!,
      SAP_PORT: process.env.SAP_PORT!,
      SAP_CLIENT: process.env.SAP_CLIENT!,
      SAP_USER: process.env.SAP_USER!,
      SAP_PASSWORD: process.env.SAP_PASSWORD!,
      SAP_USE_TLS: process.env.SAP_USE_TLS || 'false',
      SAP_ALLOW_INSECURE: process.env.SAP_ALLOW_INSECURE || 'true',
      LOG_LEVEL: process.env.LOG_LEVEL || 'error', // Use error level to reduce noise
    };

    // Path to the server entry point
    const serverPath = path.resolve(__dirname, '../../dist/index.js');

    // Create stdio transport - this will spawn the server process
    this.transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath],
      env: serverEnv,
    });

    // Create MCP client
    this.client = new Client(
      {
        name: 'mcp-integration-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    // Connect client to transport
    await this.client.connect(this.transport);
    this.connected = true;
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }
      
      if (this.transport) {
        await this.transport.close();
        this.transport = null;
      }
    } catch (error) {
      // Ignore errors during cleanup
    }

    this.connected = false;
  }

  /**
   * List all available tools from the server
   */
  async listTools(): Promise<string[]> {
    if (!this.client || !this.connected) {
      throw new Error('Client not connected. Call connect() first.');
    }

    const response = await this.client.listTools();
    return response.tools.map(tool => tool.name);
  }

  /**
   * Get tool count
   */
  async getToolCount(): Promise<number> {
    const tools = await this.listTools();
    return tools.length;
  }

  /**
   * Call an MCP tool
   * This sends the request through the MCP protocol to the server
   */
  async callTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<MCPToolResponse<T>> {
    if (!this.client || !this.connected) {
      throw new Error('Client not connected. Call connect() first.');
    }

    try {
      const response = await this.client.callTool({
        name,
        arguments: args,
      });

      // Parse the response content
      const content = response.content as Array<{ type: string; text: string }>;
      let data: T | undefined;
      let isError = Boolean(response.isError);

      // Try to parse JSON from text content
      if (content && content.length > 0 && content[0].type === 'text') {
        try {
          data = JSON.parse(content[0].text) as T;
          // Check if the parsed data indicates an error
          if ((data as any)?.error) {
            isError = true;
          }
        } catch {
          // Content is not JSON, that's okay
        }
      }

      return {
        content,
        isError,
        data,
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
   * Get connection info for logging
   */
  getConnectionInfo(): { host: string; port: string; client: string; user: string } {
    return {
      host: process.env.SAP_HOST || '',
      port: process.env.SAP_PORT || '',
      client: process.env.SAP_CLIENT || '',
      user: process.env.SAP_USER || '',
    };
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

// Test configuration
export const TEST_PREFIX = 'YMCP';
export const PACKAGE_NAME = '$TMP';

/**
 * Generate unique test object name with timestamp
 */
export function generateTestName(prefix: string, suffix: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${TEST_PREFIX}${suffix}${timestamp}`;
}

/**
 * Logging utility
 */
export function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Test runner utility for MCP client tests
 */
export class MCPTestRunner {
  private results: TestResult[] = [];
  private client: MCPClientTestHelper;
  private categoryName: string;

  constructor(client: MCPClientTestHelper, categoryName: string) {
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
    log(`${this.categoryName.toUpperCase()} MCP CLIENT INTEGRATION TEST SUMMARY`, 'cyan');
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
  getClient(): MCPClientTestHelper {
    return this.client;
  }
}

/**
 * Create and connect MCP client for tests
 * Returns connected client ready for use
 */
export async function createMCPClient(): Promise<MCPClientTestHelper> {
  const client = new MCPClientTestHelper();
  await client.connect();
  return client;
}

/**
 * Run tests with automatic client lifecycle management
 */
export async function runMCPTests(
  categoryName: string,
  testFn: (runner: MCPTestRunner, client: MCPClientTestHelper) => Promise<void>
): Promise<number> {
  log(`${categoryName} MCP Client Integration Tests`, 'cyan');
  log('='.repeat(60), 'cyan');
  log('Testing tools via true MCP protocol (stdio transport)', 'yellow');
  log('Server process spawned separately - matches production environment', 'yellow');
  
  let client: MCPClientTestHelper | null = null;
  
  try {
    // Create and connect client
    log('\nConnecting to MCP server...', 'gray');
    client = await createMCPClient();
    
    // Log connection info
    const connInfo = client.getConnectionInfo();
    log(`SAP Host: ${connInfo.host}:${connInfo.port}`, 'gray');
    log(`SAP Client: ${connInfo.client}`, 'gray');
    log(`SAP User: ${connInfo.user}`, 'gray');
    
    // Get tool count
    const toolCount = await client.getToolCount();
    log(`Registered tools: ${toolCount}`, 'gray');
    
    // Create test runner
    const runner = new MCPTestRunner(client, categoryName);
    
    // Run tests
    await testFn(runner, client);
    
    // Print summary
    runner.printSummary();
    
    return runner.getFailedCount();
  } catch (error) {
    log(`Fatal error: ${error}`, 'red');
    return 1;
  } finally {
    // Disconnect client
    if (client) {
      try {
        await client.disconnect();
        log('\nDisconnected from MCP server', 'gray');
      } catch {
        // Ignore disconnect errors
      }
    }
  }
}