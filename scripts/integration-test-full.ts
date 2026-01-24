/**
 * SAP ABAP MCP Server Full Integration Test
 * Complete lifecycle testing for Programs, Classes, and Functions
 * 
 * Tests:
 * - Programs: Create, Read, Modify, Activate
 * - Classes: Create, Read, Modify, Activate
 * - Functions: Create Function Group, Create Function Module, Read, Modify, Activate
 * 
 * All objects use "YMCP" prefix and are saved in $TMP package
 */

import * as dotenv from 'dotenv';
import { createADTClient, ADTClient } from '../src/clients/adt-client';
import { createToolHandlers } from '../src/tools';
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
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

interface TestResult {
  category: string;
  operation: string;
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
  console.log(`\n${colors.cyan}${colors.bold}--- ${text} ---${colors.reset}\n`);
}

function logSubSection(text: string): void {
  console.log(`\n${colors.magenta}  >> ${text}${colors.reset}`);
}

function logSuccess(operation: string, message: string): void {
  console.log(`${colors.green}  ✓ [${operation}]${colors.reset} ${message}`);
}

function logError(operation: string, message: string): void {
  console.log(`${colors.red}  ✗ [${operation}]${colors.reset} ${message}`);
}

function logWarning(message: string): void {
  console.log(`${colors.yellow}  ⚠ ${message}${colors.reset}`);
}

function logInfo(message: string): void {
  console.log(`${colors.blue}  ℹ ${message}${colors.reset}`);
}

function logDetail(message: string): void {
  console.log(`    ${message}`);
}

/**
 * Record test result
 */
function recordResult(category: string, operation: string, success: boolean, message: string, duration: number, data?: unknown): void {
  testResults.push({ category, operation, success, message, duration, data });
  if (success) {
    logSuccess(operation, `${message} (${duration}ms)`);
  } else {
    logError(operation, `${message} (${duration}ms)`);
  }
}

/**
 * Run a test with timing and error handling
 */
async function runTest<T>(
  category: string,
  operation: string,
  testFn: () => Promise<T>
): Promise<T | null> {
  const startTime = Date.now();
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    recordResult(category, operation, true, 'Success', duration, result);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);
    recordResult(category, operation, false, message, duration);
    return null;
  }
}

/**
 * Main integration test
 */
async function main(): Promise<void> {
  logHeader('SAP ABAP MCP Server - Full Integration Test');
  logInfo('Testing complete lifecycle: Create → Read → Modify → Activate');
  logInfo(`Object prefix: ${TEST_PREFIX}`);
  logInfo(`Package: ${PACKAGE_NAME}`);
  
  // Validate environment variables
  const requiredEnvVars = ['SAP_HOST', 'SAP_PORT', 'SAP_CLIENT', 'SAP_USER', 'SAP_PASSWORD'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error(`${colors.red}Missing required environment variables: ${missingVars.join(', ')}${colors.reset}`);
    console.error('Please ensure .env file contains all required SAP connection settings.');
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
  
  logSection('Connection Information');
  logInfo(`Host: ${connection.host}:${connection.port}`);
  logInfo(`Client: ${connection.client}`);
  logInfo(`User: ${connection.username}`);
  logInfo(`HTTPS: ${connection.https}`);
  
  // Create ADT client
  const adtClient = createADTClient(connection);
  
  // Test connection
  logSection('Testing Connection');
  const connected = await runTest('Connection', 'test_connection', async () => {
    return await adtClient.testConnection();
  });
  
  if (!connected) {
    console.error(`${colors.red}Failed to connect to SAP system. Aborting tests.${colors.reset}`);
    process.exit(1);
  }
  
  // Create tool handlers
  const handlers = createToolHandlers(adtClient);
  
  // Generate unique timestamp for test objects
  const timestamp = Date.now().toString().slice(-6);
  
  // ========================================
  // 1. PROGRAM TESTS (Report Program)
  // ========================================
  await testProgram(handlers, adtClient, timestamp);
  
  // ========================================
  // 2. CLASS TESTS
  // ========================================
  await testClass(handlers, adtClient, timestamp);
  
  // ========================================
  // 3. INTERFACE TESTS
  // ========================================
  await testInterface(handlers, adtClient, timestamp);
  
  // ========================================
  // 4. FUNCTION GROUP & MODULE TESTS
  // ========================================
  await testFunction(handlers, adtClient, timestamp);
  
  // ========================================
  // Summary
  // ========================================
  printSummary();
}

/**
 * Test Program lifecycle: Create → Read → Modify → Activate
 */
async function testProgram(handlers: any, adtClient: ADTClient, timestamp: string): Promise<void> {
  logSection('1. PROGRAM TESTS (Report Program)');
  
  const programName = `${TEST_PREFIX}RPT${timestamp}`;
  logInfo(`Program name: ${programName}`);
  
  // 1.1 Create Program
  logSubSection('1.1 Create Program');
  const initialSource = `REPORT ${programName.toLowerCase()}.
* MCP Integration Test Report
* Created: ${new Date().toISOString()}
WRITE: / 'Hello from MCP Test - Version 1'.`;

  const programCreated = await runTest('Program', 'create_program', async () => {
    return await handlers.program.createReportProgram({
      name: programName,
      description: 'MCP Integration Test Report',
      programType: 'executable',
      sourceCode: initialSource,
      packageName: PACKAGE_NAME
    });
  });
  
  if (!programCreated || !programCreated.success) {
    logWarning('Program creation failed, skipping remaining program tests');
    return;
  }
  
  const programUri = `/sap/bc/adt/programs/programs/${programName.toLowerCase()}`;
  logDetail(`Program URI: ${programUri}`);
  
  // 1.2 Read Program Source
  logSubSection('1.2 Read Program Source');
  const sourceRead = await runTest('Program', 'read_source', async () => {
    return await handlers.program.getSourceCode({
      objectUri: programUri
    });
  });
  
  if (sourceRead?.success && sourceRead.data) {
    logDetail(`Source length: ${sourceRead.data.length} characters`);
    logDetail(`Source preview: ${sourceRead.data.substring(0, 80)}...`);
  }
  
  // 1.3 Modify Program Source
  logSubSection('1.3 Modify Program Source');
  const modifiedSource = `REPORT ${programName.toLowerCase()}.
* MCP Integration Test Report
* Created: ${new Date().toISOString()}
* Modified: ${new Date().toISOString()}
DATA: lv_text TYPE string.
lv_text = 'Hello from MCP Test - Version 2 (Modified)'.
WRITE: / lv_text.
WRITE: / 'Modification successful!'.`;

  const sourceUpdated = await runTest('Program', 'modify_source', async () => {
    return await handlers.program.updateSourceCode({
      objectUri: programUri,
      source: modifiedSource
    });
  });
  
  // 1.4 Verify Modification
  if (sourceUpdated?.success) {
    logSubSection('1.4 Verify Modification');
    const verifyRead = await runTest('Program', 'verify_modification', async () => {
      return await handlers.program.getSourceCode({
        objectUri: programUri
      });
    });
    
    if (verifyRead?.success && verifyRead.data) {
      const hasModification = verifyRead.data.includes('Version 2');
      logDetail(`Modification verified: ${hasModification ? 'YES' : 'NO'}`);
    }
  }
  
  // 1.5 Check Syntax
  logSubSection('1.5 Check Syntax');
  await runTest('Program', 'check_syntax', async () => {
    return await handlers.program.checkSyntax({
      objectUri: programUri
    });
  });
  
  // 1.6 Activate Program
  logSubSection('1.6 Activate Program');
  const activated = await runTest('Program', 'activate', async () => {
    return await handlers.program.activateObject({
      objectUri: programUri
    });
  });
  
  if (activated?.success) {
    logDetail('Program activated successfully');
  }
}

/**
 * Test Class lifecycle: Create → Read → Modify → Activate
 */
async function testClass(handlers: any, adtClient: ADTClient, timestamp: string): Promise<void> {
  logSection('2. CLASS TESTS');
  
  const className = `${TEST_PREFIX}CL${timestamp}`;
  logInfo(`Class name: ${className}`);
  
  // 2.1 Create Class
  logSubSection('2.1 Create Class');
  const classCreated = await runTest('Class', 'create_class', async () => {
    return await handlers.program.createClass({
      name: className,
      description: 'MCP Integration Test Class',
      isFinal: false,
      isAbstract: false,
      packageName: PACKAGE_NAME
    });
  });
  
  if (!classCreated || !classCreated.success) {
    logWarning('Class creation failed, skipping remaining class tests');
    return;
  }
  
  const classUri = `/sap/bc/adt/oo/classes/${className.toLowerCase()}`;
  const classSourceUri = `${classUri}/source/main`;
  logDetail(`Class URI: ${classUri}`);
  
  // 2.2 Read Class Source
  logSubSection('2.2 Read Class Source');
  const sourceRead = await runTest('Class', 'read_source', async () => {
    return await handlers.program.getSourceCode({
      objectUri: classSourceUri
    });
  });
  
  if (sourceRead?.success && sourceRead.data) {
    logDetail(`Source length: ${sourceRead.data.length} characters`);
  }
  
  // 2.3 Get Class Metadata
  logSubSection('2.3 Get Class Metadata');
  await runTest('Class', 'get_metadata', async () => {
    return await handlers.program.getObjectMetadata({
      objectUri: classUri
    });
  });
  
  // 2.4 Modify Class Source
  logSubSection('2.4 Modify Class Source');
  const modifiedClassSource = `CLASS ${className.toLowerCase()} DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS:
      get_message RETURNING VALUE(rv_message) TYPE string,
      get_timestamp RETURNING VALUE(rv_timestamp) TYPE timestamp.
  PROTECTED SECTION.
  PRIVATE SECTION.
    DATA: mv_created TYPE timestamp.
ENDCLASS.

CLASS ${className.toLowerCase()} IMPLEMENTATION.
  METHOD get_message.
    rv_message = 'Hello from MCP Integration Test Class - Modified'.
  ENDMETHOD.

  METHOD get_timestamp.
    GET TIME STAMP FIELD rv_timestamp.
  ENDMETHOD.
ENDCLASS.`;

  const classSourceUpdated = await runTest('Class', 'modify_source', async () => {
    return await handlers.program.updateSourceCode({
      objectUri: classSourceUri,
      source: modifiedClassSource
    });
  });
  
  // 2.5 Check Syntax
  logSubSection('2.5 Check Syntax');
  await runTest('Class', 'check_syntax', async () => {
    return await handlers.program.checkSyntax({
      objectUri: classUri
    });
  });
  
  // 2.6 Activate Class
  logSubSection('2.6 Activate Class');
  const classActivated = await runTest('Class', 'activate', async () => {
    return await handlers.program.activateObject({
      objectUri: classUri
    });
  });
  
  if (classActivated?.success) {
    logDetail('Class activated successfully');
  }
}

/**
 * Test Interface lifecycle: Create → Read → Modify → Activate
 */
async function testInterface(handlers: any, adtClient: ADTClient, timestamp: string): Promise<void> {
  logSection('3. INTERFACE TESTS');
  
  const interfaceName = `${TEST_PREFIX}IF${timestamp}`;
  logInfo(`Interface name: ${interfaceName}`);
  
  // 3.1 Create Interface
  logSubSection('3.1 Create Interface');
  const interfaceCreated = await runTest('Interface', 'create_interface', async () => {
    return await handlers.program.createInterface({
      name: interfaceName,
      description: 'MCP Integration Test Interface',
      packageName: PACKAGE_NAME
    });
  });
  
  if (!interfaceCreated || !interfaceCreated.success) {
    logWarning('Interface creation failed, skipping remaining interface tests');
    return;
  }
  
  const interfaceUri = `/sap/bc/adt/oo/interfaces/${interfaceName.toLowerCase()}`;
  const interfaceSourceUri = `${interfaceUri}/source/main`;
  logDetail(`Interface URI: ${interfaceUri}`);
  
  // 3.2 Read Interface Source
  logSubSection('3.2 Read Interface Source');
  const sourceRead = await runTest('Interface', 'read_source', async () => {
    return await handlers.program.getSourceCode({
      objectUri: interfaceSourceUri
    });
  });
  
  if (sourceRead?.success && sourceRead.data) {
    logDetail(`Source length: ${sourceRead.data.length} characters`);
  }
  
  // 3.3 Modify Interface Source
  logSubSection('3.3 Modify Interface Source');
  const modifiedInterfaceSource = `INTERFACE ${interfaceName.toLowerCase()}
  PUBLIC.
  METHODS:
    process_data
      IMPORTING
        iv_input TYPE string
      RETURNING
        VALUE(rv_output) TYPE string,
    get_status
      RETURNING
        VALUE(rv_status) TYPE i.
  DATA:
    mv_name TYPE string READ-ONLY.
ENDINTERFACE.`;

  const interfaceSourceUpdated = await runTest('Interface', 'modify_source', async () => {
    return await handlers.program.updateSourceCode({
      objectUri: interfaceSourceUri,
      source: modifiedInterfaceSource
    });
  });
  
  // 3.4 Activate Interface
  logSubSection('3.4 Activate Interface');
  const interfaceActivated = await runTest('Interface', 'activate', async () => {
    return await handlers.program.activateObject({
      objectUri: interfaceUri
    });
  });
  
  if (interfaceActivated?.success) {
    logDetail('Interface activated successfully');
  }
}

/**
 * Test Function lifecycle: Create Group → Create Module → Read → Modify → Activate
 */
async function testFunction(handlers: any, adtClient: ADTClient, timestamp: string): Promise<void> {
  logSection('4. FUNCTION TESTS');
  
  const functionGroupName = `${TEST_PREFIX}FG${timestamp}`;
  const functionModuleName = `${TEST_PREFIX}FM${timestamp}`;
  logInfo(`Function Group name: ${functionGroupName}`);
  logInfo(`Function Module name: ${functionModuleName}`);
  
  // 4.1 Create Function Group
  logSubSection('4.1 Create Function Group');
  const fgCreated = await runTest('Function', 'create_function_group', async () => {
    return await handlers.program.createFunctionGroup({
      name: functionGroupName,
      description: 'MCP Integration Test Function Group',
      packageName: PACKAGE_NAME
    });
  });
  
  if (!fgCreated || !fgCreated.success) {
    logWarning('Function Group creation failed, skipping remaining function tests');
    return;
  }
  
  const functionGroupUri = `/sap/bc/adt/functions/groups/${functionGroupName.toLowerCase()}`;
  logDetail(`Function Group URI: ${functionGroupUri}`);
  
  // 4.2 Activate Function Group first
  logSubSection('4.2 Activate Function Group');
  await runTest('Function', 'activate_function_group', async () => {
    return await handlers.program.activateObject({
      objectUri: functionGroupUri
    });
  });
  
  // 4.3 Create Function Module
  logSubSection('4.3 Create Function Module');
  const fmCreated = await runTest('Function', 'create_function_module', async () => {
    return await handlers.program.createFunctionModule({
      name: functionModuleName,
      functionGroup: functionGroupName,
      description: 'MCP Integration Test Function Module',
      importParameters: [
        {
          name: 'IV_INPUT',
          typeName: 'STRING',
          isOptional: false,
          description: 'Input parameter'
        }
      ],
      exportParameters: [
        {
          name: 'EV_OUTPUT',
          typeName: 'STRING',
          description: 'Output parameter'
        }
      ],
      exceptions: [
        {
          name: 'INVALID_INPUT',
          description: 'Invalid input exception'
        }
      ],
      packageName: PACKAGE_NAME
    });
  });
  
  if (!fmCreated || !fmCreated.success) {
    logWarning('Function Module creation failed, skipping remaining function module tests');
    return;
  }
  
  const functionModuleUri = `/sap/bc/adt/functions/groups/${functionGroupName.toLowerCase()}/fmodules/${functionModuleName.toLowerCase()}`;
  logDetail(`Function Module URI: ${functionModuleUri}`);
  
  // 4.4 Read Function Module Source
  logSubSection('4.4 Read Function Module Source');
  const fmSourceRead = await runTest('Function', 'read_fm_source', async () => {
    return await handlers.program.getSourceCode({
      objectUri: `${functionModuleUri}/source/main`
    });
  });
  
  if (fmSourceRead?.success && fmSourceRead.data) {
    logDetail(`Source length: ${fmSourceRead.data.length} characters`);
  }
  
  // 4.5 Modify Function Module Source
  logSubSection('4.5 Modify Function Module Source');
  const modifiedFMSource = `FUNCTION ${functionModuleName.toLowerCase()}.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_INPUT) TYPE  STRING
*"  EXPORTING
*"     VALUE(EV_OUTPUT) TYPE  STRING
*"  EXCEPTIONS
*"      INVALID_INPUT
*"----------------------------------------------------------------------
  " MCP Integration Test Function Module - Modified
  IF iv_input IS INITIAL.
    RAISE invalid_input.
  ENDIF.
  
  ev_output = |Processed: { iv_input } - MCP Test|.
ENDFUNCTION.`;

  const fmSourceUpdated = await runTest('Function', 'modify_fm_source', async () => {
    return await handlers.program.updateSourceCode({
      objectUri: `${functionModuleUri}/source/main`,
      source: modifiedFMSource
    });
  });
  
  // 4.6 Activate Function Module
  logSubSection('4.6 Activate Function Module');
  const fmActivated = await runTest('Function', 'activate_function_module', async () => {
    return await handlers.program.activateObject({
      objectUri: functionModuleUri
    });
  });
  
  if (fmActivated?.success) {
    logDetail('Function Module activated successfully');
  }
}

/**
 * Print test summary
 */
function printSummary(): void {
  logHeader('Test Summary');
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const total = testResults.length;
  
  // Group by category
  const categories = [...new Set(testResults.map(r => r.category))];
  
  console.log(`\n${colors.bold}Results by Category:${colors.reset}\n`);
  
  for (const category of categories) {
    const categoryResults = testResults.filter(r => r.category === category);
    const categoryPassed = categoryResults.filter(r => r.success).length;
    const categoryTotal = categoryResults.length;
    
    const status = categoryPassed === categoryTotal 
      ? `${colors.green}PASS${colors.reset}` 
      : `${colors.red}FAIL${colors.reset}`;
    
    console.log(`  ${category}: ${categoryPassed}/${categoryTotal} ${status}`);
    
    // List individual tests
    for (const test of categoryResults) {
      const icon = test.success ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
      console.log(`    ${icon} ${test.operation}: ${test.message}`);
    }
    console.log();
  }
  
  console.log(`${colors.bold}${'─'.repeat(50)}${colors.reset}`);
  console.log(`${colors.bold}Total: ${passed}/${total} tests passed${colors.reset}`);
  
  if (failed === 0) {
    console.log(`${colors.green}${colors.bold}✓ All tests passed!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ ${failed} test(s) failed.${colors.reset}`);
  }
  
  // Calculate total duration
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  console.log(`\nTotal duration: ${(totalDuration / 1000).toFixed(2)}s`);
  
  // List created objects
  console.log(`\n${colors.cyan}Created Test Objects:${colors.reset}`);
  const createdTests = testResults.filter(r => r.operation.startsWith('create') && r.success);
  for (const test of createdTests) {
    console.log(`  - ${test.category}: ${test.operation}`);
  }
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run the integration test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});