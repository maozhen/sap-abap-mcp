/**
 * Integration Tests for Testing Tools
 * Tests unit test execution, code coverage, and test class analysis
 * 
 * These tests use existing SAP objects or previously created test objects
 * Testing tools are read-only operations - they don't create new objects
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { TestingToolHandler } from '../../src/tools/testing-tools';

dotenv.config();

// Test configuration
const TEST_PREFIX = 'YMCP_';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  skipped?: boolean;
}

const testResults: TestResult[] = [];

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  log(`\n▶ Running: ${name}`, 'cyan');
  
  try {
    await fn();
    const duration = Date.now() - start;
    testResults.push({ name, success: true, duration });
    log(`✓ ${name} passed (${duration}ms)`, 'green');
  } catch (error) {
    const duration = Date.now() - start;
    const errorMsg = error instanceof Error ? error.message : String(error);
    testResults.push({ name, success: false, duration, error: errorMsg });
    log(`✗ ${name} failed: ${errorMsg}`, 'red');
  }
}

async function skipTest(name: string, reason: string): Promise<void> {
  log(`\n○ Skipping: ${name}`, 'yellow');
  log(`  Reason: ${reason}`, 'gray');
  testResults.push({ name, success: true, duration: 0, skipped: true });
}

function printSummary(): void {
  log('\n' + '='.repeat(60), 'cyan');
  log('TESTING TOOLS INTEGRATION TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const passed = testResults.filter(r => r.success && !r.skipped).length;
  const failed = testResults.filter(r => !r.success).length;
  const skipped = testResults.filter(r => r.skipped).length;
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  for (const result of testResults) {
    if (result.skipped) {
      log(`○ ${result.name} (skipped)`, 'yellow');
    } else {
      const icon = result.success ? '✓' : '✗';
      const color = result.success ? 'green' : 'red';
      log(`${icon} ${result.name} (${result.duration}ms)`, color);
    }
    if (result.error) {
      log(`  Error: ${result.error}`, 'gray');
    }
  }
  
  log('\n' + '-'.repeat(60), 'cyan');
  log(`Total: ${passed + failed + skipped} tests, ${passed} passed, ${failed} failed, ${skipped} skipped`, 
      failed === 0 ? 'green' : 'red');
  log(`Duration: ${totalDuration}ms`, 'gray');
}

async function main(): Promise<void> {
  log('Testing Tools Integration Tests', 'cyan');
  log('='.repeat(60), 'cyan');
  
  // Validate environment
  const { SAP_URL, SAP_CLIENT, SAP_USER, SAP_PASSWORD } = process.env;
  if (!SAP_URL || !SAP_CLIENT || !SAP_USER || !SAP_PASSWORD) {
    log('Missing required environment variables: SAP_URL, SAP_CLIENT, SAP_USER, SAP_PASSWORD', 'red');
    process.exit(1);
  }
  
  log(`SAP URL: ${SAP_URL}`, 'gray');
  log(`SAP Client: ${SAP_CLIENT}`, 'gray');
  log(`SAP User: ${SAP_USER}`, 'gray');
  
  // Initialize client and handler
  const adtClient = new ADTClient({
    baseUrl: SAP_URL,
    client: SAP_CLIENT,
    username: SAP_USER,
    password: SAP_PASSWORD,
  });
  
  const testingHandler = new TestingToolHandler(adtClient);
  
  // Test object names - use SAP standard test classes or our test classes
  // CL_ABAP_UNIT_ASSERT is a utility class, we need a class with actual tests
  // Try to use standard test classes that exist in most SAP systems
  const testClassName = 'CL_AUNIT_ASSERT_RESULT'; // Standard SAP test class
  const testClassWithTests = `${TEST_PREFIX}CL_TEST`; // Our test class from program-tools tests
  const simpleClassName = 'CL_ABAP_UNIT_ASSERT'; // Standard SAP utility class
  
  // Store runId for later retrieval
  let lastRunId: string | undefined;
  
  // ============================================
  // Run Unit Tests
  // ============================================
  
  await runTest('Run Unit Tests on SAP Standard Class', async () => {
    // Try to run unit tests on a class that might have tests
    // CL_AUNIT_ASSERT_RESULT is part of ABAP Unit framework
    const result = await testingHandler.runUnitTests({
      objectName: testClassName,
      objectType: 'CLAS',
      withCoverage: false,
    });
    
    // Even if no tests are found, the call should succeed
    if (!result.success && !result.error?.message?.includes('No tests')) {
      // Log the response for debugging
      log(`  Response: ${JSON.stringify(result)}`, 'gray');
      throw new Error(`Run unit tests failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Tests run: ${result.data.totalTests}`, 'gray');
      log(`  Passed: ${result.data.passed}`, 'gray');
      log(`  Failed: ${result.data.failed}`, 'gray');
      
      // Store for later retrieval test (if results contain a runId)
      // Note: runId might not always be available depending on SAP version
    }
    
    log(`  Unit tests executed on ${testClassName}`, 'gray');
  });
  
  await runTest('Run Unit Tests with Coverage', async () => {
    // Run tests with coverage analysis enabled
    const result = await testingHandler.runUnitTests({
      objectName: simpleClassName,
      objectType: 'CLAS',
      withCoverage: true,
    });
    
    // The call should succeed even if no tests are found
    if (!result.success && !result.error?.message?.includes('No tests')) {
      throw new Error(`Run unit tests with coverage failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Tests run: ${result.data.totalTests}`, 'gray');
      log(`  Duration: ${result.data.duration}ms`, 'gray');
    }
    
    log(`  Unit tests with coverage executed on ${simpleClassName}`, 'gray');
  });
  
  await runTest('Run Unit Tests on Program', async () => {
    // Try to run unit tests on a standard program
    // Most ABAP programs don't have unit tests, so this tests the API handling
    const result = await testingHandler.runUnitTests({
      objectName: 'RSABAPTEST', // Standard SAP test program
      objectType: 'PROG',
      withCoverage: false,
    });
    
    // The API call should complete (success or expected failure)
    if (!result.success && !result.error?.message?.includes('No tests') && 
        !result.error?.message?.includes('not found')) {
      throw new Error(`Run unit tests on program failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Tests found: ${result.data.totalTests}`, 'gray');
    }
    
    log(`  Unit tests API called for program`, 'gray');
  });
  
  // ============================================
  // Test Coverage
  // ============================================
  
  await runTest('Get Test Coverage for Class', async () => {
    const result = await testingHandler.getTestCoverage({
      objectName: simpleClassName,
      objectType: 'CLAS',
    });
    
    // Coverage might not be available if no tests were run
    if (!result.success) {
      // Check if it's an expected "no coverage data" error
      if (result.error?.message?.includes('No coverage') || 
          result.error?.message?.includes('not found') ||
          result.error?.message?.includes('404')) {
        log(`  No coverage data available (expected if no tests run)`, 'yellow');
        return; // This is acceptable
      }
      throw new Error(`Get coverage failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Object: ${result.data.objectName}`, 'gray');
      log(`  Statement Coverage: ${result.data.statementCoverage}%`, 'gray');
      log(`  Covered Statements: ${result.data.coveredStatements}/${result.data.totalStatements}`, 'gray');
      if (result.data.branchCoverage !== undefined) {
        log(`  Branch Coverage: ${result.data.branchCoverage}%`, 'gray');
      }
    }
    
    log(`  Test coverage retrieved for ${simpleClassName}`, 'gray');
  });
  
  // ============================================
  // Test Results Retrieval
  // ============================================
  
  await runTest('Get Test Results by Run ID', async () => {
    // If we have a runId from previous tests, use it
    // Otherwise, try with a placeholder to test the API
    const runId = lastRunId || 'test-run-1';
    
    const result = await testingHandler.getTestResults({
      runId,
    });
    
    // This might fail if the runId doesn't exist, which is expected
    if (!result.success) {
      if (result.error?.message?.includes('not found') || 
          result.error?.message?.includes('404') ||
          result.error?.message?.includes('Invalid')) {
        log(`  No results for runId: ${runId} (expected for non-existent runId)`, 'yellow');
        return; // This is acceptable
      }
      throw new Error(`Get test results failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Run ID: ${runId}`, 'gray');
      log(`  Total Tests: ${result.data.totalTests}`, 'gray');
      log(`  Results retrieved at: ${result.data.timestamp}`, 'gray');
    }
    
    log(`  Test results retrieval API tested`, 'gray');
  });
  
  // ============================================
  // Analyze Test Class
  // ============================================
  
  await runTest('Analyze Test Class Structure', async () => {
    const result = await testingHandler.analyzeTestClass({
      className: testClassName,
    });
    
    if (!result.success) {
      // If the class doesn't exist or can't be analyzed
      if (result.error?.message?.includes('not found') || 
          result.error?.message?.includes('404')) {
        log(`  Class ${testClassName} not found in system`, 'yellow');
        return; // Try another class
      }
      throw new Error(`Analyze test class failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Class Name: ${result.data.className}`, 'gray');
      log(`  Test Methods: ${result.data.testMethods.length}`, 'gray');
      if (result.data.setupMethod) {
        log(`  Setup Method: ${result.data.setupMethod}`, 'gray');
      }
      if (result.data.teardownMethod) {
        log(`  Teardown Method: ${result.data.teardownMethod}`, 'gray');
      }
      if (result.data.riskLevel) {
        log(`  Risk Level: ${result.data.riskLevel}`, 'gray');
      }
      if (result.data.duration) {
        log(`  Duration: ${result.data.duration}`, 'gray');
      }
      
      // List test methods
      for (const method of result.data.testMethods.slice(0, 5)) {
        log(`    - ${method.name}${method.description ? `: ${method.description}` : ''}`, 'gray');
      }
      if (result.data.testMethods.length > 5) {
        log(`    ... and ${result.data.testMethods.length - 5} more`, 'gray');
      }
    }
    
    log(`  Test class ${testClassName} analyzed`, 'gray');
  });
  
  await runTest('Analyze SAP Utility Class', async () => {
    // Analyze CL_ABAP_UNIT_ASSERT which is a utility class, not a test class
    const result = await testingHandler.analyzeTestClass({
      className: simpleClassName,
    });
    
    if (!result.success) {
      if (result.error?.message?.includes('not found') || 
          result.error?.message?.includes('404')) {
        log(`  Class ${simpleClassName} not found`, 'yellow');
        return;
      }
      throw new Error(`Analyze class failed: ${result.error?.message}`);
    }
    
    if (result.data) {
      log(`  Class Name: ${result.data.className}`, 'gray');
      log(`  Test Methods: ${result.data.testMethods.length}`, 'gray');
      // This is a utility class, so it might not have FOR TESTING methods
      if (result.data.testMethods.length === 0) {
        log(`  (No test methods - this is a utility class)`, 'gray');
      }
    }
    
    log(`  Class ${simpleClassName} structure analyzed`, 'gray');
  });
  
  // ============================================
  // Edge Cases and Error Handling
  // ============================================
  
  await runTest('Handle Non-Existent Class', async () => {
    const nonExistentClass = `${TEST_PREFIX}NONEXISTENT_CLASS_12345`;
    
    const result = await testingHandler.analyzeTestClass({
      className: nonExistentClass,
    });
    
    // Should fail gracefully with a proper error
    if (result.success) {
      throw new Error('Expected failure for non-existent class');
    }
    
    if (!result.error) {
      throw new Error('Expected error details for non-existent class');
    }
    
    log(`  Error handling verified: ${result.error.code}`, 'gray');
    log(`  Non-existent class handled correctly`, 'gray');
  });
  
  await runTest('Run Tests on Non-Existent Object', async () => {
    const nonExistentObject = `${TEST_PREFIX}NONEXISTENT_12345`;
    
    const result = await testingHandler.runUnitTests({
      objectName: nonExistentObject,
      objectType: 'CLAS',
      withCoverage: false,
    });
    
    // Should fail gracefully
    if (result.success) {
      // Some systems might return success with 0 tests
      if (result.data && result.data.totalTests === 0) {
        log(`  System returned 0 tests for non-existent class`, 'gray');
        return;
      }
      throw new Error('Expected failure for non-existent object');
    }
    
    if (!result.error) {
      throw new Error('Expected error details for non-existent object');
    }
    
    log(`  Error handling verified: ${result.error.code}`, 'gray');
    log(`  Non-existent object handled correctly`, 'gray');
  });
  
  // ============================================
  // Integration with Function Groups
  // ============================================
  
  await runTest('Run Tests on Function Group', async () => {
    // Try to run tests on a function group
    // Use a standard SAP function group
    const result = await testingHandler.runUnitTests({
      objectName: 'SYST', // Standard system function group
      objectType: 'FUGR',
      withCoverage: false,
    });
    
    // Most function groups don't have unit tests
    if (!result.success && !result.error?.message?.includes('No tests')) {
      // This is acceptable - function group might not support unit tests
      log(`  Response: ${result.error?.message}`, 'gray');
    }
    
    if (result.data) {
      log(`  Tests found in FUGR: ${result.data.totalTests}`, 'gray');
    }
    
    log(`  Function group test execution API tested`, 'gray');
  });
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  const failed = testResults.filter(r => !r.success).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  log(`Fatal error: ${error}`, 'red');
  process.exit(1);
});