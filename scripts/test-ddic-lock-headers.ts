/**
 * SAP ABAP MCP Server - Test DDIC Lock Headers
 * Explores different Accept headers for DDIC table lock operations
 */

import * as dotenv from 'dotenv';
import axios from 'axios';
import * as https from 'https';

// Load environment variables
dotenv.config();

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function logInfo(message: string): void {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

function logSuccess(message: string): void {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function logError(message: string): void {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

function logWarning(message: string): void {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

async function main(): Promise<void> {
  console.log(`\n${colors.bold}${colors.cyan}=== Test DDIC Lock Accept Headers ===${colors.reset}\n`);

  const host = process.env.SAP_HOST!;
  const port = parseInt(process.env.SAP_PORT!, 10);
  const username = process.env.SAP_USER!;
  const password = process.env.SAP_PASSWORD!;
  const client = process.env.SAP_CLIENT!;
  const useTls = process.env.SAP_USE_TLS === 'true';

  const baseURL = `${useTls ? 'https' : 'http'}://${host}:${port}/sap/bc/adt`;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  // Create axios instance
  const httpClient = axios.create({
    baseURL,
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    validateStatus: () => true // Accept all status codes
  });

  // Default headers
  const defaultHeaders = {
    'Authorization': `Basic ${auth}`,
    'sap-client': client,
    'X-sap-adt-sessiontype': 'stateful'
  };

  // First, get CSRF token
  logInfo('Fetching CSRF token...');
  const tokenResponse = await httpClient.get('/discovery', {
    headers: {
      ...defaultHeaders,
      'X-CSRF-Token': 'Fetch'
    }
  });
  const csrfToken = tokenResponse.headers['x-csrf-token'];
  const cookies = tokenResponse.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ');
  
  if (!csrfToken || csrfToken === 'unsafe') {
    logError('Failed to get CSRF token');
    return;
  }
  logSuccess(`Got CSRF token: ${csrfToken.substring(0, 20)}...`);

  // Use an existing table - look for YMCP_T809831 created earlier or use standard table
  const tableName = 'ymcp_t809831';
  const tableUri = `/ddic/tables/${tableName}`;

  // Different Accept headers to try
  const acceptHeaders = [
    // Standard XML types
    'application/xml',
    '*/*',
    
    // SAP ADT generic types
    'application/vnd.sap.adt.repository.object.v1+xml',
    'application/vnd.sap.as+xml',
    
    // Table-specific types
    'application/vnd.sap.adt.tables.v2+xml',
    'application/vnd.sap.as.adt.tables.v2+xml',
    'application/vnd.sap.adt.tables+xml',
    
    // DDIC-specific types
    'application/vnd.sap.adt.ddic.v1+xml',
    'application/vnd.sap.adt.ddic.tables+xml',
    
    // Lock-specific types
    'application/vnd.sap.as.adt.lock.v1+xml',
    'application/vnd.sap.adt.lock+xml',
    
    // Combined types
    'application/xml, */*',
    'application/vnd.sap.adt.tables.v2+xml, application/xml, */*',
    
    // Try without Accept header
    'text/plain',
    'text/html',
  ];

  console.log(`\n${colors.bold}Testing lock on: ${tableUri}${colors.reset}\n`);

  for (const acceptHeader of acceptHeaders) {
    try {
      const response = await httpClient.post(
        `${tableUri}?_action=LOCK&accessMode=MODIFY`,
        undefined,
        {
          headers: {
            ...defaultHeaders,
            'X-CSRF-Token': csrfToken,
            'Cookie': cookies || '',
            'Accept': acceptHeader
          }
        }
      );

      if (response.status === 200) {
        logSuccess(`Accept: "${acceptHeader}" => ${response.status} OK`);
        console.log(`  Response (first 200 chars): ${response.data?.substring(0, 200)}`);
        
        // Extract lock handle and unlock
        const lockMatch = response.data?.match(/<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i);
        if (lockMatch) {
          const lockHandle = lockMatch[1];
          logInfo(`  Lock handle: ${lockHandle.substring(0, 30)}...`);
          
          // Unlock
          await httpClient.post(tableUri, undefined, {
            headers: {
              ...defaultHeaders,
              'X-CSRF-Token': csrfToken,
              'Cookie': cookies || ''
            },
            params: {
              '_action': 'UNLOCK',
              'lockHandle': lockHandle
            }
          });
          logInfo('  Unlocked successfully');
        }
        break;
      } else {
        logWarning(`Accept: "${acceptHeader}" => ${response.status} ${response.statusText}`);
        if (response.status === 406) {
          // Show what content types the server suggests
          const contentType = response.headers['content-type'];
          if (contentType) {
            console.log(`  Server content-type: ${contentType}`);
          }
        }
      }
    } catch (error) {
      logError(`Accept: "${acceptHeader}" => Error: ${error}`);
    }
  }

  // Also try to see what content-type a successful GET returns
  console.log(`\n${colors.bold}Checking GET content-type for table:${colors.reset}\n`);
  
  const getResponse = await httpClient.get(tableUri, {
    headers: {
      ...defaultHeaders,
      'Accept': '*/*'
    }
  });
  
  logInfo(`GET ${tableUri} returned status: ${getResponse.status}`);
  logInfo(`Content-Type: ${getResponse.headers['content-type']}`);
  
  console.log(`\n${colors.bold}${colors.green}=== Test Complete ===${colors.reset}\n`);
}

// Run the test
main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});