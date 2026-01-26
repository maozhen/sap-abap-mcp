/**
 * Debug script to check XML output for Service Definition and Service Binding
 */

import { buildXML } from '../src/utils/xml-parser';

console.log('='.repeat(60));
console.log('DEBUG: XML Output for CDS Objects');
console.log('='.repeat(60));

// Test 1: Service Definition XML
console.log('\n1. Service Definition XML:');
console.log('-'.repeat(40));

const srvdArgs = {
  name: 'YMCP_SD_MCP5',
  description: 'Test Service Definition',
  exposedEntities: [{ entityName: 'YMCP_CDS_MCP5', alias: 'TestEntity' }],
  packageName: '$TMP',
};

const exposedEntitiesXml = srvdArgs.exposedEntities.map(entity => ({
  '@_srvdSource:entityName': entity.entityName,
  ...(entity.alias && { '@_srvdSource:alias': entity.alias }),
}));

const srvdObj = {
  'srvdSource:srvdSource': {
    '@_xmlns:srvdSource': 'http://www.sap.com/adt/ddic/srvdsources',
    '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
    '@_adtcore:name': srvdArgs.name.toUpperCase(),
    '@_adtcore:description': srvdArgs.description,
    '@_adtcore:masterLanguage': 'EN',
    '@_srvdSource:serviceDefinitionType': 'ODATA',
    'adtcore:packageRef': {
      '@_adtcore:name': srvdArgs.packageName,
    },
    ...(exposedEntitiesXml.length > 0 && {
      'srvdSource:exposedEntities': {
        'srvdSource:entity': exposedEntitiesXml,
      },
    }),
  },
};

const srvdXml = buildXML(srvdObj);
console.log(srvdXml);

// Check if serviceDefinitionType attribute exists
console.log('\n** Checking serviceDefinitionType attribute **');
if (srvdXml.includes('serviceDefinitionType')) {
  console.log('✓ Found serviceDefinitionType in XML');
  // Extract the attribute
  const match = srvdXml.match(/serviceDefinitionType[^=]*="([^"]*)"/);
  if (match) {
    console.log(`  Value: "${match[1]}"`);
  }
} else {
  console.log('✗ serviceDefinitionType NOT found in XML!');
}

// Test 2: Service Binding XML
console.log('\n\n2. Service Binding XML:');
console.log('-'.repeat(40));

const srvbArgs = {
  name: 'YMCP_SB_MCP5',
  description: 'Test Service Binding',
  serviceDefinition: 'YMCP_SD_MCP5',
  bindingType: 'ODATA_V4',
  packageName: '$TMP',
};

const bindingTypeMap: Record<string, string> = {
  ODATA_V2: 'ODATA_V2_UI',
  ODATA_V4: 'ODATA_V4_UI',
  ODATA_V2_UI: 'ODATA_V2_UI',
  ODATA_V4_UI: 'ODATA_V4_UI',
};

const srvbObj = {
  'serviceBinding:serviceBinding': {
    '@_xmlns:serviceBinding': 'http://www.sap.com/adt/ddic/ServiceBindings',
    '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
    '@_adtcore:name': srvbArgs.name.toUpperCase(),
    '@_adtcore:description': srvbArgs.description,
    '@_adtcore:masterLanguage': 'EN',
    'adtcore:packageRef': {
      '@_adtcore:name': srvbArgs.packageName,
    },
    '@_serviceBinding:serviceDefinition': srvbArgs.serviceDefinition.toUpperCase(),
    '@_serviceBinding:bindingType': bindingTypeMap[srvbArgs.bindingType] || srvbArgs.bindingType,
  },
};

const srvbXml = buildXML(srvbObj);
console.log(srvbXml);

// Test 3: Try different attribute formats
console.log('\n\n3. Testing Different Attribute Formats:');
console.log('-'.repeat(40));

// Test with simple attribute name (no namespace prefix)
const testObj1 = {
  'test:root': {
    '@_xmlns:test': 'http://test.namespace',
    '@_test:attr1': 'value1',
    '@_attr2': 'value2',
  },
};
console.log('Format 1 - @_test:attr1:');
console.log(buildXML(testObj1));

// Test what attribute name format works
console.log('\n** fast-xml-parser Attribute Handling Analysis **');
console.log('The @_ prefix is stripped, but namespace prefix in attribute name might cause issues.');
console.log('\nExpected format:');
console.log('  srvdSource:serviceDefinitionType="ODATA"');
console.log('\nActual check in generated XML...');

// Parse and analyze
const xmlOutput = buildXML(srvdObj);
const lines = xmlOutput.split('\n');
lines.forEach((line, i) => {
  if (line.includes('srvdSource:srvdSource') || line.includes('serviceDefinitionType')) {
    console.log(`  Line ${i + 1}: ${line.trim()}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('END DEBUG');
console.log('='.repeat(60));