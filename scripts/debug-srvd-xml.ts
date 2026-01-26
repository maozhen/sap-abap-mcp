/**
 * Debug script for Service Definition XML generation
 */

import { buildXML } from '../src/utils/xml-parser';

// Test 1: Current implementation
function testCurrentImplementation() {
  console.log('=== Test 1: Current implementation ===\n');
  
  const obj = {
    'srvdSource:srvdSource': {
      '@_xmlns:srvdSource': 'http://www.sap.com/adt/ddic/srvdsources',
      '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
      '@_adtcore:name': 'YMCP_SD_TEST',
      '@_adtcore:description': 'Test Service Definition',
      '@_adtcore:masterLanguage': 'EN',
      '@_serviceDefinitionType': 'ODATA',
      'adtcore:packageRef': {
        '@_adtcore:name': '$TMP',
      },
      'srvdSource:exposedEntities': {
        'srvdSource:entity': [
          { '@_srvdSource:entityName': 'YMCP_CDS_TEST' },
        ],
      },
    },
  };
  
  const xml = buildXML(obj);
  console.log(xml);
  console.log('\n');
}

// Test 2: With srvdSource namespace prefix on serviceDefinitionType
function testWithNamespacePrefix() {
  console.log('=== Test 2: With srvdSource: namespace prefix ===\n');
  
  const obj = {
    'srvdSource:srvdSource': {
      '@_xmlns:srvdSource': 'http://www.sap.com/adt/ddic/srvdsources',
      '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
      '@_adtcore:name': 'YMCP_SD_TEST',
      '@_adtcore:description': 'Test Service Definition',
      '@_adtcore:masterLanguage': 'EN',
      '@_srvdSource:serviceDefinitionType': 'ODATA',
      'adtcore:packageRef': {
        '@_adtcore:name': '$TMP',
      },
    },
  };
  
  const xml = buildXML(obj);
  console.log(xml);
  console.log('\n');
}

// Test 3: serviceDefinitionType as element instead of attribute
function testAsElement() {
  console.log('=== Test 3: serviceDefinitionType as element ===\n');
  
  const obj = {
    'srvdSource:srvdSource': {
      '@_xmlns:srvdSource': 'http://www.sap.com/adt/ddic/srvdsources',
      '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
      '@_adtcore:name': 'YMCP_SD_TEST',
      '@_adtcore:description': 'Test Service Definition',
      '@_adtcore:masterLanguage': 'EN',
      'adtcore:packageRef': {
        '@_adtcore:name': '$TMP',
      },
      'srvdSource:serviceDefinitionType': 'ODATA',
    },
  };
  
  const xml = buildXML(obj);
  console.log(xml);
  console.log('\n');
}

// Test 4: Without serviceDefinitionType - let SAP use default
function testWithoutServiceDefinitionType() {
  console.log('=== Test 4: Without serviceDefinitionType ===\n');
  
  const obj = {
    'srvdSource:srvdSource': {
      '@_xmlns:srvdSource': 'http://www.sap.com/adt/ddic/srvdsources',
      '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
      '@_adtcore:name': 'YMCP_SD_TEST',
      '@_adtcore:description': 'Test Service Definition',
      '@_adtcore:masterLanguage': 'EN',
      'adtcore:packageRef': {
        '@_adtcore:name': '$TMP',
      },
    },
  };
  
  const xml = buildXML(obj);
  console.log(xml);
  console.log('\n');
}

// Test 5: serviceDefinitionType with different position
function testDifferentOrder() {
  console.log('=== Test 5: serviceDefinitionType first ===\n');
  
  const obj = {
    'srvdSource:srvdSource': {
      '@_serviceDefinitionType': 'ODATA',
      '@_xmlns:srvdSource': 'http://www.sap.com/adt/ddic/srvdsources',
      '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
      '@_adtcore:name': 'YMCP_SD_TEST',
      '@_adtcore:description': 'Test Service Definition',
      '@_adtcore:masterLanguage': 'EN',
      'adtcore:packageRef': {
        '@_adtcore:name': '$TMP',
      },
    },
  };
  
  const xml = buildXML(obj);
  console.log(xml);
  console.log('\n');
}

// Run all tests
testCurrentImplementation();
testWithNamespacePrefix();
testAsElement();
testWithoutServiceDefinitionType();
testDifferentOrder();