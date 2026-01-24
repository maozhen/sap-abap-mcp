/**
 * SAP ABAP Report Program Read/Write Integration Test
 * Tests report program read and write operations against a real SAP system
 * 
 * This script performs the following tests:
 * 1. Create a test report program in $TMP package
 * 2. Read the source code of the report
 * 3. Modify and update the source code
 * 4. Read and verify the updated source code
 * 5. Activate the report program
 * 6. Check syntax of the report
 * 
 * All created objects are saved in $TMP package (no transport request needed)
 * 
 * Usage: npx ts-node scripts/test-report-read-write.ts
 */

import * as dotenv from 'dotenv';
import { createADTClient, ADTClient } from '../src/clients/adt-client';
import { ProgramToolHandler } from '../src/tools/program-tools';
import { SAPConnectionConfig } from '../src/types';

// Load environment variables
dotenv.config();

// Test configuration
const TEST_PREFIX = 'YMCP_';
const PACKAGE_NAME = '$TMP';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  data?: unknown;
}

const testResults: TestResult[] = [];

/**
 * Log helper functions
 */
function logHeader(text: string): void {
  console.log(`\n${colors.bold}${colors.blue}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}${'='.repeat(70)}${colors.reset}\n`);
}

function logSection(text: string): void {
  console.log(`\n${colors.cyan}--- ${text} ---${colors.reset}\n`);
}

function logSuccess(testName: string, message: string): void {
  console.log(`${colors.green}✓ [${testName}]${colors.reset} ${message}`);
}

function logError(testName: string, message: string): void {
  console.log(`${colors.red}✗ [${testName}]${colors.reset} ${message}`);
}

function logInfo(message: string): void {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

function logDebug(message: string): void {
  console.log(`${colors.dim}  ${message}${colors.reset}`);
}

function logCode(label: string, code: string): void {
  console.log(`${colors.yellow}${label}:${colors.reset}`);
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    console.log(`${colors.dim}${String(index + 1).padStart(3, ' ')}|${colors.reset} ${line}`);
  });
}

/**
 * Record test result
 */
function recordResult(testName: string, success: boolean, message: string, duration: number, data?: unknown): void {
  testResults.push({ testName, success, message, duration, data });
  if (success) {
    logSuccess(testName, `${message} (${duration}ms)`);
  } else {
    logError(testName, `${message} (${duration}ms)`);
  }
}

/**
 * Run a test with timing and error handling
 */
async function runTest<T>(
  testName: string,
  testFn: () => Promise<T>
): Promise<T | null> {
  const startTime = Date.now();
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    recordResult(testName, true, 'Success', duration, result);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);
    recordResult(testName, false, message, duration);
    return null;
  }
}

/**
 * Generate test report name with timestamp
 */
function generateReportName(): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${TEST_PREFIX}RPT${timestamp}`;
}

/**
 * Main integration test for report read/write
 */
async function main(): Promise<void> {
  logHeader('SAP ABAP Report Program Read/Write Integration Test');
  
  // Validate environment variables
  const requiredEnvVars = ['SAP_HOST', 'SAP_PORT', 'SAP_CLIENT', 'SAP_USER', 'SAP_PASSWORD'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error(`${colors.red}Missing required environment variables: ${missingVars.join(', ')}${colors.reset}`);
    console.error('Please ensure .env file contains all required SAP connection settings.');
    console.error('\nRequired variables:');
    console.error('  SAP_HOST=your-sap-host.com');
    console.error('  SAP_PORT=44300');
    console.error('  SAP_CLIENT=100');
    console.error('  SAP_USER=your_username');
    console.error('  SAP_PASSWORD=your_password');
    process.exit(1);
  }
  
  // Create connection configuration
  const connection: SAPConnectionConfig = {
    host: process.env.SAP_HOST!,
    port: parseInt(process.env.SAP_PORT!, 10),
    https: process.env.SAP_USE_TLS === 'true' || process.env.SAP_SSL === 'true',
    client: process.env.SAP_CLIENT!,
    username: process.env.SAP_USER!,
    password: process.env.SAP_PASSWORD!,
    allowInsecure: process.env.SAP_ALLOW_INSECURE === 'true'
  };
  
  logInfo(`Connecting to SAP system: ${connection.host}:${connection.port}`);
  logInfo(`Client: ${connection.client}, User: ${connection.username}`);
  logInfo(`Package for test objects: ${PACKAGE_NAME}`);
  
  // Create ADT client
  const adtClient = createADTClient(connection);
  
  // Test connection
  logSection('Testing Connection');
  const connected = await runTest('test_connection', async () => {
    return await adtClient.testConnection();
  });
  
  if (!connected) {
    console.error(`${colors.red}Failed to connect to SAP system. Aborting tests.${colors.reset}`);
    process.exit(1);
  }
  
  // Create program tool handler
  const programHandler = new ProgramToolHandler(adtClient);
  
  // Generate unique report name
  const reportName = generateReportName();
  const reportUri = `/sap/bc/adt/programs/programs/${reportName.toLowerCase()}`;
  
  logInfo(`Test report name: ${reportName}`);
  logInfo(`Report URI: ${reportUri}`);
  
  // ========================================
  // Test 1: Create Report Program
  // ========================================
  logSection('Test 1: Create Report Program');
  
  const initialSourceCode = `REPORT ${reportName.toLowerCase()}.
*----------------------------------------------------------------------*
* MCP Integration Test Report - Initial Version
* Created by: SAP ABAP MCP Server Integration Test
*----------------------------------------------------------------------*

DATA: lv_message TYPE string.

START-OF-SELECTION.
  lv_message = 'Hello from MCP Integration Test - Version 1'.
  WRITE: / lv_message.
`;

  const reportCreated = await runTest('create_report', async () => {
    const result = await programHandler.createReportProgram({
      name: reportName,
      description: 'MCP Integration Test Report',
      programType: 'executable',
      sourceCode: initialSourceCode,
      packageName: PACKAGE_NAME
    });
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create report');
    }
    
    return result.data;
  });
  
  if (!reportCreated) {
    console.error(`${colors.red}Failed to create test report. Cannot continue with read/write tests.${colors.reset}`);
    printSummary();
    process.exit(1);
  }
  
  logDebug(`Report ${reportName} created successfully`);
  
  // ========================================
  // Test 2: Read Report Source Code
  // ========================================
  logSection('Test 2: Read Report Source Code');
  
  const readSource = await runTest('read_source_initial', async () => {
    const result = await programHandler.getSourceCode({
      objectUri: reportUri
    });
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to read source code');
    }
    
    return result.data;
  });
  
  if (readSource) {
    logCode('Initial Source Code', readSource);
    
    // Verify source code contains expected content
    await runTest('verify_initial_source', async () => {
      if (!readSource.includes('Version 1')) {
        throw new Error('Initial source code does not contain expected "Version 1" text');
      }
      if (!readSource.toUpperCase().includes(reportName.toUpperCase())) {
        throw new Error(`Source code does not contain report name: ${reportName}`);
      }
      return true;
    });
  }
  
  // ========================================
  // Test 3: Update Report Source Code
  // ========================================
  logSection('Test 3: Update Report Source Code');
  
  const updatedSourceCode = `REPORT ${reportName.toLowerCase()}.
*----------------------------------------------------------------------*
* MCP Integration Test Report - Updated Version
* Created by: SAP ABAP MCP Server Integration Test
* Modified by: Integration Test Script
*----------------------------------------------------------------------*

DATA: lv_message TYPE string,
      lv_counter TYPE i VALUE 0.

CONSTANTS: gc_version TYPE string VALUE 'Version 2'.

START-OF-SELECTION.
  DO 3 TIMES.
    lv_counter = lv_counter + 1.
    lv_message = |Hello from MCP Integration Test - { gc_version } (Iteration: { lv_counter })|.
    WRITE: / lv_message.
  ENDDO.
  
  SKIP.
  WRITE: / 'Test completed successfully!'.
`;

  logCode('Updated Source Code', updatedSourceCode);
  
  const updateResult = await runTest('update_source', async () => {
    const result = await programHandler.updateSourceCode({
      objectUri: reportUri,
      source: updatedSourceCode
    });
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update source code');
    }
    
    return true;
  });
  
  // ========================================
  // Test 4: Read Updated Source Code
  // ========================================
  logSection('Test 4: Read Updated Source Code and Verify');
  
  if (updateResult) {
    const readUpdatedSource = await runTest('read_source_updated', async () => {
      const result = await programHandler.getSourceCode({
        objectUri: reportUri
      });
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to read updated source code');
      }
      
      return result.data;
    });
    
    if (readUpdatedSource) {
      logCode('Read Updated Source Code', readUpdatedSource);
      
      // Verify updated source code
      await runTest('verify_updated_source', async () => {
        if (!readUpdatedSource.includes('Version 2')) {
          throw new Error('Updated source code does not contain "Version 2" text');
        }
        if (!readUpdatedSource.includes('gc_version')) {
          throw new Error('Updated source code does not contain constant gc_version');
        }
        if (!readUpdatedSource.includes('DO 3 TIMES')) {
          throw new Error('Updated source code does not contain DO loop');
        }
        return true;
      });
    }
  }
  
  // ========================================
  // Test 5: Check Syntax
  // ========================================
  logSection('Test 5: Check Syntax');
  
  await runTest('check_syntax', async () => {
    const result = await programHandler.checkSyntax({
      objectUri: reportUri
    });
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to check syntax');
    }
    
    const syntaxResult = result.data;
    if (syntaxResult) {
      logDebug(`Has Errors: ${syntaxResult.hasErrors}`);
      logDebug(`Has Warnings: ${syntaxResult.hasWarnings}`);
      
      if (syntaxResult.messages && syntaxResult.messages.length > 0) {
        logDebug('Messages:');
        syntaxResult.messages.forEach(msg => {
          const prefix = msg.severity === 'error' ? colors.red : 
                        msg.severity === 'warning' ? colors.yellow : colors.blue;
          console.log(`  ${prefix}[${msg.severity}]${colors.reset} Line ${msg.line || '?'}: ${msg.message}`);
        });
      }
      
      if (syntaxResult.hasErrors) {
        throw new Error('Syntax errors found in updated source code');
      }
    }
    
    return syntaxResult;
  });
  
  // ========================================
  // Test 6: Activate Report
  // ========================================
  logSection('Test 6: Activate Report');
  
  await runTest('activate_report', async () => {
    const result = await programHandler.activateObject({
      objectUri: reportUri
    });
    
    if (!result.success) {
      // Activation might fail due to various reasons, log but continue
      logDebug(`Activation result: ${JSON.stringify(result.data)}`);
      if (result.error) {
        throw new Error(result.error.message || 'Activation failed');
      }
    }
    
    const activationResult = result.data;
    if (activationResult) {
      logDebug(`Activation success: ${activationResult.success}`);
      if (activationResult.messages && activationResult.messages.length > 0) {
        activationResult.messages.forEach(msg => {
          const prefix = msg.severity === 'error' ? colors.red : 
                        msg.severity === 'warning' ? colors.yellow : colors.blue;
          console.log(`  ${prefix}[${msg.severity}]${colors.reset} ${msg.message}`);
        });
      }
    }
    
    return activationResult;
  });
  
  // ========================================
  // Test 7: Read Existing SAP Standard Report (if tests above fail)
  // ========================================
  logSection('Test 7: Read Existing SAP Standard Report');
  
  // Try to read a standard SAP report to verify the read functionality works
  const standardReportUri = '/sap/bc/adt/programs/programs/rs_abap_init';
  
  await runTest('read_standard_report', async () => {
    try {
      const result = await programHandler.getSourceCode({
        objectUri: standardReportUri
      });
      
      if (result.success && result.data) {
        logDebug(`Successfully read standard SAP report. Length: ${result.data.length} characters`);
        // Show first 10 lines
        const firstLines = result.data.split('\n').slice(0, 10).join('\n');
        logCode('First 10 lines of RS_ABAP_INIT', firstLines);
        return true;
      } else {
        throw new Error(result.error?.message || 'Failed to read standard report');
      }
    } catch (error) {
      // This is expected to fail if the report doesn't exist or access is denied
      logDebug(`Could not read standard report (this may be expected): ${error}`);
      return false;
    }
  });
  
  // ========================================
  // Test 8: Complete Read-Modify-Write Cycle
  // ========================================
  logSection('Test 8: Complete Read-Modify-Write Cycle');
  
  await runTest('read_modify_write_cycle', async () => {
    // Step 1: Read current source
    const readResult = await programHandler.getSourceCode({
      objectUri: reportUri
    });
    
    if (!readResult.success || !readResult.data) {
      throw new Error('Failed to read source in cycle');
    }
    
    const currentSource = readResult.data;
    logDebug(`Read source: ${currentSource.length} characters`);
    
    // Step 2: Modify source (append a comment with timestamp)
    const timestamp = new Date().toISOString();
    const modifiedSource = currentSource + `\n* Last modified by integration test at: ${timestamp}\n`;
    
    // Step 3: Write modified source
    const writeResult = await programHandler.updateSourceCode({
      objectUri: reportUri,
      source: modifiedSource
    });
    
    if (!writeResult.success) {
      throw new Error(writeResult.error?.message || 'Failed to write modified source');
    }
    
    // Step 4: Read and verify
    const verifyResult = await programHandler.getSourceCode({
      objectUri: reportUri
    });
    
    if (!verifyResult.success || !verifyResult.data) {
      throw new Error('Failed to verify modified source');
    }
    
    if (!verifyResult.data.includes(timestamp)) {
      throw new Error('Modified source does not contain timestamp');
    }
    
    logDebug('Read-Modify-Write cycle completed successfully');
    return true;
  });
  
  // ========================================
  // Summary
  // ========================================
  printSummary();
}

/**
 * Print test summary
 */
function printSummary(): void {
  logHeader('Test Summary');
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const total = testResults.length;
  
  console.log('Test Results:');
  console.log('');
  
  for (const result of testResults) {
    const status = result.success 
      ? `${colors.green}PASS${colors.reset}` 
      : `${colors.red}FAIL${colors.reset}`;
    const duration = `${colors.dim}(${result.duration}ms)${colors.reset}`;
    
    console.log(`  ${status} ${result.testName} ${duration}`);
    
    if (!result.success) {
      console.log(`       ${colors.red}${result.message}${colors.reset}`);
    }
  }
  
  console.log('');
  console.log(`${colors.bold}Total: ${passed}/${total} tests passed${colors.reset}`);
  
  if (failed === 0) {
    console.log(`${colors.green}${colors.bold}All tests passed!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}${failed} test(s) failed.${colors.reset}`);
  }
  
  // Calculate total duration
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  console.log(`\nTotal duration: ${totalDuration}ms`);
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run the integration test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});