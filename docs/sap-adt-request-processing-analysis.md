# SAP ADT Request Processing Analysis

## Overview

This document analyzes how SAP ADT (ABAP Development Tools) processes incoming HTTP requests through the main entry point class `CL_ADT_WB_RES_APP`. This class is responsible for handling all REST API requests under the `/sap/bc/adt` path.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [CL_ADT_WB_RES_APP Class Structure](#cl_adt_wb_res_app-class-structure)
3. [Request Processing Flow](#request-processing-flow)
4. [Request Proxy Mechanism](#request-proxy-mechanism)
5. [System Alias Routing](#system-alias-routing)
6. [Session State Management](#session-state-management)
7. [Routing Specific Operations](#routing-specific-operations)
8. [Security and Authorization](#security-and-authorization)

---

## Architecture Overview

SAP ADT uses a REST API architecture to handle development tool requests. The main entry point is the ICF (Internet Communication Framework) service registered at path `/sap/bc/adt`.

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP Client (Eclipse/VS Code)                │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SAP ICF Service                              │
│                    Path: /sap/bc/adt                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CL_ADT_WB_RES_APP                               │
│            (IF_HTTP_EXTENSION~HANDLE_REQUEST)                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ Local HTTP │  │ RFC Proxy  │  │ RFC Proxy  │
     │   Proxy    │  │   (FES)    │  │   (DBG)    │
     └────────────┘  └────────────┘  └────────────┘
```

### Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `co_service_path` | `/sap/bc/adt` | Base path for all ADT services |
| `co_service_name` | `ADT_0001` | OAuth2 service name |
| `co_session_type` | `X-sap-adt-sessiontype` | HTTP header for session type |

---

## CL_ADT_WB_RES_APP Class Structure

### Interfaces Implemented

```abap
CLASS cl_adt_wb_res_app DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_http_extension.    " Main HTTP request handler
    INTERFACES if_oauth2_consumer.   " OAuth2 authentication support
ENDCLASS.
```

### Core Components

1. **IF_HTTP_EXTENSION~HANDLE_REQUEST** - Main entry point for all HTTP requests
2. **GET_REQUEST_PROXY** - Factory method that selects appropriate request handler
3. **CONFIGURE_SESSION_STATE** - Manages stateful/stateless session configuration
4. **SYSTEM_ALIAS_CHECKPOINT** - Extracts and validates system alias from URI

### Local Classes (Request Proxies)

| Class | Purpose |
|-------|---------|
| `lcl_http_request_proxy` | Handles local HTTP requests directly |
| `lcl_rfc_request_proxy_fes` | Routes requests to backend via RFC (Frontend Server) |
| `lcl_rfc_request_proxy_dbg` | Routes debugging requests via RFC |
| `lcl_rfc_request_proxy_trc` | Routes trace requests via RFC |

---

## Request Processing Flow

### Main Request Handler

```abap
METHOD if_http_extension~handle_request.
  " 1. Get appropriate request proxy based on request context
  handler_proxy = get_request_proxy( p_server = server ).
  
  " 2. Suppress default content type (ADT sets its own)
  server->response->suppress_content_type( ).
  
  " 3. Configure session state (stateful/stateless)
  configure_session_state( p_server = server ).
  
  " 4. Record request start time for performance tracking
  handler_proxy->set_start_time( time_start ).
  
  " 5. Delegate actual request handling to proxy
  handler_proxy->handle_request( ).
  
  " 6. Apply final cache control headers
  final_cache_control( p_server = server ).
ENDMETHOD.
```

### Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    HTTP Request Arrives                          │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│            1. GET_REQUEST_PROXY                                  │
│   - Check for system alias (;o=ALIAS in URI)                     │
│   - Check for debug target header                                │
│   - Check for trace flag                                         │
│   - Select appropriate proxy class                               │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│            2. CONFIGURE_SESSION_STATE                            │
│   - Read X-sap-adt-sessiontype header                            │
│   - Configure stateful or stateless mode                         │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│            3. HANDLER_PROXY->HANDLE_REQUEST                      │
│   - Route to specific ADT resource handler                       │
│   - Process CRUD operations                                      │
│   - Generate response                                            │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│            4. FINAL_CACHE_CONTROL                                │
│   - Set cache control headers                                    │
│   - Return response to client                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Request Proxy Mechanism

### Proxy Selection Logic

The `GET_REQUEST_PROXY` method determines which proxy to use based on the request context:

```abap
METHOD get_request_proxy.
  " Priority 1: Check for system alias in URI
  DATA(system_alias) = system_alias_checkpoint( p_server ).
  
  IF system_alias IS NOT INITIAL.
    " Route to frontend server RFC proxy
    result = NEW lcl_rfc_request_proxy_fes( server = p_server
                                            alias = system_alias ).
    RETURN.
  ENDIF.
  
  " Priority 2: Check for debug target
  DATA(debug_target) = get_debug_target( p_server ).
  
  IF debug_target IS NOT INITIAL.
    " Route to debugger RFC proxy
    result = NEW lcl_rfc_request_proxy_dbg( server = p_server
                                             target = debug_target ).
    RETURN.
  ENDIF.
  
  " Priority 3: Check for trace flag
  IF is_trace_request( p_server ).
    " Route to trace RFC proxy
    result = NEW lcl_rfc_request_proxy_trc( server = p_server ).
    RETURN.
  ENDIF.
  
  " Default: Local HTTP proxy
  result = NEW lcl_http_request_proxy( server = p_server ).
ENDMETHOD.
```

### Proxy Types Explained

#### 1. Local HTTP Proxy (`lcl_http_request_proxy`)

Used for standard requests processed on the current system:

- Direct handling of ADT REST API calls
- Routes to specific resource handlers based on URI path
- Handles CRUD operations for ABAP objects

#### 2. Frontend Server RFC Proxy (`lcl_rfc_request_proxy_fes`)

Used when requests need to be forwarded to a backend system:

- Activated by system alias in URI (`;o=ALIAS`)
- Forwards requests via RFC to target system
- Enables ADT Hub scenarios (one frontend, multiple backends)

#### 3. Debug RFC Proxy (`lcl_rfc_request_proxy_dbg`)

Used for debugging sessions:

- Handles debugger-specific requests
- Routes to target system where debugging is active
- Manages debug session state

#### 4. Trace RFC Proxy (`lcl_rfc_request_proxy_trc`)

Used for tracing and profiling:

- Handles trace-related requests
- Routes to systems with active traces

---

## System Alias Routing

### URI Format

ADT supports system alias routing through URI parameters:

```
/sap/bc/adt/repository/...;o=<SYSTEM_ALIAS>
```

### Alias Extraction Logic

```abap
METHOD system_alias_checkpoint.
  " Get raw URI from request
  DATA(uri) = p_server->request->get_header_field( '~request_uri' ).
  
  " Search for system alias pattern: ;o=ALIAS
  FIND REGEX ';o=([^/&;]+)' IN uri SUBMATCHES DATA(alias).
  
  IF sy-subrc = 0.
    " Validate alias exists and user has authorization
    IF is_valid_alias( alias ) AND is_authorized( alias ).
      result = alias.
    ELSE.
      " Return error response
      raise_alias_error( p_server ).
    ENDIF.
  ENDIF.
ENDMETHOD.
```

### Example Requests

| Request URI | Routing |
|-------------|---------|
| `/sap/bc/adt/programs/programs/ZTEST` | Local processing |
| `/sap/bc/adt/programs/programs/ZTEST;o=DEV100` | Route to DEV100 system |
| `/sap/bc/adt/programs/programs/ZTEST;o=QAS200` | Route to QAS200 system |

---

## Session State Management

### Session Types

ADT supports two session modes controlled by the `X-sap-adt-sessiontype` header:

| Session Type | Value | Use Case |
|--------------|-------|----------|
| Stateful | `stateful` | Long-running operations, debugging |
| Stateless | `stateless` | Standard CRUD operations |

### Configuration Logic

```abap
METHOD configure_session_state.
  DATA(session_type) = p_server->request->get_header_field( 
    co_session_type 
  ).
  
  CASE session_type.
    WHEN 'stateful'.
      " Keep session state between requests
      p_server->set_session_stateful( ).
      
    WHEN 'stateless'.
      " No state preserved, connection pooling enabled
      p_server->set_session_stateless( ).
      
    WHEN OTHERS.
      " Default behavior based on server configuration
  ENDCASE.
ENDMETHOD.
```

### Stateful Session Use Cases

- Debugging sessions (maintain debug context)
- Batch operations (transaction handling)
- Lock management (keep locks between requests)

---

## Routing Specific Operations

Once the appropriate proxy is selected, requests are routed to specific resource handlers based on the URI path. Here's how common ADT operations are mapped:

### URI to Resource Mapping

| Operation | HTTP Method | URI Pattern | Handler |
|-----------|-------------|-------------|---------|
| List objects | GET | `/sap/bc/adt/repository/...` | Repository handler |
| Read source | GET | `/sap/bc/adt/.../source/main` | Source handler |
| Update source | PUT | `/sap/bc/adt/.../source/main` | Source handler |
| Create object | POST | `/sap/bc/adt/...` | Object handler |
| Delete object | DELETE | `/sap/bc/adt/...` | Object handler |
| Activate | POST | `/sap/bc/adt/activation` | Activation handler |
| Syntax check | POST | `/sap/bc/adt/.../syntax` | Syntax handler |

### Example: Create Table Request

```
POST /sap/bc/adt/ddic/tables
Content-Type: application/vnd.sap.adt.tables.v2+xml

<table:table xmlns:table="http://www.sap.com/adt/ddic/tables">
  <table:name>ZTESTTABLE</table:name>
  <table:description>Test Table</table:description>
  ...
</table:table>
```

**Processing Flow:**

1. `CL_ADT_WB_RES_APP~HANDLE_REQUEST` receives request
2. `GET_REQUEST_PROXY` returns `lcl_http_request_proxy` (no alias)
3. Proxy parses URI path: `/sap/bc/adt/ddic/tables`
4. Routes to table resource handler
5. Handler parses XML payload
6. Creates table in DDIC
7. Returns response with created table URI

### Example: Update Source Code Request

```
PUT /sap/bc/adt/programs/programs/ZTEST/source/main
Content-Type: text/plain

REPORT ztest.
  WRITE 'Hello World'.
```

**Processing Flow:**

1. Request arrives with PUT method
2. Proxy routes to program source handler
3. Handler validates lock (ETag header)
4. Updates source code in repository
5. Returns updated ETag in response

---

## Security and Authorization

### CSRF Token Handling

ADT implements CSRF protection for modifying requests:

```abap
" Fetch CSRF token
GET /sap/bc/adt/...
X-CSRF-Token: Fetch

" Response includes token
X-CSRF-Token: <token-value>

" Use token in subsequent requests
POST /sap/bc/adt/...
X-CSRF-Token: <token-value>
```

### Authorization Checks

Each resource handler performs authorization checks:

1. **Object-level authorization** - S_DEVELOP, etc.
2. **Package authorization** - S_PACK
3. **Transport authorization** - S_TRANSPRT
4. **System alias authorization** - Custom authorization objects

### OAuth2 Support

The class implements `IF_OAUTH2_CONSUMER` for OAuth2 authentication:

```abap
METHOD if_oauth2_consumer~get_scope.
  " Return ADT OAuth2 scopes
  result = VALUE #(
    ( 'ADT' )
    ( 'ADT_ADMIN' )
  ).
ENDMETHOD.
```

---

## Summary

The `CL_ADT_WB_RES_APP` class serves as the central entry point for all ADT REST API requests. Its key responsibilities are:

1. **Request Proxy Selection** - Determines whether to process locally or route via RFC
2. **System Alias Resolution** - Enables multi-system hub architecture
3. **Session State Management** - Configures stateful/stateless operation modes
4. **Request Delegation** - Forwards to specific resource handlers

This architecture provides:

- **Flexibility** - Support for hub/spoke deployments
- **Scalability** - Stateless operation for connection pooling
- **Extensibility** - Easy addition of new resource handlers
- **Security** - Built-in CSRF protection and authorization

Understanding this architecture is essential for developing MCP servers that interact with SAP ADT APIs, as it reveals how requests are routed and what headers/parameters affect processing.

---

## References

- SAP ADT REST API Documentation
- SAP ICF (Internet Communication Framework) Documentation
- CL_ADT_WB_RES_APP Class Source Code
- IF_HTTP_EXTENSION Interface Documentation