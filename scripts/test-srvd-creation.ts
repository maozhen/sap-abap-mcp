/**
 * Test script for Service Definition (SRVD) creation
 * Purpose: Analyze existing SRVD and test different XML formats
 */

import { ADTClient } from '../src/clients/adt-client';
import { config } from 'dotenv';
import { buildXML, parseXML } from '../src/utils/xml-parser';

config();

async function main() {
  const client = new ADTClient({
    connection: {
      host: process.env.SAP_HOST || '',
      port: parseInt(process.env.SAP_PORT || '443', 10),
      client: process.env.SAP_CLIENT || '100',
      username: process.env.SAP_USERNAME || '',
      password: process.env.SAP_PASSWORD || '',
      https: process.env.SAP_USE_TLS !== 'false',
      allowInsecure: process.env.SAP_ALLOW_INSECURE === 'true',
    },
  });

  try {
    console.log('='.repeat(80));
    console.log('SRVD (Service Definition) Analysis and Test');
    console.log('='.repeat(80));

    // Step 1: Search for existing service definitions
    console.log('\n[Step 1] Searching for existing service definitions...');
    try {
      const searchResponse = await client.get('/repository/informationsystem/search', {
        params: {
          operation: 'quickSearch',
          query: 'Z*',
          maxResults: '20',
          objectType: 'SRVD',
        },
      });
      console.log('Search response status:', searchResponse.status);
      if (searchResponse.data) {
        console.log('Found service definitions (first 500 chars):');
        console.log(String(searchResponse.data).substring(0, 500));
      }
    } catch (searchError: any) {
      console.log('Search error:', searchError.response?.status, searchError.message);
    }

    // Step 2: Try to get an existing service definition
    console.log('\n[Step 2] Trying to get an existing service definition...');
    const existingSrvdNames = ['ZSRVD_MCP_TEST', 'ZUI_C_FLIGHT', 'Z_FLIGHT_SRV'];
    
    for (const srvdName of existingSrvdNames) {
      try {
        console.log(`\nTrying to get: ${srvdName}`);
        const getResponse = await client.get(`/ddic/srvd/sources/${srvdName.toLowerCase()}`, {
          headers: {
            'Accept': 'application/vnd.sap.adt.srvd+xml, application/xml, text/xml',
          },
        });
        console.log(`SUCCESS! Status: ${getResponse.status}`);
        console.log('Response headers:', JSON.stringify(getResponse.headers, null, 2));
        console.log('Response data:');
        console.log(getResponse.data);
        console.log('\n--- End of response ---');
        break;
      } catch (getError: any) {
        console.log(`Error: ${getError.response?.status} - ${getError.message}`);
      }
    }

    // Step 3: Try to get source code of existing service definition
    console.log('\n[Step 3] Trying to get source code of service definition...');
    for (const srvdName of existingSrvdNames) {
      try {
        console.log(`\nTrying source for: ${srvdName}`);
        const sourceResponse = await client.get(`/ddic/srvd/sources/${srvdName.toLowerCase()}/source/main`, {
          headers: {
            'Accept': 'text/plain',
          },
        });
        console.log(`SUCCESS! Status: ${sourceResponse.status}`);
        console.log('Source code:');
        console.log(sourceResponse.data);
        break;
      } catch (sourceError: any) {
        console.log(`Error: ${sourceError.response?.status} - ${sourceError.message}`);
      }
    }

    // Step 4: Analyze ADT discovery for SRVD endpoints
    console.log('\n[Step 4] Analyzing ADT discovery for SRVD endpoints...');
    try {
      const discoveryResponse = await client.get('/discovery', {
        headers: {
          'Accept': 'application/atomsvc+xml',
        },
        skipCSRF: true,
      });
      console.log('Discovery status:', discoveryResponse.status);
      
      // Extract SRVD related info
      const discoveryData = String(discoveryResponse.data);
      const srvdLines: string[] = [];
      const lines = discoveryData.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('srvd') || lines[i].toLowerCase().includes('service')) {
          // Get context (3 lines before and after)
          const start = Math.max(0, i - 3);
          const end = Math.min(lines.length - 1, i + 3);
          for (let j = start; j <= end; j++) {
            if (!srvdLines.includes(lines[j])) {
              srvdLines.push(lines[j]);
            }
          }
        }
      }
      console.log('SRVD related discovery info:');
      console.log(srvdLines.join('\n'));
    } catch (discError: any) {
      console.log('Discovery error:', discError.message);
    }

    // Step 5: Test different XML formats for SRVD creation
    console.log('\n[Step 5] Testing different SRVD XML formats...');
    
    const testFormats = [
      {
        name: 'Format v1: srvdSource with exposedEntities',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<srvdSource:srvdSource xmlns:srvdSource="http://www.sap.com/adt/ddic/srvdsources" xmlns:adtcore="http://www.sap.com/adt/core" adtcore:name="ZSRVD_MCP_TEST" adtcore:description="MCP Test Service Definition" adtcore:masterLanguage="EN" srvdSource:serviceDefinitionType="ODATA">
  <adtcore:packageRef adtcore:name="$TMP"/>
  <srvdSource:exposedEntities>
    <srvdSource:entity srvdSource:entityName="ZCDS_MCP_TEST" srvdSource:alias="TestEntity"/>
  </srvdSource:exposedEntities>
</srvdSource:srvdSource>`,
        contentType: 'application/vnd.sap.adt.srvd+xml',
      },
      {
        name: 'Format v2: Simple without exposedEntities',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<srvdSource:srvdSource xmlns:srvdSource="http://www.sap.com/adt/ddic/srvdsources" xmlns:adtcore="http://www.sap.com/adt/core" adtcore:name="ZSRVD_MCP_TEST" adtcore:description="MCP Test Service Definition" adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="$TMP"/>
</srvdSource:srvdSource>`,
        contentType: 'application/vnd.sap.adt.srvd+xml',
      },
      {
        name: 'Format v3: Using srvd namespace (non-Source)',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<srvd:serviceDefinition xmlns:srvd="http://www.sap.com/adt/ddic/srvd" xmlns:adtcore="http://www.sap.com/adt/core" adtcore:name="ZSRVD_MCP_TEST" adtcore:description="MCP Test Service Definition" adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="$TMP"/>
</srvd:serviceDefinition>`,
        contentType: 'application/vnd.sap.adt.srvd+xml',
      },
      {
        name: 'Format v4: application/xml content type',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<srvdSource:srvdSource xmlns:srvdSource="http://www.sap.com/adt/ddic/srvdsources" xmlns:adtcore="http://www.sap.com/adt/core" adtcore:name="ZSRVD_MCP_TEST" adtcore:description="MCP Test Service Definition" adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="$TMP"/>
</srvdSource:srvdSource>`,
        contentType: 'application/xml',
      },
      {
        name: 'Format v5: text/xml content type',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<srvdSource:srvdSource xmlns:srvdSource="http://www.sap.com/adt/ddic/srvdsources" xmlns:adtcore="http://www.sap.com/adt/core" adtcore:name="ZSRVD_MCP_TEST" adtcore:description="MCP Test Service Definition" adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="$TMP"/>
</srvdSource:srvdSource>`,
        contentType: 'text/xml',
      },
      {
        name: 'Format v6: charset=utf-8 in content type',
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<srvdSource:srvdSource xmlns:srvdSource="http://www.sap.com/adt/ddic/srvdsources" xmlns:adtcore="http://www.sap.com/adt/core" adtcore:name="ZSRVD_MCP_TEST" adtcore:description="MCP Test Service Definition" adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="$TMP"/>
</srvdSource:srvdSource>`,
        contentType: 'application/vnd.sap.adt.srvd+xml; charset=utf-8',
      },
    ];

    for (const format of testFormats) {
      console.log(`\n--- Testing ${format.name} ---`);
      console.log('Content-Type:', format.contentType);
      console.log('XML:');
      console.log(format.xml);
      
      try {
        const response = await client.post('/ddic/srvd/sources', format.xml, {
          headers: {
            'Content-Type': format.contentType,
            'Accept': 'application/vnd.sap.adt.srvd+xml, application/xml, */*',
          },
        });
        console.log(`SUCCESS! Status: ${response.status}`);
        console.log('Response:', response.data);
      } catch (error: any) {
        console.log(`FAILED! Status: ${error.response?.status}`);
        if (error.response?.data) {
          console.log('Error response:', String(error.response.data).substring(0, 500));
        }
        // Check headers
        if (error.response?.headers) {
          console.log('Response headers:', JSON.stringify(error.response.headers, null, 2));
        }
      }
    }

    // Step 6: Check what content types are supported via OPTIONS
    console.log('\n[Step 6] Checking supported content types via OPTIONS...');
    try {
      // Try using a HEAD request to get headers (OPTIONS might not be supported)
      const headResponse = await client.get('/ddic/srvd/sources', {
        headers: {
          'Accept': '*/*',
        },
        skipCSRF: true,
      });
      console.log('HEAD/GET status:', headResponse.status);
      console.log('Headers:', JSON.stringify(headResponse.headers, null, 2));
    } catch (optError: any) {
      console.log('HEAD/GET error:', optError.response?.status, optError.message);
      if (optError.response?.headers) {
        console.log('Response headers:', JSON.stringify(optError.response.headers, null, 2));
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('Analysis Complete');
    console.log('='.repeat(80));

  } catch (error: any) {
    console.error('Main error:', error.message);
  }
}

main().catch(console.error);