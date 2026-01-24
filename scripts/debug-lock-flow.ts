/**
 * Debug script for SAP ADT lock-update-unlock flow
 * This script provides detailed logging to diagnose the "invalid lock handle" error
 */

import * as dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';

// Load environment variables
dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(level: string, msg: string): void {
  const timestamp = new Date().toISOString();
  const color = level === 'ERROR' ? colors.red : 
                level === 'WARN' ? colors.yellow : 
                level === 'INFO' ? colors.blue : colors.dim;
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}[${level}]${colors.reset} ${msg}`);
}

function logHeader(title: string): void {
  console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

function logHeaders(headers: Record<string, string | string[] | undefined>, prefix: string = ''): void {
  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      const displayValue = Array.isArray(value) ? value.join('; ') : value;
      // Truncate long values
      const truncated = displayValue.length > 100 ? displayValue.substring(0, 100) + '...' : displayValue;
      console.log(`${colors.dim}${prefix}${key}: ${truncated}${colors.reset}`);
    }
  }
}

async function main(): Promise<void> {
  logHeader('SAP ADT Lock Flow Debug Script');
  
  // Validate environment
  const host = process.env.SAP_HOST;
  const port = process.env.SAP_PORT;
  const client = process.env.SAP_CLIENT;
  const username = process.env.SAP_USER;
  const password = process.env.SAP_PASSWORD;
  
  if (!host || !port || !client || !username || !password) {
    console.error(`${colors.red}Missing required environment variables${colors.reset}`);
    process.exit(1);
  }
  
  const baseURL = `https://${host}:${port}/sap/bc/adt`;
  const reportName = 'ymcp_rpt' + Date.now().toString().slice(-6);
  
  log('INFO', `Base URL: ${baseURL}`);
  log('INFO', `Report Name: ${reportName}`);
  log('INFO', `Client: ${client}, User: ${username}`);
  
  // Create axios instance
  const httpClient: AxiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      'Accept': 'application/xml, text/plain, */*',
      'Content-Type': 'application/xml'
    },
    transformResponse: [(data) => data]
  });
  
  // Session state
  let sessionCookies: string[] = [];
  let csrfToken: string | null = null;
  
  // Generate a unique connection ID (like Eclipse ADT does)
  // This ID is used to correlate lock and update requests
  const connectionId = crypto.randomUUID().replace(/-/g, '');
  log('INFO', `Connection ID: ${connectionId}`);
  
  // Helper to get auth header
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  
  // Helper to build cookie header
  const getCookieHeader = (): string => {
    return sessionCookies.map(c => c.split(';')[0]).join('; ');
  };
  
  // Helper to update cookies from response
  const updateCookies = (setCookieHeaders: string | string[] | undefined): void => {
    if (!setCookieHeaders) return;
    const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    
    for (const cookie of cookies) {
      const cookieName = cookie.split('=')[0];
      // Replace existing cookie with same name
      sessionCookies = sessionCookies.filter(c => !c.startsWith(cookieName + '='));
      sessionCookies.push(cookie);
    }
    
    log('DEBUG', `Updated cookies: ${getCookieHeader().substring(0, 100)}...`);
  };
  
  try {
    // ========================================
    // Step 1: Fetch CSRF Token
    // ========================================
    logHeader('Step 1: Fetch CSRF Token');
    
    log('INFO', 'GET /discovery with X-CSRF-Token: Fetch');
    
    const csrfResponse = await httpClient.get('/discovery', {
      headers: {
        'Authorization': authHeader,
        'sap-client': client,
        'X-CSRF-Token': 'Fetch',
        'Accept': 'application/atomsvc+xml'
      }
    });
    
    log('INFO', `Response Status: ${csrfResponse.status}`);
    log('INFO', 'Response Headers:');
    logHeaders(csrfResponse.headers as Record<string, string>, '  ');
    
    csrfToken = csrfResponse.headers['x-csrf-token'] as string;
    updateCookies(csrfResponse.headers['set-cookie']);
    
    if (!csrfToken || csrfToken === 'unsafe') {
      throw new Error(`Invalid CSRF token: ${csrfToken}`);
    }
    
    log('INFO', `${colors.green}CSRF Token: ${csrfToken.substring(0, 20)}...${colors.reset}`);
    
    // ========================================
    // Step 2: Create Test Report
    // ========================================
    logHeader('Step 2: Create Test Report');
    
    const createBody = `<?xml version="1.0" encoding="UTF-8"?>
<program:abapProgram xmlns:program="http://www.sap.com/adt/programs/programs" 
  xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:type="PROG/P"
  adtcore:name="${reportName.toUpperCase()}"
  adtcore:description="MCP Debug Test"
  adtcore:language="EN">
  <adtcore:packageRef adtcore:name="$TMP"/>
</program:abapProgram>`;
    
    log('INFO', `POST /programs/programs`);
    log('DEBUG', `Request Body:\n${createBody}`);
    
    const createHeaders = {
      'Authorization': authHeader,
      'sap-client': client,
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/vnd.sap.adt.programs.programs.v2+xml',
      'Cookie': getCookieHeader()
    };
    
    log('DEBUG', 'Request Headers:');
    logHeaders(createHeaders, '  ');
    
    try {
      const createResponse = await httpClient.post('/programs/programs', createBody, {
        headers: createHeaders
      });
      
      log('INFO', `Response Status: ${createResponse.status}`);
      updateCookies(createResponse.headers['set-cookie']);
      log('INFO', `${colors.green}Report created successfully${colors.reset}`);
    } catch (error: any) {
      if (error.response?.status === 500 && error.response?.data?.includes('already exists')) {
        log('WARN', 'Report already exists, continuing with existing report');
      } else {
        throw error;
      }
    }
    
    // ========================================
    // Step 3: Lock the Report
    // ========================================
    logHeader('Step 3: Lock the Report');
    
    // Based on Eclipse ADT logs, locking is done at /programs/programs/ level
    // The critical element is the sap-adt-connection-id header which correlates
    // the LOCK and PUT requests
    const lockUrl = `/programs/programs/${reportName}?_action=LOCK&accessMode=MODIFY`;
    
    log('INFO', `POST ${lockUrl}`);
    
    const lockHeaders = {
      'Authorization': authHeader,
      'sap-client': client,
      'X-CSRF-Token': csrfToken,
      'Cookie': getCookieHeader(),
      'sap-adt-connection-id': connectionId,
      'X-sap-adt-sessiontype': 'stateful',  // CRITICAL: Must be stateful for lock!
      'Accept': 'application/vnd.sap.as+xml;charset=UTF-8;dataname=com.sap.adt.lock.result'
    };
    
    log('DEBUG', 'Request Headers:');
    logHeaders(lockHeaders, '  ');
    
    const lockResponse = await httpClient.post(lockUrl, undefined, {
      headers: lockHeaders
    });
    
    log('INFO', `Response Status: ${lockResponse.status}`);
    log('INFO', 'Response Headers:');
    logHeaders(lockResponse.headers as Record<string, string>, '  ');
    log('INFO', `Response Body:\n${colors.dim}${lockResponse.data}${colors.reset}`);
    
    updateCookies(lockResponse.headers['set-cookie']);
    
    // Extract lock handle
    const lockHandleMatch = (lockResponse.data as string).match(/<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i);
    if (!lockHandleMatch) {
      throw new Error('Failed to extract lock handle from response');
    }
    
    const lockHandle = lockHandleMatch[1];
    log('INFO', `${colors.green}Lock Handle: ${lockHandle}${colors.reset}`);
    
    // ========================================
    // Step 4: Update Source Code
    // ========================================
    logHeader('Step 4: Update Source Code');
    
    const sourceUri = `/programs/programs/${reportName}/source/main?lockHandle=${lockHandle}`;
    const sourceCode = `REPORT ${reportName}.
* Updated by debug script
WRITE: / 'Hello from debug test'.`;
    
    log('INFO', `PUT ${sourceUri}`);
    log('DEBUG', `Source Code:\n${sourceCode}`);
    
    const updateHeaders = {
      'Authorization': authHeader,
      'sap-client': client,
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cookie': getCookieHeader(),
      'sap-adt-connection-id': connectionId,
      'X-sap-adt-sessiontype': 'stateful'  // Must also be stateful for update
    };
    
    log('DEBUG', 'Request Headers:');
    logHeaders(updateHeaders, '  ');
    
    try {
      const updateResponse = await httpClient.put(sourceUri, sourceCode, {
        headers: updateHeaders
      });
      
      log('INFO', `Response Status: ${updateResponse.status}`);
      log('INFO', 'Response Headers:');
      logHeaders(updateResponse.headers as Record<string, string>, '  ');
      
      updateCookies(updateResponse.headers['set-cookie']);
      log('INFO', `${colors.green}Source updated successfully!${colors.reset}`);
      
    } catch (error: any) {
      log('ERROR', `Update failed: ${error.response?.status} ${error.response?.statusText}`);
      log('ERROR', `Response Body:\n${error.response?.data}`);
      log('ERROR', 'Response Headers:');
      if (error.response?.headers) {
        logHeaders(error.response.headers as Record<string, string>, '  ');
      }
      throw error;
    }
    
    // ========================================
    // Step 5: Unlock the Report
    // ========================================
    logHeader('Step 5: Unlock the Report');
    
    const unlockUrl = `/programs/programs/${reportName}?_action=UNLOCK&lockHandle=${lockHandle}`;
    
    log('INFO', `POST ${unlockUrl}`);
    
    const unlockHeaders = {
      'Authorization': authHeader,
      'sap-client': client,
      'X-CSRF-Token': csrfToken,
      'Cookie': getCookieHeader(),
      'sap-adt-connection-id': connectionId,
      'X-sap-adt-sessiontype': 'stateless'  // Can be stateless for unlock
    };
    
    log('DEBUG', 'Request Headers:');
    logHeaders(unlockHeaders, '  ');
    
    const unlockResponse = await httpClient.post(unlockUrl, undefined, {
      headers: unlockHeaders
    });
    
    log('INFO', `Response Status: ${unlockResponse.status}`);
    updateCookies(unlockResponse.headers['set-cookie']);
    log('INFO', `${colors.green}Unlock successful${colors.reset}`);
    
    // ========================================
    // Summary
    // ========================================
    logHeader('Test Completed Successfully!');
    
    console.log(`${colors.green}${colors.bold}All steps completed successfully!${colors.reset}`);
    console.log(`\nThe lock-update-unlock flow is working correctly.`);
    
  } catch (error: any) {
    log('ERROR', `Test failed: ${error.message}`);
    if (error.response) {
      log('ERROR', `HTTP Status: ${error.response.status}`);
      log('ERROR', `Response: ${error.response.data}`);
    }
    process.exit(1);
  }
}

main().catch(console.error);