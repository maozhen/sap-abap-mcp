# SAP ADT ABAP 开发对象路由机制技术文档

## 目录
1. [研究概述](#1-研究概述)
2. [ADT 路由架构总览](#2-adt-路由架构总览)
3. [Class/Interface 路由详解](#3-classinterface-路由详解)
4. [Function Group/Module 路由详解](#4-function-groupmodule-路由详解)
5. [Program/Include 路由详解](#5-programinclude-路由详解)
6. [CDS View 路由详解](#6-cds-view-路由详解)
7. [DDIC View 路由详解](#7-ddic-view-路由详解)
8. [Type Group 路由详解](#8-type-group-路由详解)
9. [Table/Domain/Data Element 路由详解](#9-tabledomaindata-element-路由详解)
10. [Repository Information System 路由](#10-repository-information-system-路由)
11. [Service Definition/Binding 路由详解](#11-service-definitionbinding-路由详解)
12. [完整路由路径参考](#12-完整路由路径参考)
13. [开发集成指南](#13-开发集成指南)

---

## 1. 研究概述

### 1.1 研究目标
全面分析 SAP ADT (ABAP Development Tools) 处理各类 ABAP 开发对象的路由机制，包括：
- Class / Interface
- Function Group / Function Module
- Program / Include
- CDS View
- DDIC View
- Type Group
- Table / Domain / Data Element

### 1.2 核心发现

| 对象类型 | 路由注册类 | URL 前缀 |
|----------|------------|----------|
| Class/Interface | CL_OO_ADT_RES_APP | `/oo/classes`, `/oo/interfaces` |
| Function Group/Module | CL_FB_ADT_RES_APP | `/functions/groups` |
| Program/Include | CL_SEDI_ADT_RES_APP_PROGRAMS | `/programs/programs`, `/programs/includes` |
| CDS View | CL_DDIC_ADT_DDLS_RES_APP | `/ddic/ddl/sources` |
| DDIC View | CL_DDIC_ADT_XVIEW_RES_APP | `/ddic/views` |
| Type Group | CL_SDDIC_ADT_RES_APP_TYPGROUPS | `/ddic/typegroups` |
| Table/Domain/Data Element | CL_WB_ADT_PLUGIN_RESOURCE | 通用工作台框架 |
| Repository Search | CL_RIS_ADT_RES_APP | `/repository/informationsystem` |
| Service Definition | CL_SRVD_ADT_RES_APP | `/ddic/srvd` |
| Service Binding | CL_SRVB_WB_ACCESS | `/businessservices/bindings` |

### 1.3 路由注册架构

所有 ADT 路由注册类都继承自 `CL_ADT_DISC_RES_APP_BASE`，实现统一的路由注册机制：

```
CL_REST_HTTP_HANDLER
    │
    └── CL_ADT_RES_APP_BASE
            │  - get_static_uri_path() 返回 /sap/bc/adt
            │
            └── CL_ADT_DISC_RES_APP_BASE
                    │  - fill_router() 填充路由
                    │  - register_resources() 注册资源 (抽象方法)
                    │
                    ├── CL_OO_ADT_RES_APP          (Class/Interface)
                    ├── CL_FB_ADT_RES_APP          (Function)
                    ├── CL_SEDI_ADT_RES_APP_PROGRAMS (Program)
                    ├── CL_DDIC_ADT_DDLS_RES_APP   (CDS)
                    ├── CL_DDIC_ADT_XVIEW_RES_APP  (View)
                    ├── CL_SDDIC_ADT_RES_APP_TYPGROUPS (Type Group)
                    ├── CL_RIS_ADT_RES_APP         (Repository Info)
                    └── CL_SRVD_ADT_RES_APP        (Service Definition)
```

---

## 2. ADT 路由架构总览

### 2.1 HTTP 请求处理流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HTTP 请求                                        │
│                 /sap/bc/adt/*                                        │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CL_ADT_WB_RES_APP                                   │
│              if_http_extension~handle_request()                      │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CL_REST_ROUTER                                      │
│               路由分发到对应的资源处理器                              │
└────────────────────────┬────────────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    ▼                    ▼                    ▼
┌─────────┐      ┌─────────────┐      ┌─────────────┐
│  /oo/*  │      │ /functions/*│      │ /programs/* │
│  Class  │      │  Function   │      │   Program   │
└─────────┘      └─────────────┘      └─────────────┘
```

### 2.2 基础 URL 结构

```
https://<sap-system>:<port>/sap/bc/adt/<object-type>/<object-name>
```

### 2.3 通用 HTTP Headers

| Header | 用途 | 示例值 |
|--------|------|--------|
| `X-CSRF-Token` | CSRF 保护令牌 | `fetch` / `<token>` |
| `X-sap-adt-sessiontype` | 会话类型 | `stateful`, `stateless` |
| `If-Match` | 乐观锁定 ETag | `"202301151030"` |
| `Accept` | 期望响应格式 | `application/vnd.sap.adt.*+xml` |
| `Content-Type` | 请求体格式 | `application/vnd.sap.adt.*+xml` |

### 2.4 通用查询参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `corrNr` / `corrNumber` | 传输请求号 | `DEVK900123` |
| `lockHandle` | 锁定句柄 | `2023-01-15T10:30:45Z:USER` |
| `version` | 版本 | `active`, `inactive` |
| `accessMode` | 访问模式 | `MODIFY`, `INSERT` |
| `action` | POST 动作 | `LOCK`, `UNLOCK`, `ACTIVATE` |

---

## 3. Class/Interface 路由详解

### 3.1 路由注册类
**类名**: `CL_OO_ADT_RES_APP`
**包**: `SEO_ADT`

### 3.2 URL 前缀
- Class: `/oo/classes`
- Interface: `/oo/interfaces`

### 3.3 路由列表

#### Class 相关路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/oo/classes` | CL_OO_ADT_RES_CLASS | 类集合 |
| GET/PUT/DELETE | `/oo/classes/{classname}` | CL_OO_ADT_RES_CLASS | 类操作 |
| GET/PUT | `/oo/classes/{classname}/source/{includename}` | CL_OO_ADT_RES_CLIF_SOURCE | 类源代码 |
| GET | `/oo/classes/{classname}/includes/{includename}` | CL_OO_ADT_RES_CLIF_INCLUDE | 类 Include |
| POST | `/oo/classes/{classname}?action=LOCK` | - | 锁定类 |
| POST | `/oo/classes/{classname}?action=UNLOCK` | - | 解锁类 |
| GET | `/oo/classes/{classname}/versions` | CL_SRC_ADT_RES_VERSIONS | 版本列表 |
| GET | `/oo/classes/{classname}/source/{includename}/versions/{timestamp}/{versionnumber}/content` | - | 历史版本 |

#### Interface 相关路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/oo/interfaces` | CL_OO_ADT_RES_INTERFACE | 接口集合 |
| GET/PUT/DELETE | `/oo/interfaces/{interfacename}` | CL_OO_ADT_RES_INTERFACE | 接口操作 |
| GET/PUT | `/oo/interfaces/{interfacename}/source/{includename}` | CL_OO_ADT_RES_CLIF_SOURCE | 接口源代码 |

#### 辅助路由

| HTTP 方法 | 路径模板 | 说明 |
|-----------|----------|------|
| POST | `/oo/validation/objectname` | 名称验证 |
| POST | `/oo/classrun/{classname}` | 执行类 (IF_OO_ADT_CLASSRUN) |
| GET | `/oo/classes/{classname}/relations` | 类关系 |
| GET | `/oo/classes/{classname}/objectstructure` | 类结构 |
| GET | `/oo/codecompletion/options` | 代码补全选项 |

### 3.4 Include 类型

Class 的 Include 参数 (`{includename}`) 可取以下值：

| Include Name | 说明 |
|--------------|------|
| `main` | 主要源代码 (定义 + 实现) |
| `definitions` | 定义部分 (PUBLIC/PROTECTED/PRIVATE SECTION) |
| `implementations` | 实现部分 |
| `testclasses` | 测试类 |
| `macros` | 宏定义 |
| `locals_def` | 本地定义 |
| `locals_imp` | 本地实现 |

### 3.5 Content-Type

| 用途 | Content-Type |
|------|--------------|
| Class (XML) | `application/vnd.sap.adt.oo.classes.v4+xml` |
| Interface (XML) | `application/vnd.sap.adt.oo.interfaces.v4+xml` |
| Source Code | `text/plain` |

### 3.6 示例请求

**获取类源代码**:
```http
GET /sap/bc/adt/oo/classes/zcl_my_class/source/main HTTP/1.1
Host: sap-system:port
Accept: text/plain
```

**创建新类**:
```http
POST /sap/bc/adt/oo/classes HTTP/1.1
Host: sap-system:port
Content-Type: application/vnd.sap.adt.oo.classes.v4+xml
X-CSRF-Token: <token>

<?xml version="1.0" encoding="UTF-8"?>
<class:abapClass xmlns:class="http://www.sap.com/adt/oo/classes"
    class:name="ZCL_MY_CLASS"
    class:description="My Test Class"
    class:language="EN"
    class:abapLanguageVersion="standard">
  <class:superClass/>
</class:abapClass>
```

---

## 4. Function Group/Module 路由详解

### 4.1 路由注册类
**类名**: `CL_FB_ADT_RES_APP`
**包**: `SFUNC_ADT`

### 4.2 URL 前缀
`/functions/groups`

### 4.3 路由列表

#### Function Group 路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/functions/groups` | CL_FB_ADT_RES_FUGR | 函数组集合 |
| GET/PUT/DELETE | `/functions/groups/{groupname}` | CL_FB_ADT_RES_FUGR | 函数组操作 |
| GET/PUT | `/functions/groups/{groupname}/source/{includename}` | CL_FB_ADT_RES_FUGR_SOURCE | 函数组源代码 |
| GET | `/functions/groups/{groupname}/includes/{fugrincludename}` | CL_FB_ADT_RES_FUGR_INCLUDE | 函数组 Include |

#### Function Module 路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/functions/groups/{groupname}/fmodules` | CL_FB_ADT_RES_FUNC | 函数模块集合 |
| GET/PUT/DELETE | `/functions/groups/{groupname}/fmodules/{fmodulename}` | CL_FB_ADT_RES_FUNC | 函数模块操作 |
| GET/PUT | `/functions/groups/{groupname}/fmodules/{fmodulename}/source/{includename}` | CL_FB_ADT_RES_FUNC_SOURCE | 函数模块源代码 |

#### 辅助路由

| HTTP 方法 | 路径模板 | 说明 |
|-----------|----------|------|
| POST | `/functions/validation` | 名称验证 |
| GET | `/functions/groups/{groupname}/fmodules/{fmodulename}/versions` | 版本列表 |

### 4.4 Include 类型

Function Group 的 Include 参数:

| Include Name | 说明 |
|--------------|------|
| `main` | TOP Include (全局数据) |
| `definitions` | FUGR 定义 |

Function Module 的 Include 参数:

| Include Name | 说明 |
|--------------|------|
| `main` | 函数模块源代码 |

### 4.5 Content-Type

| 用途 | Content-Type |
|------|--------------|
| Function Group | `application/vnd.sap.adt.functions.groups.v3+xml` |
| Function Module | `application/vnd.sap.adt.functions.fmodules.v3+xml` |
| Source Code | `text/plain` |

### 4.6 示例请求

**获取函数模块源代码**:
```http
GET /sap/bc/adt/functions/groups/zmy_fugr/fmodules/z_my_function/source/main HTTP/1.1
Host: sap-system:port
Accept: text/plain
```

**创建函数模块**:
```http
POST /sap/bc/adt/functions/groups/zmy_fugr/fmodules HTTP/1.1
Host: sap-system:port
Content-Type: application/vnd.sap.adt.functions.fmodules.v3+xml
X-CSRF-Token: <token>

<?xml version="1.0" encoding="UTF-8"?>
<func:functionModule xmlns:func="http://www.sap.com/adt/functions/fmodules"
    func:name="Z_MY_FUNCTION"
    func:description="My Function Module">
</func:functionModule>
```

---

## 5. Program/Include 路由详解

### 5.1 路由注册类
**类名**: `CL_SEDI_ADT_RES_APP_PROGRAMS`
**包**: `SEDI_ADT`

### 5.2 URL 前缀
- Program: `/programs/programs`
- Include: `/programs/includes`

### 5.3 路由列表

#### Program 路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/programs/programs` | CL_SEDI_ADT_RES_PROGRAM | 程序集合 |
| GET/PUT/DELETE | `/programs/programs/{programname}` | CL_SEDI_ADT_RES_PROGRAM | 程序操作 |
| GET/PUT | `/programs/programs/{programname}/source/{sourcename}` | CL_SEDI_ADT_RES_SOURCE | 程序源代码 |
| GET | `/programs/programs/{programname}/versions` | CL_SRC_ADT_RES_VERSIONS | 版本列表 |
| POST | `/programs/programrun/{programname}` | CL_SEDI_ADT_RES_PROGRAM_RUN | 执行程序 |

#### Include 路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/programs/includes` | CL_SEDI_ADT_RES_INCLUDE | Include 集合 |
| GET/PUT/DELETE | `/programs/includes/{includename}` | CL_SEDI_ADT_RES_INCLUDE | Include 操作 |
| GET/PUT | `/programs/includes/{includename}/source/{sourcename}` | CL_SEDI_ADT_RES_SOURCE | Include 源代码 |
| GET | `/programs/includes/{includename}/mainprograms` | CL_SEDI_ADT_RES_MAIN_PROGRAMS | 主程序列表 |

#### 辅助路由

| HTTP 方法 | 路径模板 | 说明 |
|-----------|----------|------|
| POST | `/programs/validation` | 程序名称验证 |
| POST | `/includes/validation` | Include 名称验证 |

### 5.4 Source Name 参数

`{sourcename}` 参数通常为 `main`，表示主源代码。

### 5.5 Content-Type

| 用途 | Content-Type |
|------|--------------|
| Program | `application/vnd.sap.adt.programs.programs.v2+xml` |
| Include | `application/vnd.sap.adt.programs.includes.v2+xml` |
| Source Code | `text/plain` |

### 5.6 示例请求

**获取程序源代码**:
```http
GET /sap/bc/adt/programs/programs/zmy_report/source/main HTTP/1.1
Host: sap-system:port
Accept: text/plain
```

**创建程序**:
```http
POST /sap/bc/adt/programs/programs HTTP/1.1
Host: sap-system:port
Content-Type: application/vnd.sap.adt.programs.programs.v2+xml
X-CSRF-Token: <token>

<?xml version="1.0" encoding="UTF-8"?>
<program:abapProgram xmlns:program="http://www.sap.com/adt/programs/programs"
    program:name="ZMY_REPORT"
    program:description="My Report Program"
    program:language="EN"
    program:programType="executableProgram">
</program:abapProgram>
```

---

## 6. CDS View 路由详解

### 6.1 路由注册类
**类名**: `CL_DDIC_ADT_DDLS_RES_APP`
**包**: `SDDIC_ADT_DDLS_CORE`

### 6.2 URL 前缀
`/ddic/ddl`

### 6.3 路由列表

#### CDS Source 核心路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/ddic/ddl/sources` | CL_DDIC_ADT_RES_DDLS | CDS 源集合 |
| GET/PUT/DELETE | `/ddic/ddl/sources/{object_name}` | CL_DDIC_ADT_RES_DDLS | CDS 操作 |
| GET/PUT | `/ddic/ddl/sources/{object_name}/source/main` | CL_DDIC_ADT_RES_DDLS | CDS 源代码 |
| POST | `/ddic/ddl/sources/{object_name}?action=LOCK` | - | 锁定 CDS |
| POST | `/ddic/ddl/sources/{object_name}?action=UNLOCK` | - | 解锁 CDS |
| POST | `/ddic/ddl/sources/{object_name}?action=ACTIVATE` | - | 激活 CDS |

#### CDS 辅助路由

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| POST | `/ddic/ddl/validation` | CL_DDIC_ADT_RES_DDLS_VAL_CRT | 名称验证 |
| GET | `/ddic/ddl/parser` | CL_DDIC_ADT_RES_DDLPARSERVERSI | 解析器版本 |
| POST | `/ddic/ddl/ddicrepositoryaccess` | CL_DDIC_ADT_RES_DDL_REP_ACCESS | 代码补全 |
| POST | `/ddic/ddl/elementinfo` | CL_DDIC_ADT_RES_DDL_ELEMINFO | 元素信息 (F2) |
| GET | `/ddic/ddl/dependencies/graphdata` | CL_DDIC_ADT_RES_DDL_DPANALYZER | 依赖图 |
| GET | `/ddic/ddl/activeobject` | CL_DDIC_ADT_RES_DDL_ACTIVE_OBJ | 活动对象视图 |
| GET | `/ddic/ddl/relatedObjects` | CL_DDLS_RES_RELATED_DATA_STOB | 相关对象 |

#### 版本控制路由

| HTTP 方法 | 路径模板 | 说明 |
|-----------|----------|------|
| GET | `/ddic/ddl/sources/{object_name}/versions` | 版本列表 |
| GET | `/ddic/ddl/sources/{object_name}/versions/{timestamp}/{versionnumber}/content` | 历史版本 |

### 6.4 Content-Type

| 用途 | Content-Type |
|------|--------------|
| CDS Source (XML) | `application/vnd.sap.adt.ddlSource+xml` |
| Object References | `application/vnd.sap.adt.ddl.objectReferences.v2+xml` |

### 6.5 示例请求

**获取 CDS 源代码**:
```http
GET /sap/bc/adt/ddic/ddl/sources/zcds_my_view/source/main HTTP/1.1
Host: sap-system:port
Accept: text/plain
```

**创建 CDS View**:
```http
POST /sap/bc/adt/ddic/ddl/sources HTTP/1.1
Host: sap-system:port
Content-Type: application/vnd.sap.adt.ddlSource+xml
X-CSRF-Token: <token>

<?xml version="1.0" encoding="UTF-8"?>
<ddlSource:ddlSource xmlns:ddlSource="http://www.sap.com/adt/ddic/ddlsource"
    ddlSource:name="ZCDS_MY_VIEW"
    ddlSource:description="My CDS View">
  <ddlSource:source>
@AbapCatalog.sqlViewName: 'ZSQLVIEW'
define view ZCDS_MY_VIEW as select from mara {
  key matnr,
  ersda
}
  </ddlSource:source>
</ddlSource:ddlSource>
```

---

## 7. DDIC View 路由详解

### 7.1 路由注册类
**类名**: `CL_DDIC_ADT_XVIEW_RES_APP`
**包**: `SDDIC_ADT_VIEW`

### 7.2 URL 前缀
`/ddic/views`

### 7.3 路由列表

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/ddic/views` | CL_DDIC_ADT_RES_XVIEW | View 集合 |
| GET/PUT/DELETE | `/ddic/views/{object_name}` | CL_DDIC_ADT_RES_XVIEW | View 操作 |
| POST | `/ddic/views/$validation` | CL_DDIC_ADT_RES_VIEW_VALIDATIN | View 名称验证 |

### 7.4 Content-Type

| 用途 | Content-Type |
|------|--------------|
| View | `application/vnd.sap.adt.ddic.views+xml` |

---

## 8. Type Group 路由详解

### 8.1 路由注册类
**类名**: `CL_SDDIC_ADT_RES_APP_TYPGROUPS`
**包**: `SDDIC_ADT_TYPE_GROUP`

### 8.2 URL 前缀
`/ddic/typegroups`

### 8.3 路由列表

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/ddic/typegroups` | CL_SDDIC_ADT_RES_TYPEGROUP | Type Group 集合 |
| GET/PUT/DELETE | `/ddic/typegroups/{typegroupname}` | CL_SDDIC_ADT_RES_TYPEGROUP | Type Group 操作 |
| GET/PUT | `/ddic/typegroups/{typegroupname}/source/{sourcename}` | CL_SDDIC_ADT_RES_TYPEGROUP | 源代码 |
| POST | `/ddic/typegroups/validation` | CL_SDDIC_ADT_VALIDATION_TYPEGR | 名称验证 |
| GET | `/ddic/typegroups/{typegroupname}/source/{sourcename}/versions` | CL_SRC_ADT_RES_VERSIONS | 版本列表 |

### 8.4 Content-Type

| 用途 | Content-Type |
|------|--------------|
| Type Group v2 | `application/vnd.sap.adt.ddic.typegroups.v2+xml` |
| Type Group v3 | `application/vnd.sap.adt.ddic.typegroups.v3+xml` |

### 8.5 示例请求

**获取 Type Group 源代码**:
```http
GET /sap/bc/adt/ddic/typegroups/zmy_types/source/main HTTP/1.1
Host: sap-system:port
Accept: text/plain
```

---

## 9. Table/Domain/Data Element 路由详解

### 9.1 路由机制说明

传统 DDIC 对象（Table, Domain, Data Element）在 SAP ADT 中没有独立的 RES_APP 路由注册类。它们通过以下方式访问：

1. **通用工作台框架**: 通过 `CL_WB_ADT_PLUGIN_RESOURCE` 统一处理
2. **Repository Information System**: 通过 `CL_RIS_ADT_RES_APP` 搜索和访问
3. **URI Mapper**: 通过 URI 映射机制将对象类型转换为 ADT URI

### 9.2 访问方式

#### 方式 1: Repository Search

```http
GET /sap/bc/adt/repository/informationsystem/search?query=ZMYTABLE&objectType=TABL HTTP/1.1
```

#### 方式 2: 直接 URI 访问

```
/sap/bc/adt/ddic/tables/{tablename}
/sap/bc/adt/ddic/domains/{domainname}
/sap/bc/adt/ddic/dataelements/{dataelementname}
```

### 9.3 对象类型代码

| 对象类型 | 代码 | 说明 |
|----------|------|------|
| Table | `TABL` | 透明表 |
| Domain | `DOMA` | 域 |
| Data Element | `DTEL` | 数据元素 |
| Structure | `TABL` (subtype) | 结构 |
| Table Type | `TTYP` | 表类型 |

### 9.4 通过 Element Info 访问

```http
POST /sap/bc/adt/repository/informationsystem/elementinfo?path=ZMYTABLE&type=TABL HTTP/1.1
```

### 9.5 通过 Where-Used 查询

```http
POST /sap/bc/adt/repository/informationsystem/whereused HTTP/1.1
Content-Type: application/xml

<whereUsed>
  <objectType>DTEL</objectType>
  <objectName>ZMYDATAELEMENT</objectName>
</whereUsed>
```

---

## 10. Repository Information System 路由

### 10.1 路由注册类
**类名**: `CL_RIS_ADT_RES_APP`
**包**: `SRIS_ADT`

### 10.2 URL 前缀
`/repository/informationsystem`

### 10.3 核心路由列表

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET | `/repository/informationsystem/search` | CL_RIS_ADT_RES_SEARCH | 对象搜索 |
| GET | `/repository/informationsystem/objecttypes` | CL_RIS_ADT_RES_OBJECT_TYPES | 对象类型列表 |
| GET | `/repository/informationsystem/usageReferences` | CL_RIS_ADT_RES_REFERENCES | 使用引用 |
| GET | `/repository/informationsystem/whereused` | CL_RIS_ADT_RES_WHERE_USED | Where-Used |
| POST | `/repository/informationsystem/elementinfo` | CL_ADT_RES_ELEMENT_INFO | 元素信息 |
| GET | `/repository/informationsystem/metadata` | CL_RIS_ADT_RES_METADATA | 元数据 |

### 10.4 搜索 URI 模板

```
/repository/informationsystem/search{?operation,query,useSearchProvider,noDescription,maxResults}{&objectType*}{&packageName*}
```

### 10.5 示例请求

**搜索对象**:
```http
GET /sap/bc/adt/repository/informationsystem/search?query=ZCL_*&objectType=CLAS&maxResults=50 HTTP/1.1
Host: sap-system:port
Accept: application/atom+xml
```

**Where-Used 查询**:
```http
GET /sap/bc/adt/repository/informationsystem/usageReferences?uri=/sap/bc/adt/oo/classes/zcl_my_class HTTP/1.1
```

---

## 11. Service Definition/Binding 路由详解

### 11.1 Service Definition (SRVD)

#### 11.1.1 路由注册类
**类名**: `CL_SRVD_ADT_RES_APP`
**包**: `SDDIC_ADT_SRVD`

#### 11.1.2 URL 前缀
`/ddic/srvd`

#### 11.1.3 路由列表

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET | `/ddic/srvd/services` | CL_SRVD_SERVICES | 服务列表 |
| GET | `/ddic/srvd/sourceTypes` | CL_SRVD_SOURCE_TYPES | 源类型 |
| POST | `/ddic/srvd/elementinfo` | CL_SRVD_RES_ELEMINFO | 元素信息 (F2) |
| GET | `/ddic/srvd/parser/info` | CL_SRVD_RES_PARSER_INFO | 解析器信息 |
| POST | `/ddic/srvd/formatter/identifiers` | CL_SRVD_IDENT_FORMATTER | 标识符格式化 |
| GET | `/docu/srvd/langu` | CL_SRVD_ADT_DOCU_LANGU | 语言帮助 (F1) |

#### 11.1.4 Content-Type

| 用途 | Content-Type |
|------|--------------|
| Service Definition | `application/vnd.sap.adt.srvd+xml` |

### 11.2 Service Binding (SRVB)

#### 11.2.1 工作台访问类
**类名**: `CL_SRVB_WB_ACCESS`
**包**: `SDDIC_ADT_SRVB_CORE`

#### 11.2.2 URL 前缀
`/businessservices/bindings`

#### 11.2.3 路由列表

| HTTP 方法 | 路径模板 | 处理类 | 说明 |
|-----------|----------|--------|------|
| GET/POST | `/businessservices/bindings` | CL_SRVB_WB_ACCESS | Service Binding 集合 |
| GET/PUT/DELETE | `/businessservices/bindings/{srvb_name}` | CL_SRVB_WB_ACCESS | Service Binding 操作 |
| POST | `/businessservices/bindings/validation` | CL_SRVB_RES_VALIDATION | 验证 |
| GET | `/businessservices/bindings/bindingtypes` | CL_SRVB_ALL_BINDING_TYPES_RES | 绑定类型列表 |
| POST | `/businessservices/bindings/validate/servicedefinition` | CL_SRVB_SRVD_VALIDATION | Service Definition 验证 |
| GET | `/businessservices/bindings/bindingtypes/ina1` | CL_ADT_INA1_SERVICE_RESOURCE | InA 服务 |
| GET | `/businessservices/bindings/bindingtypes/sql1` | CL_ADT_SQL1_SERVICE_RESOURCE | SQL 服务 |
| GET | `/businessservices/bindings/uiconfig` | CL_ADT_UICONF_SERVICE_RESOURCE | UI 配置 |
| GET | `/businessservices/bindings/schema` | CL_ADT_SCHEMA_SERVICE_RESOURCE | Schema |

#### 11.2.4 OData 服务发布操作

##### 关键接口: `IF_SRVB_SERVICE_ACTIONS`

**发布操作类型**:
```abap
BEGIN OF ENUM action,
  local_publish,      " 本地发布
  local_unpublish,    " 本地取消发布
END OF ENUM action,
```

**OData 版本**:
```abap
BEGIN OF ENUM odata_category,
  v2,   " OData V2
  v4,   " OData V4
END OF ENUM odata_category,
```

##### 关键方法

| 方法 | 说明 |
|------|------|
| `perform_service_binding_action` | 执行发布/取消发布操作 |
| `is_service_binding_published` | 检查服务是否已发布 |
| `get_service_details_info` | 获取服务详细信息 |

#### 11.2.5 发布 OData 服务的 HTTP 请求示例

**发布 OData V2 服务**:
```http
POST /sap/bc/adt/businessservices/bindings/{srvb_name}?action=publish HTTP/1.1
Host: sap-system:port
Content-Type: application/vnd.sap.adt.businessservices.servicebinding.v2+xml
X-CSRF-Token: <token>
```

**检查发布状态**:
```http
GET /sap/bc/adt/businessservices/bindings/{srvb_name} HTTP/1.1
Host: sap-system:port
Accept: application/vnd.sap.adt.businessservices.servicebinding.v2+xml
```

**取消发布**:
```http
POST /sap/bc/adt/businessservices/bindings/{srvb_name}?action=unpublish HTTP/1.1
Host: sap-system:port
X-CSRF-Token: <token>
```

#### 11.2.6 Content-Type

| 用途 | Content-Type |
|------|--------------|
| Service Binding v2 | `application/vnd.sap.adt.businessservices.servicebinding.v2+xml` |
| InA Service v1 | `application/vnd.sap.adt.businessservices.ina.v1+xml` |
| SQL Service v1 | `application/vnd.sap.adt.businessservices.sql.v1+xml` |
| UI Config v1 | `application/vnd.sap.adt.businessservices.uiconfig.v1+json` |
| Schema v1 | `application/vnd.sap.adt.businessservices.schema.v1+json` |

#### 11.2.7 相关实现类

| 类名 | 用途 |
|------|------|
| `CL_SRVB_SERVICE_ACTIONS` | 服务操作实现 |
| `CL_ODATAV2_BINDING_TYPE_IMPL` | OData V2 发布实现 |
| `CL_ODATAV4_BINDING_TYPE_IMPL` | OData V4 发布实现 |
| `CL_XCO_SRVB_OP_LSE_PUBLISH` | XCO 发布操作 |
| `CL_XCO_SRVB_OP_LSE_UNPUBLISH` | XCO 取消发布操作 |
| `CL_XCO_SRVB_OP_LSE_IS_PUBLISHD` | XCO 检查发布状态 |

---

## 12. 完整路由路径参考

### 12.1 所有路由汇总表

| 对象类型 | 基础路径 | 获取列表 | 获取单个 | 获取源代码 |
|----------|----------|----------|----------|------------|
| Class | `/oo/classes` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Interface | `/oo/interfaces` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Function Group | `/functions/groups` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Function Module | `/functions/groups/{fugr}/fmodules` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Program | `/programs/programs` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Include | `/programs/includes` | GET | GET `/{name}` | GET `/{name}/source/main` |
| CDS View | `/ddic/ddl/sources` | GET | GET `/{name}` | GET `/{name}/source/main` |
| DDIC View | `/ddic/views` | GET | GET `/{name}` | - |
| Type Group | `/ddic/typegroups` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Service Definition | `/ddic/srvd` | GET | GET `/{name}` | GET `/{name}/source/main` |
| Service Binding | `/businessservices/bindings` | GET | GET `/{name}` | - |

### 12.2 CRUD 操作标准路径

| 操作 | HTTP 方法 | 路径模式 |
|------|-----------|----------|
| Create | POST | `/{base-path}` |
| Read | GET | `/{base-path}/{name}` |
| Update | PUT | `/{base-path}/{name}` |
| Delete | DELETE | `/{base-path}/{name}` |
| Lock | POST | `/{base-path}/{name}?action=LOCK&accessMode=MODIFY` |
| Unlock | POST | `/{base-path}/{name}?action=UNLOCK&lockHandle={handle}` |
| Activate | POST | `/{base-path}/{name}?action=ACTIVATE` |

### 12.3 验证路径

| 对象类型 | 验证路径 |
|----------|----------|
| Class/Interface | `/oo/validation/objectname` |
| Function | `/functions/validation` |
| Program | `/programs/validation` |
| Include | `/includes/validation` |
| CDS | `/ddic/ddl/validation` |
| View | `/ddic/views/$validation` |
| Type Group | `/ddic/typegroups/validation` |
| Service Binding | `/businessservices/bindings/validation` |

---

## 13. 开发集成指南

### 13.1 获取 CSRF Token

```http
GET /sap/bc/adt/discovery HTTP/1.1
Host: <sap-system>
X-CSRF-Token: fetch
```

从响应头 `X-CSRF-Token` 获取令牌。

### 13.2 标准 CRUD 工作流

```
步骤 1: 获取 CSRF Token
        GET /sap/bc/adt/discovery
        X-CSRF-Token: fetch

步骤 2: 验证对象名称 (可选)
        GET /sap/bc/adt/{type}/validation?objname={name}&package={package}

步骤 3: 锁定对象 (修改时需要)
        POST /sap/bc/adt/{type}/{name}?action=LOCK&accessMode=MODIFY
        → 获取 lockHandle

步骤 4: 获取当前内容和 ETag
        GET /sap/bc/adt/{type}/{name}
        → 获取 ETag

步骤 5: 执行 CRUD 操作
        POST/PUT/DELETE /sap/bc/adt/{type}/{name}?lockHandle={handle}&corrNr={tr}
        If-Match: <etag>

步骤 6: 激活对象
        POST /sap/bc/adt/{type}/{name}?action=ACTIVATE

步骤 7: 解锁对象
        POST /sap/bc/adt/{type}/{name}?action=UNLOCK&lockHandle={handle}
```

### 13.3 OData Service 发布工作流

```
步骤 1: 获取 CSRF Token
        GET /sap/bc/adt/discovery
        X-CSRF-Token: fetch

步骤 2: 获取 Service Binding 信息
        GET /sap/bc/adt/businessservices/bindings/{srvb_name}

步骤 3: 检查发布状态
        GET /sap/bc/adt/businessservices/bindings/{srvb_name}
        → 检查 publication_status 字段

步骤 4: 发布服务 (如果未发布)
        POST /sap/bc/adt/businessservices/bindings/{srvb_name}?action=publish
        X-CSRF-Token: <token>

步骤 5: 验证发布结果
        GET /sap/bc/adt/businessservices/bindings/{srvb_name}
        → 确认服务已发布
```

### 13.4 Python 示例代码

```python
import requests
from requests.auth import HTTPBasicAuth

class ADTClient:
    def __init__(self, base_url, username, password):
        self.base_url = f"{base_url}/sap/bc/adt"
        self.auth = HTTPBasicAuth(username, password)
        self.session = requests.Session()
        self.csrf_token = None
    
    def fetch_csrf_token(self):
        """获取 CSRF Token"""
        response = self.session.get(
            f"{self.base_url}/discovery",
            auth=self.auth,
            headers={'X-CSRF-Token': 'fetch'}
        )
        self.csrf_token = response.headers.get('X-CSRF-Token')
        return self.csrf_token
    
    def get_class_source(self, class_name, include='main'):
        """获取类源代码"""
        url = f"{self.base_url}/oo/classes/{class_name.lower()}/source/{include}"
        response = self.session.get(
            url,
            auth=self.auth,
            headers={'Accept': 'text/plain'}
        )
        return response.text
    
    def get_function_source(self, fugr_name, func_name):
        """获取函数模块源代码"""
        url = f"{self.base_url}/functions/groups/{fugr_name.lower()}/fmodules/{func_name.lower()}/source/main"
        response = self.session.get(
            url,
            auth=self.auth,
            headers={'Accept': 'text/plain'}
        )
        return response.text
    
    def get_program_source(self, program_name):
        """获取程序源代码"""
        url = f"{self.base_url}/programs/programs/{program_name.lower()}/source/main"
        response = self.session.get(
            url,
            auth=self.auth,
            headers={'Accept': 'text/plain'}
        )
        return response.text
    
    def get_cds_source(self, cds_name):
        """获取 CDS 源代码"""
        url = f"{self.base_url}/ddic/ddl/sources/{cds_name.lower()}/source/main"
        response = self.session.get(
            url,
            auth=self.auth,
            headers={'Accept': 'text/plain'}
        )
        return response.text
    
    def search_objects(self, query, object_type=None, max_results=100):
        """搜索对象"""
        url = f"{self.base_url}/repository/informationsystem/search"
        params = {
            'query': query,
            'maxResults': max_results
        }
        if object_type:
            params['objectType'] = object_type
        
        response = self.session.get(
            url,
            auth=self.auth,
            params=params,
            headers={'Accept': 'application/atom+xml'}
        )
        return response.text


# 使用示例
if __name__ == '__main__':
    client = ADTClient('https://sap-server:port', 'user', 'password')
    client.fetch_csrf_token()
    
    # 获取类源代码
    source = client.get_class_source('ZCL_MY_CLASS')
    print(source)
    
    # 搜索所有以 Z 开头的类
    results = client.search_objects('Z*', 'CLAS')
    print(results)
```

    def publish_service_binding(self, srvb_name):
        """发布 Service Binding"""
        url = f"{self.base_url}/businessservices/bindings/{srvb_name.lower()}"
        response = self.session.post(
            url,
            auth=self.auth,
            params={'action': 'publish'},
            headers={
                'X-CSRF-Token': self.csrf_token,
                'Content-Type': 'application/vnd.sap.adt.businessservices.servicebinding.v2+xml'
            }
        )
        return response.status_code == 200
    
    def unpublish_service_binding(self, srvb_name):
        """取消发布 Service Binding"""
        url = f"{self.base_url}/businessservices/bindings/{srvb_name.lower()}"
        response = self.session.post(
            url,
            auth=self.auth,
            params={'action': 'unpublish'},
            headers={'X-CSRF-Token': self.csrf_token}
        )
        return response.status_code == 200
    
    def get_service_binding(self, srvb_name):
        """获取 Service Binding 信息"""
        url = f"{self.base_url}/businessservices/bindings/{srvb_name.lower()}"
        response = self.session.get(
            url,
            auth=self.auth,
            headers={'Accept': 'application/vnd.sap.adt.businessservices.servicebinding.v2+xml'}
        )
        return response.text


# 使用示例
if __name__ == '__main__':
    client = ADTClient('https://sap-server:port', 'user', 'password')
    client.fetch_csrf_token()
    
    # 获取类源代码
    source = client.get_class_source('ZCL_MY_CLASS')
    print(source)
    
    # 搜索所有以 Z 开头的类
    results = client.search_objects('Z*', 'CLAS')
    print(results)
    
    # 发布 OData 服务
    client.publish_service_binding('ZMY_SERVICE_BINDING')
```

### 13.5 常见 HTTP 状态码

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

### 13.6 调试技巧

**设置断点的关键位置**:

1. **入口点**: `CL_ADT_WB_RES_APP=>if_http_extension~handle_request`
2. **路由分发**: `CL_REST_ROUTER=>route`
3. **各对象 CRUD**:
   - Class: `CL_OO_ADT_RES_CLASS=>do_get/do_post/do_put/do_delete`
   - Function: `CL_FB_ADT_RES_FUNC=>do_get/do_post/do_put/do_delete`
   - Program: `CL_SEDI_ADT_RES_PROGRAM=>do_get/do_post/do_put/do_delete`
   - CDS: `CL_DDIC_ADT_RES_DDLS=>do_get/do_post/do_update/do_delete`
   - Service Binding: `CL_SRVB_WB_ACCESS=>if_wb_access~activate_object/generate_object`
   - Service Publish: `CL_SRVB_SERVICE_ACTIONS=>perform_service_binding_action`

---

## 附录 A: 关键接口常量

### IF_ADT_URI_NAMESPACES

```abap
co_sap_bc_adt TYPE string VALUE 'sap/bc/adt'.
```

### IF_OO_ADT_RES_APP

```abap
co_url_prefix TYPE string VALUE '/oo'.
co_class_prefix TYPE string VALUE '/classes'.
co_interface_prefix TYPE string VALUE '/interfaces'.
```

### IF_FB_ADT_RES_APP

```abap
co_url_prefix TYPE string VALUE '/functions'.
co_groups_prefix TYPE string VALUE '/groups'.
co_fmodules_prefix TYPE string VALUE '/fmodules'.
```

### IF_SEDI_ADT_RES_CO

```abap
co_url_prefix_programs TYPE string VALUE '/programs/programs'.
co_url_prefix_includes TYPE string VALUE '/programs/includes'.
```

---

## 附录 B: Content-Type 完整参考

| 对象类型 | Content-Type |
|----------|--------------|
| Class v4 | `application/vnd.sap.adt.oo.classes.v4+xml` |
| Interface v4 | `application/vnd.sap.adt.oo.interfaces.v4+xml` |
| Function Group v3 | `application/vnd.sap.adt.functions.groups.v3+xml` |
| Function Module v3 | `application/vnd.sap.adt.functions.fmodules.v3+xml` |
| Program v2 | `application/vnd.sap.adt.programs.programs.v2+xml` |
| Include v2 | `application/vnd.sap.adt.programs.includes.v2+xml` |
| CDS Source | `application/vnd.sap.adt.ddlSource+xml` |
| Type Group v3 | `application/vnd.sap.adt.ddic.typegroups.v3+xml` |
| Source Code | `text/plain` |
| ATOM Feed | `application/atom+xml` |
| Service Definition | `application/vnd.sap.adt.srvd+xml` |
| Service Binding v2 | `application/vnd.sap.adt.businessservices.servicebinding.v2+xml` |

---

*文档版本: 1.0*
*生成日期: 2026-01-26*
*基于 SAP ADT 源代码分析*