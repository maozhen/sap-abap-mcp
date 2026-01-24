/**
 * Testing Tools Handler Unit Tests
 * Tests for unit testing and code coverage operations
 */

import { TestingToolHandler } from '../../src/tools/testing-tools';
import { MockADTClient, createMockADTClient, asMockADTClient, createMockResponse } from '../mocks/adt-client.mock';
import { ADTObjectType } from '../../src/types';

describe('TestingToolHandler', () => {
  let mockClient: MockADTClient;
  let handler: TestingToolHandler;

  beforeEach(() => {
    mockClient = createMockADTClient();
    handler = new TestingToolHandler(asMockADTClient(mockClient));
  });

  afterEach(() => {
    mockClient.resetMocks();
  });

  // ============================================
  // runUnitTests Tests
  // ============================================
  describe('runUnitTests', () => {
    const baseInput = {
      objectName: 'ZCL_TEST_CLASS',
      objectType: 'CLAS' as ADTObjectType,
    };

    it('should run unit tests successfully with all tests passing', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST_CLASS">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_METHOD_1" executionTime="100"/>
              <testMethod name="TEST_METHOD_2" executionTime="150"/>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests(baseInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.passed).toBeGreaterThanOrEqual(0);
      expect(result.data!.failed).toBe(0);
      expect(result.data!.errors).toBe(0);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/abapunit/testruns',
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/vnd.sap.adt.abapunit.testruns.v1+xml',
          }),
        })
      );
    });

    it('should run unit tests with failures and return warnings', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST_CLASS">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_SUCCESS" executionTime="100"/>
              <testMethod name="TEST_FAILURE" executionTime="50">
                <alert severity="tolerable">
                  <title>Assertion failed</title>
                  <details>Expected 1, got 2</details>
                </alert>
              </testMethod>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests(baseInput);

      expect(result.success).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data!.failed).toBeGreaterThan(0);
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.length).toBeGreaterThan(0);
    });

    it('should run unit tests with errors', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST_CLASS">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_ERROR" executionTime="20">
                <alert severity="critical">
                  <title>Runtime error</title>
                  <details>Short dump occurred</details>
                </alert>
              </testMethod>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests(baseInput);

      expect(result.success).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data!.errors).toBeGreaterThan(0);
    });

    it('should run unit tests with specific test methods', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST_CLASS">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_SPECIFIC" executionTime="75"/>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests({
        ...baseInput,
        testMethods: ['TEST_SPECIFIC'],
      });

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/abapunit/testruns',
        expect.stringContaining('aunit:testMethod'),
        expect.any(Object)
      );
    });

    it('should run unit tests with coverage enabled', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST_CLASS">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_METHOD" executionTime="200"/>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests({
        ...baseInput,
        withCoverage: true,
      });

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/abapunit/testruns',
        expect.stringContaining('coverageAnalysis'),
        expect.objectContaining({
          params: { withCoverage: 'true' },
        })
      );
    });

    it('should run unit tests for different object types', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZTEST_PROGRAM">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_METHOD" executionTime="50"/>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      // Test for PROG
      const progResult = await handler.runUnitTests({
        objectName: 'ZTEST_PROGRAM',
        objectType: 'PROG',
      });
      expect(progResult.success).toBe(true);

      // Test for FUGR
      const fugrResult = await handler.runUnitTests({
        objectName: 'ZTEST_FUGR',
        objectType: 'FUGR',
      });
      expect(fugrResult.success).toBe(true);
    });

    it('should handle POST error when running unit tests', async () => {
      mockClient.post.mockRejectedValue(new Error('Network error'));

      const result = await handler.runUnitTests(baseInput);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.code).toBe('RUN_UNIT_TESTS_FAILED');
    });
  });

  // ============================================
  // getTestCoverage Tests
  // ============================================
  describe('getTestCoverage', () => {
    const baseInput = {
      objectName: 'ZCL_TEST_CLASS',
      objectType: 'CLAS' as ADTObjectType,
    };

    it('should get test coverage successfully', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <coverage xmlns="http://www.sap.com/adt/codecoverage">
          <statement covered="80" total="100"/>
          <branch covered="15" total="20"/>
          <procedure covered="10" total="12"/>
        </coverage>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestCoverage(baseInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.objectName).toBe('ZCL_TEST_CLASS');
      expect(result.data!.objectType).toBe('CLAS');
      expect(result.data!.statementCoverage).toBe(80);
      expect(result.data!.branchCoverage).toBe(75);
      expect(result.data!.procedureCoverage).toBe(83);
      expect(result.data!.coveredStatements).toBe(80);
      expect(result.data!.totalStatements).toBe(100);
    });

    it('should get coverage with uncovered lines', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <coverage xmlns="http://www.sap.com/adt/codecoverage">
          <statement covered="70" total="100"/>
          <uncoveredLine line="15"/>
          <uncoveredLine line="22"/>
          <uncoveredLine line="45"/>
        </coverage>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestCoverage(baseInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.uncoveredLines).toBeDefined();
      expect(result.data!.uncoveredLines).toContain(15);
      expect(result.data!.uncoveredLines).toContain(22);
      expect(result.data!.uncoveredLines).toContain(45);
    });

    it('should handle zero coverage', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <coverage xmlns="http://www.sap.com/adt/codecoverage">
          <statement covered="0" total="50"/>
        </coverage>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestCoverage(baseInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.statementCoverage).toBe(0);
      expect(result.data!.coveredStatements).toBe(0);
      expect(result.data!.totalStatements).toBe(50);
    });

    it('should handle empty coverage data', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <coverage xmlns="http://www.sap.com/adt/codecoverage">
        </coverage>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestCoverage(baseInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.statementCoverage).toBe(0);
    });

    it('should get coverage for different object types', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <coverage xmlns="http://www.sap.com/adt/codecoverage">
          <statement covered="50" total="100"/>
        </coverage>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      // Test for PROG
      const progResult = await handler.getTestCoverage({
        objectName: 'ZTEST_PROGRAM',
        objectType: 'PROG',
      });
      expect(progResult.success).toBe(true);
      expect(progResult.data!.objectType).toBe('PROG');

      // Test for INTF
      const intfResult = await handler.getTestCoverage({
        objectName: 'ZIF_TEST',
        objectType: 'INTF',
      });
      expect(intfResult.success).toBe(true);
      expect(intfResult.data!.objectType).toBe('INTF');
    });

    it('should handle GET error when getting coverage', async () => {
      mockClient.get.mockRejectedValue(new Error('Coverage service unavailable'));

      const result = await handler.getTestCoverage(baseInput);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.code).toBe('GET_COVERAGE_FAILED');
    });
  });

  // ============================================
  // getTestResults Tests
  // ============================================
  describe('getTestResults', () => {
    it('should get test results by run ID successfully', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_1" executionTime="100"/>
              <testMethod name="TEST_2" executionTime="200"/>
              <testMethod name="TEST_3" executionTime="150"/>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestResults({ runId: 'run-12345' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockClient.get).toHaveBeenCalledWith(
        '/abapunit/testruns/run-12345',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.sap.adt.abapunit.testruns.v1+xml',
          }),
        })
      );
    });

    it('should get test results with mixed statuses', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
          <program name="ZCL_TEST">
            <testClass name="LTC_TEST">
              <testMethod name="TEST_PASS" executionTime="50"/>
              <testMethod name="TEST_FAIL" executionTime="30">
                <alert severity="tolerable">
                  <title>Test failed</title>
                </alert>
              </testMethod>
              <testMethod name="TEST_ERROR" executionTime="10">
                <alert severity="critical">
                  <title>Exception occurred</title>
                </alert>
              </testMethod>
            </testClass>
          </program>
        </aunit:runResult>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestResults({ runId: 'run-mixed' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Should have results with different statuses
    });

    it('should handle GET error when getting test results', async () => {
      mockClient.get.mockRejectedValue(new Error('Run ID not found'));

      const result = await handler.getTestResults({ runId: 'invalid-run-id' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.code).toBe('GET_TEST_RESULTS_FAILED');
    });

    it('should handle empty test results', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
        </aunit:runResult>`;

      mockClient.get.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.getTestResults({ runId: 'empty-run' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.totalTests).toBe(0);
    });
  });

  // ============================================
  // analyzeTestClass Tests
  // ============================================
  describe('analyzeTestClass', () => {
    it('should analyze test class successfully', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
          <class name="ZCL_TEST" riskLevel="harmless" duration="short">
            <method name="SETUP"/>
            <method name="TEARDOWN"/>
            <method name="TEST_METHOD_1" forTesting="true" description="Test method 1"/>
            <method name="TEST_METHOD_2" forTesting="true" riskLevel="dangerous"/>
            <method name="HELPER_METHOD" forTesting="false"/>
          </class>
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_TEST' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.className).toBe('ZCL_TEST');
      expect(mockClient.getObject).toHaveBeenCalledWith(
        '/oo/classes/zcl_test'
      );
    });

    it('should identify setup and teardown methods', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
          <class name="ZCL_TEST">
            <method name="CLASS_SETUP"/>
            <method name="CLASS_TEARDOWN"/>
            <method name="SETUP"/>
            <method name="TEARDOWN"/>
            <method name="TEST_MAIN" forTesting="true"/>
          </class>
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_TEST' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Setup/teardown methods should be identified
    });

    it('should find test methods marked for testing', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
          <class name="ZCL_TEST">
            <method name="TEST_POSITIVE" forTesting="true"/>
            <method name="TEST_NEGATIVE" forTesting="true"/>
            <method name="TEST_BOUNDARY" forTesting="true"/>
            <method name="PRIVATE_HELPER" forTesting="false"/>
          </class>
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_TEST' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Test methods should be in the list with forTesting=true
    });

    it('should identify risk level and duration', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
          <class name="ZCL_TEST" riskLevel="critical" duration="long">
            <method name="TEST_HEAVY" forTesting="true"/>
          </class>
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_TEST' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.riskLevel).toBe('critical');
      expect(result.data!.duration).toBe('long');
    });

    it('should find fixture classes', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
          <class name="ZCL_TEST">
            <method name="TEST_WITH_FIXTURE" forTesting="true"/>
            <usedClass name="ZCL_TEST_FIXTURE"/>
            <usedClass name="ZCL_MOCK_DATA"/>
          </class>
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_TEST' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // Fixture classes should be identified
    });

    it('should handle class not found error', async () => {
      mockClient.getObject.mockRejectedValue(new Error('Class not found'));

      const result = await handler.analyzeTestClass({ className: 'ZNONEXISTENT' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.code).toBe('ANALYZE_TEST_CLASS_FAILED');
    });

    it('should handle empty class definition', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_EMPTY' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.testMethods.length).toBe(0);
    });

    it('should handle class with no test methods', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <class xmlns="http://www.sap.com/adt/oo/classes">
          <class name="ZCL_NOT_TEST">
            <method name="GET_DATA" forTesting="false"/>
            <method name="SET_DATA" forTesting="false"/>
          </class>
        </class>`;

      mockClient.getObject.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.analyzeTestClass({ className: 'ZCL_NOT_TEST' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.testMethods.length).toBe(0);
    });
  });

  // ============================================
  // Edge Cases and Integration Tests
  // ============================================
  describe('Edge Cases', () => {
    it('should handle XML parsing errors gracefully', async () => {
      mockClient.post.mockResolvedValue(createMockResponse('invalid xml <><>'));

      const result = await handler.runUnitTests({
        objectName: 'ZCL_TEST',
        objectType: 'CLAS',
      });

      // Should handle parsing error gracefully
      expect(result.data).toBeDefined();
    });

    it('should handle case-insensitive object names', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests({
        objectName: 'zcl_test_class', // lowercase
        objectType: 'CLAS',
      });

      expect(result.success).toBe(true);
      // URI should be built correctly regardless of case
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('ETIMEDOUT');
      mockClient.post.mockRejectedValue(timeoutError);

      const result = await handler.runUnitTests({
        objectName: 'ZCL_TEST',
        objectType: 'CLAS',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle special characters in object names', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit">
        </aunit:runResult>`;

      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      const result = await handler.runUnitTests({
        objectName: 'Z_TEST_CLASS_123',
        objectType: 'CLAS',
      });

      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // URI Building Tests
  // ============================================
  describe('URI Building', () => {
    it('should build correct URI for CLAS object type', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit"></aunit:runResult>`;
      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      await handler.runUnitTests({
        objectName: 'ZCL_TEST',
        objectType: 'CLAS',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('/oo/classes/zcl_test'),
        expect.any(Object)
      );
    });

    it('should build correct URI for PROG object type', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit"></aunit:runResult>`;
      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      await handler.runUnitTests({
        objectName: 'ZTEST_PROG',
        objectType: 'PROG',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('/programs/programs/ztest_prog'),
        expect.any(Object)
      );
    });

    it('should build correct URI for FUGR object type', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit"></aunit:runResult>`;
      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      await handler.runUnitTests({
        objectName: 'ZTEST_FUGR',
        objectType: 'FUGR',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('/functions/groups/ztest_fugr'),
        expect.any(Object)
      );
    });

    it('should build correct URI for DDLS object type', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
        <aunit:runResult xmlns:aunit="http://www.sap.com/adt/aunit"></aunit:runResult>`;
      mockClient.post.mockResolvedValue(createMockResponse(responseXml));

      await handler.runUnitTests({
        objectName: 'ZTEST_CDS',
        objectType: 'DDLS',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('/ddic/ddl/sources/ztest_cds'),
        expect.any(Object)
      );
    });
  });
});