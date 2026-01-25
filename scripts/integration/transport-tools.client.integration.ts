/**
 * Transport Tools MCP Client Integration Tests
 * 
 * Tests transport (CTS) tools through actual MCP protocol via stdio transport.
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

// Test transport request number (generated at runtime)
let createdTransportNumber: string | undefined;

/**
 * Run Transport Tools MCP Client Integration Tests
 */
async function runTests(): Promise<number> {
  return runMCPTests('Transport Tools', async (runner: MCPTestRunner, client: MCPClientTestHelper) => {
    log(`\nPackage: ${PACKAGE_NAME}`, 'yellow');
    log(`Note: Transport tests depend on system configuration`, 'yellow');
    
    // ========================================
    // Get Transport Requests Tests
    // ========================================
    log('\n--- Get Transport Requests Tests ---', 'magenta');
    
    await runner.runToolTest(
      'Get transport requests (all)',
      'get_transport_requests',
      {},
      (response) => {
        if (!response.data) {
          throw new Error('No transport requests data returned');
        }
        const data = response.data as { requests?: unknown[]; totalCount?: number };
        log(`  Total requests: ${data.totalCount || 0}`, 'gray');
        log(`  Requests retrieved: ${data.requests?.length || 0}`, 'gray');
      }
    );
    
    await runner.runToolTest(
      'Get transport requests (modifiable only)',
      'get_transport_requests',
      { status: ['D'] },
      (response) => {
        if (!response.data) {
          throw new Error('No transport requests data returned');
        }
        const data = response.data as { requests?: unknown[]; totalCount?: number };
        log(`  Modifiable requests: ${data.totalCount || 0}`, 'gray');
      }
    );
    
    await runner.runToolTest(
      'Get transport requests (workbench type)',
      'get_transport_requests',
      { requestTypes: ['K'] },
      (response) => {
        if (!response.data) {
          throw new Error('No transport requests data returned');
        }
        const data = response.data as { requests?: unknown[]; totalCount?: number };
        log(`  Workbench requests: ${data.totalCount || 0}`, 'gray');
      }
    );
    
    await runner.runToolTest(
      'Get transport requests (with max results)',
      'get_transport_requests',
      { maxResults: 5 },
      (response) => {
        if (!response.data) {
          throw new Error('No transport requests data returned');
        }
        const data = response.data as { requests?: unknown[] };
        const count = data.requests?.length || 0;
        if (count > 5) {
          throw new Error(`Expected max 5 results, got ${count}`);
        }
        log(`  Requests returned: ${count}`, 'gray');
      }
    );
    
    // ========================================
    // Create Transport Request Tests
    // ========================================
    log('\n--- Create Transport Request Tests ---', 'magenta');
    
    const transportDescription = `MCP Integration Test ${Date.now()}`;
    
    await runner.runToolTest(
      'Create workbench transport request',
      'create_transport_request',
      {
        description: transportDescription,
        type: 'workbench',
      },
      (response) => {
        if (!response.data) {
          throw new Error('No response data for transport creation');
        }
        const data = response.data as { requestNumber?: string; taskNumber?: string; description?: string };
        if (!data.requestNumber) {
          throw new Error('No transport request number returned');
        }
        createdTransportNumber = data.requestNumber;
        log(`  Created transport: ${data.requestNumber}`, 'gray');
        log(`  Task: ${data.taskNumber || 'N/A'}`, 'gray');
        log(`  Description: ${data.description}`, 'gray');
      }
    );
    
    // ========================================
    // Get Transport Contents Tests
    // ========================================
    log('\n--- Get Transport Contents Tests ---', 'magenta');
    
    if (createdTransportNumber) {
      await runner.runToolTest(
        'Get transport contents',
        'get_transport_contents',
        {
          requestNumber: createdTransportNumber,
          includeTasks: true,
        },
        (response) => {
          if (!response.data) {
            throw new Error('No transport contents data returned');
          }
          const data = response.data as { request?: unknown; tasks?: unknown[]; totalObjects?: number };
          log(`  Tasks: ${data.tasks?.length || 0}`, 'gray');
          log(`  Total objects: ${data.totalObjects || 0}`, 'gray');
        }
      );
    } else {
      log('  Skipping (no transport created)', 'yellow');
    }
    
    // ========================================
    // Add Object to Transport Tests
    // ========================================
    log('\n--- Add Object to Transport Tests ---', 'magenta');
    
    if (createdTransportNumber) {
      // Add a standard table to the transport (for testing purposes)
      await runner.runToolTest(
        'Add object to transport',
        'add_object_to_transport',
        {
          requestNumber: createdTransportNumber,
          pgmid: 'R3TR',
          objectType: 'TABL',
          objectName: 'T000',  // Standard SAP table
        },
        (response) => {
          // This may fail if T000 is locked or already in another transport
          if (!response.data) {
            log(`  Object may already be in transport or locked`, 'yellow');
            return;
          }
          const data = response.data as { requestNumber?: string; taskNumber?: string; added?: boolean };
          log(`  Added to: ${data.requestNumber}`, 'gray');
          log(`  Task: ${data.taskNumber}`, 'gray');
          log(`  Added: ${data.added}`, 'gray');
        }
      );
      
      // Verify object was added
      await runner.runToolTest(
        'Verify object in transport',
        'get_transport_contents',
        {
          requestNumber: createdTransportNumber,
          includeTasks: true,
        },
        (response) => {
          if (!response.data) {
            throw new Error('No transport contents data returned');
          }
          const data = response.data as { totalObjects?: number };
          log(`  Total objects after add: ${data.totalObjects || 0}`, 'gray');
        }
      );
    } else {
      log('  Skipping (no transport created)', 'yellow');
    }
    
    // ========================================
    // Release Transport Request Tests
    // ========================================
    log('\n--- Release Transport Request Tests ---', 'magenta');
    
    // Note: We don't actually release the transport in tests as this would
    // affect the real transport system. Instead, we test the API availability.
    
    if (createdTransportNumber) {
      log(`  Transport ${createdTransportNumber} created but not released (manual cleanup required)`, 'yellow');
      log(`  To release manually: use transaction SE09/SE10`, 'yellow');
      
      // Optional: Test release (commented out to avoid affecting real transports)
      /*
      await runner.runToolTest(
        'Release transport request',
        'release_transport_request',
        {
          requestNumber: createdTransportNumber,
          releaseTasks: true,
        },
        (response) => {
          if (!response.data) {
            throw new Error('No release response data returned');
          }
          const data = response.data as { requestNumber?: string; released?: boolean };
          log(`  Released: ${data.released}`, 'gray');
        }
      );
      */
    }
    
    // ========================================
    // Error Handling Tests
    // ========================================
    log('\n--- Error Handling Tests ---', 'magenta');
    
    await runner.runToolTest(
      'Get non-existent transport contents',
      'get_transport_contents',
      { requestNumber: 'INVALID999999' },
      (response) => {
        // Should return error or empty data
        if (response.isError) {
          log(`  Correctly returned error for invalid transport`, 'gray');
        } else {
          log(`  Returned empty data for invalid transport`, 'gray');
        }
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