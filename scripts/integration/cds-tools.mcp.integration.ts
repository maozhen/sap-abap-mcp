/**
 * Integration Tests for CDS MCP Tools
 * Tests CDS view, service definition, service binding creation and manipulation via MCP tool calls
 * 
 * This test file directly calls MCP tools to ensure no functionality is missed.
 * Test objects use "YMCP_" prefix and are saved in "$TMP" package.
 * 
 * Tools tested (9):
 * - create_cds_view, create_service_definition, create_service_binding
 * - get_cds_view, get_service_binding_url, get_cds_source
 * - update_cds_source, activate_cds_object, delete_cds_object
 */

import { MCPToolTestClient, TestRunner, TEST_PREFIX, PACKAGE_NAME, log } from './mcp-test-helper';

async function main(): Promise<void> {
  log('CDS MCP Tools Integration Tests', 'cyan');
  log('='.repeat(60), 'cyan');
  log('Testing tools via direct MCP tool calls', 'yellow');
  
  // Initialize MCP test client
  const client = new MCPToolTestClient();
  const runner = new TestRunner(client, 'CDS');
  
  // Log connection info
  const connInfo = client.getConnectionInfo();
  log(`\nSAP URL: ${connInfo.url}`, 'gray');
  log(`SAP Client: ${connInfo.client}`, 'gray');
  log(`SAP User: ${connInfo.user}`, 'gray');
  log(`Registered tools: ${client.getToolCount()}`, 'gray');
  
  // Test object names (use suffix "6" to avoid locked objects)
  const cdsViewName = `${TEST_PREFIX}CDS_MCP6`;
  const serviceDefName = `${TEST_PREFIX}SD_MCP6`;
  const serviceBindingName = `${TEST_PREFIX}SB_MCP6`;
  
  // ============================================
  // CDS View Tests (create_cds_view, get_cds_view, get_cds_source, update_cds_source, activate_cds_object)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('CDS VIEW TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create CDS View via MCP',
    'create_cds_view',
    {
      name: cdsViewName,
      description: 'Test CDS view created via MCP tool',
      dataSource: 'T000',
      fields: [
        { name: 'mandt', source: 'mandt' },
        { name: 'client_name', source: 'mtext' },
      ],
      package: PACKAGE_NAME,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Get CDS View via MCP',
    'get_cds_view',
    {
      name: cdsViewName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Get CDS Source via MCP',
    'get_cds_source',
    {
      name: cdsViewName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
      log(`  Source length: ${data?.source?.length || 0} chars`, 'gray');
    }
  );
  
  // Update CDS source with annotation
  // Note: sqlViewName must be different from CDS view name (SAP restriction)
  const sqlViewName = `${TEST_PREFIX}SQLV6`;
  const cdsSource = `@AbapCatalog.sqlViewName: '${sqlViewName}'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'MCP Test CDS View'
define view ${cdsViewName} as select from t000 {
  key mandt,
  mtext as client_name
}`;
  
  await runner.runToolTest(
    'Update CDS Source via MCP',
    'update_cds_source',
    {
      name: cdsViewName,
      source: cdsSource,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate CDS View via MCP',
    'activate_cds_object',
    {
      objectType: 'DDLS',
      objectName: cdsViewName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Service Definition Tests (create_service_definition)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('SERVICE DEFINITION TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Service Definition via MCP',
    'create_service_definition',
    {
      name: serviceDefName,
      description: 'Test service definition created via MCP tool',
      exposedEntities: [
        { name: 'TestEntity', cdsView: cdsViewName },
      ],
      package: PACKAGE_NAME,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Service Definition via MCP',
    'activate_cds_object',
    {
      objectType: 'SRVD',
      objectName: serviceDefName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Service Binding Tests (create_service_binding, get_service_binding_url)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('SERVICE BINDING TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Service Binding via MCP',
    'create_service_binding',
    {
      name: serviceBindingName,
      description: 'Test service binding created via MCP tool',
      serviceDefinition: serviceDefName,
      bindingType: 'ODATA_V4',
      package: PACKAGE_NAME,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Service Binding via MCP',
    'activate_cds_object',
    {
      objectType: 'SRVB',
      objectName: serviceBindingName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Get Service Binding URL via MCP',
    'get_service_binding_url',
    {
      name: serviceBindingName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
      log(`  Service URL: ${data?.url || 'N/A'}`, 'gray');
    }
  );
  
  // ============================================
  // Delete Tests (delete_cds_object)
  // Delete in reverse dependency order: Service Binding -> Service Definition -> CDS View
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('DELETE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Delete Service Binding via MCP',
    'delete_cds_object',
    {
      name: serviceBindingName,
      objectType: 'SRVB',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Delete Service Definition via MCP',
    'delete_cds_object',
    {
      name: serviceDefName,
      objectType: 'SRVD',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Delete CDS View via MCP',
    'delete_cds_object',
    {
      name: cdsViewName,
      objectType: 'DDLS',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // Print summary
  runner.printSummary();
  
  // Exit with appropriate code
  process.exit(runner.getFailedCount() > 0 ? 1 : 0);
}

main().catch((error) => {
  log(`Fatal error: ${error}`, 'red');
  process.exit(1);
});