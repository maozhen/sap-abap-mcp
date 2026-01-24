/**
 * Mock ADT Client for Unit Testing
 * Provides mock implementations of ADTClient methods
 */

import { ADTClient, ADTResponse, LockHandle, ADTClientConfig } from '../../src/clients/adt-client';

/**
 * Mock response builder
 */
export function createMockResponse<T = string>(
  data: T,
  status: number = 200,
  headers: Record<string, string> = {}
): ADTResponse<T> {
  return {
    data,
    status,
    headers,
    raw: typeof data === 'string' ? data : JSON.stringify(data),
  };
}

/**
 * Mock ADT Client class
 */
export class MockADTClient {
  // Mock method implementations
  get = jest.fn<Promise<ADTResponse<string>>, [string, unknown?]>();
  post = jest.fn<Promise<ADTResponse<string>>, [string, unknown?, unknown?]>();
  put = jest.fn<Promise<ADTResponse<string>>, [string, unknown?, unknown?]>();
  delete = jest.fn<Promise<ADTResponse<string>>, [string, unknown?]>();
  
  getObject = jest.fn<Promise<ADTResponse<string>>, [string]>();
  getObjectSource = jest.fn<Promise<string>, [string]>();
  updateObjectSource = jest.fn<Promise<void>, [string, string, string]>();
  
  lockObject = jest.fn<Promise<LockHandle>, [string]>();
  unlockObject = jest.fn<Promise<void>, [string, string]>();
  getActiveLock = jest.fn<LockHandle | undefined, [string]>();
  releaseAllLocks = jest.fn<Promise<void>, []>();
  
  activate = jest.fn<Promise<{ success: boolean; messages: Array<{ type: string; message: string }> }>, [string | string[], unknown?]>();
  checkSyntax = jest.fn<Promise<{ hasErrors: boolean; messages: Array<{ line?: number; column?: number; type: string; message: string }> }>, [string]>();
  
  searchObjects = jest.fn<Promise<Array<{ uri: string; name: string; type: string; package?: string }>>, [string, unknown?]>();
  getObjectMetadata = jest.fn<Promise<Record<string, unknown>>, [string]>();
  
  getTransportRequests = jest.fn<Promise<Array<{ number: string; description: string; owner: string; status: string }>>, [unknown?]>();
  
  testConnection = jest.fn<Promise<boolean>, []>();
  fetchCSRFToken = jest.fn<Promise<string>, []>();
  clearCSRFToken = jest.fn<void, []>();
  getConnectionInfo = jest.fn<{ host: string; client?: string; user: string }, []>();

  constructor() {
    // Set default implementations
    this.resetMocks();
  }

  /**
   * Reset all mocks to default implementations
   */
  resetMocks(): void {
    // Reset all mock functions
    this.get.mockReset();
    this.post.mockReset();
    this.put.mockReset();
    this.delete.mockReset();
    this.getObject.mockReset();
    this.getObjectSource.mockReset();
    this.updateObjectSource.mockReset();
    this.lockObject.mockReset();
    this.unlockObject.mockReset();
    this.getActiveLock.mockReset();
    this.releaseAllLocks.mockReset();
    this.activate.mockReset();
    this.checkSyntax.mockReset();
    this.searchObjects.mockReset();
    this.getObjectMetadata.mockReset();
    this.getTransportRequests.mockReset();
    this.testConnection.mockReset();
    this.fetchCSRFToken.mockReset();
    this.clearCSRFToken.mockReset();
    this.getConnectionInfo.mockReset();

    // Set default return values
    this.get.mockResolvedValue(createMockResponse(''));
    this.post.mockResolvedValue(createMockResponse(''));
    this.put.mockResolvedValue(createMockResponse(''));
    this.delete.mockResolvedValue(createMockResponse(''));
    this.getObject.mockResolvedValue(createMockResponse(''));
    this.getObjectSource.mockResolvedValue('');
    this.updateObjectSource.mockResolvedValue(undefined);
    this.lockObject.mockResolvedValue({
      lockHandle: 'mock-lock-handle',
      objectUri: '/sap/bc/adt/test',
      expiresAt: new Date(Date.now() + 600000),
    });
    this.unlockObject.mockResolvedValue(undefined);
    this.getActiveLock.mockReturnValue(undefined);
    this.releaseAllLocks.mockResolvedValue(undefined);
    this.activate.mockResolvedValue({ success: true, messages: [] });
    this.checkSyntax.mockResolvedValue({ hasErrors: false, messages: [] });
    this.searchObjects.mockResolvedValue([]);
    this.getObjectMetadata.mockResolvedValue({});
    this.getTransportRequests.mockResolvedValue([]);
    this.testConnection.mockResolvedValue(true);
    this.fetchCSRFToken.mockResolvedValue('mock-csrf-token');
    this.clearCSRFToken.mockReturnValue(undefined);
    this.getConnectionInfo.mockReturnValue({
      host: 'mock-host.sap.com',
      client: '100',
      user: 'TESTUSER',
    });
  }

  /**
   * Setup mock for successful POST with XML response
   */
  setupPostSuccess(responseXml: string): void {
    this.post.mockResolvedValue(createMockResponse(responseXml));
  }

  /**
   * Setup mock for failed POST with error
   */
  setupPostError(error: Error): void {
    this.post.mockRejectedValue(error);
  }

  /**
   * Setup mock for successful GET with XML response
   */
  setupGetSuccess(responseXml: string): void {
    this.get.mockResolvedValue(createMockResponse(responseXml));
  }

  /**
   * Setup mock for failed GET with error
   */
  setupGetError(error: Error): void {
    this.get.mockRejectedValue(error);
  }

  /**
   * Setup mock for successful activation
   */
  setupActivateSuccess(): void {
    this.activate.mockResolvedValue({ success: true, messages: [] });
  }

  /**
   * Setup mock for failed activation with messages
   */
  setupActivateFailure(messages: Array<{ type: string; message: string }>): void {
    this.activate.mockResolvedValue({ success: false, messages });
  }

  /**
   * Setup mock for syntax check
   */
  setupSyntaxCheck(hasErrors: boolean, messages: Array<{ line?: number; column?: number; type: string; message: string }> = []): void {
    this.checkSyntax.mockResolvedValue({ hasErrors, messages });
  }

  /**
   * Setup mock for getObject
   */
  setupGetObject(responseXml: string): void {
    this.getObject.mockResolvedValue(createMockResponse(responseXml));
  }
}

/**
 * Create mock ADT client instance
 */
export function createMockADTClient(): MockADTClient {
  return new MockADTClient();
}

/**
 * Type assertion helper to cast MockADTClient as ADTClient
 */
export function asMockADTClient(mock: MockADTClient): ADTClient {
  return mock as unknown as ADTClient;
}

/**
 * Sample XML responses for testing
 */
export const MockXMLResponses = {
  // Transport request list response
  transportRequestList: `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test Transport Request" tm:owner="TESTUSER" tm:status="D" tm:type="K" tm:target="QAS"/>
  <tm:request tm:number="DEVK900002" tm:desc="Another Request" tm:owner="TESTUSER" tm:status="R" tm:type="K"/>
</tm:root>`,

  // Transport request creation response
  transportRequestCreated: `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900003" tm:desc="New Transport" tm:owner="TESTUSER" tm:status="D" tm:type="K">
    <tm:task tm:number="DEVK900004" tm:desc="Task 1" tm:owner="TESTUSER" tm:status="D"/>
  </tm:request>
</tm:root>`,

  // Transport contents response
  transportContents: `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test Transport" tm:owner="TESTUSER" tm:status="D" tm:type="K">
    <tm:task tm:number="DEVK900002" tm:desc="Task 1" tm:owner="TESTUSER" tm:status="D">
      <tm:object tm:pgmid="R3TR" tm:type="CLAS" tm:name="ZCL_TEST"/>
      <tm:object tm:pgmid="R3TR" tm:type="TABL" tm:name="ZTEST_TABLE"/>
    </tm:task>
  </tm:request>
</tm:root>`,

  // Data element response
  dataElement: `<?xml version="1.0" encoding="UTF-8"?>
<dataElement xmlns="http://www.sap.com/adt/ddic/dataelements" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZTEST_DTEL</adtcore:name>
  <adtcore:description>Test Data Element</adtcore:description>
</dataElement>`,

  // Domain response
  domain: `<?xml version="1.0" encoding="UTF-8"?>
<domain xmlns="http://www.sap.com/adt/ddic/domains" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZTEST_DOMA</adtcore:name>
  <adtcore:description>Test Domain</adtcore:description>
</domain>`,

  // Table response
  table: `<?xml version="1.0" encoding="UTF-8"?>
<table xmlns="http://www.sap.com/adt/ddic/tables" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZTEST_TABLE</adtcore:name>
  <adtcore:description>Test Table</adtcore:description>
</table>`,

  // Class response
  abapClass: `<?xml version="1.0" encoding="UTF-8"?>
<class:abapClass xmlns:class="http://www.sap.com/adt/oo/classes" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZCL_TEST</adtcore:name>
  <adtcore:description>Test Class</adtcore:description>
</class:abapClass>`,

  // CDS view response
  cdsView: `<?xml version="1.0" encoding="UTF-8"?>
<ddl:ddlSource xmlns:ddl="http://www.sap.com/adt/ddl" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZTEST_CDS</adtcore:name>
  <adtcore:description>Test CDS View</adtcore:description>
</ddl:ddlSource>`,

  // Unit test results
  unitTestResults: `<?xml version="1.0" encoding="UTF-8"?>
<aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
  <program name="ZCL_TEST">
    <testClass name="LTC_TEST">
      <testMethod name="TEST_SUCCESS" executionTime="100" unit="ms" alerts="0"/>
      <testMethod name="TEST_FAILURE" executionTime="50" unit="ms" alerts="1">
        <alert kind="failure" severity="critical">
          <title>Assertion failed</title>
          <details>Expected 1, got 2</details>
        </alert>
      </testMethod>
    </testClass>
  </program>
</aunit:runResult>`,

  // System info response
  systemInfo: `<?xml version="1.0" encoding="UTF-8"?>
<sap:systemInfo xmlns:sap="http://www.sap.com/adt">
  <sap:systemId>DEV</sap:systemId>
  <sap:client>100</sap:client>
  <sap:release>756</sap:release>
  <sap:type>ABAP</sap:type>
</sap:systemInfo>`,

  // Activation success
  activationSuccess: `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:objectReference adtcore:uri="/sap/bc/adt/test" adtcore:name="ZTEST"/>
</adtcore:objectReferences>`,

  // Activation failure
  activationFailure: `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
  <message type="E">Syntax error in line 10</message>
</adtcore:objectReferences>`,

  // Empty response
  empty: '',
};

export default MockADTClient;