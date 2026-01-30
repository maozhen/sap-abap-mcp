# System Patterns

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                        Cline AI (MCP Client)                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ MCP Protocol (stdio)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SAPABAPMCPServer (server.ts)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Tool Handlers                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│  │  │  DDIC   │ │ Program │ │   CDS   │ │ Testing │        │   │
│  │  │ Tools   │ │  Tools  │ │  Tools  │ │  Tools  │        │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │   │
│  │  ┌────┴────┐ ┌────┴────┐                                 │   │
│  │  │ System  │ │Transport│                                 │   │
│  │  │  Tools  │ │  Tools  │                                 │   │
│  │  └────┬────┘ └────┬────┘                                 │   │
│  └───────┼──────────┼──────────────────────────────────────┘   │
│          │          │                                           │
│          ▼          ▼                                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ADTClient (adt-client.ts)              │   │
│  │         HTTP Client for SAP ADT REST APIs                 │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTPS (Basic Auth + CSRF)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SAP System (ADT REST API)                     │
│                    /sap/bc/adt/*                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Descriptions

#### 1. SAPABAPMCPServer (Entry Point)
- Main MCP server class handling protocol communication
- Registers all tool handlers with input schemas
- Routes tool calls to appropriate handler methods
- Manages server lifecycle (start, stop, error handling)

#### 2. ADTClient (HTTP Layer)
- Centralized HTTP client for all ADT API calls
- Handles authentication (Basic Auth)
- Manages CSRF token lifecycle
- Implements object locking/unlocking
- XML request/response handling

#### 3. Tool Handlers (Business Logic)
- **DDICTools**: Data Dictionary objects (DOMA, DTEL, TABL, STRU, TTYP)
- **ProgramTools**: ABAP code objects (CLAS, INTF, FUGR, FUNC, PROG, INCL)
- **CDSTools**: CDS entities (DDLS, SRVD, SRVB)
- **TestingTools**: Unit test execution and coverage
- **SystemTools**: System info, packages, messages, number ranges
- **TransportTools**: Transport request management

## Key Technical Decisions

### 1. Lock-Before-Modify Pattern
**Decision**: All modify operations acquire ADT lock first
**Rationale**: 
- ADT API requires exclusive locks for object modifications
- Prevents concurrent modification conflicts
- Lock handle must be preserved across request sequence

```typescript
// Pattern: Lock -> Modify -> Unlock
async updateObject(name: string, content: string) {
  const lockHandle = await this.client.lock(objectUri);
  try {
    await this.client.update(objectUri, content, lockHandle);
  } finally {
    await this.client.unlock(objectUri, lockHandle);
  }
}
```

### 2. XML-Centric Communication
**Decision**: Use fast-xml-parser for all ADT responses
**Rationale**:
- ADT API exclusively uses XML for responses
- Parser configured with attribute handling (`@_` prefix)
- Consistent parsing across all tool handlers

### 3. Transport Request Integration
**Decision**: Optional transport parameter on all create/update operations
**Rationale**:
- $TMP objects don't need transport
- Transportable objects require valid request
- Allows flexible usage patterns

### 4. Error Classification
**Decision**: Map HTTP status codes to specific error types
**Rationale**:
- Consistent error handling across all tools
- Clear error messages for AI to understand
- Enables retry logic for transient failures

| HTTP Status | Error Type | Typical Cause |
|-------------|------------|---------------|
| 403 | Lock Error | Missing or invalid lock |
| 404 | Not Found | Object doesn't exist |
| 422 | Validation | Invalid input data |
| 500 | Server Error | ADT API issue |

## Design Patterns in Use

### 1. Handler Pattern
Each tool category encapsulated in dedicated handler class:
```typescript
class DDICTools {
  constructor(private client: ADTClient) {}
  
  async createDomain(params: CreateDomainParams) { ... }
  async createDataElement(params: CreateDataElementParams) { ... }
  // ... more methods
}
```

### 2. Factory Pattern
Tool handlers created with shared dependencies:
```typescript
function createToolHandlers(client: ADTClient) {
  return {
    ddic: new DDICTools(client),
    program: new ProgramTools(client),
    cds: new CDSTools(client),
    testing: new TestingTools(client),
    system: new SystemTools(client),
    transport: new TransportTools(client),
  };
}
```

### 3. Builder Pattern
Complex XML bodies built incrementally:
```typescript
function buildTableXML(params: TableParams): string {
  let xml = `<tabl:ddic.ddlx.objectDefinition>`;
  xml += `<tabl:name>${params.name}</tabl:name>`;
  xml += `<tabl:description>${params.description}</tabl:description>`;
  // ... add fields, keys, etc.
  xml += `</tabl:ddic.ddlx.objectDefinition>`;
  return xml;
}
```

### 4. Template Method Pattern
Consistent operation flow across tools:
```
1. Validate input parameters
2. Build request URI and body
3. Acquire lock (if modifying)
4. Execute ADT API call
5. Parse XML response
6. Release lock (if acquired)
7. Return structured result
```

## Component Relationships

### Data Flow
```
User Request (JSON) 
    → MCP Server (parse & validate)
    → Tool Handler (business logic)
    → ADTClient (HTTP formatting)
    → SAP ADT API (XML request)
    
SAP Response (XML)
    → ADTClient (XML parsing)
    → Tool Handler (result mapping)
    → MCP Server (JSON formatting)
    → User Response (JSON)
```

### Dependency Graph
```
index.ts
    └── server.ts (SAPABAPMCPServer)
            ├── adt-client.ts (ADTClient)
            │       ├── axios (HTTP)
            │       ├── xml-parser.ts (fast-xml-parser)
            │       └── errors.ts (ADTError)
            │
            ├── ddic-tools.ts (DDICTools)
            ├── program-tools.ts (ProgramTools)
            ├── cds-tools.ts (CDSTools)
            ├── testing-tools.ts (TestingTools)
            ├── system-tools.ts (SystemTools)
            └── transport-tools.ts (TransportTools)
```

## Critical Implementation Paths

### Path 1: Create Object with Transport
```
1. Validate input (name, description, transport)
2. Build creation XML body
3. POST to /sap/bc/adt/{type} with transport param
4. Parse response for object metadata
5. Return success with object URI
```

### Path 2: Update Source Code
```
1. Acquire lock on object
2. Fetch current source (if needed for merge)
3. PUT new source to object's source endpoint
4. Release lock
5. Optionally activate object
6. Return success
```

### Path 3: Search Objects
```
1. Build search query with filters
2. GET /sap/bc/adt/repository/informationsystem/search
3. Parse XML results
4. Map to structured object list
5. Return with pagination info
```

### Path 4: Run Unit Tests
```
1. Build test run request XML
2. POST to /sap/bc/adt/abapunit/testruns
3. Poll for completion (async)
4. GET test results
5. Parse coverage data (if requested)
6. Return structured test report
```

### Path 5: Transport Management
```
Create Transport:
1. POST to /sap/bc/adt/cts/transportrequests
2. Parse response for request number

Add Object to Transport:
1. POST object reference to transport tasks endpoint

Release Transport:
1. POST release action to transport request
2. Handle task release if needed
```

## Integration Points

### MCP Protocol Integration
- Uses @modelcontextprotocol/sdk for protocol handling
- Tools registered with JSON schemas for input validation
- Responses formatted as MCP tool results

### SAP ADT API Endpoints
Key endpoint categories:
- `/sap/bc/adt/ddic/...` - Data Dictionary
- `/sap/bc/adt/oo/...` - Object-Oriented (Classes, Interfaces)
- `/sap/bc/adt/functions/...` - Function Groups/Modules
- `/sap/bc/adt/programs/...` - Reports/Includes
- `/sap/bc/adt/ddls/...` - CDS Views
- `/sap/bc/adt/srvd/...` - Service Definitions
- `/sap/bc/adt/srvb/...` - Service Bindings
- `/sap/bc/adt/abapunit/...` - Unit Testing
- `/sap/bc/adt/cts/...` - Transport System