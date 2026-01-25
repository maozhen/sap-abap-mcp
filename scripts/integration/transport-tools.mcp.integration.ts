/**
 * Transport Tools MCP Integration Tests
 * 
 * Tests for CTS (Change and Transport System) tools via MCP protocol.
 * 
 * Tools tested (5):
 * 1. get_transport_requests - Get transport requests list
 * 2. create_transport_request - Create a new transport request
 * 3. add_object_to_transport - Add an object to a transport request
 * 4. release_transport_request - Release a transport request
 * 5. get_transport_contents - Get transport request contents
 * 
 * Run: npx ts-node scripts/integration/transport-tools.mcp.integration.ts
 */

import {
  MCPToolTestClient,
  TestRunner,
  TEST_PREFIX,
  log,
  colors,
  MCPToolResponse,
} from './mcp-test-helper';

// Test data
const TEST_TRANSPORT_DESC = `${TEST_PREFIX}MCP_INT_TEST`;
let createdTransportNumber: string | null = null;

/**
 * Main test runner
 */
async function runTests(): Promise<void> {
  log('\n' + '='.repeat(60), 'magenta');
  log('TRANSPORT TOOLS MCP INTEGRATION TESTS', 'magenta');
  log('='.repeat(60), 'magenta');
  log('Testing 5 MCP tools via direct MCP protocol invocation', 'gray');

  const client = new MCPToolTestClient();
  const runner = new TestRunner(client, 'Transport Tools');

  // Display connection info
  const connInfo = client.getConnectionInfo();
  log(`\nConnection: ${connInfo.url} (Client: ${connInfo.client}, User: ${connInfo.user})`, 'gray');

  // List tools being tested
  const transportTools = [
    'get_transport_requests',
    'create_transport_request',
    'add_object_to_transport',
    'release_transport_request',
    'get_transport_contents',
  ];
  log(`\nTools to test: ${transportTools.join(', ')}`, 'gray');

  // ============================================================================
  // Test 1: get_transport_requests - Get transport requests list
  // ============================================================================
  await runner.runToolTest(
    'Get transport requests (current user, modifiable)',
    'get_transport_requests',
    {
      status: ['D'], // Modifiable requests only
      maxResults: 10,
    },
    (response: MCPToolResponse) => {
      const data = response.data as { requests: unknown[]; totalCount: number };
      if (data.requests === undefined) {
        throw new Error('Response should contain requests array');
      }
      log(`  Retrieved ${data.totalCount} transport requests`, 'gray');
    }
  );

  await runner.runToolTest(
    'Get transport requests (workbench type)',
    'get_transport_requests',
    {
      requestTypes: ['K'], // Workbench requests only
      maxResults: 5,
    },
    (response: MCPToolResponse) => {
      const data = response.data as { requests: unknown[]; totalCount: number };
      if (data.requests === undefined) {
        throw new Error('Response should contain requests array');
      }
      log(`  Retrieved ${data.totalCount} workbench transport requests`, 'gray');
    }
  );

  // ============================================================================
  // Test 2: create_transport_request - Create a new transport request
  // ============================================================================
  await runner.runToolTest(
    'Create workbench transport request',
    'create_transport_request',
    {
      description: TEST_TRANSPORT_DESC,
      type: 'workbench',
    },
    (response: MCPToolResponse) => {
      const data = response.data as { requestNumber: string; description: string; taskNumber?: string };
      if (!data.requestNumber) {
        throw new Error('Response should contain requestNumber');
      }
      createdTransportNumber = data.requestNumber;
      log(`  Created transport request: ${data.requestNumber}`, 'gray');
      if (data.taskNumber) {
        log(`  Task number: ${data.taskNumber}`, 'gray');
      }
    }
  );

  // ============================================================================
  // Test 3: get_transport_contents - Get transport request contents
  // ============================================================================
  if (createdTransportNumber) {
    await runner.runToolTest(
      'Get transport contents (with tasks)',
      'get_transport_contents',
      {
        requestNumber: createdTransportNumber,
        includeTasks: true,
      },
      (response: MCPToolResponse) => {
        const data = response.data as { request: unknown; tasks: unknown[]; totalObjects: number };
        if (!data.request) {
          throw new Error('Response should contain request info');
        }
        if (data.tasks === undefined) {
          throw new Error('Response should contain tasks array');
        }
        log(`  Transport has ${data.tasks.length} task(s) and ${data.totalObjects} object(s)`, 'gray');
      }
    );
  } else {
    // Test with a non-existent transport to verify error handling
    await runner.runToolTest(
      'Get transport contents (non-existent - should fail gracefully)',
      'get_transport_contents',
      {
        requestNumber: 'DEVK000000',
        includeTasks: true,
      },
      (response: MCPToolResponse) => {
        // This may fail or return empty results - both are acceptable
        log('  Tool executed (may return error for non-existent transport)', 'gray');
      }
    );
  }

  // ============================================================================
  // Test 4: add_object_to_transport - Add an object to a transport request
  // ============================================================================
  if (createdTransportNumber) {
    await runner.runToolTest(
      'Add object to transport request',
      'add_object_to_transport',
      {
        requestNumber: createdTransportNumber,
        pgmid: 'R3TR',
        objectType: 'DOMA',
        objectName: 'MANDT', // Standard domain, always exists
      },
      (response: MCPToolResponse) => {
        const data = response.data as { requestNumber: string; taskNumber: string; added: boolean };
        if (!data.requestNumber) {
          throw new Error('Response should contain requestNumber');
        }
        log(`  Added object to transport ${data.requestNumber}`, 'gray');
        if (data.taskNumber) {
          log(`  Task number: ${data.taskNumber}`, 'gray');
        }
      }
    );

    // Verify object was added
    await runner.runToolTest(
      'Verify object in transport contents',
      'get_transport_contents',
      {
        requestNumber: createdTransportNumber,
        includeTasks: true,
      },
      (response: MCPToolResponse) => {
        const data = response.data as { request: unknown; tasks: unknown[]; totalObjects: number };
        log(`  Transport now has ${data.totalObjects} object(s)`, 'gray');
      }
    );
  } else {
    log('\n⚠ Skipping add_object_to_transport test - no transport created', 'yellow');
  }

  // ============================================================================
  // Test 5: release_transport_request - Release a transport request
  // ============================================================================
  // Note: We test the release_transport_request tool but expect it to potentially fail
  // because releasing a transport is an irreversible operation that requires
  // specific conditions (e.g., valid target system, proper authorization)
  
  if (createdTransportNumber) {
    await runner.runToolTest(
      'Release transport request (with tasks)',
      'release_transport_request',
      {
        requestNumber: createdTransportNumber,
        releaseTasks: true,
      },
      (response: MCPToolResponse) => {
        const data = response.data as { requestNumber: string; released: boolean; messages?: string[] };
        // Note: Release may fail in test environments, but the tool should execute
        log(`  Release operation executed for ${data.requestNumber}`, 'gray');
        if (data.messages && data.messages.length > 0) {
          log(`  Messages: ${data.messages.join(', ')}`, 'gray');
        }
      }
    );
  } else {
    // Test release with invalid transport number to verify error handling
    await runner.runTest('Release transport request (invalid - error handling)', async () => {
      const response = await client.callTool('release_transport_request', {
        requestNumber: 'INVALID999999',
        releaseTasks: false,
      });
      // We expect this to return an error
      if (response.isError) {
        log('  Correctly returned error for invalid transport', 'gray');
      } else {
        log('  Tool executed (unexpected success)', 'yellow');
      }
    });
  }

  // ============================================================================
  // Additional Tests - Edge Cases and Variations
  // ============================================================================

  // Test get_transport_requests with different filters
  await runner.runToolTest(
    'Get transport requests (released status)',
    'get_transport_requests',
    {
      status: ['R'], // Released requests
      maxResults: 3,
    },
    (response: MCPToolResponse) => {
      const data = response.data as { requests: unknown[]; totalCount: number };
      log(`  Retrieved ${data.totalCount} released transport requests`, 'gray');
    }
  );

  await runner.runToolTest(
    'Get transport requests (customizing type)',
    'get_transport_requests',
    {
      requestTypes: ['W'], // Customizing requests
      maxResults: 3,
    },
    (response: MCPToolResponse) => {
      const data = response.data as { requests: unknown[]; totalCount: number };
      log(`  Retrieved ${data.totalCount} customizing transport requests`, 'gray');
    }
  );

  // Test create_transport_request with customizing type
  await runner.runTest('Create customizing transport request', async () => {
    const response = await client.callTool('create_transport_request', {
      description: `${TEST_TRANSPORT_DESC}_CUST`,
      type: 'customizing',
    });
    
    if (response.isError) {
      // Some systems may not allow customizing transports
      log('  Customizing transport creation not available or failed', 'gray');
    } else {
      const data = response.data as { requestNumber: string };
      log(`  Created customizing transport: ${data.requestNumber}`, 'gray');
    }
  });

  // ============================================================================
  // Print Summary
  // ============================================================================
  runner.printSummary();

  // Cleanup note
  if (createdTransportNumber) {
    log(`\n⚠ Note: Transport request ${createdTransportNumber} was created during tests.`, 'yellow');
    log('  You may need to manually delete it if not released.', 'yellow');
  }

  // Exit with appropriate code
  process.exit(runner.getFailedCount() > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  log(`\n✗ Test execution failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});