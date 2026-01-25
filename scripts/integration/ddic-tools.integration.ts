/**
 * Integration Tests for DDIC Tools
 * Tests data dictionary object creation, reading, and activation
 * 
 * Test objects use "YMCP" prefix and are saved in "$TMP" package
 * After creating/activating objects, we read them back to verify state
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { DDICToolHandler } from '../../src/tools/ddic-tools';

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
  log('DDIC TOOLS INTEGRATION TEST SUMMARY', 'cyan');
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
  log('DDIC Tools Integration Tests', 'cyan');
  log('='.repeat(60), 'cyan');
  
  // Validate environment - support both SAP_URL and SAP_HOST/SAP_PORT formats
  const { SAP_URL, SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD, SAP_SSL } = process.env;
  
  let host: string;
  let port: number;
  let isHttps: boolean;
  
  if (SAP_URL) {
    // Parse SAP_URL to extract host and port
    const sapUrl = new URL(SAP_URL);
    isHttps = sapUrl.protocol === 'https:';
    host = sapUrl.hostname;
    port = sapUrl.port ? parseInt(sapUrl.port, 10) : (isHttps ? 443 : 80);
  } else if (SAP_HOST) {
    // Use SAP_HOST and SAP_PORT directly
    host = SAP_HOST;
    port = SAP_PORT ? parseInt(SAP_PORT, 10) : 443;
    isHttps = SAP_SSL !== 'false';
  } else {
    log('Missing required environment variables: SAP_URL or SAP_HOST', 'red');
    log('Please set either SAP_URL (e.g., https://host:port) or SAP_HOST + SAP_PORT', 'red');
    process.exit(1);
  }
  
  if (!SAP_CLIENT || !SAP_USER || !SAP_PASSWORD) {
    log('Missing required environment variables: SAP_CLIENT, SAP_USER, SAP_PASSWORD', 'red');
    process.exit(1);
  }
  
  log(`SAP Host: ${host}:${port} (${isHttps ? 'HTTPS' : 'HTTP'})`, 'gray');
  log(`SAP Client: ${SAP_CLIENT}`, 'gray');
  log(`SAP User: ${SAP_USER}`, 'gray');
  
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
  
  const ddicHandler = new DDICToolHandler(adtClient);
  
  // Test object names
  const domainName = `${TEST_PREFIX}DOM_TEST`;
  const dataElementName = `${TEST_PREFIX}DTEL_TEST`;
  const tableName = `${TEST_PREFIX}TAB_TEST`;
  const structureName = `${TEST_PREFIX}STRUC_TEST`;
  const tableTypeName = `${TEST_PREFIX}TT_TEST`;
  
  // ============================================
  // Domain Tests
  // ============================================
  
  await runTest('Create Domain', async () => {
    const result = await ddicHandler.createDomain({
      name: domainName,
      description: 'Test domain created by integration test',
      dataType: 'CHAR',
      length: 10,
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'DOMA',
      name: domainName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Domain ${domainName} created and verified`, 'gray');
  });
  
  await runTest('Read Domain', async () => {
    const result = await ddicHandler.getDDICObject({
      objectType: 'DOMA',
      name: domainName,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Domain name not found in response');
    }
    
    log(`  Domain ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Domain', async () => {
    const result = await ddicHandler.activateDDICObject({
      objectType: 'DOMA',
      name: domainName,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'DOMA',
      name: domainName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Domain ${domainName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Data Element Tests
  // ============================================
  
  await runTest('Create Data Element', async () => {
    const result = await ddicHandler.createDataElement({
      name: dataElementName,
      description: 'Test data element created by integration test',
      domainName,
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'DTEL',
      name: dataElementName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Data element ${dataElementName} created and verified`, 'gray');
  });
  
  await runTest('Read Data Element', async () => {
    const result = await ddicHandler.getDDICObject({
      objectType: 'DTEL',
      name: dataElementName,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Data element name not found in response');
    }
    
    log(`  Data element ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Data Element', async () => {
    const result = await ddicHandler.activateDDICObject({
      objectType: 'DTEL',
      name: dataElementName,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'DTEL',
      name: dataElementName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Data element ${dataElementName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Structure Tests
  // ============================================
  
  await runTest('Create Structure', async () => {
    const result = await ddicHandler.createStructure({
      name: structureName,
      description: 'Test structure created by integration test',
      components: [
        { name: 'FIELD1', dataElement: dataElementName },
        { name: 'FIELD2', dataType: 'CHAR', length: 10 },
      ],
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'STRU',
      name: structureName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Structure ${structureName} created and verified`, 'gray');
  });
  
  await runTest('Read Structure', async () => {
    const result = await ddicHandler.getDDICObject({
      objectType: 'STRU',
      name: structureName,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Structure name not found in response');
    }
    
    log(`  Structure ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Structure', async () => {
    const result = await ddicHandler.activateDDICObject({
      objectType: 'STRU',
      name: structureName,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'STRU',
      name: structureName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Structure ${structureName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Table Type Tests
  // ============================================
  
  await runTest('Create Table Type', async () => {
    const result = await ddicHandler.createTableType({
      name: tableTypeName,
      description: 'Test table type created by integration test',
      lineType: structureName,
      lineTypeKind: 'structure',
      accessMode: 'standard',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'TTYP',
      name: tableTypeName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Table type ${tableTypeName} created and verified`, 'gray');
  });
  
  await runTest('Read Table Type', async () => {
    const result = await ddicHandler.getDDICObject({
      objectType: 'TTYP',
      name: tableTypeName,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Table type name not found in response');
    }
    
    log(`  Table type ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Table Type', async () => {
    const result = await ddicHandler.activateDDICObject({
      objectType: 'TTYP',
      name: tableTypeName,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'TTYP',
      name: tableTypeName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Table type ${tableTypeName} activated and verified`, 'gray');
  });
  
  // ============================================
  // Database Table Tests
  // ============================================
  
  await runTest('Create Database Table', async () => {
    const result = await ddicHandler.createDatabaseTable({
      name: tableName,
      description: 'Test table created by integration test',
      fields: [
        { name: 'CLIENT', dataElement: 'MANDT', isKey: true, isNotNull: true },
        { name: 'ID', dataElement: dataElementName, isKey: true, isNotNull: true },
        { name: 'VALUE', dataType: 'CHAR', length: 10, isKey: false, isNotNull: false },
      ],
      deliveryClass: 'A',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'TABL',
      name: tableName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  Table ${tableName} created and verified`, 'gray');
  });
  
  await runTest('Read Database Table', async () => {
    const result = await ddicHandler.getDDICObject({
      objectType: 'TABL',
      name: tableName,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Table name not found in response');
    }
    
    log(`  Table ${result.data.name} read successfully`, 'gray');
  });
  
  await runTest('Activate Database Table', async () => {
    const result = await ddicHandler.activateDDICObject({
      objectType: 'TABL',
      name: tableName,
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await ddicHandler.getDDICObject({
      objectType: 'TABL',
      name: tableName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  Table ${tableName} activated and verified`, 'gray');
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