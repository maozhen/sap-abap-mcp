/**
 * Test Script to explore Structure parser/info endpoint
 * To understand the correct XML format for creating structures
 */

import * as dotenv from 'dotenv';
import { ADTClient } from '../src/clients/adt-client';

dotenv.config();

async function main(): Promise<void> {
  console.log('Structure Parser Info Exploration');
  console.log('='.repeat(60));
  
  // Validate environment
  const { SAP_URL, SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD, SAP_SSL } = process.env;
  
  let host: string;
  let port: number;
  let isHttps: boolean;
  
  if (SAP_URL) {
    const sapUrl = new URL(SAP_URL);
    isHttps = sapUrl.protocol === 'https:';
    host = sapUrl.hostname;
    port = sapUrl.port ? parseInt(sapUrl.port, 10) : (isHttps ? 443 : 80);
  } else if (SAP_HOST) {
    host = SAP_HOST;
    port = SAP_PORT ? parseInt(SAP_PORT, 10) : 443;
    isHttps = SAP_SSL !== 'false';
  } else {
    console.log('Missing required environment variables');
    process.exit(1);
  }
  
  if (!SAP_CLIENT || !SAP_USER || !SAP_PASSWORD) {
    console.log('Missing required environment variables: SAP_CLIENT, SAP_USER, SAP_PASSWORD');
    process.exit(1);
  }
  
  console.log(`SAP Host: ${host}:${port} (${isHttps ? 'HTTPS' : 'HTTP'})`);
  
  // Initialize client
  const adtClient = new ADTClient({
    connection: {
      host,
      port,
      https: isHttps,
      client: SAP_CLIENT,
      username: SAP_USER,
      password: SAP_PASSWORD,
      allowInsecure: true,
    },
  });
  
  // Test 1: Try to get parser/info for structures
  console.log('\n--- Test 1: GET /ddic/structures/parser/info ---');
  try {
    const response = await adtClient.get<string>('/ddic/structures/parser/info', {
      headers: { 'Accept': '*/*' }
    });
    console.log('Response status: Success');
    console.log('Response data:');
    console.log(response.data);
  } catch (error: any) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  // Test 2: Try to get an existing structure's metadata
  console.log('\n--- Test 2: GET existing structure (BAPIRET2) ---');
  try {
    const response = await adtClient.get<string>('/ddic/structures/bapiret2', {
      headers: { 'Accept': '*/*' }
    });
    console.log('Response status: Success');
    console.log('Response data:');
    console.log(response.data);
  } catch (error: any) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  // Test 3: Try to get existing structure's source
  console.log('\n--- Test 3: GET existing structure source (BAPIRET2/source/main) ---');
  try {
    const response = await adtClient.get<string>('/ddic/structures/bapiret2/source/main', {
      headers: { 'Accept': 'text/plain' }
    });
    console.log('Response status: Success');
    console.log('Response data:');
    console.log(response.data);
  } catch (error: any) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  // Test 4: Try to get validation info
  console.log('\n--- Test 4: GET /ddic/structures/validation ---');
  try {
    const response = await adtClient.get<string>('/ddic/structures/validation', {
      headers: { 'Accept': '*/*' }
    });
    console.log('Response status: Success');
    console.log('Response data:');
    console.log(response.data);
  } catch (error: any) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  // Test 5: Try to get existing structure with different Accept header
  console.log('\n--- Test 5: GET existing structure with application/* Accept ---');
  try {
    const response = await adtClient.get<string>('/ddic/structures/bapiret2', {
      headers: { 'Accept': 'application/*' }
    });
    console.log('Response status: Success');
    console.log('Response data:');
    console.log(response.data);
  } catch (error: any) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Exploration completed');
}

main().catch((error) => {
  console.log(`Fatal error: ${error}`);
  process.exit(1);
});