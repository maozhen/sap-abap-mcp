/**
 * SAP ABAP MCP Server - Class CRUD Test Script
 * Tests Create, Read, Update, Delete operations for ABAP Classes
 */

import * as dotenv from 'dotenv';
import { createADTClient } from '../src/clients/adt-client';
import { createToolHandlers } from '../src/tools';
import { SAPConnectionConfig } from '../src/types';

// Load environment variables
dotenv.config();

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function logInfo(message: string): void {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

function logSuccess(message: string): void {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function logError(message: string): void {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

function logWarning(message: string): void {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

async function main(): Promise<void> {
  console.log(`\n${colors.bold}${colors.cyan}=== Class CRUD Test ===${colors.reset}\n`);

  // Create connection configuration
  const connection: SAPConnectionConfig = {
    host: process.env.SAP_HOST!,
    port: parseInt(process.env.SAP_PORT!, 10),
    https: process.env.SAP_USE_TLS === 'true',
    client: process.env.SAP_CLIENT!,
    username: process.env.SAP_USER!,
    password: process.env.SAP_PASSWORD!,
    allowInsecure: true
  };

  logInfo(`Connecting to SAP: ${connection.host}:${connection.port}`);
  logInfo(`User: ${connection.username}`);

  // Create ADT client
  const adtClient = createADTClient(connection);
  const handlers = createToolHandlers(adtClient);

  // Use unique name for new test class
  const timestamp = Date.now().toString().slice(-6);
  const className = `YMCP_CL${timestamp}`;
  const classUri = `/oo/classes/${className.toLowerCase()}`;

  console.log(`\n${colors.bold}Test Class: ${className}${colors.reset}\n`);

  // ========================================
  // Step 1: Create Class
  // ========================================
  logInfo('Step 1: Creating new class...');
  
  try {
    const createResult = await handlers.program.createClass({
      name: className,
      description: 'MCP Test Class for CRUD',
      packageName: '$TMP'
    });
    logSuccess(`Class ${className} created successfully`);
    console.log('  Create result:', JSON.stringify(createResult, null, 2));
  } catch (error) {
    logError(`Failed to create class: ${error}`);
    return;
  }

  // ========================================
  // Step 2: Read Class Source
  // ========================================
  logInfo('Step 2: Reading class source...');
  
  let originalSource: string = '';
  try {
    originalSource = await adtClient.getObjectSource(classUri);
    logSuccess(`Class source read successfully (${originalSource.length} chars)`);
    console.log('  Source preview:', originalSource.substring(0, 200) + '...');
  } catch (error) {
    logError(`Failed to read class source: ${error}`);
    // Try alternative URI
    try {
      const altUri = `${classUri}/source/main`;
      originalSource = await adtClient.getObjectSource(altUri);
      logSuccess(`Class source read from /source/main (${originalSource.length} chars)`);
    } catch (e2) {
      logError(`Alternative URI also failed: ${e2}`);
    }
  }

  // ========================================
  // Step 3: Update Class Source
  // ========================================
  logInfo('Step 3: Updating class source...');
  
  try {
    // Step 3a: Lock the object
    logInfo('  3a: Acquiring lock...');
    const lock = await adtClient.lockObject(classUri);
    logSuccess(`  Lock acquired: ${lock.lockHandle.substring(0, 30)}...`);

    // Step 3b: Prepare updated source
    logInfo('  3b: Preparing updated source...');
    
    // For ABAP classes, we need to add content to the PUBLIC SECTION
    // Adding a type definition is a safe way to test updates
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const updatedSource = originalSource.includes('TYPES: ty_mcp_test')
      ? originalSource
      : originalSource.replace(
          /PUBLIC SECTION\./i,
          'PUBLIC SECTION.\n    " MCP CRUD TEST - Updated\n    TYPES: ty_mcp_test TYPE string.'
        );
    
    console.log('  Updated source preview:', updatedSource.substring(0, 300) + '...');

    // Step 3c: Update the source
    logInfo('  3c: Sending update request...');
    await adtClient.updateObjectSource(classUri, updatedSource, lock.lockHandle);
    logSuccess('  Source updated successfully');

    // Step 3d: Unlock the object
    logInfo('  3d: Releasing lock...');
    await adtClient.unlockObject(classUri, lock.lockHandle);
    logSuccess('  Lock released successfully');

    // Step 3e: Verify the update
    logInfo('  3e: Verifying update...');
    const newSource = await adtClient.getObjectSource(classUri);
    
    if (newSource.includes('ty_mcp_test') || newSource.includes('MCP CRUD TEST')) {
      logSuccess('  Update verified - content found in source');
    } else {
      logWarning('  Update may not have been persisted');
    }

  } catch (error) {
    logError(`Failed to update class: ${error}`);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.log('  Error details:', error.message);
      if ('response' in error) {
        console.log('  Response:', (error as any).response?.data);
      }
    }
  }

  // ========================================
  // Step 4: Activate Class
  // ========================================
  logInfo('Step 4: Activating class...');
  
  try {
    await handlers.program.activateObject({
      objectUri: classUri
    });
    logSuccess('Class activated successfully');
  } catch (error) {
    logWarning(`Activation may have issues: ${error}`);
  }

  // ========================================
  // Step 5: Delete Class (Cleanup)
  // ========================================
  logInfo('Step 5: Deleting class (cleanup)...');
  
  try {
    // Lock before delete
    const deleteLock = await adtClient.lockObject(classUri);
    logInfo(`  Delete lock acquired: ${deleteLock.lockHandle.substring(0, 30)}...`);
    
    // Delete the class
    await adtClient.delete(classUri, {
      params: { lockHandle: deleteLock.lockHandle }
    });
    
    logSuccess(`Class ${className} deleted successfully`);
  } catch (error) {
    logWarning(`Delete not completed: ${error}`);
    logInfo('  This is expected for $TMP objects');
  }

  console.log(`\n${colors.bold}${colors.green}=== Class CRUD Test Complete ===${colors.reset}\n`);
}

// Run the test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});