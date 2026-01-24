/**
 * DDIC (Data Dictionary) Tools Handler
 * Handles creation and management of DDIC objects
 */

import { ADTClient, LockHandle } from '../clients/adt-client';
import {
  ToolResponse,
  DataElement,
  Domain,
  DatabaseTable,
  TableField,
  Structure,
  StructureComponent,
  TableType,
  ADTObject,
  ADTObjectType,
  ActivationResult,
  CreateDataElementInput,
  CreateDomainInput,
  CreateTableInput,
} from '../types';
import { buildXML, parseXML, getAttribute, getElement } from '../utils/xml-parser';
import { Logger, logger as defaultLogger } from '../utils/logger';

// Input interfaces
export interface CreateStructureInput {
  name: string;
  description: string;
  components: Array<{
    name: string;
    dataElement?: string;
    dataType?: string;
    length?: number;
    decimals?: number;
    description?: string;
  }>;
  includeStructures?: string[];
  packageName: string;
  transportRequest?: string;
}

export interface CreateTableTypeInput {
  name: string;
  description: string;
  lineType: string;
  lineTypeKind: 'structure' | 'dataElement' | 'predefined';
  accessMode: 'standard' | 'sorted' | 'hashed' | 'index';
  keyDefinition?: 'standard' | 'empty' | 'components';
  keyComponents?: string[];
  primaryKeyType?: 'unique' | 'nonUnique';
  packageName: string;
  transportRequest?: string;
}

export interface GetDDICObjectInput {
  name: string;
  objectType: 'DTEL' | 'DOMA' | 'TABL' | 'STRU' | 'TTYP';
}

export interface ActivateDDICObjectInput {
  name: string;
  objectType: 'DTEL' | 'DOMA' | 'TABL' | 'STRU' | 'TTYP';
}

const DDIC_URI_PREFIXES: Record<string, string> = {
  DTEL: '/ddic/dataelements',
  DOMA: '/ddic/domains',
  TABL: '/ddic/tables',
  STRU: '/ddic/structures',
  TTYP: '/ddic/tabletypes',
};

export class DDICToolHandler {
  private readonly adtClient: ADTClient;
  private readonly logger: Logger;

  constructor(adtClient: ADTClient, logger?: Logger) {
    this.adtClient = adtClient;
    this.logger = logger ?? defaultLogger.child({ module: 'ddic-tools' });
  }

  /**
   * Create a new data element
   * POST to collection URL: /ddic/dataelements (not /ddic/dataelements/{name})
   */
  async createDataElement(args: CreateDataElementInput): Promise<ToolResponse<DataElement>> {
    this.logger.info(`Creating data element: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = DDIC_URI_PREFIXES.DTEL;

    try {
      const requestXml = this.buildDataElementXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.dataelements.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const dataElement = this.parseDataElementResponse(response.raw || '', args);
      this.logger.info(`Data element ${args.name} created successfully`);
      return { success: true, data: dataElement };
    } catch (error) {
      this.logger.error(`Failed to create data element ${args.name}`, error);
      return this.createErrorResponse('CREATE_DTEL_FAILED', `Failed to create data element: ${error}`, error);
    }
  }

  /**
   * Create a new domain
   * POST to collection URL: /ddic/domains (not /ddic/domains/{name})
   */
  async createDomain(args: CreateDomainInput): Promise<ToolResponse<Domain>> {
    this.logger.info(`Creating domain: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = DDIC_URI_PREFIXES.DOMA;

    try {
      const requestXml = this.buildDomainXML(args);
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.domains.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const domain = this.parseDomainResponse(response.raw || '', args);
      this.logger.info(`Domain ${args.name} created successfully`);
      return { success: true, data: domain };
    } catch (error) {
      this.logger.error(`Failed to create domain ${args.name}`, error);
      return this.createErrorResponse('CREATE_DOMA_FAILED', `Failed to create domain: ${error}`, error);
    }
  }

  /**
   * Create a new database table
   * Uses two-step approach like Class/FM/Report:
   * 1. POST to create basic table structure (metadata only)
   * 2. Lock -> updateObjectSource -> unlock to set DDL source with fields
   */
  async createDatabaseTable(args: CreateTableInput): Promise<ToolResponse<DatabaseTable>> {
    this.logger.info(`Creating database table: ${args.name}`);
    const collectionUri = DDIC_URI_PREFIXES.TABL;
    const objectUri = `${collectionUri}/${args.name.toLowerCase()}`;
    const sourceUri = `${objectUri}/source/main`;

    try {
      // Step 1: Create basic table structure (metadata only, no fields)
      const requestXml = this.buildTableMetadataXML(args);
      this.logger.debug(`Table creation XML:\n${requestXml}`);
      
      await this.adtClient.post(collectionUri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.tables.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });
      this.logger.info(`Table ${args.name} basic structure created`);

      // Step 2: Update source with complete DDL (including fields)
      const ddlSource = this.buildTableDDLSource(args);
      this.logger.debug(`Table DDL source:\n${ddlSource}`);

      // Lock, update source, unlock
      const lock = await this.adtClient.lockObject(objectUri);
      this.logger.debug(`Table ${args.name} locked with handle: ${lock.lockHandle}`);
      
      await this.adtClient.updateObjectSource(sourceUri, ddlSource, lock.lockHandle);
      this.logger.info(`Table ${args.name} DDL source updated`);
      
      await this.adtClient.unlockObject(objectUri, lock.lockHandle);
      this.logger.debug(`Table ${args.name} unlocked`);

      const table = this.parseTableResponse('', args);
      this.logger.info(`Database table ${args.name} created successfully with ${args.fields.length} fields`);
      return { success: true, data: table };
    } catch (error) {
      this.logger.error(`Failed to create database table ${args.name}`, error);
      return this.createErrorResponse('CREATE_TABL_FAILED', `Failed to create database table: ${error}`, error);
    }
  }

  /**
   * Create a new structure
   * POST to collection URL: /ddic/structures (not /ddic/structures/{name})
   */
  async createStructure(args: CreateStructureInput): Promise<ToolResponse<Structure>> {
    this.logger.info(`Creating structure: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = DDIC_URI_PREFIXES.STRU;

    try {
      const requestXml = this.buildStructureXML(args);
      // SAP ADT structures use specific Content-Type
      // Try application/vnd.sap.adt.structures.v2+xml for structure metadata
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.structures.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const structure = this.parseStructureResponse(response.raw || '', args);
      this.logger.info(`Structure ${args.name} created successfully`);
      return { success: true, data: structure };
    } catch (error) {
      this.logger.error(`Failed to create structure ${args.name}`, error);
      return this.createErrorResponse('CREATE_STRU_FAILED', `Failed to create structure: ${error}`, error);
    }
  }

  /**
   * Create a new table type
   * POST to collection URL: /ddic/tabletypes (not /ddic/tabletypes/{name})
   */
  async createTableType(args: CreateTableTypeInput): Promise<ToolResponse<TableType>> {
    this.logger.info(`Creating table type: ${args.name}`);
    // POST to collection URL, not object URL
    const uri = DDIC_URI_PREFIXES.TTYP;

    try {
      const requestXml = this.buildTableTypeXML(args);
      // SAP ADT table types use specific Content-Type
      // Try application/vnd.sap.adt.tabletypes.v2+xml for table type metadata
      const response = await this.adtClient.post(uri, requestXml, {
        headers: { 'Content-Type': 'application/vnd.sap.adt.tabletypes.v2+xml' },
        params: args.transportRequest ? { corrNr: args.transportRequest } : undefined,
      });

      const tableType = this.parseTableTypeResponse(response.raw || '', args);
      this.logger.info(`Table type ${args.name} created successfully`);
      return { success: true, data: tableType };
    } catch (error) {
      this.logger.error(`Failed to create table type ${args.name}`, error);
      return this.createErrorResponse('CREATE_TTYP_FAILED', `Failed to create table type: ${error}`, error);
    }
  }

  async getDDICObject(args: GetDDICObjectInput): Promise<ToolResponse<ADTObject>> {
    this.logger.info(`Getting DDIC object: ${args.objectType}/${args.name}`);

    try {
      const uriPrefix = DDIC_URI_PREFIXES[args.objectType];
      if (!uriPrefix) {
        return this.createErrorResponse('INVALID_OBJECT_TYPE', `Invalid DDIC object type: ${args.objectType}`);
      }

      const uri = `${uriPrefix}/${args.name.toLowerCase()}`;
      const response = await this.adtClient.getObject(uri);
      const parsed = parseXML<Record<string, unknown>>(response.data);
      const adtObject = this.parseADTObjectFromXML(parsed, args.name, args.objectType as ADTObjectType, uri);

      this.logger.info(`DDIC object ${args.name} retrieved successfully`);
      return { success: true, data: adtObject };
    } catch (error) {
      this.logger.error(`Failed to get DDIC object ${args.name}`, error);
      return this.createErrorResponse('GET_DDIC_FAILED', `Failed to get DDIC object: ${error}`, error);
    }
  }

  async activateDDICObject(args: ActivateDDICObjectInput): Promise<ToolResponse<ActivationResult>> {
    this.logger.info(`Activating DDIC object: ${args.objectType}/${args.name}`);

    try {
      const uriPrefix = DDIC_URI_PREFIXES[args.objectType];
      if (!uriPrefix) {
        return this.createErrorResponse('INVALID_OBJECT_TYPE', `Invalid DDIC object type: ${args.objectType}`);
      }

      const uri = `${uriPrefix}/${args.name.toLowerCase()}`;
      const result = await this.adtClient.activate(uri);

      const activationResult: ActivationResult = {
        success: result.success,
        activated: result.success ? [args.name] : [],
        failed: result.success ? [] : [args.name],
        messages: result.messages.map(msg => ({
          objectName: args.name,
          objectType: args.objectType,
          severity: msg.type === 'E' || msg.type === 'error' ? 'error' : msg.type === 'W' || msg.type === 'warning' ? 'warning' : 'info',
          message: msg.message,
        })),
      };

      this.logger.info(`DDIC object ${args.name} activation ${result.success ? 'successful' : 'failed'}`);
      return {
        success: result.success,
        data: activationResult,
        warnings: activationResult.messages.filter(m => m.severity === 'warning').map(m => m.message),
      };
    } catch (error) {
      this.logger.error(`Failed to activate DDIC object ${args.name}`, error);
      return this.createErrorResponse('ACTIVATE_DDIC_FAILED', `Failed to activate DDIC object: ${error}`, error);
    }
  }

  // XML Building Methods
  // SAP ADT API uses specific XML formats for DDIC objects
  // Following the same pattern as program-tools.ts with adtcore attributes

  private buildDataElementXML(args: CreateDataElementInput): string {
    // SAP ADT expects namespace: http://www.sap.com/wbobj/dictionary/dtel with element 'blue:wbobj'
    // Based on SAP response XML structure, data element uses dtel:dataElement with child elements
    // Reference: MANDT data element XML structure shows the correct format
    
    // Format length as 6-digit string (SAP format for dataTypeLength/dataTypeDecimals)
    const formatLength6 = (len: number | undefined): string => {
      return String(len || 0).padStart(6, '0');
    };
    
    // Format field length as simple string (SAP format for field label lengths)
    const formatFieldLength = (len: number): string => {
      return String(len).padStart(2, '0');
    };
    
    // Calculate field labels and their lengths
    const shortLabel = args.shortText || args.description.substring(0, 10);
    const mediumLabel = args.mediumText || args.description.substring(0, 20);
    const longLabel = args.longText || args.description.substring(0, 40);
    const headingLabel = args.headingText || args.description.substring(0, 55);
    
    const obj = {
      'blue:wbobj': {
        '@_xmlns:blue': 'http://www.sap.com/wbobj/dictionary/dtel',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_xmlns:dtel': 'http://www.sap.com/adt/dictionary/dataelements',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'DTEL/DE',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'dtel:dataElement': {
          // typeKind: 'domain' for domain-based, 'predefinedAbapType' for built-in types
          'dtel:typeKind': args.domainName ? 'domain' : 'predefinedAbapType',
          // typeName: domain name if using domain, empty if predefined type
          'dtel:typeName': args.domainName?.toUpperCase() || '',
          // dataType: only for predefined types
          'dtel:dataType': args.domainName ? '' : (args.dataType || ''),
          'dtel:dataTypeLength': args.domainName ? '' : formatLength6(args.length),
          'dtel:dataTypeDecimals': args.domainName ? '' : formatLength6(args.decimals),
          // SAP ADT expects both *FieldLength and *FieldMaxLength for each label
          // shortFieldLength = actual display length, shortFieldMaxLength = max allowed length
          'dtel:shortFieldLabel': shortLabel,
          'dtel:shortFieldLength': formatFieldLength(shortLabel.length),
          'dtel:shortFieldMaxLength': formatFieldLength(10),  // Max 10 chars for short
          'dtel:mediumFieldLabel': mediumLabel,
          'dtel:mediumFieldLength': formatFieldLength(mediumLabel.length),
          'dtel:mediumFieldMaxLength': formatFieldLength(20), // Max 20 chars for medium
          'dtel:longFieldLabel': longLabel,
          'dtel:longFieldLength': formatFieldLength(longLabel.length),
          'dtel:longFieldMaxLength': formatFieldLength(40),   // Max 40 chars for long
          // Heading uses headingFieldLabel (not fieldLabelHeading)
          'dtel:headingFieldLabel': headingLabel,
          'dtel:headingFieldLength': formatFieldLength(headingLabel.length),
          'dtel:headingFieldMaxLength': formatFieldLength(55), // Max 55 chars for heading
          // Additional optional fields (empty for basic creation)
          'dtel:searchHelp': '',
          'dtel:searchHelpParameter': '',
          'dtel:setGetParameter': '',
          'dtel:defaultComponentName': '',
          'dtel:deactivateInputHistory': 'false',
          'dtel:changeDocument': 'false',
          'dtel:leftToRightDirection': 'false',
          'dtel:deactivateBIDIFiltering': 'false',
        },
      },
    };
    return buildXML(obj);
  }

  private buildDomainXML(args: CreateDomainInput): string {
    // SAP ADT expects namespace: http://www.sap.com/dictionary/domain with element 'domain'
    // Based on SAP response XML structure, properties should be child elements under doma:content/doma:typeInformation
    const fixedValuesXml = args.fixedValues?.map(fv => ({
      'doma:fixedValue': {
        'doma:low': fv.low,
        'doma:high': fv.high || '',
        'doma:description': fv.description || '',
      }
    })) || [];
    
    // Format length as 6-digit string (SAP format)
    const formatLength = (len: number | undefined): string => {
      return String(len || 0).padStart(6, '0');
    };
    
    const obj = {
      'doma:domain': {
        '@_xmlns:doma': 'http://www.sap.com/dictionary/domain',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'DOMA/DD',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'doma:content': {
          'doma:typeInformation': {
            'doma:datatype': args.dataType,
            'doma:length': formatLength(args.length),
            'doma:decimals': formatLength(args.decimals),
          },
          'doma:outputInformation': {
            'doma:outputLength': formatLength(args.outputLength || args.length),
            'doma:signFlag': args.signFlag ? 'true' : 'false',
            'doma:lowercase': args.lowercase ? 'true' : 'false',
          },
          ...(fixedValuesXml.length > 0 && { 'doma:fixedValues': fixedValuesXml }),
        },
      },
    };
    return buildXML(obj);
  }

  /**
   * Build table metadata XML (Step 1: Create basic structure without source)
   * SAP ADT requires creating the object first, then updating its source
   */
  private buildTableMetadataXML(args: CreateTableInput): string {
    // SAP ADT expects namespace: http://www.sap.com/wbobj/blue with element 'blueSource'
    // For Step 1, we create the object without source content
    const obj = {
      'blueSource': {
        '@_xmlns': 'http://www.sap.com/wbobj/blue',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'TABL/DT',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        // No 'source' element - will be set in Step 2 via updateObjectSource
      },
    };
    return buildXML(obj);
  }

  /**
   * Build table DDL source string (Step 2: Update source with complete DDL)
   * This is the actual DDL definition including all fields
   */
  private buildTableDDLSource(args: CreateTableInput): string {
    const fieldDefinitions = args.fields.map(field => {
      const keyIndicator = field.isKey ? 'key ' : '';
      const notNullIndicator = field.isNotNull ? ' not null' : '';
      if (field.dataElement) {
        return `  ${keyIndicator}${field.name.toLowerCase()} : ${field.dataElement.toLowerCase()}${notNullIndicator};`;
      } else {
        // Use ABAP data type syntax
        const typeMapping: Record<string, string> = {
          'CHAR': `abap.char(${field.length || 1})`,
          'NUMC': `abap.numc(${field.length || 1})`,
          'DEC': `abap.dec(${field.length || 13},${field.decimals || 0})`,
          'INT4': 'abap.int4',
          'DATS': 'abap.dats',
          'TIMS': 'abap.tims',
          'STRING': 'abap.string',
          'CLNT': 'abap.clnt',
        };
        const abapType = typeMapping[field.dataType?.toUpperCase() || 'CHAR'] || `abap.char(${field.length || 1})`;
        return `  ${keyIndicator}${field.name.toLowerCase()} : ${abapType}${notNullIndicator};`;
      }
    }).join('\n');

    return `@EndUserText.label : '${args.description}'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #${args.deliveryClass}
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ${args.name.toLowerCase()} {
${fieldDefinitions}
}`;
  }

  /**
   * Build complete table XML with inline source (legacy method, kept for reference)
   * Note: SAP ADT may not accept inline source during creation
   */
  private buildTableXML(args: CreateTableInput): string {
    // SAP ADT expects namespace: http://www.sap.com/wbobj/blue with element 'blueSource'
    // Tables use DDL-like source format
    const fieldDefinitions = args.fields.map(field => {
      const keyIndicator = field.isKey ? 'key ' : '';
      const notNullIndicator = field.isNotNull ? ' not null' : '';
      if (field.dataElement) {
        return `  ${keyIndicator}${field.name.toLowerCase()} : ${field.dataElement.toLowerCase()}${notNullIndicator};`;
      } else {
        // Use ABAP data type syntax
        const typeMapping: Record<string, string> = {
          'CHAR': `abap.char(${field.length || 1})`,
          'NUMC': `abap.numc(${field.length || 1})`,
          'DEC': `abap.dec(${field.length || 13},${field.decimals || 0})`,
          'INT4': 'abap.int4',
          'DATS': 'abap.dats',
          'TIMS': 'abap.tims',
          'STRING': 'abap.string',
          'CLNT': 'abap.clnt',
        };
        const abapType = typeMapping[field.dataType?.toUpperCase() || 'CHAR'] || `abap.char(${field.length || 1})`;
        return `  ${keyIndicator}${field.name.toLowerCase()} : ${abapType}${notNullIndicator};`;
      }
    }).join('\n');

    const ddlSource = `@EndUserText.label : '${args.description}'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #${args.deliveryClass}
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ${args.name.toLowerCase()} {
${fieldDefinitions}
}`;

    const obj = {
      'blueSource': {
        '@_xmlns': 'http://www.sap.com/wbobj/blue',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'TABL/DT',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'source': ddlSource,
      },
    };
    return buildXML(obj);
  }

  private buildStructureXML(args: CreateStructureInput): string {
    // SAP ADT expects namespace: http://www.sap.com/adt/ddic/structures
    // Use structure-specific XML format for classic DDIC structures
    const componentsXml = args.components.map(comp => {
      if (comp.dataElement) {
        return {
          '@_stru:fieldName': comp.name.toUpperCase(),
          'stru:typeRef': {
            '@_adtcore:name': comp.dataElement.toUpperCase(),
          },
        };
      } else {
        return {
          '@_stru:fieldName': comp.name.toUpperCase(),
          '@_stru:dataType': comp.dataType || 'CHAR',
          '@_stru:length': comp.length || 1,
          '@_stru:decimals': comp.decimals || 0,
        };
      }
    });

    const obj = {
      'stru:structure': {
        '@_xmlns:stru': 'http://www.sap.com/adt/ddic/structures',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'STRU/I',
        '@_adtcore:masterLanguage': 'EN',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'stru:components': {
          'stru:component': componentsXml,
        },
        ...(args.includeStructures && args.includeStructures.length > 0 && {
          'stru:includes': {
            'stru:include': args.includeStructures.map(s => ({ '@_adtcore:name': s.toUpperCase() })),
          },
        }),
      },
    };
    return buildXML(obj);
  }

  private buildTableTypeXML(args: CreateTableTypeInput): string {
    // SAP ADT expects namespace: http://www.sap.com/adt/ddic/tabletypes
    // Use table type-specific XML format
    const accessModeMapping: Record<string, string> = {
      'standard': 'S',
      'sorted': 'O',
      'hashed': 'H',
      'index': 'I',
    };

    const keyKindMapping: Record<string, string> = {
      'standard': 'D',
      'empty': 'E',
      'components': 'K',
    };

    const obj = {
      'ttyp:tableType': {
        '@_xmlns:ttyp': 'http://www.sap.com/adt/ddic/tabletypes',
        '@_xmlns:adtcore': 'http://www.sap.com/adt/core',
        '@_adtcore:description': args.description,
        '@_adtcore:language': 'EN',
        '@_adtcore:name': args.name.toUpperCase(),
        '@_adtcore:type': 'TTYP/TT',
        '@_adtcore:masterLanguage': 'EN',
        '@_ttyp:accessMode': accessModeMapping[args.accessMode] || 'S',
        '@_ttyp:keyKind': keyKindMapping[args.keyDefinition || 'standard'] || 'D',
        '@_ttyp:keyUnique': args.primaryKeyType === 'unique' ? 'true' : 'false',
        'adtcore:packageRef': {
          '@_adtcore:name': args.packageName,
        },
        'ttyp:lineType': {
          '@_ttyp:kind': args.lineTypeKind === 'structure' ? 'S' : args.lineTypeKind === 'dataElement' ? 'D' : 'P',
          '@_adtcore:name': args.lineType.toUpperCase(),
        },
        ...(args.keyDefinition === 'components' && args.keyComponents && args.keyComponents.length > 0 && {
          'ttyp:keyComponents': {
            'ttyp:keyComponent': args.keyComponents.map(k => ({ '@_ttyp:name': k.toUpperCase() })),
          },
        }),
      },
    };
    return buildXML(obj);
  }

  // Response Parsing Methods
  private parseDataElementResponse(xml: string, input: CreateDataElementInput): DataElement {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      domainName: input.domainName,
      dataType: input.dataType,
      length: input.length,
      decimals: input.decimals,
      fieldLabels: { short: input.shortText, medium: input.mediumText, long: input.longText, heading: input.headingText },
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseDomainResponse(xml: string, input: CreateDomainInput): Domain {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      dataType: input.dataType,
      length: input.length,
      decimals: input.decimals,
      outputLength: input.outputLength,
      signFlag: input.signFlag,
      lowercase: input.lowercase,
      fixedValues: input.fixedValues,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseTableResponse(xml: string, input: CreateTableInput): DatabaseTable {
    const primaryKeys = input.fields.filter(f => f.isKey).map(f => f.name.toUpperCase());
    const fields: TableField[] = input.fields.map(f => ({
      name: f.name.toUpperCase(),
      dataElement: f.dataElement,
      dataType: f.dataType,
      length: f.length,
      decimals: f.decimals,
      isKey: f.isKey,
      isNotNull: f.isNotNull,
    }));
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      deliveryClass: input.deliveryClass,
      maintenanceFlag: false,
      fields,
      primaryKeys,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseStructureResponse(xml: string, input: CreateStructureInput): Structure {
    const components: StructureComponent[] = input.components.map(c => ({
      name: c.name.toUpperCase(),
      dataElement: c.dataElement,
      dataType: c.dataType,
      length: c.length,
      decimals: c.decimals,
      description: c.description,
    }));
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      components,
      includeStructures: input.includeStructures,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseTableTypeResponse(xml: string, input: CreateTableTypeInput): TableType {
    return {
      name: input.name.toUpperCase(),
      description: input.description,
      lineType: input.lineType,
      lineTypeKind: input.lineTypeKind,
      accessMode: input.accessMode,
      keyDefinition: input.keyDefinition,
      keyComponents: input.keyComponents,
      primaryKeyType: input.primaryKeyType,
      packageName: input.packageName,
      transportRequest: input.transportRequest,
    };
  }

  private parseADTObjectFromXML(parsed: Record<string, unknown>, name: string, type: ADTObjectType, uri: string): ADTObject {
    const root = Object.values(parsed)[0] as Record<string, unknown> | undefined;
    return {
      name: (root ? getAttribute(root, 'name') : undefined) || name.toUpperCase(),
      type,
      uri,
      packageName: root ? getAttribute(root, 'packageRef') : undefined,
      description: root ? getAttribute(root, 'description') : undefined,
      responsible: root ? getAttribute(root, 'responsible') : undefined,
      createdAt: root ? getAttribute(root, 'createdAt') : undefined,
      changedAt: root ? getAttribute(root, 'changedAt') : undefined,
      changedBy: root ? getAttribute(root, 'changedBy') : undefined,
    };
  }

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

export default DDICToolHandler;