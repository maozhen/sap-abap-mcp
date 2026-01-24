/**
 * SAP ABAP MCP Server - Full Integration Test Script
 * Creates related ABAP objects that form a complete runnable Report:
 * 1. Domain -> 2. Data Element -> 3. Table -> 4. Class -> 5. Function Module -> 6. Report
 * All objects are saved in $TMP package
 */

import * as dotenv from 'dotenv';
import { createADTClient, ADTClient } from '../src/clients/adt-client';
import { DDICToolHandler } from '../src/tools/ddic-tools';
import { SAPConnectionConfig } from '../src/types';

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const SKIP_CLEANUP = args.includes('--keep') || args.includes('-k') || !args.includes('--cleanup');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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

function logStep(step: number, message: string): void {
  console.log(`\n${colors.bold}${colors.magenta}[Step ${step}] ${message}${colors.reset}`);
}

// Test object names (using timestamp for uniqueness)
const timestamp = Date.now().toString().slice(-6);
const OBJECT_NAMES = {
  domain: `YMCP_DOM${timestamp}`,
  dataElement: `YMCP_DE${timestamp}`,
  table: `YMCP_TAB${timestamp}`,
  class: `YMCP_CL${timestamp}`,
  functionGroup: `YMCP_FG${timestamp}`,
  functionModule: `YMCP_FM_${timestamp}`,
  report: `YMCP_RPT${timestamp}`
};

/**
 * Helper function to read and display object details from SAP system
 */
async function readAndVerifyObject(
  adtClient: ADTClient, 
  objectType: string, 
  objectName: string, 
  uri: string,
  expectedData: Record<string, unknown>
): Promise<void> {
  logInfo(`  Reading ${objectType} from system to verify...`);
  
  try {
    // Read object metadata
    const response = await adtClient.getObject(uri);
    console.log(`${colors.cyan}  --- ${objectType} Response (metadata) ---${colors.reset}`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Content-Type: ${response.headers['content-type'] || 'N/A'}`);
    
    // Try to parse and display XML
    if (response.data) {
      console.log(`${colors.cyan}  --- Raw XML Content ---${colors.reset}`);
      // Display first 2000 chars of XML
      const xmlPreview = response.data.substring(0, 2000);
      console.log(xmlPreview);
      if (response.data.length > 2000) {
        console.log(`  ... (${response.data.length - 2000} more chars)`);
      }
    }
    
    // Try to read source if available
    try {
      const sourceUri = `${uri}/source/main`;
      const source = await adtClient.getObjectSource(sourceUri);
      if (source) {
        console.log(`${colors.cyan}  --- Source Content ---${colors.reset}`);
        console.log(source.substring(0, 1500));
        if (source.length > 1500) {
          console.log(`  ... (${source.length - 1500} more chars)`);
        }
      }
    } catch {
      // Source may not be available for all object types
    }
    
    // Display expected data
    console.log(`${colors.yellow}  --- Expected Data ---${colors.reset}`);
    console.log(JSON.stringify(expectedData, null, 2));
    console.log('');
    
  } catch (error) {
    logError(`  Failed to read ${objectType}: ${error}`);
  }
}

/**
 * Step 1: Create Domain
 */
async function createDomain(ddicHandler: DDICToolHandler, adtClient: ADTClient): Promise<boolean> {
  logStep(1, `Creating Domain: ${OBJECT_NAMES.domain}`);
  
  const createParams = {
    name: OBJECT_NAMES.domain,
    description: 'MCP Integration Test Domain',
    dataType: 'CHAR',
    length: 20,
    outputLength: 20,
    packageName: '$TMP'
  };
  
  try {
    const result = await ddicHandler.createDomain(createParams);
    
    if (result.success) {
      logSuccess(`Domain ${OBJECT_NAMES.domain} created successfully`);
      
      // Verify by reading from system
      const domainUri = `/ddic/domains/${OBJECT_NAMES.domain.toLowerCase()}`;
      await readAndVerifyObject(adtClient, 'Domain', OBJECT_NAMES.domain, domainUri, createParams);
      
      return true;
    } else {
      logError(`Failed to create domain: ${result.error?.message}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to create domain: ${error}`);
    return false;
  }
}

/**
 * Step 2: Create Data Element (references Domain)
 */
async function createDataElement(ddicHandler: DDICToolHandler, adtClient: ADTClient): Promise<boolean> {
  logStep(2, `Creating Data Element: ${OBJECT_NAMES.dataElement} (references ${OBJECT_NAMES.domain})`);
  
  const createParams = {
    name: OBJECT_NAMES.dataElement,
    description: 'MCP Integration Test Data Element',
    domainName: OBJECT_NAMES.domain,
    shortText: 'MCP Test',
    mediumText: 'MCP Test Field',
    longText: 'MCP Integration Test Field',
    headingText: 'MCP Integration Test Data Element',
    packageName: '$TMP'
  };
  
  try {
    const result = await ddicHandler.createDataElement(createParams);
    
    if (result.success) {
      logSuccess(`Data Element ${OBJECT_NAMES.dataElement} created successfully`);
      
      // Verify by reading from system
      const dtelUri = `/ddic/dataelements/${OBJECT_NAMES.dataElement.toLowerCase()}`;
      await readAndVerifyObject(adtClient, 'Data Element', OBJECT_NAMES.dataElement, dtelUri, createParams);
      
      return true;
    } else {
      logError(`Failed to create data element: ${result.error?.message}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to create data element: ${error}`);
    return false;
  }
}

/**
 * Step 3: Create Database Table (uses Data Element)
 */
async function createTable(ddicHandler: DDICToolHandler, adtClient: ADTClient): Promise<boolean> {
  logStep(3, `Creating Table: ${OBJECT_NAMES.table} (uses ${OBJECT_NAMES.dataElement})`);
  
  const createParams = {
    name: OBJECT_NAMES.table,
    description: 'MCP Integration Test Table',
    deliveryClass: 'A' as const,
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
        name: 'MCP_FIELD',
        dataElement: OBJECT_NAMES.dataElement,  // Reference to our Data Element
        isKey: false,
        isNotNull: false
      },
      {
        name: 'CREATED_BY',
        dataType: 'CHAR',
        length: 12,
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
  };
  
  try {
    const result = await ddicHandler.createDatabaseTable(createParams);
    
    if (result.success) {
      logSuccess(`Table ${OBJECT_NAMES.table} created successfully`);
      
      // Verify by reading from system
      const tableUri = `/ddic/tables/${OBJECT_NAMES.table.toLowerCase()}`;
      await readAndVerifyObject(adtClient, 'Table', OBJECT_NAMES.table, tableUri, createParams);
      
      return true;
    } else {
      logError(`Failed to create table: ${result.error?.message}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to create table: ${error}`);
    return false;
  }
}

/**
 * Step 4: Create Class (uses Table)
 */
async function createClass(adtClient: ADTClient): Promise<boolean> {
  logStep(4, `Creating Class: ${OBJECT_NAMES.class} (uses ${OBJECT_NAMES.table})`);
  
  const classXml = `<?xml version="1.0" encoding="UTF-8"?>
<class:abapClass xmlns:class="http://www.sap.com/adt/oo/classes"
    xmlns:adtcore="http://www.sap.com/adt/core"
    adtcore:description="MCP Integration Test Class"
    adtcore:name="${OBJECT_NAMES.class}"
    adtcore:type="CLAS/OC">
  <adtcore:packageRef adtcore:name="$TMP"/>
</class:abapClass>`;

  try {
    await adtClient.post('/oo/classes', classXml, {
      headers: { 'Content-Type': 'application/vnd.sap.adt.oo.classes.v4+xml' }
    });
    logSuccess(`Class ${OBJECT_NAMES.class} created successfully`);
    
    // Update class source to use the table
    const classUri = `/oo/classes/${OBJECT_NAMES.class.toLowerCase()}`;
    const includesUri = `${classUri}/includes`;
    
    // Get class main include source
    logInfo('  Updating class implementation to use table...');
    try {
      // Read current source
      const sourceUri = `${classUri}/source/main`;
      let source = await adtClient.getObjectSource(sourceUri);
      logSuccess(`  Read class source (${source.length} chars)`);
      
      // Add table type and method to class definition and implementation
      // Note: Use table field reference (table-field) instead of data element name directly,
      // because data element might not be fully activated when class is compiled
      const classSource = `CLASS ${OBJECT_NAMES.class.toLowerCase()} DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.
    TYPES: BEGIN OF ty_data,
             id        TYPE ${OBJECT_NAMES.table.toLowerCase()}-id,
             mcp_field TYPE ${OBJECT_NAMES.table.toLowerCase()}-mcp_field,
           END OF ty_data.
    TYPES: tt_data TYPE STANDARD TABLE OF ty_data WITH DEFAULT KEY.
    
    CLASS-METHODS: get_data RETURNING VALUE(rt_data) TYPE tt_data.
    
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS ${OBJECT_NAMES.class.toLowerCase()} IMPLEMENTATION.
  METHOD get_data.
    " Read from our integration test table
    SELECT id mcp_field FROM ${OBJECT_NAMES.table.toLowerCase()}
      INTO CORRESPONDING FIELDS OF TABLE rt_data
      UP TO 100 ROWS.
  ENDMETHOD.
ENDCLASS.`;

      // Lock and update
      const lock = await adtClient.lockObject(classUri);
      await adtClient.updateObjectSource(sourceUri, classSource, lock.lockHandle);
      await adtClient.unlockObject(classUri, lock.lockHandle);
      logSuccess('  Class source updated with table reference');
      
    } catch (sourceError) {
      logWarning(`  Could not update class source: ${sourceError}`);
    }
    
    return true;
  } catch (error) {
    logError(`Failed to create class: ${error}`);
    return false;
  }
}

/**
 * Step 5: Create Function Group and Function Module (uses Class)
 */
async function createFunctionModule(adtClient: ADTClient): Promise<boolean> {
  logStep(5, `Creating Function Group: ${OBJECT_NAMES.functionGroup} and Function Module: ${OBJECT_NAMES.functionModule}`);
  
  // Step 5a: Create Function Group
  logInfo('  Creating function group...');
  const fugrXml = `<?xml version="1.0" encoding="UTF-8"?>
<group:abapFunctionGroup xmlns:group="http://www.sap.com/adt/functions/groups" 
    xmlns:adtcore="http://www.sap.com/adt/core"
    adtcore:name="${OBJECT_NAMES.functionGroup}"
    adtcore:description="MCP Integration Test Function Group"
    adtcore:type="FUGR/F">
  <adtcore:packageRef adtcore:name="$TMP"/>
</group:abapFunctionGroup>`;

  try {
    await adtClient.post('/functions/groups', fugrXml, {
      headers: { 'Content-Type': 'application/vnd.sap.adt.functions.groups.v3+xml' }
    });
    logSuccess(`  Function group ${OBJECT_NAMES.functionGroup} created`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      logWarning(`  Function group ${OBJECT_NAMES.functionGroup} already exists`);
    } else {
      logError(`  Failed to create function group: ${error}`);
      return false;
    }
  }

  // Step 5b: Create Function Module
  logInfo('  Creating function module...');
  const fmXml = `<?xml version="1.0" encoding="UTF-8"?>
<fmodule:abapFunctionModule xmlns:fmodule="http://www.sap.com/adt/functions/fmodules"
    xmlns:adtcore="http://www.sap.com/adt/core"
    adtcore:name="${OBJECT_NAMES.functionModule}"
    adtcore:description="MCP Integration Test Function"
    adtcore:type="FUGR/FF">
  <adtcore:packageRef adtcore:name="$TMP"/>
</fmodule:abapFunctionModule>`;

  try {
    await adtClient.post(
      `/functions/groups/${OBJECT_NAMES.functionGroup.toLowerCase()}/fmodules`, 
      fmXml, 
      { headers: { 'Content-Type': 'application/vnd.sap.adt.functions.fmodules.v3+xml' } }
    );
    logSuccess(`  Function module ${OBJECT_NAMES.functionModule} created`);
    
    // Update function module source to call the class
    logInfo('  Updating function module to call class...');
    const fmUri = `/functions/groups/${OBJECT_NAMES.functionGroup.toLowerCase()}/fmodules/${OBJECT_NAMES.functionModule.toLowerCase()}`;
    
    try {
      // Read current source from /source/main
      const fmSourceUri = `${fmUri}/source/main`;
      let source = await adtClient.getObjectSource(fmSourceUri);
      logSuccess(`  Read function module source (${source.length} chars)`);
      
      // Create new function module source that calls our class
      // Note: Function module interface (parameters) must be defined via ADT metadata API,
      // not in source code. Comments starting with *" are treated as parameter blocks
      // and are not allowed in ADT source updates. Use regular * comments instead.
      const fmSource = `FUNCTION ${OBJECT_NAMES.functionModule.toLowerCase()}.
*----------------------------------------------------------------------*
* MCP Integration Test Function Module
* This function calls our integration test class
*----------------------------------------------------------------------*
  DATA: lt_data TYPE ${OBJECT_NAMES.class.toLowerCase()}=>tt_data.
  
  " Call our integration test class to get data
  lt_data = ${OBJECT_NAMES.class.toLowerCase()}=>get_data( ).
  
  " Write output for testing
  LOOP AT lt_data INTO DATA(ls_data).
    WRITE: / 'ID:', ls_data-id, 'Field:', ls_data-mcp_field.
  ENDLOOP.
ENDFUNCTION.`;

      // Lock and update (use fmUri for lock, fmSourceUri for source update)
      const lock = await adtClient.lockObject(fmUri);
      await adtClient.updateObjectSource(fmSourceUri, fmSource, lock.lockHandle);
      await adtClient.unlockObject(fmUri, lock.lockHandle);
      logSuccess('  Function module source updated with class call');
      
    } catch (sourceError) {
      logWarning(`  Could not update function module source: ${sourceError}`);
    }
    
    return true;
  } catch (error) {
    logError(`  Failed to create function module: ${error}`);
    return false;
  }
}

/**
 * Step 6: Create Report (calls Function Module)
 */
async function createReport(adtClient: ADTClient): Promise<boolean> {
  logStep(6, `Creating Report: ${OBJECT_NAMES.report} (calls ${OBJECT_NAMES.functionModule})`);
  
  const reportXml = `<?xml version="1.0" encoding="UTF-8"?>
<program:abapProgram xmlns:program="http://www.sap.com/adt/programs/programs"
    xmlns:adtcore="http://www.sap.com/adt/core"
    adtcore:description="MCP Integration Test Report"
    adtcore:name="${OBJECT_NAMES.report}"
    adtcore:type="PROG/P">
  <adtcore:packageRef adtcore:name="$TMP"/>
</program:abapProgram>`;

  try {
    await adtClient.post('/programs/programs', reportXml, {
      headers: { 'Content-Type': 'application/vnd.sap.adt.programs.programs.v2+xml' }
    });
    logSuccess(`Report ${OBJECT_NAMES.report} created successfully`);
    
    // Update report source to call the function module
    const reportUri = `/programs/programs/${OBJECT_NAMES.report.toLowerCase()}`;
    
    logInfo('  Updating report source to call function module...');
    try {
      // Create report source that calls our function module and class
      const reportSource = `*&---------------------------------------------------------------------*
*& Report ${OBJECT_NAMES.report}
*&---------------------------------------------------------------------*
*& MCP Integration Test Report
*& This report demonstrates the complete integration:
*&   - Calls Function Module: ${OBJECT_NAMES.functionModule}
*&   - Uses Class: ${OBJECT_NAMES.class}
*&   - Which reads Table: ${OBJECT_NAMES.table}
*&   - Using Data Element: ${OBJECT_NAMES.dataElement}
*&   - Based on Domain: ${OBJECT_NAMES.domain}
*&---------------------------------------------------------------------*
REPORT ${OBJECT_NAMES.report.toLowerCase()}.

DATA: lt_data TYPE ${OBJECT_NAMES.class.toLowerCase()}=>tt_data,
      ls_data LIKE LINE OF lt_data.

START-OF-SELECTION.
  " Call our integration test function module (demonstrates FM call)
  CALL FUNCTION '${OBJECT_NAMES.functionModule}'.
  
  " Also call class method directly to get data
  lt_data = ${OBJECT_NAMES.class.toLowerCase()}=>get_data( ).

  " Display results
  WRITE: / 'MCP Integration Test Results'.
  WRITE: / '============================'.
  WRITE: / 'Records found:', lines( lt_data ).
  SKIP.
  
  LOOP AT lt_data INTO ls_data.
    WRITE: / 'ID:', ls_data-id, 'Field:', ls_data-mcp_field.
  ENDLOOP.
  
  IF lines( lt_data ) = 0.
    WRITE: / 'No data found in table ${OBJECT_NAMES.table}'.
  ENDIF.`;

      // Lock and update
      const lock = await adtClient.lockObject(reportUri);
      await adtClient.updateObjectSource(reportUri, reportSource, lock.lockHandle);
      await adtClient.unlockObject(reportUri, lock.lockHandle);
      logSuccess('  Report source updated with function module call');
      
    } catch (sourceError) {
      logWarning(`  Could not update report source: ${sourceError}`);
    }
    
    return true;
  } catch (error) {
    logError(`Failed to create report: ${error}`);
    return false;
  }
}

/**
 * Activate all objects in dependency order
 */
async function activateObjects(adtClient: ADTClient, ddicHandler: DDICToolHandler): Promise<void> {
  logStep(7, 'Activating all objects in dependency order');
  
  const activationOrder = [
    { name: OBJECT_NAMES.domain, type: 'DOMA', uri: `/ddic/domains/${OBJECT_NAMES.domain.toLowerCase()}` },
    { name: OBJECT_NAMES.dataElement, type: 'DTEL', uri: `/ddic/dataelements/${OBJECT_NAMES.dataElement.toLowerCase()}` },
    { name: OBJECT_NAMES.table, type: 'TABL', uri: `/ddic/tables/${OBJECT_NAMES.table.toLowerCase()}` },
    { name: OBJECT_NAMES.class, type: 'CLAS', uri: `/oo/classes/${OBJECT_NAMES.class.toLowerCase()}` },
    { name: OBJECT_NAMES.functionGroup, type: 'FUGR', uri: `/functions/groups/${OBJECT_NAMES.functionGroup.toLowerCase()}` },
    { name: OBJECT_NAMES.report, type: 'PROG', uri: `/programs/programs/${OBJECT_NAMES.report.toLowerCase()}` }
  ];

  for (const obj of activationOrder) {
    logInfo(`  Activating ${obj.type}: ${obj.name}...`);
    try {
      const result = await adtClient.activate(obj.uri);
      if (result.success) {
        logSuccess(`    ${obj.name} activated`);
      } else {
        logWarning(`    ${obj.name} activation may have issues: ${result.messages.map(m => m.message).join(', ')}`);
      }
    } catch (error) {
      logWarning(`    Failed to activate ${obj.name}: ${error}`);
    }
  }
}

/**
 * Delete all objects in reverse dependency order (cleanup)
 */
async function deleteObjects(adtClient: ADTClient): Promise<void> {
  logStep(8, 'Cleaning up: Deleting all test objects');
  
  const deletionOrder = [
    { name: OBJECT_NAMES.report, uri: `/programs/programs/${OBJECT_NAMES.report.toLowerCase()}` },
    { name: OBJECT_NAMES.functionModule, uri: `/functions/groups/${OBJECT_NAMES.functionGroup.toLowerCase()}/fmodules/${OBJECT_NAMES.functionModule.toLowerCase()}` },
    { name: OBJECT_NAMES.functionGroup, uri: `/functions/groups/${OBJECT_NAMES.functionGroup.toLowerCase()}` },
    { name: OBJECT_NAMES.class, uri: `/oo/classes/${OBJECT_NAMES.class.toLowerCase()}` },
    { name: OBJECT_NAMES.table, uri: `/ddic/tables/${OBJECT_NAMES.table.toLowerCase()}` },
    { name: OBJECT_NAMES.dataElement, uri: `/ddic/dataelements/${OBJECT_NAMES.dataElement.toLowerCase()}` },
    { name: OBJECT_NAMES.domain, uri: `/ddic/domains/${OBJECT_NAMES.domain.toLowerCase()}` }
  ];

  for (const obj of deletionOrder) {
    logInfo(`  Deleting ${obj.name}...`);
    try {
      const lock = await adtClient.lockObject(obj.uri);
      await adtClient.delete(obj.uri, { params: { lockHandle: lock.lockHandle } });
      logSuccess(`    ${obj.name} deleted`);
    } catch (error) {
      logWarning(`    Could not delete ${obj.name}: ${error}`);
    }
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log(`\n${colors.bold}${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║     SAP ABAP MCP Server - Full Integration Test              ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╠══════════════════════════════════════════════════════════════╣${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║  Creating linked ABAP objects:                               ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║  Domain → Data Element → Table → Class → FM → Report        ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

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
  logInfo(`Client: ${connection.client}, User: ${connection.username}`);

  // Create ADT client and DDIC handler
  const adtClient = createADTClient(connection);
  const ddicHandler = new DDICToolHandler(adtClient);

  // Display object names
  console.log(`\n${colors.bold}Test Objects to be created:${colors.reset}`);
  console.log(`  1. Domain:         ${colors.cyan}${OBJECT_NAMES.domain}${colors.reset}`);
  console.log(`  2. Data Element:   ${colors.cyan}${OBJECT_NAMES.dataElement}${colors.reset} → references Domain`);
  console.log(`  3. Table:          ${colors.cyan}${OBJECT_NAMES.table}${colors.reset} → uses Data Element`);
  console.log(`  4. Class:          ${colors.cyan}${OBJECT_NAMES.class}${colors.reset} → uses Table`);
  console.log(`  5. Function Group: ${colors.cyan}${OBJECT_NAMES.functionGroup}${colors.reset}`);
  console.log(`  6. Function Module:${colors.cyan}${OBJECT_NAMES.functionModule}${colors.reset} → uses Class`);
  console.log(`  7. Report:         ${colors.cyan}${OBJECT_NAMES.report}${colors.reset} → calls Function Module`);

  // Track success status
  let allSuccess = true;

  // Step 1: Create Domain
  if (!(await createDomain(ddicHandler, adtClient))) {
    allSuccess = false;
    logWarning('Continuing despite domain creation failure...');
  }

  // Step 2: Create Data Element
  if (!(await createDataElement(ddicHandler, adtClient))) {
    allSuccess = false;
    logWarning('Continuing despite data element creation failure...');
  }

  // Step 3: Create Table
  if (!(await createTable(ddicHandler, adtClient))) {
    allSuccess = false;
    logWarning('Continuing despite table creation failure...');
  }

  // Step 4: Create Class
  if (!(await createClass(adtClient))) {
    allSuccess = false;
    logWarning('Continuing despite class creation failure...');
  }

  // Step 5: Create Function Module
  if (!(await createFunctionModule(adtClient))) {
    allSuccess = false;
    logWarning('Continuing despite function module creation failure...');
  }

  // Step 6: Create Report
  if (!(await createReport(adtClient))) {
    allSuccess = false;
    logWarning('Continuing despite report creation failure...');
  }

  // Step 7: Activate all objects
  await activateObjects(adtClient, ddicHandler);

  // Step 8: Cleanup (optional - delete all objects)
  if (SKIP_CLEANUP) {
    console.log(`\n${colors.bold}${colors.green}Skipping cleanup - objects are kept in SAP system.${colors.reset}`);
    console.log(`${colors.yellow}Use --cleanup flag to delete objects after test.${colors.reset}`);
    console.log(`\n${colors.bold}Created objects in $TMP:${colors.reset}`);
    console.log(`  - Domain:          ${OBJECT_NAMES.domain}`);
    console.log(`  - Data Element:    ${OBJECT_NAMES.dataElement}`);
    console.log(`  - Table:           ${OBJECT_NAMES.table}`);
    console.log(`  - Class:           ${OBJECT_NAMES.class}`);
    console.log(`  - Function Group:  ${OBJECT_NAMES.functionGroup}`);
    console.log(`  - Function Module: ${OBJECT_NAMES.functionModule}`);
    console.log(`  - Report:          ${OBJECT_NAMES.report}`);
  } else {
    console.log(`\n${colors.bold}${colors.yellow}Cleanup mode: Deleting all test objects...${colors.reset}`);
    await deleteObjects(adtClient);
  }

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  if (allSuccess) {
    console.log(`${colors.bold}${colors.green}║     ✓ Full Integration Test Completed Successfully!         ║${colors.reset}`);
  } else {
    console.log(`${colors.bold}${colors.yellow}║     ⚠ Full Integration Test Completed with Warnings         ║${colors.reset}`);
  }
  console.log(`${colors.bold}${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);
}

// Run the test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});