/**
 * Test script to query supported Service Binding types
 * This helps identify the correct bindingType values for SRVB creation
 */

import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import * as dotenv from 'dotenv';

dotenv.config();

// Build SAP URL from host and port (same pattern as ADT client)
const SAP_HOST = process.env.SAP_HOST || '';
const SAP_PORT = process.env.SAP_PORT || '';
const SAP_USE_TLS = process.env.SAP_USE_TLS === 'true';
const protocol = SAP_USE_TLS ? 'https' : 'http';
const SAP_URL = SAP_HOST ? `${protocol}://${SAP_HOST}:${SAP_PORT}` : '';

const SAP_CLIENT = process.env.SAP_CLIENT || '100';
const SAP_USER = process.env.SAP_USER || '';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '';

async function main() {
  console.log('=== Test: Query Supported Service Binding Types ===\n');
  console.log(`SAP URL: ${SAP_URL}`);
  console.log(`SAP Client: ${SAP_CLIENT}`);
  console.log(`SAP User: ${SAP_USER}\n`);

  const client: AxiosInstance = axios.create({
    baseURL: `${SAP_URL}/sap/bc/adt`,
    auth: {
      username: SAP_USER,
      password: SAP_PASSWORD,
    },
    headers: {
      'sap-client': SAP_CLIENT,
      'Accept': '*/*',
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  try {
    // Step 1: Fetch CSRF token
    console.log('1. Fetching CSRF token...');
    const tokenResp = await client.get('/discovery', {
      headers: { 'X-CSRF-Token': 'fetch' },
    });
    const csrfToken = tokenResp.headers['x-csrf-token'];
    console.log(`   CSRF Token: ${csrfToken ? 'obtained' : 'failed'}\n`);

    // Step 2: Query binding types
    console.log('2. Querying /businessservices/bindings/bindingtypes ...');
    try {
      const bindingTypesResp = await client.get('/businessservices/bindings/bindingtypes', {
        headers: {
          'Accept': 'application/xml, application/json, */*',
        },
      });
      console.log('   Status:', bindingTypesResp.status);
      console.log('   Content-Type:', bindingTypesResp.headers['content-type']);
      console.log('\n   Response:');
      console.log(bindingTypesResp.data);
    } catch (error: any) {
      console.log('   Error:', error.response?.status, error.response?.statusText);
      console.log('   Error Data:', error.response?.data);
    }

    // Step 3: Query schema for specific binding types
    console.log('\n3. Querying /businessservices/bindings/schema/ODATA_V4_UI ...');
    try {
      const schemaResp = await client.get('/businessservices/bindings/schema/ODATA_V4_UI', {
        headers: {
          'Accept': 'application/xml, application/json, */*',
        },
      });
      console.log('   Status:', schemaResp.status);
      console.log('\n   Response:');
      console.log(schemaResp.data);
    } catch (error: any) {
      console.log('   Error:', error.response?.status, error.response?.statusText);
      console.log('   Error Data:', error.response?.data?.substring?.(0, 500) || error.response?.data);
    }

    // Step 4: Try different binding type values
    const bindingTypesToTest = [
      'ODATA_V2',
      'ODATA_V4', 
      'ODATA_V2_UI',
      'ODATA_V4_UI',
      'ODATA',
      'ODATAV2_UI',
      'ODATAV4_UI',
    ];

    console.log('\n4. Testing different binding type schemas...');
    for (const bt of bindingTypesToTest) {
      try {
        const resp = await client.get(`/businessservices/bindings/schema/${bt}`);
        console.log(`   ${bt}: OK (${resp.status})`);
      } catch (error: any) {
        console.log(`   ${bt}: ${error.response?.status || 'ERROR'} - ${error.response?.statusText || error.message}`);
      }
    }

    // Step 5: Check validation endpoint
    console.log('\n5. Checking validation endpoint parameters...');
    try {
      const validationResp = await client.get('/businessservices/bindings/validation', {
        params: {
          objname: 'TEST',
          description: 'Test',
          serviceDefinition: 'TEST_SD',
          package: '$TMP',
        },
        headers: {
          'Accept': 'application/xml, */*',
        },
      });
      console.log('   Status:', validationResp.status);
      console.log('   Response:', validationResp.data);
    } catch (error: any) {
      console.log('   Error:', error.response?.status);
      // The error response might contain useful info about required parameters
      if (error.response?.data) {
        console.log('   Error Data:', error.response.data);
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