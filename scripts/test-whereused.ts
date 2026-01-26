/**
 * Test script for Where Used functionality
 * This script tests the whereUsed API to identify issues with the implementation
 */

import { ADTClient } from '../src/clients/adt-client';
import { ProgramToolHandler } from '../src/tools/program-tools';
import { Logger, logger as defaultLogger } from '../src/utils/logger';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const logger = defaultLogger.child({ module: 'test-whereused' });

async function main() {
  // Build connection parameters from environment variables
  const host = process.env.SAP_HOST;
  const port = process.env.SAP_PORT;
  const username = process.env.SAP_USER;
  const password = process.env.SAP_PASSWORD;
  const client = process.env.SAP_CLIENT;
  const useTls = process.env.SAP_USE_TLS === 'true';
  const allowInsecure = process.env.SAP_ALLOW_INSECURE === 'true';

  if (!host || !username || !password) {
    console.error('Missing required environment variables: SAP_HOST, SAP_USER, SAP_PASSWORD');
    console.error('Optional: SAP_PORT, SAP_CLIENT, SAP_USE_TLS, SAP_ALLOW_INSECURE');
    process.exit(1);
  }

  const baseUrl = `${useTls ? 'https' : 'http'}://${host}${port ? ':' + port : ''}`;

  console.log('='.repeat(60));
  console.log('Where Used Test Script');
  console.log('='.repeat(60));
  console.log(`SAP Host: ${host}`);
  console.log(`SAP Port: ${port || 'default'}`);
  console.log(`Use TLS: ${useTls}`);
  console.log(`Client: ${client || 'default'}`);
  console.log(`Base URL: ${baseUrl}`);
  console.log('');

  // Create ADT client
  const adtClient = new ADTClient({
    connection: {
      host,
      https: useTls,
      port: port ? parseInt(port, 10) : undefined,
      username,
      password,
      client: client || '',
      allowInsecure,
    },
  });

  // Create program tool handler
  const programTools = new ProgramToolHandler(adtClient);

  // Test cases - use well-known SAP objects
  const testCases = [
    {
      name: 'Data Element STRING',
      objectUri: '/sap/bc/adt/ddic/dataelements/string',
      objectName: 'STRING',
      objectType: 'DTEL' as const,
    },
    {
      name: 'Class CL_ABAP_CONV_CODEPAGE',
      objectUri: '/sap/bc/adt/oo/classes/cl_abap_conv_codepage',
      objectName: 'CL_ABAP_CONV_CODEPAGE',
      objectType: 'CLAS' as const,
    },
    {
      name: 'Table MARA',
      objectUri: '/sap/bc/adt/ddic/tables/mara',
      objectName: 'MARA',
      objectType: 'TABL' as const,
    },
  ];

  for (const testCase of testCases) {
    console.log('-'.repeat(60));
    console.log(`Test: ${testCase.name}`);
    console.log(`URI: ${testCase.objectUri}`);
    console.log(`Object: ${testCase.objectName} (${testCase.objectType})`);
    console.log('');

    try {
      // First, let's test the raw scope request
      console.log('Step 1: Testing scope request...');
      
      const scopeRequestXml = buildScopeRequestXML();
      console.log('Scope Request XML:');
      console.log(scopeRequestXml);
      console.log('');

      // Make scope request
      const scopeResponse = await adtClient.post(
        '/repository/informationsystem/usageReferences/scope',
        scopeRequestXml,
        {
          params: { uri: testCase.objectUri },
          headers: {
            'Content-Type': 'application/vnd.sap.adt.repository.usagereferences.scope.request.v1+xml',
            'Accept': 'application/vnd.sap.adt.repository.usagereferences.scope.response.v1+xml',
          },
        }
      );

      console.log('Scope Response Status:', scopeResponse.status);
      console.log('Scope Response:');
      console.log(scopeResponse.raw?.substring(0, 2000) || 'No response body');
      console.log('');

      // Step 2: Parse scope response and build query request manually
      console.log('Step 2: Parsing scope response and building query request...');
      
      const scopeData = parseScopeResponse(scopeResponse.raw || '');
      console.log('Parsed scope data:');
      console.log(JSON.stringify(scopeData, null, 2));
      console.log('');
      
      // Step 3: Build and execute query request manually
      console.log('Step 3: Executing query request manually...');
      
      const queryRequestXml = buildQueryRequestXML(scopeData);
      console.log('Query Request XML:');
      console.log(queryRequestXml);
      console.log('');
      
      const queryResponse = await adtClient.post(
        '/repository/informationsystem/usageReferences',
        queryRequestXml,
        {
          params: { uri: testCase.objectUri },
          headers: {
            'Content-Type': 'application/vnd.sap.adt.repository.usagereferences.request.v1+xml',
            'Accept': 'application/vnd.sap.adt.repository.usagereferences.result.v1+xml',
          },
        }
      );
      
      console.log('Query Response Status:', queryResponse.status);
      console.log('Query Response (first 3000 chars):');
      console.log(queryResponse.raw?.substring(0, 3000) || 'No response body');
      console.log('');

      // Step 4: Execute where used query using ProgramToolHandler
      console.log('Step 4: Executing whereUsed through ProgramToolHandler...');
      
      const result = await programTools.whereUsed({
        objectUri: testCase.objectUri,
        objectName: testCase.objectName,
        objectType: testCase.objectType,
      });

      console.log('ProgramToolHandler Result:', JSON.stringify(result, null, 2));
      console.log('');

      if (result.success && result.data) {
        console.log(`Found ${result.data.usages.length} usages:`);
        for (const usage of result.data.usages.slice(0, 10)) {
          console.log(`  - ${usage.objectName} (${usage.objectType}): ${usage.usageType}`);
        }
        if (result.data.usages.length > 10) {
          console.log(`  ... and ${result.data.usages.length - 10} more`);
        }
      } else {
        console.log('Where Used failed:', result.error);
      }

    } catch (error) {
      console.error('Error during test:', error);
      if (error instanceof Error) {
        console.error('Stack:', error.stack);
      }
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log('Test completed');
  console.log('='.repeat(60));
}

/**
 * Build scope request XML
 */
function buildScopeRequestXML(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<usagereferences:usageScopeRequest xmlns:usagereferences="http://www.sap.com/adt/ris/usageReferences">
  <usagereferences:affectedObjects/>
</usagereferences:usageScopeRequest>`;
}

/**
 * Scope data interface
 */
interface ScopeData {
  objectIdentifier: {
    displayName: string;
    globalType: string;
  };
  grade: {
    definitions: boolean;
    elements: boolean;
    indirectReferences: boolean;
  };
  objectTypes: Array<{
    name: string;
    isDefault: boolean;
    isSelected: boolean;
  }>;
  payload?: string;
}

/**
 * Parse scope response XML
 */
function parseScopeResponse(xml: string): ScopeData {
  const result: ScopeData = {
    objectIdentifier: { displayName: '', globalType: '' },
    grade: { definitions: false, elements: false, indirectReferences: true },
    objectTypes: [],
  };

  if (!xml) return result;

  // Parse objectIdentifier
  const objIdMatch = xml.match(/<usagereferences:objectIdentifier\s+displayName="([^"]*)"[^>]*globalType="([^"]*)"/);
  if (objIdMatch) {
    result.objectIdentifier.displayName = objIdMatch[1];
    result.objectIdentifier.globalType = objIdMatch[2];
  }

  // Parse grade
  const gradeMatch = xml.match(/<usagereferences:grade\s+definitions="([^"]*)"[^>]*elements="([^"]*)"[^>]*indirectReferences="([^"]*)"/);
  if (gradeMatch) {
    result.grade.definitions = gradeMatch[1] === 'true';
    result.grade.elements = gradeMatch[2] === 'true';
    result.grade.indirectReferences = gradeMatch[3] === 'true';
  }

  // Parse objectTypes
  const typeRegex = /<usagereferences:type\s+name="([^"]*)"\s+isSelected="([^"]*)"\s+isDefault="([^"]*)"/g;
  let match;
  while ((match = typeRegex.exec(xml)) !== null) {
    result.objectTypes.push({
      name: match[1],
      isDefault: match[3] === 'true',
      isSelected: match[2] === 'true',
    });
  }

  // Parse payload if present
  const payloadMatch = xml.match(/<usagereferences:payload>([^<]*)<\/usagereferences:payload>/);
  if (payloadMatch) {
    result.payload = payloadMatch[1];
  }

  return result;
}

/**
 * Build query request XML
 */
function buildQueryRequestXML(scopeData: ScopeData): string {
  // Build objectTypes elements - only include selected ones
  const selectedTypes = scopeData.objectTypes.filter(t => t.isSelected);
  const typeElements = selectedTypes.map(t => 
    `      <usagereferences:type name="${t.name}" isSelected="true" isDefault="${t.isDefault}"/>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<usagereferences:usageReferenceRequest xmlns:usagereferences="http://www.sap.com/adt/ris/usageReferences">
  <usagereferences:affectedObjects/>
  <usagereferences:scope localUsage="false">
    <usagereferences:objectIdentifier displayName="${scopeData.objectIdentifier.displayName}" globalType="${scopeData.objectIdentifier.globalType}"/>
    <usagereferences:grade definitions="${scopeData.grade.definitions}" elements="${scopeData.grade.elements}" indirectReferences="${scopeData.grade.indirectReferences}"/>
    <usagereferences:objectTypes>
${typeElements}
    </usagereferences:objectTypes>${scopeData.payload ? `
    <usagereferences:payload>${scopeData.payload}</usagereferences:payload>` : ''}
  </usagereferences:scope>
</usagereferences:usageReferenceRequest>`;
}

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});