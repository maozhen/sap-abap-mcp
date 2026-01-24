/**
 * Debug script to test locking at INCLUDE level
 * SAP ADT treats program source code as INCLUDE type objects
 */

import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';
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
 * Merge cookies
 */
function mergeCookies(existing: string | null, newCookies: Map<string, string>): string {
  const cookieMap = new Map<string, string>();
  
  if (existing) {
    for (const cookie of existing.split('; ')) {
      const eqIndex = cookie.indexOf('=');
      if (eqIndex > 0) {
        const name = cookie.substring(0, eqIndex).trim();
        cookieMap.set(name, cookie);
      }
    }
  }
  
  for (const [name, value] of newCookies) {
    cookieMap.set(name, value);
  }
  
  return Array.from(cookieMap.values()).join('; ');
}

async function main(): Promise<void> {
  log('bright', '======================================================================');
  log('bright', 'Lock Mechanism Debug - Testing INCLUDE level locking');
  log('bright', '======================================================================\n');

  // Generate unique test report name
  const testReportName = `YMCP_LOCK_${Math.floor(Math.random() * 900000) + 100000}`;
  const reportUri = `/programs/programs/${testReportName.toLowerCase()}`;
  const includeUri = `/programs/includes/${testReportName.toLowerCase()}`;
  
  log('blue', `Test report: ${testReportName}`);
  log('blue', `Program URI: ${reportUri}`);
  log('blue', `Include URI: ${includeUri}`);
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

  // Request interceptor
  client.interceptors.request.use((reqConfig) => {
    reqConfig.headers['Authorization'] = `Basic ${auth}`;
    reqConfig.headers['sap-client'] = config.client;
    
    if (sessionCookies) {
      reqConfig.headers['Cookie'] = sessionCookies;
    }
    
    return reqConfig;
  });

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        const newCookies = parseSetCookies(setCookie);
        sessionCookies = mergeCookies(sessionCookies, newCookies);
      }
      return response;
    },
    (error) => {
      if (error.response) {
        const setCookie = error.response.headers['set-cookie'];
        if (setCookie) {
          const newCookies = parseSetCookies(setCookie);
          sessionCookies = mergeCookies(sessionCookies, newCookies);
        }
      }
      return Promise.reject(error);
    }
  );

  try {
    // Step 1: Fetch CSRF Token
    log('yellow', '\n--- Step 1: Fetch CSRF Token ---');
    
    const discoveryResponse = await client.get('/discovery', {
      headers: {
        'X-CSRF-Token': 'Fetch',
        'Accept': 'application/atomsvc+xml'
      }
    });
    
    csrfToken = discoveryResponse.headers['x-csrf-token'] as string;
    log('green', `  CSRF Token: ${csrfToken ? String(csrfToken).substring(0, 30) : 'null'}...`);

    // Step 2: Create test report
    log('yellow', '\n--- Step 2: Create Test Report ---');
    
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

    // Step 3: Try to lock at INCLUDE level
    log('yellow', '\n--- Step 3: Lock at INCLUDE level ---');
    log('blue', `  POST ${includeUri}?_action=LOCK&accessMode=MODIFY`);
    
    try {
      const lockResponse = await client.post(
        `${includeUri}?_action=LOCK&accessMode=MODIFY`,
        undefined,
        {
          headers: {
            'X-CSRF-Token': csrfToken!,
          }
        }
      );
      
      const lockResponseData = lockResponse.data as string;
      log('cyan', `  Lock response:\n${lockResponseData}`);
      
      const lockHandleMatch = lockResponseData.match(/<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i);
      if (lockHandleMatch) {
        lockHandle = lockHandleMatch[1];
        log('green', `  Include lock acquired: ${lockHandle}`);
      }
    } catch (lockError: unknown) {
      const le = lockError as { response?: { status: number; statusText: string; data?: string } };
      log('red', `  Include lock failed: ${le.response?.status} ${le.response?.statusText}`);
      log('red', `  Error: ${typeof le.response?.data === 'string' ? le.response.data.substring(0, 300) : le.response?.data}`);
      
      // If include lock fails, try with /source/main
      log('yellow', '\n--- Step 3b: Try locking with /source/main ---');
      log('blue', `  POST ${reportUri}/source/main?_action=LOCK&accessMode=MODIFY`);
      
      try {
        const lockResponse2 = await client.post(
          `${reportUri}/source/main?_action=LOCK&accessMode=MODIFY`,
          undefined,
          {
            headers: {
              'X-CSRF-Token': csrfToken!,
            }
          }
        );
        
        const lockResponseData2 = lockResponse2.data as string;
        log('cyan', `  Lock response:\n${lockResponseData2}`);
        
        const lockHandleMatch2 = lockResponseData2.match(/<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i);
        if (lockHandleMatch2) {
          lockHandle = lockHandleMatch2[1];
          log('green', `  Source/main lock acquired: ${lockHandle}`);
        }
      } catch (lockError2: unknown) {
        const le2 = lockError2 as { response?: { status: number; statusText: string; data?: string } };
        log('red', `  Source/main lock failed: ${le2.response?.status} ${le2.response?.statusText}`);
        
        // Fall back to program level lock
        log('yellow', '\n--- Step 3c: Fall back to PROGRAM level lock ---');
        const lockResponse3 = await client.post(
          `${reportUri}?_action=LOCK&accessMode=MODIFY`,
          undefined,
          {
            headers: {
              'X-CSRF-Token': csrfToken!,
            }
          }
        );
        
        const lockResponseData3 = lockResponse3.data as string;
        const lockHandleMatch3 = lockResponseData3.match(/<LOCK_HANDLE>([^<]+)<\/LOCK_HANDLE>/i);
        if (lockHandleMatch3) {
          lockHandle = lockHandleMatch3[1];
          log('green', `  Program lock acquired: ${lockHandle}`);
        }
      }
    }

    if (!lockHandle) {
      throw new Error('Failed to acquire any lock');
    }

    // Step 4: Read source code to get ETag
    log('yellow', '\n--- Step 4: Read Source Code ---');
    
    const readResponse = await client.get(`${reportUri}/source/main`, {
      headers: { 'Accept': 'text/plain' }
    });
    
    const etag = readResponse.headers['etag'] as string || null;
    log('green', `  Source read successfully`);
    log('cyan', `  ETag: ${etag || '(not provided)'}`);

    // Step 5: Test different PUT approaches
    log('yellow', '\n--- Step 5: Try different PUT approaches ---');
    
    const newSource = `REPORT ${testReportName.toLowerCase()}.
* Updated by lock debug script
WRITE: / 'Hello from lock test'.
`;

    // Approach 5a: PUT to program URI (not /source/main)
    log('blue', '\n  Approach 5a: PUT to program URI directly');
    log('blue', `  PUT ${reportUri}?lockHandle=${lockHandle}`);
    
    try {
      await client.put(
        reportUri,
        newSource,
        {
          headers: {
            'X-CSRF-Token': csrfToken!,
            'Content-Type': 'text/plain',
            ...(etag && { 'If-Match': etag })
          },
          params: { lockHandle }
        }
      );
      log('green', '  Approach 5a: SUCCESS!');
    } catch (e5a: unknown) {
      const err = e5a as { response?: { status: number; data?: string } };
      log('red', `  Approach 5a failed: ${err.response?.status}`);
      log('dim', `  ${typeof err.response?.data === 'string' ? err.response.data.substring(0, 200) : ''}`);
    }

    // Approach 5b: PUT to include URI
    log('blue', '\n  Approach 5b: PUT to include URI');
    log('blue', `  PUT ${includeUri}?lockHandle=${lockHandle}`);
    
    try {
      await client.put(
        includeUri,
        newSource,
        {
          headers: {
            'X-CSRF-Token': csrfToken!,
            'Content-Type': 'text/plain',
            ...(etag && { 'If-Match': etag })
          },
          params: { lockHandle }
        }
      );
      log('green', '  Approach 5b: SUCCESS!');
    } catch (e5b: unknown) {
      const err = e5b as { response?: { status: number; data?: string } };
      log('red', `  Approach 5b failed: ${err.response?.status}`);
      log('dim', `  ${typeof err.response?.data === 'string' ? err.response.data.substring(0, 200) : ''}`);
    }

    // Approach 5c: PUT to include/source/main
    log('blue', '\n  Approach 5c: PUT to include/source/main');
    log('blue', `  PUT ${includeUri}/source/main?lockHandle=${lockHandle}`);
    
    try {
      await client.put(
        `${includeUri}/source/main`,
        newSource,
        {
          headers: {
            'X-CSRF-Token': csrfToken!,
            'Content-Type': 'text/plain',
            ...(etag && { 'If-Match': etag })
          },
          params: { lockHandle }
        }
      );
      log('green', '  Approach 5c: SUCCESS!');
    } catch (e5c: unknown) {
      const err = e5c as { response?: { status: number; data?: string } };
      log('red', `  Approach 5c failed: ${err.response?.status}`);
      log('dim', `  ${typeof err.response?.data === 'string' ? err.response.data.substring(0, 200) : ''}`);
    }

    // Approach 5d: PUT with X-Sap-Adt-LockHandle header instead of query param
    log('blue', '\n  Approach 5d: PUT with X-Sap-Adt-LockHandle header');
    log('blue', `  PUT ${reportUri}/source/main with header`);
    
    try {
      await client.put(
        `${reportUri}/source/main`,
        newSource,
        {
          headers: {
            'X-CSRF-Token': csrfToken!,
            'Content-Type': 'text/plain',
            'X-Sap-Adt-LockHandle': lockHandle,
            ...(etag && { 'If-Match': etag })
          }
        }
      );
      log('green', '  Approach 5d: SUCCESS!');
    } catch (e5d: unknown) {
      const err = e5d as { response?: { status: number; data?: string } };
      log('red', `  Approach 5d failed: ${err.response?.status}`);
      log('dim', `  ${typeof err.response?.data === 'string' ? err.response.data.substring(0, 200) : ''}`);
    }

    // Step 6: Unlock
    log('yellow', '\n--- Step 6: Unlock Object ---');
    
    // Try unlocking at program level
    try {
      await client.post(
        reportUri,
        undefined,
        {
          headers: { 'X-CSRF-Token': csrfToken! },
          params: { '_action': 'UNLOCK', 'lockHandle': lockHandle }
        }
      );
      log('green', '  Program unlock successful');
    } catch {
      log('dim', '  Program unlock failed');
    }

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
        await client.post(
          reportUri,
          undefined,
          {
            headers: { 'X-CSRF-Token': csrfToken! },
            params: { '_action': 'UNLOCK', 'lockHandle': lockHandle }
          }
        );
        log('green', 'Cleanup unlock successful');
      } catch {
        log('dim', 'Cleanup unlock failed');
      }
    }
  }

  log('bright', '\n======================================================================');
  log('bright', 'Debug Complete');
  log('bright', '======================================================================');
}

main().catch(console.error);