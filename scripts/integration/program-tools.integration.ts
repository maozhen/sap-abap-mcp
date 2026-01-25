/**
 * Integration Tests for Program Tools
 * Tests ABAP class, interface, report program, function group, and function module operations
 * 
 * Test objects use "YMCP" prefix and are saved in "$TMP" package
 * After creating/activating objects, we read them back to verify state
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { ProgramToolHandler } from '../../src/tools/program-tools';

dotenv.config();

// Test configuration
const TEST_PREFIX = 'YMCP_';
const PACKAGE_NAME = '$TMP';

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

function printSummary(): void {
  log('\n' + '='.repeat(60), 'cyan');
  log('PROGRAM TOOLS INTEGRATION TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  for (const result of testResults) {
    const icon = result.success ? '✓' : '✗';
    const color = result.success ? 'green' : 'red';
    log(`${icon} ${result.name} (${result.duration}ms)`, color);
    if (result.error) {
      log(`  Error: ${result.error}`, 'gray');
    }
  }
  
  log('\n' + '-'.repeat(60), 'cyan');
  log(`Total: ${passed + failed} tests, ${passed} passed, ${failed} failed`, passed === testResults.length ? 'green' : 'red');
  log(`Duration: ${totalDuration}ms`, 'gray');
}

async function main(): Promise<void> {
  log('Program Tools Integration Tests', 'cyan');
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
  
  // Parse SAP_URL to extract host and port
  const sapUrl = new URL(SAP_URL);
  const isHttps = sapUrl.protocol === 'https:';
  const host = sapUrl.hostname;
  const port = sapUrl.port ? parseInt(sapUrl.port, 10) : (isHttps ? 443 : 80);
  
  // Initialize client and handler
  const adtClient = new ADTClient({
    connection: {
      host,
      port,
      https: isHttps,
      client: SAP_CLIENT,
      username: SAP_USER,
      password: SAP_PASSWORD,
      allowInsecure: true,
    },
  });
  
  const programHandler = new ProgramToolHandler(adtClient);
  
  // Test object names
  const className = `${TEST_PREFIX}CL_TEST`;
  const interfaceName = `${TEST_PREFIX}IF_TEST`;
  const reportName = `${TEST_PREFIX}REPORT`;
  const functionGroupName = `${TEST_PREFIX}FG`;
  const functionModuleName = `${TEST_PREFIX}FM_TEST`;
  
  // URIs for objects (used for read/activate operations)
  const classUri = `/sap/bc/adt/oo/classes/${className.toLowerCase()}`;
  const interfaceUri = `/sap/bc/adt/oo/interfaces/${interfaceName.toLowerCase()}`;
  const reportUri = `/sap/bc/adt/programs/programs/${reportName.toLowerCase()}`;
  const functionGroupUri = `/sap/bc/adt/functions/groups/${functionGroupName.toLowerCase()}`;
  const functionModuleUri = `/sap/bc/adt/functions/groups/${functionGroupName.toLowerCase()}/fmodules/${functionModuleName.toLowerCase()}`;
  
  // ============================================
  // ABAP Class Tests
  // ============================================
  
  await runTest('Create Class', async () => {
    const result = await programHandler.createClass({
      name: className,
      description: 'Test class created by integration test',
      visibility: 'public',
      isFinal: false,
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await programHandler.getObjectMetadata({
      objectUri: classUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Class ${className} created and verified`, 'gray');
  });
  
  await runTest('Read Class Metadata', async () => {
    const result = await programHandler.getObjectMetadata({
      objectUri: classUri,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Class name not found in response');
    }
    
    log(`  Class ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Get Class Source Code', async () => {
    const result = await programHandler.getSourceCode({
      objectUri: `${classUri}/source/main`,
    });
    
    if (!result.success) {
      throw new Error(`Get source failed: ${result.error?.message}`);
    }
    
    if (result.data === undefined || result.data === null) {
      throw new Error('Source code not found in response');
    }
    
    log(`  Class source code retrieved (${result.data.length} chars)`, 'gray');
  });
  
  await runTest('Activate Class', async () => {
    const result = await programHandler.activateObject({
      objectUri: classUri,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await programHandler.getObjectMetadata({
      objectUri: classUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Class ${className} activated and verified`, 'gray');
  });
  
  // ============================================
  // ABAP Interface Tests
  // ============================================
  
  await runTest('Create Interface', async () => {
    const result = await programHandler.createInterface({
      name: interfaceName,
      description: 'Test interface created by integration test',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await programHandler.getObjectMetadata({
      objectUri: interfaceUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Interface ${interfaceName} created and verified`, 'gray');
  });
  
  await runTest('Read Interface Metadata', async () => {
    const result = await programHandler.getObjectMetadata({
      objectUri: interfaceUri,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Interface name not found in response');
    }
    
    log(`  Interface ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Get Interface Source Code', async () => {
    const result = await programHandler.getSourceCode({
      objectUri: `${interfaceUri}/source/main`,
    });
    
    if (!result.success) {
      throw new Error(`Get source failed: ${result.error?.message}`);
    }
    
    if (result.data === undefined || result.data === null) {
      throw new Error('Source code not found in response');
    }
    
    log(`  Interface source code retrieved (${result.data.length} chars)`, 'gray');
  });
  
  await runTest('Activate Interface', async () => {
    const result = await programHandler.activateObject({
      objectUri: interfaceUri,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await programHandler.getObjectMetadata({
      objectUri: interfaceUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Interface ${interfaceName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Report Program Tests
  // ============================================
  
  await runTest('Create Report Program', async () => {
    const result = await programHandler.createReportProgram({
      name: reportName,
      description: 'Test report created by integration test',
      programType: 'executable',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await programHandler.getObjectMetadata({
      objectUri: reportUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Report ${reportName} created and verified`, 'gray');
  });
  
  await runTest('Read Report Metadata', async () => {
    const result = await programHandler.getObjectMetadata({
      objectUri: reportUri,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Report name not found in response');
    }
    
    log(`  Report ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Get Report Source Code', async () => {
    const result = await programHandler.getSourceCode({
      objectUri: `${reportUri}/source/main`,
    });
    
    if (!result.success) {
      throw new Error(`Get source failed: ${result.error?.message}`);
    }
    
    if (result.data === undefined || result.data === null) {
      throw new Error('Source code not found in response');
    }
    
    log(`  Report source code retrieved (${result.data.length} chars)`, 'gray');
  });
  
  await runTest('Update Report Source Code', async () => {
    const newSource = `REPORT ${reportName.toLowerCase()}.
* Test report modified by integration test
WRITE: 'Hello from integration test'.`;
    
    const result = await programHandler.updateSourceCode({
      objectUri: `${reportUri}/source/main`,
      source: newSource,
    });
    
    if (!result.success) {
      throw new Error(`Update source failed: ${result.error?.message}`);
    }
    
    // Read back to verify update
    const readResult = await programHandler.getSourceCode({
      objectUri: `${reportUri}/source/main`,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back source failed: ${readResult.error?.message}`);
    }
    
    if (!readResult.data?.includes('Hello from integration test')) {
      throw new Error('Updated source code not found in read back');
    }
    
    log(`  Report source code updated and verified`, 'gray');
  });
  
  await runTest('Check Report Syntax', async () => {
    const result = await programHandler.checkSyntax({
      objectUri: reportUri,
    });
    
    if (!result.success) {
      throw new Error(`Syntax check failed: ${result.error?.message}`);
    }
    
    if (result.data?.hasErrors) {
      const errors = result.data.messages.filter(m => m.severity === 'error');
      throw new Error(`Syntax errors found: ${errors.map(e => e.message).join(', ')}`);
    }
    
    log(`  Report syntax check passed`, 'gray');
  });
  
  await runTest('Activate Report', async () => {
    const result = await programHandler.activateObject({
      objectUri: reportUri,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await programHandler.getObjectMetadata({
      objectUri: reportUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Report ${reportName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Function Group Tests
  // ============================================
  
  await runTest('Create Function Group', async () => {
    const result = await programHandler.createFunctionGroup({
      name: functionGroupName,
      description: 'Test function group created by integration test',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await programHandler.getObjectMetadata({
      objectUri: functionGroupUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Function group ${functionGroupName} created and verified`, 'gray');
  });
  
  await runTest('Read Function Group Metadata', async () => {
    const result = await programHandler.getObjectMetadata({
      objectUri: functionGroupUri,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Function group name not found in response');
    }
    
    log(`  Function group ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Function Group', async () => {
    const result = await programHandler.activateObject({
      objectUri: functionGroupUri,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await programHandler.getObjectMetadata({
      objectUri: functionGroupUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Function group ${functionGroupName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Function Module Tests
  // ============================================
  
  await runTest('Create Function Module', async () => {
    const result = await programHandler.createFunctionModule({
      name: functionModuleName,
      functionGroup: functionGroupName,
      description: 'Test function module created by integration test',
      importParameters: [
        { name: 'IV_INPUT', typeName: 'STRING', description: 'Input parameter' },
      ],
      exportParameters: [
        { name: 'EV_OUTPUT', typeName: 'STRING', description: 'Output parameter' },
      ],
      exceptions: [
        { name: 'ERROR', description: 'General error' },
      ],
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await programHandler.getObjectMetadata({
      objectUri: functionModuleUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Function module ${functionModuleName} created and verified`, 'gray');
  });
  
  await runTest('Read Function Module Metadata', async () => {
    const result = await programHandler.getObjectMetadata({
      objectUri: functionModuleUri,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Function module name not found in response');
    }
    
    log(`  Function module ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Function Module', async () => {
    const result = await programHandler.activateObject({
      objectUri: functionModuleUri,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await programHandler.getObjectMetadata({
      objectUri: functionModuleUri,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Function module ${functionModuleName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Search and Where Used Tests
  // ============================================
  
  await runTest('Search Objects', async () => {
    const result = await programHandler.searchObjects({
      query: `${TEST_PREFIX}*`,
      maxResults: 50,
    });
    
    if (!result.success) {
      throw new Error(`Search failed: ${result.error?.message}`);
    }
    
    if (!result.data?.objects || result.data.objects.length === 0) {
      throw new Error('No objects found in search');
    }
    
    log(`  Found ${result.data.objects.length} objects matching ${TEST_PREFIX}*`, 'gray');
  });
  
  await runTest('Where Used - Class', async () => {
    const result = await programHandler.whereUsed({
      objectUri: classUri,
      objectName: className,
      objectType: 'CLAS',
    });
    
    if (!result.success) {
      throw new Error(`Where used failed: ${result.error?.message}`);
    }
    
    // Even if no usages, the result should be valid
    log(`  Where used for ${className}: ${result.data?.usages.length || 0} usages found`, 'gray');
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