/**
 * Transport Tools Unit Tests
 * Tests for TransportToolHandler class
 */

import { TransportToolHandler } from '../../src/tools/transport-tools';
import { MockADTClient, createMockADTClient, asMockADTClient, createMockResponse, MockXMLResponses } from '../mocks/adt-client.mock';

describe('TransportToolHandler', () => {
  let mockClient: MockADTClient;
  let handler: TransportToolHandler;

  beforeEach(() => {
    mockClient = createMockADTClient();
    handler = new TransportToolHandler(asMockADTClient(mockClient));
  });

  afterEach(() => {
    mockClient.resetMocks();
  });

  // ============================================================================
  // getTransportRequests Tests
  // ============================================================================
  describe('getTransportRequests', () => {
    it('should return transport requests list successfully', async () => {
      mockClient.setupGetSuccess(MockXMLResponses.transportRequestList);

      const result = await handler.getTransportRequests({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.requests.length).toBe(2);
      expect(result.data!.requests[0].number).toBe('DEVK900001');
      expect(result.data!.requests[0].description).toBe('Test Transport Request');
      expect(result.data!.requests[0].status).toBe('modifiable');
      expect(result.data!.requests[0].type).toBe('workbench');
    });

    it('should filter by user when specified', async () => {
      mockClient.setupGetSuccess(MockXMLResponses.transportRequestList);

      const result = await handler.getTransportRequests({ user: 'TESTUSER' });

      expect(result.success).toBe(true);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/cts/transportrequests',
        expect.objectContaining({
          params: expect.objectContaining({ user: 'TESTUSER' })
        })
      );
    });

    it('should filter by request types when specified', async () => {
      mockClient.setupGetSuccess(MockXMLResponses.transportRequestList);

      const result = await handler.getTransportRequests({ requestTypes: ['K', 'W'] });

      expect(result.success).toBe(true);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/cts/transportrequests',
        expect.objectContaining({
          params: expect.objectContaining({ requestTypes: 'K,W' })
        })
      );
    });

    it('should filter by status when specified', async () => {
      mockClient.setupGetSuccess(MockXMLResponses.transportRequestList);

      const result = await handler.getTransportRequests({ status: ['D', 'R'] });

      expect(result.success).toBe(true);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/cts/transportrequests',
        expect.objectContaining({
          params: expect.objectContaining({ status: 'D,R' })
        })
      );
    });

    it('should handle empty response', async () => {
      mockClient.setupGetSuccess('');

      const result = await handler.getTransportRequests({});

      expect(result.success).toBe(true);
      expect(result.data!.requests).toEqual([]);
      expect(result.data!.totalCount).toBe(0);
    });

    it('should handle API error', async () => {
      mockClient.setupGetError(new Error('Connection failed'));

      const result = await handler.getTransportRequests({});

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.code).toBe('GET_TRANSPORTS_FAILED');
    });
  });

  // ============================================================================
  // createTransportRequest Tests
  // ============================================================================
  describe('createTransportRequest', () => {
    it('should create workbench transport request successfully', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.transportRequestCreated);

      const result = await handler.createTransportRequest({
        description: 'New Transport',
        type: 'workbench',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.requestNumber).toBe('DEVK900003');
      expect(result.data!.taskNumber).toBe('DEVK900004');
      expect(result.data!.description).toBe('New Transport');
    });

    it('should create customizing transport request successfully', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.transportRequestCreated);

      const result = await handler.createTransportRequest({
        description: 'Customizing Transport',
        type: 'customizing',
        targetSystem: 'QAS',
      });

      expect(result.success).toBe(true);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/cts/transportrequests',
        expect.stringContaining('tm:type'),
        expect.any(Object)
      );
    });

    it('should include target system when specified', async () => {
      mockClient.setupPostSuccess(MockXMLResponses.transportRequestCreated);

      await handler.createTransportRequest({
        description: 'Transport with target',
        type: 'workbench',
        targetSystem: 'QAS',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/cts/transportrequests',
        expect.stringContaining('tm:target'),
        expect.any(Object)
      );
    });

    it('should handle creation error', async () => {
      mockClient.setupPostError(new Error('Creation failed'));

      const result = await handler.createTransportRequest({
        description: 'New Transport',
        type: 'workbench',
      });

      expect(result.success).toBe(false);
      expect(result.error!.code).toBe('CREATE_TRANSPORT_FAILED');
    });
  });

  // ============================================================================
  // releaseTransportRequest Tests
  // ============================================================================
  describe('releaseTransportRequest', () => {
    it('should release transport request successfully', async () => {
      mockClient.setupPostSuccess('');

      const result = await handler.releaseTransportRequest({
        requestNumber: 'DEVK900001',
      });

      expect(result.success).toBe(true);
      expect(result.data!.requestNumber).toBe('DEVK900001');
      expect(result.data!.released).toBe(true);
      expect(result.data!.releasedAt).toBeDefined();
    });

    it('should release tasks first when releaseTasks is true', async () => {
      // First call: get transport contents
      mockClient.get.mockResolvedValueOnce(createMockResponse(MockXMLResponses.transportContents));
      // Subsequent calls: release operations
      mockClient.post.mockResolvedValue(createMockResponse(''));

      const result = await handler.releaseTransportRequest({
        requestNumber: 'DEVK900001',
        releaseTasks: true,
      });

      expect(result.success).toBe(true);
      // Should have called post multiple times (for tasks and request)
      expect(mockClient.post.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle release error', async () => {
      mockClient.setupPostError(new Error('Release failed'));

      const result = await handler.releaseTransportRequest({
        requestNumber: 'DEVK900001',
      });

      expect(result.success).toBe(false);
      expect(result.error!.code).toBe('RELEASE_TRANSPORT_FAILED');
    });
  });

  // ============================================================================
  // addObjectToTransport Tests
  // ============================================================================
  describe('addObjectToTransport', () => {
    it('should add object to transport with specified task', async () => {
      mockClient.setupPostSuccess('');

      const result = await handler.addObjectToTransport({
        requestNumber: 'DEVK900001',
        pgmid: 'R3TR',
        objectType: 'CLAS',
        objectName: 'ZCL_TEST',
        taskNumber: 'DEVK900002',
      });

      expect(result.success).toBe(true);
      expect(result.data!.requestNumber).toBe('DEVK900001');
      expect(result.data!.taskNumber).toBe('DEVK900002');
      expect(result.data!.object.objectName).toBe('ZCL_TEST');
      expect(result.data!.added).toBe(true);
    });

    it('should find modifiable task when taskNumber not specified', async () => {
      // First call: get transport contents
      mockClient.get.mockResolvedValueOnce(createMockResponse(MockXMLResponses.transportContents));
      // Second call: add object
      mockClient.post.mockResolvedValueOnce(createMockResponse(''));

      const result = await handler.addObjectToTransport({
        requestNumber: 'DEVK900001',
        pgmid: 'R3TR',
        objectType: 'TABL',
        objectName: 'ZTEST_TABLE',
      });

      expect(result.success).toBe(true);
      expect(result.data!.taskNumber).toBeDefined();
    });

    it('should return error when no modifiable task found', async () => {
      // Return transport with released tasks only
      const releasedTasksXml = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test" tm:owner="USER" tm:status="D" tm:type="K">
    <tm:task tm:number="DEVK900002" tm:desc="Task" tm:owner="USER" tm:status="R"/>
  </tm:request>
</tm:root>`;
      mockClient.get.mockResolvedValueOnce(createMockResponse(releasedTasksXml));

      const result = await handler.addObjectToTransport({
        requestNumber: 'DEVK900001',
        pgmid: 'R3TR',
        objectType: 'CLAS',
        objectName: 'ZCL_TEST',
      });

      expect(result.success).toBe(false);
      expect(result.error!.code).toBe('NO_MODIFIABLE_TASK');
    });

    it('should return error when no tasks found', async () => {
      // Return transport with no tasks
      const noTasksXml = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test" tm:owner="USER" tm:status="D" tm:type="K"/>
</tm:root>`;
      mockClient.get.mockResolvedValueOnce(createMockResponse(noTasksXml));

      const result = await handler.addObjectToTransport({
        requestNumber: 'DEVK900001',
        pgmid: 'R3TR',
        objectType: 'CLAS',
        objectName: 'ZCL_TEST',
      });

      expect(result.success).toBe(false);
      expect(result.error!.code).toBe('NO_TASKS_FOUND');
    });

    it('should handle add object error', async () => {
      mockClient.setupPostError(new Error('Add failed'));

      const result = await handler.addObjectToTransport({
        requestNumber: 'DEVK900001',
        pgmid: 'R3TR',
        objectType: 'CLAS',
        objectName: 'ZCL_TEST',
        taskNumber: 'DEVK900002',
      });

      expect(result.success).toBe(false);
      expect(result.error!.code).toBe('ADD_OBJECT_FAILED');
    });
  });

  // ============================================================================
  // getTransportContents Tests
  // ============================================================================
  describe('getTransportContents', () => {
    it('should return transport contents successfully', async () => {
      mockClient.setupGetSuccess(MockXMLResponses.transportContents);

      const result = await handler.getTransportContents({
        requestNumber: 'DEVK900001',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.request.number).toBe('DEVK900001');
      expect(result.data!.tasks.length).toBe(1);
      expect(result.data!.tasks[0].number).toBe('DEVK900002');
      expect(result.data!.tasks[0].objects).toBeDefined();
      expect(result.data!.tasks[0].objects!.length).toBe(2);
      expect(result.data!.totalObjects).toBe(2);
    });

    it('should parse task objects correctly', async () => {
      mockClient.setupGetSuccess(MockXMLResponses.transportContents);

      const result = await handler.getTransportContents({
        requestNumber: 'DEVK900001',
        includeTasks: true,
      });

      expect(result.success).toBe(true);
      const objects = result.data!.tasks[0].objects!;
      expect(objects[0].pgmid).toBe('R3TR');
      expect(objects[0].objectType).toBe('CLAS');
      expect(objects[0].objectName).toBe('ZCL_TEST');
      expect(objects[1].objectType).toBe('TABL');
      expect(objects[1].objectName).toBe('ZTEST_TABLE');
    });

    it('should handle empty transport', async () => {
      const emptyTransportXml = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Empty Transport" tm:owner="USER" tm:status="D" tm:type="K"/>
</tm:root>`;
      mockClient.setupGetSuccess(emptyTransportXml);

      const result = await handler.getTransportContents({
        requestNumber: 'DEVK900001',
      });

      expect(result.success).toBe(true);
      expect(result.data!.tasks).toEqual([]);
      expect(result.data!.totalObjects).toBe(0);
    });

    it('should handle get contents error', async () => {
      mockClient.setupGetError(new Error('Not found'));

      const result = await handler.getTransportContents({
        requestNumber: 'DEVK900001',
      });

      expect(result.success).toBe(false);
      expect(result.error!.code).toBe('GET_CONTENTS_FAILED');
    });
  });

  // ============================================================================
  // Status Mapping Tests
  // ============================================================================
  describe('Status Mapping', () => {
    it('should map status D to modifiable', async () => {
      const xmlWithStatusD = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test" tm:owner="USER" tm:status="D" tm:type="K"/>
</tm:root>`;
      mockClient.setupGetSuccess(xmlWithStatusD);

      const result = await handler.getTransportRequests({});

      expect(result.data!.requests[0].status).toBe('modifiable');
    });

    it('should map status R to released', async () => {
      const xmlWithStatusR = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test" tm:owner="USER" tm:status="R" tm:type="K"/>
</tm:root>`;
      mockClient.setupGetSuccess(xmlWithStatusR);

      const result = await handler.getTransportRequests({});

      expect(result.data!.requests[0].status).toBe('released');
    });

    it('should map status O to locked', async () => {
      const xmlWithStatusO = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test" tm:owner="USER" tm:status="O" tm:type="K"/>
</tm:root>`;
      mockClient.setupGetSuccess(xmlWithStatusO);

      const result = await handler.getTransportRequests({});

      expect(result.data!.requests[0].status).toBe('locked');
    });

    it('should map type K to workbench', async () => {
      const xmlWithTypeK = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVK900001" tm:desc="Test" tm:owner="USER" tm:status="D" tm:type="K"/>
</tm:root>`;
      mockClient.setupGetSuccess(xmlWithTypeK);

      const result = await handler.getTransportRequests({});

      expect(result.data!.requests[0].type).toBe('workbench');
    });

    it('should map type W to customizing', async () => {
      const xmlWithTypeW = `<?xml version="1.0" encoding="UTF-8"?>
<tm:root xmlns:tm="http://www.sap.com/cts/adt/tm">
  <tm:request tm:number="DEVC900001" tm:desc="Test" tm:owner="USER" tm:status="D" tm:type="W"/>
</tm:root>`;
      mockClient.setupGetSuccess(xmlWithTypeW);

      const result = await handler.getTransportRequests({});

      expect(result.data!.requests[0].type).toBe('customizing');
    });
  });
});