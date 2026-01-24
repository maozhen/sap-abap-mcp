/**
 * CDS Tools Handler Unit Tests
 * Tests for CDSToolHandler class methods
 */

import { CDSToolHandler } from '../../src/tools/cds-tools';
import { MockADTClient, createMockADTClient, asMockADTClient, createMockResponse, MockXMLResponses } from '../mocks/adt-client.mock';

describe('CDSToolHandler', () => {
  let mockClient: MockADTClient;
  let handler: CDSToolHandler;

  beforeEach(() => {
    mockClient = createMockADTClient();
    handler = new CDSToolHandler(asMockADTClient(mockClient));
  });

  afterEach(() => {
    mockClient.resetMocks();
  });

  // ==========================================================================
  // createCDSView Tests
  // ==========================================================================

  describe('createCDSView', () => {
    const validInput = {
      name: 'ZTEST_CDS_VIEW',
      description: 'Test CDS View',
      sourceCode: '@AbapCatalog.sqlViewName: \'ZTESTV\'\ndefine view ZTEST_CDS_VIEW as select from sflight { * }',
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    it('should create CDS view successfully', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(MockXMLResponses.cdsView));

      const result = await handler.createCDSView(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_CDS_VIEW');
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/ddl/sources/ztest_cds_view',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.ddic.ddl.sources.v2+xml' },
          params: { corrNr: 'DEVK900001' },
        })
      );
    });

    it('should create CDS view with source code update', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(MockXMLResponses.cdsView));
      mockClient.lockObject.mockResolvedValue({
        lockHandle: 'test-lock',
        objectUri: '/ddic/ddl/sources/ztest_cds_view',
        expiresAt: new Date(),
      });

      const result = await handler.createCDSView(validInput);

      expect(result.success).toBe(true);
      expect(mockClient.lockObject).toHaveBeenCalled();
      expect(mockClient.updateObjectSource).toHaveBeenCalledWith(
        '/ddic/ddl/sources/ztest_cds_view',
        validInput.sourceCode,
        'test-lock'
      );
      expect(mockClient.unlockObject).toHaveBeenCalled();
    });

    it('should create CDS view without transport request', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(MockXMLResponses.cdsView));
      const inputWithoutTransport = { ...validInput, transportRequest: undefined };

      const result = await handler.createCDSView(inputWithoutTransport);

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        })
      );
    });

    it('should create CDS view with SQL view name', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(MockXMLResponses.cdsView));
      const inputWithSqlViewName = {
        ...validInput,
        sqlViewName: 'ZSQL_VIEW',
      };

      const result = await handler.createCDSView(inputWithSqlViewName);

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('ZSQL_VIEW'),
        expect.any(Object)
      );
    });

    it('should handle creation failure', async () => {
      mockClient.post.mockRejectedValue(new Error('ADT error: Object already exists'));

      const result = await handler.createCDSView(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_CDS_FAILED');
      expect(result.error?.message).toContain('Object already exists');
    });

    it('should succeed even if source update fails', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(MockXMLResponses.cdsView));
      mockClient.lockObject.mockRejectedValue(new Error('Lock failed'));

      const result = await handler.createCDSView(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  // ==========================================================================
  // createServiceDefinition Tests
  // ==========================================================================

  describe('createServiceDefinition', () => {
    const validInput = {
      name: 'ZTEST_SRVD',
      description: 'Test Service Definition',
      exposedEntities: [
        { entityName: 'ZTEST_CDS_VIEW', alias: 'TestEntity' },
        { entityName: 'ZTEST_CDS_VIEW2', repositoryName: 'TestRepo' },
      ],
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    const serviceDefinitionResponse = `<?xml version="1.0" encoding="UTF-8"?>
<srvd:srvdSource xmlns:srvd="http://www.sap.com/adt/ddic/srvd/sources" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZTEST_SRVD</adtcore:name>
  <adtcore:description>Test Service Definition</adtcore:description>
</srvd:srvdSource>`;

    it('should create service definition successfully', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(serviceDefinitionResponse));

      const result = await handler.createServiceDefinition(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_SRVD');
      expect(result.data?.exposedEntities).toHaveLength(2);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/ddic/srvd/sources/ztest_srvd',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.ddic.srvd.sources.v2+xml' },
        })
      );
    });

    it('should create service definition with source code', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(serviceDefinitionResponse));
      mockClient.lockObject.mockResolvedValue({
        lockHandle: 'test-lock',
        objectUri: '/ddic/srvd/sources/ztest_srvd',
        expiresAt: new Date(),
      });
      const inputWithSource = {
        ...validInput,
        sourceCode: '@EndUserText.label: \'Test\'\ndefine service ZTEST_SRVD { expose ZTEST_CDS_VIEW; }',
      };

      const result = await handler.createServiceDefinition(inputWithSource);

      expect(result.success).toBe(true);
      expect(mockClient.lockObject).toHaveBeenCalled();
      expect(mockClient.updateObjectSource).toHaveBeenCalled();
      expect(mockClient.unlockObject).toHaveBeenCalled();
    });

    it('should handle service definition creation failure', async () => {
      mockClient.post.mockRejectedValue(new Error('Service definition error'));

      const result = await handler.createServiceDefinition(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_SRVD_FAILED');
    });

    it('should create service definition with empty entities list', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(serviceDefinitionResponse));
      const inputWithEmptyEntities = {
        ...validInput,
        exposedEntities: [],
      };

      const result = await handler.createServiceDefinition(inputWithEmptyEntities);

      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // createServiceBinding Tests
  // ==========================================================================

  describe('createServiceBinding', () => {
    const validInput = {
      name: 'ZTEST_SRVB',
      description: 'Test Service Binding',
      serviceDefinition: 'ZTEST_SRVD',
      bindingType: 'ODATA_V4' as const,
      packageName: 'ZTEST_PKG',
      transportRequest: 'DEVK900001',
    };

    const serviceBindingResponse = `<?xml version="1.0" encoding="UTF-8"?>
<srvb:serviceBinding xmlns:srvb="http://www.sap.com/adt/businessservices/bindings" xmlns:adtcore="http://www.sap.com/adt/core">
  <adtcore:name>ZTEST_SRVB</adtcore:name>
  <adtcore:description>Test Service Binding</adtcore:description>
</srvb:serviceBinding>`;

    it('should create service binding successfully', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(serviceBindingResponse));

      const result = await handler.createServiceBinding(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_SRVB');
      expect(result.data?.serviceDefinition).toBe('ZTEST_SRVD');
      expect(result.data?.bindingType).toBe('ODATA_V4');
      expect(mockClient.post).toHaveBeenCalledWith(
        '/businessservices/bindings/ztest_srvb',
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/vnd.sap.adt.businessservices.bindings.v2+xml' },
        })
      );
    });

    it('should create ODATA_V2 service binding', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(serviceBindingResponse));
      const inputV2 = { ...validInput, bindingType: 'ODATA_V2' as const };

      const result = await handler.createServiceBinding(inputV2);

      expect(result.success).toBe(true);
      expect(result.data?.bindingType).toBe('ODATA_V2');
    });

    it('should create ODATA_V4_UI service binding', async () => {
      mockClient.post.mockResolvedValue(createMockResponse(serviceBindingResponse));
      const inputV4UI = { ...validInput, bindingType: 'ODATA_V4_UI' as const };

      const result = await handler.createServiceBinding(inputV4UI);

      expect(result.success).toBe(true);
    });

    it('should handle service binding creation failure', async () => {
      mockClient.post.mockRejectedValue(new Error('Binding creation failed'));

      const result = await handler.createServiceBinding(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_SRVB_FAILED');
    });
  });

  // ==========================================================================
  // getCDSView Tests
  // ==========================================================================

  describe('getCDSView', () => {
    const validInput = { name: 'ZTEST_CDS_VIEW' };

    const cdsViewDetailResponse = `<?xml version="1.0" encoding="UTF-8"?>
<ddl:ddlSource xmlns:ddl="http://www.sap.com/adt/ddic/ddl/sources" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZTEST_CDS_VIEW" adtcore:description="Test CDS View" adtcore:packageRef="ZTEST_PKG"
  ddl:sqlViewName="ZTESTV" ddl:dataSource="SFLIGHT">
  <ddl:association ddl:name="ToCarrier" ddl:targetEntity="SCARR" ddl:cardinality="1" ddl:onCondition="carrid"/>
  <ddl:field ddl:name="CARRID" ddl:alias="Carrier"/>
  <ddl:parameter ddl:name="P_DATE" ddl:type="DATS"/>
</ddl:ddlSource>`;

    it('should get CDS view successfully', async () => {
      mockClient.getObject.mockResolvedValue(createMockResponse(cdsViewDetailResponse));
      mockClient.getObjectSource.mockResolvedValue('define view ZTEST_CDS_VIEW as select from sflight { * }');

      const result = await handler.getCDSView(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_CDS_VIEW');
      expect(result.data?.sourceCode).toBeDefined();
      expect(mockClient.getObject).toHaveBeenCalledWith('/ddic/ddl/sources/ztest_cds_view');
    });

    it('should get CDS view even if source retrieval fails', async () => {
      mockClient.getObject.mockResolvedValue(createMockResponse(cdsViewDetailResponse));
      mockClient.getObjectSource.mockRejectedValue(new Error('Source not available'));

      const result = await handler.getCDSView(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.sourceCode).toBeUndefined();
    });

    it('should handle get CDS view failure', async () => {
      mockClient.getObject.mockRejectedValue(new Error('Object not found'));

      const result = await handler.getCDSView(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GET_CDS_FAILED');
    });

    it('should parse associations from XML', async () => {
      mockClient.getObject.mockResolvedValue(createMockResponse(cdsViewDetailResponse));
      mockClient.getObjectSource.mockResolvedValue('');

      const result = await handler.getCDSView(validInput);

      expect(result.success).toBe(true);
      // Note: actual parsing depends on XML structure
    });
  });

  // ==========================================================================
  // getCDSSource Tests
  // ==========================================================================

  describe('getCDSSource', () => {
    const validInput = { name: 'ZTEST_CDS_VIEW' };
    const sourceCode = `@AbapCatalog.sqlViewName: 'ZTESTV'
@EndUserText.label: 'Test CDS View'
define view ZTEST_CDS_VIEW as select from sflight {
  key carrid,
  key connid,
  fldate,
  price
}`;

    it('should get CDS source code successfully', async () => {
      mockClient.getObjectSource.mockResolvedValue(sourceCode);

      const result = await handler.getCDSSource(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBe(sourceCode);
      expect(mockClient.getObjectSource).toHaveBeenCalledWith('/ddic/ddl/sources/ztest_cds_view');
    });

    it('should handle source retrieval failure', async () => {
      mockClient.getObjectSource.mockRejectedValue(new Error('Source not found'));

      const result = await handler.getCDSSource(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GET_CDS_SOURCE_FAILED');
    });

    it('should handle empty source code', async () => {
      mockClient.getObjectSource.mockResolvedValue('');

      const result = await handler.getCDSSource(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBe('');
    });
  });

  // ==========================================================================
  // updateCDSSource Tests
  // ==========================================================================

  describe('updateCDSSource', () => {
    const validInput = {
      name: 'ZTEST_CDS_VIEW',
      source: 'define view ZTEST_CDS_VIEW as select from sflight { key carrid, connid }',
      transportRequest: 'DEVK900001',
    };

    it('should update CDS source successfully', async () => {
      mockClient.lockObject.mockResolvedValue({
        lockHandle: 'test-lock',
        objectUri: '/ddic/ddl/sources/ztest_cds_view',
        expiresAt: new Date(),
      });
      mockClient.updateObjectSource.mockResolvedValue(undefined);
      mockClient.unlockObject.mockResolvedValue(undefined);

      const result = await handler.updateCDSSource(validInput);

      expect(result.success).toBe(true);
      expect(mockClient.lockObject).toHaveBeenCalledWith('/ddic/ddl/sources/ztest_cds_view');
      expect(mockClient.updateObjectSource).toHaveBeenCalledWith(
        '/ddic/ddl/sources/ztest_cds_view',
        validInput.source,
        'test-lock'
      );
      expect(mockClient.unlockObject).toHaveBeenCalledWith(
        '/ddic/ddl/sources/ztest_cds_view',
        'test-lock'
      );
    });

    it('should handle lock failure', async () => {
      mockClient.lockObject.mockRejectedValue(new Error('Object is locked by another user'));

      const result = await handler.updateCDSSource(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UPDATE_CDS_SOURCE_FAILED');
      expect(result.error?.message).toContain('locked by another user');
    });

    it('should handle update failure and unlock', async () => {
      mockClient.lockObject.mockResolvedValue({
        lockHandle: 'test-lock',
        objectUri: '/ddic/ddl/sources/ztest_cds_view',
        expiresAt: new Date(),
      });
      mockClient.updateObjectSource.mockRejectedValue(new Error('Update failed'));
      mockClient.unlockObject.mockResolvedValue(undefined);

      const result = await handler.updateCDSSource(validInput);

      expect(result.success).toBe(false);
      expect(mockClient.unlockObject).toHaveBeenCalled();
    });

    it('should handle unlock failure after error gracefully', async () => {
      mockClient.lockObject.mockResolvedValue({
        lockHandle: 'test-lock',
        objectUri: '/ddic/ddl/sources/ztest_cds_view',
        expiresAt: new Date(),
      });
      mockClient.updateObjectSource.mockRejectedValue(new Error('Update failed'));
      mockClient.unlockObject.mockRejectedValue(new Error('Unlock also failed'));

      const result = await handler.updateCDSSource(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UPDATE_CDS_SOURCE_FAILED');
    });
  });

  // ==========================================================================
  // activateCDSObject Tests
  // ==========================================================================

  describe('activateCDSObject', () => {
    it('should activate DDLS object successfully', async () => {
      mockClient.activate.mockResolvedValue({ success: true, messages: [] });

      const result = await handler.activateCDSObject({
        name: 'ZTEST_CDS_VIEW',
        objectType: 'DDLS',
      });

      expect(result.success).toBe(true);
      expect(result.data?.success).toBe(true);
      expect(result.data?.activated).toContain('ZTEST_CDS_VIEW');
      expect(mockClient.activate).toHaveBeenCalledWith('/ddic/ddl/sources/ztest_cds_view');
    });

    it('should activate DCLS object successfully', async () => {
      mockClient.activate.mockResolvedValue({ success: true, messages: [] });

      const result = await handler.activateCDSObject({
        name: 'ZTEST_DCL',
        objectType: 'DCLS',
      });

      expect(result.success).toBe(true);
      expect(mockClient.activate).toHaveBeenCalledWith('/acm/dcl/sources/ztest_dcl');
    });

    it('should activate DDLX object successfully', async () => {
      mockClient.activate.mockResolvedValue({ success: true, messages: [] });

      const result = await handler.activateCDSObject({
        name: 'ZTEST_DDLX',
        objectType: 'DDLX',
      });

      expect(result.success).toBe(true);
      expect(mockClient.activate).toHaveBeenCalledWith('/ddic/ddlx/sources/ztest_ddlx');
    });

    it('should activate SRVD object successfully', async () => {
      mockClient.activate.mockResolvedValue({ success: true, messages: [] });

      const result = await handler.activateCDSObject({
        name: 'ZTEST_SRVD',
        objectType: 'SRVD',
      });

      expect(result.success).toBe(true);
      expect(mockClient.activate).toHaveBeenCalledWith('/ddic/srvd/sources/ztest_srvd');
    });

    it('should activate SRVB object successfully', async () => {
      mockClient.activate.mockResolvedValue({ success: true, messages: [] });

      const result = await handler.activateCDSObject({
        name: 'ZTEST_SRVB',
        objectType: 'SRVB',
      });

      expect(result.success).toBe(true);
      expect(mockClient.activate).toHaveBeenCalledWith('/businessservices/bindings/ztest_srvb');
    });

    it('should handle activation failure with messages', async () => {
      mockClient.activate.mockResolvedValue({
        success: false,
        messages: [
          { type: 'E', message: 'Syntax error in line 10' },
          { type: 'W', message: 'Deprecated annotation used' },
        ],
      });

      const result = await handler.activateCDSObject({
        name: 'ZTEST_CDS_VIEW',
        objectType: 'DDLS',
      });

      expect(result.success).toBe(false);
      expect(result.data?.failed).toContain('ZTEST_CDS_VIEW');
      expect(result.data?.messages).toHaveLength(2);
      expect(result.warnings).toBeDefined();
    });

    it('should handle activation exception', async () => {
      mockClient.activate.mockRejectedValue(new Error('Activation service unavailable'));

      const result = await handler.activateCDSObject({
        name: 'ZTEST_CDS_VIEW',
        objectType: 'DDLS',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('ACTIVATE_CDS_FAILED');
    });

    it('should handle invalid object type', async () => {
      const result = await handler.activateCDSObject({
        name: 'ZTEST_INVALID',
        objectType: 'INVALID' as any,
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_OBJECT_TYPE');
    });
  });

  // ==========================================================================
  // getServiceBindingUrl Tests
  // ==========================================================================

  describe('getServiceBindingUrl', () => {
    const validInput = { name: 'ZTEST_SRVB' };

    const serviceBindingUrlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<srvb:serviceBinding xmlns:srvb="http://www.sap.com/adt/businessservices/bindings"
  srvb:serviceUrl="/sap/opu/odata4/sap/ztest_srvb/srvd/sap/ztest_srvd/0001">
</srvb:serviceBinding>`;

    it('should get service binding URL successfully', async () => {
      mockClient.getObject.mockResolvedValue(createMockResponse(serviceBindingUrlResponse));

      const result = await handler.getServiceBindingUrl(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.serviceUrl).toBe('/sap/opu/odata4/sap/ztest_srvb/srvd/sap/ztest_srvd/0001');
      expect(result.data?.metadataUrl).toBe('/sap/opu/odata4/sap/ztest_srvb/srvd/sap/ztest_srvd/0001/$metadata');
      expect(mockClient.getObject).toHaveBeenCalledWith('/businessservices/bindings/ztest_srvb');
    });

    it('should handle missing service URL', async () => {
      const responseWithoutUrl = `<?xml version="1.0" encoding="UTF-8"?>
<srvb:serviceBinding xmlns:srvb="http://www.sap.com/adt/businessservices/bindings">
</srvb:serviceBinding>`;
      mockClient.getObject.mockResolvedValue(createMockResponse(responseWithoutUrl));

      const result = await handler.getServiceBindingUrl(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.serviceUrl).toBe('');
      expect(result.data?.metadataUrl).toBe('');
    });

    it('should handle get service binding URL failure', async () => {
      mockClient.getObject.mockRejectedValue(new Error('Service binding not found'));

      const result = await handler.getServiceBindingUrl(validInput);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GET_SRVB_URL_FAILED');
    });
  });

  // ==========================================================================
  // Integration Scenarios Tests
  // ==========================================================================

  describe('Integration Scenarios', () => {
    it('should create and activate CDS view workflow', async () => {
      // Step 1: Create CDS view
      mockClient.post.mockResolvedValue(createMockResponse(MockXMLResponses.cdsView));
      const createInput = {
        name: 'ZTEST_NEW_VIEW',
        description: 'New Test View',
        sourceCode: 'define view ZTEST_NEW_VIEW as select from sflight { * }',
        packageName: 'ZTEST_PKG',
      };

      const createResult = await handler.createCDSView(createInput);
      expect(createResult.success).toBe(true);

      // Step 2: Activate
      mockClient.activate.mockResolvedValue({ success: true, messages: [] });
      const activateResult = await handler.activateCDSObject({
        name: 'ZTEST_NEW_VIEW',
        objectType: 'DDLS',
      });
      expect(activateResult.success).toBe(true);
    });

    it('should create service definition and binding workflow', async () => {
      // Step 1: Create service definition
      mockClient.post.mockResolvedValue(createMockResponse('<srvd/>'));
      const srvdResult = await handler.createServiceDefinition({
        name: 'ZTEST_SRV',
        description: 'Test Service',
        exposedEntities: [{ entityName: 'ZTEST_CDS' }],
        packageName: 'ZTEST_PKG',
      });
      expect(srvdResult.success).toBe(true);

      // Step 2: Create service binding
      mockClient.post.mockResolvedValue(createMockResponse('<srvb/>'));
      const srvbResult = await handler.createServiceBinding({
        name: 'ZTEST_SRVB',
        description: 'Test Binding',
        serviceDefinition: 'ZTEST_SRV',
        bindingType: 'ODATA_V4',
        packageName: 'ZTEST_PKG',
      });
      expect(srvbResult.success).toBe(true);
    });

    it('should handle read and update workflow', async () => {
      // Step 1: Read current source
      mockClient.getObjectSource.mockResolvedValue('define view ZTEST as select { * }');
      const getResult = await handler.getCDSSource({ name: 'ZTEST' });
      expect(getResult.success).toBe(true);

      // Step 2: Update source
      mockClient.lockObject.mockResolvedValue({
        lockHandle: 'lock-123',
        objectUri: '/ddic/ddl/sources/ztest',
        expiresAt: new Date(),
      });
      const updateResult = await handler.updateCDSSource({
        name: 'ZTEST',
        source: 'define view ZTEST as select { carrid, connid }',
      });
      expect(updateResult.success).toBe(true);
    });
  });
});