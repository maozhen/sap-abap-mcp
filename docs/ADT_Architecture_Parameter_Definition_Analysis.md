# SAP ADT (ABAP Development Tools) 工作原理与接口参数定义方法分析

## 文档概述

本文档基于对SAP ABAP系统中ADT核心类的源代码分析，详细阐述ADT REST API的工作原理、架构设计和接口参数定义方法。

---

## 1. ADT整体架构

### 1.1 架构层次图

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP客户端 (Eclipse ADT / API调用)             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              ICF服务入口: /sap/bc/adt                             │
│              处理类: CL_ADT_WB_RES_APP                            │
│              接口: IF_HTTP_EXTENSION                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    请求代理层 (Request Proxy)                      │
│  ┌──────────────────┬──────────────────┬──────────────────┐     │
│  │   HTTP代理       │   RFC代理         │   其他代理        │     │
│  │ (本地处理)       │ (前端服务器/调试)  │                  │     │
│  └──────────────────┴──────────────────┴──────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    资源路由层 (Resource Router)                    │
│              根据URI模板匹配对应的资源处理器                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               资源处理器层 (Resource Handlers)                     │
│              继承自 CL_ADT_REST_RESOURCE                          │
│              实现 GET / POST / PUT / DELETE 等方法                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               内容处理器层 (Content Handlers)                      │
│              接口: IF_ADT_REST_CONTENT_HANDLER                    │
│              负责请求体反序列化和响应体序列化                        │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心组件说明

| 组件 | 类/接口 | 职责 |
|------|--------|------|
| HTTP入口 | `CL_ADT_WB_RES_APP` | 实现`IF_HTTP_EXTENSION`，接收所有ADT HTTP请求 |
| 请求代理 | `IF_ADT_REQUEST_PROXY` | 支持HTTP/RFC等不同代理模式，处理跨系统调用 |
| 请求对象 | `IF_ADT_REST_REQUEST` | 封装HTTP请求，提供参数获取方法 |
| 响应对象 | `IF_ADT_REST_RESPONSE` | 封装HTTP响应，提供数据设置方法 |
| 资源处理器 | `CL_ADT_REST_RESOURCE` | 资源处理基类，子类实现具体业务逻辑 |
| 内容处理器 | `IF_ADT_REST_CONTENT_HANDLER` | 负责XML/JSON等格式的序列化/反序列化 |

---

## 2. 请求处理流程

### 2.1 主流程 (CL_ADT_WB_RES_APP.handle_request)

```abap
METHOD handle_request.
  " 1. 获取请求代理（根据请求类型确定处理方式）
  DATA(proxy) = get_request_proxy( server ).
  
  " 2. 配置会话状态（有状态/无状态）
  configure_session_state( server = server proxy = proxy ).
  
  " 3. 代理处理请求
  proxy->handle_request( ).
ENDMETHOD.
```

### 2.2 代理类型

ADT支持多种请求代理模式：

| 代理类型 | 用途 | 场景 |
|---------|------|------|
| HTTP代理 | 本地直接处理 | 标准REST API调用 |
| RFC代理 | 远程函数调用转发 | 前端服务器架构 |
| 调试代理 | 调试器集成 | ABAP调试场景 |
| 跟踪代理 | 性能跟踪 | 性能分析场景 |

### 2.3 会话状态管理

```abap
" 通过HTTP头控制会话状态
" X-sap-adt-sessiontype: stateful   - 有状态模式（保持会话）
" X-sap-adt-sessiontype: stateless  - 无状态模式（每次请求独立）
```

---

## 3. 接口参数定义方法

### 3.1 参数类型概述

ADT REST API支持三种主要的参数定义方式：

| 参数类型 | 获取方法 | 定义位置 | 示例 |
|---------|---------|---------|------|
| URI属性(Attribute) | `get_uri_attribute()` | URI路径模板 | `/flights/{carrier_id}` |
| 查询参数(Query) | `get_uri_query_parameter()` | URL查询字符串 | `?name=value` |
| 请求体(Body) | `get_body_data()` | HTTP请求体 | XML/JSON数据 |

### 3.2 URI属性参数 (Path Parameters)

#### 3.2.1 定义方式

在资源注册时使用花括号语法定义URI模板：

```abap
METHOD register_resources.
  " 使用花括号 {} 定义路径参数
  collection->register_disc_res_w_template(
    relation      = 'http://www.sap.com/adt/relations/examples/flight'
    template      = '/examples/flight/flights/{carrier_id}/{connection_id}/{flight_date}'
    handler_class = 'CL_SFLIGHT_ADT_RES_FLIGHT' ).
ENDMETHOD.
```

#### 3.2.2 获取方式

在资源处理器中使用`get_uri_attribute()`获取：

```abap
METHOD get_flight_key_from_uri.
  " 获取必填的URI属性参数
  request->get_uri_attribute(
    EXPORTING
      name      = 'carrier_id'
      mandatory = abap_true      " 必填参数
    IMPORTING
      value     = carrier_id ).
  
  request->get_uri_attribute(
    EXPORTING
      name      = 'connection_id'
      mandatory = abap_true
    IMPORTING
      value     = connection_id ).
  
  request->get_uri_attribute(
    EXPORTING
      name      = 'flight_date'
      mandatory = abap_true
    IMPORTING
      value     = flight_date ).
ENDMETHOD.
```

#### 3.2.3 IF_ADT_REST_REQUEST接口定义

```abap
METHODS get_uri_attribute
  IMPORTING
    !name      TYPE csequence       " 参数名称
    !mandatory TYPE abap_bool DEFAULT abap_false  " 是否必填
  EXPORTING
    !value     TYPE simple          " 参数值（简单类型）
  RAISING
    cx_adt_rest.                    " 参数缺失或无效时抛出异常
```

### 3.3 查询参数 (Query Parameters)

#### 3.3.1 定义方式

查询参数无需预先定义，在URL中直接使用`?key=value`格式传递。

#### 3.3.2 获取方式

**单值参数：**
```abap
METHOD get.
  " 获取单个查询参数
  DATA: lv_max_results TYPE i.
  
  request->get_uri_query_parameter(
    EXPORTING
      name      = 'maxResults'
      mandatory = abap_false       " 可选参数
      default   = 100              " 默认值
    IMPORTING
      value     = lv_max_results ).
ENDMETHOD.
```

**多值参数：**
```abap
METHOD get.
  " 获取多值查询参数（如 ?type=A&type=B&type=C）
  DATA: lt_types TYPE string_table.
  
  request->get_uri_query_parameter_values(
    EXPORTING
      name      = 'type'
      mandatory = abap_false
    IMPORTING
      values    = lt_types ).
ENDMETHOD.
```

#### 3.3.3 IF_ADT_REST_REQUEST接口定义

```abap
" 单值查询参数
METHODS get_uri_query_parameter
  IMPORTING
    !name      TYPE csequence
    !mandatory TYPE abap_bool DEFAULT abap_false
    !default   TYPE simple OPTIONAL    " 可指定默认值
  EXPORTING
    !value     TYPE simple
  RAISING
    cx_adt_rest.

" 多值查询参数
METHODS get_uri_query_parameter_values
  IMPORTING
    !name      TYPE csequence
    !mandatory TYPE abap_bool DEFAULT abap_false
    !default   TYPE any TABLE OPTIONAL
  EXPORTING
    !values    TYPE any TABLE          " 返回值表
  RAISING
    cx_adt_rest.
```

### 3.4 请求体参数 (Body Parameters)

#### 3.4.1 获取方式

使用`get_body_data()`配合内容处理器获取请求体数据：

```abap
METHOD put.
  DATA: wa_flight TYPE sflight.
  
  " 获取请求体数据，自动反序列化
  request->get_body_data(
    EXPORTING
      content_handler = get_content_handler( )
    IMPORTING
      data           = wa_flight ).
  
  " 使用反序列化后的数据
  UPDATE sflight FROM wa_flight.
ENDMETHOD.
```

#### 3.4.2 IF_ADT_REST_REQUEST接口定义

```abap
METHODS get_body_data
  IMPORTING
    !content_handler TYPE REF TO if_adt_rest_content_handler
  EXPORTING
    !data            TYPE data    " 任意ABAP数据类型
  RAISING
    cx_adt_rest.
```

### 3.5 URI片段 (Fragment)

```abap
" 获取URI片段（#后面的部分）
METHODS get_uri_fragment
  RETURNING
    VALUE(result) TYPE string.
```

---

## 4. 内容处理器机制

### 4.1 IF_ADT_REST_CONTENT_HANDLER接口

```abap
INTERFACE if_adt_rest_content_handler PUBLIC.
  " 反序列化：将请求实体转换为ABAP数据
  METHODS deserialize
    IMPORTING
      !request_entity TYPE REF TO if_rest_entity
    EXPORTING
      !data           TYPE data
    RAISING
      cx_adt_rest.
  
  " 序列化：将ABAP数据转换为响应实体
  METHODS serialize
    IMPORTING
      !data            TYPE data
      !response_entity TYPE REF TO if_rest_entity
    RAISING
      cx_adt_rest.
  
  " 返回支持的内容类型
  METHODS get_supported_content_type
    RETURNING
      VALUE(result) TYPE string.
ENDINTERFACE.
```

### 4.2 内容处理器工厂

ADT提供了工厂类`CL_ADT_REST_CNT_HDL_FACTORY`用于创建不同类型的内容处理器：

```abap
METHOD get_content_handler.
  " 创建基于Simple Transformation的XML处理器
  result = cl_adt_rest_cnt_hdl_factory=>get_instance( )->get_handler_for_xml_using_st(
    st_name   = 'SFLIGHT_ADT_FLIGHT'    " Simple Transformation名称
    root_name = 'flight' ).              " XML根元素名称
ENDMETHOD.
```

### 4.3 常用内容处理器类型

| 方法 | 内容类型 | 用途 |
|------|---------|------|
| `get_handler_for_xml_using_st()` | application/xml | 使用Simple Transformation处理XML |
| `get_handler_for_atom_xml()` | application/atom+xml | Atom Feed格式 |
| `get_handler_for_json()` | application/json | JSON格式（如果支持） |

---

## 5. 响应数据设置

### 5.1 设置响应体

```abap
METHOD get.
  DATA: wa_flight TYPE sflight.
  
  " 查询数据
  SELECT SINGLE * FROM sflight INTO wa_flight
    WHERE carrid = carrier_id.
  
  IF sy-subrc = 0.
    " 设置响应数据
    response->set_body_data(
      content_handler = get_content_handler( )
      data           = wa_flight ).
  ELSE.
    " 资源未找到
    RAISE EXCEPTION TYPE cx_adt_res_not_found.
  ENDIF.
ENDMETHOD.
```

### 5.2 内容类型协商

ADT支持Accept头的内容类型协商：

```abap
METHOD get.
  DATA: lt_supported TYPE string_table.
  
  " 定义支持的内容类型
  APPEND 'application/xml' TO lt_supported.
  APPEND 'application/json' TO lt_supported.
  
  " 获取协商后的内容类型
  DATA(lv_content_type) = request->get_accept_content_type(
    supported_content_types = lt_supported ).
  
  " 根据协商结果选择不同的处理方式
  CASE lv_content_type.
    WHEN 'application/xml'.
      " 返回XML格式
    WHEN 'application/json'.
      " 返回JSON格式
  ENDCASE.
ENDMETHOD.
```

---

## 6. 资源注册机制

### 6.1 资源注册示例

```abap
METHOD register_resources.
  " 注册简单资源（固定URL）
  registry->register_discoverable_resource(
    url             = '/examples/flight/carriers'
    handler_class   = 'CL_SFLIGHT_ADT_RES_CARRIERS'
    description     = 'Carriers'
    category_scheme = 'http://www.sap.com/adt/categories/examples/flights'
    category_term   = 'carriers' ).
  
  " 注册带URI模板的资源（动态URL）
  collection->register_disc_res_w_template(
    relation      = 'http://www.sap.com/adt/relations/examples/flight'
    template      = '/examples/flight/flights/{carrier_id}/{connection_id}/{flight_date}'
    handler_class = 'CL_SFLIGHT_ADT_RES_FLIGHT' ).
ENDMETHOD.
```

### 6.2 URI模板语法

| 语法 | 说明 | 示例 |
|------|------|------|
| `{name}` | 必填路径参数 | `/classes/{class_name}` |
| `{?name}` | 可选查询参数 | `/search{?query,maxResults}` |
| `{#name}` | 片段标识符 | `/document{#section}` |

---

## 7. 完整资源处理器实现示例

### 7.1 类定义

```abap
CLASS cl_sflight_adt_res_flight DEFINITION
  PUBLIC
  INHERITING FROM cl_adt_rest_resource
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    " 内容处理器工厂方法
    CLASS-METHODS get_content_handler
      RETURNING VALUE(result) TYPE REF TO if_adt_rest_content_handler.
    
    " 重定义HTTP方法
    METHODS delete REDEFINITION.
    METHODS get REDEFINITION.
    METHODS put REDEFINITION.

  PRIVATE SECTION.
    " 从URI获取主键的辅助方法
    METHODS get_flight_key_from_uri
      IMPORTING
        request       TYPE REF TO if_adt_rest_request
      EXPORTING
        carrier_id    TYPE s_carr_id
        connection_id TYPE s_conn_id
        flight_date   TYPE s_date
      RAISING
        cx_adt_rest.
ENDCLASS.
```

### 7.2 实现代码

```abap
CLASS cl_sflight_adt_res_flight IMPLEMENTATION.

  METHOD get_content_handler.
    " 使用工厂创建XML内容处理器
    result = cl_adt_rest_cnt_hdl_factory=>get_instance( )->get_handler_for_xml_using_st(
      st_name   = co_st_name
      root_name = co_root_name ).
  ENDMETHOD.

  METHOD get.
    DATA: wa_flight TYPE sflight.
    
    " 1. 从URI获取参数
    get_flight_key_from_uri(
      EXPORTING request = request
      IMPORTING carrier_id = DATA(carrier_id)
                connection_id = DATA(connection_id)
                flight_date = DATA(flight_date) ).
    
    " 2. 查询数据
    SELECT SINGLE * FROM sflight INTO wa_flight
      WHERE carrid = carrier_id
        AND connid = connection_id
        AND fldate = flight_date.
    
    " 3. 处理结果
    IF sy-subrc = 4.
      RAISE EXCEPTION TYPE cx_adt_res_not_found.
    ELSE.
      response->set_body_data(
        content_handler = get_content_handler( )
        data           = wa_flight ).
    ENDIF.
  ENDMETHOD.

  METHOD put.
    DATA: wa_flight TYPE sflight.
    
    " 1. 从请求体获取数据
    request->get_body_data(
      EXPORTING content_handler = get_content_handler( )
      IMPORTING data = wa_flight ).
    
    " 2. 从URI获取主键（覆盖请求体中的值）
    get_flight_key_from_uri(
      EXPORTING request = request
      IMPORTING carrier_id = wa_flight-carrid
                connection_id = wa_flight-connid
                flight_date = wa_flight-fldate ).
    
    " 3. 更新数据
    UPDATE sflight FROM wa_flight.
  ENDMETHOD.

  METHOD delete.
    " 1. 从URI获取主键
    get_flight_key_from_uri(
      EXPORTING request = request
      IMPORTING carrier_id = DATA(carrier_id)
                connection_id = DATA(connection_id)
                flight_date = DATA(flight_date) ).
    
    " 2. 删除数据
    DELETE FROM sflight
      WHERE carrid = carrier_id
        AND connid = connection_id
        AND fldate = flight_date.
  ENDMETHOD.

  METHOD get_flight_key_from_uri.
    " 获取所有URI属性参数
    request->get_uri_attribute(
      EXPORTING name = 'carrier_id' mandatory = abap_true
      IMPORTING value = carrier_id ).
    
    request->get_uri_attribute(
      EXPORTING name = 'connection_id' mandatory = abap_true
      IMPORTING value = connection_id ).
    
    request->get_uri_attribute(
      EXPORTING name = 'flight_date' mandatory = abap_true
      IMPORTING value = flight_date ).
  ENDMETHOD.

ENDCLASS.
```

---

## 8. 错误处理

### 8.1 常用异常类

| 异常类 | HTTP状态码 | 用途 |
|--------|-----------|------|
| `CX_ADT_RES_NOT_FOUND` | 404 | 资源不存在 |
| `CX_ADT_REST` | 400/500 | 通用REST异常 |
| `CX_ADT_REST_INVALID_PARAM` | 400 | 参数无效 |

### 8.2 异常处理示例

```abap
METHOD get.
  TRY.
      " 获取必填参数
      request->get_uri_attribute(
        EXPORTING name = 'id' mandatory = abap_true
        IMPORTING value = DATA(id) ).
    CATCH cx_adt_rest INTO DATA(lx_rest).
      " 参数缺失，返回400 Bad Request
      RAISE EXCEPTION lx_rest.
  ENDTRY.
  
  " 查询资源
  SELECT SINGLE * FROM mytable INTO @DATA(result) WHERE id = @id.
  IF sy-subrc <> 0.
    " 资源不存在，返回404 Not Found
    RAISE EXCEPTION TYPE cx_adt_res_not_found.
  ENDIF.
ENDMETHOD.
```

---

## 9. 最佳实践

### 9.1 参数定义建议

1. **路径参数(URI Attribute)**：用于标识资源的唯一键
2. **查询参数(Query Parameter)**：用于过滤、分页、排序等可选操作
3. **请求体(Body)**：用于传递复杂数据结构

### 9.2 内容处理器建议

1. 优先使用Simple Transformation处理XML
2. 为每个资源定义专用的内容处理器方法
3. 支持内容类型协商以提高API灵活性

### 9.3 代码组织建议

1. 将URI参数解析抽取到私有方法
2. 使用常量定义内容处理器相关配置
3. 统一异常处理机制

---

## 10. 总结

ADT REST API架构采用经典的资源导向设计：

1. **入口层**：`CL_ADT_WB_RES_APP`接收所有HTTP请求
2. **代理层**：根据请求类型选择合适的处理代理
3. **路由层**：根据URI模板匹配资源处理器
4. **资源层**：继承`CL_ADT_REST_RESOURCE`实现业务逻辑
5. **内容层**：通过`IF_ADT_REST_CONTENT_HANDLER`处理序列化

参数定义和获取遵循RESTful约定：
- 路径参数通过URI模板定义，`get_uri_attribute()`获取
- 查询参数通过URL传递，`get_uri_query_parameter()`获取
- 请求体通过内容处理器反序列化，`get_body_data()`获取

这种设计使得ADT API具有良好的扩展性和维护性，开发者可以通过继承资源基类快速实现新的REST端点。

---

## 附录：参考资料

- SAP ADT API Documentation
- IF_ADT_REST_REQUEST Interface Definition
- IF_ADT_REST_CONTENT_HANDLER Interface Definition
- CL_ADT_REST_RESOURCE Class Documentation