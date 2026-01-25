/**
 * Test Script for Structure and Table Type Creation
 * Uses unique object names with timestamp to avoid conflicts
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../src/clients/adt-client';
import { DDICToolHandler } from '../src/tools/ddic-tools';

dotenv.config();

// Generate unique names using timestamp
const timestamp = Date.now().toString().slice(-6);
const STRUCTURE_NAME = `YMCP_S${timestamp}`;
const TABLE_TYPE_NAME = `YMCP_T${timestamp}`;
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

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main(): Promise<void> {
  log('Structure and Table Type Creation Test', 'cyan');
  log('='.repeat(60), 'cyan');
  
  // Validate environment
  const { SAP_URL, SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD, SAP_SSL } = process.env;
  
  let host: string;
  let port: number;
  let isHttps: boolean;
  
  if (SAP_URL) {
    const sapUrl = new URL(SAP_URL);
    isHttps = sapUrl.protocol === 'https:';
    host = sapUrl.hostname;
    port = sapUrl.port ? parseInt(sapUrl.port, 10) : (isHttps ? 443 : 80);
  } else if (SAP_HOST) {
    host = SAP_HOST;
    port = SAP_PORT ? parseInt(SAP_PORT, 10) : 443;
    isHttps = SAP_SSL !== 'false';
  } else {
    log('Missing required environment variables', 'red');
    process.exit(1);
  }
  
  if (!SAP_CLIENT || !SAP_USER || !SAP_PASSWORD) {
    log('Missing required environment variables: SAP_CLIENT, SAP_USER, SAP_PASSWORD', 'red');
    process.exit(1);
  }
  
  log(`SAP Host: ${host}:${port} (${isHttps ? 'HTTPS' : 'HTTP'})`, 'gray');
  log(`Structure Name: ${STRUCTURE_NAME}`, 'gray');
  log(`Table Type Name: ${TABLE_TYPE_NAME}`, 'gray');
  
  // Initialize client and handler
  const adtClient = new ADTClient({
    connection: {
      host,
      port,
      https: isHttps,
      client: SAP_CLIENT,
      username: SAP_USER,
      password: SAP_PASSWORD,
      allowInsecure: true,
    },
  });
  
  const ddicHandler = new DDICToolHandler(adtClient);
  
  // ============================================
  // Test 1: Create Structure
  // ============================================
  log('\n--- Test 1: Create Structure ---', 'cyan');
  
  try {
    log(`Creating structure: ${STRUCTURE_NAME}...`, 'gray');
    const structureResult = await ddicHandler.createStructure({
      name: STRUCTURE_NAME,
      description: 'Test structure for STRU/TTYP creation test',
      components: [
        { name: 'FIELD1', dataType: 'CHAR', length: 10 },
        { name: 'FIELD2', dataType: 'NUMC', length: 5 },
      ],
      packageName: PACKAGE_NAME,
    });
    
    if (structureResult.success) {
      log(`✓ Structure ${STRUCTURE_NAME} created successfully!`, 'green');
      
      // Verify by reading
      const readResult = await ddicHandler.getDDICObject({
        objectType: 'STRU',
        name: STRUCTURE_NAME,
      });
      
      if (readResult.success) {
        log(`  ✓ Structure read back successfully`, 'green');
      } else {
        log(`  ✗ Structure read back failed: ${readResult.error?.message}`, 'yellow');
      }
    } else {
      log(`✗ Structure creation failed: ${structureResult.error?.message}`, 'red');
      if (structureResult.error?.details) {
        log(`  Details: ${structureResult.error.details}`, 'gray');
      }
    }
  } catch (error) {
    log(`✗ Structure creation error: ${error}`, 'red');
  }
  
  // ============================================
  // Test 2: Create Table Type (using standard structure)
  // ============================================
  log('\n--- Test 2: Create Table Type ---', 'cyan');
  
  try {
    log(`Creating table type: ${TABLE_TYPE_NAME}...`, 'gray');
    // Use a standard SAP structure as line type to avoid dependency on our test structure
    const tableTypeResult = await ddicHandler.createTableType({
      name: TABLE_TYPE_NAME,
      description: 'Test table type for STRU/TTYP creation test',
      lineType: 'BAPIRET2',  // Use standard structure that exists in all SAP systems
      lineTypeKind: 'structure',
      accessMode: 'standard',
      packageName: PACKAGE_NAME,
    });
    
    if (tableTypeResult.success) {
      log(`✓ Table type ${TABLE_TYPE_NAME} created successfully!`, 'green');
      
      // Verify by reading
      const readResult = await ddicHandler.getDDICObject({
        objectType: 'TTYP',
        name: TABLE_TYPE_NAME,
      });
      
      if (readResult.success) {
        log(`  ✓ Table type read back successfully`, 'green');
      } else {
        log(`  ✗ Table type read back failed: ${readResult.error?.message}`, 'yellow');
      }
    } else {
      log(`✗ Table type creation failed: ${tableTypeResult.error?.message}`, 'red');
      if (tableTypeResult.error?.details) {
        log(`  Details: ${tableTypeResult.error.details}`, 'gray');
      }
    }
  } catch (error) {
    log(`✗ Table type creation error: ${error}`, 'red');
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  log('Test completed', 'cyan');
}

main().catch((error) => {
  log(`Fatal error: ${error}`, 'red');
  process.exit(1);
});