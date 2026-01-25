/**
 * Integration Tests for Transport Tools
 * Tests CTS (Change and Transport System) operations
 * 
 * Transport operations include:
 * - Getting transport requests list
 * - Creating transport requests
 * - Getting transport contents
 * - Adding objects to transports
 * - Releasing transports
 * 
 * Note: Transport operations can affect the system, so we use careful testing
 * Test transports use "YMCP" prefix in description for identification
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { TransportToolHandler } from '../../src/tools/transport-tools';

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
  skipped?: boolean;
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

async function skipTest(name: string, reason: string): Promise<void> {
  log(`\n○ Skipping: ${name}`, 'yellow');
  log(`  Reason: ${reason}`, 'gray');
  testResults.push({ name, success: true, duration: 0, skipped: true });
}

function printSummary(): void {
  log('\n' + '='.repeat(60), 'cyan');
  log('TRANSPORT TOOLS INTEGRATION TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const passed = testResults.filter(r => r.success && !r.skipped).length;
  const failed = testResults.filter(r => !r.success).length;
  const skipped = testResults.filter(r => r.skipped).length;
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  for (const result of testResults) {
    if (result.skipped) {
      log(`○ ${result.name} (skipped)`, 'yellow');
    } else {
      const icon = result.success ? '✓' : '✗';
      const color = result.success ? 'green' : 'red';
      log(`${icon} ${result.name} (${result.duration}ms)`, color);
    }
    if (result.error) {
      log(`  Error: ${result.error}`, 'gray');
    }
  }
  
  log('\n' + '-'.repeat(60), 'cyan');
  log(`Total: ${passed + failed + skipped} tests, ${passed} passed, ${failed} failed, ${skipped} skipped`, 
      failed === 0 ? 'green' : 'red');
  log(`Duration: ${totalDuration}ms`, 'gray');
}

async function main(): Promise<void> {
  log('Transport Tools Integration Tests', 'cyan');
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
    baseUrl: SAP_URL,
    client: SAP_CLIENT,
    username: SAP_USER,
    password: SAP_PASSWORD,
  });
  
  const transportHandler = new TransportToolHandler(adtClient);
  
  // Store created transport for later tests
  let createdTransportNumber: string | undefined;
  let createdTaskNumber: string | undefined;
  
  // ============================================
  // Get Transport Requests
  // ============================================
  
  await runTest('Get Transport Requests (Current User)', async () => {
    const result = await transportHandler.getTransportRequests({
      // No user filter - defaults to current user
      maxResults: 10,
    });
    
    if (!result.success) {
      throw new Error(`Get transport requests failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Total transports: ${result.data.totalCount}`, 'gray');
    
    // List first few transports
    for (const transport of result.data.requests.slice(0, 5)) {
      log(`    - ${transport.number}: ${transport.description} (${transport.status})`, 'gray');
    }
    
    if (result.data.requests.length > 5) {
      log(`    ... and ${result.data.requests.length - 5} more`, 'gray');
    }
    
    log(`  Transport requests retrieved successfully`, 'gray');
  });
  
  await runTest('Get Transport Requests (Modifiable Only)', async () => {
    const result = await transportHandler.getTransportRequests({
      status: ['D'], // D = modifiable
      maxResults: 5,
    });
    
    if (!result.success) {
      throw new Error(`Get modifiable transports failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Modifiable transports: ${result.data.totalCount}`, 'gray');
    
    // All returned transports should be modifiable
    for (const transport of result.data.requests) {
      if (transport.status !== 'modifiable') {
        throw new Error(`Expected modifiable status, got: ${transport.status}`);
      }
    }
    
    log(`  Modifiable transports filter verified`, 'gray');
  });
  
  await runTest('Get Transport Requests (Workbench Type)', async () => {
    const result = await transportHandler.getTransportRequests({
      requestTypes: ['K'], // K = workbench
      maxResults: 5,
    });
    
    if (!result.success) {
      throw new Error(`Get workbench transports failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Workbench transports: ${result.data.totalCount}`, 'gray');
    
    // All returned transports should be workbench type
    for (const transport of result.data.requests) {
      if (transport.type !== 'workbench') {
        throw new Error(`Expected workbench type, got: ${transport.type}`);
      }
    }
    
    log(`  Workbench type filter verified`, 'gray');
  });
  
  // ============================================
  // Create Transport Request
  // ============================================
  
  await runTest('Create Transport Request', async () => {
    const description = `${TEST_PREFIX}Test Transport - Integration Test`;
    
    const result = await transportHandler.createTransportRequest({
      description,
      type: 'workbench',
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create transport request failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    if (!result.data.requestNumber) {
      throw new Error('No request number in response');
    }
    
    createdTransportNumber = result.data.requestNumber;
    createdTaskNumber = result.data.taskNumber;
    
    log(`  Transport created: ${createdTransportNumber}`, 'gray');
    if (createdTaskNumber) {
      log(`  Task created: ${createdTaskNumber}`, 'gray');
    }
    log(`  Description: ${result.data.description}`, 'gray');
    
    // Verify by reading back
    const verifyResult = await transportHandler.getTransportContents({
      requestNumber: createdTransportNumber,
      includeTasks: true,
    });
    
    if (!verifyResult.success) {
      throw new Error(`Verify transport failed: ${verifyResult.error?.message}`);
    }
    
    log(`  Transport ${createdTransportNumber} created and verified`, 'gray');
  });
  
  // ============================================
  // Get Transport Contents
  // ============================================
  
  await runTest('Get Transport Contents', async () => {
    if (!createdTransportNumber) {
      throw new Error('No transport created in previous test');
    }
    
    const result = await transportHandler.getTransportContents({
      requestNumber: createdTransportNumber,
      includeTasks: true,
    });
    
    if (!result.success) {
      throw new Error(`Get transport contents failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Transport: ${result.data.request.number}`, 'gray');
    log(`  Description: ${result.data.request.description}`, 'gray');
    log(`  Status: ${result.data.request.status}`, 'gray');
    log(`  Type: ${result.data.request.type}`, 'gray');
    log(`  Tasks: ${result.data.tasks.length}`, 'gray');
    log(`  Total Objects: ${result.data.totalObjects}`, 'gray');
    
    // List tasks
    for (const task of result.data.tasks) {
      log(`    Task ${task.number}: ${task.description} (${task.status})`, 'gray');
      if (task.objects && task.objects.length > 0) {
        for (const obj of task.objects.slice(0, 3)) {
          log(`      - ${obj.pgmid} ${obj.objectType} ${obj.objectName}`, 'gray');
        }
        if (task.objects.length > 3) {
          log(`      ... and ${task.objects.length - 3} more objects`, 'gray');
        }
      }
    }
    
    log(`  Transport contents retrieved successfully`, 'gray');
  });
  
  // ============================================
  // Add Object to Transport
  // ============================================
  
  await runTest('Add Object to Transport', async () => {
    if (!createdTransportNumber) {
      throw new Error('No transport created in previous test');
    }
    
    // Add a simple object to the transport
    // Using LIMU (logical information model unit) REPS (report source) for a simple report
    const result = await transportHandler.addObjectToTransport({
      requestNumber: createdTransportNumber,
      pgmid: 'R3TR',
      objectType: 'DEVC',
      objectName: PACKAGE_NAME, // Add the $TMP package as a test
      taskNumber: createdTaskNumber,
    });
    
    // This might fail if the object is already assigned or package doesn't support it
    if (!result.success) {
      // Check if it's an expected error (object already in transport, or local package)
      if (result.error?.message?.includes('already') || 
          result.error?.message?.includes('local') ||
          result.error?.message?.includes('not transportable') ||
          result.error?.message?.includes('$TMP')) {
        log(`  Expected: Object cannot be added (${result.error.message})`, 'yellow');
        return; // This is acceptable for $TMP package
      }
      throw new Error(`Add object to transport failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Object added: ${result.data.object.objectType}/${result.data.object.objectName}`, 'gray');
    log(`  To task: ${result.data.taskNumber}`, 'gray');
    
    // Verify by reading transport contents
    const verifyResult = await transportHandler.getTransportContents({
      requestNumber: createdTransportNumber,
      includeTasks: true,
    });
    
    if (verifyResult.success && verifyResult.data) {
      log(`  Total objects after add: ${verifyResult.data.totalObjects}`, 'gray');
    }
    
    log(`  Object added to transport successfully`, 'gray');
  });
  
  // ============================================
  // Transport with Specific User
  // ============================================
  
  await runTest('Get Transport Requests for Specific User', async () => {
    // Get transports for the current user explicitly
    const result = await transportHandler.getTransportRequests({
      user: SAP_USER,
      maxResults: 10,
    });
    
    if (!result.success) {
      throw new Error(`Get user transports failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Transports for user ${SAP_USER}: ${result.data.totalCount}`, 'gray');
    
    // Verify owner matches
    for (const transport of result.data.requests) {
      if (transport.owner && transport.owner.toUpperCase() !== SAP_USER?.toUpperCase()) {
        log(`  Warning: Transport ${transport.number} owned by ${transport.owner}`, 'yellow');
      }
    }
    
    log(`  User-specific transport query successful`, 'gray');
  });
  
  // ============================================
  // Error Handling
  // ============================================
  
  await runTest('Handle Non-Existent Transport', async () => {
    const nonExistentTransport = `${TEST_PREFIX}K999999`;
    
    const result = await transportHandler.getTransportContents({
      requestNumber: nonExistentTransport,
    });
    
    // Should fail gracefully
    if (result.success) {
      throw new Error('Expected failure for non-existent transport');
    }
    
    if (!result.error) {
      throw new Error('Expected error details');
    }
    
    log(`  Error code: ${result.error.code}`, 'gray');
    log(`  Error message: ${result.error.message}`, 'gray');
    log(`  Non-existent transport handled correctly`, 'gray');
  });
  
  await runTest('Add Object to Non-Existent Transport', async () => {
    const nonExistentTransport = `${TEST_PREFIX}K999999`;
    
    const result = await transportHandler.addObjectToTransport({
      requestNumber: nonExistentTransport,
      pgmid: 'R3TR',
      objectType: 'CLAS',
      objectName: 'CL_TEST',
    });
    
    // Should fail gracefully
    if (result.success) {
      throw new Error('Expected failure for non-existent transport');
    }
    
    if (!result.error) {
      throw new Error('Expected error details');
    }
    
    log(`  Error handling verified: ${result.error.code}`, 'gray');
    log(`  Non-existent transport handled correctly`, 'gray');
  });
  
  // ============================================
  // Release Transport (Optional - May Require Real Objects)
  // ============================================
  
  await runTest('Release Transport Request', async () => {
    if (!createdTransportNumber) {
      throw new Error('No transport created in previous test');
    }
    
    // Try to release the transport
    // Note: This might fail if the transport is empty or has no tasks
    const result = await transportHandler.releaseTransportRequest({
      requestNumber: createdTransportNumber,
      releaseTasks: true, // Release tasks first
    });
    
    // Release might fail for various valid reasons
    if (!result.success) {
      // Check if it's an expected error
      if (result.error?.message?.includes('empty') || 
          result.error?.message?.includes('no objects') ||
          result.error?.message?.includes('cannot be released') ||
          result.error?.message?.includes('locked') ||
          result.error?.message?.includes('contains errors')) {
        log(`  Expected: Transport cannot be released (${result.error.message})`, 'yellow');
        log(`  This is normal for test transports without proper objects`, 'gray');
        return; // This is acceptable
      }
      throw new Error(`Release transport failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Transport released: ${result.data.requestNumber}`, 'gray');
    log(`  Released: ${result.data.released}`, 'gray');
    if (result.data.releasedAt) {
      log(`  Released at: ${result.data.releasedAt}`, 'gray');
    }
    if (result.data.releasedTasks && result.data.releasedTasks.length > 0) {
      log(`  Released tasks: ${result.data.releasedTasks.join(', ')}`, 'gray');
    }
    if (result.data.messages && result.data.messages.length > 0) {
      for (const msg of result.data.messages) {
        log(`  Message: ${msg}`, 'gray');
      }
    }
    
    // Verify by reading back
    const verifyResult = await transportHandler.getTransportContents({
      requestNumber: createdTransportNumber,
    });
    
    if (verifyResult.success && verifyResult.data) {
      log(`  Verified status: ${verifyResult.data.request.status}`, 'gray');
    }
    
    log(`  Transport release completed`, 'gray');
  });
  
  // ============================================
  // Customizing Transport Test
  // ============================================
  
  await runTest('Create Customizing Transport Request', async () => {
    const description = `${TEST_PREFIX}Customizing Transport - Integration Test`;
    
    const result = await transportHandler.createTransportRequest({
      description,
      type: 'customizing',
    });
    
    // Customizing transports might not be available in all systems
    if (!result.success) {
      if (result.error?.message?.includes('not authorized') || 
          result.error?.message?.includes('customizing') ||
          result.error?.message?.includes('not allowed')) {
        log(`  Customizing transports not available in this system`, 'yellow');
        return; // This is acceptable
      }
      throw new Error(`Create customizing transport failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Customizing transport created: ${result.data.requestNumber}`, 'gray');
    log(`  Type: customizing`, 'gray');
    
    // Clean up - we don't need this transport
    // Note: We can't delete transports via ADT, so just log it
    log(`  Note: Transport ${result.data.requestNumber} should be manually deleted if not needed`, 'yellow');
  });
  
  // ============================================
  // Multiple Transports Query
  // ============================================
  
  await runTest('Get Released Transports', async () => {
    const result = await transportHandler.getTransportRequests({
      status: ['R'], // R = released
      maxResults: 5,
    });
    
    if (!result.success) {
      throw new Error(`Get released transports failed: ${result.error?.message}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned');
    }
    
    log(`  Released transports: ${result.data.totalCount}`, 'gray');
    
    // All returned transports should be released
    for (const transport of result.data.requests) {
      if (transport.status !== 'released') {
        throw new Error(`Expected released status, got: ${transport.status}`);
      }
    }
    
    // List some released transports
    for (const transport of result.data.requests.slice(0, 3)) {
      log(`    - ${transport.number}: ${transport.description}`, 'gray');
    }
    
    log(`  Released transports filter verified`, 'gray');
  });
  
  // Print summary
  printSummary();
  
  // Print cleanup reminder
  if (createdTransportNumber) {
    log('\n' + '!'.repeat(60), 'yellow');
    log('CLEANUP REMINDER', 'yellow');
    log('!'.repeat(60), 'yellow');
    log(`The following test transport was created and may need manual cleanup:`, 'yellow');
    log(`  Transport: ${createdTransportNumber}`, 'yellow');
    log(`  Use transaction SE09/SE10 to delete if not needed`, 'yellow');
  }
  
  // Exit with appropriate code
  const failed = testResults.filter(r => !r.success).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  log(`Fatal error: ${error}`, 'red');
  process.exit(1);
});