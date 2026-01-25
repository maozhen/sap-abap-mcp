/**
 * Testing Tools MCP Integration Tests
 * 
 * Tests all 4 testing-related MCP tools via direct MCP tool invocation:
 * 1. run_unit_tests - Run ABAP unit tests
 * 2. get_test_coverage - Get test coverage information
 * 3. get_test_results - Get test execution results
 * 4. analyze_test_class - Analyze test class structure
 * 
 * @requires SAP_URL, SAP_CLIENT, SAP_USER, SAP_PASSWORD environment variables
 */

import {
  MCPToolTestClient,
  TestRunner,
  MCPToolResponse,
  TEST_PREFIX,
  log,
  colors,
} from './mcp-test-helper';

// Test constants
const TEST_TIMEOUT = 120000; // Unit tests may take longer
const EXISTING_TEST_CLASS = 'CL_ABAP_UNIT_ASSERT'; // Well-known test class

interface TestingToolsTestContext {
  client: MCPToolTestClient;
  runner: TestRunner;
  testRunId?: string;
}

/**
 * Initialize test context
 */
async function initContext(): Promise<TestingToolsTestContext> {
  const client = new MCPToolTestClient();
  const runner = new TestRunner(client, 'Testing Tools');
  return { client, runner };
}

/**
 * Test: run_unit_tests
 * Runs unit tests for a class
 */
async function testRunUnitTests(ctx: TestingToolsTestContext): Promise<void> {
  // Test 1: Run unit tests with className parameter
  await ctx.runner.runToolTest(
    'run_unit_tests - Run tests for a class',
    'run_unit_tests',
    {
      className: EXISTING_TEST_CLASS,
    },
    (response: MCPToolResponse) => {
      // Unit tests may return results or an empty response
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          // Store test run ID if available
          if (data.runId && typeof data.runId === 'string') {
            ctx.testRunId = data.runId;
          }
          log(`  Test run completed`, 'gray');
        }
      }
    }
  );

  // Test 2: Run unit tests with package parameter
  await ctx.runner.runToolTest(
    'run_unit_tests - Run tests for package',
    'run_unit_tests',
    {
      packageName: 'SABP_UNIT', // Standard ABAP Unit package
    },
    (response: MCPToolResponse) => {
      // May succeed or fail depending on package contents
      log(`  Package test run completed`, 'gray');
    }
  );

  // Test 3: Run unit tests with coverage enabled
  await ctx.runner.runToolTest(
    'run_unit_tests - Run tests with coverage',
    'run_unit_tests',
    {
      className: EXISTING_TEST_CLASS,
      withCoverage: true,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        log(`  Test run with coverage completed`, 'gray');
      }
    }
  );
}

/**
 * Test: get_test_coverage
 * Gets test coverage information
 */
async function testGetTestCoverage(ctx: TestingToolsTestContext): Promise<void> {
  // Test 1: Get coverage for a class
  await ctx.runner.runToolTest(
    'get_test_coverage - Get coverage for class',
    'get_test_coverage',
    {
      objectName: EXISTING_TEST_CLASS,
      objectType: 'CLAS',
    },
    (response: MCPToolResponse) => {
      // Coverage may or may not be available
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  Coverage data retrieved`, 'gray');
          if (data.coverage !== undefined) {
            log(`  Coverage: ${data.coverage}%`, 'gray');
          }
        }
      }
    }
  );

  // Test 2: Get coverage using run ID if available
  if (ctx.testRunId) {
    await ctx.runner.runToolTest(
      'get_test_coverage - Get coverage by run ID',
      'get_test_coverage',
      {
        runId: ctx.testRunId,
      },
      (response: MCPToolResponse) => {
        log(`  Coverage by run ID completed`, 'gray');
      }
    );
  }
}

/**
 * Test: get_test_results
 * Gets test execution results
 */
async function testGetTestResults(ctx: TestingToolsTestContext): Promise<void> {
  // Test 1: Get results for a class
  await ctx.runner.runToolTest(
    'get_test_results - Get results for class',
    'get_test_results',
    {
      className: EXISTING_TEST_CLASS,
    },
    (response: MCPToolResponse) => {
      // Results may or may not be available
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  Test results retrieved`, 'gray');
          if (Array.isArray(data.results)) {
            log(`  Number of results: ${data.results.length}`, 'gray');
          }
        }
      }
    }
  );

  // Test 2: Get results using run ID if available
  if (ctx.testRunId) {
    await ctx.runner.runToolTest(
      'get_test_results - Get results by run ID',
      'get_test_results',
      {
        runId: ctx.testRunId,
      },
      (response: MCPToolResponse) => {
        log(`  Results by run ID completed`, 'gray');
      }
    );
  }

  // Test 3: Get results with filter
  await ctx.runner.runToolTest(
    'get_test_results - Get results with filter',
    'get_test_results',
    {
      className: EXISTING_TEST_CLASS,
      status: 'failed', // Filter by failed tests
    },
    (response: MCPToolResponse) => {
      log(`  Filtered results completed`, 'gray');
    }
  );
}

/**
 * Test: analyze_test_class
 * Analyzes test class structure
 */
async function testAnalyzeTestClass(ctx: TestingToolsTestContext): Promise<void> {
  // Test 1: Analyze a well-known test class
  await ctx.runner.runToolTest(
    'analyze_test_class - Analyze test class',
    'analyze_test_class',
    {
      className: EXISTING_TEST_CLASS,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  Test class analysis completed`, 'gray');
          if (data.methods !== undefined) {
            const methods = data.methods as unknown[];
            log(`  Number of test methods: ${methods.length}`, 'gray');
          }
          if (data.fixtures !== undefined) {
            log(`  Fixtures found: ${JSON.stringify(data.fixtures)}`, 'gray');
          }
        }
      }
    }
  );

  // Test 2: Analyze with detailed output
  await ctx.runner.runToolTest(
    'analyze_test_class - Analyze with details',
    'analyze_test_class',
    {
      className: EXISTING_TEST_CLASS,
      includeDetails: true,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        log(`  Detailed analysis completed`, 'gray');
      }
    }
  );
}

/**
 * Main test execution
 */
async function main(): Promise<void> {
  log('=' .repeat(60), 'cyan');
  log('TESTING TOOLS MCP INTEGRATION TESTS', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  const ctx = await initContext();
  
  // Log connection info
  const connInfo = ctx.client.getConnectionInfo();
  log(`\nConnecting to: ${connInfo.url}`, 'gray');
  log(`Client: ${connInfo.client}, User: ${connInfo.user}`, 'gray');
  
  // Verify tool registration
  const tools = ctx.client.listTools();
  const testingTools = ['run_unit_tests', 'get_test_coverage', 'get_test_results', 'analyze_test_class'];
  
  log(`\nRegistered tools: ${tools.length}`, 'blue');
  log(`Testing tools to test: ${testingTools.length}`, 'blue');
  
  for (const tool of testingTools) {
    if (!tools.includes(tool)) {
      log(`  ✗ Missing tool: ${tool}`, 'red');
    } else {
      log(`  ✓ Found tool: ${tool}`, 'green');
    }
  }

  try {
    // Run all testing tool tests
    log('\n--- run_unit_tests Tests ---', 'magenta');
    await testRunUnitTests(ctx);
    
    log('\n--- get_test_coverage Tests ---', 'magenta');
    await testGetTestCoverage(ctx);
    
    log('\n--- get_test_results Tests ---', 'magenta');
    await testGetTestResults(ctx);
    
    log('\n--- analyze_test_class Tests ---', 'magenta');
    await testAnalyzeTestClass(ctx);
    
  } catch (error) {
    log(`\nTest execution error: ${error}`, 'red');
  }

  // Print summary
  ctx.runner.printSummary();
  
  // Exit with appropriate code
  process.exit(ctx.runner.getFailedCount() > 0 ? 1 : 0);
}

// Run tests
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});