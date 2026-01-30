# Tech Context

## Technologies Used

### Core Runtime
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >= 18.0.0 | Runtime environment |
| TypeScript | ^5.0.0 | Type-safe development |
| npm | >= 8.0.0 | Package management |

### Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @modelcontextprotocol/sdk | ^1.0.0 | MCP protocol implementation |
| axios | ^1.6.0 | HTTP client for ADT API calls |
| fast-xml-parser | ^4.3.0 | XML parsing for ADT responses |
| dotenv | ^16.0.0 | Environment configuration |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| jest | ^29.0.0 | Unit testing framework |
| ts-jest | ^29.0.0 | TypeScript support for Jest |
| typescript | ^5.0.0 | TypeScript compiler |
| @types/node | ^20.0.0 | Node.js type definitions |

## Development Setup

### Prerequisites
1. Node.js 18+ installed
2. Access to SAP system with ADT enabled
3. SAP user with development authorization

### Initial Setup
```bash
# Clone repository
git clone https://github.com/maozhen/sap-abap-mcp.git
cd sap-abap-mcp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with SAP credentials
```

### Environment Configuration
Create `.env` file with required variables:
```env
# SAP System Connection
SAP_HOST=https://your-sap-system.com
SAP_PORT=443
SAP_CLIENT=100
SAP_USER=your_username
SAP_PASSWORD=your_password

# Optional Settings
SAP_LANGUAGE=EN
LOG_LEVEL=info
```

### Build & Run
```bash
# Compile TypeScript
npm run build

# Run server (stdio mode for MCP)
npm start

# Development mode (auto-reload)
npm run dev
```

### Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests (requires SAP connection)
npm run test:integration
```

## Technical Constraints

### SAP ADT API Requirements
1. **HTTPS Required**: All ADT communication over secure connection
2. **Basic Authentication**: Username/password per request
3. **CSRF Token**: Required for all modifying operations
4. **Object Locking**: Must lock objects before modification
5. **XML Format**: All responses in XML, must be parsed

### Node.js Constraints
1. **Minimum Version 18**: Required for modern ES modules
2. **Memory**: Adequate heap for XML parsing of large responses
3. **Network**: Stable connection to SAP system

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### MCP Protocol Constraints
1. **stdio Transport**: Communication via stdin/stdout
2. **JSON-RPC**: Message format for tool calls
3. **Schema Validation**: Input validated against JSON schemas
4. **Single Response**: Each tool call returns one result

## Dependencies Deep Dive

### @modelcontextprotocol/sdk
- Provides MCP server implementation
- Handles protocol message parsing
- Tool registration and routing
- Error response formatting

Usage:
```typescript
import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';

const server = new Server({ name: 'sap-abap-mcp' });
server.setRequestHandler('tools/call', handleToolCall);
```

### axios
- HTTP client for all ADT API calls
- Supports interceptors for token management
- Handles Basic Auth automatically
- Response/error transformation

Configuration:
```typescript
const client = axios.create({
  baseURL: `${SAP_HOST}:${SAP_PORT}/sap/bc/adt`,
  auth: { username: SAP_USER, password: SAP_PASSWORD },
  headers: { 'X-CSRF-Token': 'Fetch' }
});
```

### fast-xml-parser
- Parses XML responses to JavaScript objects
- Configurable attribute handling
- Preserves element ordering
- Handles CDATA sections

Configuration:
```typescript
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
  trimValues: true
});
```

## Tool Usage Patterns

### ADT Client Initialization
```typescript
class ADTClient {
  private csrfToken: string | null = null;
  
  async ensureCSRFToken(): Promise<string> {
    if (!this.csrfToken) {
      const response = await this.axios.get('/discovery', {
        headers: { 'X-CSRF-Token': 'Fetch' }
      });
      this.csrfToken = response.headers['x-csrf-token'];
    }
    return this.csrfToken;
  }
}
```

### Lock Management Pattern
```typescript
async lock(uri: string): Promise<string> {
  const response = await this.axios.post(
    `${uri}?_action=LOCK&accessMode=MODIFY`,
    null,
    { headers: { 'X-CSRF-Token': await this.ensureCSRFToken() } }
  );
  return response.headers['x-sap-adt-lockhandle'];
}

async unlock(uri: string, lockHandle: string): Promise<void> {
  await this.axios.post(
    `${uri}?_action=UNLOCK`,
    null,
    { 
      headers: { 
        'X-CSRF-Token': await this.ensureCSRFToken(),
        'X-sap-adt-lockhandle': lockHandle
      } 
    }
  );
}
```

### XML Request Building
```typescript
function buildCreateRequest(params: CreateParams): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<object xmlns="http://www.sap.com/adt/...">
  <name>${escapeXml(params.name)}</name>
  <description>${escapeXml(params.description)}</description>
</object>`;
}
```

## File Structure

```
sap-abap-mcp/
├── src/
│   ├── index.ts              # MCP entry point
│   ├── server.ts             # Main server class
│   ├── clients/
│   │   └── adt-client.ts     # HTTP client for ADT
│   ├── tools/
│   │   ├── index.ts          # Tool exports
│   │   ├── ddic-tools.ts     # DDIC operations
│   │   ├── program-tools.ts  # Program operations
│   │   ├── cds-tools.ts      # CDS operations
│   │   ├── testing-tools.ts  # Unit test operations
│   │   ├── system-tools.ts   # System operations
│   │   └── transport-tools.ts# Transport operations
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── utils/
│       ├── errors.ts         # Error classes
│       ├── logger.ts         # Logging utility
│       ├── uri-helpers.ts    # URI building helpers
│       └── xml-parser.ts     # XML parsing config
├── tests/
│   ├── mocks/
│   │   └── adt-client.mock.ts
│   └── tools/
│       └── *.test.ts         # Unit tests per tool
├── scripts/
│   ├── integration/
│   │   └── *.integration.ts  # Integration tests
│   └── *.ts                  # Utility scripts
├── docs/
│   └── *.md                  # Documentation
├── memory-bank/
│   └── *.md                  # Memory Bank files
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.example
```

## Error Handling Strategy

### Error Classes
```typescript
class ADTError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public adtCode?: string
  ) {
    super(message);
    this.name = 'ADTError';
  }
}
```

### Error Response Format
```typescript
function formatError(error: ADTError) {
  return {
    error: true,
    message: error.message,
    code: error.statusCode,
    details: error.adtCode
  };
}
```

## Logging Configuration

### Logger Setup
```typescript
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console()
  ]
});
```

### Log Levels
- `error`: Operation failures, API errors
- `warn`: Recoverable issues, deprecations
- `info`: Operation completion, key events
- `debug`: Request/response details, state changes