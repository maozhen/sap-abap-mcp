# SAP ADT CDS 对象路由机制技术文档

## 目录
1. [研究概述](#1-研究概述)
2. [ADT 路由架构分析](#2-adt-路由架构分析)
3. [CDS 对象路由注册机制](#3-cds-对象路由注册机制)
4. [CDS 对象 CRUD 操作详解](#4-cds-对象-crud-操作详解)
5. [请求/响应格式规范](#5-请求响应格式规范)
6. [路由路径完整参考](#6-路由路径完整参考)
7. [开发集成指南](#7-开发集成指南)

---

## 1. 研究概述

### 1.1 研究目标
分析 SAP ADT (ABAP Development Tools) 处理 CDS (Core Data Services) 对象的路由机制，为创建 CDS 对象的开发维护管理工具提供技术基础。

### 1.2 核心发现
- ADT 使用基于 REST 的架构处理 CDS 对象
- 路由通过 `CL_DDIC_ADT_DDLS_RES_APP` 类注册
- CRUD 操作由 `CL_DDIC_ADT_RES_DDLS` 类处理
- 所有路径基于 `/sap/bc/adt` 基础 URL

### 1.3 关键类清单
| 类名 | 用途 |
|------|------|
| `CL_ADT_WB_RES_APP` | ADT HTTP 请求入口处理器 |
| `CL_DDIC_ADT_DDLS_RES_APP` | CDS 路由注册应用类 |
| `CL_DDIC_ADT_RES_DDLS` | CDS CRUD 资源控制器 |
| `CL_WB_ADT_PLUGIN_RESOURCE` | 工作台插件资源基类 |
| `CL_ADT_DISC_RES_APP_BASE` | 发现资源应用基类 |

---

## 2. ADT 路由架构分析

### 2.1 请求处理流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HTTP 请求                                     │
│                    /sap/bc/adt/*                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CL_ADT_WB_RES_APP                                   │
│              if_http_extension~handle_request()                      │
│                                                                      │
│  1. 获取请求代理 (get_request_proxy)                                │
│  2. 配置会话状态 (configure_session_state)                          │
│  3. 执行请求处理 (handler_proxy->handle_request)                    │
│  4. 设置缓存控制 (final_cache_control)                              │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CL_REST_HTTP_HANDLER                                │
│                                                                      │
│  继承自 CL_REST_HTTP_HANDLER                                        │
│  使用 CL_REST_ROUTER 进行路由分发                                   │
└────────────────────────┬────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐    ┌─────────┐      ┌─────────┐
   │  CDS    │    │  ABAP   │      │  其他   │
   │  资源   │    │  类资源  │      │  资源   │
   └─────────┘    └─────────┘      └─────────┘
```

### 2.2 类继承层次

```
CL_REST_HTTP_HANDLER
    │
    └── CL_ADT_RES_APP_BASE
            │  - 定义 fill_router() 抽象方法
            │  - 实现 get_static_uri_path() 返回 /sap/bc/adt
            │
            └── CL_ADT_DISC_RES_APP_BASE
                    │  - 实现 fill_router() 方法
                    │  - 实现 IF_ADT_DISCOVERY_PROVIDER 接口
                    │  - 定义 register_resources() 抽象方法
                    │
                    └── CL_DDIC_ADT_DDLS_RES_APP
                            - 注册所有 CDS 相关路由
                            - co_url_prefix = '/ddic/ddl'
```

### 2.3 路由注册机制

路由注册在 `CL_DDIC_ADT_DDLS_RES_APP` 的 `register_resources` 方法中完成：

```abap
METHOD register_resources.
  " 注册各类 CDS 资源路由
  me->register_parser_version( registry = registry ).
  me->register_repository_access( registry = registry ).
  me->register_dependency_graph( registry = registry ).
  me->register_element_info( registry = registry ).
  me->register_element_mappings( registry = registry ).
  me->register_langu_help( registry = registry ).
  me->register_versioning( registry = registry ).
  me->register_validation( registry = registry ).
  me->register_crud( registry = registry ).          " ← CRUD 操作
  me->register_formatter( registry = registry ).
  me->register_create_statements( registry = registry ).
  me->register_active_object( registry = registry ).
  me->register_related_objects( registry = registry ).
  me->register_migration( registry = registry ).
  me->register_recrsv_usage_explorer( registry = registry ).
ENDMETHOD.
```

---

## 3. CDS 对象路由注册机制

### 3.1 CRUD 路由注册详解

```abap
METHOD register_crud.
  " 1. 设置资源参数
  DATA(lo_res_param) = cl_wb_adt_resource_param=>get_instance( ).
  lo_res_param->set_context_param( 
    name  = cl_wb_adt_rest_resource=>c_s_context-global_type
    value = cl_wb_ddls_state=>co_objtype ).

  " 2. 注册可发现资源（主集合）
  DATA(main_collection) = registry->register_discoverable_resource(
    accepted_types  = VALUE #( ( 'application/vnd.sap.adt.ddlSource+xml' ) )
    url             = '/ddic/ddl/sources'
    handler_class   = 'CL_DDIC_ADT_RES_DDLS'
    description     = 'DDL Sources'
    category_scheme = 'http://www.sap.com/adt/categories/ddic/ddlsources'
    category_term   = 'ddlsources' ).

  " 3. 注册 URI 模板 - 属性
  main_collection->register_disc_res_w_template(
    relation      = 'http://www.sap.com/adt/categories/ddic/ddlsources/properties'
    template      = '/ddic/ddl/sources/{object_name}{?corrNumber,lockHandle,version,accessMode,action}'
    handler_class = 'CL_DDIC_ADT_RES_DDLS' ).

  " 4. 注册 URI 模板 - 源代码
  main_collection->register_disc_res_w_template(
    relation      = 'http://www.sap.com/adt/categories/ddic/ddlsources/source'
    template      = '/ddic/ddl/sources/{object_name}/source/main{?corrNumber,lockHandle,version}'
    handler_class = 'CL_DDIC_ADT_RES_DDLS' ).

  " 5. 注册资源路由
  registry->register_resource(
    template      = '/ddic/ddl/sources/{object_name}'
    handler_class = 'CL_DDIC_ADT_RES_DDLS' ).

  registry->register_resource(
    template      = '/ddic/ddl/sources/{object_name}/source/main'
    handler_class = 'CL_DDIC_ADT_RES_DDLS' ).
ENDMETHOD.
```

### 3.2 Discovery 注册类型

| 注册方法 | 用途 | 说明 |
|----------|------|------|
| `register_discoverable_resource` | 注册可发现资源 | 会出现在 /sap/bc/adt/discovery 响应中 |
| `register_disc_res_w_template` | 注册带模板的资源 | 用于定义 URI 参数模式 |
| `register_resource` | 注册普通资源 | 仅用于路由，不出现在 discovery 中 |

---

## 4. CDS 对象 CRUD 操作详解

### 4.1 处理类继承关系

```
CL_REST_RESOURCE
    │
    └── CL_WB_ADT_REST_RESOURCE
            │
            └── CL_WB_ADT_PLUGIN_RESOURCE
                    │  - do_get()     读取
                    │  - do_create_child()  创建
                    │  - do_update()  更新
                    │  - do_delete()  删除
                    │
                    └── CL_DDIC_ADT_RES_DDLS
                            - CDS 特定逻辑
```

### 4.2 创建操作 (POST)

**端点**: `POST /sap/bc/adt/ddic/ddl/sources`

**处理流程** (`do_create_child` 方法):

```
1. read_request_body()
   ├── 解析请求体获取 object_data
   └── 获取 package 信息

2. check_on_transport_request()
   └── 验证传输请求号

3. init_resource_data_by_objkey()
   └── 初始化资源数据

4. check_object_existence()
   └── 检查对象是否已存在

5. check_access_before_lock()
   └── 锁定前检查访问权限

6. call_access_permission_insert()
   └── 调用访问权限检查

7. do_corr_insert()
   └── 执行 CTS 校正插入

8. wb_persist->save()
   └── 保存对象数据

9. insert_into_work_area()
   └── 插入工作区

10. update_object_list()
    └── 更新对象列表

11. optionally_fill_response_body()
    └── 填充响应体
```

**请求格式**:
```http
POST /sap/bc/adt/ddic/ddl/sources HTTP/1.1
Host: <sap-system>
Content-Type: application/vnd.sap.adt.ddlSource+xml
X-sap-adt-sessiontype: stateful
X-CSRF-Token: <token>

<?xml version="1.0" encoding="UTF-8"?>
<ddlSource:ddlSource xmlns:ddlSource="http://www.sap.com/adt/ddic/ddlsource"
    ddlSource:name="ZCDS_MY_VIEW"
    ddlSource:description="My CDS View">
  <ddlSource:source>
@AbapCatalog.sqlViewName: 'ZSQLVIEW'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
define view ZCDS_MY_VIEW as select from mara {
  key matnr,
  ersda,
  ernam
}
  </ddlSource:source>
</ddlSource:ddlSource>
```

**查询参数**:
| 参数 | 必需 | 说明 |
|------|------|------|
| `corrNr` | 否* | 传输请求号 (*除非对象在 $TMP 包中) |

### 4.3 读取操作 (GET)

**端点**: 
- 属性: `GET /sap/bc/adt/ddic/ddl/sources/{object_name}`
- 源代码: `GET /sap/bc/adt/ddic/ddl/sources/{object_name}/source/main`

**处理流程** (`do_get` 方法):

```
1. negotiate_content_type()
   └── 协商内容类型

2. wb_persist->get()
   ├── 获取对象数据
   ├── 获取 ETag
   └── 获取其他存在的版本

3. calculate_server_etag()
   └── 如果 ETag 为空则计算

4. 检查 If-None-Match
   └── 如果匹配返回 304 Not Modified

5. fill_response_body()
   └── 填充响应体
```

**请求格式**:
```http
GET /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW HTTP/1.1
Host: <sap-system>
Accept: application/vnd.sap.adt.ddlSource+xml
```

**查询参数**:
| 参数 | 必需 | 说明 |
|------|------|------|
| `version` | 否 | 版本 (active/inactive) |
| `lockHandle` | 否 | 锁定句柄 |

### 4.4 更新操作 (PUT)

**端点**: `PUT /sap/bc/adt/ddic/ddl/sources/{object_name}`

**处理流程** (`do_update` 方法):

```
1. check_on_transport_request()
   └── 验证传输请求号

2. read_request_body()
   └── 解析请求体

3. 验证对象名称一致性
   └── URI 中的名称必须与请求体中的名称匹配

4. check_syntx_if_active_only_obj()
   └── 语法检查

5. do_corr_insert()
   └── CTS 校正插入

6. wb_persist->save()
   └── 保存更新

7. insert_into_work_area()
   └── 更新工作区

8. update_object_list()
   └── 更新对象列表
```

**请求格式**:
```http
PUT /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW HTTP/1.1
Host: <sap-system>
Content-Type: application/vnd.sap.adt.ddlSource+xml
If-Match: <etag>
X-CSRF-Token: <token>

<?xml version="1.0" encoding="UTF-8"?>
<ddlSource:ddlSource xmlns:ddlSource="http://www.sap.com/adt/ddic/ddlsource"
    ddlSource:name="ZCDS_MY_VIEW"
    ddlSource:description="My CDS View Updated">
  <ddlSource:source>
@AbapCatalog.sqlViewName: 'ZSQLVIEW'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
define view ZCDS_MY_VIEW as select from mara {
  key matnr,
  ersda,
  ernam,
  laeda   -- 新增字段
}
  </ddlSource:source>
</ddlSource:ddlSource>
```

**查询参数**:
| 参数 | 必需 | 说明 |
|------|------|------|
| `corrNr` | 否* | 传输请求号 |
| `lockHandle` | 是 | 锁定句柄 (从 LOCK 操作获取) |

### 4.5 删除操作 (DELETE)

**端点**: `DELETE /sap/bc/adt/ddic/ddl/sources/{object_name}`

**处理流程** (`do_delete` 方法):

```
1. check_on_transport_request()
   └── 验证传输请求号

2. check_preconditions_for_delete()
   └── 检查删除前置条件

3. do_corr_insert()
   └── CTS 校正插入

4. wb_persist->delete()
   └── 删除对象

5. delete_from_work_area()
   └── 从工作区删除

6. update_object_list()
   └── 更新对象列表
```

**请求格式**:
```http
DELETE /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?corrNr=DEVK900123 HTTP/1.1
Host: <sap-system>
X-CSRF-Token: <token>
```

### 4.6 锁定/解锁操作 (POST with action)

**锁定端点**: `POST /sap/bc/adt/ddic/ddl/sources/{object_name}?action=LOCK&accessMode=MODIFY`

**解锁端点**: `POST /sap/bc/adt/ddic/ddl/sources/{object_name}?action=UNLOCK&lockHandle={handle}`

**请求格式 (锁定)**:
```http
POST /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?action=LOCK&accessMode=MODIFY HTTP/1.1
Host: <sap-system>
Accept: application/vnd.sap.as+xml
X-CSRF-Token: <token>
```

**响应格式 (锁定)**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
    <DATA>
      <LOCK_HANDLE>2023-01-15T10:30:45Z:MYUSER</LOCK_HANDLE>
    </DATA>
  </asx:values>
</asx:abap>
```

---

## 5. 请求/响应格式规范

### 5.1 Content-Type 定义

| 用途 | Content-Type |
|------|--------------|
| CDS 源代码 (XML) | `application/vnd.sap.adt.ddlSource+xml` |
| 对象引用 | `application/vnd.sap.adt.ddl.objectReferences.v2+xml` |
| 表实体定义 | `application/vnd.sap.adt.cds.tableEntityDefinition+xml` |
| 纯文本 | `text/plain` |
| HTML | `text/html` |
| 迁移对象 | `application/vnd.sap.adt.ddls.migration.objects+xml` |

### 5.2 常用 HTTP Headers

| Header | 用途 |
|--------|------|
| `X-CSRF-Token` | CSRF 保护令牌 |
| `X-sap-adt-sessiontype` | 会话类型 (stateful/stateless) |
| `If-Match` | 乐观锁定 ETag |
| `If-None-Match` | 条件 GET 请求 |
| `Accept` | 期望的响应格式 |
| `Content-Type` | 请求体格式 |

### 5.3 查询参数参考

| 参数名 | 说明 | 示例值 |
|--------|------|--------|
| `corrNr` / `corrNumber` | 传输请求号 | `DEVK900123` |
| `lockHandle` | 锁定句柄 | `2023-01-15T10:30:45Z:USER` |
| `version` | 版本 | `active`, `inactive` |
| `accessMode` | 访问模式 | `MODIFY`, `INSERT`, `DELETE` |
| `action` | POST 动作 | `LOCK`, `UNLOCK`, `CHECK`, `ACTIVATE` |

---

## 6. 路由路径完整参考

### 6.1 CDS 核心资源路由

| HTTP 方法 | 路径 | 说明 |
|-----------|------|------|
| GET | `/sap/bc/adt/ddic/ddl/sources` | 获取 CDS 源列表 |
| POST | `/sap/bc/adt/ddic/ddl/sources` | 创建 CDS 源 |
| GET | `/sap/bc/adt/ddic/ddl/sources/{name}` | 获取 CDS 属性 |
| PUT | `/sap/bc/adt/ddic/ddl/sources/{name}` | 更新 CDS |
| DELETE | `/sap/bc/adt/ddic/ddl/sources/{name}` | 删除 CDS |
| POST | `/sap/bc/adt/ddic/ddl/sources/{name}?action=LOCK` | 锁定 CDS |
| POST | `/sap/bc/adt/ddic/ddl/sources/{name}?action=UNLOCK` | 解锁 CDS |
| GET | `/sap/bc/adt/ddic/ddl/sources/{name}/source/main` | 获取 CDS 源代码 |
| PUT | `/sap/bc/adt/ddic/ddl/sources/{name}/source/main` | 更新 CDS 源代码 |

### 6.2 CDS 辅助资源路由

| 路径 | 处理类 | 说明 |
|------|--------|------|
| `/sap/bc/adt/ddic/ddl/validation` | CL_DDIC_ADT_RES_DDLS_VAL_CRT | 创建验证 |
| `/sap/bc/adt/ddic/ddl/parser` | CL_DDIC_ADT_RES_DDLPARSERVERSI | 解析器版本信息 |
| `/sap/bc/adt/ddic/ddl/ddicrepositoryaccess` | CL_DDIC_ADT_RES_DDL_REP_ACCESS | 仓库访问/代码补全 |
| `/sap/bc/adt/ddic/ddl/elementinfo` | CL_DDIC_ADT_RES_DDL_ELEMINFO | 元素信息 (F2) |
| `/sap/bc/adt/ddic/ddl/elementinfos` | CL_DADT_RES_MASS_ELEM_INFO | 批量元素信息 |
| `/sap/bc/adt/ddic/ddl/elementmappings` | CL_DDIC_ADT_RES_DDL_ELEM_MAP | 元素映射 |
| `/sap/bc/adt/ddic/ddl/dependencies/graphdata` | CL_DDIC_ADT_RES_DDL_DPANALYZER | 依赖关系图 |
| `/sap/bc/adt/ddic/ddl/activeobject` | CL_DDIC_ADT_RES_DDL_ACTIVE_OBJ | 活动对象视图 |
| `/sap/bc/adt/ddic/ddl/createstatements` | CL_DDIC_ADT_RES_DDL_CRT_STMNTS | SQL 创建语句 |
| `/sap/bc/adt/ddic/ddl/formatter/identifiers` | CL_DDIC_ADT_IDENT_FORMATTER | 标识符格式化 |
| `/sap/bc/adt/ddic/ddl/formatter/configurations` | CL_DDIC_ADT_RES_DDLS_PP_CONF | 美化配置 |
| `/sap/bc/adt/ddic/ddl/relatedObjects` | CL_DDLS_RES_RELATED_DATA_STOB | 相关对象 |
| `/sap/bc/adt/docu/ddl/langu` | CL_DDIC_ADT_DOCU_DDL_LANGU | DDL 语言帮助 (F1) |

### 6.3 CDS 版本控制路由

| 路径 | 说明 |
|------|------|
| `/sap/bc/adt/ddic/ddl/sources/{name}/versions` | 版本列表 |
| `/sap/bc/adt/ddic/ddl/sources/{name}/versions/{timestamp}/{versionnumber}/content` | 历史版本内容 |

### 6.4 CDS 迁移工具路由

| 路径 | 处理类 | 说明 |
|------|--------|------|
| `/sap/bc/adt/ddic/ddl/migration/validation` | CL_DDLS_RES_MIGR_VALIDATION | 迁移验证 |
| `/sap/bc/adt/ddic/ddl/migration/bgruns` | CL_DDLS_RES_MIGR_RUN | 后台迁移运行 |
| `/sap/bc/adt/ddic/ddl/migration/logs` | CL_DDLS_RES_MIGR_LOGS | 迁移日志 |

---

## 7. 开发集成指南

### 7.1 获取 CSRF Token

```http
GET /sap/bc/adt/discovery HTTP/1.1
Host: <sap-system>
X-CSRF-Token: fetch
```

从响应头 `X-CSRF-Token` 获取令牌。

### 7.2 完整的 CDS 创建流程

```
步骤 1: 获取 CSRF Token
        GET /sap/bc/adt/discovery
        X-CSRF-Token: fetch

步骤 2: 验证对象名称
        GET /sap/bc/adt/ddic/ddl/validation?objname=ZCDS_MY_VIEW&package=$TMP

步骤 3: 创建 CDS 对象
        POST /sap/bc/adt/ddic/ddl/sources
        Content-Type: application/vnd.sap.adt.ddlSource+xml
        X-CSRF-Token: <token>

        <ddlSource body>

步骤 4: 激活 CDS 对象
        POST /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?action=ACTIVATE
        X-CSRF-Token: <token>
```

### 7.3 完整的 CDS 更新流程

```
步骤 1: 获取 CSRF Token

步骤 2: 锁定对象
        POST /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?action=LOCK&accessMode=MODIFY
        → 获取 lockHandle

步骤 3: 获取当前内容和 ETag
        GET /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW
        → 获取 ETag

步骤 4: 更新对象
        PUT /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?lockHandle=<handle>&corrNr=<tr>
        If-Match: <etag>
        Content-Type: application/vnd.sap.adt.ddlSource+xml

步骤 5: 激活对象
        POST /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?action=ACTIVATE

步骤 6: 解锁对象
        POST /sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW?action=UNLOCK&lockHandle=<handle>
```

### 7.4 错误处理

常见 HTTP 状态码：

| 状态码 | 含义 | 处理建议 |
|--------|------|----------|
| 200 | 成功 | - |
| 201 | 创建成功 | 检查 Location 头获取新资源 URI |
| 304 | 未修改 | 使用缓存数据 |
| 400 | 请求错误 | 检查请求格式和参数 |
| 401 | 未授权 | 检查认证信息 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 未找到 | 检查对象名称 |
| 409 | 冲突 | 对象已存在或被锁定 |
| 412 | 前置条件失败 | ETag 不匹配，重新获取 |
| 500 | 服务器错误 | 查看错误详情 |

### 7.5 调试技巧

**设置断点的关键位置**:

1. **入口点**: `CL_ADT_WB_RES_APP=>if_http_extension~handle_request`
2. **路由分发**: `CL_REST_ROUTER=>route`
3. **CDS CRUD**: 
   - `CL_DDIC_ADT_RES_DDLS=>do_get`
   - `CL_WB_ADT_PLUGIN_RESOURCE=>do_create_child`
   - `CL_WB_ADT_PLUGIN_RESOURCE=>do_update`
   - `CL_WB_ADT_PLUGIN_RESOURCE=>do_delete`
4. **持久化**: `CL_DDIC_WB_DDLS_PERSIST=>save`

### 7.6 配置表参考

| 表名 | 用途 |
|------|------|
| `SADT_SRVC_GRP_U` | ADT 服务组 URI 路径配置 |
| `SADT_SRL_DATA` | ADT 序列化数据配置 |
| `TADIR` | 对象目录 |
| `DDDDLSRC` | DDL 源代码 |
| `DDDDLSRCT` | DDL 源代码文本 |

---

## 附录 A: 接口常量参考

### IF_DDIC_ADT_DDLS_CONST_RES_APP 常量

```abap
" 处理类名称
co_class_name_res_rep_access   = 'CL_DDIC_ADT_RES_DDL_REP_ACCESS'
co_class_name_res_crud         = 'CL_DDIC_ADT_RES_DDLS'
co_class_name_res_crt_valid    = 'CL_DDIC_ADT_RES_DDLS_VAL_CRT'
co_class_name_res_ddl_lang_doc = 'CL_DDIC_ADT_DOCU_DDL_LANGU'
co_class_name_res_dep_analyzer = 'CL_DDIC_ADT_RES_DDL_DPANALYZER'
co_class_name_res_ddl_elem_inf = 'CL_DDIC_ADT_RES_DDL_ELEMINFO'
co_class_name_res_ddl_act_obj  = 'CL_DDIC_ADT_RES_DDL_ACTIVE_OBJ'
co_class_name_res_pp_conf      = 'CL_DDIC_ADT_RES_DDLS_PP_CONF'

" Content-Type
co_content_type_ddl_source     = 'application/vnd.sap.adt.ddlSource+xml'
co_content_type_tab_entity_def = 'application/vnd.sap.adt.cds.tableEntityDefinition+xml'
```

### CL_DDIC_ADT_DDLS_RES_APP 常量

```abap
" URL 前缀
co_url_prefix                = '/ddic/ddl'
co_url_formatter_identifier  = '/formatter/identifiers'
co_url_formattr_configurations = '/formatter/configurations'
co_url_dependency_analyzer   = '/dependencies/graphdata'
co_url_related_objects       = '/relatedObjects'
co_url_docu_langu            = '/docu/ddl/langu'

" URI 模式
co_uri_pattern_sources       = 'sources'

" 查询参数
co_param_obj_name            = 'objname'
co_rep_access_param_column   = 'column'
co_rep_access_param_datasource = 'datasource'
```

---

## 附录 B: 示例代码

### B.1 使用 ABAP 调用 ADT CDS 服务

```abap
" 创建 HTTP 客户端
DATA(lo_client) = cl_adt_rest_client_factory=>create_client(
  destination = 'NONE' ).

" 获取 CDS 源代码
DATA(lv_response) = lo_client->get(
  uri = '/sap/bc/adt/ddic/ddl/sources/ZCDS_MY_VIEW/source/main' ).

" 解析响应
DATA(lv_source) = lv_response->get_body_as_string( ).
```

### B.2 使用 Python 调用 ADT CDS 服务

```python
import requests
from requests.auth import HTTPBasicAuth

base_url = "https://sap-system:port/sap/bc/adt"
auth = HTTPBasicAuth('user', 'password')

# 获取 CSRF Token
headers = {'X-CSRF-Token': 'fetch'}
response = requests.get(f"{base_url}/discovery", auth=auth, headers=headers)
csrf_token = response.headers['X-CSRF-Token']

# 读取 CDS 源代码
headers = {
    'Accept': 'application/vnd.sap.adt.ddlSource+xml',
    'X-CSRF-Token': csrf_token
}
response = requests.get(
    f"{base_url}/ddic/ddl/sources/ZCDS_MY_VIEW/source/main",
    auth=auth,
    headers=headers
)
print(response.text)
```

---

*文档版本: 1.0*
*生成日期: 2026-01-26*
*基于 SAP ADT 源代码分析*