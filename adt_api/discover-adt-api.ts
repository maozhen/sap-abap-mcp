/**
 * ADT API Discovery Script
 * 
 * This script discovers all available SAP ADT APIs by:
 * 1. Calling the ADT discovery endpoint (/sap/bc/adt/core/discovery)
 * 2. Parsing the AtomPub Service Document response
 * 3. Recursively exploring all API endpoints
 * 4. Extracting API metadata (methods, parameters, content types)
 * 5. Saving API documentation to the /adt_api directory
 * 
 * Usage: npx ts-node scripts/discover-adt-api.ts
 * 
 * Environment variables required:
 *   SAP_HOST, SAP_PORT, SAP_CLIENT, SAP_USER, SAP_PASSWORD
 */

import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { createADTClient, ADTClient } from '../src/clients/adt-client';
import { parseXML, ensureArray, getAttribute, getTextContent } from '../src/utils/xml-parser';

// Load environment variables
config();

// ============================================
// Type Definitions
// ============================================

interface TemplateLink {
  template: string;
  rel: string;
  type?: string;
  title?: string;
}

interface Collection {
  href: string;
  title?: string;
  categories?: Array<{
    term: string;
    scheme?: string;
    label?: string;
  }>;
  templateLinks?: TemplateLink[];
  acceptedContentTypes?: string[];
}

interface Workspace {
  title: string;
  collections: Collection[];
}

interface APIEndpoint {
  path: string;
  title?: string;
  description?: string;
  methods?: string[];
  contentTypes?: string[];
  templateLinks?: TemplateLink[];
  categories?: Array<{
    term: string;
    scheme?: string;
    label?: string;
  }>;
  children?: APIEndpoint[];
  metadata?: Record<string, unknown>;
}

interface DiscoveryResult {
  timestamp: string;
  host: string;
  client?: string;
  workspaces: Workspace[];
  totalCollections: number;
  totalEndpoints: number;
}

// ============================================
// Configuration
// ============================================

const OUTPUT_DIR = path.join('..', 'adt_api');
const MAX_DEPTH = 3; // Maximum recursion depth for API exploration
const EXPLORE_DELAY_MS = 100; // Delay between API calls to avoid overwhelming the server

// ============================================
// Helper Functions
// ============================================

function logSection(title: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(` ${title}`);
  console.log('='.repeat(60));
}

function logInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

function logWarning(message: string): void {
  console.log(`⚠️  ${message}`);
}

function logError(message: string): void {
  console.log(`❌ ${message}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    logInfo(`Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Save JSON data to file
 */
function saveJsonFile(filename: string, data: unknown): void {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  logSuccess(`Saved: ${filepath}`);
}

/**
 * Save Markdown documentation to file
 */
function saveMarkdownFile(filename: string, content: string): void {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content, 'utf-8');
  logSuccess(`Saved: ${filepath}`);
}

// ============================================
// AtomPub Service Document Parser
// ============================================

/**
 * Parse AtomPub Service Document from /sap/bc/adt/core/discovery
 * 
 * The response format is:
 * <app:service xmlns:app="http://www.w3.org/2007/app" xmlns:atom="http://www.w3.org/2005/Atom">
 *   <app:workspace>
 *     <atom:title>...</atom:title>
 *     <app:collection href="...">
 *       <atom:title>...</atom:title>
 *       <atom:category term="..." scheme="..." label="..."/>
 *       <adtcomp:templateLinks>
 *         <adtcomp:templateLink template="..." rel="..." type="..." title="..."/>
 *       </adtcomp:templateLinks>
 *     </app:collection>
 *   </app:workspace>
 * </app:service>
 */
function parseServiceDocument(xml: string): Workspace[] {
  const parsed = parseXML<Record<string, unknown>>(xml);
  const workspaces: Workspace[] = [];

  // Find the service element (with or without namespace prefix)
  let service: Record<string, unknown> | undefined;
  for (const key of Object.keys(parsed)) {
    if (key.endsWith('service') || key === 'service') {
      service = parsed[key] as Record<string, unknown>;
      break;
    }
  }

  if (!service) {
    logWarning('No service element found in response');
    return workspaces;
  }

  // Find all workspace elements
  let workspaceElements: unknown[] = [];
  for (const key of Object.keys(service)) {
    if (key.endsWith('workspace') || key === 'workspace') {
      workspaceElements = ensureArray(service[key] as unknown[]);
      break;
    }
  }

  for (const ws of workspaceElements) {
    const wsRecord = ws as Record<string, unknown>;
    const workspace: Workspace = {
      title: extractTitle(wsRecord),
      collections: []
    };

    // Find all collection elements
    let collectionElements: unknown[] = [];
    for (const key of Object.keys(wsRecord)) {
      if (key.endsWith('collection') || key === 'collection') {
        collectionElements = ensureArray(wsRecord[key] as unknown[]);
        break;
      }
    }

    for (const col of collectionElements) {
      const colRecord = col as Record<string, unknown>;
      const collection = parseCollection(colRecord);
      if (collection) {
        workspace.collections.push(collection);
      }
    }

    workspaces.push(workspace);
  }

  return workspaces;
}

/**
 * Extract title from element
 */
function extractTitle(element: Record<string, unknown>): string {
  for (const key of Object.keys(element)) {
    if (key.endsWith('title') || key === 'title') {
      const titleValue = element[key];
      if (typeof titleValue === 'string') {
        return titleValue;
      }
      if (typeof titleValue === 'object' && titleValue !== null) {
        return getTextContent(titleValue) || '';
      }
    }
  }
  return '';
}

/**
 * Parse a collection element
 */
function parseCollection(colRecord: Record<string, unknown>): Collection | null {
  // Get href attribute
  const href = getAttribute(colRecord, 'href');
  if (!href) {
    return null;
  }

  const collection: Collection = {
    href,
    title: extractTitle(colRecord),
    categories: [],
    templateLinks: [],
    acceptedContentTypes: []
  };

  // Parse categories
  for (const key of Object.keys(colRecord)) {
    if (key.endsWith('category') || key === 'category') {
      const categories = ensureArray(colRecord[key] as unknown[]);
      for (const cat of categories) {
        const catRecord = cat as Record<string, unknown>;
        collection.categories!.push({
          term: getAttribute(catRecord, 'term') || '',
          scheme: getAttribute(catRecord, 'scheme'),
          label: getAttribute(catRecord, 'label')
        });
      }
    }
  }

  // Parse template links
  for (const key of Object.keys(colRecord)) {
    if (key.includes('templateLink')) {
      if (key.includes('templateLinks')) {
        // Container element
        const container = colRecord[key] as Record<string, unknown>;
        for (const linkKey of Object.keys(container)) {
          if (linkKey.includes('templateLink') && !linkKey.includes('templateLinks')) {
            const links = ensureArray(container[linkKey] as unknown[]);
            for (const link of links) {
              const linkRecord = link as Record<string, unknown>;
              collection.templateLinks!.push({
                template: getAttribute(linkRecord, 'template') || '',
                rel: getAttribute(linkRecord, 'rel') || '',
                type: getAttribute(linkRecord, 'type'),
                title: getAttribute(linkRecord, 'title')
              });
            }
          }
        }
      } else {
        // Direct template link elements
        const links = ensureArray(colRecord[key] as unknown[]);
        for (const link of links) {
          const linkRecord = link as Record<string, unknown>;
          collection.templateLinks!.push({
            template: getAttribute(linkRecord, 'template') || '',
            rel: getAttribute(linkRecord, 'rel') || '',
            type: getAttribute(linkRecord, 'type'),
            title: getAttribute(linkRecord, 'title')
          });
        }
      }
    }
  }

  // Parse accepted content types
  for (const key of Object.keys(colRecord)) {
    if (key.endsWith('accept') || key === 'accept') {
      const accepts = ensureArray(colRecord[key] as unknown[]);
      for (const accept of accepts) {
        const acceptStr = typeof accept === 'string' ? accept : getTextContent(accept);
        if (acceptStr) {
          collection.acceptedContentTypes!.push(acceptStr);
        }
      }
    }
  }

  return collection;
}

// ============================================
// API Endpoint Exploration
// ============================================

/**
 * Explore an API endpoint and extract metadata
 */
async function exploreEndpoint(
  adtClient: ADTClient,
  path: string,
  depth: number = 0
): Promise<APIEndpoint | null> {
  if (depth > MAX_DEPTH) {
    return null;
  }

  try {
    // Normalize the path
    let normalizedPath = path;
    if (path.startsWith('/sap/bc/adt')) {
      normalizedPath = path.substring('/sap/bc/adt'.length);
    }

    const endpoint: APIEndpoint = {
      path: normalizedPath,
      children: []
    };

    // Try to get the endpoint with OPTIONS to discover allowed methods
    try {
      const response = await adtClient.get(normalizedPath, {
        headers: {
          'Accept': 'application/xml, application/atom+xml, application/atomsvc+xml, */*'
        },
        skipCSRF: true
      });

      if (response.raw) {
        // Try to parse as XML and extract metadata
        try {
          const parsed = parseXML<Record<string, unknown>>(response.raw);
          endpoint.metadata = parsed;

          // Extract title if available
          const title = extractTitle(parsed);
          if (title) {
            endpoint.title = title;
          }

          // Check if this is another service document
          for (const key of Object.keys(parsed)) {
            if (key.endsWith('service') || key === 'service') {
              // This is a sub-service document, parse it
              const subWorkspaces = parseServiceDocument(response.raw);
              for (const ws of subWorkspaces) {
                for (const col of ws.collections) {
                  endpoint.children!.push({
                    path: col.href,
                    title: col.title,
                    categories: col.categories,
                    templateLinks: col.templateLinks,
                    contentTypes: col.acceptedContentTypes
                  });
                }
              }
            }
          }
        } catch (parseError) {
          // Not XML or parse error, store raw content type
          endpoint.description = 'Non-XML response';
        }
      }

      // Store content type from response
      const contentType = response.headers['content-type'];
      if (contentType) {
        endpoint.contentTypes = [contentType];
      }

    } catch (error) {
      // Endpoint might not support GET, that's okay
      const errorMessage = error instanceof Error ? error.message : String(error);
      endpoint.description = `GET not supported: ${errorMessage}`;
    }

    return endpoint;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logWarning(`Failed to explore ${path}: ${errorMessage}`);
    return null;
  }
}

// ============================================
// Documentation Generator
// ============================================

/**
 * Generate Markdown documentation for all discovered APIs
 */
function generateMarkdownDoc(result: DiscoveryResult): string {
  const lines: string[] = [];

  lines.push('# SAP ADT API Discovery Report');
  lines.push('');
  lines.push(`**Generated:** ${result.timestamp}`);
  lines.push(`**Host:** ${result.host}`);
  if (result.client) {
    lines.push(`**Client:** ${result.client}`);
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Workspaces:** ${result.workspaces.length}`);
  lines.push(`- **Total Collections:** ${result.totalCollections}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  for (let i = 0; i < result.workspaces.length; i++) {
    const ws = result.workspaces[i];
    const anchor = ws.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    lines.push(`${i + 1}. [${ws.title}](#${anchor})`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Workspace details
  for (const ws of result.workspaces) {
    lines.push(`## ${ws.title}`);
    lines.push('');

    if (ws.collections.length === 0) {
      lines.push('*No collections in this workspace*');
      lines.push('');
      continue;
    }

    // Collections table
    lines.push('| Collection | Path | Categories |');
    lines.push('|------------|------|------------|');

    for (const col of ws.collections) {
      const title = col.title || '(Untitled)';
      const href = col.href;
      const categories = col.categories?.map(c => c.term).join(', ') || '-';
      lines.push(`| ${title} | \`${href}\` | ${categories} |`);
    }
    lines.push('');

    // Detailed collection info
    lines.push('### Collection Details');
    lines.push('');

    for (const col of ws.collections) {
      lines.push(`#### ${col.title || col.href}`);
      lines.push('');
      lines.push(`**Path:** \`${col.href}\``);
      lines.push('');

      if (col.categories && col.categories.length > 0) {
        lines.push('**Categories:**');
        lines.push('');
        for (const cat of col.categories) {
          lines.push(`- Term: \`${cat.term}\``);
          if (cat.scheme) {
            lines.push(`  - Scheme: \`${cat.scheme}\``);
          }
          if (cat.label) {
            lines.push(`  - Label: ${cat.label}`);
          }
        }
        lines.push('');
      }

      if (col.templateLinks && col.templateLinks.length > 0) {
        lines.push('**Template Links:**');
        lines.push('');
        for (const link of col.templateLinks) {
          lines.push(`- **${link.rel}**`);
          lines.push(`  - Template: \`${link.template}\``);
          if (link.type) {
            lines.push(`  - Type: \`${link.type}\``);
          }
          if (link.title) {
            lines.push(`  - Title: ${link.title}`);
          }
        }
        lines.push('');
      }

      if (col.acceptedContentTypes && col.acceptedContentTypes.length > 0) {
        lines.push('**Accepted Content Types:**');
        lines.push('');
        for (const ct of col.acceptedContentTypes) {
          lines.push(`- \`${ct}\``);
        }
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Generate a summary of all API paths
 */
function generatePathSummary(result: DiscoveryResult): string {
  const lines: string[] = [];
  const allPaths: string[] = [];

  lines.push('# SAP ADT API Paths');
  lines.push('');
  lines.push(`Generated: ${result.timestamp}`);
  lines.push('');
  lines.push('## All API Paths');
  lines.push('');

  for (const ws of result.workspaces) {
    for (const col of ws.collections) {
      allPaths.push(col.href);
      
      // Also add template links as paths
      if (col.templateLinks) {
        for (const link of col.templateLinks) {
          if (link.template) {
            allPaths.push(link.template);
          }
        }
      }
    }
  }

  // Sort and deduplicate paths
  const uniquePaths = [...new Set(allPaths)].sort();

  for (const p of uniquePaths) {
    lines.push(`- \`${p}\``);
  }

  lines.push('');
  lines.push(`**Total unique paths:** ${uniquePaths.length}`);

  return lines.join('\n');
}

// ============================================
// Main Discovery Function
// ============================================

async function discoverADTAPIs(): Promise<void> {
  logSection('SAP ADT API Discovery');
  
  console.log('');
  console.log('Environment Configuration:');
  console.log(`  Host: ${process.env.SAP_HOST}`);
  console.log(`  Client: ${process.env.SAP_CLIENT}`);
  console.log(`  Username: ${process.env.SAP_USER}`);
  console.log('');

  // Validate environment
  if (!process.env.SAP_HOST || !process.env.SAP_USER || !process.env.SAP_PASSWORD) {
    logError('Missing required environment variables: SAP_HOST, SAP_USER, SAP_PASSWORD');
    process.exit(1);
  }

  // Create ADT client
  const adtClient = createADTClient({
    host: process.env.SAP_HOST,
    port: parseInt(process.env.SAP_PORT || '443'),
    client: process.env.SAP_CLIENT || '',
    username: process.env.SAP_USER,
    password: process.env.SAP_PASSWORD,
    https: process.env.SAP_HTTPS !== 'false',
    allowInsecure: process.env.SAP_ALLOW_INSECURE === 'true',
    language: process.env.SAP_LANGUAGE || 'EN',
  });

  // Ensure output directory exists
  ensureOutputDir();

  // Step 1: Test connection
  logSection('Step 1: Testing Connection');
  const connected = await adtClient.testConnection();
  if (!connected) {
    logError('Failed to connect to SAP system');
    process.exit(1);
  }
  logSuccess('Connection successful');

  // Step 2: Fetch discovery document
  logSection('Step 2: Fetching ADT Discovery Document');
  
  let discoveryXml: string;
  try {
    const response = await adtClient.get('/discovery', {
      headers: {
        'Accept': 'application/atomsvc+xml'
      },
      skipCSRF: true
    });
    
    if (!response.raw) {
      throw new Error('Empty response from discovery endpoint');
    }
    
    discoveryXml = response.raw;
    logSuccess(`Received discovery document (${discoveryXml.length} bytes)`);

    // Save raw XML
    const rawXmlPath = path.join(OUTPUT_DIR, 'discovery-raw.xml');
    fs.writeFileSync(rawXmlPath, discoveryXml, 'utf-8');
    logSuccess(`Saved raw XML: ${rawXmlPath}`);

  } catch (error) {
    logError(`Failed to fetch discovery document: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // Step 3: Parse service document
  logSection('Step 3: Parsing Service Document');
  
  const workspaces = parseServiceDocument(discoveryXml);
  logSuccess(`Found ${workspaces.length} workspaces`);

  let totalCollections = 0;
  for (const ws of workspaces) {
    logInfo(`  Workspace: ${ws.title} (${ws.collections.length} collections)`);
    totalCollections += ws.collections.length;
  }
  logSuccess(`Total collections: ${totalCollections}`);

  // Step 4: Create discovery result
  logSection('Step 4: Generating Documentation');

  const result: DiscoveryResult = {
    timestamp: new Date().toISOString(),
    host: process.env.SAP_HOST,
    client: process.env.SAP_CLIENT,
    workspaces,
    totalCollections,
    totalEndpoints: totalCollections
  };

  // Save JSON result
  saveJsonFile('discovery-result.json', result);

  // Generate and save Markdown documentation
  const markdownDoc = generateMarkdownDoc(result);
  saveMarkdownFile('adt-api-reference.md', markdownDoc);

  // Generate and save path summary
  const pathSummary = generatePathSummary(result);
  saveMarkdownFile('adt-api-paths.md', pathSummary);

  // Step 5: Explore selected endpoints for more details
  logSection('Step 5: Exploring API Endpoints');
  
  const endpointsToExplore = [
    '/core/discovery',
    '/repository/informationsystem/search',
    '/activation',
    '/cts/transportrequests',
    '/programs/programs',
    '/oo/classes',
    '/oo/interfaces',
    '/functions/groups',
    '/ddic/domains',
    '/ddic/dataelements',
    '/ddic/tables',
    '/ddic/structures',
    '/ddic/tabletypes',
    '/ddls/sources',
    '/srvd/sources',
    '/srvb/bindings'
  ];

  const exploredEndpoints: APIEndpoint[] = [];

  for (const endpoint of endpointsToExplore) {
    logInfo(`Exploring: ${endpoint}`);
    const explored = await exploreEndpoint(adtClient, endpoint, 0);
    if (explored) {
      exploredEndpoints.push(explored);
    }
    await sleep(EXPLORE_DELAY_MS);
  }

  // Save explored endpoints
  saveJsonFile('explored-endpoints.json', exploredEndpoints);

  // Summary
  logSection('Discovery Complete');
  console.log('');
  console.log('Output files:');
  console.log(`  📄 ${path.join(OUTPUT_DIR, 'discovery-raw.xml')} - Raw XML response`);
  console.log(`  📄 ${path.join(OUTPUT_DIR, 'discovery-result.json')} - Parsed JSON result`);
  console.log(`  📄 ${path.join(OUTPUT_DIR, 'adt-api-reference.md')} - API reference documentation`);
  console.log(`  📄 ${path.join(OUTPUT_DIR, 'adt-api-paths.md')} - API paths summary`);
  console.log(`  📄 ${path.join(OUTPUT_DIR, 'explored-endpoints.json')} - Explored endpoint details`);
  console.log('');
  logSuccess('ADT API discovery completed successfully!');
}

// ============================================
// Main Entry Point
// ============================================

discoverADTAPIs().catch((error) => {
  console.error('Discovery script failed:', error);
  process.exit(1);
});