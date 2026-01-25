/**
 * Integration Tests for Program MCP Tools
 * Tests ABAP class, interface, function group, function module, and report program operations via true MCP client
 * 
 * This test file uses a real MCP client that:
 * - Spawns the server as a separate process
 * - Communicates via stdio transport (same as production)
 * - Does NOT directly call project code
 * 
 * Test objects use "YMCP" prefix and are saved in "$TMP" package.
 */

import { runMCPTests, TEST_PREFIX, PACKAGE_NAME, log } from './mcp-client-helper';

async function main(): Promise<void> {
  const failedCount = await runMCPTests('Program', async (runner, client) => {
    // Generate unique test object names with timestamp
    const timestamp = Date.now().toString().slice(-6);
    const className = `${TEST_PREFIX}CL${timestamp}`;
    const interfaceName = `${TEST_PREFIX}IF${timestamp}`;
    const functionGroupName = `${TEST_PREFIX}FG${timestamp}`;
    const functionModuleName = `Z_${TEST_PREFIX}_FM_${timestamp}`;
    const reportName = `${TEST_PREFIX}RPT${timestamp}`;
    
    log(`\nTest objects will use timestamp suffix: ${timestamp}`, 'yellow');
    log(`Class: ${className}`, 'gray');
    log(`Interface: ${interfaceName}`, 'gray');
    log(`Function Group: ${functionGroupName}`, 'gray');
    log(`Function Module: ${functionModuleName}`, 'gray');
    log(`Report: ${reportName}`, 'gray');
    
    // ============================================
    // Interface Tests (create_interface)
    // ============================================
    
    log('\n' + '─'.repeat(40), 'cyan');
    log('INTERFACE TESTS', 'cyan');
    log('─'.repeat(40), 'cyan');
    
    await runner.runToolTest(
      'Create Interface via MCP Client',
      'create_interface',
      {
        name: interfaceName,
        description: 'Test interface created via MCP client',
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
      'Activate Interface via MCP Client',
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
    
    // ============================================
    // Class Tests (create_class)
    // ============================================
    
    log('\n' + '─'.repeat(40), 'cyan');
    log('CLASS TESTS', 'cyan');
    log('─'.repeat(40), 'cyan');
    
    await runner.runToolTest(
      'Create Class via MCP Client',
      'create_class',
      {
        name: className,
        description: 'Test class created via MCP client',
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
      'Get Class Source Code via MCP Client',
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
    
    await runner.runToolTest(
      'Check Class Syntax via MCP Client',
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
      'Activate Class via MCP Client',
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
    // Function Group Tests (create_function_group)
    // ============================================
    
    log('\n' + '─'.repeat(40), 'cyan');
    log('FUNCTION GROUP TESTS', 'cyan');
    log('─'.repeat(40), 'cyan');
    
    await runner.runToolTest(
      'Create Function Group via MCP Client',
      'create_function_group',
      {
        name: functionGroupName,
        description: 'Test function group created via MCP client',
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
      'Activate Function Group via MCP Client',
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
    // Function Module Tests (create_function_module)
    // ============================================
    
    log('\n' + '─'.repeat(40), 'cyan');
    log('FUNCTION MODULE TESTS', 'cyan');
    log('─'.repeat(40), 'cyan');
    
    await runner.runToolTest(
      'Create Function Module via MCP Client',
      'create_function_module',
      {
        name: functionModuleName,
        functionGroup: functionGroupName,
        description: 'Test function module created via MCP client',
        importing: [
          { name: 'IV_INPUT', type: 'STRING', optional: false, description: 'Input parameter' },
        ],
        exporting: [
          { name: 'EV_OUTPUT', type: 'STRING', description: 'Output parameter' },
        ],
        exceptions: ['INVALID_INPUT'],
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
      'Activate Function Module via MCP Client',
      'activate_object',
      {
        objectType: 'FUNC',
        objectName: functionModuleName,
      },
      (response) => {
        const data = response.data as any;
        if (!data?.success) {
          throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
        }
      }
    );
    
    // ============================================
    // Report Program Tests (create_report)
    // ============================================
    
    log('\n' + '─'.repeat(40), 'cyan');
    log('REPORT PROGRAM TESTS', 'cyan');
    log('─'.repeat(40), 'cyan');
    
    await runner.runToolTest(
      'Create Report Program via MCP Client',
      'create_report',
      {
        name: reportName,
        description: 'Test report created via MCP client',
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
      'Get Report Source Code via MCP Client',
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
    
    await runner.runToolTest(
      'Check Report Syntax via MCP Client',
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
      'Activate Report via MCP Client',
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
    // Search and Metadata Tests
    // ============================================
    
    log('\n' + '─'.repeat(40), 'cyan');
    log('SEARCH AND METADATA TESTS', 'cyan');
    log('─'.repeat(40), 'cyan');
    
    await runner.runToolTest(
      'Search Objects via MCP Client',
      'search_objects',
      {
        query: `${TEST_PREFIX}*`,
        objectType: 'CLAS',
        maxResults: 10,
      },
      (response) => {
        const data = response.data as any;
        if (!data?.success) {
          throw new Error(`Expected success=true, got: ${JSON.stringify(data)}`);
        }
      }
    );
    
    await runner.runToolTest(
      'Get Object Metadata via MCP Client',
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
    
    await runner.runToolTest(
      'Where Used via MCP Client',
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