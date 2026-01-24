# SAP ABAP 代码调试方案 - Cline 集成

## 目录
1. [概述](#概述)
2. [技术方案概览](#技术方案概览)
3. [方案一：SAP ADT REST API](#方案一sap-adt-rest-api)
4. [方案二：SAP OData 服务](#方案二sap-odata-服务)
5. [方案三：RFC/BAPI 封装](#方案三rfcbapi-封装)
6. [MCP 服务器实现方案](#mcp-服务器实现方案)
7. [方案对比与推荐](#方案对比与推荐)
8. [实施路线图](#实施路线图)

---

## 概述

### 目标
让 Cline AI 助手能够帮助开发者调试 SAP ABAP 代码，包括：
- 读取和分析 ABAP 源代码
- 执行语法检查和代码分析
- 查看运行时数据和变量
- 设置断点和调试会话
- 分析程序执行流程
- 查询数据字典和元数据

### 集成方式
根据之前的 Cline 工具系统分析，最佳集成方式是通过 **MCP（Model Context Protocol）** 创建自定义 MCP 服务器，封装 SAP 的各种 API 调用。

```
┌─────────────────────────────────────────────────────────────┐
│                      Cline Extension                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    McpHub                            │    │
│  │              (管理 MCP 连接)                         │    │
│  └─────────────────────────┬───────────────────────────┘    │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   SAP MCP Server                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  提供工具:                                           │    │
│  │  - sap_read_source: 读取ABAP源代码                   │    │
│  │  - sap_check_syntax: 语法检查                        │    │
│  │  - sap_debug_session: 调试会话管理                   │    │
│  │  - sap_query_ddic: 数据字典查询                      │    │
│  │  - sap_execute_report: 执行报表                      │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  ADT REST   │       │   OData     │       │  RFC/BAPI   │
│    API      │       │  Services   │       │   调用      │
└──────┬──────┘       └──────┬──────┘       └──────┬──────┘
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   SAP System    │
                    │  (ABAP Stack)   │
                    └─────────────────┘
```

---

## 技术方案概览

| 方案 | 技术 | 适用场景 | 复杂度 | 功能覆盖 |
|------|------|----------|--------|----------|
| **ADT REST API** | ABAP Development Tools RESTful API | 代码开发、调试、语法检查 | 中 | ⭐⭐⭐⭐⭐ |
| **OData 服务** | SAP Gateway OData | 业务数据查询、简单操作 | 低 | ⭐⭐⭐ |
| **RFC/BAPI** | SAP NetWeaver RFC SDK | 底层功能调用、自定义逻辑 | 高 | ⭐⭐⭐⭐ |

---

## 方案一：SAP ADT REST API

### 简介
ADT（ABAP Development Tools）是 Eclipse 插件形式的 ABAP 开发环境，其底层使用 REST API 与 SAP 系统通信。这些 API 提供了完整的 ABAP 开发功能。

### API 端点概览

#### 1. 源代码管理 API

```http
# 读取ABAP程序源代码
GET /sap/bc/adt/programs/programs/{program_name}/source/main
Accept: text/plain

# 读取类源代码
GET /sap/bc/adt/oo/classes/{class_name}/source/main
Accept: text/plain

# 读取函数模块源代码
GET /sap/bc/adt/functions/groups/{fg_name}/fmodules/{fm_name}/source/main
Accept: text/plain

# 保存源代码修改
PUT /sap/bc/adt/programs/programs/{program_name}/source/main
Content-Type: text/plain
```

#### 2. 语法检查 API

```http
# 语法检查
POST /sap/bc/adt/programs/programs/{program_name}/source/main
Content-Type: application/vnd.sap.adt.programs.program.v1+xml
Accept: application/vnd.sap.adt.checkruns.v1+xml

# 代码激活检查
POST /sap/bc/adt/activation
Content-Type: application/xml
```

#### 3. 调试 API

```http
# 创建调试会话
POST /sap/bc/adt/debugger/sessions
Content-Type: application/xml

# 设置断点
POST /sap/bc/adt/debugger/breakpoints
Content-Type: application/xml

# 获取变量值
GET /sap/bc/adt/debugger/sessions/{session_id}/variables/{variable_name}

# 单步执行
POST /sap/bc/adt/debugger/sessions/{session_id}/stepping
Content-Type: application/xml
```

#### 4. 数据字典 API

```http
# 查询表结构
GET /sap/bc/adt/ddic/tables/{table_name}
Accept: application/vnd.sap.adt.ddic.tables.v2+xml

# 查询数据元素
GET /sap/bc/adt/ddic/dataelements/{de_name}

# 查询域
GET /sap/bc/adt/ddic/domains/{domain_name}

# 搜索对象
GET /sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query={search_term}
```

#### 5. 执行和测试 API

```http
# 执行报表程序
POST /sap/bc/adt/programs/programs/{program_name}/actions/execute
Content-Type: application/xml

# 执行函数模块测试
POST /sap/bc/adt/functions/groups/{fg_name}/fmodules/{fm_name}/actions/execute
Content-Type: application/xml
```

### 认证方式

```http
# 基本认证
Authorization: Basic base64(username:password)

# CSRF Token (需要先获取)
GET /sap/bc/adt/core/discovery
X-CSRF-Token: Fetch

# 后续请求携带 Token
X-CSRF-Token: {token_value}
```

### ADT API 封装示例（TypeScript）

```typescript
// sap-adt-client.ts
import axios, { AxiosInstance } from 'axios';

interface ADTConfig {
  host: string;
  port: number;
  client: string;
  username: string;
  password: string;
  useTLS: boolean;
}

export class SAPADTClient {
  private client: AxiosInstance;
  private csrfToken: string = '';
  private cookies: string[] = [];

  constructor(private config: ADTConfig) {
    const baseURL = `${config.useTLS ? 'https' : 'http'}://${config.host}:${config.port}`;
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`,
        'sap-client': config.client,
      },
    });
  }

  // 获取 CSRF Token
  async fetchCSRFToken(): Promise<void> {
    const response = await this.client.get('/sap/bc/adt/core/discovery', {
      headers: { 'X-CSRF-Token': 'Fetch' },
    });
    
    this.csrfToken = response.headers['x-csrf-token'];
    this.cookies = response.headers['set-cookie'] || [];
  }

  // 读取 ABAP 程序源代码
  async readProgramSource(programName: string): Promise<string> {
    const response = await this.client.get(
      `/sap/bc/adt/programs/programs/${programName.toLowerCase()}/source/main`,
      { headers: { 'Accept': 'text/plain' } }
    );
    return response.data;
  }

  // 读取类源代码
  async readClassSource(className: string): Promise<string> {
    const response = await this.client.get(
      `/sap/bc/adt/oo/classes/${className.toLowerCase()}/source/main`,
      { headers: { 'Accept': 'text/plain' } }
    );
    return response.data;
  }

  // 语法检查
  async checkSyntax(programName: string): Promise<CheckResult[]> {
    await this.fetchCSRFToken();
    
    const response = await this.client.post(
      `/sap/bc/adt/checkruns`,
      `<?xml version="1.0" encoding="UTF-8"?>
       <chkrun:checkRunRequest xmlns:chkrun="http://www.sap.com/adt/checkruns">
         <chkrun:object chkrun:uri="/sap/bc/adt/programs/programs/${programName.toLowerCase()}"/>
       </chkrun:checkRunRequest>`,
      {
        headers: {
          'Content-Type': 'application/vnd.sap.adt.checkruns.v1+xml',
          'Accept': 'application/vnd.sap.adt.checkruns.v1+xml',
          'X-CSRF-Token': this.csrfToken,
          'Cookie': this.cookies.join('; '),
        },
      }
    );
    
    return this.parseCheckResults(response.data);
  }

  // 查询表结构
  async getTableStructure(tableName: string): Promise<TableInfo> {
    const response = await this.client.get(
      `/sap/bc/adt/ddic/tables/${tableName.toLowerCase()}`,
      { headers: { 'Accept': 'application/vnd.sap.adt.ddic.tables.v2+xml' } }
    );
    return this.parseTableInfo(response.data);
  }

  // 搜索对象
  async searchObjects(query: string, objectType?: string): Promise<SearchResult[]> {
    let url = `/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=${encodeURIComponent(query)}`;
    if (objectType) {
      url += `&objectType=${objectType}`;
    }
    
    const response = await this.client.get(url, {
      headers: { 'Accept': 'application/xml' },
    });
    return this.parseSearchResults(response.data);
  }

  // 创建调试会话
  async createDebugSession(programName: string): Promise<DebugSession> {
    await this.fetchCSRFToken();
    
    const response = await this.client.post(
      '/sap/bc/adt/debugger/sessions',
      `<?xml version="1.0" encoding="UTF-8"?>
       <dbg:debuggingSession xmlns:dbg="http://www.sap.com/adt/debugger">
         <dbg:configuration>
           <dbg:debuggingMode>user</dbg:debuggingMode>
           <dbg:terminateAfter>600</dbg:terminateAfter>
         </dbg:configuration>
       </dbg:debuggingSession>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'X-CSRF-Token': this.csrfToken,
          'Cookie': this.cookies.join('; '),
        },
      }
    );
    
    return this.parseDebugSession(response.data);
  }

  // 设置断点
  async setBreakpoint(sessionId: string, programName: string, line: number): Promise<Breakpoint> {
    const response = await this.client.post(
      '/sap/bc/adt/debugger/breakpoints',
      `<?xml version="1.0" encoding="UTF-8"?>
       <dbg:breakpoint xmlns:dbg="http://www.sap.com/adt/debugger">
         <dbg:programName>${programName}</dbg:programName>
         <dbg:line>${line}</dbg:line>
       </dbg:breakpoint>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'X-CSRF-Token': this.csrfToken,
          'Cookie': this.cookies.join('; '),
        },
      }
    );
    
    return this.parseBreakpoint(response.data);
  }

  // 获取变量值
  async getVariable(sessionId: string, variableName: string): Promise<Variable> {
    const response = await this.client.get(
      `/sap/bc/adt/debugger/sessions/${sessionId}/variables/${variableName}`,
      { headers: { 'Accept': 'application/xml' } }
    );
    return this.parseVariable(response.data);
  }

  // ... 解析方法实现
  private parseCheckResults(xml: string): CheckResult[] { /* ... */ }
  private parseTableInfo(xml: string): TableInfo { /* ... */ }
  private parseSearchResults(xml: string): SearchResult[] { /* ... */ }
  private parseDebugSession(xml: string): DebugSession { /* ... */ }
  private parseBreakpoint(xml: string): Breakpoint { /* ... */ }
  private parseVariable(xml: string): Variable { /* ... */ }
}

// 类型定义
interface CheckResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
}

interface TableInfo {
  name: string;
  description: string;
  fields: TableField[];
}

interface TableField {
  name: string;
  type: string;
  length: number;
  description: string;
}

interface SearchResult {
  name: string;
  type: string;
  description: string;
  uri: string;
}

interface DebugSession {
  id: string;
  status: string;
}

interface Breakpoint {
  id: string;
  programName: string;
  line: number;
  active: boolean;
}

interface Variable {
  name: string;
  type: string;
  value: string;
}
```

---

## 方案二：SAP OData 服务

### 简介
SAP OData 服务基于 OData 协议，提供标准化的 RESTful 接口访问 SAP 数据和功能。

### 常用 OData 服务

#### 1. 元数据服务

```http
# 获取服务元数据
GET /sap/opu/odata/sap/{SERVICE_NAME}/$metadata

# 获取实体集
GET /sap/opu/odata/sap/{SERVICE_NAME}/{EntitySet}

# 带过滤查询
GET /sap/opu/odata/sap/{SERVICE_NAME}/{EntitySet}?$filter=Field eq 'value'&$select=Field1,Field2
```

#### 2. ABAP 相关 OData 服务

| 服务名 | 用途 | 端点 |
|--------|------|------|
| SCTS_CLOUD_SERVICE | 传输管理 | /sap/opu/odata/sap/SCTS_CLOUD_SERVICE |
| CATALOGSERVICE | 服务目录 | /sap/opu/odata/sap/CATALOGSERVICE |
| API_BUSINESS_PARTNER | 业务伙伴数据 | /sap/opu/odata/sap/API_BUSINESS_PARTNER |

### OData 客户端示例

```typescript
// sap-odata-client.ts
import axios, { AxiosInstance } from 'axios';

interface ODataConfig {
  host: string;
  port: number;
  client: string;
  username: string;
  password: string;
  useTLS: boolean;
}

export class SAPODataClient {
  private client: AxiosInstance;
  private csrfToken: string = '';

  constructor(private config: ODataConfig) {
    const baseURL = `${config.useTLS ? 'https' : 'http'}://${config.host}:${config.port}`;
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`,
        'sap-client': config.client,
      },
    });
  }

  // 获取 CSRF Token
  async fetchCSRFToken(servicePath: string): Promise<void> {
    const response = await this.client.get(`${servicePath}/$metadata`, {
      headers: { 'X-CSRF-Token': 'Fetch' },
    });
    this.csrfToken = response.headers['x-csrf-token'];
  }

  // 查询实体集
  async query<T>(
    servicePath: string,
    entitySet: string,
    options?: QueryOptions
  ): Promise<ODataResponse<T>> {
    let url = `${servicePath}/${entitySet}`;
    const params: string[] = [];

    if (options?.filter) params.push(`$filter=${encodeURIComponent(options.filter)}`);
    if (options?.select) params.push(`$select=${options.select.join(',')}`);
    if (options?.expand) params.push(`$expand=${options.expand.join(',')}`);
    if (options?.top) params.push(`$top=${options.top}`);
    if (options?.skip) params.push(`$skip=${options.skip}`);
    if (options?.orderby) params.push(`$orderby=${options.orderby}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const response = await this.client.get(url, {
      headers: { 'Accept': 'application/json' },
    });

    return response.data;
  }

  // 获取单个实体
  async get<T>(
    servicePath: string,
    entitySet: string,
    key: string | Record<string, any>
  ): Promise<T> {
    const keyStr = typeof key === 'string' 
      ? `'${key}'` 
      : Object.entries(key).map(([k, v]) => `${k}='${v}'`).join(',');
    
    const response = await this.client.get(
      `${servicePath}/${entitySet}(${keyStr})`,
      { headers: { 'Accept': 'application/json' } }
    );

    return response.data.d;
  }

  // 创建实体
  async create<T>(
    servicePath: string,
    entitySet: string,
    data: Partial<T>
  ): Promise<T> {
    await this.fetchCSRFToken(servicePath);
    
    const response = await this.client.post(
      `${servicePath}/${entitySet}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': this.csrfToken,
        },
      }
    );

    return response.data.d;
  }

  // 调用 Function Import
  async callFunction<T>(
    servicePath: string,
    functionName: string,
    params?: Record<string, any>
  ): Promise<T> {
    await this.fetchCSRFToken(servicePath);
    
    let url = `${servicePath}/${functionName}`;
    if (params) {
      const paramStr = Object.entries(params)
        .map(([k, v]) => `${k}='${encodeURIComponent(v)}'`)
        .join(',');
      url += `(${paramStr})`;
    }

    const response = await this.client.get(url, {
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': this.csrfToken,
      },
    });

    return response.data.d;
  }
}

interface QueryOptions {
  filter?: string;
  select?: string[];
  expand?: string[];
  top?: number;
  skip?: number;
  orderby?: string;
}

interface ODataResponse<T> {
  d: {
    results: T[];
    __count?: string;
  };
}
```

---

## 方案三：RFC/BAPI 封装

### 简介
通过 SAP NetWeaver RFC SDK 或 node-rfc 库直接调用 SAP 的 RFC（Remote Function Call）和 BAPI（Business Application Programming Interface）。

### 常用 RFC/BAPI

| 功能 | RFC/BAPI 名称 | 描述 |
|------|---------------|------|
| 读取源代码 | RPY_PROGRAM_READ | 读取 ABAP 程序源代码 |
| 读取类定义 | SEO_CLASS_GET | 获取类定义信息 |
| 语法检查 | RS_SYNTAX_CHECK | ABAP 语法检查 |
| 表内容读取 | RFC_READ_TABLE | 读取数据库表内容 |
| 函数模块信息 | RFC_GET_FUNCTION_INTERFACE | 获取函数模块接口 |
| 执行报表 | RFC_SUBMIT_REPORT | 执行报表程序 |
| 数据字典 | DDIF_TABL_GET | 获取表结构定义 |

### node-rfc 示例

```typescript
// sap-rfc-client.ts
import { Client } from 'node-rfc';

interface RFCConfig {
  ashost: string;
  sysnr: string;
  client: string;
  user: string;
  passwd: string;
  lang?: string;
}

export class SAPRFCClient {
  private client: Client;

  constructor(config: RFCConfig) {
    this.client = new Client({
      ...config,
      lang: config.lang || 'EN',
    });
  }

  async connect(): Promise<void> {
    await this.client.open();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  // 读取程序源代码
  async readProgramSource(programName: string): Promise<string[]> {
    const result = await this.client.call('RPY_PROGRAM_READ', {
      PROGRAM_NAME: programName.toUpperCase(),
      WITH_LOWERCASE: 'X',
    });
    
    return (result.SOURCE_EXTENDED as any[]).map(line => line.LINE);
  }

  // 语法检查
  async checkSyntax(programName: string, source: string[]): Promise<SyntaxCheckResult> {
    const result = await this.client.call('RS_SYNTAX_CHECK', {
      PROGRAM: programName.toUpperCase(),
      SOURCE: source.map(line => ({ LINE: line })),
    });

    return {
      errors: result.ERRORS as SyntaxError[],
      warnings: result.WARNINGS as SyntaxWarning[],
    };
  }

  // 读取表数据
  async readTable(
    tableName: string,
    fields?: string[],
    where?: string,
    maxRows?: number
  ): Promise<Record<string, any>[]> {
    const params: any = {
      QUERY_TABLE: tableName.toUpperCase(),
      DELIMITER: '|',
    };

    if (fields) {
      params.FIELDS = fields.map(f => ({ FIELDNAME: f.toUpperCase() }));
    }
    if (where) {
      params.OPTIONS = [{ TEXT: where }];
    }
    if (maxRows) {
      params.ROWCOUNT = maxRows;
    }

    const result = await this.client.call('RFC_READ_TABLE', params);
    
    // 解析返回数据
    const fieldDefs = result.FIELDS as any[];
    const data = result.DATA as any[];
    
    return data.map(row => {
      const record: Record<string, any> = {};
      const values = row.WA.split('|');
      fieldDefs.forEach((field, index) => {
        record[field.FIELDNAME] = values[index]?.trim();
      });
      return record;
    });
  }

  // 获取表结构
  async getTableStructure(tableName: string): Promise<TableStructure> {
    const result = await this.client.call('DDIF_TABL_GET', {
      NAME: tableName.toUpperCase(),
      STATE: 'A',
      LANGU: 'E',
    });

    const header = result.DD02V_WA as any;
    const fields = result.DD03P_TAB as any[];

    return {
      name: header.TABNAME,
      description: header.DDTEXT,
      tableType: header.TABCLASS,
      fields: fields.map(f => ({
        name: f.FIELDNAME,
        type: f.DATATYPE,
        length: f.LENG,
        decimals: f.DECIMALS,
        description: f.DDTEXT,
        isKey: f.KEYFLAG === 'X',
      })),
    };
  }

  // 获取函数模块接口
  async getFunctionInterface(functionName: string): Promise<FunctionInterface> {
    const result = await this.client.call('RFC_GET_FUNCTION_INTERFACE', {
      FUNCNAME: functionName.toUpperCase(),
    });

    return {
      name: functionName,
      importing: result.IMPORT as Parameter[],
      exporting: result.EXPORT as Parameter[],
      changing: result.CHANGING as Parameter[],
      tables: result.TABLES as Parameter[],
      exceptions: result.EXCEPTION as Exception[],
    };
  }

  // 调用任意 RFC
  async callRFC<T>(functionName: string, params: Record<string, any>): Promise<T> {
    return this.client.call(functionName, params) as Promise<T>;
  }
}

// 类型定义
interface SyntaxCheckResult {
  errors: SyntaxError[];
  warnings: SyntaxWarning[];
}

interface SyntaxError {
  LINE: number;
  MESSAGE: string;
}

interface SyntaxWarning {
  LINE: number;
  MESSAGE: string;
}

interface TableStructure {
  name: string;
  description: string;
  tableType: string;
  fields: FieldDefinition[];
}

interface FieldDefinition {
  name: string;
  type: string;
  length: number;
  decimals: number;
  description: string;
  isKey: boolean;
}

interface FunctionInterface {
  name: string;
  importing: Parameter[];
  exporting: Parameter[];
  changing: Parameter[];
  tables: Parameter[];
  exceptions: Exception[];
}

interface Parameter {
  PARAMCLASS: string;
  PARAMETER: string;
  TABNAME: string;
  FIELDNAME: string;
  EXID: string;
  POSITION: number;
  OFFSET: number;
  INTLENGTH: number;
  DECIMALS: number;
  DEFAULT: string;
  PARAMTEXT: string;
  OPTIONAL: string;
}

interface Exception {
  EXCEPTION: string;
  EXCEPTION_TEXT: string;
}
```

---

## MCP 服务器实现方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAP ABAP MCP Server                           │
│                  (Node.js + TypeScript)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Tool Definitions                      │    │
│  │  - sap_connect: 连接SAP系统                              │    │
│  │  - sap_read_source: 读取ABAP源代码                       │    │
│  │  - sap_write_source: 修改ABAP源代码                      │    │
│  │  - sap_check_syntax: 语法检查                            │    │
│  │  - sap_activate: 激活对象                                │    │
│  │  - sap_search: 搜索开发对象                              │    │
│  │  - sap_ddic_table: 查询表结构                            │    │
│  │  - sap_read_table: 读取表数据                            │    │
│  │  - sap_debug_start: 启动调试会话                         │    │
│  │  - sap_debug_breakpoint: 设置/删除断点                   │    │
│  │  - sap_debug_step: 单步执行                              │    │
│  │  - sap_debug_variable: 查看变量值                        │    │
│  │  - sap_execute: 执行程序/函数                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Resource Definitions                   │    │
│  │  - sap://system/{sid}/programs/{name}                    │    │
│  │  - sap://system/{sid}/classes/{name}                     │    │
│  │  - sap://system/{sid}/tables/{name}                      │    │
│  │  - sap://system/{sid}/functions/{name}                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────┐      │
│  │                   Backend Adapters                     │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │      │
│  │  │ ADT Adapter │  │OData Adapter│  │ RFC Adapter │    │      │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │      │
│  └─────────┼───────────────┼───────────────┼─────────────┘      │
└────────────┼───────────────┼───────────────┼────────────────────┘
             │               │               │
             ▼               ▼               ▼
        SAP ADT API    SAP OData       SAP RFC
```

### MCP Server 代码示例

```typescript
// sap-mcp-server/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SAPADTClient } from './clients/adt-client.js';
import { SAPODataClient } from './clients/odata-client.js';
import { SAPRFCClient } from './clients/rfc-client.js';

// 服务器配置
interface ServerConfig {
  sapHost: string;
  sapPort: number;
  sapClient: string;
  sapUser: string;
  sapPassword: string;
  preferredBackend: 'adt' | 'odata' | 'rfc';
}

class SAPMCPServer {
  private server: Server;
  private adtClient?: SAPADTClient;
  private odataClient?: SAPODataClient;
  private rfcClient?: SAPRFCClient;
  private config?: ServerConfig;

  constructor() {
    this.server = new Server(
      {
        name: 'sap-abap-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'sap_connect',
          description: '连接到SAP系统',
          inputSchema: {
            type: 'object',
            properties: {
              host: { type: 'string', description: 'SAP主机地址' },
              port: { type: 'number', description: '端口号' },
              client: { type: 'string', description: 'SAP客户端' },
              user: { type: 'string', description: '用户名' },
              password: { type: 'string', description: '密码' },
              backend: { 
                type: 'string', 
                enum: ['adt', 'odata', 'rfc'],
                description: '首选后端 API' 
              },
            },
            required: ['host', 'port', 'client', 'user', 'password'],
          },
        },
        {
          name: 'sap_read_source',
          description: '读取ABAP程序、类或函数模块的源代码',
          inputSchema: {
            type: 'object',
            properties: {
              objectType: { 
                type: 'string', 
                enum: ['program', 'class', 'function', 'include'],
                description: '对象类型' 
              },
              objectName: { type: 'string', description: '对象名称' },
            },
            required: ['objectType', 'objectName'],
          },
        },
        {
          name: 'sap_check_syntax',
          description: '检查ABAP代码语法',
          inputSchema: {
            type: 'object',
            properties: {
              objectType: { type: 'string', enum: ['program', 'class', 'function'] },
              objectName: { type: 'string', description: '对象名称' },
            },
            required: ['objectType', 'objectName'],
          },
        },
        {
          name: 'sap_search',
          description: '搜索SAP开发对象',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: '搜索关键词' },
              objectType: { 
                type: 'string', 
                enum: ['program', 'class', 'function', 'table', 'all'],
                description: '对象类型过滤' 
              },
              maxResults: { type: 'number', description: '最大结果数' },
            },
            required: ['query'],
          },
        },
        {
          name: 'sap_ddic_table',
          description: '查询数据字典表结构',
          inputSchema: {
            type: 'object',
            properties: {
              tableName: { type: 'string', description: '表名' },
              includeFields: { type: 'boolean', description: '是否包含字段详情' },
            },
            required: ['tableName'],
          },
        },
        {
          name: 'sap_read_table',
          description: '读取数据库表内容',
          inputSchema: {
            type: 'object',
            properties: {
              tableName: { type: 'string', description: '表名' },
              fields: { type: 'array', items: { type: 'string' }, description: '要查询的字段' },
              where: { type: 'string', description: 'WHERE条件' },
              maxRows: { type: 'number', description: '最大行数' },
            },
            required: ['tableName'],
          },
        },
        {
          name: 'sap_debug_start',
          description: '启动ABAP调试会话',
          inputSchema: {
            type: 'object',
            properties: {
              objectType: { type: 'string', enum: ['program', 'function', 'class_method'] },
              objectName: { type: 'string', description: '对象名称' },
              methodName: { type: 'string', description: '方法名（仅类调试需要）' },
            },
            required: ['objectType', 'objectName'],
          },
        },
        {
          name: 'sap_debug_breakpoint',
          description: '设置或删除断点',
          inputSchema: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['set', 'delete', 'list'] },
              programName: { type: 'string', description: '程序名' },
              line: { type: 'number', description: '行号' },
            },
            required: ['action'],
          },
        },
        {
          name: 'sap_debug_variable',
          description: '查看调试会话中的变量值',
          inputSchema: {
            type: 'object',
            properties: {
              variableName: { type: 'string', description: '变量名' },
              depth: { type: 'number', description: '结构体展开深度' },
            },
            required: ['variableName'],
          },
        },
        {
          name: 'sap_execute',
          description: '执行ABAP程序或函数模块',
          inputSchema: {
            type: 'object',
            properties: {
              objectType: { type: 'string', enum: ['program', 'function'] },
              objectName: { type: 'string', description: '对象名称' },
              parameters: { type: 'object', description: '输入参数' },
              variant: { type: 'string', description: '变式名（仅程序）' },
            },
            required: ['objectType', 'objectName'],
          },
        },
      ],
    }));

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'sap_connect':
          return this.handleConnect(args);
        case 'sap_read_source':
          return this.handleReadSource(args);
        case 'sap_check_syntax':
          return this.handleCheckSyntax(args);
        case 'sap_search':
          return this.handleSearch(args);
        case 'sap_ddic_table':
          return this.handleDdicTable(args);
        case 'sap_read_table':
          return this.handleReadTable(args);
        case 'sap_debug_start':
          return this.handleDebugStart(args);
        case 'sap_debug_breakpoint':
          return this.handleDebugBreakpoint(args);
        case 'sap_debug_variable':
          return this.handleDebugVariable(args);
        case 'sap_execute':
          return this.handleExecute(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });

    // 列出可用资源
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'sap://programs',
          name: 'ABAP Programs',
          description: '所有ABAP程序列表',
          mimeType: 'application/json',
        },
        {
          uri: 'sap://classes',
          name: 'ABAP Classes',
          description: '所有ABAP类列表',
          mimeType: 'application/json',
        },
        {
          uri: 'sap://tables',
          name: 'Database Tables',
          description: '数据库表列表',
          mimeType: 'application/json',
        },
      ],
    }));

    // 读取资源
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      // 处理资源读取逻辑
      return this.handleReadResource(uri);
    });
  }

  // 工具处理方法
  private async handleConnect(args: any) {
    this.config = {
      sapHost: args.host,
      sapPort: args.port,
      sapClient: args.client,
      sapUser: args.user,
      sapPassword: args.password,
      preferredBackend: args.backend || 'adt',
    };

    // 初始化客户端
    this.adtClient = new SAPADTClient({
      host: args.host,
      port: args.port,
      client: args.client,
      username: args.user,
      password: args.password,
      useTLS: args.port === 443 || args.port === 44300,
    });

    // 测试连接
    try {
      await this.adtClient.fetchCSRFToken();
      return {
        content: [
          {
            type: 'text',
            text: `成功连接到 SAP 系统 ${args.host}:${args.port} 客户端 ${args.client}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `连接失败: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleReadSource(args: any) {
    if (!this.adtClient) {
      return { content: [{ type: 'text', text: '请先使用 sap_connect 连接到SAP系统' }], isError: true };
    }

    try {
      let source: string;
      
      switch (args.objectType) {
        case 'program':
          source = await this.adtClient.readProgramSource(args.objectName);
          break;
        case 'class':
          source = await this.adtClient.readClassSource(args.objectName);
          break;
        default:
          throw new Error(`不支持的对象类型: ${args.objectType}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `=== ${args.objectType.toUpperCase()}: ${args.objectName.toUpperCase()} ===\n\n${source}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `读取源代码失败: ${error.message}` }],
        isError: true,
      };
    }
  }

  private async handleCheckSyntax(args: any) {
    if (!this.adtClient) {
      return { content: [{ type: 'text', text: '请先使用 sap_connect 连接到SAP系统' }], isError: true };
    }

    try {
      const results = await this.adtClient.checkSyntax(args.objectName);
      
      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: '✅ 语法检查通过，没有发现错误或警告' }],
        };
      }

      const formatted = results
        .map(r => `${r.type === 'error' ? '❌' : '⚠️'} 行 ${r.line}: ${r.message}`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `语法检查结果:\n\n${formatted}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `语法检查失败: ${error.message}` }],
        isError: true,
      };
    }
  }

  private async handleSearch(args: any) {
    if (!this.adtClient) {
      return { content: [{ type: 'text', text: '请先使用 sap_connect 连接到SAP系统' }], isError: true };
    }

    try {
      const results = await this.adtClient.searchObjects(args.query, args.objectType);
      
      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `没有找到匹配 "${args.query}" 的对象` }],
        };
      }

      const formatted = results
        .slice(0, args.maxResults || 20)
        .map(r => `- ${r.type}: ${r.name} - ${r.description}`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `搜索结果 (共 ${results.length} 个):\n\n${formatted}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `搜索失败: ${error.message}` }],
        isError: true,
      };
    }
  }

  private async handleDdicTable(args: any) {
    if (!this.adtClient) {
      return { content: [{ type: 'text', text: '请先使用 sap_connect 连接到SAP系统' }], isError: true };
    }

    try {
      const tableInfo = await this.adtClient.getTableStructure(args.tableName);
      
      let text = `表名: ${tableInfo.name}\n描述: ${tableInfo.description}\n\n`;
      
      if (args.includeFields !== false) {
        text += '字段列表:\n';
        text += '| 字段名 | 类型 | 长度 | 描述 |\n';
        text += '|--------|------|------|------|\n';
        tableInfo.fields.forEach(f => {
          text += `| ${f.name} | ${f.type} | ${f.length} | ${f.description} |\n`;
        });
      }

      return {
        content: [{ type: 'text', text }],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `查询表结构失败: ${error.message}` }],
        isError: true,
      };
    }
  }

  private async handleReadTable(args: any) {
    // 实现表数据读取逻辑
    return { content: [{ type: 'text', text: '表数据读取功能待实现' }] };
  }

  private async handleDebugStart(args: any) {
    if (!this.adtClient) {
      return { content: [{ type: 'text', text: '请先使用 sap_connect 连接到SAP系统' }], isError: true };
    }

    try {
      const session = await this.adtClient.createDebugSession(args.objectName);
      return {
        content: [
          {
            type: 'text',
            text: `调试会话已创建\n会话ID: ${session.id}\n状态: ${session.status}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `创建调试会话失败: ${error.message}` }],
        isError: true,
      };
    }
  }

  private async handleDebugBreakpoint(args: any) {
    // 实现断点管理逻辑
    return { content: [{ type: 'text', text: '断点管理功能待实现' }] };
  }

  private async handleDebugVariable(args: any) {
    // 实现变量查看逻辑
    return { content: [{ type: 'text', text: '变量查看功能待实现' }] };
  }

  private async handleExecute(args: any) {
    // 实现程序执行逻辑
    return { content: [{ type: 'text', text: '程序执行功能待实现' }] };
  }

  private async handleReadResource(uri: string) {
    // 实现资源读取逻辑
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ message: '资源内容待实现' }),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SAP ABAP MCP Server running on stdio');
  }
}

// 启动服务器
const server = new SAPMCPServer();
server.run().catch(console.error);
```

### MCP 服务器配置

在 Cline 的 MCP 设置中添加：

```json
{
  "mcpServers": {
    "sap-abap": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/sap-mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      },
      "autoApprove": [
        "sap_read_source",
        "sap_search",
        "sap_ddic_table",
        "sap_check_syntax"
      ],
      "timeout": 120
    }
  }
}
```

---

## 方案对比与推荐

### 功能对比矩阵

| 功能 | ADT REST API | OData | RFC/BAPI |
|------|:------------:|:-----:|:--------:|
| 读取源代码 | ✅ 完整支持 | ❌ 不支持 | ✅ 支持 |
| 修改源代码 | ✅ 完整支持 | ❌ 不支持 | ⚠️ 有限 |
| 语法检查 | ✅ 完整支持 | ❌ 不支持 | ✅ 支持 |
| 激活对象 | ✅ 完整支持 | ❌ 不支持 | ⚠️ 有限 |
| 调试功能 | ✅ 完整支持 | ❌ 不支持 | ❌ 不支持 |
| 数据字典 | ✅ 完整支持 | ⚠️ 有限 | ✅ 支持 |
| 表数据查询 | ⚠️ 有限 | ✅ 完整支持 | ✅ 支持 |
| 业务数据 | ❌ 不支持 | ✅ 完整支持 | ✅ 支持 |
| 认证复杂度 | 中 | 低 | 高 |
| 网络要求 | HTTP/HTTPS | HTTP/HTTPS | RFC协议 |
| 客户端库 | axios | axios | node-rfc |

### 推荐方案

#### 🥇 首选方案：ADT REST API
**适用场景**：ABAP 代码开发和调试

**优势**：
- 功能最完整，覆盖所有开发场景
- 与 ADT/Eclipse 使用相同的后端服务
- 支持完整的调试功能
- 使用标准 HTTP 协议，易于集成

**劣势**：
- 需要 SAP 系统开启 ADT 服务
- 某些系统可能未启用所有 ADT 服务

#### 🥈 备选方案：RFC/BAPI
**适用场景**：需要调用自定义功能或 ADT 不可用时

**优势**：
- 可以调用任何 RFC 功能模块
- 功能覆盖广泛
- 支持自定义开发的 RFC

**劣势**：
- 需要安装 SAP RFC SDK
- 配置相对复杂
- 使用 RFC 协议，网络配置要求更高

#### 🥉 补充方案：OData
**适用场景**：查询业务数据、与 Fiori 应用集成

**优势**：
- 标准化的 REST 接口
- 易于使用和集成
- 适合数据查询场景

**劣势**：
- 不支持代码开发功能
- 功能有限

### 推荐组合

```
┌─────────────────────────────────────────────────────────────┐
│                  SAP ABAP MCP Server                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   主要功能（ADT API）                                         │
│   ├── 源代码读写                                             │
│   ├── 语法检查                                               │
│   ├── 代码激活                                               │
│   ├── 调试功能                                               │
│   └── 数据字典查询                                           │
│                                                              │
│   补充功能（OData）                                          │
│   ├── 业务数据查询                                           │
│   └── Fiori 应用数据                                         │
│                                                              │
│   扩展功能（RFC - 可选）                                     │
│   ├── 自定义 RFC 调用                                        │
│   └── ADT 不支持的特殊功能                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 实施路线图

### 第一阶段：基础功能（2-3周）

```
Week 1-2:
├── 搭建 MCP Server 框架
├── 实现 SAP 连接功能
├── 实现 ADT 客户端基础
│   ├── 认证和 CSRF Token
│   ├── 读取源代码
│   └── 搜索对象
└── 基础测试

Week 3:
├── 实现语法检查
├── 实现数据字典查询
├── 集成测试
└── 文档编写
```

### 第二阶段：调试功能（2-3周）

```
Week 4-5:
├── 实现调试会话管理
├── 实现断点设置
├── 实现变量查看
└── 实现单步执行

Week 6:
├── 调试功能优化
├── 错误处理完善
└── 用户体验优化
```

### 第三阶段：高级功能（2-3周）

```
Week 7-8:
├── 实现代码修改和激活
├── 实现程序执行
├── 添加 OData 支持
└── 性能优化

Week 9:
├── 添加 RFC 支持（可选）
├── 完善文档
├── 发布准备
└── 最终测试
```

### 关键里程碑

| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| M1 | Week 3 | 基础 MCP Server，支持源代码读取和搜索 |
| M2 | Week 6 | 完整调试功能 |
| M3 | Week 9 | 完整功能版本 |

---

## 附录

### A. SAP 系统要求

- SAP NetWeaver 7.40 SP08 或更高版本
- 已启用 ICF 服务：`/sap/bc/adt/*`
- 用户需要适当的开发权限（S_DEVELOP）

### B. 安全建议

1. 使用 HTTPS 加密通信
2. 使用服务账号而非个人账号
3. 限制账号权限到最小必要
4. 定期轮换密码
5. 审计 API 调用日志

### C. 参考资源

- [SAP ADT REST API 文档](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829321ffa326a)
- [SAP OData 开发指南](https://help.sap.com/docs/SAP_NETWEAVER_AS_ABAP_752/68bf513362174d54b58cddec28794093)
- [node-rfc GitHub](https://github.com/SAP/node-rfc)
- [MCP 协议规范](https://modelcontextprotocol.io/)