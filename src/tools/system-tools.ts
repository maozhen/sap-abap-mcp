/**
 * System Tools Handler
 * Handles system information, packages, message classes, and number ranges
 */

import { ADTClient } from '../clients/adt-client';
import {
  ToolResponse,
  ADTObject,
  ADTObjectType,
} from '../types';
import { buildXML, parseXML, getAttribute, getElement } from '../utils/xml-parser';
import { Logger, logger as defaultLogger } from '../utils/logger';
import { encodeObjectNameForUri } from '../utils/uri-helpers';

// Input interfaces
export interface GetSystemInfoInput {
  // No parameters needed, retrieves current system info
}

export interface GetPackageInfoInput {
  packageName: string;
}

export interface CreatePackageInput {
  name: string;
  description: string;
  superPackage?: string;
  softwareComponent?: string;
  applicationComponent?: string;
  transportLayer?: string;
  packageType?: 'development' | 'structure' | 'main';
  transportRequest?: string;
}

export interface GetMessageClassInput {
  messageClassName: string;
}

export interface CreateMessageClassInput {
  name: string;
  description: string;
  messages?: MessageDefinition[];
  packageName: string;
  transportRequest?: string;
}

export interface MessageDefinition {
  number: string;
  shortText: string;
  selfExplanatory?: boolean;
}

export interface GetNumberRangeInput {
  objectName: string;
}

export interface CreateNumberRangeInput {
  name: string;
  description: string;
  domainName?: string;
  numberLength: number;
  percentage?: number;
  intervals: NumberRangeInterval[];
  packageName: string;
  transportRequest?: string;
}

export interface NumberRangeInterval {
  subObject?: string;
  fromNumber: string;
  toNumber: string;
  currentNumber?: string;
  external?: boolean;
}

// Response interfaces
export interface SystemInfo {
  systemId: string;
  client: string;
  host: string;
  sapRelease: string;
  sapVersion: string;
  kernel: string;
  operatingSystem: string;
  database: string;
  unicode: boolean;
  installedLanguages: string[];
  systemTime: Date;
  systemType: string;
}

export interface PackageInfo {
  name: string;
  description: string;
  superPackage?: string;
  softwareComponent?: string;
  applicationComponent?: string;
  transportLayer?: string;
  packageType: string;
  responsible?: string;
  createdBy?: string;
  createdAt?: string;
  changedBy?: string;
  changedAt?: string;
  subPackages?: string[];
  objects?: PackageObjectInfo[];
}

export interface PackageObjectInfo {
  name: string;
  type: string;
  description?: string;
}

export interface MessageClass {
  name: string;
  description: string;
  messages: MessageEntry[];
  packageName: string;
  responsible?: string;
}

export interface MessageEntry {
  number: string;
  shortText: string;
  selfExplanatory: boolean;
}

export interface NumberRangeObject {
  name: string;
  description: string;
  domainName?: string;
  numberLength: number;
  percentage: number;
  intervals: NumberRangeIntervalInfo[];
  packageName: string;
}

export interface NumberRangeIntervalInfo {
  subObject?: string;
  fromNumber: string;
  toNumber: string;
  currentNumber: string;
  external: boolean;
  buffered?: boolean;
}

// ADT URI constants (relative to /sap/bc/adt base URL)
const SYSTEM_URI_PREFIX = '/core';
const PACKAGE_URI_PREFIX = '/packages';
const MESSAGE_CLASS_URI_PREFIX = '/messageclass';
const NUMBER_RANGE_URI_PREFIX = '/nrob';

export class SystemToolHandler {
  private readonly adtClient: ADTClient;
  private readonly logger: Logger;

  constructor(adtClient: ADTClient, logger?: Logger) {
    this.adtClient = adtClient;
    this.logger = logger ?? defaultLogger.child({ module: 'system-tools' });
  }

  /**
   * Get SAP system information
   * Returns system ID, release, kernel version, etc.
   * Note: The /core/systeminfo endpoint may not exist on all SAP systems,
   * so we gracefully handle 404 errors and use available data from /discovery
   * and connection info.
   */
  async getSystemInfo(args?: GetSystemInfoInput): Promise<ToolResponse<SystemInfo>> {
    this.logger.info('Getting system information');

    try {
      // Get system discovery information - this endpoint is always available
      const discoveryResponse = await this.adtClient.get('/discovery', {
        headers: { 'Accept': 'application/atomsvc+xml' },
      });

      // Try to get additional system details, but handle gracefully if endpoint doesn't exist
      let systemXml = '';
      try {
        const systemResponse = await this.adtClient.get(
          `${SYSTEM_URI_PREFIX}/systeminfo`,
          {
            headers: { 'Accept': 'application/xml' },
          }
        );
        systemXml = systemResponse.raw || '';
      } catch (systemInfoError) {
        // The /core/systeminfo endpoint may not exist on all SAP systems
        // Log as warning and continue with discovery info and connection details
        this.logger.warn(
          'System info endpoint not available, using discovery and connection info',
          systemInfoError
        );
      }

      const systemInfo = this.parseSystemInfoResponse(
        systemXml,
        discoveryResponse.raw || ''
      );

      this.logger.info(`System info retrieved: ${systemInfo.systemId || 'N/A'} (${systemInfo.sapRelease || 'N/A'})`);

      return { success: true, data: systemInfo };
    } catch (error) {
      this.logger.error('Failed to get system information', error);
      return this.createErrorResponse(
        'GET_SYSTEM_INFO_FAILED',
        `Failed to get system information: ${error}`,
        error
      );
    }
  }

  /**
   * Get package information
   * Returns package details including contents and hierarchy
   */
  async getPackageInfo(args: GetPackageInfoInput): Promise<ToolResponse<PackageInfo>> {
    this.logger.info(`Getting package info: ${args.packageName}`);

    try {
      // Use encodeObjectNameForUri to handle package names with '/' (namespaced packages)
      // e.g., /NAMESPACE/PACKAGE -> %2fnamespace%2fpackage
      const uri = `${PACKAGE_URI_PREFIX}/${encodeObjectNameForUri(args.packageName)}`;
      // Use flexible Accept header with fallback for different SAP versions
      const response = await this.adtClient.get(uri, {
        headers: { 'Accept': 'application/vnd.sap.adt.packages.v1+xml, application/xml, */*' },
      });

      const packageInfo = this.parsePackageInfoResponse(response.raw || '', args.packageName);

      this.logger.info(`Package info retrieved: ${packageInfo.name}`);

      return { success: true, data: packageInfo };
    } catch (error) {
      this.logger.error(`Failed to get package info for ${args.packageName}`, error);
      return this.createErrorResponse(
        'GET_PACKAGE_INFO_FAILED',
        `Failed to get package information: ${error}`,
        error
      );
    }
  }

  /**
   * Create a new package
   * Creates development, structure, or main package
   */
  async createPackage(args: CreatePackageInput): Promise<ToolResponse<PackageInfo>> {
    this.logger.info(`Creating package: ${args.name}`);

    try {
      const requestXml = this.buildPackageXML(args);
      // Use encodeObjectNameForUri to handle package names with '/' (namespaced packages)
      const uri = `${PACKAGE_URI_PREFIX}/${encodeObjectNameForUri(args.name)}`;

      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.packages.v1+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const packageInfo = this.parsePackageInfoResponse(response.raw || '', args.name);
      packageInfo.description = args.description;
      packageInfo.superPackage = args.superPackage;
      packageInfo.softwareComponent = args.softwareComponent;
      packageInfo.applicationComponent = args.applicationComponent;
      packageInfo.transportLayer = args.transportLayer;
      packageInfo.packageType = args.packageType || 'development';

      this.logger.info(`Package ${args.name} created successfully`);

      return { success: true, data: packageInfo };
    } catch (error) {
      this.logger.error(`Failed to create package ${args.name}`, error);
      return this.createErrorResponse(
        'CREATE_PACKAGE_FAILED',
        `Failed to create package: ${error}`,
        error
      );
    }
  }

  /**
   * Get message class definition
   * Returns message class with all message entries
   */
  async getMessageClass(args: GetMessageClassInput): Promise<ToolResponse<MessageClass>> {
    this.logger.info(`Getting message class: ${args.messageClassName}`);

    try {
      const uri = `${MESSAGE_CLASS_URI_PREFIX}/${args.messageClassName.toLowerCase()}`;
      // Use flexible Accept header with fallback for different SAP versions
      const response = await this.adtClient.get(uri, {
        headers: { 'Accept': 'application/vnd.sap.adt.messageclass.v2+xml, application/vnd.sap.adt.messageclass.v1+xml, application/xml, */*' },
      });

      const messageClass = this.parseMessageClassResponse(response.raw || '', args.messageClassName);

      this.logger.info(`Message class retrieved: ${messageClass.name} with ${messageClass.messages.length} messages`);

      return { success: true, data: messageClass };
    } catch (error) {
      this.logger.error(`Failed to get message class ${args.messageClassName}`, error);
      return this.createErrorResponse(
        'GET_MESSAGE_CLASS_FAILED',
        `Failed to get message class: ${error}`,
        error
      );
    }
  }

  /**
   * Create a new message class
   * Creates message class with message entries
   */
  async createMessageClass(args: CreateMessageClassInput): Promise<ToolResponse<MessageClass>> {
    this.logger.info(`Creating message class: ${args.name}`);

    try {
      const requestXml = this.buildMessageClassXML(args);
      const uri = `${MESSAGE_CLASS_URI_PREFIX}/${args.name.toLowerCase()}`;

      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.messageclass.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const messageClass: MessageClass = {
        name: args.name.toUpperCase(),
        description: args.description,
        messages: (args.messages || []).map(m => ({
          number: m.number,
          shortText: m.shortText,
          selfExplanatory: m.selfExplanatory || false,
        })),
        packageName: args.packageName,
      };

      this.logger.info(`Message class ${args.name} created successfully`);

      return { success: true, data: messageClass };
    } catch (error) {
      this.logger.error(`Failed to create message class ${args.name}`, error);
      return this.createErrorResponse(
        'CREATE_MESSAGE_CLASS_FAILED',
        `Failed to create message class: ${error}`,
        error
      );
    }
  }

  /**
   * Get number range object definition
   * Returns number range with intervals
   */
  async getNumberRange(args: GetNumberRangeInput): Promise<ToolResponse<NumberRangeObject>> {
    this.logger.info(`Getting number range: ${args.objectName}`);

    try {
      const uri = `${NUMBER_RANGE_URI_PREFIX}/${args.objectName.toLowerCase()}`;
      // Use flexible Accept header with fallback for different SAP versions
      const response = await this.adtClient.get(uri, {
        headers: { 'Accept': 'application/vnd.sap.adt.nrob.v1+xml, application/xml, */*' },
      });

      const numberRange = this.parseNumberRangeResponse(response.raw || '', args.objectName);

      this.logger.info(`Number range retrieved: ${numberRange.name} with ${numberRange.intervals.length} intervals`);

      return { success: true, data: numberRange };
    } catch (error) {
      this.logger.error(`Failed to get number range ${args.objectName}`, error);
      return this.createErrorResponse(
        'GET_NUMBER_RANGE_FAILED',
        `Failed to get number range: ${error}`,
        error
      );
    }
  }

  /**
   * Create a new number range object
   * Creates number range with intervals
   */
  async createNumberRange(args: CreateNumberRangeInput): Promise<ToolResponse<NumberRangeObject>> {
    this.logger.info(`Creating number range: ${args.name}`);

    try {
      const requestXml = this.buildNumberRangeXML(args);
      const uri = `${NUMBER_RANGE_URI_PREFIX}/${args.name.toLowerCase()}`;

      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.nrob.v1+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const numberRange: NumberRangeObject = {
        name: args.name.toUpperCase(),
        description: args.description,
        domainName: args.domainName,
        numberLength: args.numberLength,
        percentage: args.percentage || 10,
        intervals: args.intervals.map(i => ({
          subObject: i.subObject,
          fromNumber: i.fromNumber,
          toNumber: i.toNumber,
          currentNumber: i.currentNumber || i.fromNumber,
          external: i.external || false,
        })),
        packageName: args.packageName,
      };

      this.logger.info(`Number range ${args.name} created successfully`);

      return { success: true, data: numberRange };
    } catch (error) {
      this.logger.error(`Failed to create number range ${args.name}`, error);
      return this.createErrorResponse(
        'CREATE_NUMBER_RANGE_FAILED',
        `Failed to create number range: ${error}`,
        error
      );
    }
  }

  // ============================================
  // XML Building Methods
  // ============================================

  /**
   * Build package creation XML
   */
  private buildPackageXML(args: CreatePackageInput): string {
    const obj = {
      'pak:package': {
        '@_xmlns:pak': 'http://www.sap.com/adt/packages',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        'pak:superPackage': args.superPackage ? {
          '@_pak:name': args.superPackage.toUpperCase(),
        } : undefined,
        'pak:applicationComponent': args.applicationComponent ? {
          '@_pak:name': args.applicationComponent,
        } : undefined,
        'pak:softwareComponent': args.softwareComponent ? {
          '@_pak:name': args.softwareComponent,
        } : undefined,
        'pak:transportLayer': args.transportLayer ? {
          '@_pak:name': args.transportLayer,
        } : undefined,
        'pak:packageType': args.packageType || 'development',
      },
    };

    return buildXML(obj);
  }

  /**
   * Build message class creation XML
   */
  private buildMessageClassXML(args: CreateMessageClassInput): string {
    const messagesXml = (args.messages || []).map(m => ({
      '@_msag:number': m.number,
      '@_msag:shortText': m.shortText,
      '@_msag:selfExplanatory': m.selfExplanatory || false,
    }));

    const obj = {
      'msag:messageClass': {
        '@_xmlns:msag': 'http://www.sap.com/adt/messageclass',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:packageRef': args.packageName,
        ...(messagesXml.length > 0 && {
          'msag:messages': {
            'msag:message': messagesXml,
          },
        }),
      },
    };

    return buildXML(obj);
  }

  /**
   * Build number range creation XML
   */
  private buildNumberRangeXML(args: CreateNumberRangeInput): string {
    const intervalsXml = args.intervals.map(i => ({
      '@_nrob:subObject': i.subObject || '',
      '@_nrob:fromNumber': i.fromNumber,
      '@_nrob:toNumber': i.toNumber,
      '@_nrob:currentNumber': i.currentNumber || i.fromNumber,
      '@_nrob:external': i.external || false,
    }));

    const obj = {
      'nrob:numberRangeObject': {
        '@_xmlns:nrob': 'http://www.sap.com/adt/nrob',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:description': args.description,
        '@_adtcore:packageRef': args.packageName,
        '@_nrob:numberLength': args.numberLength,
        '@_nrob:percentage': args.percentage || 10,
        ...(args.domainName && { '@_nrob:domainName': args.domainName }),
        'nrob:intervals': {
          'nrob:interval': intervalsXml,
        },
      },
    };

    return buildXML(obj);
  }

  // ============================================
  // Response Parsing Methods
  // ============================================

  /**
   * Parse system info response
   */
  private parseSystemInfoResponse(systemXml: string, discoveryXml: string): SystemInfo {
    const systemParsed = parseXML<Record<string, unknown>>(systemXml);
    const discoveryParsed = parseXML<Record<string, unknown>>(discoveryXml);

    // Find system info elements
    const systemInfoNodes = this.findElements(systemParsed, 'systemInfo');
    const systemNode = systemInfoNodes[0] as Record<string, unknown> | undefined;

    let systemId = '';
    let client = '';
    let host = '';
    let sapRelease = '';
    let sapVersion = '';
    let kernel = '';
    let operatingSystem = '';
    let database = '';
    let unicode = true;
    const installedLanguages: string[] = [];
    let systemType = '';

    if (systemNode) {
      systemId = getAttribute(systemNode, 'systemId') || getAttribute(systemNode, 'sid') || '';
      client = getAttribute(systemNode, 'client') || '';
      host = getAttribute(systemNode, 'host') || '';
      sapRelease = getAttribute(systemNode, 'release') || getAttribute(systemNode, 'sapRelease') || '';
      sapVersion = getAttribute(systemNode, 'version') || getAttribute(systemNode, 'sapVersion') || '';
      kernel = getAttribute(systemNode, 'kernel') || getAttribute(systemNode, 'kernelRelease') || '';
      operatingSystem = getAttribute(systemNode, 'os') || getAttribute(systemNode, 'operatingSystem') || '';
      database = getAttribute(systemNode, 'database') || getAttribute(systemNode, 'db') || '';
      unicode = getAttribute(systemNode, 'unicode') !== 'false';
      systemType = getAttribute(systemNode, 'type') || getAttribute(systemNode, 'systemType') || '';

      // Parse installed languages
      const languageNodes = this.findElements(systemNode, 'language');
      for (const lang of languageNodes) {
        const langCode = typeof lang === 'string' ? lang : getAttribute(lang as Record<string, unknown>, 'code');
        if (langCode) {
          installedLanguages.push(langCode);
        }
      }
    }

    // Try to get additional info from discovery
    const connectionInfo = this.adtClient.getConnectionInfo();
    if (!host && connectionInfo.host) {
      host = connectionInfo.host;
    }
    if (!client && connectionInfo.client) {
      client = connectionInfo.client;
    }

    return {
      systemId,
      client,
      host,
      sapRelease,
      sapVersion,
      kernel,
      operatingSystem,
      database,
      unicode,
      installedLanguages,
      systemTime: new Date(),
      systemType,
    };
  }

  /**
   * Parse package info response
   */
  private parsePackageInfoResponse(xml: string, packageName: string): PackageInfo {
    const parsed = parseXML<Record<string, unknown>>(xml);

    const packageNodes = this.findElements(parsed, 'package');
    const packageNode = packageNodes[0] as Record<string, unknown> | undefined;

    let description = '';
    let superPackage: string | undefined;
    let softwareComponent: string | undefined;
    let applicationComponent: string | undefined;
    let transportLayer: string | undefined;
    let packageType = 'development';
    let responsible: string | undefined;
    let createdBy: string | undefined;
    let createdAt: string | undefined;
    let changedBy: string | undefined;
    let changedAt: string | undefined;
    const subPackages: string[] = [];
    const objects: PackageObjectInfo[] = [];

    if (packageNode) {
      description = getAttribute(packageNode, 'description') || '';
      responsible = getAttribute(packageNode, 'responsible');
      createdBy = getAttribute(packageNode, 'createdBy');
      createdAt = getAttribute(packageNode, 'createdAt');
      changedBy = getAttribute(packageNode, 'changedBy');
      changedAt = getAttribute(packageNode, 'changedAt');
      packageType = getAttribute(packageNode, 'packageType') || 'development';

      // Parse super package
      const superNodes = this.findElements(packageNode, 'superPackage');
      if (superNodes.length > 0) {
        superPackage = getAttribute(superNodes[0] as Record<string, unknown>, 'name');
      }

      // Parse software component
      const swcNodes = this.findElements(packageNode, 'softwareComponent');
      if (swcNodes.length > 0) {
        softwareComponent = getAttribute(swcNodes[0] as Record<string, unknown>, 'name');
      }

      // Parse application component
      const appNodes = this.findElements(packageNode, 'applicationComponent');
      if (appNodes.length > 0) {
        applicationComponent = getAttribute(appNodes[0] as Record<string, unknown>, 'name');
      }

      // Parse transport layer
      const tlNodes = this.findElements(packageNode, 'transportLayer');
      if (tlNodes.length > 0) {
        transportLayer = getAttribute(tlNodes[0] as Record<string, unknown>, 'name');
      }

      // Parse sub packages
      const subPkgNodes = this.findElements(packageNode, 'subPackage');
      for (const subPkg of subPkgNodes) {
        const subName = getAttribute(subPkg as Record<string, unknown>, 'name');
        if (subName) {
          subPackages.push(subName);
        }
      }

      // Parse package objects
      const objectNodes = this.findElements(packageNode, 'object');
      for (const obj of objectNodes) {
        const objRecord = obj as Record<string, unknown>;
        objects.push({
          name: getAttribute(objRecord, 'name') || '',
          type: getAttribute(objRecord, 'type') || '',
          description: getAttribute(objRecord, 'description'),
        });
      }
    }

    return {
      name: packageName.toUpperCase(),
      description,
      superPackage,
      softwareComponent,
      applicationComponent,
      transportLayer,
      packageType,
      responsible,
      createdBy,
      createdAt,
      changedBy,
      changedAt,
      subPackages: subPackages.length > 0 ? subPackages : undefined,
      objects: objects.length > 0 ? objects : undefined,
    };
  }

  /**
   * Parse message class response
   */
  private parseMessageClassResponse(xml: string, messageClassName: string): MessageClass {
    const parsed = parseXML<Record<string, unknown>>(xml);

    const classNodes = this.findElements(parsed, 'messageClass');
    const classNode = classNodes[0] as Record<string, unknown> | undefined;

    let description = '';
    let packageName = '';
    let responsible: string | undefined;
    const messages: MessageEntry[] = [];

    if (classNode) {
      description = getAttribute(classNode, 'description') || '';
      packageName = getAttribute(classNode, 'packageRef') || getAttribute(classNode, 'package') || '';
      responsible = getAttribute(classNode, 'responsible');

      // Parse messages
      const messageNodes = this.findElements(classNode, 'message');
      for (const msg of messageNodes) {
        const msgRecord = msg as Record<string, unknown>;
        messages.push({
          number: getAttribute(msgRecord, 'number') || '',
          shortText: getAttribute(msgRecord, 'shortText') || getAttribute(msgRecord, 'text') || '',
          selfExplanatory: getAttribute(msgRecord, 'selfExplanatory') === 'true',
        });
      }
    }

    return {
      name: messageClassName.toUpperCase(),
      description,
      messages,
      packageName,
      responsible,
    };
  }

  /**
   * Parse number range response
   */
  private parseNumberRangeResponse(xml: string, objectName: string): NumberRangeObject {
    const parsed = parseXML<Record<string, unknown>>(xml);

    const nrobNodes = this.findElements(parsed, 'numberRangeObject');
    const nrobNode = nrobNodes[0] as Record<string, unknown> | undefined;

    let description = '';
    let domainName: string | undefined;
    let numberLength = 10;
    let percentage = 10;
    let packageName = '';
    const intervals: NumberRangeIntervalInfo[] = [];

    if (nrobNode) {
      description = getAttribute(nrobNode, 'description') || '';
      domainName = getAttribute(nrobNode, 'domainName');
      numberLength = parseInt(getAttribute(nrobNode, 'numberLength') || '10', 10);
      percentage = parseInt(getAttribute(nrobNode, 'percentage') || '10', 10);
      packageName = getAttribute(nrobNode, 'packageRef') || getAttribute(nrobNode, 'package') || '';

      // Parse intervals
      const intervalNodes = this.findElements(nrobNode, 'interval');
      for (const interval of intervalNodes) {
        const intRecord = interval as Record<string, unknown>;
        intervals.push({
          subObject: getAttribute(intRecord, 'subObject'),
          fromNumber: getAttribute(intRecord, 'fromNumber') || '',
          toNumber: getAttribute(intRecord, 'toNumber') || '',
          currentNumber: getAttribute(intRecord, 'currentNumber') || '',
          external: getAttribute(intRecord, 'external') === 'true',
          buffered: getAttribute(intRecord, 'buffered') === 'true',
        });
      }
    }

    return {
      name: objectName.toUpperCase(),
      description,
      domainName,
      numberLength,
      percentage,
      intervals,
      packageName,
    };
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Find elements in parsed XML by tag name (handles namespaces)
   */
  private findElements(obj: unknown, tagName: string): unknown[] {
    const results: unknown[] = [];

    const search = (current: unknown): void => {
      if (!current || typeof current !== 'object') return;

      if (Array.isArray(current)) {
        for (const item of current) {
          search(item);
        }
        return;
      }

      const record = current as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        // Check if key matches tag name (with or without namespace prefix)
        if (key === tagName || key.endsWith(`:${tagName}`)) {
          const value = record[key];
          if (Array.isArray(value)) {
            results.push(...value);
          } else {
            results.push(value);
          }
        }
        // Recurse into nested objects
        search(record[key]);
      }
    };

    search(obj);
    return results;
  }

  /**
   * Create error response
   */
  private createErrorResponse<T>(code: string, message: string, error?: unknown): ToolResponse<T> {
    return {
      success: false,
      error: {
        code,
        message,
        details: error instanceof Error ? error.message : String(error),
        innerError: error instanceof Error ? error : undefined,
      },
    };
  }
}

export default SystemToolHandler;