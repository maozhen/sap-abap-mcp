/**
 * Integration Tests for DDIC MCP Tools
 * Tests data dictionary object creation, reading, and activation via MCP tool calls
 * 
 * This test file directly calls MCP tools to ensure no functionality is missed.
 * Test objects use "YMCP_" prefix and are saved in "$TMP" package.
 */

import { MCPToolTestClient, TestRunner, TEST_PREFIX, PACKAGE_NAME, log } from './mcp-test-helper';

async function main(): Promise<void> {
  log('DDIC MCP Tools Integration Tests', 'cyan');
  log('='.repeat(60), 'cyan');
  log('Testing tools via direct MCP tool calls', 'yellow');
  
  // Initialize MCP test client
  const client = new MCPToolTestClient();
  const runner = new TestRunner(client, 'DDIC');
  
  // Log connection info
  const connInfo = client.getConnectionInfo();
  log(`\nSAP URL: ${connInfo.url}`, 'gray');
  log(`SAP Client: ${connInfo.client}`, 'gray');
  log(`SAP User: ${connInfo.user}`, 'gray');
  log(`Registered tools: ${client.getToolCount()}`, 'gray');
  
  // Test object names - use timestamp for uniqueness to avoid conflicts with corrupted objects
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const domainName = `${TEST_PREFIX}DOM${timestamp}`;
  const dataElementName = `${TEST_PREFIX}DTE${timestamp}`;
  const tableName = `${TEST_PREFIX}TAB${timestamp}`;
  const structureName = `${TEST_PREFIX}STR${timestamp}`;
  const tableTypeName = `${TEST_PREFIX}TT${timestamp}`;
  
  log(`\nTest objects will use timestamp suffix: ${timestamp}`, 'yellow');
  log(`Domain: ${domainName}`, 'gray');
  log(`Data Element: ${dataElementName}`, 'gray');
  log(`Table: ${tableName}`, 'gray');
  log(`Structure: ${structureName}`, 'gray');
  log(`Table Type: ${tableTypeName}`, 'gray');
  
  // ============================================
  // Domain Tests (create_domain, get_ddic_object, activate_ddic_object)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('DOMAIN TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Domain via MCP',
    'create_domain',
    {
      name: domainName,
      description: 'Test domain created via MCP tool',
      dataType: 'CHAR',
      length: 10,
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
    'Read Domain via MCP',
    'get_ddic_object',
    {
      objectType: 'DOMA',
      objectName: domainName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Domain via MCP',
    'activate_ddic_object',
    {
      objectType: 'DOMA',
      objectName: domainName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Data Element Tests (create_data_element)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('DATA ELEMENT TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Data Element via MCP',
    'create_data_element',
    {
      name: dataElementName,
      description: 'Test data element created via MCP tool',
      domain: domainName,
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
    'Read Data Element via MCP',
    'get_ddic_object',
    {
      objectType: 'DTEL',
      objectName: dataElementName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Data Element via MCP',
    'activate_ddic_object',
    {
      objectType: 'DTEL',
      objectName: dataElementName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Structure Tests (create_structure)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('STRUCTURE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Structure via MCP',
    'create_structure',
    {
      name: structureName,
      description: 'Test structure created via MCP tool',
      components: [
        { name: 'FIELD1', type: dataElementName },
        { name: 'FIELD2', type: dataElementName },  // Use the created data element instead of invalid 'CHAR10'
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
    'Read Structure via MCP',
    'get_ddic_object',
    {
      objectType: 'STRU',
      objectName: structureName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Structure via MCP',
    'activate_ddic_object',
    {
      objectType: 'STRU',
      objectName: structureName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Update Structure via MCP',
    'update_structure',
    {
      name: structureName,
      description: 'Test structure updated via MCP tool',
      components: [
        { name: 'FIELD1', type: dataElementName },
        { name: 'FIELD2', type: dataElementName },
        { name: 'FIELD3', type: dataElementName },  // Add new field
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
    'Activate Updated Structure via MCP',
    'activate_ddic_object',
    {
      objectType: 'STRU',
      objectName: structureName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Table Type Tests (create_table_type)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('TABLE TYPE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Table Type via MCP',
    'create_table_type',
    {
      name: tableTypeName,
      description: 'Test table type created via MCP tool',
      lineType: structureName,
      accessMode: 'STANDARD',
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
    'Read Table Type via MCP',
    'get_ddic_object',
    {
      objectType: 'TTYP',
      objectName: tableTypeName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Table Type via MCP',
    'activate_ddic_object',
    {
      objectType: 'TTYP',
      objectName: tableTypeName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Database Table Tests (create_database_table)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('DATABASE TABLE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Database Table via MCP',
    'create_database_table',
    {
      name: tableName,
      description: 'Test table created via MCP tool',
      deliveryClass: 'A',
      fields: [
        { name: 'CLIENT', dataElement: 'MANDT', isKey: true, isNotNull: true },
        { name: 'ID', dataElement: dataElementName, isKey: true, isNotNull: true },
        { name: 'VALUE', dataElement: 'CHAR10', isKey: false, isNotNull: false },
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
    'Read Database Table via MCP',
    'get_ddic_object',
    {
      objectType: 'TABL',
      objectName: tableName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Database Table via MCP',
    'activate_ddic_object',
    {
      objectType: 'TABL',
      objectName: tableName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Update Database Table via MCP',
    'update_database_table',
    {
      name: tableName,
      description: 'Test table updated via MCP tool',
      deliveryClass: 'A',
      fields: [
        { name: 'CLIENT', dataElement: 'MANDT', isKey: true, isNotNull: true },
        { name: 'ID', dataElement: dataElementName, isKey: true, isNotNull: true },
        { name: 'VALUE', dataElement: 'CHAR10', isKey: false, isNotNull: false },
        { name: 'STATUS', dataElement: 'CHAR1', isKey: false, isNotNull: false },  // Add new field
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
    'Activate Updated Database Table via MCP',
    'activate_ddic_object',
    {
      objectType: 'TABL',
      objectName: tableName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Delete Tests (delete_ddic_object)
  // Delete in reverse dependency order:
  // Table Type -> Database Table -> Structure -> Data Element -> Domain
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('DELETE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Delete Table Type via MCP',
    'delete_ddic_object',
    {
      name: tableTypeName,
      objectType: 'TTYP',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Delete Database Table via MCP',
    'delete_ddic_object',
    {
      name: tableName,
      objectType: 'TABL',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Delete Structure via MCP',
    'delete_ddic_object',
    {
      name: structureName,
      objectType: 'STRU',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Delete Data Element via MCP',
    'delete_ddic_object',
    {
      name: dataElementName,
      objectType: 'DTEL',
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Delete Domain via MCP',
    'delete_ddic_object',
    {
      name: domainName,
      objectType: 'DOMA',
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