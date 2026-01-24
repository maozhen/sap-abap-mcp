/**
 * CSRF Token Test Script
 * 
 * This script tests the CSRF token fetch and validation process
 * to diagnose 403 Forbidden errors in SAP ADT API calls.
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
import * as https from 'https';

// Load environment variables
dotenv.config();

const config = {
  host: process.env.SAP_HOST || '',
  port: process.env.SAP_PORT ? parseInt(process.env.SAP_PORT, 10) : 443,
  client: process.env.SAP_CLIENT || '',
  username: process.env.SAP_USER || '',
  password: process.env.SAP_PASSWORD || '',
  https: process.env.SAP_SSL !== 'false'
};

console.log('='.repeat(60));
console.log('CSRF Token Test Script');
console.log('='.repeat(60));
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Client: ${config.client}`);
console.log(`  Username: ${config.username}`);
console.log(`  HTTPS: ${config.https}`);
console.log('='.repeat(60));

const protocol = config.https ? 'https' : 'http';
const baseURL = `${protocol}://${config.host}:${config.port}/sap/bc/adt`;

// Create axios instance
const httpClient = axios.create({
  baseURL,
  timeout: 30000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  // Don't transform response
  transformResponse: [(data) => data]
});

// Add basic auth
const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

async function testCSRFTokenFetch(): Promise<string | null> {
  console.log('\n[Step 1] Fetching CSRF Token');
  console.log('-'.repeat(40));
  
  try {
    // Use application/atomsvc+xml for discovery endpoint
    const response = await httpClient.get('/discovery', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'sap-client': config.client,
        'X-CSRF-Token': 'Fetch',
        'Accept': 'application/atomsvc+xml'
      }
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log('\nResponse Headers:');
    
    // Print all headers
    for (const [key, value] of Object.entries(response.headers)) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Extract CSRF token
    const csrfToken = response.headers['x-csrf-token'];
    console.log('\n[CSRF Token Analysis]');
    console.log(`  x-csrf-token header: ${csrfToken || '(not found)'}`);
    
    if (csrfToken && csrfToken !== 'unsafe') {
      console.log(`  Token length: ${csrfToken.length}`);
      console.log(`  Token preview: ${csrfToken.substring(0, 30)}...`);
      console.log('  Status: VALID TOKEN RECEIVED ✓');
      return csrfToken;
    } else if (csrfToken === 'unsafe') {
      console.log('  Status: RECEIVED "unsafe" TOKEN (indicates CSRF protection might be disabled) ⚠');
      return csrfToken;
    } else {
      console.log('  Status: NO TOKEN RECEIVED ✗');
      return null;
    }
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Response Status: ${error.response.status}`);
      console.log('Response Headers:', error.response.headers);
      
      // Even on error, check if CSRF token was returned (SAP often returns it with 406)
      const csrfToken = error.response.headers['x-csrf-token'];
      if (csrfToken && csrfToken !== 'unsafe' && csrfToken !== 'Required') {
        console.log(`\n[CSRF Token Analysis - from error response]`);
        console.log(`  x-csrf-token header: ${csrfToken}`);
        console.log(`  Token length: ${csrfToken.length}`);
        console.log('  Status: TOKEN RECEIVED (despite HTTP error) ✓');
        return csrfToken;
      }
    }
    return null;
  }
}

async function testSimpleGETRequest(): Promise<void> {
  console.log('\n[Step 2] Testing Simple GET Request (no CSRF needed)');
  console.log('-'.repeat(40));
  
  try {
    const response = await httpClient.get('/repository/informationsystem/search', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'sap-client': config.client,
        'Accept': 'application/xml'
      },
      params: {
        operation: 'quickSearch',
        query: 'CL_ABAP*',
        maxResults: '5'
      }
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log('Result: GET request successful ✓');
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Response Status: ${error.response.status}`);
    }
    console.log('Result: GET request failed ✗');
  }
}

async function testPOSTRequestWithCSRF(csrfToken: string): Promise<void> {
  console.log('\n[Step 3] Testing POST Request with CSRF Token');
  console.log('-'.repeat(40));
  console.log(`Using CSRF Token: ${csrfToken.substring(0, 30)}...`);
  
  // Test with activation endpoint (lightweight POST operation)
  const testPayload = `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
</adtcore:objectReferences>`;
  
  try {
    const response = await httpClient.post('/activation', testPayload, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'sap-client': config.client,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      params: {
        method: 'activate',
        preauditRequested: 'false'
      }
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log('Result: POST request with CSRF token successful ✓');
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Response Status: ${error.response.status} ${error.response.statusText}`);
      console.log('\nResponse Headers:');
      for (const [key, value] of Object.entries(error.response.headers)) {
        console.log(`  ${key}: ${value}`);
      }
      
      // Check if response indicates CSRF issue
      const newToken = error.response.headers['x-csrf-token'];
      if (newToken) {
        console.log(`\nNew CSRF Token in error response: ${newToken}`);
      }
      
      // Check for specific error messages
      if (error.response.data) {
        const dataPreview = String(error.response.data).substring(0, 500);
        console.log(`\nResponse Body Preview:\n${dataPreview}`);
      }
    }
    console.log('Result: POST request with CSRF token failed ✗');
  }
}

async function testPOSTRequestWithoutCSRF(): Promise<void> {
  console.log('\n[Step 4] Testing POST Request WITHOUT CSRF Token (expect 403)');
  console.log('-'.repeat(40));
  
  const testPayload = `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
</adtcore:objectReferences>`;
  
  try {
    const response = await httpClient.post('/activation', testPayload, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'sap-client': config.client,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      params: {
        method: 'activate',
        preauditRequested: 'false'
      }
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log('Result: POST request WITHOUT CSRF token succeeded (unexpected) ⚠');
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.log(`Response Status: ${error.response.status} (Expected)`);
      console.log('Result: POST without CSRF correctly rejected with 403 ✓');
      
      // Check if server provides new token hint
      const tokenHint = error.response.headers['x-csrf-token'];
      if (tokenHint) {
        console.log(`Server response x-csrf-token header: ${tokenHint}`);
      }
    } else {
      console.log(`Error: ${error.message}`);
      if (error.response) {
        console.log(`Response Status: ${error.response.status}`);
      }
      console.log('Result: Unexpected error ✗');
    }
  }
}

async function testPOSTWithFreshToken(): Promise<void> {
  console.log('\n[Step 5] Testing POST with Fresh CSRF Token (in single session)');
  console.log('-'.repeat(40));
  
  // Use a new axios instance to ensure fresh session
  const freshClient = axios.create({
    baseURL,
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    transformResponse: [(data) => data]
  });
  
  try {
    // Step 5a: Fetch token
    console.log('5a. Fetching fresh CSRF token...');
    const tokenResponse = await freshClient.get('/discovery', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'sap-client': config.client,
        'X-CSRF-Token': 'Fetch',
        'Accept': 'application/atomsvc+xml'
      }
    });
    
    const freshToken = tokenResponse.headers['x-csrf-token'];
    console.log(`   Token received: ${freshToken ? freshToken.substring(0, 30) + '...' : 'NONE'}`);
    
    if (!freshToken || freshToken === 'unsafe') {
      console.log('   Cannot proceed without valid token');
      return;
    }
    
    // Get cookies from response for session continuity
    const cookies = tokenResponse.headers['set-cookie'];
    console.log(`   Cookies: ${cookies ? 'received' : 'none'}`);
    
    // Step 5b: Immediately use token in POST
    console.log('5b. Immediately using token in POST request...');
    
    const headers: Record<string, string> = {
      'Authorization': `Basic ${auth}`,
      'sap-client': config.client,
      'X-CSRF-Token': freshToken,
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    };
    
    // Include cookies if present
    if (cookies) {
      headers['Cookie'] = Array.isArray(cookies) ? cookies.join('; ') : cookies;
    }
    
    const testPayload = `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
</adtcore:objectReferences>`;
    
    const postResponse = await freshClient.post('/activation', testPayload, {
      headers,
      params: {
        method: 'activate',
        preauditRequested: 'false'
      }
    });
    
    console.log(`   Response Status: ${postResponse.status}`);
    console.log('   Result: POST with fresh token successful ✓');
    
  } catch (error: any) {
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Response Status: ${error.response.status}`);
      console.log(`   x-csrf-token in response: ${error.response.headers['x-csrf-token'] || 'none'}`);
      
      if (error.response.data) {
        const dataPreview = String(error.response.data).substring(0, 300);
        console.log(`   Response Body: ${dataPreview}`);
      }
    }
    console.log('   Result: POST with fresh token failed ✗');
  }
}

async function main(): Promise<void> {
  try {
    // Test 1: Fetch CSRF Token
    const csrfToken = await testCSRFTokenFetch();
    
    // Test 2: Simple GET (no CSRF needed)
    await testSimpleGETRequest();
    
    // Test 3: POST with CSRF token (if we got one)
    if (csrfToken && csrfToken !== 'unsafe') {
      await testPOSTRequestWithCSRF(csrfToken);
    } else {
      console.log('\n[Step 3] Skipped - no valid CSRF token available');
    }
    
    // Test 4: POST without CSRF (expect 403)
    await testPOSTRequestWithoutCSRF();
    
    // Test 5: POST with fresh token in single session
    await testPOSTWithFreshToken();
    
    console.log('\n' + '='.repeat(60));
    console.log('CSRF Token Test Complete');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Test script failed:', error);
    process.exit(1);
  }
}

main();