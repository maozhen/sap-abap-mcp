/**
 * CDS Tools MCP Client Integration Tests
 * 
 * Tests CDS tools through true MCP protocol (stdio transport)
 * Server process spawned separately - matches production environment
 * 
 * Test objects use "YMCP" prefix with timestamp
 * Package: $TMP
 */

import {
  runMCPTests,
  generateTestName,
  PACKAGE_NAME,
  MCPToolResponse,
  MCPTestRunner,
  MCPClientTestHelper,
} from './mcp-client-helper';

// Test object names (generated once per test run)
const TEST_CDS_VIEW = generateTestName('CDS', 'CDV');
const TEST_SERVICE_DEF = generateTestName('CDS', 'SRV');
const TEST_SERVICE_BIND = generateTestName('CDS', 'SRB');

// Store created objects for later tests
let createdCdsView: string = '';
let createdServiceDef: string = '';
let createdServiceBind: string = '';

/**
 * Validator for checking response has data
 */
function hasData(response: MCPToolResponse): void {
  if (!response.data) {
    throw new Error('Response has no data');
  }
}

/**
 * Validator for checking response has success field
 */
function hasSuccess(response: MCPToolResponse): void {
  const data = response.data as { success?: boolean };
  if (data && data.success === false) {
    const errorData = data as { error?: { message?: string } };
    throw new Error(`Operation failed: ${errorData.error?.message || 'Unknown error'}`);
  }
}

/**
 * Main test function
 */
async function runCDSToolsTests(runner: MCPTestRunner, client: MCPClientTestHelper): Promise<void> {
  // ============================================================
  // CREATE OPERATIONS
  // ============================================================

  // Test: Create CDS View
  await runner.runToolTest(
    'Create CDS View',
    'create_cds_view',
    {
      name: TEST_CDS_VIEW,
      description: 'MCP Test CDS View',
      sqlViewName: `Z${TEST_CDS_VIEW.substring(0, 15)}`,
      dataSource: 'T000',
      fields: [
        { name: 'MANDT', source: 'MANDT' },
        { name: 'CCCATEGORY', source: 'CCCATEGORY', alias: 'Category' },
      ],
      annotations: ['@AbapCatalog.sqlViewName', '@AccessControl.authorizationCheck: #NOT_REQUIRED'],
      package: PACKAGE_NAME,
    },
    (response) => {
      hasData(response);
      hasSuccess(response);
      const data = response.data as { data?: { name?: string } };
      if (data.data?.name) {
        createdCdsView = data.data.name;
      } else {
        createdCdsView = TEST_CDS_VIEW;
      }
    }
  );

  // Test: Get CDS View (after creation)
  if (createdCdsView) {
    await runner.runToolTest(
      'Get CDS View (after creation)',
      'get_cds_view',
      { cdsViewName: createdCdsView },
      (response) => {
        hasData(response);
        // CDS view may not exist if creation failed
      }
    );
  }

  // Test: Get CDS Source
  if (createdCdsView) {
    await runner.runToolTest(
      'Get CDS Source',
      'get_cds_source',
      { cdsViewName: createdCdsView },
      (response) => {
        // Response may contain source code or error
        hasData(response);
      }
    );
  }

  // Test: Update CDS Source
  if (createdCdsView) {
    const newSource = `@AbapCatalog.sqlViewName: 'Z${TEST_CDS_VIEW.substring(0, 15)}'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'MCP Test CDS View Updated'
define view ${createdCdsView} as select from t000 {
  key mandt,
  cccategory as Category
}`;

    await runner.runToolTest(
      'Update CDS Source',
      'update_cds_source',
      {
        cdsViewName: createdCdsView,
        source: newSource,
      },
      (response) => {
        hasData(response);
      }
    );
  }

  // Test: Activate CDS View
  if (createdCdsView) {
    await runner.runToolTest(
      'Activate CDS View',
      'activate_cds_object',
      {
        objectType: 'DDLS',
        objectName: createdCdsView,
      },
      (response) => {
        hasData(response);
        // Activation may fail if source is invalid
      }
    );
  }

  // Test: Create Service Definition
  await runner.runToolTest(
    'Create Service Definition',
    'create_service_definition',
    {
      name: TEST_SERVICE_DEF,
      description: 'MCP Test Service Definition',
      exposedEntities: [
        {
          cdsView: createdCdsView || 'T000',
          alias: 'TestEntity',
        },
      ],
      package: PACKAGE_NAME,
    },
    (response) => {
      hasData(response);
      hasSuccess(response);
      const data = response.data as { data?: { name?: string } };
      if (data.data?.name) {
        createdServiceDef = data.data.name;
      } else {
        createdServiceDef = TEST_SERVICE_DEF;
      }
    }
  );

  // Test: Activate Service Definition
  if (createdServiceDef) {
    await runner.runToolTest(
      'Activate Service Definition',
      'activate_cds_object',
      {
        objectType: 'SRVD',
        objectName: createdServiceDef,
      },
      (response) => {
        hasData(response);
      }
    );
  }

  // Test: Create Service Binding
  await runner.runToolTest(
    'Create Service Binding',
    'create_service_binding',
    {
      name: TEST_SERVICE_BIND,
      description: 'MCP Test Service Binding',
      serviceDefinition: createdServiceDef || TEST_SERVICE_DEF,
      bindingType: 'ODATA_V4',
      package: PACKAGE_NAME,
    },
    (response) => {
      hasData(response);
      hasSuccess(response);
      const data = response.data as { data?: { name?: string } };
      if (data.data?.name) {
        createdServiceBind = data.data.name;
      } else {
        createdServiceBind = TEST_SERVICE_BIND;
      }
    }
  );

  // Test: Activate Service Binding
  if (createdServiceBind) {
    await runner.runToolTest(
      'Activate Service Binding',
      'activate_cds_object',
      {
        objectType: 'SRVB',
        objectName: createdServiceBind,
      },
      (response) => {
        hasData(response);
      }
    );
  }

  // Test: Get Service Binding URL
  if (createdServiceBind) {
    await runner.runToolTest(
      'Get Service Binding URL',
      'get_service_binding_url',
      { serviceBindingName: createdServiceBind },
      (response) => {
        hasData(response);
        // URL may be empty if service is not published
      }
    );
  }

  // ============================================================
  // READ OPERATIONS (with standard SAP objects)
  // ============================================================

  // Test: Get CDS View (standard SAP object)
  await runner.runToolTest(
    'Get CDS View (I_COUNTRY)',
    'get_cds_view',
    { cdsViewName: 'I_COUNTRY' },
    (response) => {
      hasData(response);
      const data = response.data as { success?: boolean; data?: { name?: string } };
      if (data.success && data.data) {
        const viewName = data.data.name?.toUpperCase();
        if (viewName && viewName !== 'I_COUNTRY') {
          throw new Error(`Expected view name I_COUNTRY, got ${viewName}`);
        }
      }
    }
  );

  // Test: Get CDS Source (standard SAP object)
  await runner.runToolTest(
    'Get CDS Source (I_COUNTRY)',
    'get_cds_source',
    { cdsViewName: 'I_COUNTRY' },
    (response) => {
      hasData(response);
      const data = response.data as { success?: boolean; data?: string };
      if (data.success && data.data) {
        if (typeof data.data !== 'string') {
          throw new Error('Expected source code to be a string');
        }
      }
    }
  );

  // ============================================================
  // DELETE OPERATIONS (Cleanup)
  // ============================================================

  // Delete in reverse order of dependencies: Service Binding -> Service Definition -> CDS View

  // Test: Delete Service Binding
  if (createdServiceBind) {
    await runner.runToolTest(
      'Delete Service Binding',
      'delete_cds_object',
      {
        name: createdServiceBind,
        objectType: 'SRVB',
      },
      (response) => {
        hasData(response);
        hasSuccess(response);
      }
    );
  }

  // Test: Delete Service Definition
  if (createdServiceDef) {
    await runner.runToolTest(
      'Delete Service Definition',
      'delete_cds_object',
      {
        name: createdServiceDef,
        objectType: 'SRVD',
      },
      (response) => {
        hasData(response);
        hasSuccess(response);
      }
    );
  }

  // Test: Delete CDS View
  if (createdCdsView) {
    await runner.runToolTest(
      'Delete CDS View',
      'delete_cds_object',
      {
        name: createdCdsView,
        objectType: 'DDLS',
      },
      (response) => {
        hasData(response);
        hasSuccess(response);
      }
    );
  }
}

// Run the tests
runMCPTests('CDS Tools', runCDSToolsTests)
  .then(failedCount => {
    process.exit(failedCount > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });