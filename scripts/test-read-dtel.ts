/**
 * Test script to read and display Data Element XML structure
 */
import * as dotenv from 'dotenv';
import { createADTClient } from '../src/clients/adt-client';
import { SAPConnectionConfig } from '../src/types';

dotenv.config();

async function main() {
  const connection: SAPConnectionConfig = {
    host: process.env.SAP_HOST!,
    port: parseInt(process.env.SAP_PORT!, 10),
    https: process.env.SAP_USE_TLS === 'true',
    client: process.env.SAP_CLIENT!,
    username: process.env.SAP_USER!,
    password: process.env.SAP_PASSWORD!,
    allowInsecure: true
  };

  const client = createADTClient(connection);
  
  console.log('Reading MANDT data element...\n');
  
  try {
    const response = await client.getObject('/ddic/dataelements/mandt');
    console.log('=== MANDT Data Element XML ===');
    console.log(response.data);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();