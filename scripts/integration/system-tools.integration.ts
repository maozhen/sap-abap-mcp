/**
 * Integration Tests for System Tools
 * Tests system information, packages, message classes, and number ranges
 * 
 * Test objects use "YMCP" prefix and are saved in "$TMP" package
 * After creating objects, we read them back to verify state
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../../src/clients/adt-client';
import { SystemToolHandler } from '../../src/tools/system-tools';

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

function printSummary(): void {
  log('\n' + '='.repeat(60), 'cyan');
  log('SYSTEM TOOLS INTEGRATION TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  for (const result of testResults) {
    const icon = result.success ? '✓' : '✗';
    const color = result.success ? 'green' : 'red';
    log(`${icon} ${result.name} (${result.duration}ms)`, color);
    if (result.error) {
      log(`  Error: ${result.error}`, 'gray');
    }
  }
  
  log('\n' + '-'.repeat(60), 'cyan');
  log(`Total: ${passed + failed} tests, ${passed} passed, ${failed} failed`, passed === testResults.length ? 'green' : 'red');
  log(`Duration: ${totalDuration}ms`, 'gray');
}

async function main(): Promise<void> {
  log('System Tools Integration Tests', 'cyan');
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
  
  const systemHandler = new SystemToolHandler(adtClient);
  
  // Test object names
  const messageClassName = `${TEST_PREFIX}MSG_TEST`;
  const numberRangeName = `${TEST_PREFIX}NROB_TST`; // NROB names are limited to 10 characters
  const testPackageName = `${TEST_PREFIX}PKG_TEST`;
  
  // ============================================
  // System Info Tests
  // ============================================
  
  await runTest('Get System Info', async () => {
    const result = await systemHandler.getSystemInfo();
    
    if (!result.success) {
      throw new Error(`Get system info failed: ${result.error?.message}`);
    }
    
    // System info should be present (though some fields may be empty on some systems)
    if (!result.data) {
      throw new Error('No system info data returned');
    }
    
    log(`  System ID: ${result.data.systemId || 'N/A'}`, 'gray');
    log(`  SAP Release: ${result.data.sapRelease || 'N/A'}`, 'gray');
    log(`  Host: ${result.data.host || 'N/A'}`, 'gray');
    log(`  Client: ${result.data.client || 'N/A'}`, 'gray');
    log(`  System info retrieved successfully`, 'gray');
  });
  
  // ============================================
  // Package Tests
  // ============================================
  
  await runTest('Get Package Info ($TMP)', async () => {
    const result = await systemHandler.getPackageInfo({
      packageName: '$TMP',
    });
    
    if (!result.success) {
      throw new Error(`Get package info failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Package name not found in response');
    }
    
    log(`  Package: ${result.data.name}`, 'gray');
    log(`  Description: ${result.data.description || 'N/A'}`, 'gray');
    log(`  Package type: ${result.data.packageType || 'N/A'}`, 'gray');
    log(`  Package info retrieved successfully`, 'gray');
  });
  
  await runTest('Get Package Info (SYST)', async () => {
    // Test with another well-known package
    const result = await systemHandler.getPackageInfo({
      packageName: 'SYST',
    });
    
    if (!result.success) {
      throw new Error(`Get package info failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Package name not found in response');
    }
    
    log(`  Package: ${result.data.name}`, 'gray');
    log(`  Description: ${result.data.description || 'N/A'}`, 'gray');
    log(`  Package info retrieved successfully`, 'gray');
  });
  
  // Note: Creating packages in $TMP typically requires special permissions
  // and may not work in all SAP systems. We test this but expect it may fail.
  await runTest('Create Package (may require permissions)', async () => {
    try {
      const result = await systemHandler.createPackage({
        name: testPackageName,
        description: 'Test package created by integration test',
        packageType: 'development',
      });
      
      if (!result.success) {
        // Package creation may fail due to permissions
        log(`  Package creation returned error (may be expected): ${result.error?.message}`, 'yellow');
        // Don't throw, just report
        return;
      }
      
      // If creation succeeded, read back to verify
      const readResult = await systemHandler.getPackageInfo({
        packageName: testPackageName,
      });
      
      if (readResult.success) {
        log(`  Package ${testPackageName} created and verified`, 'gray');
      } else {
        log(`  Package created but read back failed: ${readResult.error?.message}`, 'yellow');
      }
    } catch (error) {
      // Some systems may not allow package creation
      log(`  Package creation not supported or no permissions: ${error}`, 'yellow');
    }
  });
  
  // ============================================
  // Message Class Tests
  // ============================================
  
  await runTest('Create Message Class', async () => {
    const result = await systemHandler.createMessageClass({
      name: messageClassName,
      description: 'Test message class created by integration test',
      messages: [
        { number: '001', shortText: 'Test message 1', selfExplanatory: false },
        { number: '002', shortText: 'Test message 2 with &1 placeholder', selfExplanatory: false },
        { number: '003', shortText: 'Test message 3', selfExplanatory: true },
      ],
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create message class failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Message class name not found in response');
    }
    
    log(`  Message class ${result.data.name} created`, 'gray');
    log(`  Messages count: ${result.data.messages?.length || 0}`, 'gray');
  });
  
  await runTest('Read Message Class', async () => {
    const result = await systemHandler.getMessageClass({
      messageClassName,
    });
    
    if (!result.success) {
      throw new Error(`Read message class failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Message class name not found in response');
    }
    
    log(`  Message class: ${result.data.name}`, 'gray');
    log(`  Description: ${result.data.description || 'N/A'}`, 'gray');
    log(`  Messages count: ${result.data.messages?.length || 0}`, 'gray');
    
    // Verify messages if present
    if (result.data.messages && result.data.messages.length > 0) {
      for (const msg of result.data.messages) {
        log(`    - ${msg.number}: ${msg.shortText}`, 'gray');
      }
    }
    
    log(`  Message class read successfully`, 'gray');
  });
  
  await runTest('Verify Message Class After Creation', async () => {
    // Read back to verify the message class state matches expectations
    const result = await systemHandler.getMessageClass({
      messageClassName,
    });
    
    if (!result.success) {
      throw new Error(`Verify message class failed: ${result.error?.message}`);
    }
    
    // Verify the name matches
    if (result.data?.name?.toUpperCase() !== messageClassName.toUpperCase()) {
      throw new Error(`Message class name mismatch: expected ${messageClassName}, got ${result.data?.name}`);
    }
    
    log(`  Message class ${messageClassName} verified successfully`, 'gray');
  });
  
  // ============================================
  // Number Range Tests
  // ============================================
  
  await runTest('Create Number Range', async () => {
    const result = await systemHandler.createNumberRange({
      name: numberRangeName,
      description: 'Test number range created by integration test',
      numberLength: 10,
      percentage: 10,
      intervals: [
        { fromNumber: '0000000001', toNumber: '0999999999', external: false },
        { fromNumber: '1000000000', toNumber: '1999999999', external: true },
      ],
      packageName: PACKAGE_NAME,
    });
    
    if (!result.success) {
      throw new Error(`Create number range failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Number range name not found in response');
    }
    
    log(`  Number range ${result.data.name} created`, 'gray');
    log(`  Number length: ${result.data.numberLength}`, 'gray');
    log(`  Intervals count: ${result.data.intervals?.length || 0}`, 'gray');
  });
  
  await runTest('Read Number Range', async () => {
    const result = await systemHandler.getNumberRange({
      objectName: numberRangeName,
    });
    
    if (!result.success) {
      throw new Error(`Read number range failed: ${result.error?.message}`);
    }
    
    if (!result.data?.name) {
      throw new Error('Number range name not found in response');
    }
    
    log(`  Number range: ${result.data.name}`, 'gray');
    log(`  Description: ${result.data.description || 'N/A'}`, 'gray');
    log(`  Number length: ${result.data.numberLength}`, 'gray');
    log(`  Percentage: ${result.data.percentage}%`, 'gray');
    log(`  Intervals count: ${result.data.intervals?.length || 0}`, 'gray');
    
    // Log intervals if present
    if (result.data.intervals && result.data.intervals.length > 0) {
      for (const interval of result.data.intervals) {
        log(`    - From: ${interval.fromNumber}, To: ${interval.toNumber}, External: ${interval.external}`, 'gray');
      }
    }
    
    log(`  Number range read successfully`, 'gray');
  });
  
  await runTest('Verify Number Range After Creation', async () => {
    // Read back to verify the number range state matches expectations
    const result = await systemHandler.getNumberRange({
      objectName: numberRangeName,
    });
    
    if (!result.success) {
      throw new Error(`Verify number range failed: ${result.error?.message}`);
    }
    
    // Verify the name matches
    if (result.data?.name?.toUpperCase() !== numberRangeName.toUpperCase()) {
      throw new Error(`Number range name mismatch: expected ${numberRangeName}, got ${result.data?.name}`);
    }
    
    // Verify number length
    if (result.data?.numberLength !== 10) {
      throw new Error(`Number length mismatch: expected 10, got ${result.data?.numberLength}`);
    }
    
    log(`  Number range ${numberRangeName} verified successfully`, 'gray');
  });
  
  // ============================================
  // Read Existing System Objects Tests
  // ============================================
  
  await runTest('Read Existing Message Class (if available)', async () => {
    // Try to read a standard SAP message class
    const result = await systemHandler.getMessageClass({
      messageClassName: '00', // Standard SAP message class
    });
    
    if (!result.success) {
      // This is expected if the message class doesn't exist
      log(`  Standard message class 00 not found (may be expected): ${result.error?.message}`, 'yellow');
      return;
    }
    
    log(`  Message class: ${result.data?.name}`, 'gray');
    log(`  Messages count: ${result.data?.messages?.length || 0}`, 'gray');
    log(`  Standard message class read successfully`, 'gray');
  });
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  const failed = testResults.filter(r => !r.success).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  log(`Fatal error: ${error}`, 'red');
  process.exit(1);
});