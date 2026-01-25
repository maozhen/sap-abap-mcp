/**
 * Integration Tests for DDIC MCP Tools
 * Tests data dictionary object creation, reading, and activation via true MCP client
 * 
 * This test file uses a real MCP client that:
 * - Spawns the server as a separate process
 * - Communicates via stdio transport (same as production)
 * - Does NOT directly call project code
 * 
 * Test objects use "YMCP" prefix and are saved in "$TMP" package.
 */

import { runMCPTests, TEST_PREFIX, PACKAGE_NAME, log, generateTestName } from './mcp-client-helper';

async function main(): Promise<void> {
  const failedCount = await runMCPTests('DDIC', async (runner, client) => {
    // Generate unique test object names with timestamp
    const timestamp = Date.now().toString().slice(-6);
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
      'Create Domain via MCP Client',
      'create_domain',
      {
        name: domainName,
        description: 'Test domain created via MCP client',
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
      'Read Domain via MCP Client',
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
      'Activate Domain via MCP Client',
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
      'Create Data Element via MCP Client',
      'create_data_element',
      {
        name: dataElementName,
        description: 'Test data element created via MCP client',
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
      'Read Data Element via MCP Client',
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
      'Activate Data Element via MCP Client',
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
      'Create Structure via MCP Client',
      'create_structure',
      {
        name: structureName,
        description: 'Test structure created via MCP client',
        components: [
          { name: 'FIELD1', type: dataElementName },
          { name: 'FIELD2', type: dataElementName },
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
      'Read Structure via MCP Client',
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
      'Activate Structure via MCP Client',
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
      'Create Table Type via MCP Client',
      'create_table_type',
      {
        name: tableTypeName,
        description: 'Test table type created via MCP client',
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
      'Read Table Type via MCP Client',
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
      'Activate Table Type via MCP Client',
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
      'Create Database Table via MCP Client',
      'create_database_table',
      {
        name: tableName,
        description: 'Test table created via MCP client',
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
      'Read Database Table via MCP Client',
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
      'Activate Database Table via MCP Client',
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
  });
  
  // Exit with appropriate code
  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch((error) => {
  log(`Fatal error: ${error}`, 'red');
  process.exit(1);
});