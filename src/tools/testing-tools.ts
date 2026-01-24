/**
 * Testing Tools Handler
 * Handles unit testing and code coverage operations
 */

import { ADTClient } from '../clients/adt-client';
import {
  ToolResponse,
  UnitTestResult,
  TestRunSummary,
  CodeCoverageResult,
  ADTObjectType,
  AssertionResult,
  RunUnitTestsInput,
} from '../types';
import { buildXML, parseXML, getAttribute, getElement } from '../utils/xml-parser';
import { Logger, logger as defaultLogger } from '../utils/logger';

// Input interfaces
export interface GetTestCoverageInput {
  objectName: string;
  objectType: ADTObjectType;
}

export interface GetTestResultsInput {
  runId: string;
}

export interface AnalyzeTestClassInput {
  className: string;
}

// Response interfaces
export interface TestClassAnalysis {
  className: string;
  testMethods: TestMethodInfo[];
  setupMethod?: string;
  teardownMethod?: string;
  fixtureClasses?: string[];
  riskLevel?: 'harmless' | 'dangerous' | 'critical';
  duration?: 'short' | 'medium' | 'long';
}

export interface TestMethodInfo {
  name: string;
  description?: string;
  forTesting: boolean;
  riskLevel?: string;
  duration?: string;
}

// ADT URI constants (relative paths - ADTClient.baseURL already includes /sap/bc/adt)
const TESTING_URI_PREFIX = '/abapunit';
const COVERAGE_URI_PREFIX = '/runtime/codecoverage';

export class TestingToolHandler {
  private readonly adtClient: ADTClient;
  private readonly logger: Logger;

  constructor(adtClient: ADTClient, logger?: Logger) {
    this.adtClient = adtClient;
    this.logger = logger ?? defaultLogger.child({ module: 'testing-tools' });
  }

  /**
   * Run unit tests for a specified object
   * Executes ABAP Unit tests and returns results
   */
  async runUnitTests(args: RunUnitTestsInput): Promise<ToolResponse<TestRunSummary>> {
    this.logger.info(`Running unit tests for: ${args.objectType}/${args.objectName}`);

    try {
      // Build the object URI based on type
      const objectUri = this.buildObjectUri(args.objectType, args.objectName);
      
      // Build test run request XML
      const requestXml = this.buildTestRunRequestXML(args);
      
      // Execute test run
      // SAP ADT ABAP Unit API accepts multiple content type versions
      // Use a broader Accept header to handle different SAP versions
      const response = await this.adtClient.post(
        `${TESTING_URI_PREFIX}/testruns`,
        requestXml,
        {
          headers: {
            'Content-Type': 'application/vnd.sap.adt.abapunit.testruns.v1+xml',
            'Accept': 'application/vnd.sap.adt.abapunit.testruns.v4+xml, application/vnd.sap.adt.abapunit.testruns.v3+xml, application/vnd.sap.adt.abapunit.testruns.v2+xml, application/vnd.sap.adt.abapunit.testruns.v1+xml, application/xml, */*',
          },
          params: args.withCoverage ? { withCoverage: 'true' } : undefined,
        }
      );

      // Parse test results
      const summary = this.parseTestRunResponse(response.raw || '');
      
      this.logger.info(
        `Unit tests completed: ${summary.passed} passed, ${summary.failed} failed, ${summary.errors} errors`
      );

      return {
        success: summary.failed === 0 && summary.errors === 0,
        data: summary,
        warnings: summary.failed > 0 || summary.errors > 0
          ? [`${summary.failed} test(s) failed, ${summary.errors} error(s) occurred`]
          : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to run unit tests for ${args.objectName}`, error);
      return this.createErrorResponse(
        'RUN_UNIT_TESTS_FAILED',
        `Failed to run unit tests: ${error}`,
        error
      );
    }
  }

  /**
   * Get code coverage for a specified object
   * Returns statement/branch coverage metrics
   */
  async getTestCoverage(args: GetTestCoverageInput): Promise<ToolResponse<CodeCoverageResult>> {
    this.logger.info(`Getting test coverage for: ${args.objectType}/${args.objectName}`);

    try {
      const objectUri = this.buildObjectUri(args.objectType, args.objectName);
      
      // Request coverage analysis
      const response = await this.adtClient.get(
        `${COVERAGE_URI_PREFIX}/results`,
        {
          headers: {
            'Accept': 'application/vnd.sap.adt.codecoverage.v1+xml',
          },
          params: {
            objectUri: objectUri,
          },
        }
      );

      // Parse coverage results
      const coverage = this.parseCoverageResponse(response.raw || '', args);
      
      this.logger.info(
        `Coverage for ${args.objectName}: ${coverage.statementCoverage}% statements covered`
      );

      return { success: true, data: coverage };
    } catch (error) {
      this.logger.error(`Failed to get test coverage for ${args.objectName}`, error);
      return this.createErrorResponse(
        'GET_COVERAGE_FAILED',
        `Failed to get test coverage: ${error}`,
        error
      );
    }
  }

  /**
   * Get test results for a previous test run
   * Retrieves detailed results by run ID
   */
  async getTestResults(args: GetTestResultsInput): Promise<ToolResponse<TestRunSummary>> {
    this.logger.info(`Getting test results for run: ${args.runId}`);

    try {
      const response = await this.adtClient.get(
        `${TESTING_URI_PREFIX}/testruns/${args.runId}`,
        {
          headers: {
            'Accept': 'application/vnd.sap.adt.abapunit.testruns.v1+xml',
          },
        }
      );

      // Parse test results
      const summary = this.parseTestRunResponse(response.raw || '');
      
      this.logger.info(`Retrieved results for run ${args.runId}: ${summary.totalTests} tests`);

      return { success: true, data: summary };
    } catch (error) {
      this.logger.error(`Failed to get test results for run ${args.runId}`, error);
      return this.createErrorResponse(
        'GET_TEST_RESULTS_FAILED',
        `Failed to get test results: ${error}`,
        error
      );
    }
  }

  /**
   * Analyze a test class structure
   * Returns information about test methods, fixtures, and configuration
   */
  async analyzeTestClass(args: AnalyzeTestClassInput): Promise<ToolResponse<TestClassAnalysis>> {
    this.logger.info(`Analyzing test class: ${args.className}`);

    try {
      // Get class metadata
      const classUri = `/oo/classes/${args.className.toLowerCase()}`;
      const response = await this.adtClient.getObject(classUri);
      
      // Parse class definition to extract test information
      const analysis = this.parseTestClassAnalysis(response.data, args.className);
      
      this.logger.info(
        `Test class ${args.className} analyzed: ${analysis.testMethods.length} test methods found`
      );

      return { success: true, data: analysis };
    } catch (error) {
      this.logger.error(`Failed to analyze test class ${args.className}`, error);
      return this.createErrorResponse(
        'ANALYZE_TEST_CLASS_FAILED',
        `Failed to analyze test class: ${error}`,
        error
      );
    }
  }

  // ============================================
  // XML Building Methods
  // ============================================

  /**
   * Build test run request XML
   * Uses adtcore:objectSets structure as required by SAP ADT ABAP Unit API
   */
  private buildTestRunRequestXML(args: RunUnitTestsInput): string {
    const objectUri = this.buildObjectUri(args.objectType, args.objectName);
    const fullUri = `/sap/bc/adt${objectUri}`;
    
    // Build the objectSets structure required by SAP ADT
    // SAP ADT expects: adtcore:objectSets > adtcore:objectSet > adtcore:objectTypeSet > adtcore:object
    const obj = {
      'aunit:runConfiguration': {
        '@_xmlns:aunit': 'http://www.sap.com/adt/aunit',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        'aunit:options': {
          'aunit:uriType': { '@_value': 'semantic' },
          'aunit:testDeterminationStrategy': { '@_sameProgram': 'true', '@_assignedTests': 'false' },
          'aunit:riskLevel': { '@_harmless': 'true', '@_dangerous': 'true', '@_critical': 'true' },
          'aunit:duration': { '@_short': 'true', '@_medium': 'true', '@_long': 'true' },
          ...(args.withCoverage && {
            'aunit:coverageAnalysis': {
              '@_active': 'true',
              'aunit:type': { '@_value': 'statement' },
            },
          }),
        },
        'adtcore:objectSets': {
          'adtcore:objectSet': {
            '@_kind': 'inclusive',
            'adtcore:objectTypeSet': {
              '@_objectType': args.objectType,
              'adtcore:object': this.buildObjectElement(args, fullUri),
            },
          },
        },
      },
    };

    return buildXML(obj);
  }

  /**
   * Build object element for test run request
   * Handles optional test methods filter
   */
  private buildObjectElement(args: RunUnitTestsInput, fullUri: string): Record<string, unknown> | Record<string, unknown>[] {
    const baseObject: Record<string, unknown> = {
      '@_adtcore:uri': fullUri,
      '@_adtcore:name': args.objectName.toUpperCase(),
    };

    // If specific test methods are requested, add them as nested elements
    if (args.testMethods?.length) {
      // For specific methods, we may need to specify them separately
      // SAP ADT may require method-level objects or filter differently
      baseObject['aunit:testMethods'] = {
        'aunit:testMethod': args.testMethods.map(m => ({ '@_name': m })),
      };
    }

    return baseObject;
  }

  // ============================================
  // Response Parsing Methods
  // ============================================

  /**
   * Parse test run response XML into TestRunSummary
   */
  private parseTestRunResponse(xml: string): TestRunSummary {
    const parsed = parseXML<Record<string, unknown>>(xml);
    const results: UnitTestResult[] = [];
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let errors = 0;
    let totalDuration = 0;

    // Find all test results in the response
    const testResults = this.findElements(parsed, 'testClass');
    
    for (const testClass of testResults) {
      const classRecord = testClass as Record<string, unknown>;
      const className = getAttribute(classRecord, 'name') || 'Unknown';
      
      // Find test methods within the class
      const methods = this.findElements(classRecord, 'testMethod');
      
      for (const method of methods) {
        const methodRecord = method as Record<string, unknown>;
        const methodName = getAttribute(methodRecord, 'name') || 'Unknown';
        const executionTime = parseInt(getAttribute(methodRecord, 'executionTime') || '0', 10);
        
        // Determine test status
        const alerts = this.findElements(methodRecord, 'alert');
        let status: 'passed' | 'failed' | 'skipped' | 'error' = 'passed';
        let message: string | undefined;
        let details: string | undefined;
        const assertions: AssertionResult[] = [];

        for (const alert of alerts) {
          const alertRecord = alert as Record<string, unknown>;
          const severity = getAttribute(alertRecord, 'severity') || '';
          const alertMessage = this.getTextContent(alertRecord, 'title') || 
                               this.getTextContent(alertRecord, 'message') || '';
          const alertDetails = this.getTextContent(alertRecord, 'details') || '';

          if (severity === 'critical' || severity === 'fatal') {
            status = 'error';
            errors++;
          } else if (severity === 'tolerable' || severity === 'warning') {
            status = 'failed';
            failed++;
          }

          message = alertMessage;
          details = alertDetails;

          // Parse assertion results if available
          const assertionElements = this.findElements(alertRecord, 'assertion');
          for (const assertion of assertionElements) {
            const assertRecord = assertion as Record<string, unknown>;
            assertions.push({
              type: getAttribute(assertRecord, 'type') || 'unknown',
              expected: getAttribute(assertRecord, 'expected'),
              actual: getAttribute(assertRecord, 'actual'),
              message: this.getTextContent(assertRecord, 'message'),
              passed: getAttribute(assertRecord, 'passed') === 'true',
            });
          }
        }

        if (status === 'passed') {
          passed++;
        }

        totalDuration += executionTime;

        results.push({
          className,
          methodName,
          status,
          duration: executionTime,
          message,
          details,
          assertions: assertions.length > 0 ? assertions : undefined,
        });
      }
    }

    return {
      totalTests: results.length,
      passed,
      failed,
      skipped,
      errors,
      duration: totalDuration,
      timestamp: new Date(),
      results,
    };
  }

  /**
   * Parse coverage response XML into CodeCoverageResult
   */
  private parseCoverageResponse(xml: string, args: GetTestCoverageInput): CodeCoverageResult {
    const parsed = parseXML<Record<string, unknown>>(xml);
    
    // Find coverage data in response
    const coverageNodes = this.findElements(parsed, 'coverage');
    const coverageNode = coverageNodes[0] as Record<string, unknown> | undefined;

    let statementCoverage = 0;
    let branchCoverage: number | undefined;
    let procedureCoverage: number | undefined;
    let coveredStatements = 0;
    let totalStatements = 0;
    const uncoveredLines: number[] = [];

    if (coverageNode) {
      // Parse statement coverage
      const statementNodes = this.findElements(coverageNode, 'statement');
      const statementNode = statementNodes[0] as Record<string, unknown> | undefined;
      if (statementNode) {
        coveredStatements = parseInt(getAttribute(statementNode, 'covered') || '0', 10);
        totalStatements = parseInt(getAttribute(statementNode, 'total') || '0', 10);
        statementCoverage = totalStatements > 0 
          ? Math.round((coveredStatements / totalStatements) * 100) 
          : 0;
      }

      // Parse branch coverage if available
      const branchNodes = this.findElements(coverageNode, 'branch');
      const branchNode = branchNodes[0] as Record<string, unknown> | undefined;
      if (branchNode) {
        const coveredBranches = parseInt(getAttribute(branchNode, 'covered') || '0', 10);
        const totalBranches = parseInt(getAttribute(branchNode, 'total') || '0', 10);
        branchCoverage = totalBranches > 0 
          ? Math.round((coveredBranches / totalBranches) * 100) 
          : 0;
      }

      // Parse procedure coverage if available
      const procedureNodes = this.findElements(coverageNode, 'procedure');
      const procedureNode = procedureNodes[0] as Record<string, unknown> | undefined;
      if (procedureNode) {
        const coveredProcedures = parseInt(getAttribute(procedureNode, 'covered') || '0', 10);
        const totalProcedures = parseInt(getAttribute(procedureNode, 'total') || '0', 10);
        procedureCoverage = totalProcedures > 0 
          ? Math.round((coveredProcedures / totalProcedures) * 100) 
          : 0;
      }

      // Parse uncovered lines
      const uncoveredNodes = this.findElements(coverageNode, 'uncoveredLine');
      for (const uncovered of uncoveredNodes) {
        const lineNum = parseInt(getAttribute(uncovered as Record<string, unknown>, 'line') || '0', 10);
        if (lineNum > 0) {
          uncoveredLines.push(lineNum);
        }
      }
    }

    return {
      objectName: args.objectName.toUpperCase(),
      objectType: args.objectType,
      statementCoverage,
      branchCoverage,
      procedureCoverage,
      coveredStatements,
      totalStatements,
      uncoveredLines: uncoveredLines.length > 0 ? uncoveredLines : undefined,
    };
  }

  /**
   * Parse test class analysis from class metadata
   */
  private parseTestClassAnalysis(xml: string, className: string): TestClassAnalysis {
    const parsed = parseXML<Record<string, unknown>>(xml);
    const testMethods: TestMethodInfo[] = [];
    let setupMethod: string | undefined;
    let teardownMethod: string | undefined;
    const fixtureClasses: string[] = [];
    let riskLevel: 'harmless' | 'dangerous' | 'critical' | undefined;
    let duration: 'short' | 'medium' | 'long' | undefined;

    // Find class definition - look for the class node that has a 'name' attribute
    // XML structure may have nested class elements: <class><class name="..." riskLevel="...">...</class></class>
    const classNodes = this.findElements(parsed, 'class');
    // Find the class node that has a 'name' attribute (the inner one with actual class info)
    const classNode = classNodes.find(node => {
      const record = node as Record<string, unknown>;
      return getAttribute(record, 'name') !== undefined;
    }) as Record<string, unknown> | undefined;

    if (classNode) {
      // Get class-level test settings
      riskLevel = this.parseRiskLevel(getAttribute(classNode, 'riskLevel'));
      duration = this.parseDuration(getAttribute(classNode, 'duration'));

      // Find all methods
      const methodNodes = this.findElements(classNode, 'method');
      
      for (const method of methodNodes) {
        const methodRecord = method as Record<string, unknown>;
        const methodName = getAttribute(methodRecord, 'name') || '';
        const isForTesting = getAttribute(methodRecord, 'forTesting') === 'true';
        
        // Check for special methods
        if (methodName.toUpperCase() === 'SETUP' || methodName.toUpperCase() === 'CLASS_SETUP') {
          setupMethod = methodName;
        } else if (methodName.toUpperCase() === 'TEARDOWN' || methodName.toUpperCase() === 'CLASS_TEARDOWN') {
          teardownMethod = methodName;
        } else if (isForTesting) {
          testMethods.push({
            name: methodName,
            description: getAttribute(methodRecord, 'description'),
            forTesting: true,
            riskLevel: getAttribute(methodRecord, 'riskLevel'),
            duration: getAttribute(methodRecord, 'duration'),
          });
        }
      }

      // Find fixture classes (used classes with test fixtures)
      const usedClasses = this.findElements(classNode, 'usedClass');
      for (const usedClass of usedClasses) {
        const usedClassName = getAttribute(usedClass as Record<string, unknown>, 'name');
        if (usedClassName) {
          fixtureClasses.push(usedClassName);
        }
      }
    }

    return {
      className: className.toUpperCase(),
      testMethods,
      setupMethod,
      teardownMethod,
      fixtureClasses: fixtureClasses.length > 0 ? fixtureClasses : undefined,
      riskLevel,
      duration,
    };
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Build object URI based on type
   * Returns relative paths (ADTClient.baseURL already includes /sap/bc/adt)
   */
  private buildObjectUri(objectType: ADTObjectType, objectName: string): string {
    const name = objectName.toLowerCase();
    
    switch (objectType) {
      case 'CLAS':
        return `/oo/classes/${name}`;
      case 'INTF':
        return `/oo/interfaces/${name}`;
      case 'PROG':
        return `/programs/programs/${name}`;
      case 'FUGR':
        return `/functions/groups/${name}`;
      case 'FUNC':
        return `/functions/groups/${name}/fmodules/${name}`;
      case 'DDLS':
        return `/ddic/ddl/sources/${name}`;
      default:
        return `/repository/informationsystem/objects/${objectType}/${name}`;
    }
  }

  /**
   * Parse risk level string to type
   */
  private parseRiskLevel(value?: string): 'harmless' | 'dangerous' | 'critical' | undefined {
    switch (value?.toLowerCase()) {
      case 'harmless':
        return 'harmless';
      case 'dangerous':
        return 'dangerous';
      case 'critical':
        return 'critical';
      default:
        return undefined;
    }
  }

  /**
   * Parse duration string to type
   */
  private parseDuration(value?: string): 'short' | 'medium' | 'long' | undefined {
    switch (value?.toLowerCase()) {
      case 'short':
        return 'short';
      case 'medium':
        return 'medium';
      case 'long':
        return 'long';
      default:
        return undefined;
    }
  }

  /**
   * Find elements in parsed XML by tag name (handles namespaces)
   */
  private findElements(obj: unknown, tagName: string): unknown[] {
    const results: unknown[] = [];

    const search = (current: unknown): void => {
      if (!current || typeof current !== 'object') return;

      if (Array.isArray(current)) {
        for (const item of current) {
          search(item);
        }
        return;
      }

      const record = current as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        // Check if key matches tag name (with or without namespace prefix)
        if (key === tagName || key.endsWith(`:${tagName}`)) {
          const value = record[key];
          if (Array.isArray(value)) {
            results.push(...value);
          } else {
            results.push(value);
          }
        }
        // Recurse into nested objects
        search(record[key]);
      }
    };

    search(obj);
    return results;
  }

  /**
   * Get text content from XML element
   */
  private getTextContent(obj: Record<string, unknown>, tagName: string): string | undefined {
    const elements = this.findElements(obj, tagName);
    if (elements.length > 0) {
      const element = elements[0];
      if (typeof element === 'string') {
        return element;
      }
      if (typeof element === 'object' && element !== null) {
        const record = element as Record<string, unknown>;
        return (record['#text'] as string) || (record['_text'] as string);
      }
    }
    return undefined;
  }

  /**
   * Create error response
   */
  private createErrorResponse<T>(code: string, message: string, error?: unknown): ToolResponse<T> {
    return {
      success: false,
      error: {
        code,
        message,
        details: error instanceof Error ? error.message : String(error),
        innerError: error instanceof Error ? error : undefined,
      },
    };
  }
}

export default TestingToolHandler;