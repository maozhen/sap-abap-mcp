/**
 * Unit Tests for System Tools Handler
 * Tests system info, packages, message classes, and number ranges operations
 */

import { SystemToolHandler } from '../../src/tools/system-tools';
import { createMockADTClient, asMockADTClient, createMockResponse, MockADTClient } from '../mocks/adt-client.mock';

describe('SystemToolHandler', () => {
  let mockClient: MockADTClient;
  let handler: SystemToolHandler;

  beforeEach(() => {
    mockClient = createMockADTClient();
    handler = new SystemToolHandler(asMockADTClient(mockClient));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // getSystemInfo Tests
  // ============================================
  describe('getSystemInfo', () => {
    it('should retrieve system information successfully', async () => {
      const discoveryXml = `<?xml version="1.0" encoding="UTF-8"?>
<app:service xmlns:app="http://www.w3.org/2007/app">
  <app:workspace>
    <app:collection href="/sap/bc/adt/programs">
      <atom:title>Programs</atom:title>
    </app:collection>
  </app:workspace>
</app:service>`;

      const systemInfoXml = `<?xml version="1.0" encoding="UTF-8"?>
<systemInfo xmlns="http://www.sap.com/adt/core">
  <systemId>DEV</systemId>
  <client>100</client>
  <host>sapdev.example.com</host>
  <release>756</release>
  <version>SAP S/4HANA 2023</version>
  <kernel>785</kernel>
  <operatingSystem>Linux</operatingSystem>
  <database>HANA</database>
  <unicode>true</unicode>
  <systemType>ABAP</systemType>
  <languages>
    <language code="EN"/>
    <language code="DE"/>
  </languages>
</systemInfo>`;

      mockClient.get
        .mockResolvedValueOnce(createMockResponse(discoveryXml))
        .mockResolvedValueOnce(createMockResponse(systemInfoXml));

      const result = await handler.getSystemInfo();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockClient.get).toHaveBeenCalledTimes(2);
      expect(mockClient.get).toHaveBeenNthCalledWith(1, '/discovery', expect.any(Object));
      expect(mockClient.get).toHaveBeenNthCalledWith(2, '/core/systeminfo', expect.any(Object));
    });

    it('should use connection info as fallback for missing fields', async () => {
      const discoveryXml = `<?xml version="1.0" encoding="UTF-8"?><service/>`;
      const systemInfoXml = `<?xml version="1.0" encoding="UTF-8"?>
<systemInfo xmlns="http://www.sap.com/adt/core">
  <systemId>DEV</systemId>
</systemInfo>`;

      mockClient.get
        .mockResolvedValueOnce(createMockResponse(discoveryXml))
        .mockResolvedValueOnce(createMockResponse(systemInfoXml));

      mockClient.getConnectionInfo.mockReturnValue({
        host: 'fallback-host.sap.com',
        client: '200',
        user: 'TESTUSER',
      });

      const result = await handler.getSystemInfo();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      mockClient.get.mockRejectedValue(new Error('Connection timeout'));

      const result = await handler.getSystemInfo();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('GET_SYSTEM_INFO_FAILED');
      expect(result.error?.message).toContain('Connection timeout');
    });
  });

  // ============================================
  // getPackageInfo Tests
  // ============================================
  describe('getPackageInfo', () => {
    it('should retrieve package information successfully', async () => {
      const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
<pak:package xmlns:pak="http://www.sap.com/adt/packages" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZTEST_PACKAGE"
  adtcore:description="Test Package"
  pak:packageType="development"
  pak:responsible="TESTUSER"
  pak:createdBy="ADMIN"
  pak:createdAt="2025-01-15T10:30:00Z">
  <pak:superPackage pak:name="ZSUPER_PKG"/>
  <pak:softwareComponent pak:name="LOCAL"/>
  <pak:applicationComponent pak:name="FIN"/>
  <pak:transportLayer pak:name="STMS"/>
  <pak:subPackages>
    <pak:subPackage pak:name="ZTEST_SUB1"/>
    <pak:subPackage pak:name="ZTEST_SUB2"/>
  </pak:subPackages>
  <pak:objects>
    <pak:object adtcore:name="ZCL_TEST" adtcore:type="CLAS" adtcore:description="Test Class"/>
    <pak:object adtcore:name="ZTEST_TABLE" adtcore:type="TABL" adtcore:description="Test Table"/>
  </pak:objects>
</pak:package>`;

      mockClient.setupGetSuccess(packageXml);

      const result = await handler.getPackageInfo({ packageName: 'ZTEST_PACKAGE' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_PACKAGE');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/packages/ztest_package',
        expect.objectContaining({
          headers: { 'Accept': 'application/vnd.sap.adt.packages.v1+xml, application/xml, */*' },
        })
      );
    });

    it('should handle package not found error', async () => {
      mockClient.setupGetError(new Error('Package not found: ZNONEXISTENT'));

      const result = await handler.getPackageInfo({ packageName: 'ZNONEXISTENT' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('GET_PACKAGE_INFO_FAILED');
      expect(result.error?.message).toContain('ZNONEXISTENT');
    });

    it('should convert package name to lowercase in URI', async () => {
      mockClient.setupGetSuccess('<pak:package xmlns:pak="http://www.sap.com/adt/packages"/>');

      await handler.getPackageInfo({ packageName: 'ZTEST_UPPER' });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/packages/ztest_upper',
        expect.any(Object)
      );
    });
  });

  // ============================================
  // createPackage Tests
  // ============================================
  describe('createPackage', () => {
    it('should create a development package successfully', async () => {
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<pak:package xmlns:pak="http://www.sap.com/adt/packages" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZNEW_PACKAGE"/>`;

      mockClient.setupPostSuccess(responseXml);

      const result = await handler.createPackage({
        name: 'ZNEW_PACKAGE',
        description: 'New Development Package',
        superPackage: 'ZPARENT',
        softwareComponent: 'LOCAL',
        applicationComponent: 'FIN',
        transportLayer: 'STMS',
        packageType: 'development',
        transportRequest: 'DEVK900001',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZNEW_PACKAGE');
      expect(result.data?.description).toBe('New Development Package');
      expect(result.data?.packageType).toBe('development');
      expect(result.data?.superPackage).toBe('ZPARENT');
      expect(mockClient.post).toHaveBeenCalledWith(
        '/packages/znew_package',
        expect.any(String),
        expect.objectContaining({
          params: { corrNr: 'DEVK900001' },
        })
      );
    });

    it('should create a structure package successfully', async () => {
      mockClient.setupPostSuccess('<pak:package/>');

      const result = await handler.createPackage({
        name: 'ZSTRUCTURE_PKG',
        description: 'Structure Package',
        packageType: 'structure',
      });

      expect(result.success).toBe(true);
      expect(result.data?.packageType).toBe('structure');
    });

    it('should create a main package successfully', async () => {
      mockClient.setupPostSuccess('<pak:package/>');

      const result = await handler.createPackage({
        name: 'ZMAIN_PKG',
        description: 'Main Package',
        packageType: 'main',
      });

      expect(result.success).toBe(true);
      expect(result.data?.packageType).toBe('main');
    });

    it('should create package without transport request (local object)', async () => {
      mockClient.setupPostSuccess('<pak:package/>');

      const result = await handler.createPackage({
        name: 'ZLOCAL_PKG',
        description: 'Local Package',
      });

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/packages/zlocal_pkg',
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        })
      );
    });

    it('should handle package creation failure', async () => {
      mockClient.setupPostError(new Error('Package already exists'));

      const result = await handler.createPackage({
        name: 'ZEXISTING_PKG',
        description: 'Test Package',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_PACKAGE_FAILED');
      expect(result.error?.message).toContain('Package already exists');
    });
  });

  // ============================================
  // getMessageClass Tests
  // ============================================
  describe('getMessageClass', () => {
    it('should retrieve message class with messages successfully', async () => {
      const messageClassXml = `<?xml version="1.0" encoding="UTF-8"?>
<msag:messageClass xmlns:msag="http://www.sap.com/adt/messageclass" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZTEST_MSG"
  adtcore:description="Test Message Class"
  adtcore:packageRef="ZTEST_PKG"
  msag:responsible="TESTUSER">
  <msag:messages>
    <msag:message msag:number="001" msag:shortText="Operation successful" msag:selfExplanatory="true"/>
    <msag:message msag:number="002" msag:shortText="Error occurred: &amp;1" msag:selfExplanatory="false"/>
    <msag:message msag:number="003" msag:shortText="Warning: &amp;1 &amp;2" msag:selfExplanatory="false"/>
  </msag:messages>
</msag:messageClass>`;

      mockClient.setupGetSuccess(messageClassXml);

      const result = await handler.getMessageClass({ messageClassName: 'ZTEST_MSG' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_MSG');
      expect(result.data?.messages).toHaveLength(3);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/messageclass/ztest_msg',
        expect.objectContaining({
          headers: { 'Accept': 'application/vnd.sap.adt.messageclass.v2+xml, application/vnd.sap.adt.messageclass.v1+xml, application/xml, */*' },
        })
      );
    });

    it('should handle empty message class', async () => {
      const emptyMessageClassXml = `<?xml version="1.0" encoding="UTF-8"?>
<msag:messageClass xmlns:msag="http://www.sap.com/adt/messageclass" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZEMPTY_MSG"
  adtcore:description="Empty Message Class"/>`;

      mockClient.setupGetSuccess(emptyMessageClassXml);

      const result = await handler.getMessageClass({ messageClassName: 'ZEMPTY_MSG' });

      expect(result.success).toBe(true);
      expect(result.data?.messages).toHaveLength(0);
    });

    it('should handle message class not found error', async () => {
      mockClient.setupGetError(new Error('Message class not found: ZNONEXISTENT'));

      const result = await handler.getMessageClass({ messageClassName: 'ZNONEXISTENT' });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GET_MESSAGE_CLASS_FAILED');
    });
  });

  // ============================================
  // createMessageClass Tests
  // ============================================
  describe('createMessageClass', () => {
    it('should create message class with messages successfully', async () => {
      mockClient.setupPostSuccess('<msag:messageClass/>');

      const result = await handler.createMessageClass({
        name: 'ZNEW_MSG',
        description: 'New Message Class',
        messages: [
          { number: '001', shortText: 'Success message', selfExplanatory: true },
          { number: '002', shortText: 'Error: &1', selfExplanatory: false },
          { number: '003', shortText: 'Info: &1 &2 &3' },
        ],
        packageName: 'ZTEST_PKG',
        transportRequest: 'DEVK900001',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZNEW_MSG');
      expect(result.data?.messages).toHaveLength(3);
      expect(result.data?.messages[0].selfExplanatory).toBe(true);
      expect(result.data?.messages[2].selfExplanatory).toBe(false);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/messageclass/znew_msg',
        expect.any(String),
        expect.objectContaining({
          params: { corrNr: 'DEVK900001' },
        })
      );
    });

    it('should create message class without messages', async () => {
      mockClient.setupPostSuccess('<msag:messageClass/>');

      const result = await handler.createMessageClass({
        name: 'ZEMPTY_MSG',
        description: 'Empty Message Class',
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(true);
      expect(result.data?.messages).toHaveLength(0);
    });

    it('should create message class without transport request', async () => {
      mockClient.setupPostSuccess('<msag:messageClass/>');

      const result = await handler.createMessageClass({
        name: 'ZLOCAL_MSG',
        description: 'Local Message Class',
        packageName: '$TMP',
      });

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/messageclass/zlocal_msg',
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        })
      );
    });

    it('should handle message class creation failure', async () => {
      mockClient.setupPostError(new Error('Invalid message number format'));

      const result = await handler.createMessageClass({
        name: 'ZINVALID_MSG',
        description: 'Invalid Message Class',
        messages: [{ number: 'INVALID', shortText: 'Test' }],
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_MESSAGE_CLASS_FAILED');
    });
  });

  // ============================================
  // getNumberRange Tests
  // ============================================
  describe('getNumberRange', () => {
    it('should retrieve number range object with intervals successfully', async () => {
      const numberRangeXml = `<?xml version="1.0" encoding="UTF-8"?>
<nrob:numberRangeObject xmlns:nrob="http://www.sap.com/adt/nrob" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZTEST_NROB"
  adtcore:description="Test Number Range"
  adtcore:packageRef="ZTEST_PKG"
  nrob:numberLength="10"
  nrob:percentage="10"
  nrob:domainName="ZTEST_DOMAIN">
  <nrob:intervals>
    <nrob:interval nrob:subObject="" nrob:fromNumber="0000000001" nrob:toNumber="0000999999" 
      nrob:currentNumber="0000000100" nrob:external="false" nrob:buffered="true"/>
    <nrob:interval nrob:subObject="EXT" nrob:fromNumber="1000000000" nrob:toNumber="1999999999" 
      nrob:currentNumber="1000000000" nrob:external="true" nrob:buffered="false"/>
  </nrob:intervals>
</nrob:numberRangeObject>`;

      mockClient.setupGetSuccess(numberRangeXml);

      const result = await handler.getNumberRange({ objectName: 'ZTEST_NROB' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZTEST_NROB');
      expect(result.data?.numberLength).toBe(10);
      expect(result.data?.intervals).toHaveLength(2);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/nrob/ztest_nrob',
        expect.objectContaining({
          headers: { 'Accept': 'application/vnd.sap.adt.nrob.v1+xml, application/xml, */*' },
        })
      );
    });

    it('should handle number range without intervals', async () => {
      const emptyNrobXml = `<?xml version="1.0" encoding="UTF-8"?>
<nrob:numberRangeObject xmlns:nrob="http://www.sap.com/adt/nrob" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZEMPTY_NROB"
  adtcore:description="Empty Number Range"
  nrob:numberLength="8"/>`;

      mockClient.setupGetSuccess(emptyNrobXml);

      const result = await handler.getNumberRange({ objectName: 'ZEMPTY_NROB' });

      expect(result.success).toBe(true);
      expect(result.data?.intervals).toHaveLength(0);
    });

    it('should handle number range not found error', async () => {
      mockClient.setupGetError(new Error('Number range object not found'));

      const result = await handler.getNumberRange({ objectName: 'ZNONEXISTENT' });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GET_NUMBER_RANGE_FAILED');
    });
  });

  // ============================================
  // createNumberRange Tests
  // ============================================
  describe('createNumberRange', () => {
    it('should create number range with intervals successfully', async () => {
      mockClient.setupPostSuccess('<nrob:numberRangeObject/>');

      const result = await handler.createNumberRange({
        name: 'ZNEW_NROB',
        description: 'New Number Range',
        domainName: 'ZTEST_DOMAIN',
        numberLength: 10,
        percentage: 15,
        intervals: [
          { fromNumber: '0000000001', toNumber: '0000999999', external: false },
          { subObject: 'EXT', fromNumber: '1000000000', toNumber: '1999999999', currentNumber: '1000000000', external: true },
        ],
        packageName: 'ZTEST_PKG',
        transportRequest: 'DEVK900001',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('ZNEW_NROB');
      expect(result.data?.numberLength).toBe(10);
      expect(result.data?.percentage).toBe(15);
      expect(result.data?.intervals).toHaveLength(2);
      expect(result.data?.intervals[0].external).toBe(false);
      expect(result.data?.intervals[1].external).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/nrob/znew_nrob',
        expect.any(String),
        expect.objectContaining({
          params: { corrNr: 'DEVK900001' },
        })
      );
    });

    it('should create number range with default values', async () => {
      mockClient.setupPostSuccess('<nrob:numberRangeObject/>');

      const result = await handler.createNumberRange({
        name: 'ZSIMPLE_NROB',
        description: 'Simple Number Range',
        numberLength: 8,
        intervals: [
          { fromNumber: '00000001', toNumber: '99999999' },
        ],
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(true);
      expect(result.data?.percentage).toBe(10); // Default value
      expect(result.data?.intervals[0].currentNumber).toBe('00000001'); // Default to fromNumber
      expect(result.data?.intervals[0].external).toBe(false); // Default value
    });

    it('should create number range without transport request (local object)', async () => {
      mockClient.setupPostSuccess('<nrob:numberRangeObject/>');

      const result = await handler.createNumberRange({
        name: 'ZLOCAL_NROB',
        description: 'Local Number Range',
        numberLength: 6,
        intervals: [
          { fromNumber: '000001', toNumber: '999999' },
        ],
        packageName: '$TMP',
      });

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/nrob/zlocal_nrob',
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        })
      );
    });

    it('should handle number range creation failure', async () => {
      mockClient.setupPostError(new Error('Invalid interval: fromNumber > toNumber'));

      const result = await handler.createNumberRange({
        name: 'ZINVALID_NROB',
        description: 'Invalid Number Range',
        numberLength: 10,
        intervals: [
          { fromNumber: '9999999999', toNumber: '0000000001' }, // Invalid range
        ],
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CREATE_NUMBER_RANGE_FAILED');
      expect(result.error?.message).toContain('Invalid interval');
    });

    it('should handle multiple intervals with subobjects', async () => {
      mockClient.setupPostSuccess('<nrob:numberRangeObject/>');

      const result = await handler.createNumberRange({
        name: 'ZMULTI_NROB',
        description: 'Multi-interval Number Range',
        numberLength: 10,
        intervals: [
          { subObject: '', fromNumber: '0000000001', toNumber: '0000999999' },
          { subObject: 'A', fromNumber: '0001000000', toNumber: '0001999999' },
          { subObject: 'B', fromNumber: '0002000000', toNumber: '0002999999' },
        ],
        packageName: 'ZTEST_PKG',
      });

      expect(result.success).toBe(true);
      expect(result.data?.intervals).toHaveLength(3);
    });
  });

  // ============================================
  // Integration-like Tests
  // ============================================
  describe('Integration Scenarios', () => {
    it('should handle complete package creation workflow', async () => {
      // Create package
      mockClient.setupPostSuccess('<pak:package/>');
      
      const createResult = await handler.createPackage({
        name: 'ZNEW_PKG',
        description: 'Complete Package',
        packageType: 'development',
        transportRequest: 'DEVK900001',
      });

      expect(createResult.success).toBe(true);

      // Retrieve package info
      const packageInfoXml = `<?xml version="1.0" encoding="UTF-8"?>
<pak:package xmlns:pak="http://www.sap.com/adt/packages" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZNEW_PKG"
  adtcore:description="Complete Package"
  pak:packageType="development"/>`;

      mockClient.setupGetSuccess(packageInfoXml);

      const getResult = await handler.getPackageInfo({ packageName: 'ZNEW_PKG' });

      expect(getResult.success).toBe(true);
      expect(getResult.data?.name).toBe('ZNEW_PKG');
    });

    it('should handle complete message class workflow', async () => {
      // Create message class
      mockClient.setupPostSuccess('<msag:messageClass/>');

      const createResult = await handler.createMessageClass({
        name: 'ZWORKFLOW_MSG',
        description: 'Workflow Messages',
        messages: [
          { number: '001', shortText: 'Start', selfExplanatory: true },
          { number: '002', shortText: 'Processing: &1' },
          { number: '003', shortText: 'Complete', selfExplanatory: true },
        ],
        packageName: 'ZTEST_PKG',
      });

      expect(createResult.success).toBe(true);

      // Retrieve message class
      const messageClassXml = `<?xml version="1.0" encoding="UTF-8"?>
<msag:messageClass xmlns:msag="http://www.sap.com/adt/messageclass" xmlns:adtcore="http://www.sap.com/adt/core"
  adtcore:name="ZWORKFLOW_MSG"
  adtcore:description="Workflow Messages">
  <msag:messages>
    <msag:message msag:number="001" msag:shortText="Start" msag:selfExplanatory="true"/>
    <msag:message msag:number="002" msag:shortText="Processing: &amp;1" msag:selfExplanatory="false"/>
    <msag:message msag:number="003" msag:shortText="Complete" msag:selfExplanatory="true"/>
  </msag:messages>
</msag:messageClass>`;

      mockClient.setupGetSuccess(messageClassXml);

      const getResult = await handler.getMessageClass({ messageClassName: 'ZWORKFLOW_MSG' });

      expect(getResult.success).toBe(true);
      expect(getResult.data?.messages).toHaveLength(3);
    });
  });
});