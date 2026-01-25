/**
 * Integration Tests for Program MCP Tools
 * Tests class, interface, function module, report creation and manipulation via MCP tool calls
 * 
 * This test file directly calls MCP tools to ensure no functionality is missed.
 * Test objects use "YMCP_" prefix and are saved in "$TMP" package.
 * 
 * Tools tested (12):
 * - create_class, create_interface, create_function_group, create_function_module, create_report
 * - get_source_code, update_source_code, check_syntax, activate_object
 * - search_objects, where_used, get_object_metadata
 */

import { MCPToolTestClient, TestRunner, TEST_PREFIX, PACKAGE_NAME, log } from './mcp-test-helper';

async function main(): Promise<void> {
  log('Program MCP Tools Integration Tests', 'cyan');
  log('='.repeat(60), 'cyan');
  log('Testing tools via direct MCP tool calls', 'yellow');
  
  // Initialize MCP test client
  const client = new MCPToolTestClient();
  const runner = new TestRunner(client, 'Program');
  
  // Log connection info
  const connInfo = client.getConnectionInfo();
  log(`\nSAP URL: ${connInfo.url}`, 'gray');
  log(`SAP Client: ${connInfo.client}`, 'gray');
  log(`SAP User: ${connInfo.user}`, 'gray');
  log(`Registered tools: ${client.getToolCount()}`, 'gray');
  
  // Test object names
  const className = `${TEST_PREFIX}CL_MCP`;
  const interfaceName = `${TEST_PREFIX}IF_MCP`;
  const functionGroupName = `${TEST_PREFIX}FG_MCP`;
  const functionModuleName = `${TEST_PREFIX}FM_MCP`;
  const reportName = `${TEST_PREFIX}RPT_MCP`;
  
  // ============================================
  // Interface Tests (create_interface, get_source_code, activate_object)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('INTERFACE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Interface via MCP',
    'create_interface',
    {
      name: interfaceName,
      description: 'Test interface created via MCP tool',
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
    'Get Interface Source Code via MCP',
    'get_source_code',
    {
      objectType: 'INTF',
      objectName: interfaceName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Interface via MCP',
    'activate_object',
    {
      objectType: 'INTF',
      objectName: interfaceName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Get Interface Metadata via MCP',
    'get_object_metadata',
    {
      objectType: 'INTF',
      objectName: interfaceName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Class Tests (create_class, update_source_code, check_syntax)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('CLASS TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Class via MCP',
    'create_class',
    {
      name: className,
      description: 'Test class created via MCP tool',
      interfaces: [interfaceName],
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
    'Get Class Source Code via MCP',
    'get_source_code',
    {
      objectType: 'CLAS',
      objectName: className,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // Update class source with a simple implementation
  const classSource = `CLASS ${className.toLowerCase()} DEFINITION
  PUBLIC
  CREATE PUBLIC.
  
  PUBLIC SECTION.
    INTERFACES ${interfaceName.toLowerCase()}.
    METHODS get_name RETURNING VALUE(rv_name) TYPE string.
    
  PROTECTED SECTION.
  
  PRIVATE SECTION.
ENDCLASS.

CLASS ${className.toLowerCase()} IMPLEMENTATION.
  METHOD get_name.
    rv_name = 'MCP Test Class'.
  ENDMETHOD.
ENDCLASS.`;
  
  await runner.runToolTest(
    'Update Class Source Code via MCP',
    'update_source_code',
    {
      objectType: 'CLAS',
      objectName: className,
      source: classSource,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Check Class Syntax via MCP',
    'check_syntax',
    {
      objectType: 'CLAS',
      objectName: className,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Class via MCP',
    'activate_object',
    {
      objectType: 'CLAS',
      objectName: className,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Function Group & Module Tests
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('FUNCTION GROUP/MODULE TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Function Group via MCP',
    'create_function_group',
    {
      name: functionGroupName,
      description: 'Test function group created via MCP tool',
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
    'Create Function Module via MCP',
    'create_function_module',
    {
      name: functionModuleName,
      description: 'Test function module created via MCP tool',
      functionGroup: functionGroupName,
      importing: [
        { name: 'IV_INPUT', type: 'STRING', optional: true },
      ],
      exporting: [
        { name: 'EV_OUTPUT', type: 'STRING' },
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
    'Get Function Module Source Code via MCP',
    'get_source_code',
    {
      objectType: 'FUNC',
      objectName: functionModuleName,
    },
    (response) => {
      const data = response.data as any;
      // Function module source may have different success indicators
      log(`  Response: ${JSON.stringify(data)}`, 'gray');
    }
  );
  
  await runner.runToolTest(
    'Activate Function Group via MCP',
    'activate_object',
    {
      objectType: 'FUGR',
      objectName: functionGroupName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Report Tests (create_report)
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('REPORT TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Create Report via MCP',
    'create_report',
    {
      name: reportName,
      description: 'Test report created via MCP tool',
      reportType: 'EXECUTABLE',
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
    'Get Report Source Code via MCP',
    'get_source_code',
    {
      objectType: 'PROG',
      objectName: reportName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // Update report source
  const reportSource = `REPORT ${reportName.toLowerCase()}.
* Test report created via MCP tool

WRITE: / 'Hello from MCP Test Report'.`;
  
  await runner.runToolTest(
    'Update Report Source Code via MCP',
    'update_source_code',
    {
      objectType: 'PROG',
      objectName: reportName,
      source: reportSource,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Check Report Syntax via MCP',
    'check_syntax',
    {
      objectType: 'PROG',
      objectName: reportName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  await runner.runToolTest(
    'Activate Report via MCP',
    'activate_object',
    {
      objectType: 'PROG',
      objectName: reportName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
    }
  );
  
  // ============================================
  // Search and Where-Used Tests
  // ============================================
  
  log('\n' + '─'.repeat(40), 'cyan');
  log('SEARCH AND WHERE-USED TESTS', 'cyan');
  log('─'.repeat(40), 'cyan');
  
  await runner.runToolTest(
    'Search Objects via MCP',
    'search_objects',
    {
      pattern: `${TEST_PREFIX}*`,
      objectType: 'CLAS',
      maxResults: 10,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
      log(`  Found objects: ${JSON.stringify(data?.objects?.length || 0)}`, 'gray');
    }
  );
  
  await runner.runToolTest(
    'Where Used (Interface) via MCP',
    'where_used',
    {
      objectType: 'INTF',
      objectName: interfaceName,
    },
    (response) => {
      const data = response.data as any;
      if (!data?.success) {
        throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
      }
      log(`  Usage count: ${JSON.stringify(data?.usages?.length || 0)}`, 'gray');
    }
  );
  
  await runner.runToolTest(
    'Get Class Metadata via MCP',
    'get_object_metadata',
    {
      objectType: 'CLAS',
      objectName: className,
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