/**
 * Test script to test Service Binding creation with correct XML format
 * Based on analysis of existing service binding /AIF/MSGMONITORING_CDS
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as https from 'https';
import * as dotenv from 'dotenv';

dotenv.config();

// Disable TLS certificate verification globally for this script
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Build SAP URL from host and port (same pattern as ADT client)
const SAP_HOST = process.env.SAP_HOST || '';
const SAP_PORT = process.env.SAP_PORT || '';
const SAP_USE_TLS = process.env.SAP_USE_TLS === 'true';
const protocol = SAP_USE_TLS ? 'https' : 'http';
const SAP_URL = SAP_HOST ? `${protocol}://${SAP_HOST}:${SAP_PORT}` : '';

const SAP_CLIENT = process.env.SAP_CLIENT || '100';
const SAP_USER = process.env.SAP_USER || '';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '';

// XML templates based on actual SAP format
// From /AIF/MSGMONITORING_CDS we see:
// - <srvb:binding srvb:type="ODATA" srvb:version="V4" srvb:category="0">
// - <srvb:services srvb:name="...">
// - <srvb:serviceDefinition adtcore:uri="..." adtcore:type="SRVD/SRV" adtcore:name="..."/>

function buildServiceBindingXMLv1(name: string, description: string, serviceDefinition: string, bindingType: string, version: string, category: string, packageName: string): string {
  // Format 1: Based on actual SAP format with srvb:binding element
  return `<?xml version="1.0" encoding="UTF-8"?>
<srvb:serviceBinding 
  xmlns:srvb="http://www.sap.com/adt/ddic/ServiceBindings"
  xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="${name.toUpperCase()}"
  adtcore:description="${description}"
  adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="${packageName}"/>
  <srvb:services srvb:name="${serviceDefinition.toUpperCase()}">
    <srvb:content srvb:version="0001" srvb:releaseState="NOT_RELEASED">
      <srvb:serviceDefinition adtcore:type="SRVD/SRV" adtcore:name="${serviceDefinition.toUpperCase()}"/>
    </srvb:content>
  </srvb:services>
  <srvb:binding srvb:type="${bindingType}" srvb:version="${version}" srvb:category="${category}">
    <srvb:implementation adtcore:name="${name.toUpperCase()}"/>
  </srvb:binding>
</srvb:serviceBinding>`;
}

function buildServiceBindingXMLv2(name: string, description: string, serviceDefinition: string, bindingType: string, version: string, category: string, packageName: string): string {
  // Format 2: Minimal format with just binding info
  return `<?xml version="1.0" encoding="UTF-8"?>
<srvb:serviceBinding 
  xmlns:srvb="http://www.sap.com/adt/ddic/ServiceBindings"
  xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="${name.toUpperCase()}"
  adtcore:description="${description}"
  adtcore:masterLanguage="EN">
  <adtcore:packageRef adtcore:name="${packageName}"/>
  <srvb:binding srvb:type="${bindingType}" srvb:version="${version}" srvb:category="${category}"/>
</srvb:serviceBinding>`;
}

function buildServiceBindingXMLv3(name: string, description: string, serviceDefinition: string, bindingType: string, packageName: string): string {
  // Format 3: Original format with serviceBinding namespace (our current approach)
  return `<?xml version="1.0" encoding="UTF-8"?>
<serviceBinding:serviceBinding 
  xmlns:serviceBinding="http://www.sap.com/adt/ddic/ServiceBindings"
  xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="${name.toUpperCase()}"
  adtcore:description="${description}"
  adtcore:masterLanguage="EN"
  serviceBinding:serviceDefinition="${serviceDefinition.toUpperCase()}"
  serviceBinding:bindingType="${bindingType}">
  <adtcore:packageRef adtcore:name="${packageName}"/>
</serviceBinding:serviceBinding>`;
}

async function main() {
  console.log('=== Test: Service Binding Creation with Correct XML Format ===\n');
  console.log(`SAP URL: ${SAP_URL}`);
  console.log(`SAP Client: ${SAP_CLIENT}`);
  console.log(`SAP User: ${SAP_USER}\n`);

  // Manual cookie storage to maintain session state
  let cookies: string[] = [];

  const client: AxiosInstance = axios.create({
    baseURL: `${SAP_URL}/sap/bc/adt`,
    auth: {
      username: SAP_USER,
      password: SAP_PASSWORD,
    },
    headers: {
      'sap-client': SAP_CLIENT,
    },
    validateStatus: () => true, // Don't throw on any status
  });

  // Add interceptor to handle cookies manually
  client.interceptors.response.use((response) => {
    const setCookies = response.headers['set-cookie'];
    if (setCookies) {
      cookies = setCookies.map(c => c.split(';')[0]);
    }
    return response;
  });

  client.interceptors.request.use((config) => {
    if (cookies.length > 0) {
      config.headers['Cookie'] = cookies.join('; ');
    }
    return config;
  });

  try {
    // Step 1: Fetch CSRF token
    console.log('1. Fetching CSRF token...');
    const tokenResp = await client.get('/discovery', {
      headers: { 'X-CSRF-Token': 'fetch' },
    });
    const csrfToken = tokenResp.headers['x-csrf-token'];
    console.log(`   CSRF Token: ${csrfToken ? 'obtained' : 'failed'}\n`);

    // Step 2: First, we need to find a real existing service definition to reference
    console.log('2. Searching for existing service definitions...');
    const searchResp = await client.get('/repository/informationsystem/search', {
      params: {
        operation: 'quickSearch',
        query: '/AIF/*',
        objectType: 'SRVD',
        maxResults: 5,
      },
      headers: {
        'Accept': 'application/xml',
      },
    });
    console.log('   Search status:', searchResp.status);
    
    // Parse search results to find a service definition name
    let existingServiceDef = '/AIF/MESSAGEMONITOR'; // Default from our known binding
    if (searchResp.status === 200 && searchResp.data) {
      console.log('   Search response (first 500 chars):', searchResp.data.substring(0, 500));
      // Try to extract a service definition name
      const nameMatch = searchResp.data.match(/adtcore:name="([^"]+)"/);
      if (nameMatch) {
        existingServiceDef = nameMatch[1];
        console.log(`   Found service definition: ${existingServiceDef}`);
      }
    }

    // Step 3: Test different XML formats
    console.log('\n3. Testing different XML formats for service binding creation...\n');
    
    // Test configurations
    const testConfigs = [
      {
        name: 'Format v1 - Full SAP style with services element',
        builder: buildServiceBindingXMLv1,
        args: ['ZTEST_SRVB_V1', 'Test SRVB v1', existingServiceDef, 'ODATA', 'V4', '0', '$TMP'],
      },
      {
        name: 'Format v2 - Minimal with binding element',
        builder: buildServiceBindingXMLv2,
        args: ['ZTEST_SRVB_V2', 'Test SRVB v2', existingServiceDef, 'ODATA', 'V4', '0', '$TMP'],
      },
      {
        name: 'Format v1 - ODATA V2',
        builder: buildServiceBindingXMLv1,
        args: ['ZTEST_SRVB_V2T', 'Test SRVB V2', existingServiceDef, 'ODATA', 'V2', '0', '$TMP'],
      },
      {
        name: 'Format v1 - ODATA V4 UI',
        builder: buildServiceBindingXMLv1,
        args: ['ZTEST_SRVB_V4U', 'Test SRVB V4 UI', existingServiceDef, 'ODATA', 'V4', '1', '$TMP'],
      },
    ];

    for (const config of testConfigs) {
      console.log(`   Testing: ${config.name}`);
      const xml = config.builder(...config.args as [string, string, string, string, string, string, string]);
      console.log('   XML:');
      console.log(xml);
      console.log('');
      
      const resp = await client.post('/businessservices/bindings', xml, {
        headers: {
          'Content-Type': 'application/vnd.sap.adt.businessservices.servicebinding.v2+xml',
          'X-CSRF-Token': csrfToken,
          'Accept': '*/*',
        },
      });

      console.log(`   Status: ${resp.status} ${resp.statusText}`);
      if (resp.status >= 400) {
        // Extract error message
        const errorData = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
        // Check if it's an XML error response
        if (errorData.includes('<?xml') || errorData.includes('<')) {
          // Try to extract meaningful error from XML
          const msgMatch = errorData.match(/<message[^>]*>([^<]+)<\/message>/);
          const excMatch = errorData.match(/CX_[A-Z_]+/);
          if (msgMatch) {
            console.log(`   Error message: ${msgMatch[1]}`);
          }
          if (excMatch) {
            console.log(`   Exception: ${excMatch[0]}`);
          }
          if (!msgMatch && !excMatch) {
            // Show truncated error
            console.log(`   Error: ${errorData.substring(0, 400)}`);
          }
        } else {
          console.log(`   Error: ${errorData.substring(0, 400)}`);
        }
      } else {
        console.log(`   SUCCESS! Response:`);
        console.log(resp.data);
      }
      console.log('\n' + '='.repeat(60) + '\n');
    }

    // Step 4: Try different Content-Types
    console.log('4. Testing different Content-Types...\n');
    
    const contentTypes = [
      'application/vnd.sap.adt.businessservices.servicebinding.v2+xml',
      'application/vnd.sap.adt.businessservices.servicebinding+xml',
      'application/xml',
    ];
    
    const testXml = buildServiceBindingXMLv1('ZTEST_CT', 'Test Content-Type', existingServiceDef, 'ODATA', 'V4', '0', '$TMP');
    
    for (const ct of contentTypes) {
      console.log(`   Testing Content-Type: ${ct}`);
      
      const resp = await client.post('/businessservices/bindings', testXml, {
        headers: {
          'Content-Type': ct,
          'X-CSRF-Token': csrfToken,
          'Accept': '*/*',
        },
      });

      console.log(`   Status: ${resp.status} ${resp.statusText}`);
      if (resp.status >= 400) {
        const errorData = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
        if (resp.status === 415) {
          console.log('   Error: Unsupported Media Type');
        } else {
          console.log(`   Error: ${errorData.substring(0, 200)}`);
        }
      } else {
        console.log(`   SUCCESS!`);
      }
      console.log('');
    }

    // Step 5: Check API discovery for correct endpoint and content types
    console.log('\n5. Checking API discovery for service binding endpoints...');
    const discoveryResp = await client.get('/discovery', {
      headers: { 'Accept': 'application/xml' },
    });
    if (discoveryResp.status === 200 && discoveryResp.data) {
      // Search for businessservices or binding in discovery
      const discoveryData = discoveryResp.data as string;
      const bindingSection = discoveryData.match(/<[^>]*businessservices[^>]*>[\s\S]*?<\/[^>]*>/gi);
      if (bindingSection) {
        console.log('   Found businessservices in discovery:');
        bindingSection.forEach((section: string) => {
          console.log(section.substring(0, 500));
        });
      }
      
      // Look for collection URL
      const collectionMatch = discoveryData.match(/href="([^"]*bindings[^"]*)"/gi);
      if (collectionMatch) {
        console.log('   Found binding collection URLs:', collectionMatch.join(', '));
      }
    }

  } catch (error: any) {
    console.error('Fatal error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

main().catch(console.error);