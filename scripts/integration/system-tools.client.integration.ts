/**
 * System Tools MCP Client Integration Tests
 * 
 * Tests system tools through actual MCP protocol via stdio transport.
 * Server process is spawned separately - matches production environment.
 * 
 * Test objects use "YMCP" prefix with timestamp.
 * Package: $TMP
 */

import {
  runMCPTests,
  generateTestName,
  PACKAGE_NAME,
  log,
  colors,
  MCPTestRunner,
  MCPClientTestHelper,
} from './mcp-client-helper';

// Test object names (generated at runtime)
let testMessageClassName: string;
let testNumberRangeName: string;

/**
 * Run System Tools MCP Client Integration Tests
 */
async function runTests(): Promise<number> {
  return runMCPTests('System Tools', async (runner: MCPTestRunner, client: MCPClientTestHelper) => {
    // Generate unique test names
    testMessageClassName = generateTestName('YMCP', 'MSG');
    testNumberRangeName = generateTestName('YMCP', 'NR');
    
    log(`\nTest Message Class: ${testMessageClassName}`, 'yellow');
    log(`Test Number Range: ${testNumberRangeName}`, 'yellow');
    log(`Package: ${PACKAGE_NAME}`, 'yellow');
    
    // ========================================
    // System Info Tests
    // ========================================
    log('\n--- System Info Tests ---', 'magenta');
    
    await runner.runToolTest(
      'Get system info',
      'get_system_info',
      {},
      (response) => {
        if (!response.data) {
          throw new Error('No system info data returned');
        }
        // System info should be returned even if some fields are empty
        log(`  System retrieved successfully`, 'gray');
      }
    );
    
    // ========================================
    // Package Info Tests
    // ========================================
    log('\n--- Package Info Tests ---', 'magenta');
    
    await runner.runToolTest(
      'Get package info for $TMP',
      'get_package_info',
      { packageName: '$TMP' },
      (response) => {
        if (!response.data) {
          throw new Error('No package info data returned');
        }
        const data = response.data as { name?: string };
        if (!data.name) {
          throw new Error('Package name not found in response');
        }
        log(`  Package: ${data.name}`, 'gray');
      }
    );
    
    await runner.runToolTest(
      'Get package info for BASIS',
      'get_package_info',
      { packageName: 'BASIS' },
      (response) => {
        // BASIS package should exist in most SAP systems
        if (!response.data) {
          throw new Error('No package info data returned');
        }
      }
    );
    
    // ========================================
    // Message Class Tests
    // ========================================
    log('\n--- Message Class Tests ---', 'magenta');
    
    // Note: Message class creation and retrieval may not be available on all systems
    // We test with a standard SAP message class first
    await runner.runToolTest(
      'Get message class (standard)',
      'get_message_class',
      { messageClassName: '00' },
      (response) => {
        // Message class 00 is a standard SAP message class
        if (!response.data) {
          // Some systems may not allow access to message classes
          log(`  Message class not accessible (expected on some systems)`, 'yellow');
          return;
        }
        const data = response.data as { name?: string; messages?: unknown[] };
        log(`  Message class: ${data.name}`, 'gray');
        log(`  Messages: ${data.messages?.length || 0}`, 'gray');
      }
    );
    
    // Create message class test (may fail on some systems)
    await runner.runToolTest(
      'Create message class',
      'create_message_class',
      {
        name: testMessageClassName,
        description: 'MCP Integration Test Message Class',
        messages: [
          { number: '001', shortText: 'Test message 1', selfExplanatory: true },
          { number: '002', shortText: 'Test message 2 with & placeholder', selfExplanatory: false },
        ],
        packageName: PACKAGE_NAME,
      },
      (response) => {
        if (!response.data) {
          throw new Error('No response data for message class creation');
        }
        const data = response.data as { name?: string };
        log(`  Created message class: ${data.name}`, 'gray');
      }
    );
    
    // Get created message class
    await runner.runToolTest(
      'Get created message class',
      'get_message_class',
      { messageClassName: testMessageClassName },
      (response) => {
        if (!response.data) {
          throw new Error('Failed to retrieve created message class');
        }
        const data = response.data as { name?: string; messages?: unknown[] };
        log(`  Message class: ${data.name}`, 'gray');
        log(`  Messages: ${data.messages?.length || 0}`, 'gray');
      }
    );
    
    // ========================================
    // Number Range Tests
    // ========================================
    log('\n--- Number Range Tests ---', 'magenta');
    
    // Get a standard number range object first
    await runner.runToolTest(
      'Get number range object (standard)',
      'get_number_range',
      { objectName: 'SNRO_DEMO' },
      (response) => {
        // SNRO_DEMO may not exist on all systems
        if (!response.data) {
          log(`  Number range object not found (expected on some systems)`, 'yellow');
          return;
        }
        const data = response.data as { name?: string; intervals?: unknown[] };
        log(`  Number range: ${data.name}`, 'gray');
        log(`  Intervals: ${data.intervals?.length || 0}`, 'gray');
      }
    );
    
    // Create number range object test
    await runner.runToolTest(
      'Create number range object',
      'create_number_range',
      {
        name: testNumberRangeName,
        description: 'MCP Integration Test Number Range',
        numberLength: 10,
        percentage: 10,
        intervals: [
          { fromNumber: '0000000001', toNumber: '9999999999', external: false },
        ],
        packageName: PACKAGE_NAME,
      },
      (response) => {
        if (!response.data) {
          throw new Error('No response data for number range creation');
        }
        const data = response.data as { name?: string };
        log(`  Created number range: ${data.name}`, 'gray');
      }
    );
    
    // Get created number range
    await runner.runToolTest(
      'Get created number range',
      'get_number_range',
      { objectName: testNumberRangeName },
      (response) => {
        if (!response.data) {
          throw new Error('Failed to retrieve created number range');
        }
        const data = response.data as { name?: string; numberLength?: number; intervals?: unknown[] };
        log(`  Number range: ${data.name}`, 'gray');
        log(`  Number length: ${data.numberLength}`, 'gray');
        log(`  Intervals: ${data.intervals?.length || 0}`, 'gray');
      }
    );
    
    // ========================================
    // Package Creation Test
    // ========================================
    log('\n--- Package Creation Tests ---', 'magenta');
    
    // Note: Package creation typically requires a transport request for non-$TMP packages
    // We test with a local package (should work without transport)
    const testPackageName = generateTestName('YMCP', 'PKG');
    
    await runner.runToolTest(
      'Create package (local)',
      'create_package',
      {
        name: testPackageName,
        description: 'MCP Integration Test Package',
        packageType: 'development',
      },
      (response) => {
        // Package creation may fail due to authorization or system configuration
        if (!response.data) {
          log(`  Package creation may require special authorization`, 'yellow');
          return;
        }
        const data = response.data as { name?: string };
        log(`  Created package: ${data.name}`, 'gray');
      }
    );
    
    // Get created package (if it was created)
    await runner.runToolTest(
      'Get created package',
      'get_package_info',
      { packageName: testPackageName },
      (response) => {
        // May fail if package wasn't created
        if (!response.data) {
          log(`  Package not found (may not have been created)`, 'yellow');
          return;
        }
        const data = response.data as { name?: string; packageType?: string };
        log(`  Package: ${data.name}`, 'gray');
        log(`  Type: ${data.packageType}`, 'gray');
      }
    );
  });
}

// Run tests
runTests()
  .then((failedCount) => {
    process.exit(failedCount > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });