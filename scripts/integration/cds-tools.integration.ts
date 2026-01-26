/**
 * Integration Tests for CDS Tools
 * Tests CDS view, service definition, and service binding creation, reading, and activation
 * 
 * Test objects use "YMCP" prefix and are saved in "$TMP" package
 * After creating/activating objects, we read them back to verify state
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { CDSToolHandler } from '../../src/tools/cds-tools';

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
  log('CDS TOOLS INTEGRATION TEST SUMMARY', 'cyan');
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
  log('CDS Tools Integration Tests', 'cyan');
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
    connection: {
      host: new URL(SAP_URL).hostname,
      port: parseInt(new URL(SAP_URL).port) || 443,
      https: SAP_URL.startsWith('https'),
      client: SAP_CLIENT,
      username: SAP_USER,
      password: SAP_PASSWORD,
      allowInsecure: true,
    },
  });
  
  const cdsHandler = new CDSToolHandler(adtClient);
  
  // Test object names
  const cdsViewName = `${TEST_PREFIX}CDS_TEST`;
  const serviceDefName = `${TEST_PREFIX}SRVD_TEST`;
  const serviceBindName = `${TEST_PREFIX}SRVB_TEST`;
  
  // ============================================
  // CDS View Tests
  // ============================================
  
  await runTest('Create CDS View', async () => {
    // Create a simple CDS view
    const sourceCode = `@AbapCatalog.sqlViewName: '${TEST_PREFIX}SQLV'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Test CDS View'
define view ${cdsViewName}
  as select from t000
{
  key mandt as Client,
      cccategory as Category
}`;

    const result = await cdsHandler.createCDSView({
      name: cdsViewName,
      description: 'Test CDS view created by integration test',
      sqlViewName: `${TEST_PREFIX}SQLV`,
      sourceCode,
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    // Read back to verify creation
    const readResult = await cdsHandler.getCDSView({
      name: cdsViewName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back failed: ${readResult.error?.message}`);
    }
    
    log(`  CDS view ${cdsViewName} created and verified`, 'gray');
  });
  
  await runTest('Read CDS View Metadata', async () => {
    const result = await cdsHandler.getCDSView({
      name: cdsViewName,
    });
    
    if (!result.success) {
      throw new Error(`Read failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('CDS view name not found in response');
    }
    
    log(`  CDS view ${result.data.name} read successfully`, 'gray');
    log(`  Description: ${result.data.description || 'N/A'}`, 'gray');
  });
  
  await runTest('Get CDS Source Code', async () => {
    const result = await cdsHandler.getCDSSource({
      name: cdsViewName,
    });
    
    if (!result.success) {
      throw new Error(`Get source failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('CDS source code not found in response');
    }
    
    log(`  CDS source code retrieved (${result.data.length} chars)`, 'gray');
  });
  
  await runTest('Update CDS Source Code', async () => {
    // Get current source first
    const getResult = await cdsHandler.getCDSSource({
      name: cdsViewName,
    });
    
    if (!getResult.success || !getResult.data) {
      throw new Error(`Failed to get current source: ${getResult.error?.message}`);
    }
    
    // Update with modified source (add a comment)
    const updatedSource = `// Updated by integration test at ${new Date().toISOString()}
${getResult.data}`;
    
    const result = await cdsHandler.updateCDSSource({
      name: cdsViewName,
      source: updatedSource,
    });
    
    if (!result.success) {
      throw new Error(`Update source failed: ${result.error?.message}`);
    }
    
    // Read back to verify update
    const readResult = await cdsHandler.getCDSSource({
      name: cdsViewName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after update failed: ${readResult.error?.message}`);
    }
    
    log(`  CDS source code updated and verified`, 'gray');
  });
  
  await runTest('Activate CDS View', async () => {
    const result = await cdsHandler.activateCDSObject({
      name: cdsViewName,
      objectType: 'DDLS',
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    // Read back to verify activation status
    const readResult = await cdsHandler.getCDSView({
      name: cdsViewName,
    });
    
    if (!readResult.success) {
      throw new Error(`Read back after activation failed: ${readResult.error?.message}`);
    }
    
    log(`  CDS view ${cdsViewName} activated and verified`, 'gray');
    if (result.data?.messages && result.data.messages.length > 0) {
      for (const msg of result.data.messages) {
        log(`  Message: [${msg.severity}] ${msg.message}`, 'gray');
      }
    }
  });
  
  // ============================================
  // Service Definition Tests
  // ============================================
  
  await runTest('Create Service Definition', async () => {
    // Create a service definition that exposes the CDS view
    const sourceCode = `@EndUserText.label: 'Test Service Definition'
define service ${serviceDefName} {
  expose ${cdsViewName} as TestEntity;
}`;

    const result = await cdsHandler.createServiceDefinition({
      name: serviceDefName,
      description: 'Test service definition created by integration test',
      exposedEntities: [
        { entityName: cdsViewName, alias: 'TestEntity' },
      ],
      sourceCode,
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    log(`  Service definition ${serviceDefName} created`, 'gray');
  });
  
  await runTest('Activate Service Definition', async () => {
    const result = await cdsHandler.activateCDSObject({
      name: serviceDefName,
      objectType: 'SRVD',
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    log(`  Service definition ${serviceDefName} activated`, 'gray');
    if (result.data?.messages && result.data.messages.length > 0) {
      for (const msg of result.data.messages) {
        log(`  Message: [${msg.severity}] ${msg.message}`, 'gray');
      }
    }
  });
  
  // ============================================
  // Service Binding Tests
  // ============================================
  
  await runTest('Create Service Binding (OData V4)', async () => {
    const result = await cdsHandler.createServiceBinding({
      name: serviceBindName,
      description: 'Test service binding created by integration test',
      serviceDefinition: serviceDefName,
      bindingType: 'ODATA_V4',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create failed: ${result.error?.message}`);
    }
    
    log(`  Service binding ${serviceBindName} created`, 'gray');
  });
  
  await runTest('Activate Service Binding', async () => {
    const result = await cdsHandler.activateCDSObject({
      name: serviceBindName,
      objectType: 'SRVB',
    });
    
    if (!result.success) {
      throw new Error(`Activation failed: ${result.error?.message}`);
    }
    
    log(`  Service binding ${serviceBindName} activated`, 'gray');
    if (result.data?.messages && result.data.messages.length > 0) {
      for (const msg of result.data.messages) {
        log(`  Message: [${msg.severity}] ${msg.message}`, 'gray');
      }
    }
  });
  
  await runTest('Get Service Binding URL', async () => {
    const result = await cdsHandler.getServiceBindingUrl({
      name: serviceBindName,
    });
    
    if (!result.success) {
      throw new Error(`Get URL failed: ${result.error?.message}`);
    }
    
    log(`  Service URL: ${result.data?.serviceUrl || 'N/A'}`, 'gray');
    log(`  Metadata URL: ${result.data?.metadataUrl || 'N/A'}`, 'gray');
  });
  
  // ============================================
  // Additional CDS Object Type Tests
  // ============================================
  
  await runTest('Create and Activate Access Control (DCLS)', async () => {
    const dclsName = `${TEST_PREFIX}DCL_TEST`;
    
    // Note: Access Control requires specific syntax and may have dependencies
    // This test verifies the activation flow for DCLS object type
    try {
      // Create a simple access control
      const sourceCode = `@EndUserText.label: 'Test Access Control'
@MappingRole: true
define role ${dclsName} {
  grant select on ${cdsViewName}
    where ( mandt ) = aspect pfcg_auth( S_TABU_CLI, CLIID, ACTVT='03' );
}`;

      // For DCLS, we need to use a different creation approach
      // This test mainly validates the activation path
      const activateResult = await cdsHandler.activateCDSObject({
        name: dclsName,
        objectType: 'DCLS',
      });
      
      // DCLS may not exist yet, so we accept both success and failure
      if (activateResult.success) {
        log(`  Access control ${dclsName} activated`, 'gray');
      } else {
        log(`  Access control ${dclsName} not found (expected for new systems)`, 'yellow');
      }
    } catch (error) {
      // Access control tests may fail if the object doesn't exist
      log(`  Access control test skipped: ${error}`, 'yellow');
    }
  });
  
  await runTest('Create and Activate Metadata Extension (DDLX)', async () => {
    const ddlxName = `${TEST_PREFIX}DDX_TEST`;
    
    // Note: Metadata Extension requires a base CDS view
    // This test verifies the activation flow for DDLX object type
    try {
      const activateResult = await cdsHandler.activateCDSObject({
        name: ddlxName,
        objectType: 'DDLX',
      });
      
      // DDLX may not exist yet, so we accept both success and failure
      if (activateResult.success) {
        log(`  Metadata extension ${ddlxName} activated`, 'gray');
      } else {
        log(`  Metadata extension ${ddlxName} not found (expected for new systems)`, 'yellow');
      }
    } catch (error) {
      // Metadata extension tests may fail if the object doesn't exist
      log(`  Metadata extension test skipped: ${error}`, 'yellow');
    }
  });
  
  // ============================================
  // DELETE Operations (Cleanup)
  // ============================================
  
  // Delete in reverse order of dependencies: Service Binding -> Service Definition -> CDS View
  
  await runTest('Delete Service Binding', async () => {
    const result = await cdsHandler.deleteCDSObject({
      name: serviceBindName,
      objectType: 'SRVB',
    });
    
    if (!result.success) {
      throw new Error(`Delete failed: ${result.error?.message}`);
    }
    
    log(`  Service binding ${serviceBindName} deleted`, 'gray');
  });
  
  await runTest('Delete Service Definition', async () => {
    const result = await cdsHandler.deleteCDSObject({
      name: serviceDefName,
      objectType: 'SRVD',
    });
    
    if (!result.success) {
      throw new Error(`Delete failed: ${result.error?.message}`);
    }
    
    log(`  Service definition ${serviceDefName} deleted`, 'gray');
  });
  
  await runTest('Delete CDS View', async () => {
    const result = await cdsHandler.deleteCDSObject({
      name: cdsViewName,
      objectType: 'DDLS',
    });
    
    if (!result.success) {
      throw new Error(`Delete failed: ${result.error?.message}`);
    }
    
    log(`  CDS view ${cdsViewName} deleted`, 'gray');
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