/**
 * DDIC Tools Handler Unit Tests
 * Tests for DDICToolHandler class methods
 */

import {
  DDICToolHandler,
  CreateStructureInput,
  CreateTableTypeInput,
  GetDDICObjectInput,
  ActivateDDICObjectInput,
} from '../../src/tools/ddic-tools';
import {
  MockADTClient,
  createMockADTClient,
  asMockADTClient,
  createMockResponse,
  MockXMLResponses,
} from '../mocks/adt-client.mock';
import {
  CreateDataElementInput,
  CreateDomainInput,
  CreateTableInput,
} from '../../src/types';

describe('DDICToolHandler', () => {
  let mockClient: MockADTClient;
  let handler: DDICToolHandler;

  beforeEach(() => {
    mockClient = createMockADTClient();
    handler = new DDICToolHandler(asMockADTClient(mockClient));
  });

  afterEach(() => {
    mockClient.resetMocks();
  });

  // ============================================================================
  // createDataElement Tests
  // ============================================================================
  describe('createDataElement', () => {
    const validInput: CreateDataElementInput = {
      name: 'ZTEST_DTEL',
      description: 'Test Data Element',
      domainName: 'ZTEST_DOMA',
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    it('should create data element with domain reference successfully', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.dataElement);

      const result = await handler.createDataElement(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_DTEL');
      expect(result.data?.description).toBe('Test Data Element');
      expect(result.data?.domainName).toBe('ZTEST_DOMA');
      expect(result.data?.packageName).toBe('ZTEST_PKG');
      expect(result.data?.transportRequest).toBe('DEVK900001');
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/dataelements',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.dataelements.v2+xml' },
          params: { corrNr: 'DEVK900001' },
        })
      );
    });

    it('should create data element with predefined type successfully', async () => {
      const inputWithType: CreateDataElementInput = {
        name: 'ZTEST_DTEL2',
        description: 'Test Data Element with Type',
        dataType: 'CHAR',
        length: 10,
        decimals: 0,
        packageName: 'ZTEST_PKG',
      };
      mockClient.setupPostSuccess(MockXMLResponses.dataElement);

      const result = await handler.createDataElement(inputWithType);

      expect(result.success).toBe(true);
      expect(result.data?.dataType).toBe('CHAR');
      expect(result.data?.length).toBe(10);
    });

    it('should create data element with field labels', async () => {
      const inputWithLabels: CreateDataElementInput = {
        name: 'ZTEST_DTEL3',
        description: 'Test Data Element with Labels',
        domainName: 'ZTEST_DOMA',
        shortText: 'Short',
        mediumText: 'Medium Text',
        longText: 'Long Text Label',
        headingText: 'Heading Text Label',
        packageName: 'ZTEST_PKG',
      };
      mockClient.setupPostSuccess(MockXMLResponses.dataElement);

      const result = await handler.createDataElement(inputWithLabels);

      expect(result.success).toBe(true);
      expect(result.data?.fieldLabels?.short).toBe('Short');
      expect(result.data?.fieldLabels?.medium).toBe('Medium Text');
      expect(result.data?.fieldLabels?.long).toBe('Long Text Label');
      expect(result.data?.fieldLabels?.heading).toBe('Heading Text Label');
    });

    it('should handle creation error gracefully', async () => {
      mockClient.setupPostError(new Error('Network error'));

      const result = await handler.createDataElement(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('CREATE_DTEL_FAILED');
      expect(result.error?.message).toContain('Failed to create data element');
    });

    it('should not include transport request param when not provided', async () => {
      const inputWithoutTransport: CreateDataElementInput = {
        name: 'ZTEST_DTEL',
        description: 'Test Data Element',
        domainName: 'ZTEST_DOMA',
        packageName: 'ZTEST_PKG',
      };
      mockClient.setupPostSuccess(MockXMLResponses.dataElement);

      await handler.createDataElement(inputWithoutTransport);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        })
      );
    });
  });

  // ============================================================================
  // createDomain Tests
  // ============================================================================
  describe('createDomain', () => {
    const validInput: CreateDomainInput = {
      name: 'ZTEST_DOMA',
      description: 'Test Domain',
      dataType: 'CHAR',
      length: 10,
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    it('should create domain successfully', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.domain);

      const result = await handler.createDomain(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_DOMA');
      expect(result.data?.description).toBe('Test Domain');
      expect(result.data?.dataType).toBe('CHAR');
      expect(result.data?.length).toBe(10);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/domains',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.domains.v2+xml' },
          params: { corrNr: 'DEVK900001' },
        })
      );
    });

    it('should create domain with fixed values', async () => {
      const inputWithFixedValues: CreateDomainInput = {
        ...validInput,
        fixedValues: [
          { low: 'A', description: 'Active' },
          { low: 'I', description: 'Inactive' },
          { low: '1', high: '9', description: 'Range 1-9' },
        ],
      };
      mockClient.setupPostSuccess(MockXMLResponses.domain);

      const result = await handler.createDomain(inputWithFixedValues);

      expect(result.success).toBe(true);
      expect(result.data?.fixedValues).toHaveLength(3);
      expect(result.data?.fixedValues?.[0].low).toBe('A');
      expect(result.data?.fixedValues?.[2].high).toBe('9');
    });

    it('should create domain with all optional properties', async () => {
      const inputWithAllOptions: CreateDomainInput = {
        ...validInput,
        decimals: 2,
        outputLength: 12,
        signFlag: true,
        lowercase: true,
      };
      mockClient.setupPostSuccess(MockXMLResponses.domain);

      const result = await handler.createDomain(inputWithAllOptions);

      expect(result.success).toBe(true);
      expect(result.data?.decimals).toBe(2);
      expect(result.data?.outputLength).toBe(12);
      expect(result.data?.signFlag).toBe(true);
      expect(result.data?.lowercase).toBe(true);
    });

    it('should handle creation error gracefully', async () => {
      mockClient.setupPostError(new Error('Domain already exists'));

      const result = await handler.createDomain(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_DOMA_FAILED');
      expect(result.error?.message).toContain('Failed to create domain');
    });
  });

  // ============================================================================
  // createDatabaseTable Tests
  // ============================================================================
  describe('createDatabaseTable', () => {
    const validInput: CreateTableInput = {
      name: 'ZTEST_TABLE',
      description: 'Test Table',
      deliveryClass: 'A',
      fields: [
        { name: 'MANDT', dataElement: 'MANDT', isKey: true, isNotNull: true },
        { name: 'ID', dataElement: 'SYSUUID_X16', isKey: true, isNotNull: true },
        { name: 'NAME', dataType: 'CHAR', length: 50, isKey: false, isNotNull: false },
      ],
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    it('should create database table successfully', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.table);

      const result = await handler.createDatabaseTable(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_TABLE');
      expect(result.data?.description).toBe('Test Table');
      expect(result.data?.deliveryClass).toBe('A');
      expect(result.data?.fields).toHaveLength(3);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/tables',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.tables.v2+xml' },
        })
      );
    });

    it('should correctly identify primary keys', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.table);

      const result = await handler.createDatabaseTable(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.primaryKeys).toContain('MANDT');
      expect(result.data?.primaryKeys).toContain('ID');
      expect(result.data?.primaryKeys).not.toContain('NAME');
    });

    it('should handle fields with data elements', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.table);

      const result = await handler.createDatabaseTable(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.fields[0].dataElement).toBe('MANDT');
      expect(result.data?.fields[0].dataType).toBeUndefined();
    });

    it('should handle fields with predefined types', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.table);

      const result = await handler.createDatabaseTable(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.fields[2].dataType).toBe('CHAR');
      expect(result.data?.fields[2].length).toBe(50);
    });

    it('should handle creation error gracefully', async () => {
      mockClient.setupPostError(new Error('Table creation failed'));

      const result = await handler.createDatabaseTable(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_TABL_FAILED');
    });

    it('should support all delivery classes', async () => {
      const deliveryClasses: Array<'A' | 'C' | 'L' | 'G' | 'E' | 'S' | 'W'> = ['A', 'C', 'L', 'G', 'E', 'S', 'W'];
      mockClient.setupPostSuccess(MockXMLResponses.table);

      for (const deliveryClass of deliveryClasses) {
        const input = { ...validInput, deliveryClass };
        const result = await handler.createDatabaseTable(input);
        expect(result.success).toBe(true);
        expect(result.data?.deliveryClass).toBe(deliveryClass);
      }
    });
  });

  // ============================================================================
  // createStructure Tests
  // ============================================================================
  describe('createStructure', () => {
    const validInput: CreateStructureInput = {
      name: 'ZTEST_STRU',
      description: 'Test Structure',
      components: [
        { name: 'FIELD1', dataElement: 'SYSUUID_X16' },
        { name: 'FIELD2', dataType: 'CHAR', length: 30, description: 'Text field' },
      ],
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    it('should create structure successfully', async () => {
      mockClient.setupPostSuccess('<structure/>');

      const result = await handler.createStructure(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_STRU');
      expect(result.data?.description).toBe('Test Structure');
      expect(result.data?.components).toHaveLength(2);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/structures',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.structures.v2+xml' },
        })
      );
    });

    it('should handle components with data elements', async () => {
      mockClient.setupPostSuccess('<structure/>');

      const result = await handler.createStructure(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.components[0].name).toBe('FIELD1');
      expect(result.data?.components[0].dataElement).toBe('SYSUUID_X16');
    });

    it('should handle components with predefined types', async () => {
      mockClient.setupPostSuccess('<structure/>');

      const result = await handler.createStructure(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.components[1].name).toBe('FIELD2');
      expect(result.data?.components[1].dataType).toBe('CHAR');
      expect(result.data?.components[1].length).toBe(30);
      expect(result.data?.components[1].description).toBe('Text field');
    });

    it('should create structure with include structures', async () => {
      const inputWithIncludes: CreateStructureInput = {
        ...validInput,
        includeStructures: ['ZBASE_STRU', 'ZAUDIT_STRU'],
      };
      mockClient.setupPostSuccess('<structure/>');

      const result = await handler.createStructure(inputWithIncludes);

      expect(result.success).toBe(true);
      expect(result.data?.includeStructures).toContain('ZBASE_STRU');
      expect(result.data?.includeStructures).toContain('ZAUDIT_STRU');
    });

    it('should handle creation error gracefully', async () => {
      mockClient.setupPostError(new Error('Structure creation failed'));

      const result = await handler.createStructure(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_STRU_FAILED');
    });
  });

  // ============================================================================
  // createTableType Tests
  // ============================================================================
  describe('createTableType', () => {
    const validInput: CreateTableTypeInput = {
      name: 'ZTEST_TTYP',
      description: 'Test Table Type',
      lineType: 'ZTEST_STRU',
      lineTypeKind: 'structure',
      accessMode: 'standard',
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    it('should create standard table type successfully', async () => {
      mockClient.setupPostSuccess('<tableType/>');

      const result = await handler.createTableType(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_TTYP');
      expect(result.data?.lineType).toBe('ZTEST_STRU');
      expect(result.data?.lineTypeKind).toBe('structure');
      expect(result.data?.accessMode).toBe('standard');
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/tabletypes',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.tabletypes.v2+xml' },
        })
      );
    });

    it('should create sorted table type with key components', async () => {
      const inputSorted: CreateTableTypeInput = {
        ...validInput,
        accessMode: 'sorted',
        keyDefinition: 'components',
        keyComponents: ['FIELD1', 'FIELD2'],
        primaryKeyType: 'unique',
      };
      mockClient.setupPostSuccess('<tableType/>');

      const result = await handler.createTableType(inputSorted);

      expect(result.success).toBe(true);
      expect(result.data?.accessMode).toBe('sorted');
      expect(result.data?.keyDefinition).toBe('components');
      expect(result.data?.keyComponents).toContain('FIELD1');
      expect(result.data?.keyComponents).toContain('FIELD2');
      expect(result.data?.primaryKeyType).toBe('unique');
    });

    it('should create hashed table type', async () => {
      const inputHashed: CreateTableTypeInput = {
        ...validInput,
        accessMode: 'hashed',
        keyDefinition: 'components',
        keyComponents: ['KEY_FIELD'],
        primaryKeyType: 'unique',
      };
      mockClient.setupPostSuccess('<tableType/>');

      const result = await handler.createTableType(inputHashed);

      expect(result.success).toBe(true);
      expect(result.data?.accessMode).toBe('hashed');
    });

    it('should create table type with data element line type', async () => {
      const inputDataElement: CreateTableTypeInput = {
        ...validInput,
        lineType: 'CHAR10',
        lineTypeKind: 'dataElement',
      };
      mockClient.setupPostSuccess('<tableType/>');

      const result = await handler.createTableType(inputDataElement);

      expect(result.success).toBe(true);
      expect(result.data?.lineTypeKind).toBe('dataElement');
    });

    it('should create table type with predefined line type', async () => {
      const inputPredefined: CreateTableTypeInput = {
        ...validInput,
        lineType: 'STRING',
        lineTypeKind: 'predefined',
      };
      mockClient.setupPostSuccess('<tableType/>');

      const result = await handler.createTableType(inputPredefined);

      expect(result.success).toBe(true);
      expect(result.data?.lineTypeKind).toBe('predefined');
    });

    it('should handle creation error gracefully', async () => {
      mockClient.setupPostError(new Error('Table type creation failed'));

      const result = await handler.createTableType(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_TTYP_FAILED');
    });

    it('should support all access modes', async () => {
      const accessModes: Array<'standard' | 'sorted' | 'hashed' | 'index'> = ['standard', 'sorted', 'hashed', 'index'];
      mockClient.setupPostSuccess('<tableType/>');

      for (const accessMode of accessModes) {
        const input = { ...validInput, accessMode };
        const result = await handler.createTableType(input);
        expect(result.success).toBe(true);
        expect(result.data?.accessMode).toBe(accessMode);
      }
    });
  });

  // ============================================================================
  // getDDICObject Tests
  // ============================================================================
  describe('getDDICObject', () => {
    it('should get data element successfully', async () => {
      mockClient.setupGetObject(MockXMLResponses.dataElement);

      const result = await handler.getDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.type).toBe('DTEL');
      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/dataelements/ztest_dtel');
    });

    it('should get domain successfully', async () => {
      mockClient.setupGetObject(MockXMLResponses.domain);

      const result = await handler.getDDICObject({
        name: 'ZTEST_DOMA',
        objectType: 'DOMA',
      });

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('DOMA');
      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/domains/ztest_doma');
    });

    it('should get table successfully', async () => {
      mockClient.setupGetObject(MockXMLResponses.table);

      const result = await handler.getDDICObject({
        name: 'ZTEST_TABLE',
        objectType: 'TABL',
      });

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('TABL');
      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/tables/ztest_table');
    });

    it('should get structure successfully', async () => {
      mockClient.setupGetObject('<structure adtcore:name="ZTEST_STRU"/>');

      const result = await handler.getDDICObject({
        name: 'ZTEST_STRU',
        objectType: 'STRU',
      });

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('STRU');
      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/structures/ztest_stru');
    });

    it('should get table type successfully', async () => {
      mockClient.setupGetObject('<tableType adtcore:name="ZTEST_TTYP"/>');

      const result = await handler.getDDICObject({
        name: 'ZTEST_TTYP',
        objectType: 'TTYP',
      });

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('TTYP');
      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/tabletypes/ztest_ttyp');
    });

    it('should handle invalid object type', async () => {
      const result = await handler.getDDICObject({
        name: 'ZTEST',
        objectType: 'INVALID' as GetDDICObjectInput['objectType'],
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_OBJECT_TYPE');
      expect(result.error?.message).toContain('Invalid DDIC object type');
    });

    it('should handle get error gracefully', async () => {
      mockClient.getObject.mockRejectedValue(new Error('Object not found'));

      const result = await handler.getDDICObject({
        name: 'ZNONEXISTENT',
        objectType: 'DTEL',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GET_DDIC_FAILED');
    });

    it('should convert object name to lowercase for URI', async () => {
      mockClient.setupGetObject(MockXMLResponses.dataElement);

      await handler.getDDICObject({
        name: 'ZTEST_DTEL_UPPER',
        objectType: 'DTEL',
      });

      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/dataelements/ztest_dtel_upper');
    });
  });

  // ============================================================================
  // activateDDICObject Tests
  // ============================================================================
  describe('activateDDICObject', () => {
    it('should activate data element successfully', async () => {
      mockClient.setupActivateSuccess();

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.success).toBe(true);
      expect(result.data?.activated).toContain('ZTEST_DTEL');
      expect(result.data?.failed).toHaveLength(0);
      expect(mockClient.activate).toHaveBeenCalledWith('/ddic/dataelements/ztest_dtel');
    });

    it('should activate domain successfully', async () => {
      mockClient.setupActivateSuccess();

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DOMA',
        objectType: 'DOMA',
      });

      expect(result.success).toBe(true);
      expect(mockClient.activate).toHaveBeenCalledWith('/ddic/domains/ztest_doma');
    });

    it('should activate table successfully', async () => {
      mockClient.setupActivateSuccess();

      const result = await handler.activateDDICObject({
        name: 'ZTEST_TABLE',
        objectType: 'TABL',
      });

      expect(result.success).toBe(true);
      expect(mockClient.activate).toHaveBeenCalledWith('/ddic/tables/ztest_table');
    });

    it('should handle activation failure with error messages', async () => {
      mockClient.setupActivateFailure([
        { type: 'E', message: 'Syntax error in line 10' },
        { type: 'W', message: 'Warning: Deprecated feature used' },
      ]);

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.success).toBe(false);
      expect(result.data?.success).toBe(false);
      expect(result.data?.failed).toContain('ZTEST_DTEL');
      expect(result.data?.messages).toHaveLength(2);
      expect(result.data?.messages[0].severity).toBe('error');
      expect(result.data?.messages[1].severity).toBe('warning');
    });

    it('should return warnings in response', async () => {
      mockClient.activate.mockResolvedValue({
        success: true,
        messages: [{ type: 'W', message: 'Warning: Consider using new syntax' }],
      });

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.success).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings?.[0]).toContain('Consider using new syntax');
    });

    it('should handle invalid object type', async () => {
      const result = await handler.activateDDICObject({
        name: 'ZTEST',
        objectType: 'INVALID' as ActivateDDICObjectInput['objectType'],
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_OBJECT_TYPE');
    });

    it('should handle activation exception gracefully', async () => {
      mockClient.activate.mockRejectedValue(new Error('Activation service unavailable'));

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('ACTIVATE_DDIC_FAILED');
    });

    it('should map error type message correctly', async () => {
      mockClient.setupActivateFailure([
        { type: 'error', message: 'Critical error' },
      ]);

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.data?.messages[0].severity).toBe('error');
    });

    it('should map warning type message correctly', async () => {
      mockClient.activate.mockResolvedValue({
        success: true,
        messages: [{ type: 'warning', message: 'Warning message' }],
      });

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.data?.messages[0].severity).toBe('warning');
    });

    it('should map info type message correctly', async () => {
      mockClient.activate.mockResolvedValue({
        success: true,
        messages: [{ type: 'I', message: 'Info message' }],
      });

      const result = await handler.activateDDICObject({
        name: 'ZTEST_DTEL',
        objectType: 'DTEL',
      });

      expect(result.data?.messages[0].severity).toBe('info');
    });

    it('should activate all supported DDIC types', async () => {
      const objectTypes: Array<ActivateDDICObjectInput['objectType']> = ['DTEL', 'DOMA', 'TABL', 'STRU', 'TTYP'];
      mockClient.setupActivateSuccess();

      for (const objectType of objectTypes) {
        const result = await handler.activateDDICObject({
          name: `ZTEST_${objectType}`,
          objectType,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  // ============================================================================
  // Edge Cases and Error Handling
  // ============================================================================
  describe('Edge Cases', () => {
    it('should convert object names to uppercase in response', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.dataElement);

      const result = await handler.createDataElement({
        name: 'ztest_lowercase',
        description: 'Test',
        domainName: 'ZTEST_DOMA',
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('ZTEST_LOWERCASE');
    });

    it('should handle empty XML response gracefully', async () => {
      mockClient.setupPostSuccess('');

      const result = await handler.createDataElement({
        name: 'ZTEST_DTEL',
        description: 'Test',
        domainName: 'ZTEST_DOMA',
        packageName: 'ZTEST_PKG',
      });

      // Should still succeed as the handler builds response from input
      expect(result.success).toBe(true);
    });

    it('should include error details when available', async () => {
      const originalError = new Error('Detailed error message');
      mockClient.setupPostError(originalError);

      const result = await handler.createDataElement({
        name: 'ZTEST_DTEL',
        description: 'Test',
        domainName: 'ZTEST_DOMA',
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(false);
      expect(result.error?.details).toBe('Detailed error message');
    });
  });
});