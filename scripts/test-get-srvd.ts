/**
 * Test script to get existing SRVD object structure
 */

import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SAP_HOST = process.env.SAP_HOST || '';
const SAP_PORT = process.env.SAP_PORT || '';
const SAP_USE_TLS = process.env.SAP_USE_TLS === 'true';
const protocol = SAP_USE_TLS ? 'https' : 'http';
const SAP_URL = SAP_HOST ? `${protocol}://${SAP_HOST}:${SAP_PORT}` : '';

const SAP_CLIENT = process.env.SAP_CLIENT || '100';
const SAP_USER = process.env.SAP_USER || '';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '';

async function main() {
  console.log('=== Get existing SRVD structure ===\n');
  console.log(`SAP URL: ${SAP_URL}`);
  console.log(`SAP Client: ${SAP_CLIENT}`);
  console.log(`SAP User: ${SAP_USER}\n`);

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
    validateStatus: () => true,
  });

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
    // Step 1: Get CSRF token
    console.log('1. Fetching CSRF token...');
    const tokenResp = await client.get('/discovery', {
      headers: { 'X-CSRF-Token': 'fetch' },
    });
    const csrfToken = tokenResp.headers['x-csrf-token'];
    console.log(`   CSRF Token: ${csrfToken ? 'obtained' : 'failed'}\n`);

    // Step 2: Get SRVD object metadata
    const srvdNames = [
      '%2faif%2fmessagemonitor',  // /AIF/MESSAGEMONITOR
      '%2fbobf%2frap_mig_bo',      // /BOBF/RAP_MIG_BO
    ];

    for (const srvdName of srvdNames) {
      console.log(`\n2. Getting SRVD: ${srvdName}`);
      
      // Get object metadata
      console.log('\n   2.1 Getting object metadata...');
      const metaResp = await client.get(`/ddic/srvd/sources/${srvdName}`, {
        headers: {
          'Accept': 'application/vnd.sap.adt.srvd+xml, application/xml, */*',
        },
      });
      console.log(`   Status: ${metaResp.status}`);
      if (metaResp.status === 200) {
        console.log('   Response XML:');
        console.log('   ' + '='.repeat(70));
        console.log(metaResp.data);
        console.log('   ' + '='.repeat(70));
        
        // Parse and show content-type
        console.log('\n   Response headers:');
        console.log(`   Content-Type: ${metaResp.headers['content-type']}`);
      } else {
        console.log(`   Error: ${metaResp.data}`);
      }

      // Get source code
      console.log('\n   2.2 Getting source code...');
      const sourceResp = await client.get(`/ddic/srvd/sources/${srvdName}/source/main`, {
        headers: {
          'Accept': 'text/plain, */*',
        },
      });
      console.log(`   Status: ${sourceResp.status}`);
      if (sourceResp.status === 200) {
        console.log('   Source code:');
        console.log('   ' + '-'.repeat(70));
        console.log(sourceResp.data);
        console.log('   ' + '-'.repeat(70));
      } else {
        console.log(`   Error: ${sourceResp.data}`);
      }

      // If we got data, break
      if (metaResp.status === 200) {
        break;
      }
    }

    // Step 3: Check discovery for SRVD endpoints
    console.log('\n\n3. Checking ADT discovery for SRVD collection info...');
    const discoveryResp = await client.get('/discovery', {
      headers: { 'Accept': 'application/xml' },
    });
    if (discoveryResp.status === 200) {
      const data = String(discoveryResp.data);
      // Extract SRVD related sections
      const srvdPattern = /(<[^>]*srvd[^>]*>[\s\S]*?<\/[^>]*>|<[^>]*srvd[^/]*\/>)/gi;
      const matches = data.match(srvdPattern);
      if (matches) {
        console.log('   Found SRVD related entries:');
        matches.slice(0, 10).forEach(m => console.log('   ' + m));
      }
      
      // Also look for collection info
      const collectionPattern = /href="[^"]*srvd[^"]*"/gi;
      const collMatches = data.match(collectionPattern);
      if (collMatches) {
        console.log('\n   Found SRVD collection URLs:');
        collMatches.forEach(m => console.log('   ' + m));
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