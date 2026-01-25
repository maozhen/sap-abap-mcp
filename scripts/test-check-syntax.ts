/**
 * Test script for check_syntax functionality
 * Directly tests the ADT client's checkSyntax method with detailed logging
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../src/clients/adt-client';
import { parseXML } from '../src/utils/xml-parser';

dotenv.config();

async function main() {
  const connection = {
    host: process.env.SAP_HOST || '',
    port: parseInt(process.env.SAP_PORT || '443'),
    client: process.env.SAP_CLIENT || '100',
    username: process.env.SAP_USERNAME || '',
    password: process.env.SAP_PASSWORD || '',
    https: process.env.SAP_HTTPS !== 'false',
    allowInsecure: process.env.SAP_ALLOW_INSECURE === 'true'
  };

  console.log('=== Test check_syntax for ZFIBONACCI_DEMO ===\n');
  console.log(`Connecting to: ${connection.host}:${connection.port}`);
  console.log(`Client: ${connection.client}`);
  console.log(`User: ${connection.username}\n`);

  const client = new ADTClient({ connection });

  try {
    // Test connection first
    console.log('Testing connection...');
    const connected = await client.testConnection();
    if (!connected) {
      console.error('Connection failed!');
      return;
    }
    console.log('Connection successful!\n');

    // Make a direct POST request to the activation endpoint with preauditRequested=true
    const objectUri = '/programs/programs/zfibonacci_demo';
    const fullUri = `/sap/bc/adt${objectUri}`;
    const objectName = 'ZFIBONACCI_DEMO';
    
    const requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<adtcore:objectReferences xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:objectReference adtcore:uri="${fullUri}" adtcore:name="${objectName}"/>
</adtcore:objectReferences>`;

    console.log('=== Request ===');
    console.log(`POST /activation?method=activate&preauditRequested=true`);
    console.log(`Body:\n${requestBody}\n`);

    const response = await client.post('/activation', requestBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml, */*'
      },
      params: {
        'method': 'activate',
        'preauditRequested': 'true'
      }
    });

    console.log('=== Response ===');
    console.log(`Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(response.headers, null, 2)}`);
    console.log(`\nRaw Response:\n${response.raw}\n`);

    // Parse the response
    if (response.raw) {
      console.log('=== Parsed Response ===');
      const parsed = parseXML(response.raw);
      console.log(JSON.stringify(parsed, null, 2));

      // Try to find msg elements manually
      console.log('\n=== Finding msg elements ===');
      findMsgElements(parsed, '');
    }

    // Now test the actual checkSyntax method
    console.log('\n=== Testing checkSyntax method ===');
    const result = await client.checkSyntax(objectUri);
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

function findMsgElements(obj: unknown, path: string): void {
  if (!obj || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      findMsgElements(item, `${path}[${index}]`);
    });
    return;
  }

  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Check if this key matches 'msg' with any namespace prefix
    if (key === 'msg' || key.endsWith(':msg') || key.includes('msg')) {
      console.log(`Found msg-like element at: ${currentPath}`);
      console.log(`Value: ${JSON.stringify(record[key], null, 2)}`);
    }
    
    // Also check for 'messages' elements
    if (key.toLowerCase().includes('message')) {
      console.log(`Found message-like element at: ${currentPath}`);
      console.log(`Value: ${JSON.stringify(record[key], null, 2)}`);
    }

    // Recurse into nested objects
    findMsgElements(record[key], currentPath);
  }
}

main().catch(console.error);