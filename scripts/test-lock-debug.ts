/**
 * Debug script to trace lock mechanism and session cookies
 * This script tests the lock/update/unlock flow with detailed logging
 */

import 'dotenv/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as https from 'https';

// Configuration from environment
const config = {
  host: process.env.SAP_HOST || 'localhost',
  port: parseInt(process.env.SAP_PORT || '443'),
  username: process.env.SAP_USER || '',
  password: process.env.SAP_PASSWORD || '',
  client: process.env.SAP_CLIENT || '001',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color: keyof typeof colors, ...args: unknown[]): void {
  console.log(colors[color], ...args, colors.reset);
}

/**
 * Parse set-cookie header and extract name=value pairs
 */
function parseSetCookies(setCookieHeader: string | string[]): Map<string, string> {
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  const cookieMap = new Map<string, string>();
  
  for (const cookie of cookies) {
    // Extract name=value part (before any attributes)
    const cookiePart = cookie.split(';')[0];
    if (cookiePart) {
      const eqIndex = cookiePart.indexOf('=');
      if (eqIndex > 0) {
        const name = cookiePart.substring(0, eqIndex).trim();
        cookieMap.set(name, cookiePart.trim());
      }
    }
  }
  
  return cookieMap;
}

/**
 * Merge cookies, updating existing ones
 */
function mergeCookies(existing: string | null, newCookies: Map<string, string>): string {
  const cookieMap = new Map<string, string>();
  
  // Parse existing cookies
  if (existing) {
    for (const cookie of existing.split('; ')) {
      const eqIndex = cookie.indexOf('=');
      if (eqIndex > 0) {
        const name = cookie.substring(0, eqIndex).trim();
        cookieMap.set(name, cookie);
      }
    }
  }
  
  // Merge new cookies
  for (const [name, value] of newCookies) {
    cookieMap.set(name, value);
  }
  
  return Array.from(cookieMap.values()).join('; ');
}

async function main(): Promise<void> {
  log('bright', '======================================================================');
  log('bright', 'Lock Mechanism Debug Script');
  log('bright', '======================================================================\n');

  // Generate unique test report name
  const testReportName = `YMCP_LOCK_${Math.floor(Math.random() * 900000) + 100000}`;
  // Note: reportUri should NOT include /sap/bc/adt prefix since baseURL already includes it
  const reportUri = `/programs/programs/${testReportName.toLowerCase()}`;
  
  log('blue', `Test report: ${testReportName}`);
  log('blue', `Report URI: ${reportUri}`);
  log('blue', `Host: ${config.host}:${config.port}`);
  log('blue', `Client: ${config.client}, User: ${config.username}\n`);

  const baseURL = `https://${config.host}:${config.port}/sap/bc/adt`;
  const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

  // State tracking
  let sessionCookies: string | null = null;
  let csrfToken: string | null = null;
  let lockHandle: string | null = null;

  // Create axios instance
  const client: AxiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    transformResponse: [(data) => data],
    withCredentials: true,
  });

  // Request interceptor - add auth and cookies
  client.interceptors.request.use((reqConfig) => {
    reqConfig.headers['Authorization'] = `Basic ${auth}`;
    reqConfig.headers['sap-client'] = config.client;
    
    if (sessionCookies) {
      reqConfig.headers['Cookie'] = sessionCookies;
      log('cyan', `  [REQUEST] Cookie: ${String(sessionCookies).substring(0, 80)}...`);
    }
    
    return reqConfig;
  });

  // Response interceptor - capture cookies
  client.interceptors.response.use(
    (response) => {
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        const newCookies = parseSetCookies(setCookie);
        log('magenta', `  [RESPONSE] Set-Cookie received: ${newCookies.size} cookies`);
        for (const [name, value] of newCookies) {
          log('dim', `    ${name}: ${String(value).substring(0, 50)}...`);
        }
        sessionCookies = mergeCookies(sessionCookies, newCookies);
        log('green', `  [SESSION] Updated cookies: ${String(sessionCookies).substring(0, 80)}...`);
      }
      return response;
    },
    (error) => {
      if (error.response) {
        const setCookie = error.response.headers['set-cookie'];
        if (setCookie) {
          const newCookies = parseSetCookies(setCookie);
          log('magenta', `  [ERROR RESPONSE] Set-Cookie received: ${newCookies.size} cookies`);
          sessionCookies = mergeCookies(sessionCookies, newCookies);
        }
      }
      return Promise.reject(error);
    }
  );

  try {
    // Step 1: Fetch CSRF Token
    log('yellow', '\n--- Step 1: Fetch CSRF Token ---');
    log('blue', '  GET /discovery');
    
    const discoveryResponse = await client.get('/discovery', {
      headers: {
        'X-CSRF-Token': 'Fetch',
        'Accept': 'application/atomsvc+xml'
      }
    });
    
    csrfToken = discoveryResponse.headers['x-csrf-token'] as string;
    log('green', `  CSRF Token: ${csrfToken ? String(csrfToken).substring(0, 30) : 'null'}...`);
    log('dim', `  Session after discovery: ${sessionCookies ? String(sessionCookies).substring(0, 80) : 'null'}...`);

    // Step 2: Create test report
    log('yellow', '\n--- Step 2: Create Test Report ---');
    log('blue', `  POST ${reportUri}`);
    
    const createBody = `<?xml version="1.0" encoding="UTF-8"?>
<program:abapProgram xmlns:program="http://www.sap.com/adt/programs/programs" 
  xmlns:adtcore="http://www.sap.com/adt/core" 
  adtcore:type="PROG/P" 
  adtcore:name="${testReportName}" 
  adtcore:description="MCP Lock Test Report">
  <adtcore:packageRef adtcore:name="$TMP"/>
</program:abapProgram>`;
    
    await client.post(reportUri, createBody, {
      headers: {
        'X-CSRF-Token': csrfToken!,
        'Content-Type': 'application/vnd.sap.adt.programs.programs.v2+xml'
      }
    });
    
    log('green', '  Report created successfully');
    log('dim', `  Session after create: ${sessionCookies ? String(sessionCookies).substring(0, 80) : 'null'}...`);

    // Step 3: Lock at PROGRAM level (not source/main)
    // SAP ADT behavior: lock the program, but update the source/main
    log('yellow', '\n--- Step 3: Lock Object ---');
    const sourceUri = `${reportUri}/source/main`;
    log('blue', `  Locking at PROGRAM level: ${reportUri}`);
    log('blue', `  POST ${reportUri}?_action=LOCK&accessMode=MODIFY`);
    
    const lockResponse = await client.post(
      `${reportUri}?_action=LOCK&accessMode=MODIFY`,
      undefined,
      {
        headers: {
          'X-CSRF-Token': csrfToken!,
        }
      }
    );
    log('green', '  Program lock succeeded');
    
    // Parse full lock response
    const lockResponseData = lockResponse.data as string;
    log('cyan', `  Full lock response:\n${lockResponseData}`);
    
    // Parse lock handle
    const lockHandleMatch = lockResponseData.match(/<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i);
    if (!lockHandleMatch) {
      throw new Error('Failed to get lock handle from response');
    }
    lockHandle = lockHandleMatch[1];
    
    // Check for transport request number
    const corrnrMatch = lockResponseData.match(/<CORRNR>([^<]*)<\/CORRNR>/i);
    const corrText = lockResponseData.match(/<CORRTEXT>([^<]*)<\/CORRTEXT>/i);
    
    log('green', `  Lock acquired: ${lockHandle}`);
    log('blue', `  Transport Request: ${corrnrMatch ? corrnrMatch[1] || '(empty)' : 'not found'}`);
    log('blue', `  Transport Text: ${corrText ? corrText[1] || '(empty)' : 'not found'}`);
    log('dim', `  Session after lock: ${sessionCookies ? String(sessionCookies).substring(0, 80) : 'null'}...`);

    // Step 3.5: Read source code to get ETag
    log('yellow', '\n--- Step 3.5: Read Source Code (get ETag) ---');
    log('blue', `  GET ${reportUri}/source/main`);
    
    let etag: string | null = null;
    const readResponse = await client.get(`${reportUri}/source/main`, {
      headers: {
        'Accept': 'text/plain'
      }
    });
    
    // Get ETag from response
    etag = readResponse.headers['etag'] as string || null;
    log('green', `  Source read successfully`);
    log('cyan', `  ETag: ${etag || '(not provided)'}`);
    log('dim', `  All response headers: ${JSON.stringify(readResponse.headers, null, 2)}`);

    // Step 4: Update source code (this is where it fails)
    log('yellow', '\n--- Step 4: Update Source Code ---');
    log('blue', `  PUT ${reportUri}/source/main?lockHandle=${lockHandle}`);
    
    const newSource = `REPORT ${testReportName.toLowerCase()}.
* Updated by lock debug script
WRITE: / 'Hello from lock test'.
`;
    
    log('dim', `  Using CSRF Token: ${csrfToken ? String(csrfToken).substring(0, 30) : 'null'}...`);
    log('dim', `  Using Session Cookies: ${sessionCookies ? String(sessionCookies).substring(0, 80) : 'null'}...`);
    log('dim', `  Using Lock Handle: ${lockHandle}`);
    log('dim', `  Using ETag (If-Match): ${etag || '(not using)'}`);
    
    // Build headers - include If-Match if we have an ETag
    const updateHeaders: Record<string, string> = {
      'X-CSRF-Token': csrfToken!,
      'Content-Type': 'text/plain'
    };
    
    if (etag) {
      updateHeaders['If-Match'] = etag;
    }
    
    try {
      await client.put(
        `${reportUri}/source/main`,
        newSource,
        {
          headers: updateHeaders,
          params: {
            lockHandle: lockHandle
          }
        }
      );
      
      log('green', '  Source updated successfully!');
    } catch (updateError: unknown) {
      const ue = updateError as { response?: { status: number; statusText: string; data?: string } };
      log('red', `  Update failed: ${ue.response?.status} ${ue.response?.statusText}`);
      log('red', `  Error body: ${typeof ue.response?.data === 'string' ? ue.response.data.substring(0, 500) : ue.response?.data}`);
      
      // Check if session changed
      log('dim', `  Session after failed update: ${sessionCookies ? String(sessionCookies).substring(0, 80) : 'null'}...`);
    }

    // Step 5: Unlock at PROGRAM level
    log('yellow', '\n--- Step 5: Unlock Object ---');
    log('blue', `  POST ${reportUri}?_action=UNLOCK&lockHandle=${lockHandle}`);
    
    await client.post(
      reportUri,
      undefined,
      {
        headers: {
          'X-CSRF-Token': csrfToken!,
        },
        params: {
          '_action': 'UNLOCK',
          'lockHandle': lockHandle
        }
      }
    );
    
    log('green', '  Object unlocked');

  } catch (error: unknown) {
    const err = error as { message?: string; response?: { status: number; data?: string } };
    log('red', `\nError: ${err.message || 'Unknown error'}`);
    if (err.response) {
      log('red', `Status: ${err.response.status}`);
      log('red', `Body: ${typeof err.response.data === 'string' ? err.response.data.substring(0, 500) : err.response.data}`);
    }
    
    // Try to unlock if we have a lock handle
    if (lockHandle) {
      try {
        log('yellow', '\nAttempting cleanup unlock at PROGRAM level...');
        await client.post(
          reportUri,
          undefined,
          {
            headers: {
              'X-CSRF-Token': csrfToken!,
            },
            params: {
              '_action': 'UNLOCK',
              'lockHandle': lockHandle
            }
          }
        );
        log('green', 'Cleanup unlock successful');
      } catch (unlockError) {
        log('dim', 'Cleanup unlock failed (may be expected)');
      }
    }
  }

  log('bright', '\n======================================================================');
  log('bright', 'Debug Complete');
  log('bright', '======================================================================');
}

main().catch(console.error);