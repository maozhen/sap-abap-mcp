/**
 * System Tools MCP Integration Tests
 * 
 * Tests all 7 system-related MCP tools via direct MCP tool invocation:
 * 1. get_system_info - Get SAP system information
 * 2. get_package_info - Get package details
 * 3. create_package - Create a new package
 * 4. get_message_class - Get message class details
 * 5. create_message_class - Create a new message class
 * 6. get_number_range - Get number range details
 * 7. create_number_range - Create a new number range
 * 
 * @requires SAP_URL, SAP_CLIENT, SAP_USER, SAP_PASSWORD environment variables
 */

import {
  MCPToolTestClient,
  TestRunner,
  MCPToolResponse,
  TEST_PREFIX,
  PACKAGE_NAME,
  log,
  colors,
} from './mcp-test-helper';

// Test constants
const TEST_PACKAGE_NAME = `${TEST_PREFIX}PKG_T`;
const TEST_MESSAGE_CLASS = `${TEST_PREFIX}MSG_T`;
const TEST_NUMBER_RANGE = `${TEST_PREFIX}NR_T`;
const EXISTING_PACKAGE = 'BASIS'; // Well-known standard package
const EXISTING_MESSAGE_CLASS = 'SABP_UNIT'; // Standard message class

interface SystemToolsTestContext {
  client: MCPToolTestClient;
  runner: TestRunner;
  createdPackage?: string;
  createdMessageClass?: string;
  createdNumberRange?: string;
}

/**
 * Initialize test context
 */
async function initContext(): Promise<SystemToolsTestContext> {
  const client = new MCPToolTestClient();
  const runner = new TestRunner(client, 'System Tools');
  return { client, runner };
}

/**
 * Test: get_system_info
 * Gets SAP system information
 */
async function testGetSystemInfo(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Get basic system info
  await ctx.runner.runToolTest(
    'get_system_info - Get system information',
    'get_system_info',
    {},
    (response: MCPToolResponse) => {
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  System info retrieved`, 'gray');
          if (data.systemId) {
            log(`  System ID: ${data.systemId}`, 'gray');
          }
          if (data.release) {
            log(`  Release: ${data.release}`, 'gray');
          }
          if (data.client) {
            log(`  Client: ${data.client}`, 'gray');
          }
        }
      }
    }
  );
}

/**
 * Test: get_package_info
 * Gets package information
 */
async function testGetPackageInfo(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Get info for existing package
  await ctx.runner.runToolTest(
    'get_package_info - Get existing package info',
    'get_package_info',
    {
      packageName: EXISTING_PACKAGE,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  Package info retrieved`, 'gray');
          if (data.description) {
            log(`  Description: ${data.description}`, 'gray');
          }
          if (data.transportLayer) {
            log(`  Transport Layer: ${data.transportLayer}`, 'gray');
          }
        }
      }
    }
  );

  // Test 2: Get info for $TMP package
  await ctx.runner.runToolTest(
    'get_package_info - Get $TMP package info',
    'get_package_info',
    {
      packageName: '$TMP',
    },
    (response: MCPToolResponse) => {
      log(`  $TMP package info retrieved`, 'gray');
    }
  );

  // Test 3: Get info for non-existent package (should fail gracefully)
  await ctx.runner.runToolTest(
    'get_package_info - Handle non-existent package',
    'get_package_info',
    {
      packageName: 'ZZZZ_NOT_EXISTS_PKG',
    },
    (response: MCPToolResponse) => {
      // This should either return error or empty result
      log(`  Non-existent package handled`, 'gray');
    }
  );
}

/**
 * Test: create_package
 * Creates a new package
 */
async function testCreatePackage(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Create a local package
  await ctx.runner.runToolTest(
    'create_package - Create local package',
    'create_package',
    {
      packageName: TEST_PACKAGE_NAME,
      description: 'MCP Integration Test Package',
      softwareComponent: 'LOCAL',
      transportLayer: '',
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        ctx.createdPackage = TEST_PACKAGE_NAME;
        log(`  Package created: ${TEST_PACKAGE_NAME}`, 'gray');
      }
    }
  );

  // Test 2: Create package with parent package
  await ctx.runner.runToolTest(
    'create_package - Create sub-package',
    'create_package',
    {
      packageName: `${TEST_PACKAGE_NAME}2`,
      description: 'MCP Integration Test Sub-Package',
      parentPackage: '$TMP',
    },
    (response: MCPToolResponse) => {
      log(`  Sub-package creation attempted`, 'gray');
    }
  );
}

/**
 * Test: get_message_class
 * Gets message class details
 */
async function testGetMessageClass(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Get existing message class
  await ctx.runner.runToolTest(
    'get_message_class - Get existing message class',
    'get_message_class',
    {
      messageClass: EXISTING_MESSAGE_CLASS,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  Message class retrieved`, 'gray');
          if (data.description) {
            log(`  Description: ${data.description}`, 'gray');
          }
          if (Array.isArray(data.messages)) {
            log(`  Number of messages: ${data.messages.length}`, 'gray');
          }
        }
      }
    }
  );

  // Test 2: Get message class with specific message number
  await ctx.runner.runToolTest(
    'get_message_class - Get specific message',
    'get_message_class',
    {
      messageClass: EXISTING_MESSAGE_CLASS,
      messageNumber: '001',
    },
    (response: MCPToolResponse) => {
      log(`  Specific message retrieved`, 'gray');
    }
  );
}

/**
 * Test: create_message_class
 * Creates a new message class
 */
async function testCreateMessageClass(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Create a message class
  await ctx.runner.runToolTest(
    'create_message_class - Create message class',
    'create_message_class',
    {
      messageClass: TEST_MESSAGE_CLASS,
      description: 'MCP Integration Test Message Class',
      package: PACKAGE_NAME,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        ctx.createdMessageClass = TEST_MESSAGE_CLASS;
        log(`  Message class created: ${TEST_MESSAGE_CLASS}`, 'gray');
      }
    }
  );

  // Test 2: Create message class with initial messages
  await ctx.runner.runToolTest(
    'create_message_class - Create with messages',
    'create_message_class',
    {
      messageClass: `${TEST_MESSAGE_CLASS}2`,
      description: 'MCP Test Message Class with Messages',
      package: PACKAGE_NAME,
      messages: [
        { number: '001', text: 'Test message 1' },
        { number: '002', text: 'Test message 2 with & placeholder' },
      ],
    },
    (response: MCPToolResponse) => {
      log(`  Message class with messages creation attempted`, 'gray');
    }
  );
}

/**
 * Test: get_number_range
 * Gets number range details
 */
async function testGetNumberRange(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Get system number range (if exists)
  await ctx.runner.runToolTest(
    'get_number_range - Get number range',
    'get_number_range',
    {
      object: 'RF_BELEG', // Standard FI document number range
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data && typeof data === 'object') {
          log(`  Number range retrieved`, 'gray');
          if (data.description) {
            log(`  Description: ${data.description}`, 'gray');
          }
        }
      }
    }
  );

  // Test 2: Get number range with subobject
  await ctx.runner.runToolTest(
    'get_number_range - Get with subobject',
    'get_number_range',
    {
      object: 'RF_BELEG',
      subObject: '01',
    },
    (response: MCPToolResponse) => {
      log(`  Number range with subobject handled`, 'gray');
    }
  );
}

/**
 * Test: create_number_range
 * Creates a new number range
 */
async function testCreateNumberRange(ctx: SystemToolsTestContext): Promise<void> {
  // Test 1: Create a number range object
  await ctx.runner.runToolTest(
    'create_number_range - Create number range',
    'create_number_range',
    {
      object: TEST_NUMBER_RANGE,
      description: 'MCP Integration Test Number Range',
      domainName: 'NUMC10',
      package: PACKAGE_NAME,
    },
    (response: MCPToolResponse) => {
      if (!response.isError) {
        ctx.createdNumberRange = TEST_NUMBER_RANGE;
        log(`  Number range created: ${TEST_NUMBER_RANGE}`, 'gray');
      }
    }
  );

  // Test 2: Create number range with intervals
  await ctx.runner.runToolTest(
    'create_number_range - Create with intervals',
    'create_number_range',
    {
      object: `${TEST_NUMBER_RANGE}2`,
      description: 'MCP Test Number Range with Intervals',
      domainName: 'NUMC10',
      package: PACKAGE_NAME,
      intervals: [
        { subObject: '01', from: '0000000001', to: '0000999999', external: false },
        { subObject: '02', from: '1000000000', to: '1999999999', external: true },
      ],
    },
    (response: MCPToolResponse) => {
      log(`  Number range with intervals creation attempted`, 'gray');
    }
  );
}

/**
 * Main test execution
 */
async function main(): Promise<void> {
  log('=' .repeat(60), 'cyan');
  log('SYSTEM TOOLS MCP INTEGRATION TESTS', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  const ctx = await initContext();
  
  // Log connection info
  const connInfo = ctx.client.getConnectionInfo();
  log(`\nConnecting to: ${connInfo.url}`, 'gray');
  log(`Client: ${connInfo.client}, User: ${connInfo.user}`, 'gray');
  
  // Verify tool registration
  const tools = ctx.client.listTools();
  const systemTools = [
    'get_system_info',
    'get_package_info',
    'create_package',
    'get_message_class',
    'create_message_class',
    'get_number_range',
    'create_number_range',
  ];
  
  log(`\nRegistered tools: ${tools.length}`, 'blue');
  log(`System tools to test: ${systemTools.length}`, 'blue');
  
  for (const tool of systemTools) {
    if (!tools.includes(tool)) {
      log(`  ✗ Missing tool: ${tool}`, 'red');
    } else {
      log(`  ✓ Found tool: ${tool}`, 'green');
    }
  }

  try {
    // Run all system tool tests
    log('\n--- get_system_info Tests ---', 'magenta');
    await testGetSystemInfo(ctx);
    
    log('\n--- get_package_info Tests ---', 'magenta');
    await testGetPackageInfo(ctx);
    
    log('\n--- create_package Tests ---', 'magenta');
    await testCreatePackage(ctx);
    
    log('\n--- get_message_class Tests ---', 'magenta');
    await testGetMessageClass(ctx);
    
    log('\n--- create_message_class Tests ---', 'magenta');
    await testCreateMessageClass(ctx);
    
    log('\n--- get_number_range Tests ---', 'magenta');
    await testGetNumberRange(ctx);
    
    log('\n--- create_number_range Tests ---', 'magenta');
    await testCreateNumberRange(ctx);
    
  } catch (error) {
    log(`\nTest execution error: ${error}`, 'red');
  }

  // Print summary
  ctx.runner.printSummary();
  
  // Log created objects for cleanup reference
  log('\n--- Created Objects (for manual cleanup if needed) ---', 'yellow');
  if (ctx.createdPackage) {
    log(`  Package: ${ctx.createdPackage}`, 'gray');
  }
  if (ctx.createdMessageClass) {
    log(`  Message Class: ${ctx.createdMessageClass}`, 'gray');
  }
  if (ctx.createdNumberRange) {
    log(`  Number Range: ${ctx.createdNumberRange}`, 'gray');
  }
  
  // Exit with appropriate code
  process.exit(ctx.runner.getFailedCount() > 0 ? 1 : 0);
}

// Run tests
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});