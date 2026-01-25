/**
 * Test script for reading SAP objects: Package, Report, Function, Class
 * 
 * Usage: npx ts-node scripts/test-read-objects.ts
 * 
 * Tests the following read operations:
 * 1. Read Package information
 * 2. Read Report/Program source code and metadata
 * 3. Read Function Module source code and metadata
 * 4. Read Class source code and metadata
 */

import { config } from 'dotenv';
import { ADTClient, createADTClient } from '../src/clients/adt-client';
import { SystemToolHandler } from '../src/tools/system-tools';
import { ProgramToolHandler } from '../src/tools/program-tools';

// Load environment variables
config();

// Test configuration - use well-known SAP standard objects
const TEST_CONFIG = {
  // Standard SAP package
  packageName: 'SLIS',  // Standard List Processing package
  
  // Standard SAP report program
  reportName: 'RSABAPPROGRAM',  // Standard program list report
  
  // Standard SAP function module
  functionGroup: 'SLIS',
  functionModule: 'REUSE_ALV_GRID_DISPLAY',  // Well-known ALV function
  
  // Standard SAP class
  className: 'CL_SALV_TABLE',  // Well-known ALV table class
};

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

const results: TestResult[] = [];

function logSection(title: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(` ${title}`);
  console.log('='.repeat(60));
}

function logSuccess(test: string, message: string, data?: unknown): void {
  console.log(`✅ ${test}: ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...');
  }
  results.push({ test, success: true, message, data });
}

function logError(test: string, error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.log(`❌ ${test}: ${errorMessage}`);
  results.push({ test, success: false, message: 'Failed', error: errorMessage });
}

async function main(): Promise<void> {
  console.log('SAP Object Read Test Script');
  console.log('============================');
  console.log('');
  console.log('Environment Configuration:');
  console.log(`  Host: ${process.env.SAP_HOST}`);
  console.log(`  Client: ${process.env.SAP_CLIENT}`);
  console.log(`  Username: ${process.env.SAP_USER}`);
  console.log('');

  // Create ADT client
  const adtClient = createADTClient({
    host: process.env.SAP_HOST || '',
    port: parseInt(process.env.SAP_PORT || '443'),
    client: process.env.SAP_CLIENT || '',
    username: process.env.SAP_USER || '',
    password: process.env.SAP_PASSWORD || '',
    https: process.env.SAP_HTTPS !== 'false',
    allowInsecure: process.env.SAP_ALLOW_INSECURE === 'true',
    language: process.env.SAP_LANGUAGE || 'EN',
  });

  const systemTools = new SystemToolHandler(adtClient);
  const programTools = new ProgramToolHandler(adtClient);

  // ==========================================
  // Test 1: Read Package Information
  // ==========================================
  logSection('Test 1: Read Package Information');
  console.log(`Testing with package: ${TEST_CONFIG.packageName}`);

  try {
    const packageResult = await systemTools.getPackageInfo({
      packageName: TEST_CONFIG.packageName,
    });

    if (packageResult.success && packageResult.data) {
      logSuccess('Read Package', `Package ${packageResult.data.name} read successfully`, {
        name: packageResult.data.name,
        description: packageResult.data.description,
        packageType: packageResult.data.packageType,
        softwareComponent: packageResult.data.softwareComponent,
        applicationComponent: packageResult.data.applicationComponent,
      });
    } else {
      logError('Read Package', packageResult.error || 'Unknown error');
    }
  } catch (error) {
    logError('Read Package', error);
  }

  // ==========================================
  // Test 2: Read Report/Program
  // ==========================================
  logSection('Test 2: Read Report/Program');
  console.log(`Testing with report: ${TEST_CONFIG.reportName}`);

  // Test 2a: Read program metadata
  try {
    const programUri = `/programs/programs/${TEST_CONFIG.reportName.toLowerCase()}`;
    console.log(`  Reading metadata from: ${programUri}`);
    
    const metadata = await adtClient.getObjectMetadata(programUri);
    
    if (metadata && Object.keys(metadata).length > 0) {
      logSuccess('Read Program Metadata', `Program metadata retrieved`, {
        rawMetadataKeys: Object.keys(metadata),
      });
    } else {
      logError('Read Program Metadata', 'Empty metadata response');
    }
  } catch (error) {
    logError('Read Program Metadata', error);
  }

  // Test 2b: Read program source code
  try {
    const programUri = `/programs/programs/${TEST_CONFIG.reportName.toLowerCase()}`;
    console.log(`  Reading source code from: ${programUri}`);
    
    const sourceCode = await adtClient.getObjectSource(programUri);
    
    if (sourceCode && sourceCode.length > 0) {
      logSuccess('Read Program Source', `Source code retrieved (${sourceCode.length} chars)`, {
        firstLines: sourceCode.substring(0, 300),
      });
    } else {
      logError('Read Program Source', 'Empty source code response');
    }
  } catch (error) {
    logError('Read Program Source', error);
  }

  // ==========================================
  // Test 3: Read Function Module
  // ==========================================
  logSection('Test 3: Read Function Module');
  console.log(`Testing with function module: ${TEST_CONFIG.functionModule}`);
  console.log(`  Function group: ${TEST_CONFIG.functionGroup}`);

  // Test 3a: Search for function module
  try {
    console.log(`  Searching for function module: ${TEST_CONFIG.functionModule}`);
    
    const searchResults = await adtClient.searchObjects(TEST_CONFIG.functionModule, {
      objectType: 'FUNC',
      maxResults: 5,
    });
    
    if (searchResults && searchResults.length > 0) {
      logSuccess('Search Function Module', `Found ${searchResults.length} results`, searchResults);
    } else {
      logError('Search Function Module', 'No results found');
    }
  } catch (error) {
    logError('Search Function Module', error);
  }

  // Test 3b: Read function group information
  try {
    const fugrUri = `/functions/groups/${TEST_CONFIG.functionGroup.toLowerCase()}`;
    console.log(`  Reading function group from: ${fugrUri}`);
    
    const metadata = await adtClient.getObjectMetadata(fugrUri);
    
    if (metadata && Object.keys(metadata).length > 0) {
      logSuccess('Read Function Group', `Function group metadata retrieved`, {
        rawMetadataKeys: Object.keys(metadata),
      });
    } else {
      logError('Read Function Group', 'Empty metadata response');
    }
  } catch (error) {
    logError('Read Function Group', error);
  }

  // Test 3c: Read function module source code
  try {
    const funcUri = `/functions/groups/${TEST_CONFIG.functionGroup.toLowerCase()}/fmodules/${TEST_CONFIG.functionModule.toLowerCase()}`;
    console.log(`  Reading function module source from: ${funcUri}`);
    
    const sourceCode = await adtClient.getObjectSource(funcUri);
    
    if (sourceCode && sourceCode.length > 0) {
      logSuccess('Read Function Module Source', `Source code retrieved (${sourceCode.length} chars)`, {
        firstLines: sourceCode.substring(0, 300),
      });
    } else {
      logError('Read Function Module Source', 'Empty source code response');
    }
  } catch (error) {
    logError('Read Function Module Source', error);
  }

  // ==========================================
  // Test 4: Read Class
  // ==========================================
  logSection('Test 4: Read Class');
  console.log(`Testing with class: ${TEST_CONFIG.className}`);

  // Test 4a: Read class metadata
  try {
    const classUri = `/oo/classes/${TEST_CONFIG.className.toLowerCase()}`;
    console.log(`  Reading class metadata from: ${classUri}`);
    
    const metadata = await adtClient.getObjectMetadata(classUri);
    
    if (metadata && Object.keys(metadata).length > 0) {
      logSuccess('Read Class Metadata', `Class metadata retrieved`, {
        rawMetadataKeys: Object.keys(metadata),
      });
    } else {
      logError('Read Class Metadata', 'Empty metadata response');
    }
  } catch (error) {
    logError('Read Class Metadata', error);
  }

  // Test 4b: Read class source code
  try {
    const classUri = `/oo/classes/${TEST_CONFIG.className.toLowerCase()}`;
    console.log(`  Reading class source code from: ${classUri}`);
    
    const sourceCode = await adtClient.getObjectSource(classUri);
    
    if (sourceCode && sourceCode.length > 0) {
      logSuccess('Read Class Source', `Source code retrieved (${sourceCode.length} chars)`, {
        firstLines: sourceCode.substring(0, 300),
      });
    } else {
      logError('Read Class Source', 'Empty source code response');
    }
  } catch (error) {
    logError('Read Class Source', error);
  }

  // Test 4c: Search for class
  try {
    console.log(`  Searching for class: ${TEST_CONFIG.className}`);
    
    const searchResults = await adtClient.searchObjects(TEST_CONFIG.className, {
      objectType: 'CLAS',
      maxResults: 5,
    });
    
    if (searchResults && searchResults.length > 0) {
      logSuccess('Search Class', `Found ${searchResults.length} results`, searchResults);
    } else {
      logError('Search Class', 'No results found');
    }
  } catch (error) {
    logError('Search Class', error);
  }

  // ==========================================
  // Test 5: Additional Tests - System Info and Interface
  // ==========================================
  logSection('Test 5: Additional Tests');

  // Test 5a: Read system information
  try {
    console.log(`  Reading system information...`);
    
    const sysInfoResult = await systemTools.getSystemInfo();
    
    if (sysInfoResult.success && sysInfoResult.data) {
      logSuccess('Read System Info', 'System information retrieved', {
        systemId: sysInfoResult.data.systemId,
        client: sysInfoResult.data.client,
        host: sysInfoResult.data.host,
        sapRelease: sysInfoResult.data.sapRelease,
      });
    } else {
      logError('Read System Info', sysInfoResult.error || 'Unknown error');
    }
  } catch (error) {
    logError('Read System Info', error);
  }

  // Test 5b: Read interface metadata
  try {
    const intfName = 'IF_SALV_TABLE';  // Well-known interface
    const intfUri = `/oo/interfaces/${intfName.toLowerCase()}`;
    console.log(`  Reading interface metadata from: ${intfUri}`);
    
    const metadata = await adtClient.getObjectMetadata(intfUri);
    
    if (metadata && Object.keys(metadata).length > 0) {
      logSuccess('Read Interface Metadata', `Interface ${intfName} metadata retrieved`, {
        rawMetadataKeys: Object.keys(metadata),
      });
    } else {
      logError('Read Interface Metadata', 'Empty metadata response');
    }
  } catch (error) {
    logError('Read Interface Metadata', error);
  }

  // ==========================================
  // Summary
  // ==========================================
  logSection('Test Summary');
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log('');
  
  if (failCount > 0) {
    console.log('Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`);
    });
  }
  
  console.log('');
  console.log('Test completed!');
  
  // Exit with error code if any test failed
  process.exit(failCount > 0 ? 1 : 0);
}

// Run the test
main().catch((error) => {
  console.error('Test script failed:', error);
  process.exit(1);
});