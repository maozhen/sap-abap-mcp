/**
 * XML Parser Utilities for ADT API
 * Handles parsing and building of ADT XML responses and requests
 */

import { XMLParser, XMLBuilder, XmlBuilderOptions } from 'fast-xml-parser';

// XML Parser configuration for ADT responses
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
  parseTagValue: true,
  isArray: (name: string, jpath: string, isLeafNode: boolean, isAttribute: boolean) => {
    // Define which elements should always be arrays
    const arrayElements = [
      'entry',
      'atom:entry',
      'field',
      'parameter',
      'exception',
      'component',
      'object',
      'message',
      'result',
      'task',
      'collection',
      'category',
      'fixedValue',
      'association',
      'annotation',
    ];
    return arrayElements.some(elem => name.endsWith(elem));
  },
};

// XML Builder configuration for ADT requests
const builderOptions: XmlBuilderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
  suppressBooleanAttributes: false,
};

/**
 * Parse XML string to JavaScript object
 */
export function parseXML<T = unknown>(xml: string): T {
  const parser = new XMLParser(parserOptions);
  return parser.parse(xml) as T;
}

/**
 * Build XML string from JavaScript object
 */
export function buildXML(obj: object, rootName?: string): string {
  const builder = new XMLBuilder(builderOptions);
  
  if (rootName) {
    return builder.build({ [rootName]: obj });
  }
  return builder.build(obj);
}

/**
 * Extract namespace-prefixed element value
 */
export function getElement(obj: object, ...keys: string[]): unknown {
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    if (typeof current !== 'object') {
      return undefined;
    }
    
    const record = current as Record<string, unknown>;
    
    // Try exact key first
    if (key in record) {
      current = record[key];
      continue;
    }
    
    // Try with common namespace prefixes
    const prefixes = ['', 'atom:', 'adtcore:', 'asx:', 'abapsource:', 'class:', 'intf:'];
    let found = false;
    
    for (const prefix of prefixes) {
      const prefixedKey = prefix + key;
      if (prefixedKey in record) {
        current = record[prefixedKey];
        found = true;
        break;
      }
    }
    
    if (!found) {
      return undefined;
    }
  }
  
  return current;
}

/**
 * Get attribute value from element
 */
export function getAttribute(obj: object, attrName: string): string | undefined {
  // Type guard: ensure obj is a valid object before using 'in' operator
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return undefined;
  }
  
  const record = obj as Record<string, unknown>;
  const attrKey = `@_${attrName}`;
  
  if (attrKey in record) {
    const value = record[attrKey];
    return value !== undefined && value !== null ? String(value) : undefined;
  }
  
  // Try with namespace prefixes
  const prefixes = ['adtcore:', 'atom:', 'asx:', 'abapsource:', 'srvb:', 'srvd:', 'ddl:'];
  for (const prefix of prefixes) {
    const prefixedAttrKey = `@_${prefix}${attrName}`;
    if (prefixedAttrKey in record) {
      const value = record[prefixedAttrKey];
      return value !== undefined && value !== null ? String(value) : undefined;
    }
  }
  
  return undefined;
}

/**
 * Get text content from element
 */
export function getTextContent(obj: unknown): string | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  
  if (typeof obj === 'string') {
    return obj;
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }
  
  if (typeof obj === 'object') {
    const record = obj as Record<string, unknown>;
    if ('#text' in record) {
      return String(record['#text']);
    }
  }
  
  return undefined;
}

/**
 * Ensure value is an array
 */
export function ensureArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

/**
 * ADT Atom Feed Parser
 */
export interface AtomEntry {
  id?: string;
  title?: string;
  updated?: string;
  content?: unknown;
  links?: AtomLink[];
  categories?: AtomCategory[];
}

export interface AtomLink {
  href: string;
  rel?: string;
  type?: string;
  title?: string;
}

export interface AtomCategory {
  term: string;
  scheme?: string;
  label?: string;
}

/**
 * Parse Atom feed entries
 */
export function parseAtomFeed(xml: string): AtomEntry[] {
  const parsed = parseXML<Record<string, unknown>>(xml);
  const feed = getElement(parsed, 'feed') as Record<string, unknown> | undefined;
  
  if (!feed) {
    return [];
  }
  
  const entries = ensureArray(getElement(feed, 'entry') as Record<string, unknown>[]);
  
  return entries.map(entry => {
    const links = ensureArray(getElement(entry, 'link') as Record<string, unknown>[]);
    const categories = ensureArray(getElement(entry, 'category') as Record<string, unknown>[]);
    
    return {
      id: getTextContent(getElement(entry, 'id')),
      title: getTextContent(getElement(entry, 'title')),
      updated: getTextContent(getElement(entry, 'updated')),
      content: getElement(entry, 'content'),
      links: links.map(link => ({
        href: getAttribute(link, 'href') || '',
        rel: getAttribute(link, 'rel'),
        type: getAttribute(link, 'type'),
        title: getAttribute(link, 'title'),
      })),
      categories: categories.map(cat => ({
        term: getAttribute(cat, 'term') || '',
        scheme: getAttribute(cat, 'scheme'),
        label: getAttribute(cat, 'label'),
      })),
    };
  });
}

/**
 * Build ADT object creation XML
 */
export function buildADTObjectXML(
  objectType: string,
  name: string,
  description: string,
  packageName: string,
  additionalProperties?: Record<string, unknown>
): string {
  const namespaces = {
    '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
    '@_xmlns:atom': 'http://www.w3.org/2005/Atom',
  };
  
  const obj: Record<string, unknown> = {
    ...namespaces,
    '@_adtcore:name': name,
    '@_adtcore:description': description,
    '@_adtcore:packageRef': packageName,
    ...additionalProperties,
  };
  
  return buildXML(obj, objectType);
}

/**
 * Build activation request XML
 */
export function buildActivationXML(objectUris: string[]): string {
  const entries = objectUris.map(uri => ({
    '@_adtcore:uri': uri,
  }));
  
  return buildXML({
    'adtcore:objectReferences': {
      '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
      'adtcore:objectReference': entries,
    },
  });
}

/**
 * Parse activation response
 */
export interface ActivationMessage {
  uri: string;
  type: 'error' | 'warning' | 'info';
  shortText: string;
  longText?: string;
  line?: number;
  column?: number;
}

export function parseActivationResponse(xml: string): ActivationMessage[] {
  const parsed = parseXML<Record<string, unknown>>(xml);
  const messages: ActivationMessage[] = [];
  
  const checkMessages = getElement(parsed, 'chkMessages', 'chkMessage');
  const msgArray = ensureArray(checkMessages as Record<string, unknown>[]);
  
  for (const msg of msgArray) {
    messages.push({
      uri: getAttribute(msg, 'uri') || '',
      type: (getAttribute(msg, 'type') || 'error') as 'error' | 'warning' | 'info',
      shortText: getTextContent(getElement(msg, 'shortText')) || '',
      longText: getTextContent(getElement(msg, 'longText')),
      line: parseInt(getAttribute(msg, 'line') || '0', 10) || undefined,
      column: parseInt(getAttribute(msg, 'column') || '0', 10) || undefined,
    });
  }
  
  return messages;
}

/**
 * Parse syntax check response
 */
export interface SyntaxError {
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  offset?: number;
  length?: number;
}

export function parseSyntaxCheckResponse(xml: string): SyntaxError[] {
  const parsed = parseXML<Record<string, unknown>>(xml);
  const errors: SyntaxError[] = [];
  
  const checkRun = getElement(parsed, 'checkRun') as Record<string, unknown> | undefined;
  if (!checkRun) {
    return errors;
  }
  
  const messages = ensureArray(getElement(checkRun, 'checkMessage') as Record<string, unknown>[]);
  
  for (const msg of messages) {
    const severity = getAttribute(msg, 'type') || 'error';
    errors.push({
      severity: severity as 'error' | 'warning' | 'info',
      message: getTextContent(getElement(msg, 'shortText')) || getAttribute(msg, 'shortText') || '',
      line: parseInt(getAttribute(msg, 'line') || '1', 10),
      column: parseInt(getAttribute(msg, 'column') || '1', 10),
      offset: parseInt(getAttribute(msg, 'offset') || '0', 10) || undefined,
      length: parseInt(getAttribute(msg, 'length') || '0', 10) || undefined,
    });
  }
  
  return errors;
}

/**
 * Build source code update XML
 */
export function buildSourceCodeXML(sourceCode: string): string {
  return sourceCode;  // ADT accepts plain text for source code updates
}

/**
 * Parse object structure from ADT response
 */
export interface ADTObjectInfo {
  name: string;
  type: string;
  uri: string;
  packageName?: string;
  description?: string;
  responsible?: string;
  masterLanguage?: string;
  createdAt?: string;
  changedAt?: string;
  changedBy?: string;
  version?: string;
}

export function parseADTObjectInfo(xml: string): ADTObjectInfo | null {
  const parsed = parseXML<Record<string, unknown>>(xml);
  
  // Try to find the root object element
  const rootKeys = Object.keys(parsed);
  if (rootKeys.length === 0) {
    return null;
  }
  
  const root = parsed[rootKeys[0]] as Record<string, unknown>;
  if (!root || typeof root !== 'object') {
    return null;
  }
  
  return {
    name: getAttribute(root, 'name') || '',
    type: getAttribute(root, 'type') || '',
    uri: getAttribute(root, 'uri') || '',
    packageName: getAttribute(root, 'packageRef'),
    description: getAttribute(root, 'description'),
    responsible: getAttribute(root, 'responsible'),
    masterLanguage: getAttribute(root, 'masterLanguage'),
    createdAt: getAttribute(root, 'createdAt'),
    changedAt: getAttribute(root, 'changedAt'),
    changedBy: getAttribute(root, 'changedBy'),
    version: getAttribute(root, 'version'),
  };
}