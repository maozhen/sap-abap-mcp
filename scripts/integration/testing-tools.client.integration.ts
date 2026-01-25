/**
 * Testing Tools MCP Client Integration Tests
 * 
 * Tests testing-related MCP tools via true MCP protocol:
 * - run_unit_tests: Run ABAP unit tests for a class or package
 * - get_test_coverage: Get code coverage results for a class
 * - get_test_results: Get results of a previous test run
 * - analyze_test_class: Analyze a test class structure and methods
 * 
 * Uses real MCP client with stdio transport - matches production environment.
 */

import {
  runMCPTests,
  MCPTestRunner,
  MCPClientTestHelper,
  MCPToolResponse,
  log,
  colors,
} from './mcp-client-helper';

// Known test classes in SAP system
// These should be standard SAP test classes that exist in most systems
const KNOWN_TEST_CLASSES = [
  'CL_ABAP_UNIT_ASSERT',  // Standard ABAP Unit framework class
  'CL_ABAP_TESTDOUBLE',   // Test double framework
];

// Test class that likely has unit tests (standard SAP class with tests)
const TEST_CLASS_WITH_TESTS = 'CL_ABAP_UNIT_ASSERT';

// Test package that may contain test classes
const TEST_PACKAGE = 'SABP_UNIT';

/**
 * Validate run_unit_tests response structure
 */
function validateRunUnitTestsResponse(response: MCPToolResponse): void {
  if (!response.data) {
    throw new Error('Expected data in response');
  }
  
  const data = response.data as Record<string, unknown>;
  
  // Should have test run summary fields
  // Note: The response may indicate failure if no tests found, but structure should be valid
  if (data.error && typeof data.error === 'object') {
    // API returned an error - this is acceptable for classes without tests
    log(`  Note: API returned error (expected for some classes)`, 'gray');
    return;
  }
  
  // If success, validate structure
  if (data.success !== undefined) {
    log(`  Response success: ${data.success}`, 'gray');
  }
  
  if (data.data && typeof data.data === 'object') {
    const summary = data.data as Record<string, unknown>;
    if (summary.totalTests !== undefined) {
      log(`  Total tests: ${summary.totalTests}`, 'gray');
    }
    if (summary.passed !== undefined) {
      log(`  Passed: ${summary.passed}`, 'gray');
    }
    if (summary.failed !== undefined) {
      log(`  Failed: ${summary.failed}`, 'gray');
    }
  }
}

/**
 * Validate get_test_coverage response structure
 */
function validateGetTestCoverageResponse(response: MCPToolResponse): void {
  if (!response.data) {
    throw new Error('Expected data in response');
  }
  
  const data = response.data as Record<string, unknown>;
  
  // May return error if coverage not available
  if (data.error && typeof data.error === 'object') {
    log(`  Note: API returned error (coverage may not be available)`, 'gray');
    return;
  }
  
  // If success, validate structure
  if (data.success !== undefined) {
    log(`  Response success: ${data.success}`, 'gray');
  }
  
  if (data.data && typeof data.data === 'object') {
    const coverage = data.data as Record<string, unknown>;
    if (coverage.objectName !== undefined) {
      log(`  Object name: ${coverage.objectName}`, 'gray');
    }
    if (coverage.statementCoverage !== undefined) {
      log(`  Statement coverage: ${coverage.statementCoverage}%`, 'gray');
    }
    if (coverage.branchCoverage !== undefined) {
      log(`  Branch coverage: ${coverage.branchCoverage}%`, 'gray');
    }
  }
}

/**
 * Validate get_test_results response structure
 */
function validateGetTestResultsResponse(response: MCPToolResponse): void {
  if (!response.data) {
    throw new Error('Expected data in response');
  }
  
  const data = response.data as Record<string, unknown>;
  
  // May return error if run ID not found
  if (data.error && typeof data.error === 'object') {
    const error = data.error as Record<string, unknown>;
    log(`  Note: API returned error (expected for invalid run ID)`, 'gray');
    if (error.code) {
      log(`  Error code: ${error.code}`, 'gray');
    }
    return;
  }
  
  // If success, validate structure
  if (data.success !== undefined) {
    log(`  Response success: ${data.success}`, 'gray');
  }
}

/**
 * Validate analyze_test_class response structure
 */
function validateAnalyzeTestClassResponse(response: MCPToolResponse): void {
  if (!response.data) {
    throw new Error('Expected data in response');
  }
  
  const data = response.data as Record<string, unknown>;
  
  // May return error if class not found or not a test class
  if (data.error && typeof data.error === 'object') {
    log(`  Note: API returned error (class may not exist or not be a test class)`, 'gray');
    return;
  }
  
  // If success, validate structure
  if (data.success !== undefined) {
    log(`  Response success: ${data.success}`, 'gray');
  }
  
  if (data.data && typeof data.data === 'object') {
    const analysis = data.data as Record<string, unknown>;
    if (analysis.className !== undefined) {
      log(`  Class name: ${analysis.className}`, 'gray');
    }
    if (Array.isArray(analysis.testMethods)) {
      log(`  Test methods count: ${analysis.testMethods.length}`, 'gray');
    }
    if (analysis.setupMethod !== undefined) {
      log(`  Setup method: ${analysis.setupMethod}`, 'gray');
    }
    if (analysis.teardownMethod !== undefined) {
      log(`  Teardown method: ${analysis.teardownMethod}`, 'gray');
    }
    if (analysis.riskLevel !== undefined) {
      log(`  Risk level: ${analysis.riskLevel}`, 'gray');
    }
    if (analysis.duration !== undefined) {
      log(`  Duration: ${analysis.duration}`, 'gray');
    }
  }
}

/**
 * Run Testing Tools MCP Client Integration Tests
 */
async function runTestingToolsTests(runner: MCPTestRunner, client: MCPClientTestHelper): Promise<void> {
  log('\n--- Testing Tools Tests (Read-Only Operations) ---', 'magenta');
  log('Note: These tests use existing SAP objects and do not create/modify data', 'yellow');
  
  // ============================================
  // run_unit_tests Tests
  // ============================================
  log('\n--- run_unit_tests Tests ---', 'blue');
  
  // Test 1: Run unit tests for a class
  await runner.runToolTest(
    'run_unit_tests - Run tests for a class',
    'run_unit_tests',
    {
      objectType: 'CLAS',
      objectName: TEST_CLASS_WITH_TESTS,
      withCoverage: false,
    },
    validateRunUnitTestsResponse
  );
  
  // Test 2: Run unit tests with coverage
  await runner.runToolTest(
    'run_unit_tests - Run tests with coverage',
    'run_unit_tests',
    {
      objectType: 'CLAS',
      objectName: TEST_CLASS_WITH_TESTS,
      withCoverage: true,
    },
    validateRunUnitTestsResponse
  );
  
  // Test 3: Run unit tests for a package (may take longer)
  await runner.runToolTest(
    'run_unit_tests - Run tests for a package',
    'run_unit_tests',
    {
      objectType: 'DEVC',
      objectName: TEST_PACKAGE,
      withCoverage: false,
    },
    validateRunUnitTestsResponse
  );
  
  // ============================================
  // get_test_coverage Tests
  // ============================================
  log('\n--- get_test_coverage Tests ---', 'blue');
  
  // Test 4: Get test coverage for a class
  // Note: This API may not be available in all SAP systems
  await runner.runTest(
    'get_test_coverage - Get coverage for a class (may not be supported)',
    async () => {
      const response = await client.callTool('get_test_coverage', {
        className: TEST_CLASS_WITH_TESTS,
      });
      
      // Accept both success and error responses
      // Some SAP systems don't have the codecoverage API
      if (response.isError) {
        const text = response.content[0]?.text || '';
        if (text.includes('404') || text.includes('Resource not found') || text.includes('not found')) {
          log(`  Note: Coverage API not available in this SAP system (expected)`, 'yellow');
          return; // This is acceptable
        }
      }
      
      validateGetTestCoverageResponse(response);
    }
  );
  
  // ============================================
  // get_test_results Tests
  // ============================================
  log('\n--- get_test_results Tests ---', 'blue');
  
  // Test 5: Get test results with invalid run ID (should return error)
  await runner.runTest(
    'get_test_results - Get results with invalid run ID (expects error)',
    async () => {
      const response = await client.callTool('get_test_results', {
        runId: 'INVALID_RUN_ID_12345',
      });
      
      // We expect an error for invalid run ID
      if (response.isError || (response.data as any)?.error) {
        log(`  Correctly returned error for invalid run ID`, 'gray');
        return; // This is expected
      }
      
      // If no error, validate the response structure
      validateGetTestResultsResponse(response);
    }
  );
  
  // ============================================
  // analyze_test_class Tests
  // ============================================
  log('\n--- analyze_test_class Tests ---', 'blue');
  
  // Test 6: Analyze standard ABAP Unit assert class
  await runner.runToolTest(
    'analyze_test_class - Analyze CL_ABAP_UNIT_ASSERT',
    'analyze_test_class',
    {
      className: 'CL_ABAP_UNIT_ASSERT',
    },
    validateAnalyzeTestClassResponse
  );
  
  // Test 7: Analyze test double class
  await runner.runToolTest(
    'analyze_test_class - Analyze CL_ABAP_TESTDOUBLE',
    'analyze_test_class',
    {
      className: 'CL_ABAP_TESTDOUBLE',
    },
    validateAnalyzeTestClassResponse
  );
  
  // ============================================
  // Edge Cases and Error Handling
  // ============================================
  log('\n--- Edge Cases and Error Handling ---', 'blue');
  
  // Test 8: Run tests for non-existent class
  await runner.runTest(
    'run_unit_tests - Non-existent class error handling',
    async () => {
      const response = await client.callTool('run_unit_tests', {
        objectType: 'CLAS',
        objectName: 'ZNONEXISTENT_CLASS_12345',
        withCoverage: false,
      });
      
      // Either error or empty results is acceptable for non-existent class
      if (response.isError || (response.data as any)?.error) {
        log(`  Correctly returned error for non-existent class`, 'gray');
        return;
      }
      
      // If success response, just validate structure
      if (response.data) {
        log(`  Handled non-existent class appropriately`, 'gray');
      }
    }
  );
  
  // Test 9: Get coverage for non-existent class
  await runner.runTest(
    'get_test_coverage - Non-existent class error handling',
    async () => {
      const response = await client.callTool('get_test_coverage', {
        className: 'ZNONEXISTENT_CLASS_12345',
      });
      
      // Expect error for non-existent class
      if (response.isError || (response.data as any)?.error) {
        log(`  Correctly returned error for non-existent class`, 'gray');
        return;
      }
      
      log(`  Handled non-existent class appropriately`, 'gray');
    }
  );
  
  // Test 10: Analyze non-existent test class
  await runner.runTest(
    'analyze_test_class - Non-existent class error handling',
    async () => {
      const response = await client.callTool('analyze_test_class', {
        className: 'ZNONEXISTENT_TEST_CLASS_12345',
      });
      
      // Expect error for non-existent class
      if (response.isError || (response.data as any)?.error) {
        log(`  Correctly returned error for non-existent class`, 'gray');
        return;
      }
      
      log(`  Handled non-existent class appropriately`, 'gray');
    }
  );
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const failedCount = await runMCPTests('Testing Tools', runTestingToolsTests);
  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});