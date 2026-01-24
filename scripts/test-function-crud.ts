/**
 * SAP ABAP MCP Server - Function Module CRUD Test Script
 * Tests Create, Read, Update, Delete operations for Function Modules
 */

import * as dotenv from 'dotenv';
import { createADTClient, ADTClient } from '../src/clients/adt-client';
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

/**
 * Create a function group for testing
 */
async function createFunctionGroup(adtClient: ADTClient, fugr: string): Promise<boolean> {
  logInfo(`Creating function group ${fugr}...`);
  
  const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<group:abapFunctionGroup xmlns:group="http://www.sap.com/adt/functions/groups" 
    xmlns:adtcore="http://www.sap.com/adt/core"
    adtcore:name="${fugr}"
    adtcore:description="MCP Test Function Group"
    adtcore:type="FUGR/F">
  <adtcore:packageRef adtcore:name="$TMP"/>
</group:abapFunctionGroup>`;

  try {
    await adtClient.post('/functions/groups', requestBody, {
      headers: {
        'Content-Type': 'application/vnd.sap.adt.functions.groups.v3+xml'
      }
    });
    logSuccess(`Function group ${fugr} created successfully`);
    return true;
  } catch (error) {
    // Check if group already exists
    if (error instanceof Error && error.message.includes('already exists')) {
      logWarning(`Function group ${fugr} already exists`);
      return true;
    }
    logError(`Failed to create function group: ${error}`);
    return false;
  }
}

/**
 * Create a function module
 */
async function createFunctionModule(
  adtClient: ADTClient, 
  fugr: string, 
  funcName: string
): Promise<boolean> {
  logInfo(`Creating function module ${funcName} in group ${fugr}...`);
  
  const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<fmodule:abapFunctionModule xmlns:fmodule="http://www.sap.com/adt/functions/fmodules"
    xmlns:adtcore="http://www.sap.com/adt/core"
    adtcore:name="${funcName}"
    adtcore:description="MCP Test Function Module"
    adtcore:type="FUGR/FF">
  <adtcore:packageRef adtcore:name="$TMP"/>
</fmodule:abapFunctionModule>`;

  try {
    await adtClient.post(`/functions/groups/${fugr.toLowerCase()}/fmodules`, requestBody, {
      headers: {
        'Content-Type': 'application/vnd.sap.adt.functions.fmodules.v3+xml'
      }
    });
    logSuccess(`Function module ${funcName} created successfully`);
    return true;
  } catch (error) {
    logError(`Failed to create function module: ${error}`);
    return false;
  }
}

/**
 * Get function module source
 */
async function getFunctionModuleSource(
  adtClient: ADTClient, 
  fugr: string, 
  funcName: string
): Promise<string | null> {
  const uri = `/functions/groups/${fugr.toLowerCase()}/fmodules/${funcName.toLowerCase()}`;
  
  try {
    const source = await adtClient.getObjectSource(uri);
    return source;
  } catch (error) {
    logWarning(`Could not get source from ${uri}: ${error}`);
    return null;
  }
}

/**
 * Update function module source using Lock-Update-Unlock workflow
 */
async function updateFunctionModuleSource(
  adtClient: ADTClient, 
  fugr: string, 
  funcName: string,
  newSource: string
): Promise<boolean> {
  const uri = `/functions/groups/${fugr.toLowerCase()}/fmodules/${funcName.toLowerCase()}`;
  
  try {
    // Step 1: Lock
    logInfo('  Acquiring lock...');
    const lock = await adtClient.lockObject(uri);
    logSuccess(`  Lock acquired: ${lock.lockHandle.substring(0, 30)}...`);
    
    // Step 2: Update
    logInfo('  Updating source...');
    await adtClient.updateObjectSource(uri, newSource, lock.lockHandle);
    logSuccess('  Source updated');
    
    // Step 3: Unlock
    logInfo('  Releasing lock...');
    await adtClient.unlockObject(uri, lock.lockHandle);
    logSuccess('  Lock released');
    
    return true;
  } catch (error) {
    logError(`Failed to update function module: ${error}`);
    return false;
  }
}

/**
 * Delete function module
 */
async function deleteFunctionModule(
  adtClient: ADTClient, 
  fugr: string, 
  funcName: string
): Promise<boolean> {
  const uri = `/functions/groups/${fugr.toLowerCase()}/fmodules/${funcName.toLowerCase()}`;
  
  try {
    // Lock before delete
    const lock = await adtClient.lockObject(uri);
    logInfo(`  Delete lock acquired: ${lock.lockHandle.substring(0, 30)}...`);
    
    await adtClient.delete(uri, {
      params: { lockHandle: lock.lockHandle }
    });
    
    logSuccess(`Function module ${funcName} deleted`);
    return true;
  } catch (error) {
    logWarning(`Delete not completed: ${error}`);
    return false;
  }
}

/**
 * Delete function group
 */
async function deleteFunctionGroup(adtClient: ADTClient, fugr: string): Promise<boolean> {
  const uri = `/functions/groups/${fugr.toLowerCase()}`;
  
  try {
    // Lock before delete
    const lock = await adtClient.lockObject(uri);
    logInfo(`  Delete lock acquired: ${lock.lockHandle.substring(0, 30)}...`);
    
    await adtClient.delete(uri, {
      params: { lockHandle: lock.lockHandle }
    });
    
    logSuccess(`Function group ${fugr} deleted`);
    return true;
  } catch (error) {
    logWarning(`Delete function group not completed: ${error}`);
    return false;
  }
}

/**
 * Activate function module
 */
async function activateFunctionModule(
  adtClient: ADTClient, 
  fugr: string, 
  funcName: string
): Promise<boolean> {
  const uri = `/sap/bc/adt/functions/groups/${fugr.toLowerCase()}/fmodules/${funcName.toLowerCase()}`;
  
  try {
    const result = await adtClient.activate(uri);
    if (result.success) {
      logSuccess(`Function module ${funcName} activated`);
      return true;
    } else {
      logWarning(`Activation may have issues: ${result.messages.map(m => m.message).join(', ')}`);
      return result.messages.length === 0;
    }
  } catch (error) {
    logWarning(`Activation error: ${error}`);
    return false;
  }
}

async function main(): Promise<void> {
  console.log(`\n${colors.bold}${colors.cyan}=== Function Module CRUD Test ===${colors.reset}\n`);

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

  // Use unique names for test objects
  const timestamp = Date.now().toString().slice(-6);
  const fugrName = `ZMCP_FG${timestamp}`;
  const funcName = `ZMCP_FM_${timestamp}`;

  console.log(`\n${colors.bold}Test Objects:${colors.reset}`);
  console.log(`  Function Group: ${fugrName}`);
  console.log(`  Function Module: ${funcName}\n`);

  // ========================================
  // Step 1: Create Function Group
  // ========================================
  logInfo('Step 1: Creating function group...');
  
  const groupCreated = await createFunctionGroup(adtClient, fugrName);
  if (!groupCreated) {
    logError('Cannot continue without function group');
    return;
  }

  // ========================================
  // Step 2: Create Function Module
  // ========================================
  logInfo('Step 2: Creating function module...');
  
  const funcCreated = await createFunctionModule(adtClient, fugrName, funcName);
  if (!funcCreated) {
    logWarning('Function module creation failed, trying alternative approach...');
  }

  // ========================================
  // Step 3: Read Function Module Source
  // ========================================
  logInfo('Step 3: Reading function module source...');
  
  const originalSource = await getFunctionModuleSource(adtClient, fugrName, funcName);
  if (originalSource) {
    logSuccess(`Function module source read successfully (${originalSource.length} chars)`);
    console.log('  Source preview:\n', originalSource.substring(0, 400));
  } else {
    // Try to get list of function modules in group
    logInfo('  Trying to list function modules in group...');
    try {
      const groupResponse = await adtClient.get(`/functions/groups/${fugrName.toLowerCase()}`);
      console.log('  Group response:', groupResponse.raw?.substring(0, 500));
    } catch (e) {
      logWarning(`Could not read function group: ${e}`);
    }
  }

  // ========================================
  // Step 4: Update Function Module (if source exists)
  // ========================================
  logInfo('Step 4: Updating function module source...');
  
  if (originalSource) {
    // Add a comment to the source
    const updatedSource = originalSource.replace(
      'FUNCTION',
      `*" MCP Test Update at ${new Date().toISOString()}\nFUNCTION`
    );
    
    const updated = await updateFunctionModuleSource(adtClient, fugrName, funcName, updatedSource);
    
    if (updated) {
      // Verify update
      logInfo('  Verifying update...');
      const newSource = await getFunctionModuleSource(adtClient, fugrName, funcName);
      if (newSource?.includes('MCP Test Update')) {
        logSuccess('  Update verified - comment found in source');
      } else {
        logWarning('  Update may not have been persisted');
      }
    }
  } else {
    logWarning('  Skipping update - no source available');
  }

  // ========================================
  // Step 5: Activate Function Module
  // ========================================
  logInfo('Step 5: Activating function module...');
  
  if (funcCreated) {
    await activateFunctionModule(adtClient, fugrName, funcName);
  } else {
    logWarning('  Skipping activation - function module not created');
  }

  // ========================================
  // Step 6: Delete Function Module (Cleanup)
  // ========================================
  logInfo('Step 6: Deleting function module (cleanup)...');
  
  if (funcCreated) {
    await deleteFunctionModule(adtClient, fugrName, funcName);
  }

  // ========================================
  // Step 7: Delete Function Group (Cleanup)
  // ========================================
  logInfo('Step 7: Deleting function group (cleanup)...');
  
  await deleteFunctionGroup(adtClient, fugrName);

  console.log(`\n${colors.bold}${colors.green}=== Function Module CRUD Test Complete ===${colors.reset}\n`);
}

// Run the test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});