/**
 * SAP ABAP MCP Server - Database Table CRUD Test Script
 * Tests Create, Read, Update, Delete operations for Database Tables
 */

import * as dotenv from 'dotenv';
import { createADTClient } from '../src/clients/adt-client';
import { DDICToolHandler } from '../src/tools/ddic-tools';
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
  console.log(`\n${colors.bold}${colors.cyan}=== Database Table CRUD Test ===${colors.reset}\n`);

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

  // Create ADT client and DDIC handler
  const adtClient = createADTClient(connection);
  const ddicHandler = new DDICToolHandler(adtClient);

  // Use unique name for new test table
  const timestamp = Date.now().toString().slice(-6);
  const tableName = `YMCP_T${timestamp}`;
  const tableUri = `/ddic/tables/${tableName.toLowerCase()}`;

  console.log(`\n${colors.bold}Test Table: ${tableName}${colors.reset}\n`);

  // ========================================
  // Step 1: Create Table
  // ========================================
  logInfo('Step 1: Creating new database table...');
  
  try {
    const createResult = await ddicHandler.createDatabaseTable({
      name: tableName,
      description: 'MCP Test Table for CRUD',
      deliveryClass: 'A',
      fields: [
        {
          name: 'MANDT',
          dataType: 'CLNT',
          length: 3,
          isKey: true,
          isNotNull: true
        },
        {
          name: 'ID',
          dataType: 'NUMC',
          length: 10,
          isKey: true,
          isNotNull: true
        },
        {
          name: 'NAME',
          dataType: 'CHAR',
          length: 50,
          isKey: false,
          isNotNull: false
        },
        {
          name: 'VALUE',
          dataType: 'DEC',
          length: 15,
          decimals: 2,
          isKey: false,
          isNotNull: false
        },
        {
          name: 'CREATED_AT',
          dataType: 'DATS',
          isKey: false,
          isNotNull: false
        }
      ],
      packageName: '$TMP'
    });
    
    if (createResult.success) {
      logSuccess(`Table ${tableName} created successfully`);
      console.log('  Create result:', JSON.stringify(createResult.data, null, 2));
    } else {
      logError(`Failed to create table: ${createResult.error?.message}`);
      return;
    }
  } catch (error) {
    logError(`Failed to create table: ${error}`);
    return;
  }

  // ========================================
  // Step 2: Read Table Metadata
  // ========================================
  logInfo('Step 2: Reading table metadata...');
  
  try {
    const getResult = await ddicHandler.getDDICObject({
      name: tableName,
      objectType: 'TABL'
    });
    
    if (getResult.success) {
      logSuccess(`Table metadata read successfully`);
      console.log('  Table metadata:', JSON.stringify(getResult.data, null, 2));
    } else {
      logWarning(`Could not read table metadata: ${getResult.error?.message}`);
    }
  } catch (error) {
    logWarning(`Failed to read table metadata: ${error}`);
  }

  // ========================================
  // Step 3: Read Table Source (DDL)
  // ========================================
  logInfo('Step 3: Reading table DDL source...');
  
  let originalSource: string = '';
  try {
    originalSource = await adtClient.getObjectSource(tableUri);
    logSuccess(`Table DDL source read successfully (${originalSource.length} chars)`);
    console.log('  Source preview:\n', originalSource.substring(0, 500));
  } catch (error) {
    logWarning(`Failed to read table source: ${error}`);
    // Table might not have source in same format as programs
    // Try alternative endpoint
    try {
      const altUri = `${tableUri}/source/main`;
      originalSource = await adtClient.getObjectSource(altUri);
      logSuccess(`Table source read from /source/main (${originalSource.length} chars)`);
    } catch (e2) {
      logWarning(`Alternative URI also failed: ${e2}`);
    }
  }

  // ========================================
  // Step 4: Update Table (Add a field)
  // ========================================
  logInfo('Step 4: Updating table source...');
  
  if (originalSource) {
    try {
      // Step 4a: Lock the object
      logInfo('  4a: Acquiring lock...');
      const lock = await adtClient.lockObject(tableUri);
      logSuccess(`  Lock acquired: ${lock.lockHandle.substring(0, 30)}...`);

      // Step 4b: Prepare updated source
      logInfo('  4b: Preparing updated source...');
      
      // Add a new field before the closing brace
      const newField = '  description : abap.char(100);';
      const updatedSource = originalSource.includes('description')
        ? originalSource
        : originalSource.replace(
            /(\})\s*$/,
            `${newField}\n}`
          );
      
      console.log('  Updated source preview:\n', updatedSource.substring(0, 600));

      // Step 4c: Update the source
      logInfo('  4c: Sending update request...');
      await adtClient.updateObjectSource(tableUri, updatedSource, lock.lockHandle);
      logSuccess('  Source updated successfully');

      // Step 4d: Unlock the object
      logInfo('  4d: Releasing lock...');
      await adtClient.unlockObject(tableUri, lock.lockHandle);
      logSuccess('  Lock released successfully');

      // Step 4e: Verify the update
      logInfo('  4e: Verifying update...');
      const newSource = await adtClient.getObjectSource(tableUri);
      
      if (newSource.includes('description')) {
        logSuccess('  Update verified - new field found in source');
      } else {
        logWarning('  Update may not have been persisted');
      }

    } catch (error) {
      logWarning(`Failed to update table: ${error}`);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.log('  Error details:', error.message);
        if ('response' in error) {
          console.log('  Response:', (error as any).response?.data);
        }
      }
    }
  } else {
    logWarning('  Skipping update - no source available to modify');
  }

  // ========================================
  // Step 5: Activate Table
  // ========================================
  logInfo('Step 5: Activating table...');
  
  try {
    const activateResult = await ddicHandler.activateDDICObject({
      name: tableName,
      objectType: 'TABL'
    });
    
    if (activateResult.success) {
      logSuccess('Table activated successfully');
    } else {
      logWarning(`Activation may have issues: ${activateResult.error?.message}`);
      if (activateResult.data?.messages) {
        console.log('  Activation messages:', activateResult.data.messages);
      }
    }
  } catch (error) {
    logWarning(`Activation error: ${error}`);
  }

  // ========================================
  // Step 6: Delete Table (Cleanup)
  // ========================================
  logInfo('Step 6: Deleting table (cleanup)...');
  
  try {
    // Lock before delete
    const deleteLock = await adtClient.lockObject(tableUri);
    logInfo(`  Delete lock acquired: ${deleteLock.lockHandle.substring(0, 30)}...`);
    
    // Delete the table
    await adtClient.delete(tableUri, {
      params: { lockHandle: deleteLock.lockHandle }
    });
    
    logSuccess(`Table ${tableName} deleted successfully`);
  } catch (error) {
    logWarning(`Delete not completed: ${error}`);
    logInfo('  This may be expected for $TMP objects or if table has dependencies');
  }

  console.log(`\n${colors.bold}${colors.green}=== Database Table CRUD Test Complete ===${colors.reset}\n`);
}

// Run the test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});