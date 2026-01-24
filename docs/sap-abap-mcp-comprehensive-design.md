# SAP ABAP MCP Server 综合设计方案

## 目录
1. [设计概述](#设计概述)
2. [架构设计](#架构设计)
3. [MCP 工具清单](#mcp-工具清单)
4. [详细设计](#详细设计)
5. [工作流场景](#工作流场景)
6. [实施计划](#实施计划)

---

## 设计概述

### 目标
构建一个全面的 SAP ABAP MCP Server，支持 Cline AI 进行完整的 ABAP 开发工作，包括：
- 数据字典（DDIC）对象管理
- 程序开发（Report、类、函数模块）
- CDS View 开发
- OData 服务发布
- 单元测试

### 架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SAP ABAP MCP Server                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         Tool Categories                                 │ │
│  │                                                                         │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│  │  │   DDIC       │ │  Programs    │ │  CDS/OData   │ │   Testing    │  │ │
│  │  │   Tools      │ │   Tools      │ │    Tools     │ │    Tools     │  │ │
│  │  │              │ │              │ │              │ │              │  │ │
│  │  │ • Tables     │ │ • Reports    │ │ • CDS Views  │ │ • Unit Test  │  │ │
│  │  │ • Structures │ │ • Classes    │ │ • BOPF       │ │ • Test Data  │  │ │
│  │  │ • Data Elem  │ │ • Functions  │ │ • Service    │ │ • Coverage   │  │ │
│  │  │ • Domains    │ │ • Includes   │ │ • Binding    │ │ • Mocking    │  │ │
│  │  │ • Table Types│ │ • Interfaces │ │ • Publish    │ │              │  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │ │
│  │                                                                         │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│  │  │   System     │ │   Debug      │ │  Transport   │ │   Query      │  │ │
│  │  │   Tools      │ │   Tools      │ │    Tools     │ │    Tools     │  │ │
│  │  │              │ │              │ │              │ │              │  │ │
│  │  │ • Connect    │ │ • Session    │ │ • Create TR  │ │ • Search     │  │ │
│  │  │ • Discovery  │ │ • Breakpoint │ │ • Release    │ │ • Where-Used │  │ │
│  │  │ • Packages   │ │ • Variables  │ │ • Transport  │ │ • Read Table │  │ │
│  │  │ • Users      │ │ • Step       │ │ • Compare    │ │ • Execute    │  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         Backend Layer                                   │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │ │
│  │  │  ADT REST Client │  │  OData Client   │  │   RFC Client    │        │ │
│  │  │  (Primary)       │  │  (Supplement)   │  │   (Optional)    │        │ │
│  │  └────────┬─────────┘  └────────┬────────┘  └────────┬────────┘        │ │
│  └───────────┼─────────────────────┼───────────────────┼─────────────────┘ │
└──────────────┼─────────────────────┼───────────────────┼──────────────────┘
               │                     │                   │
               ▼                     ▼                   ▼
         SAP ADT API           SAP OData            SAP RFC
```

---

## MCP 工具清单

### 1. 系统连接工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_connect` | 连接到 SAP 系统 | P0 |
| `sap_disconnect` | 断开连接 | P1 |
| `sap_discovery` | 获取系统支持的 ADT 功能 | P1 |
| `sap_get_packages` | 获取包列表 | P1 |
| `sap_create_package` | 创建开发包 | P2 |

### 2. DDIC 工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_ddic_get_table` | 获取表结构 | P0 |
| `sap_ddic_create_table` | 创建透明表 | P0 |
| `sap_ddic_get_structure` | 获取结构定义 | P0 |
| `sap_ddic_create_structure` | 创建结构 | P1 |
| `sap_ddic_get_data_element` | 获取数据元素 | P0 |
| `sap_ddic_create_data_element` | 创建数据元素 | P1 |
| `sap_ddic_get_domain` | 获取域 | P1 |
| `sap_ddic_create_domain` | 创建域 | P1 |
| `sap_ddic_get_table_type` | 获取表类型 | P1 |
| `sap_ddic_create_table_type` | 创建表类型 | P2 |
| `sap_ddic_get_search_help` | 获取搜索帮助 | P2 |
| `sap_ddic_create_search_help` | 创建搜索帮助 | P2 |

### 3. 程序开发工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_program_read` | 读取程序源代码 | P0 |
| `sap_program_create` | 创建程序 | P0 |
| `sap_program_write` | 写入程序源代码 | P0 |
| `sap_class_read` | 读取类定义和实现 | P0 |
| `sap_class_create` | 创建类 | P0 |
| `sap_class_write` | 写入类代码 | P0 |
| `sap_class_add_method` | 添加方法 | P1 |
| `sap_interface_read` | 读取接口 | P1 |
| `sap_interface_create` | 创建接口 | P1 |
| `sap_function_read` | 读取函数模块 | P0 |
| `sap_function_create` | 创建函数模块 | P0 |
| `sap_function_write` | 写入函数源代码 | P0 |
| `sap_include_read` | 读取 Include | P1 |
| `sap_include_create` | 创建 Include | P1 |

### 4. CDS 和 OData 工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_cds_read` | 读取 CDS View | P0 |
| `sap_cds_create` | 创建 CDS View | P0 |
| `sap_cds_write` | 写入 CDS 定义 | P0 |
| `sap_cds_preview` | 预览 CDS 数据 | P1 |
| `sap_cds_annotations` | 管理 CDS 注解 | P1 |
| `sap_odata_create_service` | 创建 OData 服务定义 | P1 |
| `sap_odata_create_binding` | 创建服务绑定 | P1 |
| `sap_odata_publish` | 发布 OData 服务 | P1 |
| `sap_odata_test` | 测试 OData 服务 | P1 |
| `sap_segw_project` | 管理 SEGW 项目（旧版）| P2 |

### 5. 测试工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_test_unit_run` | 运行单元测试 | P0 |
| `sap_test_unit_create` | 创建测试类 | P1 |
| `sap_test_coverage` | 获取代码覆盖率 | P1 |
| `sap_test_mock_create` | 创建测试 Mock | P2 |
| `sap_test_data_generate` | 生成测试数据 | P2 |

### 6. 调试工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_debug_session_create` | 创建调试会话 | P1 |
| `sap_debug_session_end` | 结束调试会话 | P1 |
| `sap_debug_breakpoint_set` | 设置断点 | P1 |
| `sap_debug_breakpoint_delete` | 删除断点 | P1 |
| `sap_debug_breakpoint_list` | 列出断点 | P1 |
| `sap_debug_variable_get` | 获取变量值 | P1 |
| `sap_debug_step` | 单步执行 | P1 |
| `sap_debug_continue` | 继续执行 | P1 |

### 7. 传输管理工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_transport_create` | 创建传输请求 | P0 |
| `sap_transport_release` | 释放传输请求 | P1 |
| `sap_transport_list` | 列出传输请求 | P1 |
| `sap_transport_add_object` | 添加对象到传输 | P1 |

### 8. 查询工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_search` | 搜索开发对象 | P0 |
| `sap_where_used` | 使用位置分析 | P1 |
| `sap_table_read` | 读取表数据 | P0 |
| `sap_sql_execute` | 执行 SQL 查询 | P1 |

### 9. 通用工具

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `sap_syntax_check` | 语法检查 | P0 |
| `sap_activate` | 激活对象 | P0 |
| `sap_activate_multiple` | 批量激活 | P1 |
| `sap_atc_run` | 运行 ATC 检查 | P1 |
| `sap_pretty_print` | 代码格式化 | P2 |

---

## 详细设计

### 3.1 DDIC 工具详细设计

#### sap_ddic_get_table

```typescript
{
  name: 'sap_ddic_get_table',
  description: '获取数据库表的完整结构定义，包括字段、键、外键、索引等',
  inputSchema: {
    type: 'object',
    properties: {
      tableName: { 
        type: 'string', 
        description: '表名' 
      },
      includeFields: { 
        type: 'boolean', 
        default: true,
        description: '是否包含字段详情' 
      },
      includeIndexes: { 
        type: 'boolean', 
        default: false,
        description: '是否包含索引信息' 
      },
      includeForeignKeys: { 
        type: 'boolean', 
        default: false,
        description: '是否包含外键关系' 
      },
      includeAnnotations: {
        type: 'boolean',
        default: false,
        description: '是否包含 ABAP 注解'
      }
    },
    required: ['tableName']
  }
}
```

**ADT API 映射**:
```http
GET /sap/bc/adt/ddic/tables/{tableName}
Accept: application/vnd.sap.adt.ddic.tables.v2+xml
```

#### sap_ddic_create_table

```typescript
{
  name: 'sap_ddic_create_table',
  description: '创建新的透明表',
  inputSchema: {
    type: 'object',
    properties: {
      tableName: { type: 'string', description: '表名 (Z/Y开头)' },
      description: { type: 'string', description: '表描述' },
      package: { type: 'string', description: '开发包' },
      transportRequest: { type: 'string', description: '传输请求号' },
      deliveryClass: { 
        type: 'string', 
        enum: ['A', 'C', 'L', 'G', 'E', 'S', 'W'],
        default: 'A',
        description: '交付类（A=应用表, C=自定义, L=临时）' 
      },
      tableCategory: {
        type: 'string',
        enum: ['TRANSP', 'CLUSTER', 'POOL', 'INTTAB'],
        default: 'TRANSP',
        description: '表类别'
      },
      fields: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fieldName: { type: 'string' },
            dataElement: { type: 'string', description: '数据元素（优先使用）' },
            dataType: { type: 'string', description: '直接指定类型' },
            length: { type: 'number' },
            decimals: { type: 'number' },
            isKey: { type: 'boolean', default: false },
            isNotNull: { type: 'boolean', default: false },
            description: { type: 'string' }
          },
          required: ['fieldName']
        },
        description: '字段定义列表'
      },
      tableEnhancementCategory: {
        type: 'string',
        enum: ['NOT_CLASSIFIED', 'CANNOT_BE_ENHANCED', 'CAN_BE_ENHANCED', 'CAN_BE_ENHANCED_DEEP'],
        default: 'CAN_BE_ENHANCED'
      }
    },
    required: ['tableName', 'description', 'package', 'fields']
  }
}
```

### 3.2 程序开发工具详细设计

#### sap_class_create

```typescript
{
  name: 'sap_class_create',
  description: '创建 ABAP 类',
  inputSchema: {
    type: 'object',
    properties: {
      className: { type: 'string', description: '类名 (ZCL_/YCL_开头)' },
      description: { type: 'string', description: '类描述' },
      package: { type: 'string', description: '开发包' },
      transportRequest: { type: 'string', description: '传输请求号' },
      superClass: { type: 'string', description: '父类（可选）' },
      interfaces: { 
        type: 'array', 
        items: { type: 'string' },
        description: '实现的接口列表' 
      },
      isFinal: { type: 'boolean', default: false },
      isAbstract: { type: 'boolean', default: false },
      isTestClass: { type: 'boolean', default: false },
      visibility: {
        type: 'string',
        enum: ['PUBLIC', 'PROTECTED', 'PRIVATE'],
        default: 'PUBLIC'
      },
      friendClasses: {
        type: 'array',
        items: { type: 'string' },
        description: '友元类列表'
      },
      initialMethods: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            methodName: { type: 'string' },
            visibility: { type: 'string', enum: ['PUBLIC', 'PROTECTED', 'PRIVATE'] },
            isStatic: { type: 'boolean', default: false },
            isAbstract: { type: 'boolean', default: false },
            isFinal: { type: 'boolean', default: false },
            importing: { type: 'array', items: { type: 'object' } },
            exporting: { type: 'array', items: { type: 'object' } },
            returning: { type: 'object' },
            exceptions: { type: 'array', items: { type: 'object' } },
            description: { type: 'string' }
          },
          required: ['methodName']
        },
        description: '初始方法定义'
      }
    },
    required: ['className', 'description', 'package']
  }
}
```

### 3.3 CDS 和 OData 工具详细设计

#### sap_cds_create

```typescript
{
  name: 'sap_cds_create',
  description: '创建 CDS View',
  inputSchema: {
    type: 'object',
    properties: {
      cdsName: { type: 'string', description: 'CDS View 名称' },
      sqlViewName: { type: 'string', description: 'SQL View 名称' },
      description: { type: 'string', description: '描述' },
      package: { type: 'string', description: '开发包' },
      transportRequest: { type: 'string' },
      cdsType: {
        type: 'string',
        enum: ['BASIC', 'COMPOSITE', 'CONSUMPTION', 'EXTENSION'],
        default: 'BASIC',
        description: 'CDS 类型'
      },
      dataSource: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['TABLE', 'CDS_VIEW'] },
          name: { type: 'string' },
          alias: { type: 'string' }
        },
        description: '数据源'
      },
      associations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            target: { type: 'string' },
            cardinality: { type: 'string', enum: ['[0..1]', '[1..1]', '[0..*]', '[1..*]'] },
            condition: { type: 'string' }
          }
        },
        description: '关联定义'
      },
      fields: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            source: { type: 'string' },
            alias: { type: 'string' },
            annotations: { type: 'array', items: { type: 'string' } }
          }
        },
        description: '字段定义'
      },
      annotations: {
        type: 'object',
        properties: {
          odataPublish: { type: 'boolean', default: false },
          analyticsQuery: { type: 'boolean', default: false },
          searchEnabled: { type: 'boolean', default: false }
        },
        description: 'CDS 注解'
      },
      parameters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' }
          }
        },
        description: '输入参数（参数化 View）'
      }
    },
    required: ['cdsName', 'description', 'package', 'dataSource', 'fields']
  }
}
```

#### sap_odata_publish

```typescript
{
  name: 'sap_odata_publish',
  description: '发布 OData 服务',
  inputSchema: {
    type: 'object',
    properties: {
      serviceName: { type: 'string', description: '服务名称' },
      serviceVersion: { type: 'string', default: '0001' },
      bindingType: {
        type: 'string',
        enum: ['ODATA_V2', 'ODATA_V4', 'WEB_API'],
        default: 'ODATA_V4',
        description: '绑定类型'
      },
      package: { type: 'string' },
      transportRequest: { type: 'string' },
      cdsView: { type: 'string', description: '关联的 CDS View' },
      systemAlias: { type: 'string', default: 'LOCAL' },
      icfNode: { type: 'string', description: 'ICF 节点路径' },
      authorizationGroup: { type: 'string', description: '授权组' }
    },
    required: ['serviceName', 'cdsView', 'package']
  }
}
```

### 3.4 测试工具详细设计

#### sap_test_unit_run

```typescript
{
  name: 'sap_test_unit_run',
  description: '运行 ABAP 单元测试',
  inputSchema: {
    type: 'object',
    properties: {
      objectType: {
        type: 'string',
        enum: ['CLASS', 'PROGRAM', 'FUNCTION_GROUP', 'PACKAGE'],
        description: '测试对象类型'
      },
      objectName: { type: 'string', description: '对象名称' },
      riskLevel: {
        type: 'string',
        enum: ['HARMLESS', 'DANGEROUS', 'CRITICAL'],
        default: 'HARMLESS',
        description: '风险级别'
      },
      durationCategory: {
        type: 'string',
        enum: ['SHORT', 'MEDIUM', 'LONG'],
        default: 'SHORT',
        description: '持续时间类别'
      },
      withCoverage: { 
        type: 'boolean', 
        default: false,
        description: '是否包含代码覆盖率' 
      },
      testMethods: {
        type: 'array',
        items: { type: 'string' },
        description: '指定测试方法（可选，默认运行所有）'
      }
    },
    required: ['objectType', 'objectName']
  }
}
```

#### sap_test_unit_create

```typescript
{
  name: 'sap_test_unit_create',
  description: '创建单元测试类',
  inputSchema: {
    type: 'object',
    properties: {
      targetClass: { type: 'string', description: '被测试的类' },
      testClassName: { type: 'string', description: '测试类名称' },
      riskLevel: { type: 'string', enum: ['HARMLESS', 'DANGEROUS', 'CRITICAL'] },
      durationCategory: { type: 'string', enum: ['SHORT', 'MEDIUM', 'LONG'] },
      generateFixtures: { 
        type: 'boolean', 
        default: true,
        description: '是否生成 setup/teardown 方法' 
      },
      methodsToTest: {
        type: 'array',
        items: { type: 'string' },
        description: '要测试的方法列表'
      },
      mockDependencies: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            interface: { type: 'string' },
            mockClass: { type: 'string' }
          }
        },
        description: 'Mock 依赖'
      }
    },
    required: ['targetClass', 'testClassName']
  }
}
```

---

## 工作流场景

### 场景 1：完整开发一个业务功能

**需求**: 开发一个客户信用检查功能

```
用户: 帮我开发一个客户信用检查功能：
1. 创建表存储信用限额
2. 创建类实现业务逻辑
3. 创建函数模块供外部调用
4. 创建 CDS View 和 OData 服务
5. 编写单元测试
```

**Cline 执行流程**:

```
Step 1: 创建传输请求
┌─────────────────────────────────────────────────────────┐
│ sap_transport_create                                    │
│ { "description": "Credit Check Feature", ... }          │
│ → TR: DEVK900100                                        │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 2: 创建数据字典对象
┌─────────────────────────────────────────────────────────┐
│ sap_ddic_create_domain                                  │
│ { "name": "ZCREDIT_AMOUNT", "type": "DEC", ... }        │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ sap_ddic_create_data_element                            │
│ { "name": "ZCREDIT_LIMIT", "domain": "ZCREDIT_AMOUNT" } │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ sap_ddic_create_table                                   │
│ {                                                       │
│   "tableName": "ZCUST_CREDIT",                          │
│   "fields": [                                           │
│     { "fieldName": "CUSTOMER_ID", "isKey": true },      │
│     { "fieldName": "CREDIT_LIMIT" },                    │
│     { "fieldName": "CREDIT_USED" },                     │
│     { "fieldName": "VALID_FROM" },                      │
│     { "fieldName": "VALID_TO" }                         │
│   ]                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 3: 创建接口和类
┌─────────────────────────────────────────────────────────┐
│ sap_interface_create                                    │
│ {                                                       │
│   "interfaceName": "ZIF_CREDIT_CHECK",                  │
│   "methods": [                                          │
│     { "name": "CHECK_CREDIT", ... },                    │
│     { "name": "GET_AVAILABLE_CREDIT", ... }             │
│   ]                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ sap_class_create                                        │
│ {                                                       │
│   "className": "ZCL_CREDIT_CHECK",                      │
│   "interfaces": ["ZIF_CREDIT_CHECK"],                   │
│   ...                                                   │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ sap_class_write                                         │
│ { "className": "ZCL_CREDIT_CHECK", "source": "..." }    │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 4: 创建函数模块
┌─────────────────────────────────────────────────────────┐
│ sap_function_create                                     │
│ {                                                       │
│   "functionGroup": "ZFIN_CREDIT",                       │
│   "functionName": "Z_CHECK_CUSTOMER_CREDIT",            │
│   "importing": [                                        │
│     { "parameter": "IV_CUSTOMER_ID", ... },             │
│     { "parameter": "IV_AMOUNT", ... }                   │
│   ],                                                    │
│   "exporting": [                                        │
│     { "parameter": "EV_APPROVED", ... },                │
│     { "parameter": "EV_AVAILABLE", ... }                │
│   ]                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 5: 创建 CDS View
┌─────────────────────────────────────────────────────────┐
│ sap_cds_create                                          │
│ {                                                       │
│   "cdsName": "ZCDS_CUSTOMER_CREDIT",                    │
│   "dataSource": { "type": "TABLE", "name": "ZCUST_CREDIT" },│
│   "annotations": { "odataPublish": true },              │
│   ...                                                   │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 6: 发布 OData 服务
┌─────────────────────────────────────────────────────────┐
│ sap_odata_publish                                       │
│ {                                                       │
│   "serviceName": "ZCREDIT_SRV",                         │
│   "cdsView": "ZCDS_CUSTOMER_CREDIT",                    │
│   "bindingType": "ODATA_V4"                             │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 7: 创建单元测试
┌─────────────────────────────────────────────────────────┐
│ sap_test_unit_create                                    │
│ {                                                       │
│   "targetClass": "ZCL_CREDIT_CHECK",                    │
│   "testClassName": "ZCL_CREDIT_CHECK_TEST",             │
│   "methodsToTest": ["CHECK_CREDIT", "GET_AVAILABLE_CREDIT"]│
│ }                                                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ sap_test_unit_run                                       │
│ { "objectType": "CLASS", "objectName": "ZCL_CREDIT_CHECK_TEST" }│
│ → 测试结果: 5 passed, 0 failed                          │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 8: 批量激活
┌─────────────────────────────────────────────────────────┐
│ sap_activate_multiple                                   │
│ {                                                       │
│   "objects": [                                          │
│     { "type": "TABLE", "name": "ZCUST_CREDIT" },        │
│     { "type": "CLASS", "name": "ZCL_CREDIT_CHECK" },    │
│     { "type": "FUNC", "name": "Z_CHECK_CUSTOMER_CREDIT" },│
│     { "type": "DDLS", "name": "ZCDS_CUSTOMER_CREDIT" }, │
│     { "type": "SRVB", "name": "ZCREDIT_SRV" }           │
│   ]                                                     │
│ }                                                       │
│ → 全部激活成功                                          │
└─────────────────────────────────────────────────────────┘
```

### 场景 2：读取多表结构并生成代码

```
用户: 读取 VBAK, VBAP, VBEP 的表结构，帮我生成一个销售订单查询类
```

**Cline 执行流程**:

```
Step 1: 读取表结构
┌─────────────────────────────────────────────────────────┐
│ sap_ddic_get_table({ tableName: "VBAK", includeFields: true })│
│ sap_ddic_get_table({ tableName: "VBAP", includeFields: true })│
│ sap_ddic_get_table({ tableName: "VBEP", includeFields: true })│
│                                                         │
│ → 获取完整表结构定义                                     │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 2: 分析表关系
┌─────────────────────────────────────────────────────────┐
│ Cline AI 分析:                                          │
│ - VBAK (Header) → VBAP (Item): VBELN                    │
│ - VBAP → VBEP (Schedule): VBELN, POSNR                  │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 3: 创建结构和表类型
┌─────────────────────────────────────────────────────────┐
│ sap_ddic_create_structure                               │
│ { "name": "ZS_SALES_ORDER_ITEM", "fields": [...] }      │
│                                                         │
│ sap_ddic_create_table_type                              │
│ { "name": "ZTT_SALES_ORDER_ITEMS", "lineType": "ZS_..." }│
└─────────────────────────────────────────────────────────┘
          │
          ▼
Step 4: 生成查询类
┌─────────────────────────────────────────────────────────┐
│ sap_class_create                                        │
│ {                                                       │
│   "className": "ZCL_SALES_ORDER_QUERY",                 │
│   "methods": [                                          │
│     { "name": "GET_ORDER_BY_ID", ... },                 │
│     { "name": "GET_ORDERS_BY_CUSTOMER", ... },          │
│     { "name": "GET_ORDER_ITEMS", ... },                 │
│     { "name": "GET_ORDER_SCHEDULES", ... }              │
│   ]                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 实施计划

### 阶段一：核心功能（4周）

| 周 | 任务 | 交付物 |
|----|------|--------|
| 1 | 项目搭建、ADT 客户端基础 | MCP Server 框架 |
| 2 | 系统连接、搜索、程序读写 | sap_connect, sap_search, sap_program_* |
| 3 | DDIC 表结构读取和创建 | sap_ddic_* (基础) |
| 4 | 类和函数模块创建 | sap_class_*, sap_function_* |

### 阶段二：CDS 和 OData（3周）

| 周 | 任务 | 交付物 |
|----|------|--------|
| 5 | CDS View 读取和创建 | sap_cds_* |
| 6 | OData 服务发布 | sap_odata_* |
| 7 | 集成测试、文档 | 完整 CDS/OData 功能 |

### 阶段三：测试和调试（3周）

| 周 | 任务 | 交付物 |
|----|------|--------|
| 8 | 单元测试工具 | sap_test_unit_* |
| 9 | 调试功能 | sap_debug_* |
| 10 | 代码覆盖率、ATC | sap_test_coverage, sap_atc_* |

### 阶段四：高级功能（2周）

| 周 | 任务 | 交付物 |
|----|------|--------|
| 11 | 传输管理、批量激活 | sap_transport_*, sap_activate_multiple |
| 12 | 文档完善、性能优化 | 完整 MCP Server |

### 里程碑

| 里程碑 | 时间 | 内容 |
|--------|------|------|
| **M1** | Week 4 | 基础开发功能可用 |
| **M2** | Week 7 | CDS/OData 功能可用 |
| **M3** | Week 10 | 测试和调试功能可用 |
| **M4** | Week 12 | 完整版本发布 |

---

## 技术栈

- **运行时**: Node.js 18+
- **语言**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP 客户端**: axios
- **XML 解析**: fast-xml-parser
- **测试**: Jest
- **构建**: esbuild

## 文件结构

```
sap-abap-mcp-server/
├── src/
│   ├── index.ts                 # MCP Server 入口
│   ├── server.ts                # Server 配置
│   │
│   ├── tools/                   # 工具定义
│   │   ├── ddic/                # DDIC 工具
│   │   │   ├── get-table.ts
│   │   │   ├── create-table.ts
│   │   │   └── ...
│   │   ├── programs/            # 程序工具
│   │   │   ├── class.ts
│   │   │   ├── function.ts
│   │   │   └── ...
│   │   ├── cds/                 # CDS 工具
│   │   ├── odata/               # OData 工具
│   │   ├── testing/             # 测试工具
│   │   ├── debug/               # 调试工具
│   │   └── transport/           # 传输工具
│   │
│   ├── clients/                 # API 客户端
│   │   ├── adt-client.ts        # ADT REST 客户端
│   │   ├── odata-client.ts      # OData 客户端
│   │   └── rfc-client.ts        # RFC 客户端（可选）
│   │
│   ├── utils/                   # 工具函数
│   │   ├── xml-parser.ts
│   │   ├── auth.ts
│   │   └── error-handler.ts
│   │
│   └── types/                   # 类型定义
│       ├── ddic.ts
│       ├── programs.ts
│       └── ...
│
├── package.json
├── tsconfig.json
└── README.md