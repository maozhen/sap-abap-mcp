# SAP ADT API Discovery Report

**Generated:** 2026-01-26T01:58:16.766Z
**Host:** ldcirsc.wdf.sap.corp
**Client:** 079

## Summary

- **Total Workspaces:** 136
- **Total Collections:** 1005

---

## Table of Contents

1. [BOPF](#bopf)
2. [UI Flexibility](#ui-flexibility)
3. [ABAP SAPUI5 Filestore](#abap-sapui5-filestore)
4. [abapGit Repositories](#abapgit-repositories)
5. [Semantic tokens for abap source code](#semantic-tokens-for-abap-source-code)
6. [Data Preview](#data-preview)
7. [Performance Trace](#performance-trace)
8. [Test CodeGeneration for CDS](#test-codegeneration-for-cds)
9. [ADT IDE Actions](#adt-ide-actions)
10. [AMDP Debugger for ADT](#amdp-debugger-for-adt)
11. [ABAP Package and Dependency Manager (APACK)](#abap-package-and-dependency-manager-apack-)
12. [Adaptation Transport Organizer (ATO)](#adaptation-transport-organizer-ato-)
13. [ABAP Profiler](#abap-profiler)
14. [Blue Bananas](#blue-bananas)
15. [Others](#others)
16. [Application Interface Framework](#application-interface-framework)
17. [Others](#others)
18. [Application Jobs](#application-jobs)
19. [Others](#others)
20. [Others](#others)
21. [Cloud Communication Management](#cloud-communication-management)
22. [Others](#others)
23. [ABAP Test Cockpit](#abap-test-cockpit)
24. [Business Configuration Management](#business-configuration-management)
25. [Others](#others)
26. [Core Data Services](#core-data-services)
27. [SAP Object Type Management](#sap-object-type-management)
28. [Business Services](#business-services)
29. [Change Document Management](#change-document-management)
30. [Code Composer](#code-composer)
31. [Others](#others)
32. [Others](#others)
33. [Others](#others)
34. [Extensibility](#extensibility)
35. [Others](#others)
36. [Others](#others)
37. [Dictionary](#dictionary)
38. [Various Demo Objects](#various-demo-objects)
39. [Others](#others)
40. [Texts](#texts)
41. [Dummy object types  (for unit tests)](#dummy-object-types-for-unit-tests-)
42. [Others](#others)
43. [Enhancements](#enhancements)
44. [Fiori User Interface](#fiori-user-interface)
45. [Form Objects](#form-objects)
46. [Namespaces in HDI container](#namespaces-in-hdi-container)
47. [Others](#others)
48. [Others](#others)
49. [Intelligent Scenario Lifecycle Management](#intelligent-scenario-lifecycle-management)
50. [Lifecycle Management](#lifecycle-management)
51. [Observability](#observability)
52. [Notes for Application Objects](#notes-for-application-objects)
53. [Number Range Management](#number-range-management)
54. [Object Type Administration](#object-type-administration)
55. [Package](#package)
56. [Extensibility](#extensibility)
57. [Services and Queries](#services-and-queries)
58. [Schema Definitions](#schema-definitions)
59. [Switch Framework](#switch-framework)
60. [Situation Handling](#situation-handling)
61. [Others](#others)
62. [Others](#others)
63. [Connectivity](#connectivity)
64. [Connectivity](#connectivity)
65. [Others](#others)
66. [Others](#others)
67. [Custom Analytical Queries](#custom-analytical-queries)
68. [ABAP CDS Dependency Graph](#abap-cds-dependency-graph)
69. [Enterprise Services](#enterprise-services)
70. [Runtime Memory Analysis](#runtime-memory-analysis)
71. [ABAP DCL Sources](#abap-dcl-sources)
72. [Annotation Pushdown](#annotation-pushdown)
73. [Annotation Pushdown: Get Meta Data Extentions](#annotation-pushdown-get-meta-data-extentions)
74. [Feed Repository](#feed-repository)
75. [Flights](#flights)
76. [External tools configuration](#external-tools-configuration)
77. [Feed Repository](#feed-repository)
78. [Reentranceticket](#reentranceticket)
79. [ADT Rest Framework Resources](#adt-rest-framework-resources)
80. [Performance Test Framework](#performance-test-framework)
81. [Client](#client)
82. [System Information](#system-information)
83. [System Landscape](#system-landscape)
84. [User](#user)
85. [VIT URI Mapping](#vit-uri-mapping)
86. [API Releases](#api-releases)
87. [ABAP Test Cockpit](#abap-test-cockpit)
88. [ABAP Unit](#abap-unit)
89. [Test Double Framework for managing db dependencies](#test-double-framework-for-managing-db-dependencies)
90. [ABAP Source Based Dictionary](#abap-source-based-dictionary)
91. [Business Logic Extensions](#business-logic-extensions)
92. [Object Classification System](#object-classification-system)
93. [Change and Transport System](#change-and-transport-system)
94. [CDS Annotation Related ADT Resource](#cds-annotation-related-adt-resource)
95. [CDS Annotation Definitions](#cds-annotation-definitions)
96. [ABAP DDL Sources](#abap-ddl-sources)
97. [CDS Metadata Extensions](#cds-metadata-extensions)
98. [CDS Aspect](#cds-aspect)
99. [CDS Type](#cds-type)
100. [Dependency Rules](#dependency-rules)
101. [Scalar Functions](#scalar-functions)
102. [Dynamic View Caches](#dynamic-view-caches)
103. [Entity Buffers](#entity-buffers)
104. [Static Cache](#static-cache)
105. [Lock Objects](#lock-objects)
106. [ABAP Dictionary Logs](#abap-dictionary-logs)
107. [ABAP Database Procedure Proxies](#abap-database-procedure-proxies)
108. [Service Definitions](#service-definitions)
109. [Type Groups](#type-groups)
110. [ABAP External Views](#abap-external-views)
111. [Dynamic Logpoints](#dynamic-logpoints)
112. [ABAP Source](#abap-source)
113. [Navigation](#navigation)
114. [Programs](#programs)
115. [Text Elements](#text-elements)
116. [Classes and Interfaces](#classes-and-interfaces)
117. [Basic Object Properties](#basic-object-properties)
118. [Deletion](#deletion)
119. [Activation](#activation)
120. [URI Fragment Mapper](#uri-fragment-mapper)
121. [Floor Plan Manager](#floor-plan-manager)
122. [Function Groups; Functions; Function Group Includes](#function-groups-functions-function-group-includes)
123. [Message Classes](#message-classes)
124. [HANA-Integration](#hana-integration)
125. [SQLM Marker](#sqlm-marker)
126. [Quickfixes](#quickfixes)
127. [Refactorings](#refactorings)
128. [Repository Information](#repository-information)
129. [Relation Explorer](#relation-explorer)
130. [Service Binding Types](#service-binding-types)
131. [Debugger](#debugger)
132. [Task handler integration](#task-handler-integration)
133. [Web Dynpro](#web-dynpro)
134. [ABAP Cross Trace](#abap-cross-trace)
135. [ABAP Language Help](#abap-language-help)
136. [Transformation](#transformation)

---

## BOPF

| Collection | Path | Categories |
|------------|------|------------|
| Business Objects | `/sap/bc/adt/bopf/businessobjects` | BusinessObjects |
| Validation | `/sap/bc/adt/bopf/businessobjects/$validation` | Validation |
| Generation | `/sap/bc/adt/bopf/businessobjects/$generation` | Generation |
| Contentassist | `/sap/bc/adt/bopf/businessobjects/$contentassist` | Contentassist |
| Class Search | `/sap/bc/adt/bopf/businessobjects/$search` | ClassSearch |
| BO Node Structure Fields | `/sap/bc/adt/bopf/businessobjects/$structurefields` | StructureFields |
| Interface constants | `/sap/bc/adt/bopf/businessobjects/$constants` | Constants |
| Synchronize Behaviour Definition | `/sap/bc/adt/bopf/businessobjects/$synchronize` | Synchronize |
| BO Migration | `/sap/bc/adt/bopf/businessobjects/$bomigration` | Migration |
| BO Migration Result | `/sap/bc/adt/bopf/businessobjects/$bomigrationresult` | MigrationResult |
| BO Migration Log | `/sap/bc/adt/bopf/businessobjects/$bomigrationlog` | MigrationLog |
| BO Migration Log Numbers | `/sap/bc/adt/bopf/businessobjects/$bomigrationlognumbers` | MigrationLogNumbers |
| BO Migration Entities SourceCode | `/sap/bc/adt/bopf/businessobjects/$bomigrationsourcecode` | MigrationSourceCode |
| BO Migration Log Numbers | `/sap/bc/adt/bopf/businessobjects/$migrationlognumber` | LogNumbers |

### Collection Details

#### Business Objects

**Path:** `/sap/bc/adt/bopf/businessobjects`

**Categories:**

- Term: `BusinessObjects`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/newAttributeBinding**
  - Template: `/sap/bc/adt/bopf/newAttributeBinding`
- **http://www.sap.com/adt/categories/businessobjects/actionExportingParameter**
  - Template: `/sap/bc/adt/bopf/actionExportingParameter`
- **http://www.sap.com/adt/categories/businessobjects/draftObject**
  - Template: `/sap/bc/adt/bopf/draftObject`
- **http://www.sap.com/adt/categories/businessobjects/nodeProperty**
  - Template: `/sap/bc/adt/bopf/nodeProperty`

**Accepted Content Types:**

- `application/vnd.sap.ap.adt.bopf.businessobjects.v4+xml`
- `application/vnd.sap.ap.adt.bopf.businessobjects.v2+xml`
- `application/vnd.sap.ap.adt.bopf.businessobjects.v3+xml`

---

#### Validation

**Path:** `/sap/bc/adt/bopf/businessobjects/$validation`

**Categories:**

- Term: `Validation`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/validation**
  - Template: `/sap/bc/adt/bopf/businessobjects/$validation{?context,objname,baseobjname,nodename,persistent,transient,entitytype,classname,datatype,paramtype,resulttype,queryName}`

---

#### Generation

**Path:** `/sap/bc/adt/bopf/businessobjects/$generation`

**Categories:**

- Term: `Generation`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/generation**
  - Template: `/sap/bc/adt/bopf/businessobjects/$generation{?context,objname,packagename,transportrequest,actioncategory,boname}`

---

#### Contentassist

**Path:** `/sap/bc/adt/bopf/businessobjects/$contentassist`

**Categories:**

- Term: `Contentassist`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/contentassist**
  - Template: `/sap/bc/adt/bopf/businessobjects/$contentassist{?context,objname}`

---

#### Class Search

**Path:** `/sap/bc/adt/bopf/businessobjects/$search`

**Categories:**

- Term: `ClassSearch`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/search**
  - Template: `/sap/bc/adt/bopf/businessobjects/$search{?query,maxResults,objectType,superClass,interface,filter,actionCategory,boName}`

---

#### BO Node Structure Fields

**Path:** `/sap/bc/adt/bopf/businessobjects/$structurefields`

**Categories:**

- Term: `StructureFields`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/structurefields**
  - Template: `/sap/bc/adt/bopf/businessobjects/$structurefields{?persistent,transient,combined,boName,nodeName}`

---

#### Interface constants

**Path:** `/sap/bc/adt/bopf/businessobjects/$constants`

**Categories:**

- Term: `Constants`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/constants**
  - Template: `/sap/bc/adt/bopf/businessobjects/$constants{?clifName}`

---

#### Synchronize Behaviour Definition

**Path:** `/sap/bc/adt/bopf/businessobjects/$synchronize`

**Categories:**

- Term: `Synchronize`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/synchronize**
  - Template: `/sap/bc/adt/bopf/businessobjects/$synchronize/{bo_name}{?corrNr}`

---

#### BO Migration

**Path:** `/sap/bc/adt/bopf/businessobjects/$bomigration`

**Categories:**

- Term: `Migration`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/bomigration**
  - Template: `/sap/bc/adt/bopf/businessobjects/$bomigration{?boName}`

---

#### BO Migration Result

**Path:** `/sap/bc/adt/bopf/businessobjects/$bomigrationresult`

**Categories:**

- Term: `MigrationResult`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/bomigrationresult**
  - Template: `/sap/bc/adt/bopf/businessobjects/$bomigrationresult{?corrNr}`

---

#### BO Migration Log

**Path:** `/sap/bc/adt/bopf/businessobjects/$bomigrationlog`

**Categories:**

- Term: `MigrationLog`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/bomigrationlog**
  - Template: `/sap/bc/adt/bopf/businessobjects/$bomigrationlog{?boName}`

---

#### BO Migration Log Numbers

**Path:** `/sap/bc/adt/bopf/businessobjects/$bomigrationlognumbers`

**Categories:**

- Term: `MigrationLogNumbers`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/bomigrationlognumbers**
  - Template: `/sap/bc/adt/bopf/businessobjects/$bomigrationlognumbers{?maxItemCount,name,description,data}`

---

#### BO Migration Entities SourceCode

**Path:** `/sap/bc/adt/bopf/businessobjects/$bomigrationsourcecode`

**Categories:**

- Term: `MigrationSourceCode`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/bomigrationsourcecode**
  - Template: `/sap/bc/adt/bopf/businessobjects/$bomigrationsourcecode{?maxItemCount,name,description,data}`

---

#### BO Migration Log Numbers

**Path:** `/sap/bc/adt/bopf/businessobjects/$migrationlognumber`

**Categories:**

- Term: `LogNumbers`
  - Scheme: `http://www.sap.com/adt/categories/businessobjects`

**Template Links:**

- **http://www.sap.com/adt/categories/businessobjects/migrationlognumber**
  - Template: `/sap/bc/adt/bopf/businessobjects/$migrationlognumber{?}`

---

## UI Flexibility

| Collection | Path | Categories |
|------------|------|------------|
| Designtime adapation deployment | `/sap/bc/adt/ui_flex_dta_folder/` | dta_folder |

### Collection Details

#### Designtime adapation deployment

**Path:** `/sap/bc/adt/ui_flex_dta_folder/`

**Categories:**

- Term: `dta_folder`
  - Scheme: `http://www.sap.com/adt/categories/ui_flex`

---

## ABAP SAPUI5 Filestore

| Collection | Path | Categories |
|------------|------|------------|
| SAPUI5 Filestore based on BSP | `/sap/bc/adt/filestore/ui5-bsp/objects` | filestore-ui5-bsp |
| SAPUI5 Runtime Version | `/sap/bc/adt/filestore/ui5-bsp/ui5-rt-version` | ui5-rt-version |
| SAPUI5 Filestore Marker for Deploy storage support | `/sap/bc/adt/filestore/ui5-bsp/deploy-storage` | ui5-deploy-storage |

### Collection Details

#### SAPUI5 Filestore based on BSP

**Path:** `/sap/bc/adt/filestore/ui5-bsp/objects`

**Categories:**

- Term: `filestore-ui5-bsp`
  - Scheme: `http://www.sap.com/adt/categories/filestore`

---

#### SAPUI5 Runtime Version

**Path:** `/sap/bc/adt/filestore/ui5-bsp/ui5-rt-version`

**Categories:**

- Term: `ui5-rt-version`
  - Scheme: `http://www.sap.com/adt/categories/filestore`

---

#### SAPUI5 Filestore Marker for Deploy storage support

**Path:** `/sap/bc/adt/filestore/ui5-bsp/deploy-storage`

**Categories:**

- Term: `ui5-deploy-storage`
  - Scheme: `http://www.sap.com/adt/categories/filestore`

---

## abapGit Repositories

| Collection | Path | Categories |
|------------|------|------------|
| Repositories | `/sap/bc/adt/abapgit/repos` | repos |
| External Repository Info | `/sap/bc/adt/abapgit/externalrepoinfo` | externalrepoinfo |

### Collection Details

#### Repositories

**Path:** `/sap/bc/adt/abapgit/repos`

**Categories:**

- Term: `repos`
  - Scheme: `http://www.sap.com/adt/categories/abapgit`

**Accepted Content Types:**

- `'application/abapgit.adt.repo.v1+xml'`
- `'application/abapgit.adt.repo.v2+xml'`
- `'application/abapgit.adt.repo.v3+xml'`
- `'application/abapgit.adt.repo.v4+xml'`

---

#### External Repository Info

**Path:** `/sap/bc/adt/abapgit/externalrepoinfo`

**Categories:**

- Term: `externalrepoinfo`
  - Scheme: `http://www.sap.com/adt/categories/abapgit`

**Accepted Content Types:**

- `application/abapgit.adt.repo.info.ext.request.v1+xml`
- `application/abapgit.adt.repo.info.ext.request.v2+xml`

---

## Semantic tokens for abap source code

| Collection | Path | Categories |
|------------|------|------------|
| Indentifier Coloring | `/sap/bc/adt/zabapsource/coloring/semantic/tokens` | semanticColoring |

### Collection Details

#### Indentifier Coloring

**Path:** `/sap/bc/adt/zabapsource/coloring/semantic/tokens`

**Categories:**

- Term: `semanticColoring`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/`

**Accepted Content Types:**

- `application/vnd.sap.adt.generic.semanticabaptokens.v2+json`
- `application/vnd.sap.adt.generic.semanticabaptokens.v1+json`

---

## Data Preview

| Collection | Path | Categories |
|------------|------|------------|
| Modelled Data Preview for DDIC | `/sap/bc/adt/datapreview/ddic` | DatapreviewDdic |
| Data Preview for CDS | `/sap/bc/adt/datapreview/cds` | DatapreviewCds |
| Freestyle Data Preview for DDIC | `/sap/bc/adt/datapreview/freestyle` | DatapreviewFreeStyle |
| Data Preview for AMDP | `/sap/bc/adt/datapreview/amdp` | DatapreviewAmdp |
| Data Preview for AMDP Debugger | `/sap/bc/adt/datapreview/amdpdebugger` | DatapreviewAmdpDebugger |

### Collection Details

#### Modelled Data Preview for DDIC

**Path:** `/sap/bc/adt/datapreview/ddic`

**Categories:**

- Term: `DatapreviewDdic`
  - Scheme: `http://www.sap.com/adt/categories/datapreview`

**Template Links:**

- **http://www.sap.com/adt/categories/datapreview/ddic/metadata**
  - Template: `/sap/bc/adt/datapreview/ddic/{object_name}/metadata`
- **http://www.sap.com/adt/categories/datapreview/ddic**
  - Template: `/sap/bc/adt/datapreview/ddic{?rowNumber,ddicEntityName}`
- **http://www.sap.com/adt/categories/datapreview/ddic/colcount**
  - Template: `/sap/bc/adt/datapreview/ddic{?rowNumber,ddicEntityName,colNumber}`
- **http://www.sap.com/adt/categories/datapreview/ddic/hana**
  - Template: `/sap/bc/adt/datapreview/ddic{?action,hanaSchemaName,hanaViewName,columnName}`
- **http://www.sap.com/adt/categories/datapreview/ddic/colmetadata**
  - Template: `/sap/bc/adt/datapreview/ddic{?action,ddicEntityName}`
- **http://www.sap.com/adt/categories/datapreview/ddic/launchfreestyle**
  - Template: `/sap/bc/adt/datapreview/ddic`

---

#### Data Preview for CDS

**Path:** `/sap/bc/adt/datapreview/cds`

**Categories:**

- Term: `DatapreviewCds`
  - Scheme: `http://www.sap.com/adt/categories/datapreview`

**Template Links:**

- **http://www.sap.com/adt/categories/datapreview/cds/metadata**
  - Template: `/sap/bc/adt/datapreview/cds/{object_name}/metadata`
- **http://www.sap.com/adt/categories/datapreview/cds**
  - Template: `/sap/bc/adt/datapreview/cds{?rowNumber,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/colmetadata**
  - Template: `/sap/bc/adt/datapreview/cds{?action,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/associationlist**
  - Template: `/sap/bc/adt/datapreview/cds{?action,cdsEntityName,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/associationnavigation**
  - Template: `/sap/bc/adt/datapreview/cds{?action,rowNumber,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/followassociation**
  - Template: `/sap/bc/adt/datapreview/cds{?action,rowNumber,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/associationrefresh**
  - Template: `/sap/bc/adt/datapreview/cds{?action,rowNumber,targetType,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/assocrefreshcamelcase**
  - Template: `/sap/bc/adt/datapreview/cds{?action,rowNumber,targetType,cdsEntityName,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/associationinopensql**
  - Template: `/sap/bc/adt/datapreview/cds{?action,rowNumber,targetType,cdsEntityName,ddlSourceName}`
- **http://www.sap.com/adt/categories/datapreview/cds/launchfreestyle**
  - Template: `/sap/bc/adt/datapreview/cds`
- **http://www.sap.com/adt/categories/datapreview/cds/enum**
  - Template: `/sap/bc/adt/datapreview/cds/enum{?cdsEntityName,parameter}`

---

#### Freestyle Data Preview for DDIC

**Path:** `/sap/bc/adt/datapreview/freestyle`

**Categories:**

- Term: `DatapreviewFreeStyle`
  - Scheme: `http://www.sap.com/adt/categories/datapreview`

**Template Links:**

- **http://www.sap.com/adt/categories/datapreview/freestyle**
  - Template: `/sap/bc/adt/datapreview/freestyle{?rowNumber}`
- **http://www.sap.com/adt/categories/datapreview/freestyle/check**
  - Template: `/sap/bc/adt/datapreview/freestyle{?action,uniqueURI}`
- **http://www.sap.com/adt/categories/datapreview/freestyle/prettyPrinter**
  - Template: `/sap/bc/adt/datapreview/freestyle{?action,uniqueURI}`

---

#### Data Preview for AMDP

**Path:** `/sap/bc/adt/datapreview/amdp`

**Categories:**

- Term: `DatapreviewAmdp`
  - Scheme: `http://www.sap.com/adt/categories/datapreview`

**Template Links:**

- **http://www.sap.com/adt/categories/datapreview/amdp/execute**
  - Template: `/sap/bc/adt/datapreview/amdp{?maxRows,uri}`
- **http://www.sap.com/adt/categories/datapreview/amdp/navigation**
  - Template: `/sap/bc/adt/datapreview/amdp/navigation/target{?uri}`

---

#### Data Preview for AMDP Debugger

**Path:** `/sap/bc/adt/datapreview/amdpdebugger`

**Categories:**

- Term: `DatapreviewAmdpDebugger`
  - Scheme: `http://www.sap.com/adt/categories/datapreview`

**Template Links:**

- **http://www.sap.com/adt/categories/datapreview/amdpdebugger**
  - Template: `/sap/bc/adt/datapreview/amdpdebugger{?rowNumber,colNumber,sessionId,debuggerId,debuggeeId,variableName,schema,provideRowId,action}`
- **http://www.sap.com/adt/categories/datapreview/amdpdebugger/cellsubstring**
  - Template: `/sap/bc/adt/datapreview/amdpdebugger/cellsubstring{?rowNumber,columnName,sessionId,debuggerId,debuggeeId,variableName,valueOffset,valueLength,schema,action}`

---

## Performance Trace

| Collection | Path | Categories |
|------------|------|------------|
| Performance Trace State | `/sap/bc/adt/st05/trace/state` | state |
| Performance Trace Drirectory | `/sap/bc/adt/st05/trace/directory` | directory |

### Collection Details

#### Performance Trace State

**Path:** `/sap/bc/adt/st05/trace/state`

**Categories:**

- Term: `state`
  - Scheme: `http://www.sap.com/adt/st05/trace`

---

#### Performance Trace Drirectory

**Path:** `/sap/bc/adt/st05/trace/directory`

**Categories:**

- Term: `directory`
  - Scheme: `http://www.sap.com/adt/st05/trace`

---

## Test CodeGeneration for CDS

| Collection | Path | Categories |
|------------|------|------------|
| Get DDL Dependency | `/sap/bc/adt/testcodegen/dependencies/doubledata` | dependencies/doubledata |
| Generate TestCode for CDS | `/sap/bc/adt/testcodegen/dependencies/doubledata` | CdsTestCodeGeneration |

### Collection Details

#### Get DDL Dependency

**Path:** `/sap/bc/adt/testcodegen/dependencies/doubledata`

**Categories:**

- Term: `dependencies/doubledata`
  - Scheme: `http://www.sap.com/adt/categories/cdstestcodegeneration`

**Template Links:**

- **http://www.sap.com/adt/categories/cdstestcodegeneration/doubledata**
  - Template: `/sap/bc/adt/testcodegen/dependencies/doubledata{?ddlsourceName}`

**Accepted Content Types:**

- `application/vnd.sap.adt.oo.cds.codgen.v1+xml`

---

#### Generate TestCode for CDS

**Path:** `/sap/bc/adt/testcodegen/dependencies/doubledata`

**Categories:**

- Term: `CdsTestCodeGeneration`
  - Scheme: `http://www.sap.com/adt/categories/cdstestcodegeneration`

---

## ADT IDE Actions

| Collection | Path | Categories |
|------------|------|------------|
| ADT IDE ACTIONS | `/sap/bc/adt/ideactions/runtime` | action |

### Collection Details

#### ADT IDE ACTIONS

**Path:** `/sap/bc/adt/ideactions/runtime`

**Categories:**

- Term: `action`
  - Scheme: `http://www.sap.com/adt/ideactions`

**Accepted Content Types:**

- `application/vnd.sap.adt.ideactions.runtime.input.v1+xml`

---

## AMDP Debugger for ADT

| Collection | Path | Categories |
|------------|------|------------|
| AMDP Debugger Main | `/sap/bc/adt/amdp/debugger/main` | amdp-debugger-main |

### Collection Details

#### AMDP Debugger Main

**Path:** `/sap/bc/adt/amdp/debugger/main`

**Categories:**

- Term: `amdp-debugger-main`
  - Scheme: `http://www.sap.com/adt/categories/amdp/debugger`

**Template Links:**

- **http://www.sap.com/adt/amdp/debugger/relations/resume**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}`
- **http://www.sap.com/adt/amdp/debugger/relations/start**
  - Template: `/sap/bc/adt/amdp/debugger/main{?stopExisting,requestUser,cascadeMode}`
- **http://www.sap.com/adt/amdp/debugger/relations/terminate**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}{?hardStop}`
- **http://www.sap.com/adt/amdp/debugger/relations/debuggee**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/debuggees/{debuggeeId}`
- **http://www.sap.com/adt/amdp/debugger/relations/vars**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/debuggees/{debuggeeId}/variables/{varname}{?offset,length}`
- **http://www.sap.com/adt/amdp/debugger/relations/setvars**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/debuggees/{debuggeeId}/variables/{varname}{?setNull}`
- **http://www.sap.com/adt/amdp/debugger/relations/lookup**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/debuggees/{debuggeeId}/lookup{?name}`
- **http://www.sap.com/adt/amdp/debugger/relations/step/over**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/debuggees/{debuggeeId}?step=over`
- **http://www.sap.com/adt/amdp/debugger/relations/step/continue**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/debuggees/{debuggeeId}?step=continue`
- **http://www.sap.com/adt/amdp/debugger/relations/breakpoints**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/breakpoints`
- **http://www.sap.com/adt/amdp/debugger/relations/breakpoints/llang**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/breakpoints`
- **http://www.sap.com/adt/amdp/debugger/relations/breakpoints/tablefunctions**
  - Template: `/sap/bc/adt/amdp/debugger/main/{mainId}/breakpoints`

**Accepted Content Types:**

- `application/vnd.sap.adt.amdp.dbg.main.v4+xml`

---

## ABAP Package and Dependency Manager (APACK)

| Collection | Path | Categories |
|------------|------|------------|
| Manifests hosted on a Git repository | `/sap/bc/adt/apack/gitmanifests` | gitmanifests |
| APACK manifests of installed repositories on this system | `/sap/bc/adt/apack/manifests` | manifests |

### Collection Details

#### Manifests hosted on a Git repository

**Path:** `/sap/bc/adt/apack/gitmanifests`

**Categories:**

- Term: `gitmanifests`
  - Scheme: `http://www.sap.com/adt/categories/apack`

**Accepted Content Types:**

- `application/apack.adt.gitmanifest.request.v1+xml`

---

#### APACK manifests of installed repositories on this system

**Path:** `/sap/bc/adt/apack/manifests`

**Categories:**

- Term: `manifests`
  - Scheme: `http://www.sap.com/adt/categories/apack`

---

## Adaptation Transport Organizer (ATO)

| Collection | Path | Categories |
|------------|------|------------|
| Settings | `/sap/bc/adt/ato/settings` | settings |
| Notifications | `/sap/bc/adt/ato/notifications` | notifications |

### Collection Details

#### Settings

**Path:** `/sap/bc/adt/ato/settings`

**Categories:**

- Term: `settings`
  - Scheme: `http://www.sap.com/adt/categories/ato`

---

#### Notifications

**Path:** `/sap/bc/adt/ato/notifications`

**Categories:**

- Term: `notifications`
  - Scheme: `http://www.sap.com/adt/categories/ato`

**Accepted Content Types:**

- `application/vnd.sap.adt.ato.notification.v1+xml`
- `application/vnd.sap.adt.ato.notification.v1+json`

---

## ABAP Profiler

| Collection | Path | Categories |
|------------|------|------------|
| Trace files | `/sap/bc/adt/runtime/traces/abaptraces` | trace-files |
| Trace parameters | `/sap/bc/adt/runtime/traces/abaptraces/parameters` | trace-parameters |
| Trace parameters for callstack aggregation | `/sap/bc/adt/runtime/traces/abaptraces/parameters` | trace-parameters-callstackaggregation |
| Trace parameters for amdp trace | `/sap/bc/adt/runtime/traces/abaptraces/parameters` | trace-parameters-amdptrace |
| Trace requests | `/sap/bc/adt/runtime/traces/abaptraces/requests` | trace-requests |
| Trace requests with uri | `/sap/bc/adt/runtime/traces/abaptraces/requests` | trace-requests-with-uri |
| List of object types | `/sap/bc/adt/runtime/traces/abaptraces/objecttypes` | object-types |
| List of process types | `/sap/bc/adt/runtime/traces/abaptraces/processtypes` | process-types |

### Collection Details

#### Trace files

**Path:** `/sap/bc/adt/runtime/traces/abaptraces`

**Categories:**

- Term: `trace-files`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### Trace parameters

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/parameters`

**Categories:**

- Term: `trace-parameters`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### Trace parameters for callstack aggregation

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/parameters`

**Categories:**

- Term: `trace-parameters-callstackaggregation`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### Trace parameters for amdp trace

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/parameters`

**Categories:**

- Term: `trace-parameters-amdptrace`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### Trace requests

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/requests`

**Categories:**

- Term: `trace-requests`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### Trace requests with uri

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/requests`

**Categories:**

- Term: `trace-requests-with-uri`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### List of object types

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/objecttypes`

**Categories:**

- Term: `object-types`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

#### List of process types

**Path:** `/sap/bc/adt/runtime/traces/abaptraces/processtypes`

**Categories:**

- Term: `process-types`
  - Scheme: `http://www.sap.com/adt/categories/runtime/traces/abaptraces`

---

## Blue Bananas

| Collection | Path | Categories |
|------------|------|------------|
| Blue Bananas | `/sap/bc/myorg/blues/bluebananas` | bluebananas |

### Collection Details

#### Blue Bananas

**Path:** `/sap/bc/myorg/blues/bluebananas`

**Categories:**

- Term: `bluebananas`
  - Scheme: `http://www.sap.com/adt/categories/myorg/blues`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| ABAP Daemon | `/sap/bc/adt/abapdaemons/applications` | dmon |
| JSON Formatter | `/sap/bc/adt/abapdaemons/applications/source/formatter` | dmon/formatter |
| Server driven framework - Schema | `/sap/bc/adt/abapdaemons/applications/$schema` | dmon/schema |
| Server driven framework - Configuration | `/sap/bc/adt/abapdaemons/applications/$configuration` | dmon/configuration |
| ABAP Daemon Name Validation | `/sap/bc/adt/abapdaemons/applications/validation` | dmon/validation |

### Collection Details

#### ABAP Daemon

**Path:** `/sap/bc/adt/abapdaemons/applications`

**Categories:**

- Term: `dmon`
  - Scheme: `http://www.sap.com/wbobj/abapdaemons`

**Template Links:**

- **http://www.sap.com/wbobj/abapdaemons/dmon/properties**
  - Template: `/sap/bc/adt/abapdaemons/applications/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/abapdaemons/dmon/source**
  - Template: `/sap/bc/adt/abapdaemons/applications/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/abapdaemons/applications/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/abapdaemons/applications/source/formatter`

**Categories:**

- Term: `dmon/formatter`
  - Scheme: `http://www.sap.com/wbobj/abapdaemons`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/abapdaemons/applications/$schema`

**Categories:**

- Term: `dmon/schema`
  - Scheme: `http://www.sap.com/wbobj/abapdaemons`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/abapdaemons/applications/$configuration`

**Categories:**

- Term: `dmon/configuration`
  - Scheme: `http://www.sap.com/wbobj/abapdaemons`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### ABAP Daemon Name Validation

**Path:** `/sap/bc/adt/abapdaemons/applications/validation`

**Categories:**

- Term: `dmon/validation`
  - Scheme: `http://www.sap.com/wbobj/abapdaemons`

---

## Application Interface Framework

| Collection | Path | Categories |
|------------|------|------------|
| Deployment Scenario | `/sap/bc/adt/aif/aifdtyp` | aifdtyp |
| JSON Formatter | `/sap/bc/adt/aif/aifdtyp/source/formatter` | aifdtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aif/aifdtyp/$schema` | aifdtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aif/aifdtyp/$configuration` | aifdtyp/configuration |
| Deployment Scenario Name Validation | `/sap/bc/adt/aif/aifdtyp/validation` | aifdtyp/validation |
| Application Interface | `/sap/bc/adt/aif/aifityp` | aifityp |
| JSON Formatter | `/sap/bc/adt/aif/aifityp/source/formatter` | aifityp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aif/aifityp/$schema` | aifityp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aif/aifityp/$configuration` | aifityp/configuration |
| Object Name Validation | `/sap/bc/adt/aif/aifityp/validation` | aifityp/validation |
| Namespace | `/sap/bc/adt/aif/aifntyp` | aifntyp |
| JSON Formatter | `/sap/bc/adt/aif/aifntyp/source/formatter` | aifntyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aif/aifntyp/$schema` | aifntyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aif/aifntyp/$configuration` | aifntyp/configuration |
| Object Name Validation | `/sap/bc/adt/aif/aifntyp/validation` | aifntyp/validation |
| Recipient | `/sap/bc/adt/aif/aifrtyp` | aifrtyp |
| JSON Formatter | `/sap/bc/adt/aif/aifrtyp/source/formatter` | aifrtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aif/aifrtyp/$schema` | aifrtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aif/aifrtyp/$configuration` | aifrtyp/configuration |
| Object Name Validation | `/sap/bc/adt/aif/aifrtyp/validation` | aifrtyp/validation |
| Check | `/sap/bc/adt/aif/check` | aifptyp |
| JSON Formatter | `/sap/bc/adt/aif/check/source/formatter` | aifptyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aif/check/$schema` | aifptyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aif/check/$configuration` | aifptyp/configuration |
| Object Name Validation | `/sap/bc/adt/aif/check/validation` | aifptyp/validation |
| Fix Value | `/sap/bc/adt/aif/fixvalue` | aifftyp |
| JSON Formatter | `/sap/bc/adt/aif/fixvalue/source/formatter` | aifftyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aif/fixvalue/$schema` | aifftyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aif/fixvalue/$configuration` | aifftyp/configuration |
| Object Name Validation | `/sap/bc/adt/aif/fixvalue/validation` | aifftyp/validation |

### Collection Details

#### Deployment Scenario

**Path:** `/sap/bc/adt/aif/aifdtyp`

**Categories:**

- Term: `aifdtyp`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Template Links:**

- **http://www.sap.com/wbobj/applicationinterfaceframework/aifdtyp/properties**
  - Template: `/sap/bc/adt/aif/aifdtyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationinterfaceframework/aifdtyp/source**
  - Template: `/sap/bc/adt/aif/aifdtyp/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aif/aifdtyp/source/formatter`

**Categories:**

- Term: `aifdtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aif/aifdtyp/$schema`

**Categories:**

- Term: `aifdtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aif/aifdtyp/$configuration`

**Categories:**

- Term: `aifdtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Deployment Scenario Name Validation

**Path:** `/sap/bc/adt/aif/aifdtyp/validation`

**Categories:**

- Term: `aifdtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

---

#### Application Interface

**Path:** `/sap/bc/adt/aif/aifityp`

**Categories:**

- Term: `aifityp`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Template Links:**

- **http://www.sap.com/wbobj/applicationinterfaceframework/aifityp/properties**
  - Template: `/sap/bc/adt/aif/aifityp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationinterfaceframework/aifityp/source**
  - Template: `/sap/bc/adt/aif/aifityp/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/aif/aifityp/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/aif/aifityp/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/aif/aifityp/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/aif/aifityp/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/aif/aifityp/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aif/aifityp/source/formatter`

**Categories:**

- Term: `aifityp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aif/aifityp/$schema`

**Categories:**

- Term: `aifityp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aif/aifityp/$configuration`

**Categories:**

- Term: `aifityp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/aif/aifityp/validation`

**Categories:**

- Term: `aifityp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

---

#### Namespace

**Path:** `/sap/bc/adt/aif/aifntyp`

**Categories:**

- Term: `aifntyp`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Template Links:**

- **http://www.sap.com/wbobj/applicationinterfaceframework/aifntyp/properties**
  - Template: `/sap/bc/adt/aif/aifntyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationinterfaceframework/aifntyp/source**
  - Template: `/sap/bc/adt/aif/aifntyp/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/aif/aifntyp/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/aif/aifntyp/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/aif/aifntyp/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/aif/aifntyp/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aif/aifntyp/source/formatter`

**Categories:**

- Term: `aifntyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aif/aifntyp/$schema`

**Categories:**

- Term: `aifntyp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aif/aifntyp/$configuration`

**Categories:**

- Term: `aifntyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/aif/aifntyp/validation`

**Categories:**

- Term: `aifntyp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

---

#### Recipient

**Path:** `/sap/bc/adt/aif/aifrtyp`

**Categories:**

- Term: `aifrtyp`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Template Links:**

- **http://www.sap.com/wbobj/applicationinterfaceframework/aifrtyp/properties**
  - Template: `/sap/bc/adt/aif/aifrtyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationinterfaceframework/aifrtyp/source**
  - Template: `/sap/bc/adt/aif/aifrtyp/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/aif/aifrtyp/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/aif/aifrtyp/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/aif/aifrtyp/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/aif/aifrtyp/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aif/aifrtyp/source/formatter`

**Categories:**

- Term: `aifrtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aif/aifrtyp/$schema`

**Categories:**

- Term: `aifrtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aif/aifrtyp/$configuration`

**Categories:**

- Term: `aifrtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/aif/aifrtyp/validation`

**Categories:**

- Term: `aifrtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

---

#### Check

**Path:** `/sap/bc/adt/aif/check`

**Categories:**

- Term: `aifptyp`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Template Links:**

- **http://www.sap.com/wbobj/applicationinterfaceframework/aifptyp/properties**
  - Template: `/sap/bc/adt/aif/check/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationinterfaceframework/aifptyp/source**
  - Template: `/sap/bc/adt/aif/check/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/aif/check/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/aif/check/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/aif/check/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/aif/check/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aif/check/source/formatter`

**Categories:**

- Term: `aifptyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aif/check/$schema`

**Categories:**

- Term: `aifptyp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aif/check/$configuration`

**Categories:**

- Term: `aifptyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/aif/check/validation`

**Categories:**

- Term: `aifptyp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

---

#### Fix Value

**Path:** `/sap/bc/adt/aif/fixvalue`

**Categories:**

- Term: `aifftyp`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Template Links:**

- **http://www.sap.com/wbobj/applicationinterfaceframework/aifftyp/properties**
  - Template: `/sap/bc/adt/aif/fixvalue/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationinterfaceframework/aifftyp/source**
  - Template: `/sap/bc/adt/aif/fixvalue/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/aif/fixvalue/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/aif/fixvalue/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/aif/fixvalue/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/aif/fixvalue/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aif/fixvalue/source/formatter`

**Categories:**

- Term: `aifftyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aif/fixvalue/$schema`

**Categories:**

- Term: `aifftyp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aif/fixvalue/$configuration`

**Categories:**

- Term: `aifftyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/aif/fixvalue/validation`

**Categories:**

- Term: `aifftyp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationinterfaceframework`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Review Booklet | `/sap/bc/adt/analytics/reviewbooklets` | rvbctyp |
| JSON Formatter | `/sap/bc/adt/analytics/reviewbooklets/source/formatter` | rvbctyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/analytics/reviewbooklets/$schema` | rvbctyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/analytics/reviewbooklets/$configuration` | rvbctyp/configuration |
| Review Booklet Name Validation | `/sap/bc/adt/analytics/reviewbooklets/validation` | rvbctyp/validation |

### Collection Details

#### Review Booklet

**Path:** `/sap/bc/adt/analytics/reviewbooklets`

**Categories:**

- Term: `rvbctyp`
  - Scheme: `http://www.sap.com/wbobj/rvbctyp`

**Template Links:**

- **http://www.sap.com/wbobj/rvbctyp/rvbctyp/properties**
  - Template: `/sap/bc/adt/analytics/reviewbooklets/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/rvbctyp/rvbctyp/source**
  - Template: `/sap/bc/adt/analytics/reviewbooklets/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/analytics/reviewbooklets/source/formatter`

**Categories:**

- Term: `rvbctyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/rvbctyp`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/analytics/reviewbooklets/$schema`

**Categories:**

- Term: `rvbctyp/schema`
  - Scheme: `http://www.sap.com/wbobj/rvbctyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/analytics/reviewbooklets/$configuration`

**Categories:**

- Term: `rvbctyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/rvbctyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Review Booklet Name Validation

**Path:** `/sap/bc/adt/analytics/reviewbooklets/validation`

**Categories:**

- Term: `rvbctyp/validation`
  - Scheme: `http://www.sap.com/wbobj/rvbctyp`

---

## Application Jobs

| Collection | Path | Categories |
|------------|------|------------|
| Application Job Catalog Entry | `/sap/bc/adt/applicationjob/catalogs` | sajc |
| JSON Formatter | `/sap/bc/adt/applicationjob/catalogs/source/formatter` | sajc/formatter |
| Server driven framework - Schema | `/sap/bc/adt/applicationjob/catalogs/$schema` | sajc/schema |
| Server driven framework - Configuration | `/sap/bc/adt/applicationjob/catalogs/$configuration` | sajc/configuration |
| Object Name Validation | `/sap/bc/adt/applicationjob/catalogs/validation` | sajc/validation |
| Application Job Template | `/sap/bc/adt/applicationjob/templates` | sajt |
| JSON Formatter | `/sap/bc/adt/applicationjob/templates/source/formatter` | sajt/formatter |
| Server driven framework - Schema | `/sap/bc/adt/applicationjob/templates/$schema` | sajt/schema |
| Server driven framework - Configuration | `/sap/bc/adt/applicationjob/templates/$configuration` | sajt/configuration |
| Object Name Validation | `/sap/bc/adt/applicationjob/templates/validation` | sajt/validation |

### Collection Details

#### Application Job Catalog Entry

**Path:** `/sap/bc/adt/applicationjob/catalogs`

**Categories:**

- Term: `sajc`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Template Links:**

- **http://www.sap.com/wbobj/applicationjobs/sajc/properties**
  - Template: `/sap/bc/adt/applicationjob/catalogs/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationjobs/sajc/source**
  - Template: `/sap/bc/adt/applicationjob/catalogs/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/applicationjob/catalogs/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/applicationjob/catalogs/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/applicationjob/catalogs/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/applicationjob/catalogs/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/applicationjob/catalogs/source/formatter`

**Categories:**

- Term: `sajc/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/applicationjob/catalogs/$schema`

**Categories:**

- Term: `sajc/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/applicationjob/catalogs/$configuration`

**Categories:**

- Term: `sajc/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/applicationjob/catalogs/validation`

**Categories:**

- Term: `sajc/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

---

#### Application Job Template

**Path:** `/sap/bc/adt/applicationjob/templates`

**Categories:**

- Term: `sajt`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Template Links:**

- **http://www.sap.com/wbobj/applicationjobs/sajt/properties**
  - Template: `/sap/bc/adt/applicationjob/templates/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationjobs/sajt/source**
  - Template: `/sap/bc/adt/applicationjob/templates/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/applicationjob/templates/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/applicationjob/templates/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/applicationjob/templates/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/applicationjob/templates/source/formatter`

**Categories:**

- Term: `sajt/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/applicationjob/templates/$schema`

**Categories:**

- Term: `sajt/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/applicationjob/templates/$configuration`

**Categories:**

- Term: `sajt/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/applicationjob/templates/validation`

**Categories:**

- Term: `sajt/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationjobs`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Application Log Object | `/sap/bc/adt/applicationlog/objects` | aplotyp |
| JSON Formatter | `/sap/bc/adt/applicationlog/objects/source/formatter` | aplotyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/applicationlog/objects/$schema` | aplotyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/applicationlog/objects/$configuration` | aplotyp/configuration |
| Application Log Object Name Validation | `/sap/bc/adt/applicationlog/objects/validation` | aplotyp/validation |

### Collection Details

#### Application Log Object

**Path:** `/sap/bc/adt/applicationlog/objects`

**Categories:**

- Term: `aplotyp`
  - Scheme: `http://www.sap.com/wbobj/applicationlogobjects`

**Template Links:**

- **http://www.sap.com/wbobj/applicationlogobjects/aplotyp/properties**
  - Template: `/sap/bc/adt/applicationlog/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/applicationlogobjects/aplotyp/source**
  - Template: `/sap/bc/adt/applicationlog/objects/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/applicationlog/objects/source/formatter`

**Categories:**

- Term: `aplotyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/applicationlogobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/applicationlog/objects/$schema`

**Categories:**

- Term: `aplotyp/schema`
  - Scheme: `http://www.sap.com/wbobj/applicationlogobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/applicationlog/objects/$configuration`

**Categories:**

- Term: `aplotyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/applicationlogobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Application Log Object Name Validation

**Path:** `/sap/bc/adt/applicationlog/objects/validation`

**Categories:**

- Term: `aplotyp/validation`
  - Scheme: `http://www.sap.com/wbobj/applicationlogobjects`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Application Object | `/sap/bc/adt/applicationobjects/objects` | apobtyp |
| JSON Formatter | `/sap/bc/adt/applicationobjects/objects/source/formatter` | apobtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/applicationobjects/objects/$schema` | apobtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/applicationobjects/objects/$configuration` | apobtyp/configuration |
| Application Object Name Validation | `/sap/bc/adt/applicationobjects/objects/validation` | apobtyp/validation |

### Collection Details

#### Application Object

**Path:** `/sap/bc/adt/applicationobjects/objects`

**Categories:**

- Term: `apobtyp`
  - Scheme: `http://www.sap.com/wbobj/apobtyp`

**Template Links:**

- **http://www.sap.com/wbobj/apobtyp/apobtyp/properties**
  - Template: `/sap/bc/adt/applicationobjects/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/apobtyp/apobtyp/source**
  - Template: `/sap/bc/adt/applicationobjects/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/applicationobjects/objects/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/applicationobjects/objects/source/formatter`

**Categories:**

- Term: `apobtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/apobtyp`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/applicationobjects/objects/$schema`

**Categories:**

- Term: `apobtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/apobtyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/applicationobjects/objects/$configuration`

**Categories:**

- Term: `apobtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/apobtyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Application Object Name Validation

**Path:** `/sap/bc/adt/applicationobjects/objects/validation`

**Categories:**

- Term: `apobtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/apobtyp`

---

## Cloud Communication Management

| Collection | Path | Categories |
|------------|------|------------|
| Communication Scenario | `/sap/bc/adt/aps/cloud/com/sco1` | sco1 |
| Allowed values for Scenario Type | `/sap/bc/adt/aps/cloud/com/sco1/scenariotype/values` | scenariotypevalues |
| PSE Value Help | `/sap/bc/adt/aps/cloud/com/sco1/pse/valueHelp` | psevalues |
| OAuth 2.0 Granttype Value Help | `/sap/bc/adt/aps/cloud/com/sco1/oAuth2Granttype/valueHelp` | oauth2granttypevalues |
| OAuth 2.0 Profile Value Help | `/sap/bc/adt/aps/cloud/com/sco1/oAuth2Profile/valueHelp` | oauth2profilevalues |
| Role Value Help | `/sap/bc/adt/aps/cloud/com/sco1/pfcgRole/valueHelp` | pfcgrolevalues |
| Inbound Service Value Help | `/sap/bc/adt/aps/cloud/com/sco1/inboundService/valueHelp` | ibsvalues |
| Inbound Service Details | `/sap/bc/adt/aps/cloud/com/sco1/inboundService/detail` | ibsdetail |
| Outbound Service Value Help | `/sap/bc/adt/aps/cloud/com/sco1/outboundService/valueHelp` | obsvalues |
| Outbound Service Details | `/sap/bc/adt/aps/cloud/com/sco1/outboundService/detail` | obsdetail |
| Allowed values for allowed instances | `/sap/bc/adt/aps/cloud/com/sco1/allowedinstances/values` | allowedInstancesValues |
| Allowed values for allowed instances in Steampunk | `/sap/bc/adt/aps/cloud/com/sco1/steampunkAllowedInst/values` | steampunkAllowedInstValues |
| Allowed values for http versions | `/sap/bc/adt/aps/cloud/com/sco1/httpversion/values` | httpversionvalues |
| Allowed values for http compression | `/sap/bc/adt/aps/cloud/com/sco1/compressrequest/values` | compressrequestvalues |
| Allowed values for IDOC partner type | `/sap/bc/adt/aps/cloud/com/sco1/partnertype/values` | partnertypevalues |
| Allowed values for IDOC output mode | `/sap/bc/adt/aps/cloud/com/sco1/outputmode/values` | outputmodevalues |
| Allowed values for IDOC port type | `/sap/bc/adt/aps/cloud/com/sco1/porttype/values` | porttypevalues |
| Allowed values for IDOC content type | `/sap/bc/adt/aps/cloud/com/sco1/contenttype/values` | contenttypevalues |
| Allowed values for inbound IDOC process code | `/sap/bc/adt/aps/cloud/com/sco1/inboundprocesscode/values` | inboundprocesscodevalues |
| Allowed values for outbound IDOC process code | `/sap/bc/adt/aps/cloud/com/sco1/outboundprocesscode/values` | outboundprocesscodevalues |
| Authorization Object Details | `/sap/bc/adt/aps/cloud/com/sco1/auth/detail` | authdetail |
| Activity Details | `/sap/bc/adt/aps/cloud/com/sco1/actvt/detail` | actvtdetail |
| Authorization Objects | `/sap/bc/adt/aps/cloud/com/sco1/auth/values` | authvalues |
| Authorization Fields | `/sap/bc/adt/aps/cloud/com/sco1/auth/fields` | authfields |
| Data Element | `/sap/bc/adt/aps/cloud/com/sco1/dataelement/values` | dataelementvalues |
| Communication Scenario Name Validation | `/sap/bc/adt/aps/cloud/com/sco1/validation` | sco1/validation |
| Inbound Service | `/sap/bc/adt/aps/cloud/com/sco2` | sco2 |
| Allowed values for Inbound Service Type | `/sap/bc/adt/aps/cloud/com/sco2/ibstype/values` | ibstypevalues |
| Inbound Service Name Validation | `/sap/bc/adt/aps/cloud/com/sco2/validation` | sco2/validation |
| Outbound Service | `/sap/bc/adt/aps/cloud/com/sco3` | sco3 |
| Allowed values for Outbound Service Type | `/sap/bc/adt/aps/cloud/com/sco3/obstype/values` | obstypevalues |
| Allowed Types for Creation of Steampunk Outbound Service | `/sap/bc/adt/aps/cloud/com/sco3/obsspcreationtype/values` | obsspcreationtypevalues |
| Allowed Values for Outbound Service Service Interface | `/sap/bc/adt/aps/cloud/com/sco3/serviceinterface/values` | serviceinterfacevalues |
| Allowed Values for Outbound Service Logical External Schema | `/sap/bc/adt/aps/cloud/com/sco3/desdschema/values` | desdschemavalues |
| Allowed Values for Outbound Service Communication Target | `/sap/bc/adt/aps/cloud/com/sco3/cota/values` | cotavalues |
| Outbound Service Name Validation | `/sap/bc/adt/aps/cloud/com/sco3/validation` | sco3/validation |
| Business Catalog | `/sap/bc/adt/aps/cloud/iam/sia1` | sia1 |
| Allowed values for Catalog Type | `/sap/bc/adt/aps/cloud/iam/sia1/catalogtype/values` | catalogtypevalues |
| Allowed values for Catalog Dependency Type | `/sap/bc/adt/aps/cloud/iam/sia1/catalogdependencytype/values` | catalogdependencytypevalues |
| Catalog Role Value Help | `/sap/bc/adt/aps/cloud/iam/sia1/catalogRole/valueHelp` | catalogrolevaluehelp |
| Restriction Type Value Help | `/sap/bc/adt/aps/cloud/iam/sia1/restrictionType/valueHelp` | catrestrictiontypevaluehelp |
| Title Value Help | `/sap/bc/adt/aps/cloud/iam/sia1/title/valueHelp` | titlevaluehelp |
| Details for Restriction Types | `/sap/bc/adt/aps/cloud/iam/sia1/restrictionType/details` | catrestrictiontypedetails |
| Allowed Business Catalogs | `/sap/bc/adt/aps/cloud/iam/sia1/businessCatalog/valueHelp` | businesscatalogvaluehelp |
| Business Catalog Name Validation | `/sap/bc/adt/aps/cloud/iam/sia1/validation` | sia1/validation |
| Restriction Type | `/sap/bc/adt/aps/cloud/iam/sia2` | sia2 |
| Allowed values for Aggregation Category | `/sap/bc/adt/aps/cloud/iam/sia2/aggregationcategory/values` | aggregationcategoryvalues |
| Allowed values for Restriction Fields | `/sap/bc/adt/aps/cloud/iam/sia2/restrictionfield/values` | restrictionfieldvalues |
| Allowed values for Auth Object Extensions | `/sap/bc/adt/aps/cloud/iam/sia2/authobjectextension/values` | authobjectextensionvalues |
| Allowed values for Restriction Type in update wizard | `/sap/bc/adt/aps/cloud/iam/sia2/restrictiontype/values` | restrictiontypevalues |
| Details for Restriction Fields | `/sap/bc/adt/aps/cloud/iam/sia2/restrictionfield/details` | restrictionfielddetails |
| Details for Authorization Object Extensions | `/sap/bc/adt/aps/cloud/iam/sia2/authobjectextension/details` | authobjectextensiondetails |
| Restriction Type Name Validation | `/sap/bc/adt/aps/cloud/iam/sia2/validation` | sia2/validation |
| Restriction Field | `/sap/bc/adt/aps/cloud/iam/sia5` | sia5 |
| Allowed Authorization Fields | `/sap/bc/adt/aps/cloud/iam/sia5/authfield/values` | authfieldvalues |
| Restriction Field Name Validation | `/sap/bc/adt/aps/cloud/iam/sia5/validation` | sia5/validation |
| IAM App | `/sap/bc/adt/aps/cloud/iam/sia6` | sia6 |
| App Types | `/sap/bc/adt/aps/cloud/iam/sia6/apptype/values` | apptypevalues |
| App Creation Types | `/sap/bc/adt/aps/cloud/iam/sia6/appcreationtype/values` | appcreationtypevalues |
| Service Types | `/sap/bc/adt/aps/cloud/iam/sia6/servicetype/values` | servicetypevalues |
| Services | `/sap/bc/adt/aps/cloud/iam/sia6/service/values` | servicevalues |
| Authorization Objects | `/sap/bc/adt/aps/cloud/iam/sia6/auth/values` | authvalues |
| Service Details | `/sap/bc/adt/aps/cloud/iam/sia6/service/detail` | servicedetail |
| Authorization Object Details | `/sap/bc/adt/aps/cloud/iam/sia6/auth/detail` | authdetail |
| Activity Details | `/sap/bc/adt/aps/cloud/iam/sia6/actvt/detail` | actvtdetail |
| Uiad Details | `/sap/bc/adt/aps/cloud/iam/sia6/uiad/detail` | uiaddetail |
| Transaction Code Details | `/sap/bc/adt/aps/cloud/iam/sia6/tcode/detail` | tcodedetail |
| Publish Locally | `/sap/bc/adt/aps/cloud/iam/sia6/publish` | publish |
| Authorization Fields | `/sap/bc/adt/aps/cloud/iam/sia6/auth/fields` | authfields |
| UI5 Applications | `/sap/bc/adt/aps/cloud/iam/sia6/ui5apps/values` | ui5appsvalues |
| Allowed Apps | `/sap/bc/adt/aps/cloud/iam/sia6/app/valueHelp` | appvaluehelp |
| Application status | `/sap/bc/adt/aps/cloud/iam/sia6/app/status` | appstatus |
| Transaction codes | `/sap/bc/adt/aps/cloud/iam/sia6/tcode/values` | tcodevalues |
| Restriction Type Value Help | `/sap/bc/adt/aps/cloud/iam/sia6/restrictionType/valueHelp` | apprestrictiontypevaluehelp |
| Restriction Type Proposal | `/sap/bc/adt/aps/cloud/iam/sia6/restrictionType/proposal` | apprestrictiontypeproposal |
| Details for Restriction Types | `/sap/bc/adt/aps/cloud/iam/sia6/restrictionType/details` | apprestrictiontypedetails |
| IAM App Name Validation | `/sap/bc/adt/aps/cloud/iam/sia6/validation` | sia6/validation |
| Busines Catalog IAM App Assignment | `/sap/bc/adt/aps/cloud/iam/sia7` | sia7 |
| Busines Catalog IAM App Assignment Name Validation | `/sap/bc/adt/aps/cloud/iam/sia7/validation` | sia7/validation |
| Business Role Template | `/sap/bc/adt/aps/cloud/iam/sia8` | sia8 |
| Allowed space ID | `/sap/bc/adt/aps/cloud/iam/sia8/fiorispaceid/valueHelp` | fiorispaceidvaluehelp |
| Business Role Template Name Validation | `/sap/bc/adt/aps/cloud/iam/sia8/validation` | sia8/validation |
| Business Role Template Catalog Assignment | `/sap/bc/adt/aps/cloud/iam/sia9` | sia9 |
| Business Role Template Catalog Assignment Name Validation | `/sap/bc/adt/aps/cloud/iam/sia9/validation` | sia9/validation |
| Business Role Templ. – Launchpad Space Templ. Assignment | `/sap/bc/adt/aps/cloud/iam/siad` | siad |
| JSON Formatter | `/sap/bc/adt/aps/cloud/iam/siad/source/formatter` | siad/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aps/cloud/iam/siad/$schema` | siad/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aps/cloud/iam/siad/$configuration` | siad/configuration |
| Business Role Templ. – Launchpad Space Templ. Assignment Name Validation | `/sap/bc/adt/aps/cloud/iam/siad/validation` | siad/validation |
| API Package | `/sap/bc/adt/aps/com/sod1` | sod1 |
| Tag Categories | `/sap/bc/adt/aps/com/sod1/tagcategory/values` | tagcategoryvalues |
| Tag Value Help | `/sap/bc/adt/aps/com/sod1/tagvaluehelp/values` | tagvaluehelpvalues |
| Type | `/sap/bc/adt/aps/com/sod1/packagetype/values` | packagetypevalues |
| Type | `/sap/bc/adt/aps/com/sod1/docuprogramobjtype/values` | docuprogramobjtypevalues |
| Api Package Value Help | `/sap/bc/adt/aps/com/sod1/sod1/values` | sod1values |
| API Package Name Validation | `/sap/bc/adt/aps/com/sod1/validation` | sod1/validation |
| API Package Assignment | `/sap/bc/adt/aps/com/sod2` | sod2 |
| Allowed TADIR Values | `/sap/bc/adt/aps/com/sod2/tadir/values` | tadirvalues |
| Allowed OData V4 Services | `/sap/bc/adt/aps/com/sod2/odatav4groupservice/values` | odatav4groupservicevalues |
| API Object Types | `/sap/bc/adt/aps/com/sod2/apiobjecttype/values` | apiobjecttypevalues |
| Consumption Bundle Types | `/sap/bc/adt/aps/com/sod2/consumptionbundletype/values` | consumptionbundletypevalues |
| Consumption Bundle Names | `/sap/bc/adt/aps/com/sod2/consumptionbundlename/values` | consumptionbundlenamevalues |
| Leading Business Object Type | `/sap/bc/adt/aps/com/sod2/leadingbusinessobjecttype/values` | leadingbusinessobjecttypevalues |
| API Package Assignment Name Validation | `/sap/bc/adt/aps/com/sod2/validation` | sod2/validation |
| Technical Object Group | `/sap/bc/adt/aps/common/sbc1` | sbc1 |
| Technical Object Group Name Validation | `/sap/bc/adt/aps/common/sbc1/validation` | sbc1/validation |
| Authorization Field | `/sap/bc/adt/aps/iam/auth` | auth |
| Allowed Data Element | `/sap/bc/adt/aps/iam/auth/dataelement/values` | dataelementvalues |
| Allowed check table | `/sap/bc/adt/aps/iam/auth/checktable/values` | checktablevalues |
| authcolsearchhelp | `/sap/bc/adt/aps/iam/auth/authcolsearchhelp` | authcolsearchhelp |
| Allowed Authorization Fields | `/sap/bc/adt/aps/iam/auth/authField/valueHelp` | authfieldvaluehelp |
| Details for Object-Field-Searchhelp | `/sap/bc/adt/aps/iam/auth/objfldsearchhelp` | objfldsearchhelp |
| Data Element allowed | `/sap/bc/adt/aps/iam/auth/authdtelallowed` | authdtelallowed |
| Authorization Field Name Validation | `/sap/bc/adt/aps/iam/auth/validation` | auth/validation |
| Authorization Default Variant | `/sap/bc/adt/aps/iam/suco` | sucotyp |
| JSON Formatter | `/sap/bc/adt/aps/iam/suco/source/formatter` | sucotyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aps/iam/suco/$schema` | sucotyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aps/iam/suco/$configuration` | sucotyp/configuration |
| Object Name Validation | `/sap/bc/adt/aps/iam/suco/validation` | sucotyp/validation |
| Authorization Default (TADIR) | `/sap/bc/adt/aps/iam/sush` | sush |
| Maintenance Mode Value Help | `/sap/bc/adt/aps/iam/sush/maintenancemode/values` | maintenancemodevalues |
| Application Type Value Help | `/sap/bc/adt/aps/iam/sush/applicationtype/values` | applicationtypevalues |
| Authorization Field Value Help | `/sap/bc/adt/aps/iam/sush/authobjectfield/values` | authobjectfieldvalues |
| Proposal Status Value Help | `/sap/bc/adt/aps/iam/sush/proposalstatus/values` | proposalstatusvalues |
| Check Indicator Value Help | `/sap/bc/adt/aps/iam/sush/checkindicator/values` | checkindicatorvalues |
| Maintenance Status Value Help | `/sap/bc/adt/aps/iam/sush/maintenancestatus/values` | maintenancestatusvalues |
| Auth Object Value Help | `/sap/bc/adt/aps/iam/sush/su22authobject/values` | su22authobjectvalues |
| Value help for auth field values | `/sap/bc/adt/aps/iam/sush/su22authfield/values` | su22authfieldvalues |
| Creatable new objects | `/sap/bc/adt/aps/iam/sush/su22newobject/values` | su22newobjectvalues |
| Value help to get hash of applications | `/sap/bc/adt/aps/iam/sush/su22hash/values` | su22hashvalues |
| details of auth objects | `/sap/bc/adt/aps/iam/sush/su22authobject/detail` | su22authobjectdetail |
| synchronize SUSH object | `/sap/bc/adt/aps/iam/sush/sush/synchronize` | sushsynchronize |
| no default values | `/sap/bc/adt/aps/iam/sush/nodefault/values` | nodefaultvalues |
| Authorization Default (TADIR) Name Validation | `/sap/bc/adt/aps/iam/sush/validation` | sush/validation |
| Authorization Default (External) | `/sap/bc/adt/aps/iam/susi` | susityp |
| JSON Formatter | `/sap/bc/adt/aps/iam/susi/source/formatter` | susityp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/aps/iam/susi/$schema` | susityp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/aps/iam/susi/$configuration` | susityp/configuration |
| Authorization Default (External) Name Validation | `/sap/bc/adt/aps/iam/susi/validation` | susityp/validation |
| Authorization Object | `/sap/bc/adt/aps/iam/suso` | suso |
| Allowed Object Class Values | `/sap/bc/adt/aps/iam/suso/objectclass/values` | objectclassvalues |
| Allowed Authorization Object Classes | `/sap/bc/adt/aps/iam/suso/objectclass/listvalues` | objectclasslist |
| Allowed Authorization Fields | `/sap/bc/adt/aps/iam/suso/authfield/values` | authfieldvalues |
| Allowed Activities | `/sap/bc/adt/aps/iam/suso/activity/values` | activityvalues |
| Details for Activities | `/sap/bc/adt/aps/iam/suso/activity/details` | activitydetails |
| Allowed Activities | `/sap/bc/adt/aps/iam/suso/activity/listvalues` | activitylist |
| Allowed SU22 trace level | `/sap/bc/adt/aps/iam/suso/su22tracelevel/values` | su22tracelevelvalues |
| Allowed Access Category Values | `/sap/bc/adt/aps/iam/suso/accesscategory/values` | accesscategoryvalues |
| Allowed Authorization Objects | `/sap/bc/adt/aps/iam/suso/authObject/valueHelp` | authobjectvaluehelp |
| Criticality | `/sap/bc/adt/aps/iam/suso/criticality/values` | criticalityvalues |
| Usage in Privileged BDEF Mode | `/sap/bc/adt/aps/iam/suso/privileged/values` | privilegedvalues |
| Usage in the OWN Authorization Context | `/sap/bc/adt/aps/iam/suso/owncontext/values` | owncontextvalues |
| Search Help | `/sap/bc/adt/aps/iam/suso/searchhelp` | searchhelp |
| Allowed SearchHelp Values | `/sap/bc/adt/aps/iam/suso/searchhelp/list` | searchhelplist |
| ABAP Language Version for package | `/sap/bc/adt/aps/iam/suso/abaplanguageversion` | abaplanguageversion |
| Basis Object | `/sap/bc/adt/aps/iam/suso/susobasisobject` | susobasisobject |
| Authorization Object Name Validation | `/sap/bc/adt/aps/iam/suso/validation` | suso/validation |

### Collection Details

#### Communication Scenario

**Path:** `/sap/bc/adt/aps/cloud/com/sco1`

**Categories:**

- Term: `sco1`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Template Links:**

- **publish**
  - Template: `/sap/bc/adt/aps/cloud/com/sco1/$publish{?name}`
  - Title: Publish Locally
- **propertysearchhelp**
  - Template: `/sap/bc/adt/aps/cloud/com/sco1/$propertysearchhelp{?communicationScenarioId,communicationScenarioInboundServiceId,communicationScenarioOutboundServiceId,communicationScenarioPropertyName}`
  - Title: PropertySearchHelp

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values for Scenario Type

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/scenariotype/values`

**Categories:**

- Term: `scenariotypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### PSE Value Help

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/pse/valueHelp`

**Categories:**

- Term: `psevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### OAuth 2.0 Granttype Value Help

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/oAuth2Granttype/valueHelp`

**Categories:**

- Term: `oauth2granttypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### OAuth 2.0 Profile Value Help

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/oAuth2Profile/valueHelp`

**Categories:**

- Term: `oauth2profilevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Role Value Help

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/pfcgRole/valueHelp`

**Categories:**

- Term: `pfcgrolevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Inbound Service Value Help

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/inboundService/valueHelp`

**Categories:**

- Term: `ibsvalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Inbound Service Details

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/inboundService/detail`

**Categories:**

- Term: `ibsdetail`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Accepted Content Types:**

- `application/vnd.sap.adt.com.ibsdetail+xml`

---

#### Outbound Service Value Help

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/outboundService/valueHelp`

**Categories:**

- Term: `obsvalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Outbound Service Details

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/outboundService/detail`

**Categories:**

- Term: `obsdetail`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Accepted Content Types:**

- `application/vnd.sap.adt.com.obsdetail+xml`

---

#### Allowed values for allowed instances

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/allowedinstances/values`

**Categories:**

- Term: `allowedInstancesValues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for allowed instances in Steampunk

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/steampunkAllowedInst/values`

**Categories:**

- Term: `steampunkAllowedInstValues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for http versions

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/httpversion/values`

**Categories:**

- Term: `httpversionvalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for http compression

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/compressrequest/values`

**Categories:**

- Term: `compressrequestvalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for IDOC partner type

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/partnertype/values`

**Categories:**

- Term: `partnertypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for IDOC output mode

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/outputmode/values`

**Categories:**

- Term: `outputmodevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for IDOC port type

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/porttype/values`

**Categories:**

- Term: `porttypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for IDOC content type

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/contenttype/values`

**Categories:**

- Term: `contenttypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for inbound IDOC process code

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/inboundprocesscode/values`

**Categories:**

- Term: `inboundprocesscodevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed values for outbound IDOC process code

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/outboundprocesscode/values`

**Categories:**

- Term: `outboundprocesscodevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Authorization Object Details

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/auth/detail`

**Categories:**

- Term: `authdetail`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.common.authdetail+xml`

---

#### Activity Details

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/actvt/detail`

**Categories:**

- Term: `actvtdetail`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.common.actvtdetail+xml`

---

#### Authorization Objects

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/auth/values`

**Categories:**

- Term: `authvalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Authorization Fields

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/auth/fields`

**Categories:**

- Term: `authfields`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Data Element

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/dataelement/values`

**Categories:**

- Term: `dataelementvalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Communication Scenario Name Validation

**Path:** `/sap/bc/adt/aps/cloud/com/sco1/validation`

**Categories:**

- Term: `sco1/validation`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Inbound Service

**Path:** `/sap/bc/adt/aps/cloud/com/sco2`

**Categories:**

- Term: `sco2`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values for Inbound Service Type

**Path:** `/sap/bc/adt/aps/cloud/com/sco2/ibstype/values`

**Categories:**

- Term: `ibstypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Inbound Service Name Validation

**Path:** `/sap/bc/adt/aps/cloud/com/sco2/validation`

**Categories:**

- Term: `sco2/validation`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Outbound Service

**Path:** `/sap/bc/adt/aps/cloud/com/sco3`

**Categories:**

- Term: `sco3`
  - Scheme: `http://www.sap.com/aps/cloud/com`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values for Outbound Service Type

**Path:** `/sap/bc/adt/aps/cloud/com/sco3/obstype/values`

**Categories:**

- Term: `obstypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed Types for Creation of Steampunk Outbound Service

**Path:** `/sap/bc/adt/aps/cloud/com/sco3/obsspcreationtype/values`

**Categories:**

- Term: `obsspcreationtypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed Values for Outbound Service Service Interface

**Path:** `/sap/bc/adt/aps/cloud/com/sco3/serviceinterface/values`

**Categories:**

- Term: `serviceinterfacevalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed Values for Outbound Service Logical External Schema

**Path:** `/sap/bc/adt/aps/cloud/com/sco3/desdschema/values`

**Categories:**

- Term: `desdschemavalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Allowed Values for Outbound Service Communication Target

**Path:** `/sap/bc/adt/aps/cloud/com/sco3/cota/values`

**Categories:**

- Term: `cotavalues`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Outbound Service Name Validation

**Path:** `/sap/bc/adt/aps/cloud/com/sco3/validation`

**Categories:**

- Term: `sco3/validation`
  - Scheme: `http://www.sap.com/aps/cloud/com`

---

#### Business Catalog

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1`

**Categories:**

- Term: `sia1`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Template Links:**

- **bucapps**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia1/$bucapps{?name}`
  - Title: Bucapps
- **publish**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia1/$publish{?name}`
  - Title: Publish Locally
- **getscope**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia1/$getScope{?name}`
  - Title: Get Scope Status

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values for Catalog Type

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/catalogtype/values`

**Categories:**

- Term: `catalogtypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Allowed values for Catalog Dependency Type

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/catalogdependencytype/values`

**Categories:**

- Term: `catalogdependencytypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Catalog Role Value Help

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/catalogRole/valueHelp`

**Categories:**

- Term: `catalogrolevaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Restriction Type Value Help

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/restrictionType/valueHelp`

**Categories:**

- Term: `catrestrictiontypevaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.common.restrictionsvh+xml`

---

#### Title Value Help

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/title/valueHelp`

**Categories:**

- Term: `titlevaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Details for Restriction Types

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/restrictionType/details`

**Categories:**

- Term: `catrestrictiontypedetails`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.common.restrictiontypedetails+xml`

---

#### Allowed Business Catalogs

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/businessCatalog/valueHelp`

**Categories:**

- Term: `businesscatalogvaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Business Catalog Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia1/validation`

**Categories:**

- Term: `sia1/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Restriction Type

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2`

**Categories:**

- Term: `sia2`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Template Links:**

- **publish**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia2/$publish{?restrictionTypeID}`
  - Title: Publish Locally

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values for Aggregation Category

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/aggregationcategory/values`

**Categories:**

- Term: `aggregationcategoryvalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Allowed values for Restriction Fields

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/restrictionfield/values`

**Categories:**

- Term: `restrictionfieldvalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Allowed values for Auth Object Extensions

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/authobjectextension/values`

**Categories:**

- Term: `authobjectextensionvalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Allowed values for Restriction Type in update wizard

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/restrictiontype/values`

**Categories:**

- Term: `restrictiontypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Details for Restriction Fields

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/restrictionfield/details`

**Categories:**

- Term: `restrictionfielddetails`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.sia2authfielddetails+xml`

---

#### Details for Authorization Object Extensions

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/authobjectextension/details`

**Categories:**

- Term: `authobjectextensiondetails`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.sia2authfielddetails+xml`

---

#### Restriction Type Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia2/validation`

**Categories:**

- Term: `sia2/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Restriction Field

**Path:** `/sap/bc/adt/aps/cloud/iam/sia5`

**Categories:**

- Term: `sia5`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Template Links:**

- **http://www.sap.com/aps/cloud/iam/sia5/properties**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia5/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed Authorization Fields

**Path:** `/sap/bc/adt/aps/cloud/iam/sia5/authfield/values`

**Categories:**

- Term: `authfieldvalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Restriction Field Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia5/validation`

**Categories:**

- Term: `sia5/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### IAM App

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6`

**Categories:**

- Term: `sia6`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### App Types

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/apptype/values`

**Categories:**

- Term: `apptypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### App Creation Types

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/appcreationtype/values`

**Categories:**

- Term: `appcreationtypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.iam.appcreationtypes+xml`

---

#### Service Types

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/servicetype/values`

**Categories:**

- Term: `servicetypevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Services

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/service/values`

**Categories:**

- Term: `servicevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Authorization Objects

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/auth/values`

**Categories:**

- Term: `authvalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Service Details

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/service/detail`

**Categories:**

- Term: `servicedetail`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.servicedetail+xml`

---

#### Authorization Object Details

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/auth/detail`

**Categories:**

- Term: `authdetail`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.common.authdetail+xml`

---

#### Activity Details

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/actvt/detail`

**Categories:**

- Term: `actvtdetail`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.common.actvtdetail+xml`

---

#### Uiad Details

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/uiad/detail`

**Categories:**

- Term: `uiaddetail`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.uiaddetail+xml`

---

#### Transaction Code Details

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/tcode/detail`

**Categories:**

- Term: `tcodedetail`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.tcodedetail+xml`

---

#### Publish Locally

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/publish`

**Categories:**

- Term: `publish`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.publishing+xml`

---

#### Authorization Fields

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/auth/fields`

**Categories:**

- Term: `authfields`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### UI5 Applications

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/ui5apps/values`

**Categories:**

- Term: `ui5appsvalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Allowed Apps

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/app/valueHelp`

**Categories:**

- Term: `appvaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Application status

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/app/status`

**Categories:**

- Term: `appstatus`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.iam.status+xml`

---

#### Transaction codes

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/tcode/values`

**Categories:**

- Term: `tcodevalues`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Restriction Type Value Help

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/restrictionType/valueHelp`

**Categories:**

- Term: `apprestrictiontypevaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.aps.common.restrictionsvh+xml`

---

#### Restriction Type Proposal

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/restrictionType/proposal`

**Categories:**

- Term: `apprestrictiontypeproposal`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.sia6.restrictiontypeproposal+xml`

---

#### Details for Restriction Types

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/restrictionType/details`

**Categories:**

- Term: `apprestrictiontypedetails`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.common.restrictiontypedetails+xml`

---

#### IAM App Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia6/validation`

**Categories:**

- Term: `sia6/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Busines Catalog IAM App Assignment

**Path:** `/sap/bc/adt/aps/cloud/iam/sia7`

**Categories:**

- Term: `sia7`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Template Links:**

- **http://www.sap.com/aps/cloud/iam/sia7/properties**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia7/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Busines Catalog IAM App Assignment Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia7/validation`

**Categories:**

- Term: `sia7/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Business Role Template

**Path:** `/sap/bc/adt/aps/cloud/iam/sia8`

**Categories:**

- Term: `sia8`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Template Links:**

- **getsia9**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia8/$getsia9{?name}`
  - Title: Business Role Template Business Catalog Assignments
- **publish**
  - Template: `/sap/bc/adt/aps/cloud/iam/sia8/$publish{?name}`
  - Title: Publish Locally

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed space ID

**Path:** `/sap/bc/adt/aps/cloud/iam/sia8/fiorispaceid/valueHelp`

**Categories:**

- Term: `fiorispaceidvaluehelp`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Business Role Template Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia8/validation`

**Categories:**

- Term: `sia8/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Business Role Template Catalog Assignment

**Path:** `/sap/bc/adt/aps/cloud/iam/sia9`

**Categories:**

- Term: `sia9`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Business Role Template Catalog Assignment Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/sia9/validation`

**Categories:**

- Term: `sia9/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### Business Role Templ. – Launchpad Space Templ. Assignment

**Path:** `/sap/bc/adt/aps/cloud/iam/siad`

**Categories:**

- Term: `siad`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Template Links:**

- **http://www.sap.com/aps/cloud/iam/siad/properties**
  - Template: `/sap/bc/adt/aps/cloud/iam/siad/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/aps/cloud/iam/siad/source**
  - Template: `/sap/bc/adt/aps/cloud/iam/siad/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/aps/cloud/iam/siad/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aps/cloud/iam/siad/source/formatter`

**Categories:**

- Term: `siad/formatter`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aps/cloud/iam/siad/$schema`

**Categories:**

- Term: `siad/schema`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aps/cloud/iam/siad/$configuration`

**Categories:**

- Term: `siad/configuration`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Business Role Templ. – Launchpad Space Templ. Assignment Name Validation

**Path:** `/sap/bc/adt/aps/cloud/iam/siad/validation`

**Categories:**

- Term: `siad/validation`
  - Scheme: `http://www.sap.com/aps/cloud/iam`

---

#### API Package

**Path:** `/sap/bc/adt/aps/com/sod1`

**Categories:**

- Term: `sod1`
  - Scheme: `http://www.sap.com/aps/oda`

**Template Links:**

- **packageassignments**
  - Template: `/sap/bc/adt/aps/com/sod1/$packageassignments{?name}`
  - Title: PackageAssignments
- **publish**
  - Template: `/sap/bc/adt/aps/com/sod1/$publish{?wbObjectType,wbObjectName}`
  - Title: Publish Locally

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Tag Categories

**Path:** `/sap/bc/adt/aps/com/sod1/tagcategory/values`

**Categories:**

- Term: `tagcategoryvalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Tag Value Help

**Path:** `/sap/bc/adt/aps/com/sod1/tagvaluehelp/values`

**Categories:**

- Term: `tagvaluehelpvalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Type

**Path:** `/sap/bc/adt/aps/com/sod1/packagetype/values`

**Categories:**

- Term: `packagetypevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Type

**Path:** `/sap/bc/adt/aps/com/sod1/docuprogramobjtype/values`

**Categories:**

- Term: `docuprogramobjtypevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Api Package Value Help

**Path:** `/sap/bc/adt/aps/com/sod1/sod1/values`

**Categories:**

- Term: `sod1values`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### API Package Name Validation

**Path:** `/sap/bc/adt/aps/com/sod1/validation`

**Categories:**

- Term: `sod1/validation`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### API Package Assignment

**Path:** `/sap/bc/adt/aps/com/sod2`

**Categories:**

- Term: `sod2`
  - Scheme: `http://www.sap.com/aps/oda`

**Template Links:**

- **apidetails**
  - Template: `/sap/bc/adt/aps/com/sod2/$apidetails{?apiWbObjectType,apiWbObjectName,apiSubWbObjectName}`
  - Title: ApiDetails
- **swaggerfile**
  - Template: `/sap/bc/adt/aps/com/sod2/$swaggerfile{?packageAssignmentId}`
  - Title: SwaggerFile
- **ordfile**
  - Template: `/sap/bc/adt/aps/com/sod2/$ordfile{?packageAssignmentId}`
  - Title: OrdFile

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed TADIR Values

**Path:** `/sap/bc/adt/aps/com/sod2/tadir/values`

**Categories:**

- Term: `tadirvalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Allowed OData V4 Services

**Path:** `/sap/bc/adt/aps/com/sod2/odatav4groupservice/values`

**Categories:**

- Term: `odatav4groupservicevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### API Object Types

**Path:** `/sap/bc/adt/aps/com/sod2/apiobjecttype/values`

**Categories:**

- Term: `apiobjecttypevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Consumption Bundle Types

**Path:** `/sap/bc/adt/aps/com/sod2/consumptionbundletype/values`

**Categories:**

- Term: `consumptionbundletypevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Consumption Bundle Names

**Path:** `/sap/bc/adt/aps/com/sod2/consumptionbundlename/values`

**Categories:**

- Term: `consumptionbundlenamevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Leading Business Object Type

**Path:** `/sap/bc/adt/aps/com/sod2/leadingbusinessobjecttype/values`

**Categories:**

- Term: `leadingbusinessobjecttypevalues`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### API Package Assignment Name Validation

**Path:** `/sap/bc/adt/aps/com/sod2/validation`

**Categories:**

- Term: `sod2/validation`
  - Scheme: `http://www.sap.com/aps/oda`

---

#### Technical Object Group

**Path:** `/sap/bc/adt/aps/common/sbc1`

**Categories:**

- Term: `sbc1`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Template Links:**

- **classifications**
  - Template: `/sap/bc/adt/aps/common/sbc1/$classifications{?name}`
  - Title: Get Classifications

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Technical Object Group Name Validation

**Path:** `/sap/bc/adt/aps/common/sbc1/validation`

**Categories:**

- Term: `sbc1/validation`
  - Scheme: `http://www.sap.com/wbobj/bct`

---

#### Authorization Field

**Path:** `/sap/bc/adt/aps/iam/auth`

**Categories:**

- Term: `auth`
  - Scheme: `http://www.sap.com/aps/iam`

**Template Links:**

- **authobjects**
  - Template: `/sap/bc/adt/aps/iam/auth/$authobjects{?name}`
  - Title: AuthObjects
- **authsearchhelp**
  - Template: `/sap/bc/adt/aps/iam/auth/$authsearchhelp{?authFieldName,authObjectName,searchHelpName}`
  - Title: AuthSearchHelp
- **syncfieldsbuffer**
  - Template: `/sap/bc/adt/aps/iam/auth/$syncfieldsbuffer{?name}`
  - Title: SyncFieldsBuffer

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed Data Element

**Path:** `/sap/bc/adt/aps/iam/auth/dataelement/values`

**Categories:**

- Term: `dataelementvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Allowed check table

**Path:** `/sap/bc/adt/aps/iam/auth/checktable/values`

**Categories:**

- Term: `checktablevalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### authcolsearchhelp

**Path:** `/sap/bc/adt/aps/iam/auth/authcolsearchhelp`

**Categories:**

- Term: `authcolsearchhelp`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.auth.authcolsearchhelp+xml`

---

#### Allowed Authorization Fields

**Path:** `/sap/bc/adt/aps/iam/auth/authField/valueHelp`

**Categories:**

- Term: `authfieldvaluehelp`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Details for Object-Field-Searchhelp

**Path:** `/sap/bc/adt/aps/iam/auth/objfldsearchhelp`

**Categories:**

- Term: `objfldsearchhelp`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.auth.objfldsearchhelp+xml`

---

#### Data Element allowed

**Path:** `/sap/bc/adt/aps/iam/auth/authdtelallowed`

**Categories:**

- Term: `authdtelallowed`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.auth.authdtelallowed+xml`

---

#### Authorization Field Name Validation

**Path:** `/sap/bc/adt/aps/iam/auth/validation`

**Categories:**

- Term: `auth/validation`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Authorization Default Variant

**Path:** `/sap/bc/adt/aps/iam/suco`

**Categories:**

- Term: `sucotyp`
  - Scheme: `http://www.sap.com/aps/iam`

**Template Links:**

- **http://www.sap.com/aps/iam/sucotyp/properties**
  - Template: `/sap/bc/adt/aps/iam/suco/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/aps/iam/sucotyp/source**
  - Template: `/sap/bc/adt/aps/iam/suco/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/aps/iam/suco/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/aps/iam/suco/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/aps/iam/suco/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/aps/iam/suco/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/aps/iam/suco/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aps/iam/suco/source/formatter`

**Categories:**

- Term: `sucotyp/formatter`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aps/iam/suco/$schema`

**Categories:**

- Term: `sucotyp/schema`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aps/iam/suco/$configuration`

**Categories:**

- Term: `sucotyp/configuration`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/aps/iam/suco/validation`

**Categories:**

- Term: `sucotyp/validation`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Authorization Default (TADIR)

**Path:** `/sap/bc/adt/aps/iam/sush`

**Categories:**

- Term: `sush`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Maintenance Mode Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/maintenancemode/values`

**Categories:**

- Term: `maintenancemodevalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Application Type Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/applicationtype/values`

**Categories:**

- Term: `applicationtypevalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Authorization Field Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/authobjectfield/values`

**Categories:**

- Term: `authobjectfieldvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Proposal Status Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/proposalstatus/values`

**Categories:**

- Term: `proposalstatusvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Check Indicator Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/checkindicator/values`

**Categories:**

- Term: `checkindicatorvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Maintenance Status Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/maintenancestatus/values`

**Categories:**

- Term: `maintenancestatusvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Auth Object Value Help

**Path:** `/sap/bc/adt/aps/iam/sush/su22authobject/values`

**Categories:**

- Term: `su22authobjectvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Value help for auth field values

**Path:** `/sap/bc/adt/aps/iam/sush/su22authfield/values`

**Categories:**

- Term: `su22authfieldvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Creatable new objects

**Path:** `/sap/bc/adt/aps/iam/sush/su22newobject/values`

**Categories:**

- Term: `su22newobjectvalues`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.sush.newobjectlist+xml`

---

#### Value help to get hash of applications

**Path:** `/sap/bc/adt/aps/iam/sush/su22hash/values`

**Categories:**

- Term: `su22hashvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### details of auth objects

**Path:** `/sap/bc/adt/aps/iam/sush/su22authobject/detail`

**Categories:**

- Term: `su22authobjectdetail`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.sush.authobjdetail+xml`

---

#### synchronize SUSH object

**Path:** `/sap/bc/adt/aps/iam/sush/sush/synchronize`

**Categories:**

- Term: `sushsynchronize`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.sush.synchronize+xml`

---

#### no default values

**Path:** `/sap/bc/adt/aps/iam/sush/nodefault/values`

**Categories:**

- Term: `nodefaultvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Authorization Default (TADIR) Name Validation

**Path:** `/sap/bc/adt/aps/iam/sush/validation`

**Categories:**

- Term: `sush/validation`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Authorization Default (External)

**Path:** `/sap/bc/adt/aps/iam/susi`

**Categories:**

- Term: `susityp`
  - Scheme: `http://www.sap.com/aps/iam`

**Template Links:**

- **http://www.sap.com/aps/iam/susityp/properties**
  - Template: `/sap/bc/adt/aps/iam/susi/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/aps/iam/susityp/source**
  - Template: `/sap/bc/adt/aps/iam/susi/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/aps/iam/susi/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/aps/iam/susi/source/formatter`

**Categories:**

- Term: `susityp/formatter`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/aps/iam/susi/$schema`

**Categories:**

- Term: `susityp/schema`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/aps/iam/susi/$configuration`

**Categories:**

- Term: `susityp/configuration`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Authorization Default (External) Name Validation

**Path:** `/sap/bc/adt/aps/iam/susi/validation`

**Categories:**

- Term: `susityp/validation`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Authorization Object

**Path:** `/sap/bc/adt/aps/iam/suso`

**Categories:**

- Term: `suso`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed Object Class Values

**Path:** `/sap/bc/adt/aps/iam/suso/objectclass/values`

**Categories:**

- Term: `objectclassvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Allowed Authorization Object Classes

**Path:** `/sap/bc/adt/aps/iam/suso/objectclass/listvalues`

**Categories:**

- Term: `objectclasslist`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.suso.objectclasslist+xml`

---

#### Allowed Authorization Fields

**Path:** `/sap/bc/adt/aps/iam/suso/authfield/values`

**Categories:**

- Term: `authfieldvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Allowed Activities

**Path:** `/sap/bc/adt/aps/iam/suso/activity/values`

**Categories:**

- Term: `activityvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Details for Activities

**Path:** `/sap/bc/adt/aps/iam/suso/activity/details`

**Categories:**

- Term: `activitydetails`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.suso.activitydetails+xml`

---

#### Allowed Activities

**Path:** `/sap/bc/adt/aps/iam/suso/activity/listvalues`

**Categories:**

- Term: `activitylist`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.suso.activitylist+xml`

---

#### Allowed SU22 trace level

**Path:** `/sap/bc/adt/aps/iam/suso/su22tracelevel/values`

**Categories:**

- Term: `su22tracelevelvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Allowed Access Category Values

**Path:** `/sap/bc/adt/aps/iam/suso/accesscategory/values`

**Categories:**

- Term: `accesscategoryvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Allowed Authorization Objects

**Path:** `/sap/bc/adt/aps/iam/suso/authObject/valueHelp`

**Categories:**

- Term: `authobjectvaluehelp`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Criticality

**Path:** `/sap/bc/adt/aps/iam/suso/criticality/values`

**Categories:**

- Term: `criticalityvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Usage in Privileged BDEF Mode

**Path:** `/sap/bc/adt/aps/iam/suso/privileged/values`

**Categories:**

- Term: `privilegedvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Usage in the OWN Authorization Context

**Path:** `/sap/bc/adt/aps/iam/suso/owncontext/values`

**Categories:**

- Term: `owncontextvalues`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### Search Help

**Path:** `/sap/bc/adt/aps/iam/suso/searchhelp`

**Categories:**

- Term: `searchhelp`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.suso.searchhelp+xml`

---

#### Allowed SearchHelp Values

**Path:** `/sap/bc/adt/aps/iam/suso/searchhelp/list`

**Categories:**

- Term: `searchhelplist`
  - Scheme: `http://www.sap.com/aps/iam`

---

#### ABAP Language Version for package

**Path:** `/sap/bc/adt/aps/iam/suso/abaplanguageversion`

**Categories:**

- Term: `abaplanguageversion`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.suso.abaplanguageversion+xml`

---

#### Basis Object

**Path:** `/sap/bc/adt/aps/iam/suso/susobasisobject`

**Categories:**

- Term: `susobasisobject`
  - Scheme: `http://www.sap.com/aps/iam`

**Accepted Content Types:**

- `application/vnd.sap.adt.suso.susobasisobject+xml`

---

#### Authorization Object Name Validation

**Path:** `/sap/bc/adt/aps/iam/suso/validation`

**Categories:**

- Term: `suso/validation`
  - Scheme: `http://www.sap.com/aps/iam`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Archiving Object | `/sap/bc/adt/archivingobjects/objects` | aobjtyp |
| JSON Formatter | `/sap/bc/adt/archivingobjects/objects/source/formatter` | aobjtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/archivingobjects/objects/$schema` | aobjtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/archivingobjects/objects/$configuration` | aobjtyp/configuration |
| Archiving Object Name Validation | `/sap/bc/adt/archivingobjects/objects/validation` | aobjtyp/validation |

### Collection Details

#### Archiving Object

**Path:** `/sap/bc/adt/archivingobjects/objects`

**Categories:**

- Term: `aobjtyp`
  - Scheme: `http://www.sap.com/wbobj/archivingobjects`

**Template Links:**

- **http://www.sap.com/wbobj/archivingobjects/aobjtyp/properties**
  - Template: `/sap/bc/adt/archivingobjects/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/archivingobjects/aobjtyp/source**
  - Template: `/sap/bc/adt/archivingobjects/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/archivingobjects/objects/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/archivingobjects/objects/source/formatter`

**Categories:**

- Term: `aobjtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/archivingobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/archivingobjects/objects/$schema`

**Categories:**

- Term: `aobjtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/archivingobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/archivingobjects/objects/$configuration`

**Categories:**

- Term: `aobjtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/archivingobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Archiving Object Name Validation

**Path:** `/sap/bc/adt/archivingobjects/objects/validation`

**Categories:**

- Term: `aobjtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/archivingobjects`

---

## ABAP Test Cockpit

| Collection | Path | Categories |
|------------|------|------------|
| ATC Check Category | `/sap/bc/adt/atc/checkcategories` | chkctyp |
| ATC Check Category Name Validation | `/sap/bc/adt/atc/checkcategories/validation` | chkctyp/validation |
| Exemption | `/sap/bc/adt/atc/checkexemptions` | chketyp |
| Exemption Name Validation | `/sap/bc/adt/atc/checkexemptions/validation` | chketyp/validation |
| ATC Check | `/sap/bc/adt/atc/checks` | chkotyp |
| ATC Check Name Validation | `/sap/bc/adt/atc/checks/validation` | chkotyp/validation |
| ATC Check Variant | `/sap/bc/adt/atc/checkvariants` | chkvtyp |
| CHKV Templates | `/sap/bc/adt/atc/checkvariants/codecompletion/templates` | chkvtyp/codecompletion |
| ATC Check Variant Name Validation | `/sap/bc/adt/atc/checkvariants/validation` | chkvtyp/validation |

### Collection Details

#### ATC Check Category

**Path:** `/sap/bc/adt/atc/checkcategories`

**Categories:**

- Term: `chkctyp`
  - Scheme: `http://www.sap.com/wbobj/atc`

**Template Links:**

- **http://www.sap.com/wbobj/atc/chkctyp/properties**
  - Template: `/sap/bc/adt/atc/checkcategories/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.chkcv1+xml`
- `text/html`

---

#### ATC Check Category Name Validation

**Path:** `/sap/bc/adt/atc/checkcategories/validation`

**Categories:**

- Term: `chkctyp/validation`
  - Scheme: `http://www.sap.com/wbobj/atc`

---

#### Exemption

**Path:** `/sap/bc/adt/atc/checkexemptions`

**Categories:**

- Term: `chketyp`
  - Scheme: `http://www.sap.com/wbobj/atc`

**Template Links:**

- **http://www.sap.com/wbobj/atc/chketyp/properties**
  - Template: `/sap/bc/adt/atc/checkexemptions/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.chkev2+xml`
- `text/html`

---

#### Exemption Name Validation

**Path:** `/sap/bc/adt/atc/checkexemptions/validation`

**Categories:**

- Term: `chketyp/validation`
  - Scheme: `http://www.sap.com/wbobj/atc`

---

#### ATC Check

**Path:** `/sap/bc/adt/atc/checks`

**Categories:**

- Term: `chkotyp`
  - Scheme: `http://www.sap.com/wbobj/atc`

**Template Links:**

- **http://www.sap.com/wbobj/atc/chkotyp/properties**
  - Template: `/sap/bc/adt/atc/checks/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **chkotyp/parameter**
  - Template: `/sap/bc/adt/atc/checks/parameter{?checkname,chkoname}`
  - Title: CHKO Parameter
- **chkotyp/remoteenabled**
  - Template: `/sap/bc/adt/atc/checks/remoteenabled{?checkname}`
  - Title: CHKO remote enabled

**Accepted Content Types:**

- `application/vnd.sap.adt.chkov1+xml`
- `text/html`

---

#### ATC Check Name Validation

**Path:** `/sap/bc/adt/atc/checks/validation`

**Categories:**

- Term: `chkotyp/validation`
  - Scheme: `http://www.sap.com/wbobj/atc`

---

#### ATC Check Variant

**Path:** `/sap/bc/adt/atc/checkvariants`

**Categories:**

- Term: `chkvtyp`
  - Scheme: `http://www.sap.com/wbobj/atc`

**Template Links:**

- **http://www.sap.com/wbobj/atc/chkvtyp/properties**
  - Template: `/sap/bc/adt/atc/checkvariants/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **chkvtyp/formtemplate**
  - Template: `/sap/bc/adt/atc/checkvariants/formtemplate{?chkvName,version}`
  - Type: `application/vnd.sap.adt.chkvformtemplate+xml`
  - Title: CHKV Formtemplate
- **chkvtyp/checkschema**
  - Template: `/sap/bc/adt/atc/checkvariants/schema{?chkoName}`
  - Type: `schema`
  - Title: CHKV CHeck Schema

**Accepted Content Types:**

- `application/vnd.sap.adt.chkvv4+xml`
- `text/html`

---

#### CHKV Templates

**Path:** `/sap/bc/adt/atc/checkvariants/codecompletion/templates`

**Categories:**

- Term: `chkvtyp/codecompletion`
  - Scheme: `http://www.sap.com/wbobj/atc`

---

#### ATC Check Variant Name Validation

**Path:** `/sap/bc/adt/atc/checkvariants/validation`

**Categories:**

- Term: `chkvtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/atc`

---

## Business Configuration Management

| Collection | Path | Categories |
|------------|------|------------|
| Business Configuration Set | `/sap/bc/adt/bct/scp1bcs` | scp1bcs |
| JSON Formatter | `/sap/bc/adt/bct/scp1bcs/source/formatter` | scp1bcs/formatter |
| Server driven framework - Schema | `/sap/bc/adt/bct/scp1bcs/$schema` | scp1bcs/schema |
| Server driven framework - Configuration | `/sap/bc/adt/bct/scp1bcs/$configuration` | scp1bcs/configuration |
| Business Configuration Set Name Validation | `/sap/bc/adt/bct/scp1bcs/validation` | scp1bcs/validation |
| Business Configuration Maintenance Object | `/sap/bc/adt/bct/smbctyp` | smbctyp |
| JSON Formatter | `/sap/bc/adt/bct/smbctyp/source/formatter` | smbctyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/bct/smbctyp/$schema` | smbctyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/bct/smbctyp/$configuration` | smbctyp/configuration |
| Business Configuration Maintenance Object Name Validation | `/sap/bc/adt/bct/smbctyp/validation` | smbctyp/validation |

### Collection Details

#### Business Configuration Set

**Path:** `/sap/bc/adt/bct/scp1bcs`

**Categories:**

- Term: `scp1bcs`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Template Links:**

- **http://www.sap.com/wbobj/bct/scp1bcs/properties**
  - Template: `/sap/bc/adt/bct/scp1bcs/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/bct/scp1bcs/source**
  - Template: `/sap/bc/adt/bct/scp1bcs/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/bct/scp1bcs/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/bct/scp1bcs/source/formatter`

**Categories:**

- Term: `scp1bcs/formatter`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/bct/scp1bcs/$schema`

**Categories:**

- Term: `scp1bcs/schema`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/bct/scp1bcs/$configuration`

**Categories:**

- Term: `scp1bcs/configuration`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Business Configuration Set Name Validation

**Path:** `/sap/bc/adt/bct/scp1bcs/validation`

**Categories:**

- Term: `scp1bcs/validation`
  - Scheme: `http://www.sap.com/wbobj/bct`

---

#### Business Configuration Maintenance Object

**Path:** `/sap/bc/adt/bct/smbctyp`

**Categories:**

- Term: `smbctyp`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Template Links:**

- **http://www.sap.com/wbobj/bct/smbctyp/properties**
  - Template: `/sap/bc/adt/bct/smbctyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/bct/smbctyp/source**
  - Template: `/sap/bc/adt/bct/smbctyp/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/bct/smbctyp/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/bct/smbctyp/source/formatter`

**Categories:**

- Term: `smbctyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/bct/smbctyp/$schema`

**Categories:**

- Term: `smbctyp/schema`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/bct/smbctyp/$configuration`

**Categories:**

- Term: `smbctyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/bct`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Business Configuration Maintenance Object Name Validation

**Path:** `/sap/bc/adt/bct/smbctyp/validation`

**Categories:**

- Term: `smbctyp/validation`
  - Scheme: `http://www.sap.com/wbobj/bct`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Background Processing Context | `/sap/bc/adt/bgqc/bgprocessingcontexts` | bgqctyp |
| JSON Formatter | `/sap/bc/adt/bgqc/bgprocessingcontexts/source/formatter` | bgqctyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/bgqc/bgprocessingcontexts/$schema` | bgqctyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/bgqc/bgprocessingcontexts/$configuration` | bgqctyp/configuration |
| Background Processing Context Name Validation | `/sap/bc/adt/bgqc/bgprocessingcontexts/validation` | bgqctyp/validation |

### Collection Details

#### Background Processing Context

**Path:** `/sap/bc/adt/bgqc/bgprocessingcontexts`

**Categories:**

- Term: `bgqctyp`
  - Scheme: `http://www.sap.com/wbobj/bgqcbgprocessingcontexts`

**Template Links:**

- **http://www.sap.com/wbobj/bgqcbgprocessingcontexts/bgqctyp/properties**
  - Template: `/sap/bc/adt/bgqc/bgprocessingcontexts/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/bgqcbgprocessingcontexts/bgqctyp/source**
  - Template: `/sap/bc/adt/bgqc/bgprocessingcontexts/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/bgqc/bgprocessingcontexts/source/formatter`

**Categories:**

- Term: `bgqctyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/bgqcbgprocessingcontexts`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/bgqc/bgprocessingcontexts/$schema`

**Categories:**

- Term: `bgqctyp/schema`
  - Scheme: `http://www.sap.com/wbobj/bgqcbgprocessingcontexts`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/bgqc/bgprocessingcontexts/$configuration`

**Categories:**

- Term: `bgqctyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/bgqcbgprocessingcontexts`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Background Processing Context Name Validation

**Path:** `/sap/bc/adt/bgqc/bgprocessingcontexts/validation`

**Categories:**

- Term: `bgqctyp/validation`
  - Scheme: `http://www.sap.com/wbobj/bgqcbgprocessingcontexts`

---

## Core Data Services

| Collection | Path | Categories |
|------------|------|------------|
| Behavior Definition | `/sap/bc/adt/bo/behaviordefinitions` | bdef |
| Behavior Definition Parser Info | `/sap/bc/adt/bo/behaviordefinitions/parser/info` | bdef/parserinfo |
| Source Formatter | `/sap/bc/adt/bo/behaviordefinitions/source/formatter` | bdef/formatter |
| Behavior Definition Validation | `/sap/bc/adt/bo/behaviordefinitions/validation` | bdef/validation |

### Collection Details

#### Behavior Definition

**Path:** `/sap/bc/adt/bo/behaviordefinitions`

**Categories:**

- Term: `bdef`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/adt/categories/bdef/codecompletion**
  - Template: `/sap/bc/adt/bo/behaviordefinitions/codecompletion/proposals{?uri}`
  - Title: Code Completion
- **http://www.sap.com/adt/categories/bdef/elementinfo**
  - Template: `/sap/bc/adt/bo/behaviordefinitions/codecompletion/elementinfo{?uri*,path*,type*}`
  - Title: Element Information
- **http://www.sap.com/adt/relations/docu/bdef/langu**
  - Template: `/sap/bc/adt/bo/behaviordefinitions/docu/langu{?uri*,searchWord*}`
  - Type: `text/plain`
  - Title: Language Documentation
- **http://www.sap.com/adt/categories/bdef/implementationtypevalues**
  - Template: `/sap/bc/adt/bo/behaviordefinitions/implementationtypevalues{?name}`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Implementation Type Values
- **http://www.sap.com/adt/categories/bdef/interfaces**
  - Template: `/sap/bc/adt/bo/behaviordefinitions/interfaces{?name}`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Interfaces for a given BDEF
- **http://www.sap.com/adt/categories/bdef/extensions**
  - Template: `/sap/bc/adt/bo/behaviordefinitions{?extended}`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Create Extension

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Behavior Definition Parser Info

**Path:** `/sap/bc/adt/bo/behaviordefinitions/parser/info`

**Categories:**

- Term: `bdef/parserinfo`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.bdef.parserinfo.v1+xml`

---

#### Source Formatter

**Path:** `/sap/bc/adt/bo/behaviordefinitions/source/formatter`

**Categories:**

- Term: `bdef/formatter`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `text/plain`

---

#### Behavior Definition Validation

**Path:** `/sap/bc/adt/bo/behaviordefinitions/validation`

**Categories:**

- Term: `bdef/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

## SAP Object Type Management

| Collection | Path | Categories |
|------------|------|------------|
| SAP Object Node Type | `/sap/bc/adt/businessobjects/nontnot` | nontnot |
| JSON Formatter | `/sap/bc/adt/businessobjects/nontnot/source/formatter` | nontnot/formatter |
| Server driven framework - Schema | `/sap/bc/adt/businessobjects/nontnot/$schema` | nontnot/schema |
| Server driven framework - Configuration | `/sap/bc/adt/businessobjects/nontnot/$configuration` | nontnot/configuration |
| Object Name Validation | `/sap/bc/adt/businessobjects/nontnot/validation` | nontnot/validation |
| SAP Object Type | `/sap/bc/adt/businessobjects/rontrot` | rontrot |
| JSON Formatter | `/sap/bc/adt/businessobjects/rontrot/source/formatter` | rontrot/formatter |
| Server driven framework - Schema | `/sap/bc/adt/businessobjects/rontrot/$schema` | rontrot/schema |
| Server driven framework - Configuration | `/sap/bc/adt/businessobjects/rontrot/$configuration` | rontrot/configuration |
| Object Name Validation | `/sap/bc/adt/businessobjects/rontrot/validation` | rontrot/validation |

### Collection Details

#### SAP Object Node Type

**Path:** `/sap/bc/adt/businessobjects/nontnot`

**Categories:**

- Term: `nontnot`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Template Links:**

- **http://www.sap.com/wbobj/rapbl/nontnot/properties**
  - Template: `/sap/bc/adt/businessobjects/nontnot/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/rapbl/nontnot/source**
  - Template: `/sap/bc/adt/businessobjects/nontnot/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/businessobjects/nontnot/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/businessobjects/nontnot/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/businessobjects/nontnot/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/businessobjects/nontnot/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/businessobjects/nontnot/source/formatter`

**Categories:**

- Term: `nontnot/formatter`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/businessobjects/nontnot/$schema`

**Categories:**

- Term: `nontnot/schema`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/businessobjects/nontnot/$configuration`

**Categories:**

- Term: `nontnot/configuration`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/businessobjects/nontnot/validation`

**Categories:**

- Term: `nontnot/validation`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

---

#### SAP Object Type

**Path:** `/sap/bc/adt/businessobjects/rontrot`

**Categories:**

- Term: `rontrot`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Template Links:**

- **http://www.sap.com/wbobj/rapbl/rontrot/properties**
  - Template: `/sap/bc/adt/businessobjects/rontrot/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/rapbl/rontrot/source**
  - Template: `/sap/bc/adt/businessobjects/rontrot/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/businessobjects/rontrot/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/businessobjects/rontrot/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/businessobjects/rontrot/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/businessobjects/rontrot/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/businessobjects/rontrot/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/businessobjects/rontrot/source/formatter`

**Categories:**

- Term: `rontrot/formatter`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/businessobjects/rontrot/$schema`

**Categories:**

- Term: `rontrot/schema`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/businessobjects/rontrot/$configuration`

**Categories:**

- Term: `rontrot/configuration`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/businessobjects/rontrot/validation`

**Categories:**

- Term: `rontrot/validation`
  - Scheme: `http://www.sap.com/wbobj/rapbl`

---

## Business Services

| Collection | Path | Categories |
|------------|------|------------|
| Service Binding | `/sap/bc/adt/businessservices/bindings` | srvb |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/bindingtypes` | bindingtypes |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/validate/servicedefinition` | validate/servicedefinition |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/validation` | srvb/validation |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/bindingtypes/ina1` | bindingtypes/ina1 |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/bindingtypes/sql1` | bindingtypes/sql1 |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/uiconfig` | srvb/uiconfig |
| (Untitled) | `/sap/bc/adt/businessservices/bindings/schema` | srvb/schema |
| Service Consumption Model | `/sap/bc/adt/businessservices/consmodels` | srvc |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/getmapping` | getmapping |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/validatemapping` | validatemapping |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/codesample` | codesample |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/consumers` | consumers |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/validatewsdl` | validatewsdl |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/validaterfc` | validaterfc |
| (Untitled) | `/sap/bc/adt/businessservices/consmodels/consdata/validate` | consdata/validate |
| Service Consumption Model Name Validation | `/sap/bc/adt/businessservices/consmodels/validation` | srvc/validation |
| Event Consumption Model | `/sap/bc/adt/businessservices/eeecevc` | eeecevc |
| JSON Formatter | `/sap/bc/adt/businessservices/eeecevc/source/formatter` | eeecevc/formatter |
| Server driven framework - Schema | `/sap/bc/adt/businessservices/eeecevc/$schema` | eeecevc/schema |
| Server driven framework - Configuration | `/sap/bc/adt/businessservices/eeecevc/$configuration` | eeecevc/configuration |
| Object Name Validation | `/sap/bc/adt/businessservices/eeecevc/validation` | eeecevc/validation |
| (Untitled) | `/sap/bc/adt/businessservices/eeecevc/previewobjects` | previewobjects |
| (Untitled) | `/sap/bc/adt/businessservices/eeecevc/generate` | generate |
| Event Binding | `/sap/bc/adt/businessservices/evtbevb` | evtbevb |
| JSON Formatter | `/sap/bc/adt/businessservices/evtbevb/source/formatter` | evtbevb/formatter |
| Server driven framework - Schema | `/sap/bc/adt/businessservices/evtbevb/$schema` | evtbevb/schema |
| Server driven framework - Configuration | `/sap/bc/adt/businessservices/evtbevb/$configuration` | evtbevb/configuration |
| Event Binding Name Validation | `/sap/bc/adt/businessservices/evtbevb/validation` | evtbevb/validation |
| Event Object | `/sap/bc/adt/businessservices/evtoevo` | evtoevo |
| JSON Formatter | `/sap/bc/adt/businessservices/evtoevo/source/formatter` | evtoevo/formatter |
| Server driven framework - Schema | `/sap/bc/adt/businessservices/evtoevo/$schema` | evtoevo/schema |
| Server driven framework - Configuration | `/sap/bc/adt/businessservices/evtoevo/$configuration` | evtoevo/configuration |
| Object Name Validation | `/sap/bc/adt/businessservices/evtoevo/validation` | evtoevo/validation |
| SOAP Provider Model | `/sap/bc/adt/businessservices/servprovs` | sprvtyp |
| JSON Formatter | `/sap/bc/adt/businessservices/servprovs/source/formatter` | sprvtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/businessservices/servprovs/$schema` | sprvtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/businessservices/servprovs/$configuration` | sprvtyp/configuration |
| Object Name Validation | `/sap/bc/adt/businessservices/servprovs/validation` | sprvtyp/validation |

### Collection Details

#### Service Binding

**Path:** `/sap/bc/adt/businessservices/bindings`

**Categories:**

- Term: `srvb`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/categories/servicebindings/validations**
  - Template: `/sap/bc/adt/businessservices/bindings/validation{?objname,description,serviceBindingVersion,serviceDefinition,package}`
  - Title: Service Binding Validation
- **http://www.sap.com/adt/businessservices/servicebinding/bindingtypes/uiconfig**
  - Template: `/sap/bc/adt/businessservices/bindings/uiconfig/{bindtype}{?bindtypeversion}`
  - Title: Service Binding UIConfig
- **http://www.sap.com/adt/businessservices/servicebinding/bindingtypes/schema**
  - Template: `/sap/bc/adt/businessservices/bindings/schema/{bindtype}{?bindtypeversion}`
  - Title: Service Binding Schema

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.servicebinding.v2+xml`
- `text/html`
- `application/json`
- `text/plain`

---

#### /sap/bc/adt/businessservices/bindings/bindingtypes

**Path:** `/sap/bc/adt/businessservices/bindings/bindingtypes`

**Categories:**

- Term: `bindingtypes`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/bindings/validate/servicedefinition

**Path:** `/sap/bc/adt/businessservices/bindings/validate/servicedefinition`

**Categories:**

- Term: `validate/servicedefinition`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/bindings/validation

**Path:** `/sap/bc/adt/businessservices/bindings/validation`

**Categories:**

- Term: `srvb/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/bindings/bindingtypes/ina1

**Path:** `/sap/bc/adt/businessservices/bindings/bindingtypes/ina1`

**Categories:**

- Term: `bindingtypes/ina1`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.ina.v1+xml`

---

#### /sap/bc/adt/businessservices/bindings/bindingtypes/sql1

**Path:** `/sap/bc/adt/businessservices/bindings/bindingtypes/sql1`

**Categories:**

- Term: `bindingtypes/sql1`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.sql.v1+xml`

---

#### /sap/bc/adt/businessservices/bindings/uiconfig

**Path:** `/sap/bc/adt/businessservices/bindings/uiconfig`

**Categories:**

- Term: `srvb/uiconfig`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.uiconfig.v1+json`

---

#### /sap/bc/adt/businessservices/bindings/schema

**Path:** `/sap/bc/adt/businessservices/bindings/schema`

**Categories:**

- Term: `srvb/schema`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.schema.v1+json`

---

#### Service Consumption Model

**Path:** `/sap/bc/adt/businessservices/consmodels`

**Categories:**

- Term: `srvc`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/wbobj/raps/srvc/properties**
  - Template: `/sap/bc/adt/businessservices/consmodels/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/adt/businessservices/consmodels/filecontent**
  - Template: `/sap/bc/adt/businessservices/consmodels/{srvcname}/filecontent{?version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.serviceconsumptionmodel.v6+xml`
- `text/html`
- `application/json`
- `text/plain`

---

#### /sap/bc/adt/businessservices/consmodels/getmapping

**Path:** `/sap/bc/adt/businessservices/consmodels/getmapping`

**Categories:**

- Term: `getmapping`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/consmodels/validatemapping

**Path:** `/sap/bc/adt/businessservices/consmodels/validatemapping`

**Categories:**

- Term: `validatemapping`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/consmodels/codesample

**Path:** `/sap/bc/adt/businessservices/consmodels/codesample`

**Categories:**

- Term: `codesample`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/consmodels/consumers

**Path:** `/sap/bc/adt/businessservices/consmodels/consumers`

**Categories:**

- Term: `consumers`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/consmodels/validatewsdl

**Path:** `/sap/bc/adt/businessservices/consmodels/validatewsdl`

**Categories:**

- Term: `validatewsdl`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/consmodels/validaterfc

**Path:** `/sap/bc/adt/businessservices/consmodels/validaterfc`

**Categories:**

- Term: `validaterfc`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### /sap/bc/adt/businessservices/consmodels/consdata/validate

**Path:** `/sap/bc/adt/businessservices/consmodels/consdata/validate`

**Categories:**

- Term: `consdata/validate`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### Service Consumption Model Name Validation

**Path:** `/sap/bc/adt/businessservices/consmodels/validation`

**Categories:**

- Term: `srvc/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### Event Consumption Model

**Path:** `/sap/bc/adt/businessservices/eeecevc`

**Categories:**

- Term: `eeecevc`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

**Template Links:**

- **http://www.sap.com/wbobj/eventconsumptionmodel/eeecevc/properties**
  - Template: `/sap/bc/adt/businessservices/eeecevc/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/eventconsumptionmodel/eeecevc/source**
  - Template: `/sap/bc/adt/businessservices/eeecevc/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/businessservices/eeecevc/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/businessservices/eeecevc/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/businessservices/eeecevc/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/businessservices/eeecevc/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/businessservices/eeecevc/source/formatter`

**Categories:**

- Term: `eeecevc/formatter`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/businessservices/eeecevc/$schema`

**Categories:**

- Term: `eeecevc/schema`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/businessservices/eeecevc/$configuration`

**Categories:**

- Term: `eeecevc/configuration`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/businessservices/eeecevc/validation`

**Categories:**

- Term: `eeecevc/validation`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

---

#### /sap/bc/adt/businessservices/eeecevc/previewobjects

**Path:** `/sap/bc/adt/businessservices/eeecevc/previewobjects`

**Categories:**

- Term: `previewobjects`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

---

#### /sap/bc/adt/businessservices/eeecevc/generate

**Path:** `/sap/bc/adt/businessservices/eeecevc/generate`

**Categories:**

- Term: `generate`
  - Scheme: `http://www.sap.com/wbobj/eventconsumptionmodel`

---

#### Event Binding

**Path:** `/sap/bc/adt/businessservices/evtbevb`

**Categories:**

- Term: `evtbevb`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/wbobj/raps/evtbevb/properties**
  - Template: `/sap/bc/adt/businessservices/evtbevb/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/raps/evtbevb/source**
  - Template: `/sap/bc/adt/businessservices/evtbevb/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/businessservices/evtbevb/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/businessservices/evtbevb/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/businessservices/evtbevb/source/formatter`

**Categories:**

- Term: `evtbevb/formatter`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/businessservices/evtbevb/$schema`

**Categories:**

- Term: `evtbevb/schema`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/businessservices/evtbevb/$configuration`

**Categories:**

- Term: `evtbevb/configuration`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Event Binding Name Validation

**Path:** `/sap/bc/adt/businessservices/evtbevb/validation`

**Categories:**

- Term: `evtbevb/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### Event Object

**Path:** `/sap/bc/adt/businessservices/evtoevo`

**Categories:**

- Term: `evtoevo`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/wbobj/raps/evtoevo/properties**
  - Template: `/sap/bc/adt/businessservices/evtoevo/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/raps/evtoevo/source**
  - Template: `/sap/bc/adt/businessservices/evtoevo/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/businessservices/evtoevo/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/businessservices/evtoevo/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/businessservices/evtoevo/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/businessservices/evtoevo/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/businessservices/evtoevo/source/formatter`

**Categories:**

- Term: `evtoevo/formatter`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/businessservices/evtoevo/$schema`

**Categories:**

- Term: `evtoevo/schema`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/businessservices/evtoevo/$configuration`

**Categories:**

- Term: `evtoevo/configuration`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/businessservices/evtoevo/validation`

**Categories:**

- Term: `evtoevo/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### SOAP Provider Model

**Path:** `/sap/bc/adt/businessservices/servprovs`

**Categories:**

- Term: `sprvtyp`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/wbobj/raps/sprvtyp/properties**
  - Template: `/sap/bc/adt/businessservices/servprovs/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/raps/sprvtyp/source**
  - Template: `/sap/bc/adt/businessservices/servprovs/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/businessservices/servprovs/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/businessservices/servprovs/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/businessservices/servprovs/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/businessservices/servprovs/source/formatter`

**Categories:**

- Term: `sprvtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/businessservices/servprovs/$schema`

**Categories:**

- Term: `sprvtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/businessservices/servprovs/$configuration`

**Categories:**

- Term: `sprvtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/businessservices/servprovs/validation`

**Categories:**

- Term: `sprvtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

## Change Document Management

| Collection | Path | Categories |
|------------|------|------------|
| Change Document Object | `/sap/bc/adt/changedocuments/objects` | chdochd |
| JSON Formatter | `/sap/bc/adt/changedocuments/objects/source/formatter` | chdochd/formatter |
| Server driven framework - Schema | `/sap/bc/adt/changedocuments/objects/$schema` | chdochd/schema |
| Server driven framework - Configuration | `/sap/bc/adt/changedocuments/objects/$configuration` | chdochd/configuration |
| Change Document Object Name Validation | `/sap/bc/adt/changedocuments/objects/validation` | chdochd/validation |

### Collection Details

#### Change Document Object

**Path:** `/sap/bc/adt/changedocuments/objects`

**Categories:**

- Term: `chdochd`
  - Scheme: `http://www.sap.com/wbobj/changedocumentobjects`

**Template Links:**

- **http://www.sap.com/wbobj/changedocumentobjects/chdochd/properties**
  - Template: `/sap/bc/adt/changedocuments/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/changedocumentobjects/chdochd/source**
  - Template: `/sap/bc/adt/changedocuments/objects/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/changedocuments/objects/source/formatter`

**Categories:**

- Term: `chdochd/formatter`
  - Scheme: `http://www.sap.com/wbobj/changedocumentobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/changedocuments/objects/$schema`

**Categories:**

- Term: `chdochd/schema`
  - Scheme: `http://www.sap.com/wbobj/changedocumentobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/changedocuments/objects/$configuration`

**Categories:**

- Term: `chdochd/configuration`
  - Scheme: `http://www.sap.com/wbobj/changedocumentobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Change Document Object Name Validation

**Path:** `/sap/bc/adt/changedocuments/objects/validation`

**Categories:**

- Term: `chdochd/validation`
  - Scheme: `http://www.sap.com/wbobj/changedocumentobjects`

---

## Code Composer

| Collection | Path | Categories |
|------------|------|------------|
| Code Composer Template | `/sap/bc/adt/cmp_code_composer/cmpt` | code-composer-template |
| Code Composer Template Name Validation | `/sap/bc/adt/cmp_code_composer/cmpt/validation` | code-composer-template/validation |

### Collection Details

#### Code Composer Template

**Path:** `/sap/bc/adt/cmp_code_composer/cmpt`

**Categories:**

- Term: `code-composer-template`
  - Scheme: `http://www.sap.com/adt/categories/codecomposer`

**Template Links:**

- **http://www.sap.com/adt/categories/codecomposer/code-composer-template/properties**
  - Template: `/sap/bc/adt/cmp_code_composer/cmpt/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/adt/categories/codecomposer/code-composer-template/source**
  - Template: `/sap/bc/adt/cmp_code_composer/cmpt/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Code Composer Template Name Validation

**Path:** `/sap/bc/adt/cmp_code_composer/cmpt/validation`

**Categories:**

- Term: `code-composer-template/validation`
  - Scheme: `http://www.sap.com/adt/categories/codecomposer`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Communication Target | `/sap/bc/adt/conn/commtargets` | cotatyp |
| JSON Formatter | `/sap/bc/adt/conn/commtargets/source/formatter` | cotatyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/conn/commtargets/$schema` | cotatyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/conn/commtargets/$configuration` | cotatyp/configuration |
| Communication Target Name Validation | `/sap/bc/adt/conn/commtargets/validation` | cotatyp/validation |

### Collection Details

#### Communication Target

**Path:** `/sap/bc/adt/conn/commtargets`

**Categories:**

- Term: `cotatyp`
  - Scheme: `http://www.sap.com/wbobj/commtargetobjects`

**Template Links:**

- **http://www.sap.com/wbobj/commtargetobjects/cotatyp/properties**
  - Template: `/sap/bc/adt/conn/commtargets/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/commtargetobjects/cotatyp/source**
  - Template: `/sap/bc/adt/conn/commtargets/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/conn/commtargets/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/conn/commtargets/source/formatter`

**Categories:**

- Term: `cotatyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/commtargetobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/conn/commtargets/$schema`

**Categories:**

- Term: `cotatyp/schema`
  - Scheme: `http://www.sap.com/wbobj/commtargetobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/conn/commtargets/$configuration`

**Categories:**

- Term: `cotatyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/commtargetobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Communication Target Name Validation

**Path:** `/sap/bc/adt/conn/commtargets/validation`

**Categories:**

- Term: `cotatyp/validation`
  - Scheme: `http://www.sap.com/wbobj/commtargetobjects`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Consistency Check | `/sap/bc/adt/consist/checkids` | edcktyp |
| JSON Formatter | `/sap/bc/adt/consist/checkids/source/formatter` | edcktyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/consist/checkids/$schema` | edcktyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/consist/checkids/$configuration` | edcktyp/configuration |
| Consistency Check Name Validation | `/sap/bc/adt/consist/checkids/validation` | edcktyp/validation |
| Representation Type | `/sap/bc/adt/consist/representations` | edcrtyp |
| JSON Formatter | `/sap/bc/adt/consist/representations/source/formatter` | edcrtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/consist/representations/$schema` | edcrtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/consist/representations/$configuration` | edcrtyp/configuration |
| Representation Type Name Validation | `/sap/bc/adt/consist/representations/validation` | edcrtyp/validation |
| Consistency Scenario | `/sap/bc/adt/consist/scenarios` | edcctyp |
| JSON Formatter | `/sap/bc/adt/consist/scenarios/source/formatter` | edcctyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/consist/scenarios/$schema` | edcctyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/consist/scenarios/$configuration` | edcctyp/configuration |
| Consistency Scenario Name Validation | `/sap/bc/adt/consist/scenarios/validation` | edcctyp/validation |

### Collection Details

#### Consistency Check

**Path:** `/sap/bc/adt/consist/checkids`

**Categories:**

- Term: `edcktyp`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Template Links:**

- **http://www.sap.com/wbobj/documentconsistency/edcktyp/properties**
  - Template: `/sap/bc/adt/consist/checkids/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/documentconsistency/edcktyp/source**
  - Template: `/sap/bc/adt/consist/checkids/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/consist/checkids/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/consist/checkids/source/formatter`

**Categories:**

- Term: `edcktyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/consist/checkids/$schema`

**Categories:**

- Term: `edcktyp/schema`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/consist/checkids/$configuration`

**Categories:**

- Term: `edcktyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Consistency Check Name Validation

**Path:** `/sap/bc/adt/consist/checkids/validation`

**Categories:**

- Term: `edcktyp/validation`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

---

#### Representation Type

**Path:** `/sap/bc/adt/consist/representations`

**Categories:**

- Term: `edcrtyp`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Template Links:**

- **http://www.sap.com/wbobj/documentconsistency/edcrtyp/properties**
  - Template: `/sap/bc/adt/consist/representations/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/documentconsistency/edcrtyp/source**
  - Template: `/sap/bc/adt/consist/representations/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/consist/representations/source/formatter`

**Categories:**

- Term: `edcrtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/consist/representations/$schema`

**Categories:**

- Term: `edcrtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/consist/representations/$configuration`

**Categories:**

- Term: `edcrtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Representation Type Name Validation

**Path:** `/sap/bc/adt/consist/representations/validation`

**Categories:**

- Term: `edcrtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

---

#### Consistency Scenario

**Path:** `/sap/bc/adt/consist/scenarios`

**Categories:**

- Term: `edcctyp`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Template Links:**

- **http://www.sap.com/wbobj/documentconsistency/edcctyp/properties**
  - Template: `/sap/bc/adt/consist/scenarios/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/documentconsistency/edcctyp/source**
  - Template: `/sap/bc/adt/consist/scenarios/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/consist/scenarios/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/consist/scenarios/source/formatter`

**Categories:**

- Term: `edcctyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/consist/scenarios/$schema`

**Categories:**

- Term: `edcctyp/schema`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/consist/scenarios/$configuration`

**Categories:**

- Term: `edcctyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Consistency Scenario Name Validation

**Path:** `/sap/bc/adt/consist/scenarios/validation`

**Categories:**

- Term: `edcctyp/validation`
  - Scheme: `http://www.sap.com/wbobj/documentconsistency`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Core Schema Notation Model | `/sap/bc/adt/csn/csnm` | csnmtyp |
| JSON Formatter | `/sap/bc/adt/csn/csnm/source/formatter` | csnmtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/csn/csnm/$schema` | csnmtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/csn/csnm/$configuration` | csnmtyp/configuration |
| (Untitled) | `/sap/bc/adt/csn/csnm/files` | csnmtyp/files |
| (Untitled) | `/sap/bc/adt/csn/csnm/last-generation-run` | csnmtyp/last-generation-run |
| Core Schema Notation Model Name Validation | `/sap/bc/adt/csn/csnm/validation` | csnmtyp/validation |

### Collection Details

#### Core Schema Notation Model

**Path:** `/sap/bc/adt/csn/csnm`

**Categories:**

- Term: `csnmtyp`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

**Template Links:**

- **http://www.sap.com/wbobj/csnmodel/csnmtyp/properties**
  - Template: `/sap/bc/adt/csn/csnm/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/csnmodel/csnmtyp/source**
  - Template: `/sap/bc/adt/csn/csnm/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/wbobj/csnmodel/csnmtyp/files**
  - Template: `/sap/bc/adt/csn/csnm/{object_name}/files`
- **http://www.sap.com/wbobj/csnmodel/csnmtyp/last-generation-run**
  - Template: `/sap/bc/adt/csn/csnm/{object_name}/last-generation-run`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/csn/csnm/source/formatter`

**Categories:**

- Term: `csnmtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/csn/csnm/$schema`

**Categories:**

- Term: `csnmtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/csn/csnm/$configuration`

**Categories:**

- Term: `csnmtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### /sap/bc/adt/csn/csnm/files

**Path:** `/sap/bc/adt/csn/csnm/files`

**Categories:**

- Term: `csnmtyp/files`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

**Template Links:**

- **http://www.sap.com/wbobj/csnmodel/csnmtyp/files**
  - Template: `/sap/bc/adt/csn/csnm/{object_name}/files`

**Accepted Content Types:**

- `application/json`

---

#### /sap/bc/adt/csn/csnm/last-generation-run

**Path:** `/sap/bc/adt/csn/csnm/last-generation-run`

**Categories:**

- Term: `csnmtyp/last-generation-run`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

**Template Links:**

- **http://www.sap.com/wbobj/csnmodel/csnmtyp/last-generation-run**
  - Template: `/sap/bc/adt/csn/csnm/{object_name}/last-generation-run`

**Accepted Content Types:**

- `application/json`

---

#### Core Schema Notation Model Name Validation

**Path:** `/sap/bc/adt/csn/csnm/validation`

**Categories:**

- Term: `csnmtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/csnmodel`

---

## Extensibility

| Collection | Path | Categories |
|------------|------|------------|
| Custom Field | `/sap/bc/adt/customfields/objects` | cfdffld |
| JSON Formatter | `/sap/bc/adt/customfields/objects/source/formatter` | cfdffld/formatter |
| Server driven framework - Schema | `/sap/bc/adt/customfields/objects/$schema` | cfdffld/schema |
| Server driven framework - Configuration | `/sap/bc/adt/customfields/objects/$configuration` | cfdffld/configuration |
| Custom Field Name Validation | `/sap/bc/adt/customfields/objects/validation` | cfdffld/validation |

### Collection Details

#### Custom Field

**Path:** `/sap/bc/adt/customfields/objects`

**Categories:**

- Term: `cfdffld`
  - Scheme: `http://www.sap.com/wbobj/extensibility`

**Template Links:**

- **http://www.sap.com/wbobj/extensibility/cfdffld/properties**
  - Template: `/sap/bc/adt/customfields/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/extensibility/cfdffld/source**
  - Template: `/sap/bc/adt/customfields/objects/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/customfields/objects/source/formatter`

**Categories:**

- Term: `cfdffld/formatter`
  - Scheme: `http://www.sap.com/wbobj/extensibility`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/customfields/objects/$schema`

**Categories:**

- Term: `cfdffld/schema`
  - Scheme: `http://www.sap.com/wbobj/extensibility`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/customfields/objects/$configuration`

**Categories:**

- Term: `cfdffld/configuration`
  - Scheme: `http://www.sap.com/wbobj/extensibility`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Custom Field Name Validation

**Path:** `/sap/bc/adt/customfields/objects/validation`

**Categories:**

- Term: `cfdffld/validation`
  - Scheme: `http://www.sap.com/wbobj/extensibility`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Customer Data Browser Object | `/sap/bc/adt/databrowser/objects` | cdbo |
| JSON Formatter | `/sap/bc/adt/databrowser/objects/source/formatter` | cdbo/formatter |
| Server driven framework - Schema | `/sap/bc/adt/databrowser/objects/$schema` | cdbo/schema |
| Server driven framework - Configuration | `/sap/bc/adt/databrowser/objects/$configuration` | cdbo/configuration |
| Object Name Validation | `/sap/bc/adt/databrowser/objects/validation` | cdbo/validation |

### Collection Details

#### Customer Data Browser Object

**Path:** `/sap/bc/adt/databrowser/objects`

**Categories:**

- Term: `cdbo`
  - Scheme: `http://www.sap.com/wbobj/databrowserobjects`

**Template Links:**

- **http://www.sap.com/wbobj/databrowserobjects/cdbo/properties**
  - Template: `/sap/bc/adt/databrowser/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/databrowserobjects/cdbo/source**
  - Template: `/sap/bc/adt/databrowser/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/databrowser/objects/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/databrowser/objects/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/databrowser/objects/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/databrowser/objects/source/formatter`

**Categories:**

- Term: `cdbo/formatter`
  - Scheme: `http://www.sap.com/wbobj/databrowserobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/databrowser/objects/$schema`

**Categories:**

- Term: `cdbo/schema`
  - Scheme: `http://www.sap.com/wbobj/databrowserobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/databrowser/objects/$configuration`

**Categories:**

- Term: `cdbo/configuration`
  - Scheme: `http://www.sap.com/wbobj/databrowserobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/databrowser/objects/validation`

**Categories:**

- Term: `cdbo/validation`
  - Scheme: `http://www.sap.com/wbobj/databrowserobjects`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Data Category | `/sap/bc/adt/datacategories/objects` | dcattyp |
| JSON Formatter | `/sap/bc/adt/datacategories/objects/source/formatter` | dcattyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/datacategories/objects/$schema` | dcattyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/datacategories/objects/$configuration` | dcattyp/configuration |
| Data Category Name Validation | `/sap/bc/adt/datacategories/objects/validation` | dcattyp/validation |

### Collection Details

#### Data Category

**Path:** `/sap/bc/adt/datacategories/objects`

**Categories:**

- Term: `dcattyp`
  - Scheme: `http://www.sap.com/wbobj/dcattyp`

**Template Links:**

- **http://www.sap.com/wbobj/dcattyp/dcattyp/properties**
  - Template: `/sap/bc/adt/datacategories/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dcattyp/dcattyp/source**
  - Template: `/sap/bc/adt/datacategories/objects/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/datacategories/objects/source/formatter`

**Categories:**

- Term: `dcattyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/dcattyp`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/datacategories/objects/$schema`

**Categories:**

- Term: `dcattyp/schema`
  - Scheme: `http://www.sap.com/wbobj/dcattyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/datacategories/objects/$configuration`

**Categories:**

- Term: `dcattyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/dcattyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Data Category Name Validation

**Path:** `/sap/bc/adt/datacategories/objects/validation`

**Categories:**

- Term: `dcattyp/validation`
  - Scheme: `http://www.sap.com/wbobj/dcattyp`

---

## Dictionary

| Collection | Path | Categories |
|------------|------|------------|
| Data Element | `/sap/bc/adt/ddic/dataelements` | dtelde |
| Supplement Documentations | `/sap/bc/adt/ddic/dataelements/docu/supplements` | dtelde/supplementdocu |
| Documentation Status | `/sap/bc/adt/ddic/dataelements/docu/status` | dtelde/docustatus |
| Data Element Name Validation | `/sap/bc/adt/ddic/dataelements/validation` | dtelde/validation |
| Table Index | `/sap/bc/adt/ddic/db/indexes` | tabldti |
| JSON Formatter | `/sap/bc/adt/ddic/db/indexes/source/formatter` | tabldti/formatter |
| Server driven framework - Schema | `/sap/bc/adt/ddic/db/indexes/$schema` | tabldti/schema |
| Server driven framework - Configuration | `/sap/bc/adt/ddic/db/indexes/$configuration` | tabldti/configuration |
| Table Index Name Validation | `/sap/bc/adt/ddic/db/indexes/validation` | tabldti/validation |
| Technical Table Settings | `/sap/bc/adt/ddic/db/settings` | tabldtt |
| Data Class Category | `/sap/bc/adt/ddic/db/settings/dataClass/values` | dataClass |
| Size Category | `/sap/bc/adt/ddic/db/settings/size/values` | size |
| Key Area Fields | `/sap/bc/adt/ddic/db/settings/keyFields/values` | keyFields |
| Technical Table Settings Name Validation | `/sap/bc/adt/ddic/db/settings/validation` | tabldtt/validation |
| Data Definition | `/sap/bc/adt/ddic/ddl/sources` | ddlsdf |
| Data Definition Name Validation | `/sap/bc/adt/ddic/ddl/sources/validation` | ddlsdf/validation |
| Annotation Definition | `/sap/bc/adt/ddic/ddla/sources` | ddlaadf |
| Annotation Definition Name Validation | `/sap/bc/adt/ddic/ddla/sources/validation` | ddlaadf/validation |
| Metadata Extension | `/sap/bc/adt/ddic/ddlx/sources` | ddlxex |
| Grammar metadata for type Metadata Extension | `/sap/bc/adt/ddic/ddlx/sources/$metadata` | ddlxex/metadata |
| Metadata Extension Name Validation | `/sap/bc/adt/ddic/ddlx/sources/validation` | ddlxex/validation |
| Logical External Schema | `/sap/bc/adt/ddic/desd` | desdtyp |
| JSON Formatter | `/sap/bc/adt/ddic/desd/source/formatter` | desdtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/ddic/desd/$schema` | desdtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/ddic/desd/$configuration` | desdtyp/configuration |
| Logical External Schema Name Validation | `/sap/bc/adt/ddic/desd/validation` | desdtyp/validation |
| Domain | `/sap/bc/adt/ddic/domains` | domadd |
| Domain Name Validation | `/sap/bc/adt/ddic/domains/validation` | domadd/validation |
| Aspect | `/sap/bc/adt/ddic/dras/sources` | drasras |
| Grammar metadata for type Aspect | `/sap/bc/adt/ddic/dras/sources/$metadata` | drasras/metadata |
| Navigation for type DRAS | `/sap/bc/adt/ddic/dras/sources/$navigation` | drasras/navigation |
| Code Completion for type DRAS | `/sap/bc/adt/ddic/dras/sources/$codecompletion/proposal` | drasras/codecompletion/proposal |
| Code Insertion for type DRAS | `/sap/bc/adt/ddic/dras/sources/$codecompletion/insertion` | drasras/codecompletion/insertion |
| Element Info for type DRAS | `/sap/bc/adt/ddic/dras/sources/$elementinfo` | drasras/elementinfo |
| Outline Configuration for type DRAS | `/sap/bc/adt/ddic/dras/sources/$outlineconfiguration` | drasras/outlineconfiguration |
| Aspect Name Validation | `/sap/bc/adt/ddic/dras/sources/validation` | drasras/validation |
| Type | `/sap/bc/adt/ddic/drty/sources` | drtysty |
| Grammar metadata for type Type | `/sap/bc/adt/ddic/drty/sources/$metadata` | drtysty/metadata |
| Navigation for type DRTY | `/sap/bc/adt/ddic/drty/sources/$navigation` | drtysty/navigation |
| Code Completion for type DRTY | `/sap/bc/adt/ddic/drty/sources/$codecompletion/proposal` | drtysty/codecompletion/proposal |
| Code Insertion for type DRTY | `/sap/bc/adt/ddic/drty/sources/$codecompletion/insertion` | drtysty/codecompletion/insertion |
| Formatter for type DRTY | `/sap/bc/adt/ddic/drty/sources/$formatter` | drtysty/formatter |
| Element Info for type DRTY | `/sap/bc/adt/ddic/drty/sources/$elementinfo` | drtysty/elementinfo |
| Outline Configuration for type DRTY | `/sap/bc/adt/ddic/drty/sources/$outlineconfiguration` | drtysty/outlineconfiguration |
| Occurrence Marking for type DRTY | `/sap/bc/adt/ddic/drty/sources/$occurrencemarkers` | drtysty/occurrencemarkers |
| Type Name Validation | `/sap/bc/adt/ddic/drty/sources/validation` | drtysty/validation |
| Dependency Rule | `/sap/bc/adt/ddic/drul/sources` | druldrl |
| Dependency Rule Name Validation | `/sap/bc/adt/ddic/drul/sources/validation` | druldrl/validation |
| Scalar Function Definition | `/sap/bc/adt/ddic/dsfd/sources` | dsfdscf |
| Grammar metadata for type Scalar Function Definition | `/sap/bc/adt/ddic/dsfd/sources/$metadata` | dsfdscf/metadata |
| Navigation for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$navigation` | dsfdscf/navigation |
| Code Completion for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$codecompletion/proposal` | dsfdscf/codecompletion/proposal |
| Code Insertion for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$codecompletion/insertion` | dsfdscf/codecompletion/insertion |
| Formatter for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$formatter` | dsfdscf/formatter |
| Element Info for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$elementinfo` | dsfdscf/elementinfo |
| Outline Configuration for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$outlineconfiguration` | dsfdscf/outlineconfiguration |
| Occurrence Marking for type DSFD | `/sap/bc/adt/ddic/dsfd/sources/$occurrencemarkers` | dsfdscf/occurrencemarkers |
| Scalar Function Definition Name Validation | `/sap/bc/adt/ddic/dsfd/sources/validation` | dsfdscf/validation |
| Scalar Function Implementation Reference | `/sap/bc/adt/ddic/dsfi` | dsfisfi |
| JSON Formatter | `/sap/bc/adt/ddic/dsfi/source/formatter` | dsfisfi/formatter |
| Server driven framework - Schema | `/sap/bc/adt/ddic/dsfi/$schema` | dsfisfi/schema |
| Server driven framework - Configuration | `/sap/bc/adt/ddic/dsfi/$configuration` | dsfisfi/configuration |
| Object Name Validation | `/sap/bc/adt/ddic/dsfi/validation` | dsfisfi/validation |
| Dynamic Cache | `/sap/bc/adt/ddic/dtdc/sources` | dtdcdf |
| Dynamic Cache Name Validation | `/sap/bc/adt/ddic/dtdc/sources/validation` | dtdcdf/validation |
| Entity Buffer | `/sap/bc/adt/ddic/dteb/sources` | dtebdf |
| Entity Buffer Name Validation | `/sap/bc/adt/ddic/dteb/sources/validation` | dtebdf/validation |
| Static Cache | `/sap/bc/adt/ddic/dtsc/sources` | dtscdf |
| Grammar metadata for type Static Cache | `/sap/bc/adt/ddic/dtsc/sources/$metadata` | dtscdf/metadata |
| Navigation for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$navigation` | dtscdf/navigation |
| Code Completion for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$codecompletion/proposal` | dtscdf/codecompletion/proposal |
| Code Insertion for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$codecompletion/insertion` | dtscdf/codecompletion/insertion |
| Formatter for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$formatter` | dtscdf/formatter |
| Element Info for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$elementinfo` | dtscdf/elementinfo |
| Outline Configuration for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$outlineconfiguration` | dtscdf/outlineconfiguration |
| Occurrence Marking for type DTSC | `/sap/bc/adt/ddic/dtsc/sources/$occurrencemarkers` | dtscdf/occurrencemarkers |
| Static Cache Name Validation | `/sap/bc/adt/ddic/dtsc/sources/validation` | dtscdf/validation |
| Extension Index | `/sap/bc/adt/ddic/extensionindexes` | xinxdtx |
| JSON Formatter | `/sap/bc/adt/ddic/extensionindexes/source/formatter` | xinxdtx/formatter |
| Server driven framework - Schema | `/sap/bc/adt/ddic/extensionindexes/$schema` | xinxdtx/schema |
| Server driven framework - Configuration | `/sap/bc/adt/ddic/extensionindexes/$configuration` | xinxdtx/configuration |
| Extension Index Name Validation | `/sap/bc/adt/ddic/extensionindexes/validation` | xinxdtx/validation |
| Lock Object | `/sap/bc/adt/ddic/lockobjects/sources` | enqudl |
| Lock Object Name Validation | `/sap/bc/adt/ddic/lockobjects/sources/validation` | enqudl/validation |
| Service Definition | `/sap/bc/adt/ddic/srvd/sources` | srvdsrv |
| Service Definition Name Validation | `/sap/bc/adt/ddic/srvd/sources/validation` | srvdsrv/validation |
| Structure | `/sap/bc/adt/ddic/structures` | tablds |
| Structure Parser Info | `/sap/bc/adt/ddic/structures/parser/info` | tablds/parserinfo |
| Structure Name Validation | `/sap/bc/adt/ddic/structures/validation` | tablds/validation |
| Database Table | `/sap/bc/adt/ddic/tables` | tabldt |
| Table Parser Info | `/sap/bc/adt/ddic/tables/parser/info` | tabldt/parserinfo |
| Database Table Name Validation | `/sap/bc/adt/ddic/tables/validation` | tabldt/validation |
| Table Type | `/sap/bc/adt/ddic/tabletypes` | ttypda |
| Table Type Name Validation | `/sap/bc/adt/ddic/tabletypes/validation` | ttypda/validation |

### Collection Details

#### Data Element

**Path:** `/sap/bc/adt/ddic/dataelements`

**Categories:**

- Term: `dtelde`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/dtelde/properties**
  - Template: `/sap/bc/adt/ddic/dataelements/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.dataelements.v2+xml`
- `text/html`

---

#### Supplement Documentations

**Path:** `/sap/bc/adt/ddic/dataelements/docu/supplements`

**Categories:**

- Term: `dtelde/supplementdocu`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Documentation Status

**Path:** `/sap/bc/adt/ddic/dataelements/docu/status`

**Categories:**

- Term: `dtelde/docustatus`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Data Element Name Validation

**Path:** `/sap/bc/adt/ddic/dataelements/validation`

**Categories:**

- Term: `dtelde/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Table Index

**Path:** `/sap/bc/adt/ddic/db/indexes`

**Categories:**

- Term: `tabldti`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/tabldti/properties**
  - Template: `/sap/bc/adt/ddic/db/indexes/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/tabldti/source**
  - Template: `/sap/bc/adt/ddic/db/indexes/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/ddic/db/indexes/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/ddic/db/indexes/source/formatter`

**Categories:**

- Term: `tabldti/formatter`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/ddic/db/indexes/$schema`

**Categories:**

- Term: `tabldti/schema`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/ddic/db/indexes/$configuration`

**Categories:**

- Term: `tabldti/configuration`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Table Index Name Validation

**Path:** `/sap/bc/adt/ddic/db/indexes/validation`

**Categories:**

- Term: `tabldti/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Technical Table Settings

**Path:** `/sap/bc/adt/ddic/db/settings`

**Categories:**

- Term: `tabldtt`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/tabldtt/properties**
  - Template: `/sap/bc/adt/ddic/db/settings/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.table.settings.v2+xml`
- `text/html`

---

#### Data Class Category

**Path:** `/sap/bc/adt/ddic/db/settings/dataClass/values`

**Categories:**

- Term: `dataClass`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Size Category

**Path:** `/sap/bc/adt/ddic/db/settings/size/values`

**Categories:**

- Term: `size`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Key Area Fields

**Path:** `/sap/bc/adt/ddic/db/settings/keyFields/values`

**Categories:**

- Term: `keyFields`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Technical Table Settings Name Validation

**Path:** `/sap/bc/adt/ddic/db/settings/validation`

**Categories:**

- Term: `tabldtt/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Data Definition

**Path:** `/sap/bc/adt/ddic/ddl/sources`

**Categories:**

- Term: `ddlsdf`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Data Definition Name Validation

**Path:** `/sap/bc/adt/ddic/ddl/sources/validation`

**Categories:**

- Term: `ddlsdf/validation`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Annotation Definition

**Path:** `/sap/bc/adt/ddic/ddla/sources`

**Categories:**

- Term: `ddlaadf`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/wbobj/cds/ddlaadf/properties**
  - Template: `/sap/bc/adt/ddic/ddla/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/cds/ddlaadf/source**
  - Template: `/sap/bc/adt/ddic/ddla/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.ddla.v1+xml`
- `text/html`

---

#### Annotation Definition Name Validation

**Path:** `/sap/bc/adt/ddic/ddla/sources/validation`

**Categories:**

- Term: `ddlaadf/validation`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Metadata Extension

**Path:** `/sap/bc/adt/ddic/ddlx/sources`

**Categories:**

- Term: `ddlxex`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/wbobj/cds/ddlxex/properties**
  - Template: `/sap/bc/adt/ddic/ddlx/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/cds/ddlxex/source**
  - Template: `/sap/bc/adt/ddic/ddlx/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.ddlx.v1+xml`
- `text/html`

---

#### Grammar metadata for type Metadata Extension

**Path:** `/sap/bc/adt/ddic/ddlx/sources/$metadata`

**Categories:**

- Term: `ddlxex/metadata`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Metadata Extension Name Validation

**Path:** `/sap/bc/adt/ddic/ddlx/sources/validation`

**Categories:**

- Term: `ddlxex/validation`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Logical External Schema

**Path:** `/sap/bc/adt/ddic/desd`

**Categories:**

- Term: `desdtyp`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/wbobj/cds/desdtyp/properties**
  - Template: `/sap/bc/adt/ddic/desd/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/cds/desdtyp/source**
  - Template: `/sap/bc/adt/ddic/desd/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/ddic/desd/source/formatter`

**Categories:**

- Term: `desdtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/ddic/desd/$schema`

**Categories:**

- Term: `desdtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/ddic/desd/$configuration`

**Categories:**

- Term: `desdtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Logical External Schema Name Validation

**Path:** `/sap/bc/adt/ddic/desd/validation`

**Categories:**

- Term: `desdtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Domain

**Path:** `/sap/bc/adt/ddic/domains`

**Categories:**

- Term: `domadd`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/domadd/properties**
  - Template: `/sap/bc/adt/ddic/domains/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.domains.v2+xml`
- `text/html`

---

#### Domain Name Validation

**Path:** `/sap/bc/adt/ddic/domains/validation`

**Categories:**

- Term: `domadd/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Aspect

**Path:** `/sap/bc/adt/ddic/dras/sources`

**Categories:**

- Term: `drasras`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Grammar metadata for type Aspect

**Path:** `/sap/bc/adt/ddic/dras/sources/$metadata`

**Categories:**

- Term: `drasras/metadata`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Navigation for type DRAS

**Path:** `/sap/bc/adt/ddic/dras/sources/$navigation`

**Categories:**

- Term: `drasras/navigation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Completion for type DRAS

**Path:** `/sap/bc/adt/ddic/dras/sources/$codecompletion/proposal`

**Categories:**

- Term: `drasras/codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Insertion for type DRAS

**Path:** `/sap/bc/adt/ddic/dras/sources/$codecompletion/insertion`

**Categories:**

- Term: `drasras/codecompletion/insertion`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Element Info for type DRAS

**Path:** `/sap/bc/adt/ddic/dras/sources/$elementinfo`

**Categories:**

- Term: `drasras/elementinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **elementinfo**
  - Template: `/sap/bc/adt/ddic/dras/sources/$elementinfo{?uri,objectName,objectType}`

---

#### Outline Configuration for type DRAS

**Path:** `/sap/bc/adt/ddic/dras/sources/$outlineconfiguration`

**Categories:**

- Term: `drasras/outlineconfiguration`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Aspect Name Validation

**Path:** `/sap/bc/adt/ddic/dras/sources/validation`

**Categories:**

- Term: `drasras/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Type

**Path:** `/sap/bc/adt/ddic/drty/sources`

**Categories:**

- Term: `drtysty`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/drtysty/properties**
  - Template: `/sap/bc/adt/ddic/drty/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/drtysty/source**
  - Template: `/sap/bc/adt/ddic/drty/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Grammar metadata for type Type

**Path:** `/sap/bc/adt/ddic/drty/sources/$metadata`

**Categories:**

- Term: `drtysty/metadata`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Navigation for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$navigation`

**Categories:**

- Term: `drtysty/navigation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Completion for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$codecompletion/proposal`

**Categories:**

- Term: `drtysty/codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Insertion for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$codecompletion/insertion`

**Categories:**

- Term: `drtysty/codecompletion/insertion`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Formatter for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$formatter`

**Categories:**

- Term: `drtysty/formatter`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `text/plain`

---

#### Element Info for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$elementinfo`

**Categories:**

- Term: `drtysty/elementinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **elementinfo**
  - Template: `/sap/bc/adt/ddic/drty/sources/$elementinfo{?uri,objectName,objectType}`

---

#### Outline Configuration for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$outlineconfiguration`

**Categories:**

- Term: `drtysty/outlineconfiguration`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Occurrence Marking for type DRTY

**Path:** `/sap/bc/adt/ddic/drty/sources/$occurrencemarkers`

**Categories:**

- Term: `drtysty/occurrencemarkers`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Type Name Validation

**Path:** `/sap/bc/adt/ddic/drty/sources/validation`

**Categories:**

- Term: `drtysty/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Dependency Rule

**Path:** `/sap/bc/adt/ddic/drul/sources`

**Categories:**

- Term: `druldrl`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/druldrl/properties**
  - Template: `/sap/bc/adt/ddic/drul/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/druldrl/source**
  - Template: `/sap/bc/adt/ddic/drul/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.drul.v1+xml`
- `text/html`

---

#### Dependency Rule Name Validation

**Path:** `/sap/bc/adt/ddic/drul/sources/validation`

**Categories:**

- Term: `druldrl/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Scalar Function Definition

**Path:** `/sap/bc/adt/ddic/dsfd/sources`

**Categories:**

- Term: `dsfdscf`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/dsfdscf/properties**
  - Template: `/sap/bc/adt/ddic/dsfd/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/dsfdscf/source**
  - Template: `/sap/bc/adt/ddic/dsfd/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Grammar metadata for type Scalar Function Definition

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$metadata`

**Categories:**

- Term: `dsfdscf/metadata`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Navigation for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$navigation`

**Categories:**

- Term: `dsfdscf/navigation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Completion for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$codecompletion/proposal`

**Categories:**

- Term: `dsfdscf/codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Insertion for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$codecompletion/insertion`

**Categories:**

- Term: `dsfdscf/codecompletion/insertion`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Formatter for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$formatter`

**Categories:**

- Term: `dsfdscf/formatter`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `text/plain`

---

#### Element Info for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$elementinfo`

**Categories:**

- Term: `dsfdscf/elementinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **elementinfo**
  - Template: `/sap/bc/adt/ddic/dsfd/sources/$elementinfo{?uri,objectName,objectType}`

---

#### Outline Configuration for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$outlineconfiguration`

**Categories:**

- Term: `dsfdscf/outlineconfiguration`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Occurrence Marking for type DSFD

**Path:** `/sap/bc/adt/ddic/dsfd/sources/$occurrencemarkers`

**Categories:**

- Term: `dsfdscf/occurrencemarkers`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Scalar Function Definition Name Validation

**Path:** `/sap/bc/adt/ddic/dsfd/sources/validation`

**Categories:**

- Term: `dsfdscf/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Scalar Function Implementation Reference

**Path:** `/sap/bc/adt/ddic/dsfi`

**Categories:**

- Term: `dsfisfi`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/wbobj/cds/dsfisfi/properties**
  - Template: `/sap/bc/adt/ddic/dsfi/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/cds/dsfisfi/source**
  - Template: `/sap/bc/adt/ddic/dsfi/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/ddic/dsfi/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/ddic/dsfi/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/ddic/dsfi/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/ddic/dsfi/source/formatter`

**Categories:**

- Term: `dsfisfi/formatter`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/ddic/dsfi/$schema`

**Categories:**

- Term: `dsfisfi/schema`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/ddic/dsfi/$configuration`

**Categories:**

- Term: `dsfisfi/configuration`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/ddic/dsfi/validation`

**Categories:**

- Term: `dsfisfi/validation`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### Dynamic Cache

**Path:** `/sap/bc/adt/ddic/dtdc/sources`

**Categories:**

- Term: `dtdcdf`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/dtdcdf/properties**
  - Template: `/sap/bc/adt/ddic/dtdc/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/dtdcdf/source**
  - Template: `/sap/bc/adt/ddic/dtdc/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.dtdc.v1+xml`
- `text/html`

---

#### Dynamic Cache Name Validation

**Path:** `/sap/bc/adt/ddic/dtdc/sources/validation`

**Categories:**

- Term: `dtdcdf/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Entity Buffer

**Path:** `/sap/bc/adt/ddic/dteb/sources`

**Categories:**

- Term: `dtebdf`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/dtebdf/properties**
  - Template: `/sap/bc/adt/ddic/dteb/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/dtebdf/source**
  - Template: `/sap/bc/adt/ddic/dteb/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.dteb.v1+xml`
- `text/html`

---

#### Entity Buffer Name Validation

**Path:** `/sap/bc/adt/ddic/dteb/sources/validation`

**Categories:**

- Term: `dtebdf/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Static Cache

**Path:** `/sap/bc/adt/ddic/dtsc/sources`

**Categories:**

- Term: `dtscdf`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Grammar metadata for type Static Cache

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$metadata`

**Categories:**

- Term: `dtscdf/metadata`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Navigation for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$navigation`

**Categories:**

- Term: `dtscdf/navigation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Completion for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$codecompletion/proposal`

**Categories:**

- Term: `dtscdf/codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Code Insertion for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$codecompletion/insertion`

**Categories:**

- Term: `dtscdf/codecompletion/insertion`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Formatter for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$formatter`

**Categories:**

- Term: `dtscdf/formatter`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `text/plain`

---

#### Element Info for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$elementinfo`

**Categories:**

- Term: `dtscdf/elementinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **elementinfo**
  - Template: `/sap/bc/adt/ddic/dtsc/sources/$elementinfo{?uri,objectName,objectType}`

---

#### Outline Configuration for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$outlineconfiguration`

**Categories:**

- Term: `dtscdf/outlineconfiguration`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Occurrence Marking for type DTSC

**Path:** `/sap/bc/adt/ddic/dtsc/sources/$occurrencemarkers`

**Categories:**

- Term: `dtscdf/occurrencemarkers`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Static Cache Name Validation

**Path:** `/sap/bc/adt/ddic/dtsc/sources/validation`

**Categories:**

- Term: `dtscdf/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Extension Index

**Path:** `/sap/bc/adt/ddic/extensionindexes`

**Categories:**

- Term: `xinxdtx`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/xinxdtx/properties**
  - Template: `/sap/bc/adt/ddic/extensionindexes/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dictionary/xinxdtx/source**
  - Template: `/sap/bc/adt/ddic/extensionindexes/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/ddic/extensionindexes/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/ddic/extensionindexes/source/formatter`

**Categories:**

- Term: `xinxdtx/formatter`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/ddic/extensionindexes/$schema`

**Categories:**

- Term: `xinxdtx/schema`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/ddic/extensionindexes/$configuration`

**Categories:**

- Term: `xinxdtx/configuration`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Extension Index Name Validation

**Path:** `/sap/bc/adt/ddic/extensionindexes/validation`

**Categories:**

- Term: `xinxdtx/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Lock Object

**Path:** `/sap/bc/adt/ddic/lockobjects/sources`

**Categories:**

- Term: `enqudl`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/enqudl/properties**
  - Template: `/sap/bc/adt/ddic/lockobjects/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.lockobjects.v1+xml`
- `text/html`

---

#### Lock Object Name Validation

**Path:** `/sap/bc/adt/ddic/lockobjects/sources/validation`

**Categories:**

- Term: `enqudl/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Service Definition

**Path:** `/sap/bc/adt/ddic/srvd/sources`

**Categories:**

- Term: `srvdsrv`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/wbobj/raps/srvdsrv/properties**
  - Template: `/sap/bc/adt/ddic/srvd/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/raps/srvdsrv/source**
  - Template: `/sap/bc/adt/ddic/srvd/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.srvd.v1+xml`
- `text/html`

---

#### Service Definition Name Validation

**Path:** `/sap/bc/adt/ddic/srvd/sources/validation`

**Categories:**

- Term: `srvdsrv/validation`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### Structure

**Path:** `/sap/bc/adt/ddic/structures`

**Categories:**

- Term: `tablds`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.structures.v2+xml`
- `text/html`

---

#### Structure Parser Info

**Path:** `/sap/bc/adt/ddic/structures/parser/info`

**Categories:**

- Term: `tablds/parserinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.tabl.parserinfo.v1+xml`

---

#### Structure Name Validation

**Path:** `/sap/bc/adt/ddic/structures/validation`

**Categories:**

- Term: `tablds/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Database Table

**Path:** `/sap/bc/adt/ddic/tables`

**Categories:**

- Term: `tabldt`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.tables.v2+xml`
- `text/html`

---

#### Table Parser Info

**Path:** `/sap/bc/adt/ddic/tables/parser/info`

**Categories:**

- Term: `tabldt/parserinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `application/vnd.sap.adt.tabl.parserinfo.v1+xml`

---

#### Database Table Name Validation

**Path:** `/sap/bc/adt/ddic/tables/validation`

**Categories:**

- Term: `tabldt/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Table Type

**Path:** `/sap/bc/adt/ddic/tabletypes`

**Categories:**

- Term: `ttypda`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/wbobj/dictionary/ttypda/properties**
  - Template: `/sap/bc/adt/ddic/tabletypes/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.tabletype.v1+xml`
- `text/html`

---

#### Table Type Name Validation

**Path:** `/sap/bc/adt/ddic/tabletypes/validation`

**Categories:**

- Term: `ttypda/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

## Various Demo Objects

| Collection | Path | Categories |
|------------|------|------------|
| JSON Demo Object | `/sap/bc/adt/demo/jsonobjects` | wb2jtyp |
| JSON Formatter | `/sap/bc/adt/demo/jsonobjects/source/formatter` | wb2jtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/demo/jsonobjects/$schema` | wb2jtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/demo/jsonobjects/$configuration` | wb2jtyp/configuration |
| Object Name Validation | `/sap/bc/adt/demo/jsonobjects/validation` | wb2jtyp/validation |
| Server Driven Test Object | `/sap/bc/adt/demogroup/sdt1typ` | sdt1typ |
| JSON Formatter | `/sap/bc/adt/demogroup/sdt1typ/source/formatter` | sdt1typ/formatter |
| Server driven framework - Schema | `/sap/bc/adt/demogroup/sdt1typ/$schema` | sdt1typ/schema |
| Server driven framework - Configuration | `/sap/bc/adt/demogroup/sdt1typ/$configuration` | sdt1typ/configuration |
| Object Name Validation | `/sap/bc/adt/demogroup/sdt1typ/validation` | sdt1typ/validation |
| Demo 1A Object | `/sap/bc/adt/demogroup/wb1atyp` | wb1atyp |
| Demo 1A Object Name Validation | `/sap/bc/adt/demogroup/wb1atyp/validation` | wb1atyp/validation |
| Demo 2A Object | `/sap/bc/adt/demogroup/wb2atyp` | wb2atyp |
| Demo 2A Object Name Validation | `/sap/bc/adt/demogroup/wb2atyp/validation` | wb2atyp/validation |
| Demo 2B Object | `/sap/bc/adt/demogroup/wb2btyp` | wb2btyp |
| Demo 2B Object Name Validation | `/sap/bc/adt/demogroup/wb2btyp/validation` | wb2btyp/validation |
| Demo 2C Object | `/sap/bc/adt/demogroup/wb2ctyp` | wb2ctyp |
| Demo 2C Object Name Validation | `/sap/bc/adt/demogroup/wb2ctyp/validation` | wb2ctyp/validation |
| Demo 2D Object | `/sap/bc/adt/demogroup/wb2dtyp` | wb2dtyp |
| Allowed values on fourth attribute | `/sap/bc/adt/demogroup/wb2dtyp/4thattribute/values` | fourthattributevalues |
| Demo 2D Object Name Validation | `/sap/bc/adt/demogroup/wb2dtyp/validation` | wb2dtyp/validation |
| Demo 2K Object | `/sap/bc/adt/demogroup/wb2ktyp` | wb2ktyp |
| JSON Formatter | `/sap/bc/adt/demogroup/wb2ktyp/source/formatter` | wb2ktyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/demogroup/wb2ktyp/$schema` | wb2ktyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/demogroup/wb2ktyp/$configuration` | wb2ktyp/configuration |
| Demo 2K Object Name Validation | `/sap/bc/adt/demogroup/wb2ktyp/validation` | wb2ktyp/validation |
| Demo 2S Object | `/sap/bc/adt/demogroup/wb2s/sources` | wb2styp |
| Grammar metadata for type Demo 2S Object | `/sap/bc/adt/demogroup/wb2s/sources/$metadata` | wb2styp/metadata |
| Navigation for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$navigation` | wb2styp/navigation |
| Code Completion for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$codecompletion/proposal` | wb2styp/codecompletion/proposal |
| Code Insertion for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$codecompletion/insertion` | wb2styp/codecompletion/insertion |
| Formatter for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$formatter` | wb2styp/formatter |
| Element Info for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$elementinfo` | wb2styp/elementinfo |
| Outline Configuration for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$outlineconfiguration` | wb2styp/outlineconfiguration |
| Occurrence Marking for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$occurrencemarkers` | wb2styp/occurrencemarkers |
| AI Completion for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$codeprediction` | wb2styp/codeprediction |
| Properties schema for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$properties/schema` | wb2styp/properties/schema |
| Properties configuration for type WB2S | `/sap/bc/adt/demogroup/wb2s/sources/$properties/configuration` | wb2styp/properties/configuration |
| Demo 2S Object Name Validation | `/sap/bc/adt/demogroup/wb2s/sources/validation` | wb2styp/validation |

### Collection Details

#### JSON Demo Object

**Path:** `/sap/bc/adt/demo/jsonobjects`

**Categories:**

- Term: `wb2jtyp`
  - Scheme: `http://www.sap.com/wbobj/wb2jtyp`

**Template Links:**

- **http://www.sap.com/wbobj/wb2jtyp/wb2jtyp/properties**
  - Template: `/sap/bc/adt/demo/jsonobjects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/wb2jtyp/wb2jtyp/source**
  - Template: `/sap/bc/adt/demo/jsonobjects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/demo/jsonobjects/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/demo/jsonobjects/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/demo/jsonobjects/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/demo/jsonobjects/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/demo/jsonobjects/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/demo/jsonobjects/source/formatter`

**Categories:**

- Term: `wb2jtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/wb2jtyp`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/demo/jsonobjects/$schema`

**Categories:**

- Term: `wb2jtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/wb2jtyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/demo/jsonobjects/$configuration`

**Categories:**

- Term: `wb2jtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/wb2jtyp`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/demo/jsonobjects/validation`

**Categories:**

- Term: `wb2jtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/wb2jtyp`

---

#### Server Driven Test Object

**Path:** `/sap/bc/adt/demogroup/sdt1typ`

**Categories:**

- Term: `sdt1typ`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **http://www.sap.com/wbobj/demogroup/sdt1typ/properties**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/demogroup/sdt1typ/source**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/demogroup/sdt1typ/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/demogroup/sdt1typ/source/formatter`

**Categories:**

- Term: `sdt1typ/formatter`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/demogroup/sdt1typ/$schema`

**Categories:**

- Term: `sdt1typ/schema`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/demogroup/sdt1typ/$configuration`

**Categories:**

- Term: `sdt1typ/configuration`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/demogroup/sdt1typ/validation`

**Categories:**

- Term: `sdt1typ/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 1A Object

**Path:** `/sap/bc/adt/demogroup/wb1atyp`

**Categories:**

- Term: `wb1atyp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **http://www.sap.com/wbobj/demogroup/wb1atyp/properties**
  - Template: `/sap/bc/adt/demogroup/wb1atyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Demo 1A Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb1atyp/validation`

**Categories:**

- Term: `wb1atyp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2A Object

**Path:** `/sap/bc/adt/demogroup/wb2atyp`

**Categories:**

- Term: `wb2atyp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **http://www.sap.com/wbobj/demogroup/wb2atyp/properties**
  - Template: `/sap/bc/adt/demogroup/wb2atyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/demogroup/wb2atyp/source**
  - Template: `/sap/bc/adt/demogroup/wb2atyp/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Demo 2A Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb2atyp/validation`

**Categories:**

- Term: `wb2atyp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2B Object

**Path:** `/sap/bc/adt/demogroup/wb2btyp`

**Categories:**

- Term: `wb2btyp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **http://www.sap.com/wbobj/demogroup/wb2btyp/properties**
  - Template: `/sap/bc/adt/demogroup/wb2btyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/demogroup/wb2btyp/source**
  - Template: `/sap/bc/adt/demogroup/wb2btyp/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Demo 2B Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb2btyp/validation`

**Categories:**

- Term: `wb2btyp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2C Object

**Path:** `/sap/bc/adt/demogroup/wb2ctyp`

**Categories:**

- Term: `wb2ctyp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **http://www.sap.com/wbobj/demogroup/wb2ctyp/properties**
  - Template: `/sap/bc/adt/demogroup/wb2ctyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/demogroup/wb2ctyp/source**
  - Template: `/sap/bc/adt/demogroup/wb2ctyp/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Demo 2C Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb2ctyp/validation`

**Categories:**

- Term: `wb2ctyp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2D Object

**Path:** `/sap/bc/adt/demogroup/wb2dtyp`

**Categories:**

- Term: `wb2dtyp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values on fourth attribute

**Path:** `/sap/bc/adt/demogroup/wb2dtyp/4thattribute/values`

**Categories:**

- Term: `fourthattributevalues`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2D Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb2dtyp/validation`

**Categories:**

- Term: `wb2dtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2K Object

**Path:** `/sap/bc/adt/demogroup/wb2ktyp`

**Categories:**

- Term: `wb2ktyp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **http://www.sap.com/wbobj/demogroup/wb2ktyp/properties**
  - Template: `/sap/bc/adt/demogroup/wb2ktyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/demogroup/wb2ktyp/source**
  - Template: `/sap/bc/adt/demogroup/wb2ktyp/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/demogroup/wb2ktyp/source/formatter`

**Categories:**

- Term: `wb2ktyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/demogroup/wb2ktyp/$schema`

**Categories:**

- Term: `wb2ktyp/schema`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/demogroup/wb2ktyp/$configuration`

**Categories:**

- Term: `wb2ktyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Demo 2K Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb2ktyp/validation`

**Categories:**

- Term: `wb2ktyp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Demo 2S Object

**Path:** `/sap/bc/adt/demogroup/wb2s/sources`

**Categories:**

- Term: `wb2styp`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **/wb2styp/properties**
  - Template: `/sap/bc/adt/demogroup/wb2s/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **/wb2styp/source**
  - Template: `/sap/bc/adt/demogroup/wb2s/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Grammar metadata for type Demo 2S Object

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$metadata`

**Categories:**

- Term: `wb2styp/metadata`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Navigation for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$navigation`

**Categories:**

- Term: `wb2styp/navigation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Code Completion for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$codecompletion/proposal`

**Categories:**

- Term: `wb2styp/codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Code Insertion for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$codecompletion/insertion`

**Categories:**

- Term: `wb2styp/codecompletion/insertion`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Formatter for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$formatter`

**Categories:**

- Term: `wb2styp/formatter`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `text/plain`

---

#### Element Info for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$elementinfo`

**Categories:**

- Term: `wb2styp/elementinfo`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Template Links:**

- **elementinfo**
  - Template: `/sap/bc/adt/demogroup/wb2s/sources/$elementinfo{?uri,objectName,objectType}`

---

#### Outline Configuration for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$outlineconfiguration`

**Categories:**

- Term: `wb2styp/outlineconfiguration`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Occurrence Marking for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$occurrencemarkers`

**Categories:**

- Term: `wb2styp/occurrencemarkers`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### AI Completion for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$codeprediction`

**Categories:**

- Term: `wb2styp/codeprediction`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

#### Properties schema for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$properties/schema`

**Categories:**

- Term: `wb2styp/properties/schema`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=bsceProperties.v1`

---

#### Properties configuration for type WB2S

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/$properties/configuration`

**Categories:**

- Term: `wb2styp/properties/configuration`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=bsceProperties.v1`

---

#### Demo 2S Object Name Validation

**Path:** `/sap/bc/adt/demogroup/wb2s/sources/validation`

**Categories:**

- Term: `wb2styp/validation`
  - Scheme: `http://www.sap.com/wbobj/demogroup`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Data Destruction Object | `/sap/bc/adt/destructionobjects/objects` | dobjdst |
| JSON Formatter | `/sap/bc/adt/destructionobjects/objects/source/formatter` | dobjdst/formatter |
| Server driven framework - Schema | `/sap/bc/adt/destructionobjects/objects/$schema` | dobjdst/schema |
| Server driven framework - Configuration | `/sap/bc/adt/destructionobjects/objects/$configuration` | dobjdst/configuration |
| Object Name Validation | `/sap/bc/adt/destructionobjects/objects/validation` | dobjdst/validation |

### Collection Details

#### Data Destruction Object

**Path:** `/sap/bc/adt/destructionobjects/objects`

**Categories:**

- Term: `dobjdst`
  - Scheme: `http://www.sap.com/wbobj/destructionobjects`

**Template Links:**

- **http://www.sap.com/wbobj/destructionobjects/dobjdst/properties**
  - Template: `/sap/bc/adt/destructionobjects/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/destructionobjects/dobjdst/source**
  - Template: `/sap/bc/adt/destructionobjects/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/destructionobjects/objects/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/destructionobjects/objects/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/destructionobjects/objects/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/destructionobjects/objects/source/formatter`

**Categories:**

- Term: `dobjdst/formatter`
  - Scheme: `http://www.sap.com/wbobj/destructionobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/destructionobjects/objects/$schema`

**Categories:**

- Term: `dobjdst/schema`
  - Scheme: `http://www.sap.com/wbobj/destructionobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/destructionobjects/objects/$configuration`

**Categories:**

- Term: `dobjdst/configuration`
  - Scheme: `http://www.sap.com/wbobj/destructionobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/destructionobjects/objects/validation`

**Categories:**

- Term: `dobjdst/validation`
  - Scheme: `http://www.sap.com/wbobj/destructionobjects`

---

## Texts

| Collection | Path | Categories |
|------------|------|------------|
| Knowledge Transfer Document | `/sap/bc/adt/documentation/ktd/documents` | sktdtyp |
| KTD Document Validation | `/sap/bc/adt/documentation/ktd/documents/validation` | sktdtyp/validation |
| KTD Syntax Templates | `/sap/bc/adt/documentation/ktd/documents/codecompletion/templates` | sktdtyp/codecompletion |
| Dita Document Preview | `/sap/bc/adt/documentation/ktd/documents/preview` | dita/preview |
| KTD Link Code Completion | `/sap/bc/adt/documentation/ktd/documents/codecompletion/links` | sktdtyp/codecompletion/links |
| KTD Code Completion | `/sap/bc/adt/documentation/ktd/documents/$codecompletion/proposal` | sktdtyp/$codecompletion/proposal |

### Collection Details

#### Knowledge Transfer Document

**Path:** `/sap/bc/adt/documentation/ktd/documents`

**Categories:**

- Term: `sktdtyp`
  - Scheme: `http://www.sap.com/wbobj/textobj`

**Template Links:**

- **http://www.sap.com/wbobj/textobj/sktdtyp/properties**
  - Template: `/sap/bc/adt/documentation/ktd/documents/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **sktdtyp/elementinfo**
  - Template: `/sap/bc/adt/documentation/ktd/documents/elementinfo{?fullname}`
  - Type: `application/vnd.sap.adt.elementinfo+xml`
  - Title: KTD Element Information
- **sktdtyp/element/elementinfo**
  - Template: `/sap/bc/adt/documentation/ktd/documents/element/elementinfo{?path,type}`
  - Type: `application/vnd.sap.adt.elementinfo+xml`
  - Title: KTD Element Information

**Accepted Content Types:**

- `application/vnd.sap.adt.sktdv2+xml`
- `text/html`
- `application/json`
- `text/plain`

---

#### KTD Document Validation

**Path:** `/sap/bc/adt/documentation/ktd/documents/validation`

**Categories:**

- Term: `sktdtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/textobj`

---

#### KTD Syntax Templates

**Path:** `/sap/bc/adt/documentation/ktd/documents/codecompletion/templates`

**Categories:**

- Term: `sktdtyp/codecompletion`
  - Scheme: `http://www.sap.com/wbobj/textobj`

---

#### Dita Document Preview

**Path:** `/sap/bc/adt/documentation/ktd/documents/preview`

**Categories:**

- Term: `dita/preview`
  - Scheme: `http://www.sap.com/wbobj/textobj`

---

#### KTD Link Code Completion

**Path:** `/sap/bc/adt/documentation/ktd/documents/codecompletion/links`

**Categories:**

- Term: `sktdtyp/codecompletion/links`
  - Scheme: `http://www.sap.com/wbobj/textobj`

---

#### KTD Code Completion

**Path:** `/sap/bc/adt/documentation/ktd/documents/$codecompletion/proposal`

**Categories:**

- Term: `sktdtyp/$codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/textobj`

---

## Dummy object types  (for unit tests)

| Collection | Path | Categories |
|------------|------|------------|
| Dummy 1A object type | `/sap/bc/adt/dummygroup/wbttt1a` | wbttt1a |
| Grammar metadata for type Dummy 1A object type | `/sap/bc/adt/dummygroup/wbttt1a/$metadata` | wbttt1a/metadata |
| green description | `/sap/bc/adt/dummygroup/wbttt1a/white/yellow` | blue_term |
| Dummy 1A object type Name Validation | `/sap/bc/adt/dummygroup/wbttt1a/validation` | wbttt1a/validation |
| Dummy object type (for unit tests) | `/sap/bc/adt/dummygroup/wbttt2a` | wbttt2a |
| Dummy object type (for unit tests) Name Validation | `/sap/bc/adt/dummygroup/wbttt2a/validation` | wbttt2a/validation |

### Collection Details

#### Dummy 1A object type

**Path:** `/sap/bc/adt/dummygroup/wbttt1a`

**Categories:**

- Term: `wbttt1a`
  - Scheme: `http://www.sap.com/wbobj/dummygroup`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Grammar metadata for type Dummy 1A object type

**Path:** `/sap/bc/adt/dummygroup/wbttt1a/$metadata`

**Categories:**

- Term: `wbttt1a/metadata`
  - Scheme: `http://www.sap.com/wbobj/dummygroup`

---

#### green description

**Path:** `/sap/bc/adt/dummygroup/wbttt1a/white/yellow`

**Categories:**

- Term: `blue_term`
  - Scheme: `http://www.sap.com/wbobj/dummygroup`

---

#### Dummy 1A object type Name Validation

**Path:** `/sap/bc/adt/dummygroup/wbttt1a/validation`

**Categories:**

- Term: `wbttt1a/validation`
  - Scheme: `http://www.sap.com/wbobj/dummygroup`

---

#### Dummy object type (for unit tests)

**Path:** `/sap/bc/adt/dummygroup/wbttt2a`

**Categories:**

- Term: `wbttt2a`
  - Scheme: `http://www.sap.com/wbobj/dummygroup`

**Template Links:**

- **http://www.sap.com/wbobj/dummygroup/wbttt2a/properties**
  - Template: `/sap/bc/adt/dummygroup/wbttt2a/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/dummygroup/wbttt2a/source**
  - Template: `/sap/bc/adt/dummygroup/wbttt2a/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Dummy object type (for unit tests) Name Validation

**Path:** `/sap/bc/adt/dummygroup/wbttt2a/validation`

**Categories:**

- Term: `wbttt2a/validation`
  - Scheme: `http://www.sap.com/wbobj/dummygroup`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Email Template | `/sap/bc/adt/emailtemplates/templates` | smtg |
| JSON Formatter | `/sap/bc/adt/emailtemplates/templates/source/formatter` | smtg/formatter |
| Server driven framework - Schema | `/sap/bc/adt/emailtemplates/templates/$schema` | smtg/schema |
| Server driven framework - Configuration | `/sap/bc/adt/emailtemplates/templates/$configuration` | smtg/configuration |
| Email Template Name Validation | `/sap/bc/adt/emailtemplates/templates/validation` | smtg/validation |

### Collection Details

#### Email Template

**Path:** `/sap/bc/adt/emailtemplates/templates`

**Categories:**

- Term: `smtg`
  - Scheme: `http://www.sap.com/wbobj/smtg`

**Template Links:**

- **http://www.sap.com/wbobj/smtg/smtg/properties**
  - Template: `/sap/bc/adt/emailtemplates/templates/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/smtg/smtg/source**
  - Template: `/sap/bc/adt/emailtemplates/templates/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/emailtemplates/templates/source/formatter`

**Categories:**

- Term: `smtg/formatter`
  - Scheme: `http://www.sap.com/wbobj/smtg`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/emailtemplates/templates/$schema`

**Categories:**

- Term: `smtg/schema`
  - Scheme: `http://www.sap.com/wbobj/smtg`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/emailtemplates/templates/$configuration`

**Categories:**

- Term: `smtg/configuration`
  - Scheme: `http://www.sap.com/wbobj/smtg`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Email Template Name Validation

**Path:** `/sap/bc/adt/emailtemplates/templates/validation`

**Categories:**

- Term: `smtg/validation`
  - Scheme: `http://www.sap.com/wbobj/smtg`

---

## Enhancements

| Collection | Path | Categories |
|------------|------|------------|
| Enhancement Implementation | `/sap/bc/adt/enhancements/enhoxh` | enhoxh |
| Enhancement Implementation Name Validation | `/sap/bc/adt/enhancements/enhoxh/validation` | enhoxh/validation |
| BAdI Implementation | `/sap/bc/adt/enhancements/enhoxhb` | enhoxhb |
| BAdI Implementation Name Validation | `/sap/bc/adt/enhancements/enhoxhb/validation` | enhoxhb/validation |
| Source Code Plugin | `/sap/bc/adt/enhancements/enhoxhh` | enhoxhh |
| Object Name Validation | `/sap/bc/adt/enhancements/enhoxhh/validation` | enhoxhh/validation |
| Enhancement Spot | `/sap/bc/adt/enhancements/enhsxs` | enhsxs |
| Enhancement Spot Name Validation | `/sap/bc/adt/enhancements/enhsxs/validation` | enhsxs/validation |
| BAdI Enhancement Spot | `/sap/bc/adt/enhancements/enhsxsb` | enhsxsb |
| BAdI Definition Validation | `/sap/bc/adt/enhancements/enhsxsb/validation` | enhsxsb/validation |
| Enhancement Spot Search | `/sap/bc/adt/enhancements/enhsxsb/search` | enhsxsb/search |

### Collection Details

#### Enhancement Implementation

**Path:** `/sap/bc/adt/enhancements/enhoxh`

**Categories:**

- Term: `enhoxh`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

**Template Links:**

- **http://www.sap.com/wbobj/enhancements/enhoxh/properties**
  - Template: `/sap/bc/adt/enhancements/enhoxh/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.enh.enho.v1+xml`
- `text/html`

---

#### Enhancement Implementation Name Validation

**Path:** `/sap/bc/adt/enhancements/enhoxh/validation`

**Categories:**

- Term: `enhoxh/validation`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

---

#### BAdI Implementation

**Path:** `/sap/bc/adt/enhancements/enhoxhb`

**Categories:**

- Term: `enhoxhb`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

**Template Links:**

- **http://www.sap.com/wbobj/enhancements/enhoxhb/properties**
  - Template: `/sap/bc/adt/enhancements/enhoxhb/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.enh.enhoxhb.v4+xml`
- `text/html`

---

#### BAdI Implementation Name Validation

**Path:** `/sap/bc/adt/enhancements/enhoxhb/validation`

**Categories:**

- Term: `enhoxhb/validation`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

---

#### Source Code Plugin

**Path:** `/sap/bc/adt/enhancements/enhoxhh`

**Categories:**

- Term: `enhoxhh`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

**Template Links:**

- **http://www.sap.com/wbobj/enhancements/enhoxhh/properties**
  - Template: `/sap/bc/adt/enhancements/enhoxhh/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/enhancements/enhoxhh/source**
  - Template: `/sap/bc/adt/enhancements/enhoxhh/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.enh.enhoxhh.v3+xml`
- `text/html`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/enhancements/enhoxhh/validation`

**Categories:**

- Term: `enhoxhh/validation`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

---

#### Enhancement Spot

**Path:** `/sap/bc/adt/enhancements/enhsxs`

**Categories:**

- Term: `enhsxs`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

**Template Links:**

- **http://www.sap.com/wbobj/enhancements/enhsxs/properties**
  - Template: `/sap/bc/adt/enhancements/enhsxs/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.enh.enhs.v1+xml`
- `text/html`

---

#### Enhancement Spot Name Validation

**Path:** `/sap/bc/adt/enhancements/enhsxs/validation`

**Categories:**

- Term: `enhsxs/validation`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

---

#### BAdI Enhancement Spot

**Path:** `/sap/bc/adt/enhancements/enhsxsb`

**Categories:**

- Term: `enhsxsb`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

**Template Links:**

- **http://www.sap.com/wbobj/enhancements/enhsxsb/properties**
  - Template: `/sap/bc/adt/enhancements/enhsxsb/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.enh.enhs.v2+xml`
- `text/html`

---

#### BAdI Definition Validation

**Path:** `/sap/bc/adt/enhancements/enhsxsb/validation`

**Categories:**

- Term: `enhsxsb/validation`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

---

#### Enhancement Spot Search

**Path:** `/sap/bc/adt/enhancements/enhsxsb/search`

**Categories:**

- Term: `enhsxsb/search`
  - Scheme: `http://www.sap.com/wbobj/enhancements`

---

## Fiori User Interface

| Collection | Path | Categories |
|------------|------|------------|
| Launchpad App Descriptor Item | `/sap/bc/adt/fiori/uiad` | uiadtyp |
| JSON Formatter | `/sap/bc/adt/fiori/uiad/source/formatter` | uiadtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/fiori/uiad/$schema` | uiadtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/fiori/uiad/$configuration` | uiadtyp/configuration |
| Object Name Validation | `/sap/bc/adt/fiori/uiad/validation` | uiadtyp/validation |
| Launchpad Page Template | `/sap/bc/adt/fiori/uipgtyp` | uipgtyp |
| JSON Formatter | `/sap/bc/adt/fiori/uipgtyp/source/formatter` | uipgtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/fiori/uipgtyp/$schema` | uipgtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/fiori/uipgtyp/$configuration` | uipgtyp/configuration |
| Object Name Validation | `/sap/bc/adt/fiori/uipgtyp/validation` | uipgtyp/validation |
| Launchpad Space Template | `/sap/bc/adt/fiori/uisttop` | uisttop |
| JSON Formatter | `/sap/bc/adt/fiori/uisttop/source/formatter` | uisttop/formatter |
| Server driven framework - Schema | `/sap/bc/adt/fiori/uisttop/$schema` | uisttop/schema |
| Server driven framework - Configuration | `/sap/bc/adt/fiori/uisttop/$configuration` | uisttop/configuration |
| Object Name Validation | `/sap/bc/adt/fiori/uisttop/validation` | uisttop/validation |

### Collection Details

#### Launchpad App Descriptor Item

**Path:** `/sap/bc/adt/fiori/uiad`

**Categories:**

- Term: `uiadtyp`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Template Links:**

- **http://www.sap.com/wbobj/fiori/uiadtyp/properties**
  - Template: `/sap/bc/adt/fiori/uiad/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/fiori/uiadtyp/source**
  - Template: `/sap/bc/adt/fiori/uiad/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/fiori/uiad/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/fiori/uiad/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/fiori/uiad/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/fiori/uiad/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/fiori/uiad/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/fiori/uiad/source/formatter`

**Categories:**

- Term: `uiadtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/fiori/uiad/$schema`

**Categories:**

- Term: `uiadtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/fiori/uiad/$configuration`

**Categories:**

- Term: `uiadtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/fiori/uiad/validation`

**Categories:**

- Term: `uiadtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/fiori`

---

#### Launchpad Page Template

**Path:** `/sap/bc/adt/fiori/uipgtyp`

**Categories:**

- Term: `uipgtyp`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Template Links:**

- **http://www.sap.com/wbobj/fiori/uipgtyp/properties**
  - Template: `/sap/bc/adt/fiori/uipgtyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/fiori/uipgtyp/source**
  - Template: `/sap/bc/adt/fiori/uipgtyp/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/fiori/uipgtyp/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/fiori/uipgtyp/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/fiori/uipgtyp/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/fiori/uipgtyp/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/fiori/uipgtyp/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/fiori/uipgtyp/source/formatter`

**Categories:**

- Term: `uipgtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/fiori/uipgtyp/$schema`

**Categories:**

- Term: `uipgtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/fiori/uipgtyp/$configuration`

**Categories:**

- Term: `uipgtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/fiori/uipgtyp/validation`

**Categories:**

- Term: `uipgtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/fiori`

---

#### Launchpad Space Template

**Path:** `/sap/bc/adt/fiori/uisttop`

**Categories:**

- Term: `uisttop`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Template Links:**

- **http://www.sap.com/wbobj/fiori/uisttop/properties**
  - Template: `/sap/bc/adt/fiori/uisttop/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/fiori/uisttop/source**
  - Template: `/sap/bc/adt/fiori/uisttop/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/fiori/uisttop/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/fiori/uisttop/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/fiori/uisttop/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/fiori/uisttop/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/fiori/uisttop/source/formatter`

**Categories:**

- Term: `uisttop/formatter`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/fiori/uisttop/$schema`

**Categories:**

- Term: `uisttop/schema`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/fiori/uisttop/$configuration`

**Categories:**

- Term: `uisttop/configuration`
  - Scheme: `http://www.sap.com/wbobj/fiori`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/fiori/uisttop/validation`

**Categories:**

- Term: `uisttop/validation`
  - Scheme: `http://www.sap.com/wbobj/fiori`

---

## Form Objects

| Collection | Path | Categories |
|------------|------|------------|
| Form | `/sap/bc/adt/formobjects/sfpf5f` | sfpf5f |
| JSON Formatter | `/sap/bc/adt/formobjects/sfpf5f/source/formatter` | sfpf5f/formatter |
| Server driven framework - Schema | `/sap/bc/adt/formobjects/sfpf5f/$schema` | sfpf5f/schema |
| Server driven framework - Configuration | `/sap/bc/adt/formobjects/sfpf5f/$configuration` | sfpf5f/configuration |
| Form Name Validation | `/sap/bc/adt/formobjects/sfpf5f/validation` | sfpf5f/validation |

### Collection Details

#### Form

**Path:** `/sap/bc/adt/formobjects/sfpf5f`

**Categories:**

- Term: `sfpf5f`
  - Scheme: `http://www.sap.com/wbobj/form_objects`

**Template Links:**

- **http://www.sap.com/wbobj/form_objects/sfpf5f/properties**
  - Template: `/sap/bc/adt/formobjects/sfpf5f/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/form_objects/sfpf5f/source**
  - Template: `/sap/bc/adt/formobjects/sfpf5f/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/formobjects/sfpf5f/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/formobjects/sfpf5f/source/formatter`

**Categories:**

- Term: `sfpf5f/formatter`
  - Scheme: `http://www.sap.com/wbobj/form_objects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/formobjects/sfpf5f/$schema`

**Categories:**

- Term: `sfpf5f/schema`
  - Scheme: `http://www.sap.com/wbobj/form_objects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/formobjects/sfpf5f/$configuration`

**Categories:**

- Term: `sfpf5f/configuration`
  - Scheme: `http://www.sap.com/wbobj/form_objects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Form Name Validation

**Path:** `/sap/bc/adt/formobjects/sfpf5f/validation`

**Categories:**

- Term: `sfpf5f/validation`
  - Scheme: `http://www.sap.com/wbobj/form_objects`

---

## Namespaces in HDI container

| Collection | Path | Categories |
|------------|------|------------|
| Namespace in HDI container | `/sap/bc/adt/hota/hotahdi` | hotahdi |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hoto/addlprops` | hoto/addlprops |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hoto/checkin` | hoto/checkin |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hoto/checkout` | hoto/checkout |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hota/containername` | hota/containername |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hota/checknamespace` | hota/checknamespace |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hota/checkout/hdiwizard` | hota/checkout/hdiwizard |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hoto/transportdetails` | hoto/transportdetails |
| (Untitled) | `/sap/bc/adt/hota/hotahdi/hota/featurecheck` | hota/featurecheck |
| Namespace in HDI container Name Validation | `/sap/bc/adt/hota/hotahdi/validation` | hotahdi/validation |
| HDI Artifact | `/sap/bc/adt/hota/hotahto` | hotahto |
| HDI Artifact Name Validation | `/sap/bc/adt/hota/hotahto/validation` | hotahto/validation |

### Collection Details

#### Namespace in HDI container

**Path:** `/sap/bc/adt/hota/hotahdi`

**Categories:**

- Term: `hotahdi`
  - Scheme: `http://www.sap.com/wbobj/hota`

**Accepted Content Types:**

- `application/vnd.sap.adt.hotahdi.v1+xml`
- `text/html`

---

#### /sap/bc/adt/hota/hotahdi/hoto/addlprops

**Path:** `/sap/bc/adt/hota/hotahdi/hoto/addlprops`

**Categories:**

- Term: `hoto/addlprops`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hoto/checkin

**Path:** `/sap/bc/adt/hota/hotahdi/hoto/checkin`

**Categories:**

- Term: `hoto/checkin`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hoto/checkout

**Path:** `/sap/bc/adt/hota/hotahdi/hoto/checkout`

**Categories:**

- Term: `hoto/checkout`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hota/containername

**Path:** `/sap/bc/adt/hota/hotahdi/hota/containername`

**Categories:**

- Term: `hota/containername`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hota/checknamespace

**Path:** `/sap/bc/adt/hota/hotahdi/hota/checknamespace`

**Categories:**

- Term: `hota/checknamespace`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hota/checkout/hdiwizard

**Path:** `/sap/bc/adt/hota/hotahdi/hota/checkout/hdiwizard`

**Categories:**

- Term: `hota/checkout/hdiwizard`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hoto/transportdetails

**Path:** `/sap/bc/adt/hota/hotahdi/hoto/transportdetails`

**Categories:**

- Term: `hoto/transportdetails`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### /sap/bc/adt/hota/hotahdi/hota/featurecheck

**Path:** `/sap/bc/adt/hota/hotahdi/hota/featurecheck`

**Categories:**

- Term: `hota/featurecheck`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### Namespace in HDI container Name Validation

**Path:** `/sap/bc/adt/hota/hotahdi/validation`

**Categories:**

- Term: `hotahdi/validation`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

#### HDI Artifact

**Path:** `/sap/bc/adt/hota/hotahto`

**Categories:**

- Term: `hotahto`
  - Scheme: `http://www.sap.com/wbobj/hota`

**Template Links:**

- **http://www.sap.com/wbobj/hota/hotahto/properties**
  - Template: `/sap/bc/adt/hota/hotahto/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.hotahto.v1+xml`
- `text/html`

---

#### HDI Artifact Name Validation

**Path:** `/sap/bc/adt/hota/hotahto/validation`

**Categories:**

- Term: `hotahto/validation`
  - Scheme: `http://www.sap.com/wbobj/hota`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| IDE Action | `/sap/bc/adt/ideactions/objects` | saiatyp |
| JSON Formatter | `/sap/bc/adt/ideactions/objects/source/formatter` | saiatyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/ideactions/objects/$schema` | saiatyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/ideactions/objects/$configuration` | saiatyp/configuration |
| IDE Action Name Validation | `/sap/bc/adt/ideactions/objects/validation` | saiatyp/validation |

### Collection Details

#### IDE Action

**Path:** `/sap/bc/adt/ideactions/objects`

**Categories:**

- Term: `saiatyp`
  - Scheme: `http://www.sap.com/wbobj/ideactions`

**Template Links:**

- **http://www.sap.com/wbobj/ideactions/saiatyp/properties**
  - Template: `/sap/bc/adt/ideactions/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/ideactions/saiatyp/source**
  - Template: `/sap/bc/adt/ideactions/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/ideactions/objects/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/ideactions/objects/source/formatter`

**Categories:**

- Term: `saiatyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/ideactions`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/ideactions/objects/$schema`

**Categories:**

- Term: `saiatyp/schema`
  - Scheme: `http://www.sap.com/wbobj/ideactions`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/ideactions/objects/$configuration`

**Categories:**

- Term: `saiatyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/ideactions`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### IDE Action Name Validation

**Path:** `/sap/bc/adt/ideactions/objects/validation`

**Categories:**

- Term: `saiatyp/validation`
  - Scheme: `http://www.sap.com/wbobj/ideactions`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| ILM Object | `/sap/bc/adt/ilmobjects/objects` | ilmbirm |
| JSON Formatter | `/sap/bc/adt/ilmobjects/objects/source/formatter` | ilmbirm/formatter |
| Server driven framework - Schema | `/sap/bc/adt/ilmobjects/objects/$schema` | ilmbirm/schema |
| Server driven framework - Configuration | `/sap/bc/adt/ilmobjects/objects/$configuration` | ilmbirm/configuration |
| Object Name Validation | `/sap/bc/adt/ilmobjects/objects/validation` | ilmbirm/validation |

### Collection Details

#### ILM Object

**Path:** `/sap/bc/adt/ilmobjects/objects`

**Categories:**

- Term: `ilmbirm`
  - Scheme: `http://www.sap.com/wbobj/ilmobjects`

**Template Links:**

- **http://www.sap.com/wbobj/ilmobjects/ilmbirm/properties**
  - Template: `/sap/bc/adt/ilmobjects/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/ilmobjects/ilmbirm/source**
  - Template: `/sap/bc/adt/ilmobjects/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/ilmobjects/objects/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/ilmobjects/objects/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/ilmobjects/objects/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/ilmobjects/objects/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/ilmobjects/objects/source/formatter`

**Categories:**

- Term: `ilmbirm/formatter`
  - Scheme: `http://www.sap.com/wbobj/ilmobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/ilmobjects/objects/$schema`

**Categories:**

- Term: `ilmbirm/schema`
  - Scheme: `http://www.sap.com/wbobj/ilmobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/ilmobjects/objects/$configuration`

**Categories:**

- Term: `ilmbirm/configuration`
  - Scheme: `http://www.sap.com/wbobj/ilmobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/ilmobjects/objects/validation`

**Categories:**

- Term: `ilmbirm/validation`
  - Scheme: `http://www.sap.com/wbobj/ilmobjects`

---

## Intelligent Scenario Lifecycle Management

| Collection | Path | Categories |
|------------|------|------------|
| Intelligent Scenario Model | `/sap/bc/adt/islm/intelligentmodel` | intminm |
| JSON Formatter | `/sap/bc/adt/islm/intelligentmodel/source/formatter` | intminm/formatter |
| Server driven framework - Schema | `/sap/bc/adt/islm/intelligentmodel/$schema` | intminm/schema |
| Server driven framework - Configuration | `/sap/bc/adt/islm/intelligentmodel/$configuration` | intminm/configuration |
| Object Name Validation | `/sap/bc/adt/islm/intelligentmodel/validation` | intminm/validation |
| Intelligent Scenario | `/sap/bc/adt/islm/intelligentscenario` | intsins |
| JSON Formatter | `/sap/bc/adt/islm/intelligentscenario/source/formatter` | intsins/formatter |
| Server driven framework - Schema | `/sap/bc/adt/islm/intelligentscenario/$schema` | intsins/schema |
| Server driven framework - Configuration | `/sap/bc/adt/islm/intelligentscenario/$configuration` | intsins/configuration |
| Object Name Validation | `/sap/bc/adt/islm/intelligentscenario/validation` | intsins/validation |

### Collection Details

#### Intelligent Scenario Model

**Path:** `/sap/bc/adt/islm/intelligentmodel`

**Categories:**

- Term: `intminm`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Template Links:**

- **http://www.sap.com/wbobj/intelligententities/intminm/properties**
  - Template: `/sap/bc/adt/islm/intelligentmodel/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/intelligententities/intminm/source**
  - Template: `/sap/bc/adt/islm/intelligentmodel/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/islm/intelligentmodel/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/islm/intelligentmodel/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/islm/intelligentmodel/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/islm/intelligentmodel/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/islm/intelligentmodel/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/islm/intelligentmodel/source/formatter`

**Categories:**

- Term: `intminm/formatter`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/islm/intelligentmodel/$schema`

**Categories:**

- Term: `intminm/schema`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/islm/intelligentmodel/$configuration`

**Categories:**

- Term: `intminm/configuration`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/islm/intelligentmodel/validation`

**Categories:**

- Term: `intminm/validation`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

---

#### Intelligent Scenario

**Path:** `/sap/bc/adt/islm/intelligentscenario`

**Categories:**

- Term: `intsins`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Template Links:**

- **http://www.sap.com/wbobj/intelligententities/intsins/properties**
  - Template: `/sap/bc/adt/islm/intelligentscenario/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/intelligententities/intsins/source**
  - Template: `/sap/bc/adt/islm/intelligentscenario/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/islm/intelligentscenario/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/islm/intelligentscenario/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/islm/intelligentscenario/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/islm/intelligentscenario/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/islm/intelligentscenario/source/formatter`

**Categories:**

- Term: `intsins/formatter`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/islm/intelligentscenario/$schema`

**Categories:**

- Term: `intsins/schema`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/islm/intelligentscenario/$configuration`

**Categories:**

- Term: `intsins/configuration`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/islm/intelligentscenario/validation`

**Categories:**

- Term: `intsins/validation`
  - Scheme: `http://www.sap.com/wbobj/intelligententities`

---

## Lifecycle Management

| Collection | Path | Categories |
|------------|------|------------|
| Legacy Feature Toggle (Deprecated) | `/sap/bc/adt/lifecycle_management/ftglaf` | ftglaf |
| Allowed values for Release Status of Feature Toggle | `/sap/bc/adt/lifecycle_management/ftglaf/releasestatus/values` | releasestatusvalues |
| Legacy Feature Toggle (Deprecated) Name Validation | `/sap/bc/adt/lifecycle_management/ftglaf/validation` | ftglaf/validation |

### Collection Details

#### Legacy Feature Toggle (Deprecated)

**Path:** `/sap/bc/adt/lifecycle_management/ftglaf`

**Categories:**

- Term: `ftglaf`
  - Scheme: `http://www.sap.com/wbobj/lifecycle_management`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Allowed values for Release Status of Feature Toggle

**Path:** `/sap/bc/adt/lifecycle_management/ftglaf/releasestatus/values`

**Categories:**

- Term: `releasestatusvalues`
  - Scheme: `http://www.sap.com/wbobj/lifecycle_management`

---

#### Legacy Feature Toggle (Deprecated) Name Validation

**Path:** `/sap/bc/adt/lifecycle_management/ftglaf/validation`

**Categories:**

- Term: `ftglaf/validation`
  - Scheme: `http://www.sap.com/wbobj/lifecycle_management`

---

## Observability

| Collection | Path | Categories |
|------------|------|------------|
| Metric Provider | `/sap/bc/adt/metricproviders` | gsmp |
| JSON Formatter | `/sap/bc/adt/metricproviders/source/formatter` | gsmp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/metricproviders/$schema` | gsmp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/metricproviders/$configuration` | gsmp/configuration |
| Metric Provider Name Validation | `/sap/bc/adt/metricproviders/validation` | gsmp/validation |

### Collection Details

#### Metric Provider

**Path:** `/sap/bc/adt/metricproviders`

**Categories:**

- Term: `gsmp`
  - Scheme: `http://www.sap.com/wbobj/metricprovider`

**Template Links:**

- **http://www.sap.com/wbobj/metricprovider/gsmp/properties**
  - Template: `/sap/bc/adt/metricproviders/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/metricprovider/gsmp/source**
  - Template: `/sap/bc/adt/metricproviders/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/metricproviders/source/formatter`

**Categories:**

- Term: `gsmp/formatter`
  - Scheme: `http://www.sap.com/wbobj/metricprovider`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/metricproviders/$schema`

**Categories:**

- Term: `gsmp/schema`
  - Scheme: `http://www.sap.com/wbobj/metricprovider`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/metricproviders/$configuration`

**Categories:**

- Term: `gsmp/configuration`
  - Scheme: `http://www.sap.com/wbobj/metricprovider`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Metric Provider Name Validation

**Path:** `/sap/bc/adt/metricproviders/validation`

**Categories:**

- Term: `gsmp/validation`
  - Scheme: `http://www.sap.com/wbobj/metricprovider`

---

## Notes for Application Objects

| Collection | Path | Categories |
|------------|------|------------|
| Note Type Assignment | `/sap/bc/adt/notebasic/assignments` | nttatyp |
| JSON Formatter | `/sap/bc/adt/notebasic/assignments/source/formatter` | nttatyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/notebasic/assignments/$schema` | nttatyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/notebasic/assignments/$configuration` | nttatyp/configuration |
| Note Type Assignment Name Validation | `/sap/bc/adt/notebasic/assignments/validation` | nttatyp/validation |
| Note Type | `/sap/bc/adt/notebasic/notetypes` | nttytyp |
| JSON Formatter | `/sap/bc/adt/notebasic/notetypes/source/formatter` | nttytyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/notebasic/notetypes/$schema` | nttytyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/notebasic/notetypes/$configuration` | nttytyp/configuration |
| Note Type Name Validation | `/sap/bc/adt/notebasic/notetypes/validation` | nttytyp/validation |

### Collection Details

#### Note Type Assignment

**Path:** `/sap/bc/adt/notebasic/assignments`

**Categories:**

- Term: `nttatyp`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Template Links:**

- **http://www.sap.com/wbobj/notebasic/nttatyp/properties**
  - Template: `/sap/bc/adt/notebasic/assignments/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/notebasic/nttatyp/source**
  - Template: `/sap/bc/adt/notebasic/assignments/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/notebasic/assignments/source/formatter`

**Categories:**

- Term: `nttatyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/notebasic/assignments/$schema`

**Categories:**

- Term: `nttatyp/schema`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/notebasic/assignments/$configuration`

**Categories:**

- Term: `nttatyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Note Type Assignment Name Validation

**Path:** `/sap/bc/adt/notebasic/assignments/validation`

**Categories:**

- Term: `nttatyp/validation`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

---

#### Note Type

**Path:** `/sap/bc/adt/notebasic/notetypes`

**Categories:**

- Term: `nttytyp`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Template Links:**

- **http://www.sap.com/wbobj/notebasic/nttytyp/properties**
  - Template: `/sap/bc/adt/notebasic/notetypes/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/notebasic/nttytyp/source**
  - Template: `/sap/bc/adt/notebasic/notetypes/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/notebasic/notetypes/source/formatter`

**Categories:**

- Term: `nttytyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/notebasic/notetypes/$schema`

**Categories:**

- Term: `nttytyp/schema`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/notebasic/notetypes/$configuration`

**Categories:**

- Term: `nttytyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Note Type Name Validation

**Path:** `/sap/bc/adt/notebasic/notetypes/validation`

**Categories:**

- Term: `nttytyp/validation`
  - Scheme: `http://www.sap.com/wbobj/notebasic`

---

## Number Range Management

| Collection | Path | Categories |
|------------|------|------------|
| Number Range Object | `/sap/bc/adt/numberranges/objects` | nrobnro |
| JSON Formatter | `/sap/bc/adt/numberranges/objects/source/formatter` | nrobnro/formatter |
| Server driven framework - Schema | `/sap/bc/adt/numberranges/objects/$schema` | nrobnro/schema |
| Server driven framework - Configuration | `/sap/bc/adt/numberranges/objects/$configuration` | nrobnro/configuration |
| Number Range Object Name Validation | `/sap/bc/adt/numberranges/objects/validation` | nrobnro/validation |

### Collection Details

#### Number Range Object

**Path:** `/sap/bc/adt/numberranges/objects`

**Categories:**

- Term: `nrobnro`
  - Scheme: `http://www.sap.com/wbobj/numberrangeobjects`

**Template Links:**

- **http://www.sap.com/wbobj/numberrangeobjects/nrobnro/properties**
  - Template: `/sap/bc/adt/numberranges/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/numberrangeobjects/nrobnro/source**
  - Template: `/sap/bc/adt/numberranges/objects/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/numberranges/objects/source/formatter`

**Categories:**

- Term: `nrobnro/formatter`
  - Scheme: `http://www.sap.com/wbobj/numberrangeobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/numberranges/objects/$schema`

**Categories:**

- Term: `nrobnro/schema`
  - Scheme: `http://www.sap.com/wbobj/numberrangeobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/numberranges/objects/$configuration`

**Categories:**

- Term: `nrobnro/configuration`
  - Scheme: `http://www.sap.com/wbobj/numberrangeobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Number Range Object Name Validation

**Path:** `/sap/bc/adt/numberranges/objects/validation`

**Categories:**

- Term: `nrobnro/validation`
  - Scheme: `http://www.sap.com/wbobj/numberrangeobjects`

---

## Object Type Administration

| Collection | Path | Categories |
|------------|------|------------|
| Repository Object Type | `/sap/bc/adt/objtype_admin/sval` | sval |
| Blue Tool Configurations | `/sap/bc/adt/objtype_admin/sval/configurations` | sval/config |
| Blue Tool Configurations (Metadata) | `/sap/bc/adt/objtype_admin/sval/metadata` | sval/configmetadata |
| Available TR functional usage areas | `/sap/bc/adt/objtype_admin/sval/assist/trscopes` | trscopes |
| Available options for visibility in object list | `/sap/bc/adt/objtype_admin/sval/assist/wbobjlist` | wbobjlist |
| Available WB functional usage areas | `/sap/bc/adt/objtype_admin/sval/assist/wbscopes` | wbscopes |
| Repository Object Type Name Validation | `/sap/bc/adt/objtype_admin/sval/validation` | sval/validation |
| Object Type Group | `/sap/bc/adt/objtype_admin/wgrp` | wgrp |
| Object Type Group Name Validation | `/sap/bc/adt/objtype_admin/wgrp/validation` | wgrp/validation |

### Collection Details

#### Repository Object Type

**Path:** `/sap/bc/adt/objtype_admin/sval`

**Categories:**

- Term: `sval`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Blue Tool Configurations

**Path:** `/sap/bc/adt/objtype_admin/sval/configurations`

**Categories:**

- Term: `sval/config`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

#### Blue Tool Configurations (Metadata)

**Path:** `/sap/bc/adt/objtype_admin/sval/metadata`

**Categories:**

- Term: `sval/configmetadata`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

#### Available TR functional usage areas

**Path:** `/sap/bc/adt/objtype_admin/sval/assist/trscopes`

**Categories:**

- Term: `trscopes`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

#### Available options for visibility in object list

**Path:** `/sap/bc/adt/objtype_admin/sval/assist/wbobjlist`

**Categories:**

- Term: `wbobjlist`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

#### Available WB functional usage areas

**Path:** `/sap/bc/adt/objtype_admin/sval/assist/wbscopes`

**Categories:**

- Term: `wbscopes`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

#### Repository Object Type Name Validation

**Path:** `/sap/bc/adt/objtype_admin/sval/validation`

**Categories:**

- Term: `sval/validation`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

#### Object Type Group

**Path:** `/sap/bc/adt/objtype_admin/wgrp`

**Categories:**

- Term: `wgrp`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

**Template Links:**

- **http://www.sap.com/wbobj/objtype_admin/wgrp/properties**
  - Template: `/sap/bc/adt/objtype_admin/wgrp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Object Type Group Name Validation

**Path:** `/sap/bc/adt/objtype_admin/wgrp/validation`

**Categories:**

- Term: `wgrp/validation`
  - Scheme: `http://www.sap.com/wbobj/objtype_admin`

---

## Package

| Collection | Path | Categories |
|------------|------|------------|
| Package | `/sap/bc/adt/packages` | devck |
| Package Name Validation | `/sap/bc/adt/packages/validation` | devck/validation |
| Package Constraints | `/sap/bc/adt/packages/$constraints` | devck/constraints |
| Package Settings | `/sap/bc/adt/packages/settings` | settings |

### Collection Details

#### Package

**Path:** `/sap/bc/adt/packages`

**Categories:**

- Term: `devck`
  - Scheme: `http://www.sap.com/wbobj/packages`

**Template Links:**

- **http://www.sap.com/wbobj/packages/devck/properties**
  - Template: `/sap/bc/adt/packages/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **checkuseaccess**
  - Template: `/sap/bc/adt/packages/{packagename}/useaccesses/{packageinterfacename}`
  - Title: Use Access checks
- **tree**
  - Template: `/sap/bc/adt/packages/$tree{?packagename,type}`
  - Title: Package Tree
- **applicationcomponents**
  - Template: `/sap/bc/adt/packages/valuehelps/applicationcomponents`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Application Components Value Help
- **softwarecomponents**
  - Template: `/sap/bc/adt/packages/valuehelps/softwarecomponents`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Software Components Value Help
- **transportlayers**
  - Template: `/sap/bc/adt/packages/valuehelps/transportlayers`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Transport Layers Value Help
- **translationrelevances**
  - Template: `/sap/bc/adt/packages/valuehelps/translationrelevances`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: Transport Relevances Value Help
- **abaplanguageversions**
  - Template: `/sap/bc/adt/packages/valuehelps/abaplanguageversions`
  - Type: `application/vnd.sap.adt.nameditems.v1+xml`
  - Title: ABAP Language Version Value Help

**Accepted Content Types:**

- `application/vnd.sap.adt.packages.v2+xml`
- `text/html`

---

#### Package Name Validation

**Path:** `/sap/bc/adt/packages/validation`

**Categories:**

- Term: `devck/validation`
  - Scheme: `http://www.sap.com/wbobj/packages`

---

#### Package Constraints

**Path:** `/sap/bc/adt/packages/$constraints`

**Categories:**

- Term: `devck/constraints`
  - Scheme: `http://www.sap.com/wbobj/packages`

**Accepted Content Types:**

- `application/softwareComponent.v1+json`
- `application/packageConstraints.v1+json`

---

#### Package Settings

**Path:** `/sap/bc/adt/packages/settings`

**Categories:**

- Term: `settings`
  - Scheme: `http://www.sap.com/wbobj/packages`

**Accepted Content Types:**

- `application/vnd.sap.adt.packages.settings.v2+xml`

---

## Extensibility

| Collection | Path | Categories |
|------------|------|------------|
| Predefined Field Enabling | `/sap/bc/adt/predefinedfields/objects` | PCFNPCF |
| JSON Formatter | `/sap/bc/adt/predefinedfields/objects/source/formatter` | PCFNPCF/formatter |
| Server driven framework - Schema | `/sap/bc/adt/predefinedfields/objects/$schema` | PCFNPCF/schema |
| Server driven framework - Configuration | `/sap/bc/adt/predefinedfields/objects/$configuration` | PCFNPCF/configuration |
| Predefined Field Enabling Name Validation | `/sap/bc/adt/predefinedfields/objects/validation` | PCFNPCF/validation |

### Collection Details

#### Predefined Field Enabling

**Path:** `/sap/bc/adt/predefinedfields/objects`

**Categories:**

- Term: `PCFNPCF`
  - Scheme: `http://www.sap.com/wbobj/predefinedfields`

**Template Links:**

- **http://www.sap.com/wbobj/predefinedfields/PCFNPCF/properties**
  - Template: `/sap/bc/adt/predefinedfields/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/predefinedfields/PCFNPCF/source**
  - Template: `/sap/bc/adt/predefinedfields/objects/{object_name}/source/main{?corrNr,lockHandle,version}`
- **TAKE_SNAPSHOT**
  - Template: `/sap/bc/adt/predefinedfields/objects/{pcf_node}/snapshot`
  - Title: Take Snaphot
- **TAKE_SNAPSHOT_FORCE_OVERRIDE**
  - Template: `/sap/bc/adt/predefinedfields/objects/{pcf_node}/snapshot?forceOverride=true`
  - Title: Take Snaphot

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/predefinedfields/objects/source/formatter`

**Categories:**

- Term: `PCFNPCF/formatter`
  - Scheme: `http://www.sap.com/wbobj/predefinedfields`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/predefinedfields/objects/$schema`

**Categories:**

- Term: `PCFNPCF/schema`
  - Scheme: `http://www.sap.com/wbobj/predefinedfields`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/predefinedfields/objects/$configuration`

**Categories:**

- Term: `PCFNPCF/configuration`
  - Scheme: `http://www.sap.com/wbobj/predefinedfields`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Predefined Field Enabling Name Validation

**Path:** `/sap/bc/adt/predefinedfields/objects/validation`

**Categories:**

- Term: `PCFNPCF/validation`
  - Scheme: `http://www.sap.com/wbobj/predefinedfields`

---

## Services and Queries

| Collection | Path | Categories |
|------------|------|------------|
| Service | `/sap/bc/adt/qservices/srqu001` | srqu001 |
| Service Name Validation | `/sap/bc/adt/qservices/srqu001/validation` | srqu001/validation |

### Collection Details

#### Service

**Path:** `/sap/bc/adt/qservices/srqu001`

**Categories:**

- Term: `srqu001`
  - Scheme: `http://www.sap.com/wbobj/qservices`

**Template Links:**

- **http://www.sap.com/wbobj/qservices/srqu001/properties**
  - Template: `/sap/bc/adt/qservices/srqu001/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/qservices/srqu001/source**
  - Template: `/sap/bc/adt/qservices/srqu001/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### Service Name Validation

**Path:** `/sap/bc/adt/qservices/srqu001/validation`

**Categories:**

- Term: `srqu001/validation`
  - Scheme: `http://www.sap.com/wbobj/qservices`

---

## Schema Definitions

| Collection | Path | Categories |
|------------|------|------------|
| Logical Database Schema | `/sap/bc/adt/schema_definitions/amsdtyp` | amsdtyp |
| Logical Database Schema Name Validation | `/sap/bc/adt/schema_definitions/amsdtyp/validation` | amsdtyp/validation |

### Collection Details

#### Logical Database Schema

**Path:** `/sap/bc/adt/schema_definitions/amsdtyp`

**Categories:**

- Term: `amsdtyp`
  - Scheme: `http://www.sap.com/wbobj/schema_definitions`

**Template Links:**

- **http://www.sap.com/wbobj/schema_definitions/amsdtyp/properties**
  - Template: `/sap/bc/adt/schema_definitions/amsdtyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.amdpschema.v2+xml`
- `text/html`

---

#### Logical Database Schema Name Validation

**Path:** `/sap/bc/adt/schema_definitions/amsdtyp/validation`

**Categories:**

- Term: `amsdtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/schema_definitions`

---

## Switch Framework

| Collection | Path | Categories |
|------------|------|------------|
| Feature Toggle | `/sap/bc/adt/sfw/featuretoggles` | ftg2ft |
| JSON Formatter | `/sap/bc/adt/sfw/featuretoggles/source/formatter` | ftg2ft/formatter |
| Server driven framework - Schema | `/sap/bc/adt/sfw/featuretoggles/$schema` | ftg2ft/schema |
| Server driven framework - Configuration | `/sap/bc/adt/sfw/featuretoggles/$configuration` | ftg2ft/configuration |
| Attribute Keys Value Help | `/sap/bc/adt/sfw/featuretoggles/attributes/attributeKeys` | attributeKeys |
| Attribute Values Value Help | `/sap/bc/adt/sfw/featuretoggles/attributes/attributeValues` | attributeValues |
| Types of togglable objects | `/sap/bc/adt/sfw/featuretoggles/objects/types` | objectTypes |
| Toggling | `/sap/bc/adt/sfw/featuretoggles/sfw/featuretoggles` | toggle |
| Reference Product Value Help | `/sap/bc/adt/sfw/featuretoggles/referenceProduct/values` | referenceProduct |
| Feature Toggle Name Validation | `/sap/bc/adt/sfw/featuretoggles/validation` | ftg2ft/validation |

### Collection Details

#### Feature Toggle

**Path:** `/sap/bc/adt/sfw/featuretoggles`

**Categories:**

- Term: `ftg2ft`
  - Scheme: `http://www.sap.com/wbobj/sfw`

**Template Links:**

- **http://www.sap.com/wbobj/sfw/ftg2ft/properties**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/sfw/ftg2ft/source**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/source/main{?corrNr,lockHandle,version}`
  - Type: `application/vnd.sap.adt.toggle.content.v2+json`
- **http://www.sap.com/wbobj/sfw/ftg2ft/toggle**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/toggle`
- **http://www.sap.com/wbobj/sfw/ftg2ft/check**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/check`
- **http://www.sap.com/wbobj/sfw/ftg2ft/validate**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/validate`
- **http://www.sap.com/wbobj/sfw/ftg2ft/packages/validate**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/packages/{package_name}/validate`
- **http://www.sap.com/wbobj/sfw/ftg2ft/packages/objects**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/packages/objects`
- **http://www.sap.com/wbobj/sfw/ftg2ft/dependencies/validate**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/dependencies/validate`
- **http://www.sap.com/wbobj/sfw/ftg2ft/states**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/states`
- **http://www.sap.com/wbobj/sfw/ftg2ft/runtimestate**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/runtimestate`
- **http://www.sap.com/wbobj/sfw/ftg2ft/logs**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/logs`
- **http://www.sap.com/wbobj/sfw/ftg2ft/objects**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/objects`
- **http://www.sap.com/wbobj/sfw/ftg2ft/objects/validate**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/objects/validate{?uri}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/sfw/featuretoggles/source/formatter`

**Categories:**

- Term: `ftg2ft/formatter`
  - Scheme: `http://www.sap.com/wbobj/sfw`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/sfw/featuretoggles/$schema`

**Categories:**

- Term: `ftg2ft/schema`
  - Scheme: `http://www.sap.com/wbobj/sfw`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/sfw/featuretoggles/$configuration`

**Categories:**

- Term: `ftg2ft/configuration`
  - Scheme: `http://www.sap.com/wbobj/sfw`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Attribute Keys Value Help

**Path:** `/sap/bc/adt/sfw/featuretoggles/attributes/attributeKeys`

**Categories:**

- Term: `attributeKeys`
  - Scheme: `http://www.sap.com/wbobj/sfw`

---

#### Attribute Values Value Help

**Path:** `/sap/bc/adt/sfw/featuretoggles/attributes/attributeValues`

**Categories:**

- Term: `attributeValues`
  - Scheme: `http://www.sap.com/wbobj/sfw`

---

#### Types of togglable objects

**Path:** `/sap/bc/adt/sfw/featuretoggles/objects/types`

**Categories:**

- Term: `objectTypes`
  - Scheme: `http://www.sap.com/wbobj/sfw`

---

#### Toggling

**Path:** `/sap/bc/adt/sfw/featuretoggles/sfw/featuretoggles`

**Categories:**

- Term: `toggle`
  - Scheme: `http://www.sap.com/wbobj/sfw`

**Template Links:**

- **http://www.sap.com/wbobj/sfw/ftg2ft/toggle**
  - Template: `/sap/bc/adt/sfw/featuretoggles/{object_name}/toggle`

---

#### Reference Product Value Help

**Path:** `/sap/bc/adt/sfw/featuretoggles/referenceProduct/values`

**Categories:**

- Term: `referenceProduct`
  - Scheme: `http://www.sap.com/wbobj/sfw`

---

#### Feature Toggle Name Validation

**Path:** `/sap/bc/adt/sfw/featuretoggles/validation`

**Categories:**

- Term: `ftg2ft/validation`
  - Scheme: `http://www.sap.com/wbobj/sfw`

---

## Situation Handling

| Collection | Path | Categories |
|------------|------|------------|
| Situation Object | `/sap/bc/adt/sit/sitotyp` | sitotyp |
| JSON Formatter | `/sap/bc/adt/sit/sitotyp/source/formatter` | sitotyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/sit/sitotyp/$schema` | sitotyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/sit/sitotyp/$configuration` | sitotyp/configuration |
| Object Name Validation | `/sap/bc/adt/sit/sitotyp/validation` | sitotyp/validation |

### Collection Details

#### Situation Object

**Path:** `/sap/bc/adt/sit/sitotyp`

**Categories:**

- Term: `sitotyp`
  - Scheme: `http://www.sap.com/wbobj/sit`

**Template Links:**

- **http://www.sap.com/wbobj/sit/sitotyp/properties**
  - Template: `/sap/bc/adt/sit/sitotyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/sit/sitotyp/source**
  - Template: `/sap/bc/adt/sit/sitotyp/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/sit/sitotyp/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/sit/sitotyp/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/sit/sitotyp/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/sit/sitotyp/source/formatter`

**Categories:**

- Term: `sitotyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/sit`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/sit/sitotyp/$schema`

**Categories:**

- Term: `sitotyp/schema`
  - Scheme: `http://www.sap.com/wbobj/sit`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/sit/sitotyp/$configuration`

**Categories:**

- Term: `sitotyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/sit`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/sit/sitotyp/validation`

**Categories:**

- Term: `sitotyp/validation`
  - Scheme: `http://www.sap.com/wbobj/sit`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Software Component Relations | `/sap/bc/adt/swc/relations` | swcrtyp |
| JSON Formatter | `/sap/bc/adt/swc/relations/source/formatter` | swcrtyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/swc/relations/$schema` | swcrtyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/swc/relations/$configuration` | swcrtyp/configuration |
| Object Name Validation | `/sap/bc/adt/swc/relations/validation` | swcrtyp/validation |

### Collection Details

#### Software Component Relations

**Path:** `/sap/bc/adt/swc/relations`

**Categories:**

- Term: `swcrtyp`
  - Scheme: `http://www.sap.com/wbobj/softwarecomponent`

**Template Links:**

- **http://www.sap.com/wbobj/softwarecomponent/swcrtyp/properties**
  - Template: `/sap/bc/adt/swc/relations/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/softwarecomponent/swcrtyp/source**
  - Template: `/sap/bc/adt/swc/relations/{object_name}/source/main{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/objects/new/schema/additional**
  - Template: `/sap/bc/adt/swc/relations/$new/schema{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Schema
- **http://www.sap.com/adt/categories/objects/new/configuration/additional**
  - Template: `/sap/bc/adt/swc/relations/$new/configuration{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Configuration
- **http://www.sap.com/adt/categories/objects/new/content/additional**
  - Template: `/sap/bc/adt/swc/relations/$new/content{?relatedObjectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.content.v1+json; framework=newObjectTypes.v1`
  - Title: Server driven framework - Content
- **http://www.sap.com/adt/categories/objects/values/domainspecificnameditems**
  - Template: `/sap/bc/adt/swc/relations/$values{?name,maxItemCount,path,kind,objectUri}`
  - Type: `application/vnd.sap.adt.serverdriven.valuehelp.result.v1+xml; framework=objectTypes.v1`
- **http://www.sap.com/adt/serverdriven/sideeffect**
  - Template: `/sap/bc/adt/swc/relations/$new/sideeffect{?path,determination,featureControl}`
  - Type: `application/vnd.sap.adt.serverdriven.sideeffects.result.v1+xml; framework=newObjectTypes.v1`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v2+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/swc/relations/source/formatter`

**Categories:**

- Term: `swcrtyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/softwarecomponent`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/swc/relations/$schema`

**Categories:**

- Term: `swcrtyp/schema`
  - Scheme: `http://www.sap.com/wbobj/softwarecomponent`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/swc/relations/$configuration`

**Categories:**

- Term: `swcrtyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/softwarecomponent`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/swc/relations/validation`

**Categories:**

- Term: `swcrtyp/validation`
  - Scheme: `http://www.sap.com/wbobj/softwarecomponent`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| Transport Object Definition | `/sap/bc/adt/transportobject/objects` | tobjtob |
| JSON Formatter | `/sap/bc/adt/transportobject/objects/source/formatter` | tobjtob/formatter |
| Server driven framework - Schema | `/sap/bc/adt/transportobject/objects/$schema` | tobjtob/schema |
| Server driven framework - Configuration | `/sap/bc/adt/transportobject/objects/$configuration` | tobjtob/configuration |
| Transport Object Definition Name Validation | `/sap/bc/adt/transportobject/objects/validation` | tobjtob/validation |

### Collection Details

#### Transport Object Definition

**Path:** `/sap/bc/adt/transportobject/objects`

**Categories:**

- Term: `tobjtob`
  - Scheme: `http://www.sap.com/wbobj/transportobjects`

**Template Links:**

- **http://www.sap.com/wbobj/transportobjects/tobjtob/properties**
  - Template: `/sap/bc/adt/transportobject/objects/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/transportobjects/tobjtob/source**
  - Template: `/sap/bc/adt/transportobject/objects/{object_name}/source/main{?corrNr,lockHandle,version}`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/transportobject/objects/source/formatter`

**Categories:**

- Term: `tobjtob/formatter`
  - Scheme: `http://www.sap.com/wbobj/transportobjects`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/transportobject/objects/$schema`

**Categories:**

- Term: `tobjtob/schema`
  - Scheme: `http://www.sap.com/wbobj/transportobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/transportobject/objects/$configuration`

**Categories:**

- Term: `tobjtob/configuration`
  - Scheme: `http://www.sap.com/wbobj/transportobjects`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### Transport Object Definition Name Validation

**Path:** `/sap/bc/adt/transportobject/objects/validation`

**Categories:**

- Term: `tobjtob/validation`
  - Scheme: `http://www.sap.com/wbobj/transportobjects`

---

## Connectivity

| Collection | Path | Categories |
|------------|------|------------|
| ABAP Messaging Channel | `/sap/bc/adt/uc_object_type_group/samc` | samc |
| AMC Message Type | `/sap/bc/adt/uc_object_type_group/samc/messagetype/values` | messagetype |
| AMC Scope | `/sap/bc/adt/uc_object_type_group/samc/scope/values` | scope |
| AMC Virus Scan Outgoing | `/sap/bc/adt/uc_object_type_group/samc/virusscan/values` | virusscan |
| AMC Activity | `/sap/bc/adt/uc_object_type_group/samc/activity/values` | activity |
| AMC Program Type | `/sap/bc/adt/uc_object_type_group/samc/progtype/values` | progtype |
| ABAP Messaging Channel Name Validation | `/sap/bc/adt/uc_object_type_group/samc/validation` | samc/validation |
| ABAP Push Channel Application | `/sap/bc/adt/uc_object_type_group/sapc` | sapc |
| APC Connection Type | `/sap/bc/adt/uc_object_type_group/sapc/connectiontypes/values` | connectiontype |
| APC Protocol Type | `/sap/bc/adt/uc_object_type_group/sapc/protocoltypes/values` | protocoltype |
| APC Virus Scan Outgoing | `/sap/bc/adt/uc_object_type_group/sapc/virusscanout/values` | virusscanout |
| APC Virus Scan Ingoing | `/sap/bc/adt/uc_object_type_group/sapc/virusscanin/values` | virusscanin |
| APC Superclass determination | `/sap/bc/adt/uc_object_type_group/sapc/superclass/values` | superclass |
| APC Superclass determination | `/sap/bc/adt/uc_object_type_group/sapc/classproperties/values` | classproperties |
| URL for Testscenario | `/sap/bc/adt/uc_object_type_group/sapc/testurl/values` | testurl |
| Exist Service Pfad | `/sap/bc/adt/uc_object_type_group/sapc/service_path/values` | service_path |
| ABAP Push Channel Application Name Validation | `/sap/bc/adt/uc_object_type_group/sapc/validation` | sapc/validation |

### Collection Details

#### ABAP Messaging Channel

**Path:** `/sap/bc/adt/uc_object_type_group/samc`

**Categories:**

- Term: `samc`
  - Scheme: `http://www.sap.com/adt/connectivity`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### AMC Message Type

**Path:** `/sap/bc/adt/uc_object_type_group/samc/messagetype/values`

**Categories:**

- Term: `messagetype`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### AMC Scope

**Path:** `/sap/bc/adt/uc_object_type_group/samc/scope/values`

**Categories:**

- Term: `scope`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### AMC Virus Scan Outgoing

**Path:** `/sap/bc/adt/uc_object_type_group/samc/virusscan/values`

**Categories:**

- Term: `virusscan`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### AMC Activity

**Path:** `/sap/bc/adt/uc_object_type_group/samc/activity/values`

**Categories:**

- Term: `activity`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### AMC Program Type

**Path:** `/sap/bc/adt/uc_object_type_group/samc/progtype/values`

**Categories:**

- Term: `progtype`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### ABAP Messaging Channel Name Validation

**Path:** `/sap/bc/adt/uc_object_type_group/samc/validation`

**Categories:**

- Term: `samc/validation`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### ABAP Push Channel Application

**Path:** `/sap/bc/adt/uc_object_type_group/sapc`

**Categories:**

- Term: `sapc`
  - Scheme: `http://www.sap.com/adt/connectivity`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### APC Connection Type

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/connectiontypes/values`

**Categories:**

- Term: `connectiontype`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### APC Protocol Type

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/protocoltypes/values`

**Categories:**

- Term: `protocoltype`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### APC Virus Scan Outgoing

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/virusscanout/values`

**Categories:**

- Term: `virusscanout`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### APC Virus Scan Ingoing

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/virusscanin/values`

**Categories:**

- Term: `virusscanin`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### APC Superclass determination

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/superclass/values`

**Categories:**

- Term: `superclass`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### APC Superclass determination

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/classproperties/values`

**Categories:**

- Term: `classproperties`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### URL for Testscenario

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/testurl/values`

**Categories:**

- Term: `testurl`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### Exist Service Pfad

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/service_path/values`

**Categories:**

- Term: `service_path`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### ABAP Push Channel Application Name Validation

**Path:** `/sap/bc/adt/uc_object_type_group/sapc/validation`

**Categories:**

- Term: `sapc/validation`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

## Connectivity

| Collection | Path | Categories |
|------------|------|------------|
| HTTP Service | `/sap/bc/adt/ucon/httpservices` | http |
| Object Name Validation | `/sap/bc/adt/ucon/httpservices/validation` | http/validation |
| Handlerclasses search | `/sap/bc/adt/ucon/httpservices/HandlerClassesUri` | handlerclasses |

### Collection Details

#### HTTP Service

**Path:** `/sap/bc/adt/ucon/httpservices`

**Categories:**

- Term: `http`
  - Scheme: `http://www.sap.com/adt/connectivity`

**Template Links:**

- **http://www.sap.com/adt/connectivity/http/properties**
  - Template: `/sap/bc/adt/ucon/httpservices/{object_name}{?class_name}`

**Accepted Content Types:**

- `application/vnd.sap.adt.uconn.http.v1+xml`
- `text/html`

---

#### Object Name Validation

**Path:** `/sap/bc/adt/ucon/httpservices/validation`

**Categories:**

- Term: `http/validation`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

#### Handlerclasses search

**Path:** `/sap/bc/adt/ucon/httpservices/HandlerClassesUri`

**Categories:**

- Term: `handlerclasses`
  - Scheme: `http://www.sap.com/adt/connectivity`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| API Catalog | `/sap/bc/adt/wbobj/apictyp` | apictyp |
| JSON Formatter | `/sap/bc/adt/wbobj/apictyp/source/formatter` | apictyp/formatter |
| Server driven framework - Schema | `/sap/bc/adt/wbobj/apictyp/$schema` | apictyp/schema |
| Server driven framework - Configuration | `/sap/bc/adt/wbobj/apictyp/$configuration` | apictyp/configuration |
| API Catalog Name Validation | `/sap/bc/adt/wbobj/apictyp/validation` | apictyp/validation |

### Collection Details

#### API Catalog

**Path:** `/sap/bc/adt/wbobj/apictyp`

**Categories:**

- Term: `apictyp`
  - Scheme: `http://www.sap.com/wbobj/apicatalogs`

**Template Links:**

- **http://www.sap.com/wbobj/apicatalogs/apictyp/properties**
  - Template: `/sap/bc/adt/wbobj/apictyp/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/apicatalogs/apictyp/source**
  - Template: `/sap/bc/adt/wbobj/apictyp/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/wbobj/apictyp/source/formatter`

**Categories:**

- Term: `apictyp/formatter`
  - Scheme: `http://www.sap.com/wbobj/apicatalogs`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/wbobj/apictyp/$schema`

**Categories:**

- Term: `apictyp/schema`
  - Scheme: `http://www.sap.com/wbobj/apicatalogs`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/wbobj/apictyp/$configuration`

**Categories:**

- Term: `apictyp/configuration`
  - Scheme: `http://www.sap.com/wbobj/apicatalogs`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### API Catalog Name Validation

**Path:** `/sap/bc/adt/wbobj/apictyp/validation`

**Categories:**

- Term: `apictyp/validation`
  - Scheme: `http://www.sap.com/wbobj/apicatalogs`

---

## Others

| Collection | Path | Categories |
|------------|------|------------|
| WMPC Application | `/sap/bc/adt/wmpc/applications` | wmpc |
| JSON Formatter | `/sap/bc/adt/wmpc/applications/source/formatter` | wmpc/formatter |
| Server driven framework - Schema | `/sap/bc/adt/wmpc/applications/$schema` | wmpc/schema |
| Server driven framework - Configuration | `/sap/bc/adt/wmpc/applications/$configuration` | wmpc/configuration |
| WMPC Application Name Validation | `/sap/bc/adt/wmpc/applications/validation` | wmpc/validation |

### Collection Details

#### WMPC Application

**Path:** `/sap/bc/adt/wmpc/applications`

**Categories:**

- Term: `wmpc`
  - Scheme: `http://www.sap.com/wbobj/workloadclasses`

**Template Links:**

- **http://www.sap.com/wbobj/workloadclasses/wmpc/properties**
  - Template: `/sap/bc/adt/wmpc/applications/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/wbobj/workloadclasses/wmpc/source**
  - Template: `/sap/bc/adt/wmpc/applications/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.blues.v1+xml`
- `text/html`

---

#### JSON Formatter

**Path:** `/sap/bc/adt/wmpc/applications/source/formatter`

**Categories:**

- Term: `wmpc/formatter`
  - Scheme: `http://www.sap.com/wbobj/workloadclasses`

**Accepted Content Types:**

- `application/json`

---

#### Server driven framework - Schema

**Path:** `/sap/bc/adt/wmpc/applications/$schema`

**Categories:**

- Term: `wmpc/schema`
  - Scheme: `http://www.sap.com/wbobj/workloadclasses`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.schema.v1+json; framework=objectTypes.v1`

---

#### Server driven framework - Configuration

**Path:** `/sap/bc/adt/wmpc/applications/$configuration`

**Categories:**

- Term: `wmpc/configuration`
  - Scheme: `http://www.sap.com/wbobj/workloadclasses`

**Accepted Content Types:**

- `application/vnd.sap.adt.serverdriven.configuration.v1+json; framework=objectTypes.v1`

---

#### WMPC Application Name Validation

**Path:** `/sap/bc/adt/wmpc/applications/validation`

**Categories:**

- Term: `wmpc/validation`
  - Scheme: `http://www.sap.com/wbobj/workloadclasses`

---

## Custom Analytical Queries

| Collection | Path | Categories |
|------------|------|------------|
| Analytical custom query | `/sap/bc/adt/ana/aqd` | ddlsources |

### Collection Details

#### Analytical custom query

**Path:** `/sap/bc/adt/ana/aqd`

**Categories:**

- Term: `ddlsources`
  - Scheme: `http://www.sap.com/adt/categories/ana/aqd`

**Template Links:**

- **http://www.sap.com/adt/categories/ana/aqd/ddlsource**
  - Template: `/sap/bc/adt/ana/aqd/ddlsource/{object_name}/source/main/{?corrNr,lockHandle,version}`
- **http://www.sap.com/adt/categories/ana/aqd/ddlsource/source**
  - Template: `/sap/bc/adt/ana/aqd/ddlsource/source/{object_name}`
- **http://www.sap.com/adt/categories/ana/aqd/elementinfos**
  - Template: `/sap/bc/adt/ana/aqd/elementinfos/{action}`
- **http://www.sap.com/adt/categories/ana/aqd/ddl/source**
  - Template: `/sap/bc/adt/ana/aqd/ddl/source/{action}`
- **http://www.sap.com/adt/categories/ana/aqd/ddlsource**
  - Template: `/sap/bc/adt/ana/aqd/ato/settings`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddlSource+xml`

---

## ABAP CDS Dependency Graph

| Collection | Path | Categories |
|------------|------|------------|
| ABAP CDS Dependency Graph | `/sap/bc/adt/ddic/cds/dependencygraph` | dependencygraph |

### Collection Details

#### ABAP CDS Dependency Graph

**Path:** `/sap/bc/adt/ddic/cds/dependencygraph`

**Categories:**

- Term: `dependencygraph`
  - Scheme: `http://www.sap.com/adt/categories/ddic/cds/dependencygraph`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/cds/dependencygraph**
  - Template: `/sap/bc/adt/ddic/cds/dependencygraph/{source}{?usageType}`
  - Type: `application/xml`
  - Title: ABAP CDS Dependency Graph Source

**Accepted Content Types:**

- `application/xml`

---

## Enterprise Services

| Collection | Path | Categories |
|------------|------|------------|
| Semantic Contract | `/sap/bc/esproxy/semanticcontracts` | SemanticContract |
| Contract | `/sap/bc/esproxy/contracts` | Contract |
| Contract Implementation | `/sap/bc/esproxy/contractimplementations` | ContractImplementation |
| Integration Scenario Definition | `/sap/bc/esproxy/integrationscenariodefns` | IntegrationScenarioDefinition |
| Proxy Data Type | `/sap/bc/esproxy/datatypes` | ProxyDataType |
| Proxy Message Type | `/sap/bc/esproxy/messagetypes` | ProxyMessageType |
| Service Consumer | `/sap/bc/esproxy/serviceconsumers` | ServiceConsumer |
| Service Provider | `/sap/bc/esproxy/serviceproviders` | ServiceProvider |
| Operation Mapping | `/sap/bc/esproxy/operationmappings` | OperationMapping |
| Consumer Mapping | `/sap/bc/esproxy/consumermappings` | ConsumerMapping |
| Consumer Factory | `/sap/bc/esproxy/consumerfactories` | ConsumerFactory |
| Proxy Generic Search | `/sap/bc/esproxy/search` | ProxyGenericSearch |
| Proxy Specific Browse Search | `/sap/bc/esproxy/proxysearch` | ProxySpecificBrowseSearch |
| Validate Proxy Name | `/sap/bc/esproxy/validate` | ValidateProxyName |
| SOA Manager | `/sap/bc/esproxy/soamanager` | SoaManager |
| Enterprise Services Repository Search | `/sap/bc/esproxy/esrsearch` | EsrSearch |
| ESR SCV Search | `/sap/bc/esproxy/esrscv` | EsrScvSearch |
| Services Registry Search | `/sap/bc/esproxy/srsearch` | SrSearch |
| RFC Consumer | `/sap/bc/esproxy/rfcconsumers` | RFCConsumer |
| Proxy Activation | `/sap/bc/esproxy/activation` | ProxyActivation |

### Collection Details

#### Semantic Contract

**Path:** `/sap/bc/esproxy/semanticcontracts`

**Categories:**

- Term: `SemanticContract`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Contract

**Path:** `/sap/bc/esproxy/contracts`

**Categories:**

- Term: `Contract`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Contract Implementation

**Path:** `/sap/bc/esproxy/contractimplementations`

**Categories:**

- Term: `ContractImplementation`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Integration Scenario Definition

**Path:** `/sap/bc/esproxy/integrationscenariodefns`

**Categories:**

- Term: `IntegrationScenarioDefinition`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Proxy Data Type

**Path:** `/sap/bc/esproxy/datatypes`

**Categories:**

- Term: `ProxyDataType`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Proxy Message Type

**Path:** `/sap/bc/esproxy/messagetypes`

**Categories:**

- Term: `ProxyMessageType`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Service Consumer

**Path:** `/sap/bc/esproxy/serviceconsumers`

**Categories:**

- Term: `ServiceConsumer`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Service Provider

**Path:** `/sap/bc/esproxy/serviceproviders`

**Categories:**

- Term: `ServiceProvider`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Operation Mapping

**Path:** `/sap/bc/esproxy/operationmappings`

**Categories:**

- Term: `OperationMapping`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Consumer Mapping

**Path:** `/sap/bc/esproxy/consumermappings`

**Categories:**

- Term: `ConsumerMapping`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Consumer Factory

**Path:** `/sap/bc/esproxy/consumerfactories`

**Categories:**

- Term: `ConsumerFactory`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Proxy Generic Search

**Path:** `/sap/bc/esproxy/search`

**Categories:**

- Term: `ProxyGenericSearch`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Proxy Specific Browse Search

**Path:** `/sap/bc/esproxy/proxysearch`

**Categories:**

- Term: `ProxySpecificBrowseSearch`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Validate Proxy Name

**Path:** `/sap/bc/esproxy/validate`

**Categories:**

- Term: `ValidateProxyName`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### SOA Manager

**Path:** `/sap/bc/esproxy/soamanager`

**Categories:**

- Term: `SoaManager`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Enterprise Services Repository Search

**Path:** `/sap/bc/esproxy/esrsearch`

**Categories:**

- Term: `EsrSearch`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### ESR SCV Search

**Path:** `/sap/bc/esproxy/esrscv`

**Categories:**

- Term: `EsrScvSearch`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Services Registry Search

**Path:** `/sap/bc/esproxy/srsearch`

**Categories:**

- Term: `SrSearch`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### RFC Consumer

**Path:** `/sap/bc/esproxy/rfcconsumers`

**Categories:**

- Term: `RFCConsumer`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

#### Proxy Activation

**Path:** `/sap/bc/esproxy/activation`

**Categories:**

- Term: `ProxyActivation`
  - Scheme: `http://www.sap.com/adt/categories/enterpriseservices`

---

## Runtime Memory Analysis

| Collection | Path | Categories |
|------------|------|------------|
| Runtime Memory Analysis: Snapshots | `/sap/bc/adt/runtime/memory/snapshots` | snapshots |

### Collection Details

#### Runtime Memory Analysis: Snapshots

**Path:** `/sap/bc/adt/runtime/memory/snapshots`

**Categories:**

- Term: `snapshots`
  - Scheme: `http://www.sap.com/adt/runtime/memory`

**Template Links:**

- **snapshots**
  - Template: `/sap/bc/adt/runtime/memory/snapshots{?user,originalUser}`
- **snapshot**
  - Template: `/sap/bc/adt/runtime/memory/snapshots/{snapshotId}`
- **snapshot-ranking-list**
  - Template: `/sap/bc/adt/runtime/memory/snapshots/{snapshotId}/rankinglist{?maxNumberOfObjects,excludeAbapType*,sortAscending,sortByColumnName,groupByParentType}`
- **snapshots-delta-ranking-list**
  - Template: `/sap/bc/adt/runtime/memory/snapdelta/rankinglist{?uri1,uri2,maxNumberOfObjects,excludeAbapType*,sortAscending,sortByColumnName,groupByParentType}`
- **snapshot-children**
  - Template: `/sap/bc/adt/runtime/memory/snapshots/{snapshotId}/children{?parentKey,maxNumberOfObjects,sortAscending,sortByColumnName}`
- **snapshots-delta-children**
  - Template: `/sap/bc/adt/runtime/memory/snapdelta/children{?uri1,uri2,parentKey,maxNumberOfObjects,sortAscending,sortByColumnName}`
- **snapshot-references**
  - Template: `/sap/bc/adt/runtime/memory/snapshots/{snapshotId}/references{?objectKey,maxNumberOfReferences}`
- **snapshots-delta-references**
  - Template: `/sap/bc/adt/runtime/memory/snapdelta/references{?uri1,uri2,objectKey,maxNumberOfReferences}`
- **snapshot-overview**
  - Template: `/sap/bc/adt/runtime/memory/snapshots/{snapshotId}/overview`
- **snapshots-delta-overview**
  - Template: `/sap/bc/adt/runtime/memory/snapdelta/overview{?uri1,uri2}`

---

## ABAP DCL Sources

| Collection | Path | Categories |
|------------|------|------------|
| DCL Language Help Resource | `/sap/bc/adt/docu/dcl/langu` | dcllanguagehelp |
| DCL Parser Information Resource | `/sap/bc/adt/acm/dcl/parser` | dclparser |
| DCL Element Info Resource | `/sap/bc/adt/acm/dcl/elementinfo` | elementinfo |
| DCL Sources Validation | `/sap/bc/adt/acm/dcl/validation` | validation |
| DCL Sources | `/sap/bc/adt/acm/dcl/sources` | dclsources |
| ACM Repository Objects Resource | `/sap/bc/adt/acm/dcl/repositoryaccess` | repositoryaccess |

### Collection Details

#### DCL Language Help Resource

**Path:** `/sap/bc/adt/docu/dcl/langu`

**Categories:**

- Term: `dcllanguagehelp`
  - Scheme: `http://www.sap.com/adt/categories/acm/dclsources`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/dcl/langu/docu**
  - Template: `/sap/bc/adt/docu/dcl/langu{?dclLanguageHelpId,dclsName}`

---

#### DCL Parser Information Resource

**Path:** `/sap/bc/adt/acm/dcl/parser`

**Categories:**

- Term: `dclparser`
  - Scheme: `http://www.sap.com/adt/categories/acm/dclsources`

---

#### DCL Element Info Resource

**Path:** `/sap/bc/adt/acm/dcl/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/adt/categories/acm/dclsources`

**Template Links:**

- **http://www.sap.com/adt/categories/acm/dcl/elementinfo**
  - Template: `/sap/bc/adt/acm/dcl/elementinfo{?path,path_type}`

---

#### DCL Sources Validation

**Path:** `/sap/bc/adt/acm/dcl/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/acm/dclsources`

**Template Links:**

- **http://www.sap.com/adt/categories/acm/dclsources/validation**
  - Template: `/sap/bc/adt/acm/dcl/validation{?objname,packagename,description,template}`

---

#### DCL Sources

**Path:** `/sap/bc/adt/acm/dcl/sources`

**Categories:**

- Term: `dclsources`
  - Scheme: `http://www.sap.com/adt/categories/acm/dclsources`

**Template Links:**

- **http://www.sap.com/adt/categories/acm/dclsources/properties**
  - Template: `/sap/bc/adt/acm/dcl/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/adt/categories/acm/dclsources/source**
  - Template: `/sap/bc/adt/acm/dcl/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.dclSource+xml`

---

#### ACM Repository Objects Resource

**Path:** `/sap/bc/adt/acm/dcl/repositoryaccess`

**Categories:**

- Term: `repositoryaccess`
  - Scheme: `http://www.sap.com/adt/categories/acm/dclsources`

**Template Links:**

- **http://www.sap.com/adt/categories/acm/dcl/repositoryaccess**
  - Template: `/sap/bc/adt/acm/dcl/repositoryaccess{?authorizationObject,authorizationField,authorizationValue,aspect,role,pfcgMapping,conditionset,sacfScenario,switchName,toggleName}`

---

## Annotation Pushdown

| Collection | Path | Categories |
|------------|------|------------|
| SADL: Annotation Pushdown Prepare | `/sap/bc/adt/sadl/gw/annopush/prepare` | prepare |
| SADL: Annotation Pushdown Push | `/sap/bc/adt/sadl/gw/annopush/push` | push |
| SADL: Annotation Pushdown Finalize | `/sap/bc/adt/sadl/gw/annopush/finalize` | finalize |
| SADL: Annotation Pushdown Validate | `/sap/bc/adt/sadl/gw/annopush/validate` | validate |

### Collection Details

#### SADL: Annotation Pushdown Prepare

**Path:** `/sap/bc/adt/sadl/gw/annopush/prepare`

**Categories:**

- Term: `prepare`
  - Scheme: `http://www.sap.com/adt/categories/sadl/gw/annopush`

**Template Links:**

- **http://www.sap.com/adt/categories/sadl/gw/annopush/prepare**
  - Template: `/sap/bc/adt/sadl/gw/annopush/prepare{?packagename, transportid, layer, servicename}`

**Accepted Content Types:**

- `application/xml`

---

#### SADL: Annotation Pushdown Push

**Path:** `/sap/bc/adt/sadl/gw/annopush/push`

**Categories:**

- Term: `push`
  - Scheme: `http://www.sap.com/adt/categories/sadl/gw/annopush`

**Template Links:**

- **http://www.sap.com/adt/categories/sadl/gw/annopush/push**
  - Template: `/sap/bc/adt/sadl/gw/annopush/push{?packagename, transportid, layer, servicename}`

**Accepted Content Types:**

- `application/xml`

---

#### SADL: Annotation Pushdown Finalize

**Path:** `/sap/bc/adt/sadl/gw/annopush/finalize`

**Categories:**

- Term: `finalize`
  - Scheme: `http://www.sap.com/adt/categories/sadl/gw/annopush`

**Template Links:**

- **http://www.sap.com/adt/categories/sadl/gw/annopush/finalize**
  - Template: `/sap/bc/adt/sadl/gw/annopush/finalize{?packagename, transportid, layer, servicename}`

**Accepted Content Types:**

- `application/xml`

---

#### SADL: Annotation Pushdown Validate

**Path:** `/sap/bc/adt/sadl/gw/annopush/validate`

**Categories:**

- Term: `validate`
  - Scheme: `http://www.sap.com/adt/categories/sadl/gw/annopush`

**Template Links:**

- **http://www.sap.com/adt/categories/sadl/gw/annopush/validate**
  - Template: `/sap/bc/adt/sadl/gw/annopush/validate{?servicename}`

**Accepted Content Types:**

- `application/xml`
- `application/xml`

---

## Annotation Pushdown: Get Meta Data Extentions

| Collection | Path | Categories |
|------------|------|------------|
| SADL: Annotation Pushdown Metadata Extentions | `/sap/bc/adt/sadl/gw/mde` | SADLAnnotationPushdownMetaDataExtensions |

### Collection Details

#### SADL: Annotation Pushdown Metadata Extentions

**Path:** `/sap/bc/adt/sadl/gw/mde`

**Categories:**

- Term: `SADLAnnotationPushdownMetaDataExtensions`
  - Scheme: `http://www.sap.com/adt/categories/sadl/gw/mde`

**Accepted Content Types:**

- `application/xml`

---

## Feed Repository

| Collection | Path | Categories |
|------------|------|------------|
| Data Provider Repository | `/sap/bc/adt/dataproviders` | repository |

### Collection Details

#### Data Provider Repository

**Path:** `/sap/bc/adt/dataproviders`

**Categories:**

- Term: `repository`
  - Scheme: `http://www.sap.com/adt/categories/dataproviders`

---

## Flights

| Collection | Path | Categories |
|------------|------|------------|
| Carriers | `/sap/bc/adt/examples/flight/carriers` | carriers |
| Flights | `/sap/bc/adt/examples/flight/flights` | flights |

### Collection Details

#### Carriers

**Path:** `/sap/bc/adt/examples/flight/carriers`

**Categories:**

- Term: `carriers`
  - Scheme: `http://www.sap.com/adt/categories/examples/flights`

---

#### Flights

**Path:** `/sap/bc/adt/examples/flight/flights`

**Categories:**

- Term: `flights`
  - Scheme: `http://www.sap.com/adt/categories/examples/flights`

**Template Links:**

- **http://www.sap.com/adt/relations/examples/flight**
  - Template: `/sap/bc/adt/examples/flight/flights/{carrier_id}/{connection_id}/{flight_date}`
  - Type: `application/xml`
  - Title: Single Flight

**Accepted Content Types:**

- `application/xml`

---

## External tools configuration

| Collection | Path | Categories |
|------------|------|------------|
| Business Application Studio configuration | `/sap/bc/adt/externaltools/bas/configurations` | configurations |
| Business Application Studio configuration (Metadata) | `/sap/bc/adt/externaltools/bas/metadata` | configurationsMetadata |

### Collection Details

#### Business Application Studio configuration

**Path:** `/sap/bc/adt/externaltools/bas/configurations`

**Categories:**

- Term: `configurations`
  - Scheme: `http://www.sap.com/adt/categories/externaltools/bas`

---

#### Business Application Studio configuration (Metadata)

**Path:** `/sap/bc/adt/externaltools/bas/metadata`

**Categories:**

- Term: `configurationsMetadata`
  - Scheme: `http://www.sap.com/adt/categories/externaltools/bas`

---

## Feed Repository

| Collection | Path | Categories |
|------------|------|------------|
| Feed Repository | `/sap/bc/adt/feeds` | repository |
| Feed Variants | `/sap/bc/adt/feeds/variants` | variants |

### Collection Details

#### Feed Repository

**Path:** `/sap/bc/adt/feeds`

**Categories:**

- Term: `repository`
  - Scheme: `http://www.sap.com/adt/categories/feeds`

---

#### Feed Variants

**Path:** `/sap/bc/adt/feeds/variants`

**Categories:**

- Term: `variants`
  - Scheme: `http://www.sap.com/adt/categories/feeds`

---

## Reentranceticket

| Collection | Path | Categories |
|------------|------|------------|
| Security Reentranceticket | `/sap/bc/adt/security/reentranceticket` | reentranceticket |

### Collection Details

#### Security Reentranceticket

**Path:** `/sap/bc/adt/security/reentranceticket`

**Categories:**

- Term: `reentranceticket`
  - Scheme: `http://www.sap.com/adt/categories/security`

---

## ADT Rest Framework Resources

| Collection | Path | Categories |
|------------|------|------------|
| ADT HTTP(S) Endpoint | `https://rsc-079-adm.wdf.sap.corp:443/sap/bc/adt` | httpendpoint |
| ADT Stateful HTTP(S) Endpoint | `https://rsc-079-adm.wdf.sap.corp:443/sap/bc/adt` | httpendpointStateful |

### Collection Details

#### ADT HTTP(S) Endpoint

**Path:** `https://rsc-079-adm.wdf.sap.corp:443/sap/bc/adt`

**Categories:**

- Term: `httpendpoint`
  - Scheme: `http://www.sap.com/adt/categories/system/communication/services`

---

#### ADT Stateful HTTP(S) Endpoint

**Path:** `https://rsc-079-adm.wdf.sap.corp:443/sap/bc/adt`

**Categories:**

- Term: `httpendpointStateful`
  - Scheme: `http://www.sap.com/adt/categories/system/communication/services`

---

## Performance Test Framework

| Collection | Path | Categories |
|------------|------|------------|
| Abap Performance Test Runner | `/sap/bc/adt/performance/runner` | performancetest |
| Abap Processes | `/sap/bc/adt/performance/processes` | processes |

### Collection Details

#### Abap Performance Test Runner

**Path:** `/sap/bc/adt/performance/runner`

**Categories:**

- Term: `performancetest`
  - Scheme: `http://www.sap.com/adt/categories/performance`

---

#### Abap Processes

**Path:** `/sap/bc/adt/performance/processes`

**Categories:**

- Term: `processes`
  - Scheme: `http://www.sap.com/adt/categories/performance`

---

## Client

| Collection | Path | Categories |
|------------|------|------------|
| Client | `/sap/bc/adt/system/clients` | clients |

### Collection Details

#### Client

**Path:** `/sap/bc/adt/system/clients`

**Categories:**

- Term: `clients`
  - Scheme: `http://www.sap.com/adt/categories/system/clients`

---

## System Information

| Collection | Path | Categories |
|------------|------|------------|
| System Information | `/sap/bc/adt/system/information` | information |
| Installed Components | `/sap/bc/adt/system/components` | components |

### Collection Details

#### System Information

**Path:** `/sap/bc/adt/system/information`

**Categories:**

- Term: `information`
  - Scheme: `http://www.sap.com/adt/categories/system`

---

#### Installed Components

**Path:** `/sap/bc/adt/system/components`

**Categories:**

- Term: `components`
  - Scheme: `http://www.sap.com/adt/categories/system`

---

## System Landscape

| Collection | Path | Categories |
|------------|------|------------|
| System Landscape | `/sap/bc/adt/system/landscape/servers` | servers |

### Collection Details

#### System Landscape

**Path:** `/sap/bc/adt/system/landscape/servers`

**Categories:**

- Term: `servers`
  - Scheme: `http://www.sap.com/adt/categories/system`

**Template Links:**

- **http://www.sap.com/adt/relations/system/landscape/servers**
  - Template: `/sap/bc/adt/system/landscape/servers{?onlyActiveServers}`
  - Type: `application/atom+xml;type=feed`
  - Title: Server List

---

## User

| Collection | Path | Categories |
|------------|------|------------|
| User | `/sap/bc/adt/system/users` | users |

### Collection Details

#### User

**Path:** `/sap/bc/adt/system/users`

**Categories:**

- Term: `users`
  - Scheme: `http://www.sap.com/adt/categories/system/users`

**Template Links:**

- **http://www.sap.com/adt/relations/system/users/query**
  - Template: `/sap/bc/adt/system/users{?querystring,maxcount}`
- **self**
  - Template: `/sap/bc/adt/system/users/{username}`

---

## VIT URI Mapping

| Collection | Path | Categories |
|------------|------|------------|
| VIT URI Mapper | `/sap/bc/adt/vit/urimapper` | vitUriMapping |

### Collection Details

#### VIT URI Mapper

**Path:** `/sap/bc/adt/vit/urimapper`

**Categories:**

- Term: `vitUriMapping`
  - Scheme: `http://www.sap.com/adt/categories/vit/urimapper`

**Template Links:**

- **http://www.sap.com/adt/vit/uriMapper**
  - Template: `/sap/bc/adt/vit/urimapper{?uri}`

---

## API Releases

| Collection | Path | Categories |
|------------|------|------------|
| API Releases | `/sap/bc/adt/apireleases` | apireleases |

### Collection Details

#### API Releases

**Path:** `/sap/bc/adt/apireleases`

**Categories:**

- Term: `apireleases`
  - Scheme: `http://www.sap.com/adt/categories/apireleases`

**Template Links:**

- **http://www.sap.com/adt/categories/apirelease**
  - Template: `/sap/bc/adt/apireleases/{uri}`
- **http://www.sap.com/adt/categories/apireleasecontract**
  - Template: `/sap/bc/adt/apireleases/{uri}/{contract}{?request}`
- **http://www.sap.com/adt/categories/apireleasecontractvalidation**
  - Template: `/sap/bc/adt/apireleases/{uri}/{contract}/validationrun`
- **http://www.sap.com/adt/categories/apireleasecontracts**
  - Template: `/sap/bc/adt/apireleases/meta/supportedcontracts`
- **http://www.sap.com/adt/categories/apireleasefeatures**
  - Template: `/sap/bc/adt/apireleases/meta/features`
- **http://www.sap.com/adt/categories/apireleasemetadata**
  - Template: `/sap/bc/adt/apireleases/meta`
- **http://www.sap.com/adt/categories/apireleaseapisobject**
  - Template: `/sap/bc/adt/apireleases/apis/{apisid}`
- **http://www.sap.com/adt/categories/apireleaseapicatalogdata**
  - Template: `/sap/bc/adt/apireleases/apia/{uri}{?request}`
- **http://www.sap.com/adt/categories/apireleaseapicatalogobjects**
  - Template: `/sap/bc/adt/apireleases/apic/{uri}`

---

## ABAP Test Cockpit

| Collection | Path | Categories |
|------------|------|------------|
| ATC results | `/sap/bc/adt/atc/results` | atcresults |
| ATC customizing | `/sap/bc/adt/atc/customizing` | atccustomizing |
| ATC runs | `/sap/bc/adt/atc/runs` | atcruns |
| CCS Tunnel | `/sap/bc/adt/atc/ccstunnel` | ccstunnel |
| Result Worklist | `/sap/bc/adt/atc/result/worklist` | atcresultworklist |
| Check Failure | `/sap/bc/adt/atc/checkfailures` | atccheckfailures |
| Check Failure Details | `/sap/bc/adt/atc/checkfailures/logs` | atccheckfailuresdetails |
| ATC worklist | `/sap/bc/adt/atc/worklists` | atcworklists |
| Autoquickfix | `/sap/bc/adt/atc/autoqf/worklist` | atcautoqf |
| ATC Remarks | `/sap/bc/adt/atc/remarks` | atcremarks |
| List of Approvers | `/sap/bc/adt/atc/approvers` | atcapprovers |
| List of Variants | `/sap/bc/adt/atc/variants` | atcvariants |
| Exemptions Apply | `/sap/bc/adt/atc/exemptions/apply` | atcexemptions |
| Approver Notifications | `/sap/bc/adt/atc/apprNotifi/subscriptions` | approverNotifications |
| ATC Configuration | `/sap/bc/adt/atc/configuration/configurations` | atcConfiguration |
| ATC Configuration (Metadata) | `/sap/bc/adt/atc/configuration/metadata` | atcConfigurationMetadata |

### Collection Details

#### ATC results

**Path:** `/sap/bc/adt/atc/results`

**Categories:**

- Term: `atcresults`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/results/active**
  - Template: `/sap/bc/adt/atc/results{?activeResult,contactPerson}`
- **http://www.sap.com/adt/atc/relations/results/activeforsysid**
  - Template: `/sap/bc/adt/atc/results{?activeResult,contactPerson,sysId}`
- **http://www.sap.com/adt/atc/relations/results/user**
  - Template: `/sap/bc/adt/atc/results{?createdBy,ageMin,ageMax,contactPerson}`
- **http://www.sap.com/adt/atc/relations/results/central**
  - Template: `/sap/bc/adt/atc/results{?centralResult,createdBy,contactPerson,ageMin,ageMax}`
- **http://www.sap.com/adt/atc/relations/results/centralforsysid**
  - Template: `/sap/bc/adt/atc/results{?centralResult,createdBy,contactPerson,ageMin,ageMax,sysId}`
- **http://www.sap.com/adt/atc/relations/results/displayid**
  - Template: `/sap/bc/adt/atc/results/{displayId}{?activeResult,contactPerson,includeExemptedFindings}`
- **http://www.sap.com/adt/atc/relations/results/log**
  - Template: `/sap/bc/adt/atc/results/{executionId}/log`

---

#### ATC customizing

**Path:** `/sap/bc/adt/atc/customizing`

**Categories:**

- Term: `atccustomizing`
  - Scheme: `http://www.sap.com/adt/categories/atc`

---

#### ATC runs

**Path:** `/sap/bc/adt/atc/runs`

**Categories:**

- Term: `atcruns`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/worklist**
  - Template: `/sap/bc/adt/atc/runs{?worklistId,clientWait}`
  - Title: ATC run in worklist mode
- **http://www.sap.com/adt/atc/relations/runs**
  - Template: `/sap/bc/adt/atc/runs/{projectId}`
- **http://www.sap.com/adt/atc/relations/runs/action**
  - Template: `/sap/bc/adt/atc/runs/{projectId}{?action}`

---

#### CCS Tunnel

**Path:** `/sap/bc/adt/atc/ccstunnel`

**Categories:**

- Term: `ccstunnel`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/ccstunnel/ccstunnel**
  - Template: `/sap/bc/adt/atc/ccstunnel{?targetUri}`

---

#### Result Worklist

**Path:** `/sap/bc/adt/atc/result/worklist`

**Categories:**

- Term: `atcresultworklist`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/result/worklist**
  - Template: `/sap/bc/adt/atc/result/worklist/{worklistId}/{displayId}{?contactPerson}`

---

#### Check Failure

**Path:** `/sap/bc/adt/atc/checkfailures`

**Categories:**

- Term: `atccheckfailures`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/checkfailures**
  - Template: `/sap/bc/adt/atc/checkfailures/{worklistId}{?displayId}`

---

#### Check Failure Details

**Path:** `/sap/bc/adt/atc/checkfailures/logs`

**Categories:**

- Term: `atccheckfailuresdetails`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/checkfailures/logs**
  - Template: `/sap/bc/adt/atc/checkfailures/logs{?displayId,objName,objType,moduleId,phaseKey}`

---

#### ATC worklist

**Path:** `/sap/bc/adt/atc/worklists`

**Categories:**

- Term: `atcworklists`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/new**
  - Template: `/sap/bc/adt/atc/worklists{?checkVariant}`
- **http://www.sap.com/adt/atc/relations/get**
  - Template: `/sap/bc/adt/atc/worklists/{worklistId}{?timestamp,usedObjectSet,includeExemptedFindings}`
- **http://www.sap.com/adt/atc/relations/objectset**
  - Template: `/sap/bc/adt/atc/worklists/{worklistId}/{objectSetName}{?timestamp,includeExemptedFindings}`
- **http://www.sap.com/adt/atc/relations/actions/deleteFindings**
  - Template: `/sap/bc/adt/atc/worklists/{worklistId}{?action}`

---

#### Autoquickfix

**Path:** `/sap/bc/adt/atc/autoqf/worklist`

**Categories:**

- Term: `atcautoqf`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Accepted Content Types:**

- `application/vnd.sap.adt.atc.objectreferences.v1+xml`
- `application/vnd.sap.adt.atc.autoqf.proposal.v1+xml`
- `application/vnd.sap.adt.atc.autoqf.selection.v1+xml`
- `application/vnd.sap.adt.atc.genericrefactoring.v1+xml`

---

#### ATC Remarks

**Path:** `/sap/bc/adt/atc/remarks`

**Categories:**

- Term: `atcremarks`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Accepted Content Types:**

- `application/vnd.sap.adt.atc.remarks.v1+xml`

---

#### List of Approvers

**Path:** `/sap/bc/adt/atc/approvers`

**Categories:**

- Term: `atcapprovers`
  - Scheme: `http://www.sap.com/adt/categories/atc`

---

#### List of Variants

**Path:** `/sap/bc/adt/atc/variants`

**Categories:**

- Term: `atcvariants`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/variants/referenceVariant**
  - Template: `/sap/bc/adt/atc/variants{?maxItemCount,data}`

---

#### Exemptions Apply

**Path:** `/sap/bc/adt/atc/exemptions/apply`

**Categories:**

- Term: `atcexemptions`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/exemptions/apply/template**
  - Template: `/sap/bc/adt/atc/exemptions/apply{?markerId}`
- **http://www.sap.com/adt/atc/relations/exemptions/apply**
  - Template: `/sap/bc/adt/atc/exemptions/apply{?markerId}`
- **http://www.sap.com/adt/atc/relations/checkexemptionsview**
  - Template: `/sap/bc/adt/atc/checkexemptionsview{?aggregatesOnly,requestedBy,assessedBy,assessableBy,exemptionState}{exemptionName}`
- **http://www.sap.com/adt/atc/relations/exemptions/findingItemId**
  - Template: `/sap/bc/adt/atc/exemptions/atcexemption/{findingItemId}`

---

#### Approver Notifications

**Path:** `/sap/bc/adt/atc/apprNotifi/subscriptions`

**Categories:**

- Term: `approverNotifications`
  - Scheme: `http://www.sap.com/adt/categories/atc`

**Template Links:**

- **http://www.sap.com/adt/atc/relations/apprNotifi/subscriptions**
  - Template: `/sap/bc/adt/atc/apprNotifi/subscriptions{?userName}`

---

#### ATC Configuration

**Path:** `/sap/bc/adt/atc/configuration/configurations`

**Categories:**

- Term: `atcConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/atc`

---

#### ATC Configuration (Metadata)

**Path:** `/sap/bc/adt/atc/configuration/metadata`

**Categories:**

- Term: `atcConfigurationMetadata`
  - Scheme: `http://www.sap.com/adt/categories/atc`

---

## ABAP Unit

| Collection | Path | Categories |
|------------|------|------------|
| ABAP Unit Testruns | `/sap/bc/adt/abapunit/testruns` | unittestruns |
| ABAP Unit Metadata | `/sap/bc/adt/abapunit/metadata` | metadata |
| ABAP Unit Testruns Evaluation | `/sap/bc/adt/abapunit/testruns/evaluation` | evaluation |
| ABAP Unit Explain Tool | `/sap/bc/adt/abapunit/explain` | explain |
| ABAP Unit | `/sap/bc/adt/abapunit/runs` | runs |

### Collection Details

#### ABAP Unit Testruns

**Path:** `/sap/bc/adt/abapunit/testruns`

**Categories:**

- Term: `unittestruns`
  - Scheme: `http://www.sap.com/adt/categories/abapunit`

**Accepted Content Types:**

- `application/vnd.sap.adt.abapunit.testruns.config.v1+xml`
- `application/vnd.sap.adt.abapunit.testruns.config.v2+xml`
- `application/vnd.sap.adt.abapunit.testruns.config.v3+xml`
- `application/vnd.sap.adt.abapunit.testruns.config.v4+xml`
- `application/xml`

---

#### ABAP Unit Metadata

**Path:** `/sap/bc/adt/abapunit/metadata`

**Categories:**

- Term: `metadata`
  - Scheme: `http://www.sap.com/adt/categories/abapunit`

---

#### ABAP Unit Testruns Evaluation

**Path:** `/sap/bc/adt/abapunit/testruns/evaluation`

**Categories:**

- Term: `evaluation`
  - Scheme: `http://www.sap.com/adt/categories/abapunit`

**Accepted Content Types:**

- `application/vnd.sap.adt.abapunit.testruns.evaluation.config.v1+xml`
- `application/vnd.sap.adt.abapunit.testruns.evaluation.config.v2+xml`
- `application/vnd.sap.adt.abapunit.testruns.evaluation.config.v3+xml`

---

#### ABAP Unit Explain Tool

**Path:** `/sap/bc/adt/abapunit/explain`

**Categories:**

- Term: `explain`
  - Scheme: `http://www.sap.com/adt/categories/abapunit`

**Template Links:**

- **http://www.sap.com/adt/relations/abapunit/explain/capabilities**
  - Template: `/sap/bc/adt/abapunit/explain/capabilities{?uri}`
  - Type: `application/vnd.sap.adt.aunit.explain.capabilities.v1+asjson`

**Accepted Content Types:**

- `application/vnd.sap.adt.aunit.explain.request.v1+asjson`

---

#### ABAP Unit

**Path:** `/sap/bc/adt/abapunit/runs`

**Categories:**

- Term: `runs`
  - Scheme: `http://www.sap.com/adt/categories/api/abapunit`

**Template Links:**

- **http://www.sap.com/adt/relations/abapunit/previews**
  - Template: `/sap/bc/adt/abapunit/previews{?withNavigationUris}`
  - Type: `application/vnd.sap.adt.api.abapunit.run-result.v1+xml`
  - Title: ABAP Unit Previews

---

## Test Double Framework for managing db dependencies

| Collection | Path | Categories |
|------------|------|------------|
| Get DDL Dependency | `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies` | cds/dependencies |
| Get DDL dependency info | `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies/info` | cds/dependencies/info |
| Validate DDL entity | `/sap/bc/adt/aunit/dbtestdoubles/cds/validation` | cds/validation |

### Collection Details

#### Get DDL Dependency

**Path:** `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies`

**Categories:**

- Term: `cds/dependencies`
  - Scheme: `http://www.sap.com/adt/categories/aunit/dbtestdoubles`

**Template Links:**

- **http://www.sap.com/adt/categories/aunit/dbtestdoubles/cds/dependencies**
  - Template: `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies{?ddlsourceName,dependencyLevel,withAssociations,contextPackage}`

---

#### Get DDL dependency info

**Path:** `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies/info`

**Categories:**

- Term: `cds/dependencies/info`
  - Scheme: `http://www.sap.com/adt/categories/aunit/dbtestdoubles/info`

**Template Links:**

- **http://www.sap.com/adt/categories/aunit/dbtestdoubles/cds/dependencies**
  - Template: `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies/info{?ddlsourceName,dependencyLevel,withAssociations}`
- **http://www.sap.com/adt/categories/aunit/dbtestdoubles/cds/dependencies/info**
  - Template: `/sap/bc/adt/aunit/dbtestdoubles/cds/dependencies/info{?name,type}`

---

#### Validate DDL entity

**Path:** `/sap/bc/adt/aunit/dbtestdoubles/cds/validation`

**Categories:**

- Term: `cds/validation`
  - Scheme: `http://www.sap.com/adt/categories/aunit/dbtestdoubles`

**Template Links:**

- **http://www.sap.com/adt/categories/aunit/dbtestdoubles/cds/validation**
  - Template: `/sap/bc/adt/aunit/dbtestdoubles/cds/validation{?ddlName}`

---

## ABAP Source Based Dictionary

| Collection | Path | Categories |
|------------|------|------------|
| Element Info Resource | `/sap/bc/adt/ddic/elementinfo` | elementinfo |
| Code Completion Resource | `/sap/bc/adt/ddic/codecompletion` | codecompletion |

### Collection Details

#### Element Info Resource

**Path:** `/sap/bc/adt/ddic/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/adt/categories/ddic`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/elementinfo**
  - Template: `/sap/bc/adt/ddic/elementinfo{?path,uri}{&context}{&type*}`

---

#### Code Completion Resource

**Path:** `/sap/bc/adt/ddic/codecompletion`

**Categories:**

- Term: `codecompletion`
  - Scheme: `http://www.sap.com/adt/categories/ddic`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/codecompletion**
  - Template: `/sap/bc/adt/ddic/codecompletion{?path}{&type*}{&context}{&property*}{&contextUri}`

---

## Business Logic Extensions

| Collection | Path | Categories |
|------------|------|------------|
| badis | `/sap/bc/adt/businesslogicextensions/badis` | badis |
| badinameproposals | `/sap/bc/adt/businesslogicextensions/badinameproposals` | badinameproposals |

### Collection Details

#### badis

**Path:** `/sap/bc/adt/businesslogicextensions/badis`

**Categories:**

- Term: `badis`
  - Scheme: `http://www.sap.com/adt/categories/businesslogicextensions`

**Template Links:**

- **http://www.sap.com/adt/relations/businesslogicextensions/badis/compatibilitycheckruns**
  - Template: `/sap/bc/adt/businesslogicextensions/badis/{extensionname}/compatibilitycheckruns`
  - Type: `application/vnd.sap.adt.businesslogicextensions.badis.compatibilitycheck+json`
  - Title: badicompatibilitycheckruns

---

#### badinameproposals

**Path:** `/sap/bc/adt/businesslogicextensions/badinameproposals`

**Categories:**

- Term: `badinameproposals`
  - Scheme: `http://www.sap.com/adt/categories/businesslogicextensions`

**Template Links:**

- **http://www.sap.com/adt/relations/businesslogicextensions/badis/nameproposal**
  - Template: `/sap/bc/adt/businesslogicextensions/badinameproposals{?badidefinition}`
  - Type: `application/vnd.sap.adt.businesslogicextensions.badis.nameproposal+json`
  - Title: badinameproposals

---

## Object Classification System

| Collection | Path | Categories |
|------------|------|------------|
| Classifications | `/sap/bc/adt/classifications` | classifications |

### Collection Details

#### Classifications

**Path:** `/sap/bc/adt/classifications`

**Categories:**

- Term: `classifications`
  - Scheme: `http://www.sap.com/adt/categories/classifications`

**Template Links:**

- **http://www.sap.com/adt/categories/classifications**
  - Template: `/sap/bc/adt/classifications{?uri}`
- **http://www.sap.com/adt/categories/classifications/api/supportedTypes**
  - Template: `/sap/bc/adt/classifications/api/supportedTypes`

**Accepted Content Types:**

- `application/vnd.sap.adt.classification+xml`

---

## Change and Transport System

| Collection | Path | Categories |
|------------|------|------------|
| Transports | `/sap/bc/adt/cts/transports` | transports |
| Transport Checks | `/sap/bc/adt/cts/transportchecks` | transportchecks |
| Transport Management | `/sap/bc/adt/cts/transportrequests` | transportmanagement |
| Transport Management | `/sap/bc/adt/cts/transportrequests/reference` | transportmanagementref |
| Transport Search Configurations | `/sap/bc/adt/cts/transportrequests/searchconfiguration/configurations` | transportconfigurations |
| Transport Search Configurations (Metadata) | `/sap/bc/adt/cts/transportrequests/searchconfiguration/metadata` | transportconfigurationsmetadata |
| Supported facets of a transport request | `/sap/bc/adt/cts/transportrequests/facets` | facets |

### Collection Details

#### Transports

**Path:** `/sap/bc/adt/cts/transports`

**Categories:**

- Term: `transports`
  - Scheme: `http://www.sap.com/adt/categories/cts`

**Template Links:**

- **http://www.sap.com/adt/categories/cts/transports/search**
  - Template: `/sap/bc/adt/cts/transports/search{?searchFor,transportNumber,owner*,requestType*,requestStatus*,taskType*,taskStatus*,fromDate,toDate}`

**Accepted Content Types:**

- `application/vnd.sap.as+xml;charset=utf-8;dataname=com.sap.adt.transport.service.checkData`
- `application/vnd.sap.as+xml; charset=UTF-8; dataname=com.sap.adt.CreateCorrectionRequest`
- `application/vnd.sap.as+xml; charset=UTF-8; dataname=com.sap.adt.CreateCorrectionRequest.v1`
- `application/vnd.sap.adt.transports.search.v1+xml`

---

#### Transport Checks

**Path:** `/sap/bc/adt/cts/transportchecks`

**Categories:**

- Term: `transportchecks`
  - Scheme: `http://www.sap.com/adt/categories/cts`

---

#### Transport Management

**Path:** `/sap/bc/adt/cts/transportrequests`

**Categories:**

- Term: `transportmanagement`
  - Scheme: `http://www.sap.com/adt/categories/cts`

**Template Links:**

- **http://www.sap.com/adt/categories/cts/transportrequests**
  - Template: `/sap/bc/adt/cts/transportrequests{?targets}`
- **http://www.sap.com/adt/categories/cts/transportrequests/valuehelp/attribute**
  - Template: `/sap/bc/adt/cts/transportrequests/valuehelp/attribute{?maxItemCount}{&name}`
- **http://www.sap.com/adt/categories/cts/transportrequests/valuehelp/target**
  - Template: `/sap/bc/adt/cts/transportrequests/valuehelp/target{?maxItemCount}{&name}`
- **http://www.sap.com/adt/categories/cts/transportrequests/valuehelp/ctsproject**
  - Template: `/sap/bc/adt/cts/transportrequests/valuehelp/ctsproject{?maxItemCount}{&name}`
- **http://www.sap.com/adt/categories/cts/transportrequests/valuehelp/object**
  - Template: `/sap/bc/adt/cts/transportrequests/valuehelp/object/{field}{?maxItemCount}{&name}`

**Accepted Content Types:**

- `application/vnd.sap.adt.transportorganizer.v1+xml`

---

#### Transport Management

**Path:** `/sap/bc/adt/cts/transportrequests/reference`

**Categories:**

- Term: `transportmanagementref`
  - Scheme: `http://www.sap.com/adt/categories/cts`

---

#### Transport Search Configurations

**Path:** `/sap/bc/adt/cts/transportrequests/searchconfiguration/configurations`

**Categories:**

- Term: `transportconfigurations`
  - Scheme: `http://www.sap.com/adt/categories/cts`

---

#### Transport Search Configurations (Metadata)

**Path:** `/sap/bc/adt/cts/transportrequests/searchconfiguration/metadata`

**Categories:**

- Term: `transportconfigurationsmetadata`
  - Scheme: `http://www.sap.com/adt/categories/cts`

---

#### Supported facets of a transport request

**Path:** `/sap/bc/adt/cts/transportrequests/facets`

**Categories:**

- Term: `facets`
  - Scheme: `http://www.sap.com/adt/categories/cts`

---

## CDS Annotation Related ADT Resource

| Collection | Path | Categories |
|------------|------|------------|
| CDS Annotation Definitions | `/sap/bc/adt/ddic/cds/annotation/definitions` | definitions |
| Element Info for CDS Annotations | `/sap/bc/adt/ddic/cds/annotation/elementinfo` | elementinfo |
| Code Completion for Generic Object Reference | `/sap/bc/adt/ddic/cds/annotation/objref/proposal` | objref/proposal |

### Collection Details

#### CDS Annotation Definitions

**Path:** `/sap/bc/adt/ddic/cds/annotation/definitions`

**Categories:**

- Term: `definitions`
  - Scheme: `http://www.sap.com/adt/categories/ddic/cds/annotation`

---

#### Element Info for CDS Annotations

**Path:** `/sap/bc/adt/ddic/cds/annotation/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/adt/categories/ddic/cds/annotation`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/cds/annotation/elementinfo**
  - Template: `/sap/bc/adt/ddic/cds/annotation/elementinfo{?path,enumValue}`
  - Title: Element Info for CDS Annotations

---

#### Code Completion for Generic Object Reference

**Path:** `/sap/bc/adt/ddic/cds/annotation/objref/proposal`

**Categories:**

- Term: `objref/proposal`
  - Scheme: `http://www.sap.com/adt/categories/ddic/cds/annotation`

**Template Links:**

- **http://www.sap.com/adt/relations/annotation/objref/proposal**
  - Template: `/sap/bc/adt/ddic/cds/annotation/objref/proposal{?path,value,objectName,objectType,alv,signalCompleteness}`

---

## CDS Annotation Definitions

| Collection | Path | Categories |
|------------|------|------------|
| DDLA Case Preserving Formatter for Identifiers | `/sap/bc/adt/ddic/ddla/formatter/identifiers` | ddla/formatter/identifiers |
| DDLA Language Help Resource | `/sap/bc/adt/docu/ddla/langu` | ddlalanguagehelp |
| DDLA Parser Info Resource | `/sap/bc/adt/ddic/ddla/parser/info` | ddla/parser/info |
| DDLA Text Length Calculator | `/sap/bc/adt/ddic/ddla/textlengthcalc` | ddla/textlengthcalc |
| DDLA Dictionary Repository Access Resource | `/sap/bc/adt/ddic/ddla/repositoryaccess` | ddla/repositoryaccess |

### Collection Details

#### DDLA Case Preserving Formatter for Identifiers

**Path:** `/sap/bc/adt/ddic/ddla/formatter/identifiers`

**Categories:**

- Term: `ddla/formatter/identifiers`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `text/plain`

---

#### DDLA Language Help Resource

**Path:** `/sap/bc/adt/docu/ddla/langu`

**Categories:**

- Term: `ddlalanguagehelp`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/ddla/langu**
  - Template: `/sap/bc/adt/docu/ddla/langu{?ddlaSearchWord,ddlaStatementName,ddlaRootAnnotation}`

---

#### DDLA Parser Info Resource

**Path:** `/sap/bc/adt/ddic/ddla/parser/info`

**Categories:**

- Term: `ddla/parser/info`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### DDLA Text Length Calculator

**Path:** `/sap/bc/adt/ddic/ddla/textlengthcalc`

**Categories:**

- Term: `ddla/textlengthcalc`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/ddla/textlengthcalc**
  - Template: `/sap/bc/adt/ddic/ddla/textlengthcalc{?definedlength}`
  - Title: Retrieve recommended string length

---

#### DDLA Dictionary Repository Access Resource

**Path:** `/sap/bc/adt/ddic/ddla/repositoryaccess`

**Categories:**

- Term: `ddla/repositoryaccess`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/ddla/repositoryaccess**
  - Template: `/sap/bc/adt/ddic/ddla/repositoryaccess{?path}`

---

## ABAP DDL Sources

| Collection | Path | Categories |
|------------|------|------------|
| DDL Parser Information Resource | `/sap/bc/adt/ddic/ddl/parser` | ddlparser |
| DDL Dictionary Repository Access Resource | `/sap/bc/adt/ddic/ddl/ddicrepositoryaccess` | ddicrepositoryaccess |
| DDL Dependency Analyzer Resource | `/sap/bc/adt/ddic/ddl/dependencies/graphdata` | dependencies/graphdata |
| DDL Dictionary Element Info Resource | `/sap/bc/adt/ddic/ddl/elementinfo` | elementinfo |
| Dictionary Mass Element Info Resource | `/sap/bc/adt/ddic/ddl/elementinfos` | elementinfos |
| DDL Element Mapping Resource | `/sap/bc/adt/ddic/ddl/elementmappings` | elementmappings |
| DDL Element Mapping Strategies Resource | `/sap/bc/adt/ddic/ddl/elementmappings/strategies` | elementmappings/strategies |
| DDL Language Help Resource | `/sap/bc/adt/docu/ddl/langu` | ddllanguagehelp |
| DDL Sources Validation | `/sap/bc/adt/ddic/ddl/validation` | validation |
| DDL Sources | `/sap/bc/adt/ddic/ddl/sources` | ddlsources |
| DDL Case Preserving Formatter for Identifiers | `/sap/bc/adt/ddic/ddl/formatter/identifiers` | formatter/identifiers |
| DDL pretty printer configuration | `/sap/bc/adt/ddic/ddl/formatter/configurations` | formatter/configurations |
| DDL sqlView Create Statement Resource | `/sap/bc/adt/ddic/ddl/createstatements` | createstatements |
| DDL Active Object Resource | `/sap/bc/adt/ddic/ddl/activeobject` | activeobject |
| Related Objects Resource | `/sap/bc/adt/ddic/ddl/relatedObjects` | relatedObjects |
| Migration Wizard Object Validation Resource | `/sap/bc/adt/ddic/ddl/migration/validation` | migration/validation |
| Run Migration in Background | `/sap/bc/adt/ddic/ddl/migration/bgruns` | migration/bgruns |
| Get Migration Log Details | `/sap/bc/adt/ddic/ddl/migration/logs` | migration/logs |

### Collection Details

#### DDL Parser Information Resource

**Path:** `/sap/bc/adt/ddic/ddl/parser`

**Categories:**

- Term: `ddlparser`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

---

#### DDL Dictionary Repository Access Resource

**Path:** `/sap/bc/adt/ddic/ddl/ddicrepositoryaccess`

**Categories:**

- Term: `ddicrepositoryaccess`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/ddl/ddicrepositoryaccess**
  - Template: `/sap/bc/adt/ddic/ddl/ddicrepositoryaccess{?column,datasource,datasourcetype*,requestScope*,path*,targetUriRequired,unlimitedResultSizeForElements,uriRequired,exactMatch,role,dsfd,cdsTypeAndDataElement,drasPath,drtyPath,bdef,bdefEntity,bdefAction,bdefFunction,ddlsName,abapLanguageVersion,currentSourceName,currentSourceType,objectType*}`

---

#### DDL Dependency Analyzer Resource

**Path:** `/sap/bc/adt/ddic/ddl/dependencies/graphdata`

**Categories:**

- Term: `dependencies/graphdata`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/ddl/dependencies/graphdata**
  - Template: `/sap/bc/adt/ddic/ddl/dependencies/graphdata{?ddlsourceName*,addMetrics*}`

---

#### DDL Dictionary Element Info Resource

**Path:** `/sap/bc/adt/ddic/ddl/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/ddl/elementinfo**
  - Template: `/sap/bc/adt/ddic/ddl/elementinfo{?getTargetForAssociation,getFullTypeFieldInformation,getLabelTextsOfDataElementForFields,getExtensionViews,getSecondaryObjects,dataType,cdsFunction,path*}`

**Accepted Content Types:**

- `text/plain`

---

#### Dictionary Mass Element Info Resource

**Path:** `/sap/bc/adt/ddic/ddl/elementinfos`

**Categories:**

- Term: `elementinfos`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

---

#### DDL Element Mapping Resource

**Path:** `/sap/bc/adt/ddic/ddl/elementmappings`

**Categories:**

- Term: `elementmappings`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

---

#### DDL Element Mapping Strategies Resource

**Path:** `/sap/bc/adt/ddic/ddl/elementmappings/strategies`

**Categories:**

- Term: `elementmappings/strategies`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

---

#### DDL Language Help Resource

**Path:** `/sap/bc/adt/docu/ddl/langu`

**Categories:**

- Term: `ddllanguagehelp`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/ddl/langu/docu**
  - Template: `/sap/bc/adt/docu/ddl/langu{?ddlSearchWord,ddlStatementName,ddlRootAnnotation,ddlsName}`

---

#### DDL Sources Validation

**Path:** `/sap/bc/adt/ddic/ddl/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/ddlsources/validation**
  - Template: `/sap/bc/adt/ddic/ddl/validation{?objname,packagename,description,template}`

---

#### DDL Sources

**Path:** `/sap/bc/adt/ddic/ddl/sources`

**Categories:**

- Term: `ddlsources`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/ddlsources/properties**
  - Template: `/sap/bc/adt/ddic/ddl/sources/{object_name}{?corrNr,lockHandle,version,accessMode,_action}`
- **http://www.sap.com/adt/categories/ddic/ddlsources/source**
  - Template: `/sap/bc/adt/ddic/ddl/sources/{object_name}/source/main{?corrNr,lockHandle,version}`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddlSource+xml`

---

#### DDL Case Preserving Formatter for Identifiers

**Path:** `/sap/bc/adt/ddic/ddl/formatter/identifiers`

**Categories:**

- Term: `formatter/identifiers`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Accepted Content Types:**

- `text/plain`

---

#### DDL pretty printer configuration

**Path:** `/sap/bc/adt/ddic/ddl/formatter/configurations`

**Categories:**

- Term: `formatter/configurations`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/ddl/formatter/configurations**
  - Template: `/sap/bc/adt/ddic/ddl/formatter/configurations{?ddlsourceName,packageName,defaultConfiguration}`
  - Type: `application/atom+xml;type=entry`
  - Title: Retrieve DDL pretty printer configuration reference for requested criteria
- **http://www.sap.com/adt/relations/ddic/ddl/formatter/configurations/name**
  - Template: `/sap/bc/adt/ddic/ddl/formatter/configurations/{object_name}`
  - Title: Retrieve specific DDL pretty printer configuration

---

#### DDL sqlView Create Statement Resource

**Path:** `/sap/bc/adt/ddic/ddl/createstatements`

**Categories:**

- Term: `createstatements`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/ddl/createstatements**
  - Template: `/sap/bc/adt/ddic/ddl/createstatements/{object_name}`

---

#### DDL Active Object Resource

**Path:** `/sap/bc/adt/ddic/ddl/activeobject`

**Categories:**

- Term: `activeobject`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/ddl/activeobject**
  - Template: `/sap/bc/adt/ddic/ddl/activeobject{?datasource,datasourcetype,sourcetype*}`

---

#### Related Objects Resource

**Path:** `/sap/bc/adt/ddic/ddl/relatedObjects`

**Categories:**

- Term: `relatedObjects`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/ddl/relatedObjects/entity/name**
  - Template: `/sap/bc/adt/ddic/ddl/relatedObjects/entity/{name}`
- **http://www.sap.com/adt/relations/ddic/ddl/relatedObjects/ddlsource/name**
  - Template: `/sap/bc/adt/ddic/ddl/relatedObjects/ddlsource/{name}`

---

#### Migration Wizard Object Validation Resource

**Path:** `/sap/bc/adt/ddic/ddl/migration/validation`

**Categories:**

- Term: `migration/validation`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddl.migrationobjects.v2+xml`

---

#### Run Migration in Background

**Path:** `/sap/bc/adt/ddic/ddl/migration/bgruns`

**Categories:**

- Term: `migration/bgruns`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddl.migrationobjects.v2+xml`

---

#### Get Migration Log Details

**Path:** `/sap/bc/adt/ddic/ddl/migration/logs`

**Categories:**

- Term: `migration/logs`
  - Scheme: `http://www.sap.com/adt/categories/ddic/ddlsources`

**Template Links:**

- **http://www.sap.com/adt/relations/migration/logs**
  - Template: `/sap/bc/adt/ddic/ddl/migration/logs/{logId}`
  - Type: `application/vnd.sap.adt.ddl.migrationlog.v2+xml`

---

## CDS Metadata Extensions

| Collection | Path | Categories |
|------------|------|------------|
| DDLX Parser Info Resource | `/sap/bc/adt/ddic/ddlx/parser/info` | ddlxex/parser/info |
| DDLX Case Preserving Formatter for Identifiers | `/sap/bc/adt/ddic/ddlx/formatter/identifiers` | formatter/identifiers |
| DDLX Language Help Resource | `/sap/bc/adt/docu/ddlx/langu` | ddlxlanguagehelp |
| Annotation chain resource | `/sap/bc/adt/ddic/ddlx/annotation/chain` | annotation/chain |

### Collection Details

#### DDLX Parser Info Resource

**Path:** `/sap/bc/adt/ddic/ddlx/parser/info`

**Categories:**

- Term: `ddlxex/parser/info`
  - Scheme: `http://www.sap.com/wbobj/cds`

---

#### DDLX Case Preserving Formatter for Identifiers

**Path:** `/sap/bc/adt/ddic/ddlx/formatter/identifiers`

**Categories:**

- Term: `formatter/identifiers`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Accepted Content Types:**

- `text/plain`

---

#### DDLX Language Help Resource

**Path:** `/sap/bc/adt/docu/ddlx/langu`

**Categories:**

- Term: `ddlxlanguagehelp`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/ddlx/langu**
  - Template: `/sap/bc/adt/docu/ddlx/langu{?ddlxSearchWord,ddlxStatementName,ddlxRootAnnotation,ddlxName}`

---

#### Annotation chain resource

**Path:** `/sap/bc/adt/ddic/ddlx/annotation/chain`

**Categories:**

- Term: `annotation/chain`
  - Scheme: `http://www.sap.com/wbobj/cds`

**Template Links:**

- **http://www.sap.com/wbobj/cds/annotation/chain**
  - Template: `/sap/bc/adt/ddic/ddlx/annotation/chain{?entity,element,variant}`

---

## CDS Aspect

| Collection | Path | Categories |
|------------|------|------------|
| CDS Aspect Language Help | `/sap/bc/adt/docu/dras/langu` | drasras/languagehelp |

### Collection Details

#### CDS Aspect Language Help

**Path:** `/sap/bc/adt/docu/dras/langu`

**Categories:**

- Term: `drasras/languagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/dras/langu**
  - Template: `/sap/bc/adt/docu/dras/langu{?uri}`

---

## CDS Type

| Collection | Path | Categories |
|------------|------|------------|
| CDS Type Language Help | `/sap/bc/adt/docu/drty/langu` | drtysty/languagehelp |

### Collection Details

#### CDS Type Language Help

**Path:** `/sap/bc/adt/docu/drty/langu`

**Categories:**

- Term: `drtysty/languagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/drty/langu**
  - Template: `/sap/bc/adt/docu/drty/langu{?uri}`

---

## Dependency Rules

| Collection | Path | Categories |
|------------|------|------------|
| DRUL Parser Info Resource | `/sap/bc/adt/ddic/drul/parser/info` | drul/parser/info |
| DRUL Language Help Resource | `/sap/bc/adt/docu/drul/langu` | drullanguagehelp |

### Collection Details

#### DRUL Parser Info Resource

**Path:** `/sap/bc/adt/ddic/drul/parser/info`

**Categories:**

- Term: `drul/parser/info`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### DRUL Language Help Resource

**Path:** `/sap/bc/adt/docu/drul/langu`

**Categories:**

- Term: `drullanguagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/drul/langu**
  - Template: `/sap/bc/adt/docu/drul/langu{?drulSearchWord,drulStatementName}`

---

## Scalar Functions

| Collection | Path | Categories |
|------------|------|------------|
| Scalar Functions Language Help | `/sap/bc/adt/docu/dsfd/langu` | dsfdscf/languagehelp |

### Collection Details

#### Scalar Functions Language Help

**Path:** `/sap/bc/adt/docu/dsfd/langu`

**Categories:**

- Term: `dsfdscf/languagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/dsfd/langu**
  - Template: `/sap/bc/adt/docu/dsfd/langu{?uri}`

---

## Dynamic View Caches

| Collection | Path | Categories |
|------------|------|------------|
| DTDC Language Help Resource | `/sap/bc/adt/docu/dtdc/langu` | dtdclanguagehelp |
| Dynamic View Cache Parser Info Resource | `/sap/bc/adt/ddic/dtdc/parser/info` | dtdc/parser/info |
| Dynamic View Cache Create SQL Statement Resource | `/sap/bc/adt/ddic/dtdc/createstatements` | createstatements |

### Collection Details

#### DTDC Language Help Resource

**Path:** `/sap/bc/adt/docu/dtdc/langu`

**Categories:**

- Term: `dtdclanguagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/dtdc/langu**
  - Template: `/sap/bc/adt/docu/dtdc/langu{?dtdcSearchWord,dtdcStatementName,dtdcRootAnnotation,dtdcName}`

---

#### Dynamic View Cache Parser Info Resource

**Path:** `/sap/bc/adt/ddic/dtdc/parser/info`

**Categories:**

- Term: `dtdc/parser/info`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Dynamic View Cache Create SQL Statement Resource

**Path:** `/sap/bc/adt/ddic/dtdc/createstatements`

**Categories:**

- Term: `createstatements`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/dtdc/createstatements**
  - Template: `/sap/bc/adt/ddic/dtdc/createstatements/{object_name}`

---

## Entity Buffers

| Collection | Path | Categories |
|------------|------|------------|
| Entity Buffer Language Help Resource | `/sap/bc/adt/docu/dteb/langu` | dtebdf/languagehelp |
| Entity Buffer Parser Info Resource | `/sap/bc/adt/ddic/dteb/parser/info` | dteb/parserinfo |
| Entity Buffer Formatter | `/sap/bc/adt/ddic/dteb/formatter` | dtebdf/formatter |
| Entity Buffer Code Completion | `/sap/bc/adt/ddic/dteb/codecompletion/proposal` | dtebdf/codecompletion/proposal |
| Entity Buffer Element Info | `/sap/bc/adt/ddic/dteb/elementinfo` | dtebdf/elementinfo |
| Entity Buffer Navigation Support | `/sap/bc/adt/ddic/dteb/navigation` | dtebdf/navigation |

### Collection Details

#### Entity Buffer Language Help Resource

**Path:** `/sap/bc/adt/docu/dteb/langu`

**Categories:**

- Term: `dtebdf/languagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/dteb/langu**
  - Template: `/sap/bc/adt/docu/dteb/langu{?uri}`

---

#### Entity Buffer Parser Info Resource

**Path:** `/sap/bc/adt/ddic/dteb/parser/info`

**Categories:**

- Term: `dteb/parserinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Entity Buffer Formatter

**Path:** `/sap/bc/adt/ddic/dteb/formatter`

**Categories:**

- Term: `dtebdf/formatter`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Accepted Content Types:**

- `text/plain`

---

#### Entity Buffer Code Completion

**Path:** `/sap/bc/adt/ddic/dteb/codecompletion/proposal`

**Categories:**

- Term: `dtebdf/codecompletion/proposal`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### Entity Buffer Element Info

**Path:** `/sap/bc/adt/ddic/dteb/elementinfo`

**Categories:**

- Term: `dtebdf/elementinfo`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **elementinfo**
  - Template: `/sap/bc/adt/ddic/dteb/elementinfo{?uri}`

---

#### Entity Buffer Navigation Support

**Path:** `/sap/bc/adt/ddic/dteb/navigation`

**Categories:**

- Term: `dtebdf/navigation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

## Static Cache

| Collection | Path | Categories |
|------------|------|------------|
| Static View Cache Create SQL Statement Resource | `/sap/bc/adt/ddic/dtsc/createstatements` | dtsc/createstatements |
| Static Cache Language Help | `/sap/bc/adt/docu/dtsc/langu` | dtscdf/languagehelp |

### Collection Details

#### Static View Cache Create SQL Statement Resource

**Path:** `/sap/bc/adt/ddic/dtsc/createstatements`

**Categories:**

- Term: `dtsc/createstatements`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/ddic/dtsc/createstatements**
  - Template: `/sap/bc/adt/ddic/dtsc/createstatements/{object_name}`

---

#### Static Cache Language Help

**Path:** `/sap/bc/adt/docu/dtsc/langu`

**Categories:**

- Term: `dtscdf/languagehelp`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/dtsc/langu**
  - Template: `/sap/bc/adt/docu/dtsc/langu{?uri}`

---

## Lock Objects

| Collection | Path | Categories |
|------------|------|------------|
| ENQU Lock Mode Named Items | `/sap/bc/adt/ddic/lockobjects/lockmodes` | enqu/lockmodes |
| ENQU Secondary Table Proposals | `/sap/bc/adt/ddic/lockobjects/tables` | enqu/tables |
| ENQU Lock Object Adjustment | `/sap/bc/adt/ddic/lockobjects/adjustment` | enqu/adjustment |
| ENQU Lock Object Validation | `/sap/bc/adt/ddic/lockobjects/validation` | enqu/validation |

### Collection Details

#### ENQU Lock Mode Named Items

**Path:** `/sap/bc/adt/ddic/lockobjects/lockmodes`

**Categories:**

- Term: `enqu/lockmodes`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### ENQU Secondary Table Proposals

**Path:** `/sap/bc/adt/ddic/lockobjects/tables`

**Categories:**

- Term: `enqu/tables`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### ENQU Lock Object Adjustment

**Path:** `/sap/bc/adt/ddic/lockobjects/adjustment`

**Categories:**

- Term: `enqu/adjustment`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

#### ENQU Lock Object Validation

**Path:** `/sap/bc/adt/ddic/lockobjects/validation`

**Categories:**

- Term: `enqu/validation`
  - Scheme: `http://www.sap.com/wbobj/dictionary`

---

## ABAP Dictionary Logs

| Collection | Path | Categories |
|------------|------|------------|
| DDIC Activation Graph Resource | `/sap/bc/adt/ddic/logs/activationgraph` | activationgraph |

### Collection Details

#### DDIC Activation Graph Resource

**Path:** `/sap/bc/adt/ddic/logs/activationgraph`

**Categories:**

- Term: `activationgraph`
  - Scheme: `http://www.sap.com/adt/categories/ddic/logs`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/logs/activation/graph**
  - Template: `/sap/bc/adt/ddic/logs/activationgraph{?objectName,objectType,logName}`

---

## ABAP Database Procedure Proxies

| Collection | Path | Categories |
|------------|------|------------|
| Database Procudre Proxies | `/sap/bc/adt/ddic/dbprocedureproxies` | Dbprocedureproxies |
| DDIC SQSC Validation | `/sap/bc/adt/ddic/validation` | validation |

### Collection Details

#### Database Procudre Proxies

**Path:** `/sap/bc/adt/ddic/dbprocedureproxies`

**Categories:**

- Term: `Dbprocedureproxies`
  - Scheme: `http://www.sap.com/adt/categories/ddic`

---

#### DDIC SQSC Validation

**Path:** `/sap/bc/adt/ddic/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/ddic`

---

## Service Definitions

| Collection | Path | Categories |
|------------|------|------------|
| SRVD Language Help Resource | `/sap/bc/adt/docu/srvd/langu` | srvdlanguagehelp |
| SRVD Parser Info Resource | `/sap/bc/adt/ddic/srvd/parser/info` | srvd/parser/info |
| SRVD Case Preserving Formatter for Identifiers | `/sap/bc/adt/ddic/srvd/formatter/identifiers` | srvd/formatter/identifiers |
| SRVD Source Types | `/sap/bc/adt/ddic/srvd/sourceTypes` | srvd/sourceTypes |
| SRVD Services | `/sap/bc/adt/ddic/srvd/services` | srvd/services |
| Service Definition Element Info Resource | `/sap/bc/adt/ddic/srvd/elementinfo` | elementinfo |

### Collection Details

#### SRVD Language Help Resource

**Path:** `/sap/bc/adt/docu/srvd/langu`

**Categories:**

- Term: `srvdlanguagehelp`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/srvd/langu**
  - Template: `/sap/bc/adt/docu/srvd/langu{?srvdSearchWord,srvdStatementName,srvdRootAnnotation,srvdName}`

---

#### SRVD Parser Info Resource

**Path:** `/sap/bc/adt/ddic/srvd/parser/info`

**Categories:**

- Term: `srvd/parser/info`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### SRVD Case Preserving Formatter for Identifiers

**Path:** `/sap/bc/adt/ddic/srvd/formatter/identifiers`

**Categories:**

- Term: `srvd/formatter/identifiers`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Accepted Content Types:**

- `text/plain`

---

#### SRVD Source Types

**Path:** `/sap/bc/adt/ddic/srvd/sourceTypes`

**Categories:**

- Term: `srvd/sourceTypes`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### SRVD Services

**Path:** `/sap/bc/adt/ddic/srvd/services`

**Categories:**

- Term: `srvd/services`
  - Scheme: `http://www.sap.com/wbobj/raps`

---

#### Service Definition Element Info Resource

**Path:** `/sap/bc/adt/ddic/srvd/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/wbobj/raps`

**Template Links:**

- **http://www.sap.com/adt/categories/ddic/srvd/elementinfo**
  - Template: `/sap/bc/adt/ddic/srvd/elementinfo{?path}`

---

## Type Groups

| Collection | Path | Categories |
|------------|------|------------|
| TypeGroups | `/sap/bc/adt/ddic/typegroups` | typegroups |
| Validation | `/sap/bc/adt/ddic/typegroups/validation` | validation |

### Collection Details

#### TypeGroups

**Path:** `/sap/bc/adt/ddic/typegroups`

**Categories:**

- Term: `typegroups`
  - Scheme: `http://www.sap.com/adt/categories/ddic/typegroups`

**Accepted Content Types:**

- `application/vnd.sap.adt.ddic.typegroups.v2+xml`
- `application/vnd.sap.adt.ddic.typegroups.v3+xml`

---

#### Validation

**Path:** `/sap/bc/adt/ddic/typegroups/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/ddic/typegroups`

---

## ABAP External Views

| Collection | Path | Categories |
|------------|------|------------|
| Views | `/sap/bc/adt/ddic/views` | views |
| View Validation | `/sap/bc/adt/ddic/views/$validation` | views/validation |

### Collection Details

#### Views

**Path:** `/sap/bc/adt/ddic/views`

**Categories:**

- Term: `views`
  - Scheme: `http://www.sap.com/adt/categories/ddic`

---

#### View Validation

**Path:** `/sap/bc/adt/ddic/views/$validation`

**Categories:**

- Term: `views/validation`
  - Scheme: `http://www.sap.com/adt/categories/ddic`

---

## Dynamic Logpoints

| Collection | Path | Categories |
|------------|------|------------|
| Transfer logpoint logs to database | `/sap/bc/adt/dlp/logs/servers` | logs |
| Dynamic Logpoints | `/sap/bc/adt/dlp/logpoints` | logpoints |
| Locations where logpoints are creatable | `/sap/bc/adt/dlp/locationinfo` | locationinfo |

### Collection Details

#### Transfer logpoint logs to database

**Path:** `/sap/bc/adt/dlp/logs/servers`

**Categories:**

- Term: `logs`
  - Scheme: `http://www.sap.com/adt/categories/dynamiclogpoints`

**Template Links:**

- **http://www.sap.com/adt/relations/dlp/server/current**
  - Template: `/sap/bc/adt/dlp/logs/servers{?forCurrentServerOnly}`

---

#### Dynamic Logpoints

**Path:** `/sap/bc/adt/dlp/logpoints`

**Categories:**

- Term: `logpoints`
  - Scheme: `http://www.sap.com/adt/categories/dynamiclogpoints`

**Template Links:**

- **http://www.sap.com/adt/relations/dlp/logpoints/source**
  - Template: `/sap/bc/adt/dlp/logpoints{?adtUri,user,usageType,forceRtmUpdate}`
  - Type: `application/vnd.sap.adt.dlp.logpointlist+xml`
  - Title: Logpoints for source code include
- **http://www.sap.com/adt/relations/dlp/logpoints/all**
  - Template: `/sap/bc/adt/dlp/logpoints`
  - Type: `application/vnd.sap.adt.dlp.logpointlistfull+xml`
  - Title: All available logpoints

**Accepted Content Types:**

- `application/vnd.sap.adt.dlp.logpoint+xml`

---

#### Locations where logpoints are creatable

**Path:** `/sap/bc/adt/dlp/locationinfo`

**Categories:**

- Term: `locationinfo`
  - Scheme: `http://www.sap.com/adt/categories/dynamiclogpoints`

**Template Links:**

- **http://www.sap.com/adt/relations/dlp/locationinfo/sourceposition**
  - Template: `/sap/bc/adt/dlp/locationinfo{?adtUri}`
  - Type: `application/vnd.sap.adt.dlp.locationcheck+xml`
  - Title: Locations for include line where logpoints are creatable

**Accepted Content Types:**

- `application/vnd.sap.adt.dlp.locationcheck+xml`

---

## ABAP Source

| Collection | Path | Categories |
|------------|------|------------|
| Code Completion | `/sap/bc/adt/abapsource/codecompletion/proposal` | proposal |
| Element Info | `/sap/bc/adt/abapsource/codecompletion/elementinfo` | elementinfo |
| Code Insertion | `/sap/bc/adt/abapsource/codecompletion/insertion` | insertion |
| HANA Catalog Access | `/sap/bc/adt/abapsource/codecompletion/hanacatalogaccess` | hanacatalogaccess |
| Type Hierarchy | `/sap/bc/adt/abapsource/typehierarchy` | typehierarchy |
| Pretty Printer | `/sap/bc/adt/abapsource/prettyprinter` | prettyprinter |
| Pretty Printer Settings | `/sap/bc/adt/abapsource/prettyprinter/settings` | settings |
| Cleanup | `/sap/bc/adt/abapsource/cleanup/source` | cleanup |
| Occurrence Markers | `/sap/bc/adt/abapsource/occurencemarkers` | occurrencemarkers |
| Parser | `/sap/bc/adt/abapsource/parsers/rnd/grammar` | parser |
| Export ABAP Doc | `/sap/bc/adt/abapsource/abapdoc/exportjobs` | exportjobs |
| ABAP Syntax Configurations | `/sap/bc/adt/abapsource/syntax/configurations` | syntaxconfigurations |

### Collection Details

#### Code Completion

**Path:** `/sap/bc/adt/abapsource/codecompletion/proposal`

**Categories:**

- Term: `proposal`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/codecompletion`

---

#### Element Info

**Path:** `/sap/bc/adt/abapsource/codecompletion/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/codecompletion`

**Template Links:**

- **http://www.sap.com/adt/relations/elementinfo**
  - Template: `/sap/bc/adt/abapsource/codecompletion/elementinfo{?uri,fullname}`
  - Type: `application/vnd.sap.adt.elementinfo+xml`

**Accepted Content Types:**

- `text/plain`

---

#### Code Insertion

**Path:** `/sap/bc/adt/abapsource/codecompletion/insertion`

**Categories:**

- Term: `insertion`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/codecompletion`

---

#### HANA Catalog Access

**Path:** `/sap/bc/adt/abapsource/codecompletion/hanacatalogaccess`

**Categories:**

- Term: `hanacatalogaccess`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/codecompletion`

**Template Links:**

- **http://www.sap.com/adt/relations/abapsource/codecompletion/hanacatalogaccess**
  - Template: `/sap/bc/adt/abapsource/codecompletion/hanacatalogaccess{?requestScope*,pattern*}`

---

#### Type Hierarchy

**Path:** `/sap/bc/adt/abapsource/typehierarchy`

**Categories:**

- Term: `typehierarchy`
  - Scheme: `http://www.sap.com/adt/categories/abapsource`

**Accepted Content Types:**

- `application/vnd.sap.adt.typehierachy.result.v1+xml`

---

#### Pretty Printer

**Path:** `/sap/bc/adt/abapsource/prettyprinter`

**Categories:**

- Term: `prettyprinter`
  - Scheme: `http://www.sap.com/adt/categories/abapsource`

---

#### Pretty Printer Settings

**Path:** `/sap/bc/adt/abapsource/prettyprinter/settings`

**Categories:**

- Term: `settings`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/prettyprinter`

**Accepted Content Types:**

- `application/vnd.sap.adt.ppsettings.v2+xml`
- `application/vnd.sap.adt.ppsettings.v3+xml`
- `application/vnd.sap.adt.ppsettings.v4+xml`
- `application/vnd.sap.adt.ppsettings.v5+xml`

---

#### Cleanup

**Path:** `/sap/bc/adt/abapsource/cleanup/source`

**Categories:**

- Term: `cleanup`
  - Scheme: `http://www.sap.com/adt/categories/abapsource`

---

#### Occurrence Markers

**Path:** `/sap/bc/adt/abapsource/occurencemarkers`

**Categories:**

- Term: `occurrencemarkers`
  - Scheme: `http://www.sap.com/adt/categories/abapsource`

---

#### Parser

**Path:** `/sap/bc/adt/abapsource/parsers/rnd/grammar`

**Categories:**

- Term: `parser`
  - Scheme: `http://www.sap.com/adt/categories/abapsource`

---

#### Export ABAP Doc

**Path:** `/sap/bc/adt/abapsource/abapdoc/exportjobs`

**Categories:**

- Term: `exportjobs`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/abapdoc`

**Accepted Content Types:**

- `application/vnd.sap.adt.abapsource.abapdoc.exportjobs.v1+xml`

---

#### ABAP Syntax Configurations

**Path:** `/sap/bc/adt/abapsource/syntax/configurations`

**Categories:**

- Term: `syntaxconfigurations`
  - Scheme: `http://www.sap.com/adt/categories/abapsource/syntaxconfigurations`

**Accepted Content Types:**

- `application/vnd.sap.adt.syntaxconfigurations+xml`

---

## Navigation

| Collection | Path | Categories |
|------------|------|------------|
| Navigation | `/sap/bc/adt/navigation/target` | target |
| Navigation Update | `/sap/bc/adt/navigation/indexupdate` | index |

### Collection Details

#### Navigation

**Path:** `/sap/bc/adt/navigation/target`

**Categories:**

- Term: `target`
  - Scheme: `http://www.sap.com/adt/categories/navigation`

**Template Links:**

- **http://www.sap.com/adt/categories/navigation/options**
  - Template: `/sap/bc/adt/navigation/target{?uri,filter,fullname}`

**Accepted Content Types:**

- `application/xml`
- `semantic.navigation.v1`

---

#### Navigation Update

**Path:** `/sap/bc/adt/navigation/indexupdate`

**Categories:**

- Term: `index`
  - Scheme: `http://www.sap.com/adt/categories/navigation`

**Template Links:**

- **http://www.sap.com/adt/categories/navigation/options**
  - Template: `/sap/bc/adt/navigation/indexupdate{?uri}`

---

## Programs

| Collection | Path | Categories |
|------------|------|------------|
| Includes | `/sap/bc/adt/programs/includes` | includes |
| Programs | `/sap/bc/adt/programs/programs` | programs |
| Run a program | `/sap/bc/adt/programs/programrun` | programrun |
| Program Validation | `/sap/bc/adt/programs/validation` | validation |
| Include Validation | `/sap/bc/adt/includes/validation` | validation |

### Collection Details

#### Includes

**Path:** `/sap/bc/adt/programs/includes`

**Categories:**

- Term: `includes`
  - Scheme: `http://www.sap.com/adt/categories/programs`

**Accepted Content Types:**

- `application/vnd.sap.adt.programs.includes.v2+xml`

---

#### Programs

**Path:** `/sap/bc/adt/programs/programs`

**Categories:**

- Term: `programs`
  - Scheme: `http://www.sap.com/adt/categories/programs`

**Template Links:**

- **http://www.sap.com/adt/categories/programs/valuehelp/logicalDataBase**
  - Template: `/sap/bc/adt/programs/programs/{programname}/valuehelp/logicaldatabase`
  - Title: Value Help for Logical Databases
- **http://www.sap.com/adt/categories/programs/valuehelp/authorizationGroup**
  - Template: `/sap/bc/adt/programs/programs/{programname}/valuehelp/authorizationgroup`
  - Title: Value Help for Authorization Group
- **http://www.sap.com/adt/categories/programs/valuehelp/application**
  - Template: `/sap/bc/adt/programs/programs/{programname}/valuehelp/application`
  - Title: Value Help for Authorization Application
- **http://www.sap.com/adt/categories/programs/valuehelp/ldbSelectionScreen**
  - Template: `/sap/bc/adt/programs/programs/{programname}/valuehelp/ldbselectionscreen`
  - Title: Value Help for Logical Database Selection Screen

**Accepted Content Types:**

- `application/vnd.sap.adt.programs.programs.v2+xml`
- `application/vnd.sap.adt.programs.programs.v3+xml`

---

#### Run a program

**Path:** `/sap/bc/adt/programs/programrun`

**Categories:**

- Term: `programrun`
  - Scheme: `http://www.sap.com/adt/categories/programs`

**Template Links:**

- **http://www.sap.com/adt/relations/programs/programrun**
  - Template: `/sap/bc/adt/programs/programrun/{programname}{?profilerId}`
  - Type: `text/plain`
- **http://www.sap.com/adt/relations/programs/programrun/job**
  - Template: `/sap/bc/adt/programs/programrun/job/{programname}`

---

#### Program Validation

**Path:** `/sap/bc/adt/programs/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/programs`

---

#### Include Validation

**Path:** `/sap/bc/adt/includes/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/includes`

---

## Text Elements

| Collection | Path | Categories |
|------------|------|------------|
| Text Elements | `/sap/bc/adt/textelements/programs` | programs |
| Text Elements | `/sap/bc/adt/textelements/functiongroups` | functiongroups |
| Text Elements | `/sap/bc/adt/textelements/classes` | classes |

### Collection Details

#### Text Elements

**Path:** `/sap/bc/adt/textelements/programs`

**Categories:**

- Term: `programs`
  - Scheme: `http://www.sap.com/adt/categories/textelements`

**Accepted Content Types:**

- `application/vnd.sap.adt.textelements.v1+xml`

---

#### Text Elements

**Path:** `/sap/bc/adt/textelements/functiongroups`

**Categories:**

- Term: `functiongroups`
  - Scheme: `http://www.sap.com/adt/categories/textelements`

**Accepted Content Types:**

- `application/vnd.sap.adt.textelements.v1+xml`

---

#### Text Elements

**Path:** `/sap/bc/adt/textelements/classes`

**Categories:**

- Term: `classes`
  - Scheme: `http://www.sap.com/adt/categories/textelements`

**Accepted Content Types:**

- `application/vnd.sap.adt.textelements.v1+xml`

---

## Classes and Interfaces

| Collection | Path | Categories |
|------------|------|------------|
| Classes | `/sap/bc/adt/oo/classes` | classes |
| Interfaces | `/sap/bc/adt/oo/interfaces` | interfaces |
| Validation of Object Name | `/sap/bc/adt/oo/validation/objectname` | validation |
| Run a class | `/sap/bc/adt/oo/classrun` | classrun |

### Collection Details

#### Classes

**Path:** `/sap/bc/adt/oo/classes`

**Categories:**

- Term: `classes`
  - Scheme: `http://www.sap.com/adt/categories/oo`

**Accepted Content Types:**

- `application/vnd.sap.adt.oo.classes.v4+xml`

---

#### Interfaces

**Path:** `/sap/bc/adt/oo/interfaces`

**Categories:**

- Term: `interfaces`
  - Scheme: `http://www.sap.com/adt/categories/oo`

**Accepted Content Types:**

- `application/vnd.sap.adt.oo.interfaces.v5+xml`

---

#### Validation of Object Name

**Path:** `/sap/bc/adt/oo/validation/objectname`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/oo`

---

#### Run a class

**Path:** `/sap/bc/adt/oo/classrun`

**Categories:**

- Term: `classrun`
  - Scheme: `http://www.sap.com/adt/categories/oo`

**Template Links:**

- **http://www.sap.com/adt/relations/oo/classrun**
  - Template: `/sap/bc/adt/oo/classrun/{classname}{?profilerId}`
  - Type: `text/plain`

---

## Basic Object Properties

| Collection | Path | Categories |
|------------|------|------------|
| Basic Object Properties | `/sap/bc/adt/vit/wb/object_type` | properties |

### Collection Details

#### Basic Object Properties

**Path:** `/sap/bc/adt/vit/wb/object_type`

**Categories:**

- Term: `properties`
  - Scheme: `http://www.sap.com/adt/categories/basic/object/properties`

**Template Links:**

- **http://www.sap.com/adt/categories/basic/object/properties**
  - Template: `/sap/bc/adt/vit/wb/object_type/{type}/object_name/{name}`

---

## Deletion

| Collection | Path | Categories |
|------------|------|------------|
| Deletion | `/sap/bc/adt/deletion/delete` | delete |
| Deletion check | `/sap/bc/adt/deletion/check` | check |

### Collection Details

#### Deletion

**Path:** `/sap/bc/adt/deletion/delete`

**Categories:**

- Term: `delete`
  - Scheme: `http://www.sap.com/adt/categories/deletion`

**Accepted Content Types:**

- `application/vnd.sap.adt.deletion.request.v1+xml`

---

#### Deletion check

**Path:** `/sap/bc/adt/deletion/check`

**Categories:**

- Term: `check`
  - Scheme: `http://www.sap.com/adt/categories/deletion`

**Accepted Content Types:**

- `application/vnd.sap.adt.deletion.check.request.v1+xml`

---

## Activation

| Collection | Path | Categories |
|------------|------|------------|
| Inactive Objects | `/sap/bc/adt/activation/inactiveobjects` | inactiveobjects |
| Activation | `/sap/bc/adt/activation` | activationruns |
| Activation in background | `/sap/bc/adt/activation/runs` | activationbackgroundruns |
| Activation result | `/sap/bc/adt/activation/results` | activationresults |
| Check | `/sap/bc/adt/checkruns` | checkruns |
| Reporters | `/sap/bc/adt/checkruns/reporters` | reporters |

### Collection Details

#### Inactive Objects

**Path:** `/sap/bc/adt/activation/inactiveobjects`

**Categories:**

- Term: `inactiveobjects`
  - Scheme: `http://www.sap.com/adt/categories/activation`

**Template Links:**

- **http://www.sap.com/adt/relations/activation/inactiveobjects**
  - Template: `/sap/bc/adt/activation/inactiveobjects{?USERNAME}`
- **http://www.sap.com/adt/relations/activation/inactiveobjects/update**
  - Template: `/sap/bc/adt/activation/inactiveobjects{?action}`

**Accepted Content Types:**

- `application/vnd.sap.adt.inactivectsobjects.v2+xml`
- `application/vnd.sap.adt.inactivectsobjects.v1+xml`

---

#### Activation

**Path:** `/sap/bc/adt/activation`

**Categories:**

- Term: `activationruns`
  - Scheme: `http://www.sap.com/adt/categories/activation`

---

#### Activation in background

**Path:** `/sap/bc/adt/activation/runs`

**Categories:**

- Term: `activationbackgroundruns`
  - Scheme: `http://www.sap.com/adt/categories/activation`

**Template Links:**

- **http://www.sap.com/adt/relations/runs/run**
  - Template: `/sap/bc/adt/activation/runs/{run_id}{?withLongPolling}`
  - Type: `application/vnd.sap.adt.backgroundrun.v1+xml`
- **activationBgRunsStatus**
  - Template: `/sap/bc/adt/activation/runs/status{?extended}`
  - Type: `activation.bg.runs.v1+json`

**Accepted Content Types:**

- `application/vnd.sap.adt.activationrun.v1+xml`

---

#### Activation result

**Path:** `/sap/bc/adt/activation/results`

**Categories:**

- Term: `activationresults`
  - Scheme: `http://www.sap.com/adt/categories/activation`

**Template Links:**

- **http://www.sap.com/adt/relations/runs/result**
  - Template: `/sap/bc/adt/activation/results/{result_id}`
  - Type: `application/xml`

---

#### Check

**Path:** `/sap/bc/adt/checkruns`

**Categories:**

- Term: `checkruns`
  - Scheme: `http://www.sap.com/adt/categories/check`

**Template Links:**

- **http://www.sap.com/adt/categories/check/relations/reporters**
  - Template: `/sap/bc/adt/checkruns{?reporters}`

---

#### Reporters

**Path:** `/sap/bc/adt/checkruns/reporters`

**Categories:**

- Term: `reporters`
  - Scheme: `http://www.sap.com/adt/categories/check`

---

## URI Fragment Mapper

| Collection | Path | Categories |
|------------|------|------------|
| URI Fragment Mapper | `/sap/bc/adt/urifragmentmappings` | urifragmentmappings |

### Collection Details

#### URI Fragment Mapper

**Path:** `/sap/bc/adt/urifragmentmappings`

**Categories:**

- Term: `urifragmentmappings`
  - Scheme: `http://www.sap.com/adt/categories/urimapping/fragments`

**Template Links:**

- **http://www.sap.com/adt/categories/urimapping/fragments/plaintext**
  - Template: `/sap/bc/adt/urifragmentmappings?targettype=plaintext&uri={uri}`
  - Title: Map URI Fragment to PlainText

---

## Floor Plan Manager

| Collection | Path | Categories |
|------------|------|------------|
| FPM Applications Creation Tools | `/sap/bc/adt/fpm/creationtools` | ApplicationCreationTools |

### Collection Details

#### FPM Applications Creation Tools

**Path:** `/sap/bc/adt/fpm/creationtools`

**Categories:**

- Term: `ApplicationCreationTools`
  - Scheme: `http://www.sap.com/adt/categories/fpm`

---

## Function Groups; Functions; Function Group Includes

| Collection | Path | Categories |
|------------|------|------------|
| Function Group Validation | `/sap/bc/adt/functions/validation` | validation |
| Function Groups | `/sap/bc/adt/functions/groups` | groups |

### Collection Details

#### Function Group Validation

**Path:** `/sap/bc/adt/functions/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/functions`

---

#### Function Groups

**Path:** `/sap/bc/adt/functions/groups`

**Categories:**

- Term: `groups`
  - Scheme: `http://www.sap.com/adt/categories/functions`

**Template Links:**

- **http://www.sap.com/adt/categories/functiongroups/functionmodules**
  - Template: `/sap/bc/adt/functions/groups/{groupname}/fmodules`
  - Type: `application/vnd.sap.adt.functions.fmodules.v3+xml`
  - Title: Function Modules
- **http://www.sap.com/adt/categories/functiongroups/includes**
  - Template: `/sap/bc/adt/functions/groups/{groupname}/includes`
  - Type: `application/vnd.sap.adt.functions.fincludes.v2+xml`
  - Title: Function Group Includes

**Accepted Content Types:**

- `application/vnd.sap.adt.functions.groups.v3+xml`

---

## Message Classes

| Collection | Path | Categories |
|------------|------|------------|
| Message Classes | `/sap/bc/adt/messageclass` | messageclasses |
| Validation of Message class Name | `/sap/bc/adt/messageclass/validation` | validation |

### Collection Details

#### Message Classes

**Path:** `/sap/bc/adt/messageclass`

**Categories:**

- Term: `messageclasses`
  - Scheme: `http://www.sap.com/adt/categories/messageclasses`

**Template Links:**

- **http://www.sap.com/adt/categories/messageclasses/message**
  - Template: `/sap/bc/adt/messageclass/{mc_name}`
- **http://www.sap.com/adt/categories/messageclasses/message**
  - Template: `/sap/bc/adt/messageclass/{mc_name}/messages/{msg_no}`
- **http://www.sap.com/adt/categories/messageclasses/messages/longtext**
  - Template: `/sap/bc/adt/messageclass/{mc_name}/messages/{msg_no}/longtext`
  - Title: Message class long text

---

#### Validation of Message class Name

**Path:** `/sap/bc/adt/messageclass/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/messageclasses`

**Template Links:**

- **http://www.sap.com/adt/categories/messageclasses/validation**
  - Template: `/sap/bc/adt/messageclass/validation{?objname,description}`
  - Title: Validation of Message class Name

---

## HANA-Integration

| Collection | Path | Categories |
|------------|------|------------|
| Vendors for HANA-Integration | `/sap/bc/adt/nhi/vendors` | vendors |
| Deliveryunit-Proxies for HANA-Integration | `/sap/bc/adt/nhi/deliveryunitproxies` | deliveryunitproxies |
| Validation for HANA-Integration | `/sap/bc/adt/nhi/validation` | validation |
| Deliveryunits for HANA-Integration | `/sap/bc/adt/nhi/deliveryunits` | deliveryunits |
| Views for HANA-Integration | `/sap/bc/adt/nhi/views` | views |
| Database Procedures for HANA-Integration | `/sap/bc/adt/nhi/dbprocedures` | dbprocedures |

### Collection Details

#### Vendors for HANA-Integration

**Path:** `/sap/bc/adt/nhi/vendors`

**Categories:**

- Term: `vendors`
  - Scheme: `http://www.sap.com/adt/categories/nhi`

---

#### Deliveryunit-Proxies for HANA-Integration

**Path:** `/sap/bc/adt/nhi/deliveryunitproxies`

**Categories:**

- Term: `deliveryunitproxies`
  - Scheme: `http://www.sap.com/adt/categories/nhi`

---

#### Validation for HANA-Integration

**Path:** `/sap/bc/adt/nhi/validation`

**Categories:**

- Term: `validation`
  - Scheme: `http://www.sap.com/adt/categories/nhi`

---

#### Deliveryunits for HANA-Integration

**Path:** `/sap/bc/adt/nhi/deliveryunits`

**Categories:**

- Term: `deliveryunits`
  - Scheme: `http://www.sap.com/adt/categories/nhi`

---

#### Views for HANA-Integration

**Path:** `/sap/bc/adt/nhi/views`

**Categories:**

- Term: `views`
  - Scheme: `http://www.sap.com/adt/categories/nhi`

---

#### Database Procedures for HANA-Integration

**Path:** `/sap/bc/adt/nhi/dbprocedures`

**Categories:**

- Term: `dbprocedures`
  - Scheme: `http://www.sap.com/adt/categories/nhi`

---

## SQLM Marker

| Collection | Path | Categories |
|------------|------|------------|
| SQLM Data Fetch | `/sap/bc/adt/sqlm/data` | SqlmData |

### Collection Details

#### SQLM Data Fetch

**Path:** `/sap/bc/adt/sqlm/data`

**Categories:**

- Term: `SqlmData`
  - Scheme: `http://www.sap.com/adt/categories/sqlmmarker`

**Template Links:**

- **http://www.sap.com/adt/categories/sqlmmarker/data**
  - Template: `/sap/bc/adt/sqlm/data{?snapshot,source_name,object_type,sub_type}`
  - Title: URI Template for getting Sqlm Marker Data
- **http://www.sap.com/adt/categories/sqlmmarker/view**
  - Template: `/sap/bc/adt/sqlm/data{?action}`
  - Title: URI Template for getting Sqlm Marker View Data

---

## Quickfixes

| Collection | Path | Categories |
|------------|------|------------|
| Quickfixes | `/sap/bc/adt/quickfixes/evaluation` | evaluation |

### Collection Details

#### Quickfixes

**Path:** `/sap/bc/adt/quickfixes/evaluation`

**Categories:**

- Term: `evaluation`
  - Scheme: `http://www.sap.com/adt/categories/quickfixes`

**Accepted Content Types:**

- `application/vnd.sap.adt.quickfixes.evaluation+xml;version=1.0.0`

---

## Refactorings

| Collection | Path | Categories |
|------------|------|------------|
| Refactoring | `/sap/bc/adt/refactorings` | refactoring |
| Change Package Assignment | `/sap/bc/adt/refactoring/changepackage` | changepackage |

### Collection Details

#### Refactoring

**Path:** `/sap/bc/adt/refactorings`

**Categories:**

- Term: `refactoring`
  - Scheme: `http://www.sap.com/adt/categories/refactorings`

---

#### Change Package Assignment

**Path:** `/sap/bc/adt/refactoring/changepackage`

**Categories:**

- Term: `changepackage`
  - Scheme: `http://www.sap.com/adt/categories/refactorings`

---

## Repository Information

| Collection | Path | Categories |
|------------|------|------------|
| Status | `/sap/bc/adt/repository/informationsystem/status` | status |
| Usage References | `/sap/bc/adt/repository/informationsystem/usageReferences` | usageReferences |
| Usage Snippets | `/sap/bc/adt/repository/informationsystem/usageSnippets` | usageSnippets |
| Where Used | `/sap/bc/adt/repository/informationsystem/whereused` | whereused |
| Full Name Mapping | `/sap/bc/adt/repository/informationsystem/fullnamemapping` | fullnamemapping |
| Meta Data | `/sap/bc/adt/repository/informationsystem/metadata` | metadata |
| Search | `/sap/bc/adt/repository/informationsystem/search` | search |
| Object Types | `/sap/bc/adt/repository/informationsystem/objecttypes` | objecttypes |
| Release States | `/sap/bc/adt/repository/informationsystem/releasestates` | releasestates |
| ABAP Language Versions | `/sap/bc/adt/repository/informationsystem/abaplanguageversions` | abaplanguageversions |
| Text Search | `/sap/bc/adt/repository/informationsystem/textsearch` | textsearch |
| Object Names | `/sap/bc/adt/repository/informationsystem/textsearch/objectnames` | objectnames |
| Object Types | `/sap/bc/adt/repository/informationsystem/textsearch/objecttypes` | sourcetypes |
| Executable Object Types | `/sap/bc/adt/repository/informationsystem/executableobjecttypes` | executableobjecttypes |
| Virtual Folders | `/sap/bc/adt/repository/informationsystem/virtualfolders` | virtualfolders |
| Virtual Folders Contents | `/sap/bc/adt/repository/informationsystem/virtualfolders/contents` | contents |
| Facets supported by Virtual Folders | `/sap/bc/adt/repository/informationsystem/virtualfolders/facets` | facets |
| Facets Validation | `/sap/bc/adt/repository/informationsystem/virtualfolders/facets/validation` | facetvalidation |
| Object Properties | `/sap/bc/adt/repository/informationsystem/objectproperties/values` | objectProperties |
| Object Favorites | `/sap/bc/adt/repository/favorites/lists` | objectFavorites |
| Transport Properties | `/sap/bc/adt/repository/informationsystem/objectproperties/transports` | transportProperties |
| Property Values | `/sap/bc/adt/repository/informationsystem/properties/values` | propertyvalues |
| OSL Object References | `/sap/bc/adt/repository/informationsystem/objectsets/references` | adtReferences |
| OSL Object References Metrics | `/sap/bc/adt/repository/informationsystem/objectsets/metrics` | metrics |
| Node Path | `/sap/bc/adt/repository/nodepath` | nodepath |
| Object Structure | `/sap/bc/adt/repository/objectstructure` | objectstructure |
| Node Structure | `/sap/bc/adt/repository/nodestructure` | nodestructure |
| Type Structure | `/sap/bc/adt/repository/typestructure` | typestructure |
| Proxy URI Mappings | `/sap/bc/adt/repository/proxyurimappings` | proxyurimappings |
| Repository Objects Generators | `/sap/bc/adt/repository/generators` | generators |
| Element Info | `/sap/bc/adt/repository/informationsystem/elementinfo` | elementinfo |

### Collection Details

#### Status

**Path:** `/sap/bc/adt/repository/informationsystem/status`

**Categories:**

- Term: `status`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Usage References

**Path:** `/sap/bc/adt/repository/informationsystem/usageReferences`

**Categories:**

- Term: `usageReferences`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/usageReferences**
  - Template: `/sap/bc/adt/repository/informationsystem/usageReferences{?uri}`
- **http://www.sap.com/adt/relations/informationsystem/usageReferences/scope**
  - Template: `/sap/bc/adt/repository/informationsystem/usageReferences/scope{?uri}`

---

#### Usage Snippets

**Path:** `/sap/bc/adt/repository/informationsystem/usageSnippets`

**Categories:**

- Term: `usageSnippets`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/usageSnippets**
  - Template: `/sap/bc/adt/repository/informationsystem/usageSnippets`

---

#### Where Used

**Path:** `/sap/bc/adt/repository/informationsystem/whereused`

**Categories:**

- Term: `whereused`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Full Name Mapping

**Path:** `/sap/bc/adt/repository/informationsystem/fullnamemapping`

**Categories:**

- Term: `fullnamemapping`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Meta Data

**Path:** `/sap/bc/adt/repository/informationsystem/metadata`

**Categories:**

- Term: `metadata`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Search

**Path:** `/sap/bc/adt/repository/informationsystem/search`

**Categories:**

- Term: `search`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/search/quicksearch**
  - Template: `/sap/bc/adt/repository/informationsystem/search{?operation,query,useSearchProvider,noDescription,maxResults}{&objectType*}{&group*}{&packageName*}{&sourcetype*}{&state*}{&lifecycle*}{&rollout*}{&zone*}{&category*}{&appl*}{&userName*}{&releaseState*}{&language*}{&system*}{&version*}{&docu*}{&fav*}{&created*}{&month*}{&date*}{&comp*}{&abaplv*}`
- **http://www.sap.com/adt/relations/informationsystem/search/whitelisting**
  - Template: `/sap/bc/adt/repository/informationsystem/search{?operation,query,useSearchProvider,noDescription,maxResults}{&objectType*}{&group*}{&packageName*}{&sourcetype*}{&state*}{&lifecycle*}{&rollout*}{&zone*}{&category*}{&appl*}{&userName*}{&releaseState*}{&language*}{&system*}{&version*}{&docu*}{&fav*}{&created*}{&month*}{&date*}{&comp*}{&abaplv*}{&contextPackage}`

---

#### Object Types

**Path:** `/sap/bc/adt/repository/informationsystem/objecttypes`

**Categories:**

- Term: `objecttypes`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/objecttypes**
  - Template: `/sap/bc/adt/repository/informationsystem/objecttypes{?maxItemCount,name,data}`

---

#### Release States

**Path:** `/sap/bc/adt/repository/informationsystem/releasestates`

**Categories:**

- Term: `releasestates`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### ABAP Language Versions

**Path:** `/sap/bc/adt/repository/informationsystem/abaplanguageversions`

**Categories:**

- Term: `abaplanguageversions`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/abaplanguageversions**
  - Template: `/sap/bc/adt/repository/informationsystem/abaplanguageversions{?uri}`

---

#### Text Search

**Path:** `/sap/bc/adt/repository/informationsystem/textsearch`

**Categories:**

- Term: `textsearch`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/textsearch**
  - Template: `/sap/bc/adt/repository/informationsystem/textsearch{?searchString,searchFromIndex,searchToIndex,getAllResults}{&packageName*}{&userName*}{&objectName*}{&objectType*}`
- **http://www.sap.com/adt/relations/informationsystem/textsearch/support**
  - Template: `/sap/bc/adt/repository/informationsystem/textsearch/support{?db}`

---

#### Object Names

**Path:** `/sap/bc/adt/repository/informationsystem/textsearch/objectnames`

**Categories:**

- Term: `objectnames`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Object Types

**Path:** `/sap/bc/adt/repository/informationsystem/textsearch/objecttypes`

**Categories:**

- Term: `sourcetypes`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Executable Object Types

**Path:** `/sap/bc/adt/repository/informationsystem/executableobjecttypes`

**Categories:**

- Term: `executableobjecttypes`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Virtual Folders

**Path:** `/sap/bc/adt/repository/informationsystem/virtualfolders`

**Categories:**

- Term: `virtualfolders`
  - Scheme: `http://www.sap.com/adt/categories/repository`

**Accepted Content Types:**

- `application/vnd.sap.adt.repository.virtualfolders.result.v1+xml`

---

#### Virtual Folders Contents

**Path:** `/sap/bc/adt/repository/informationsystem/virtualfolders/contents`

**Categories:**

- Term: `contents`
  - Scheme: `http://www.sap.com/adt/categories/repository/virtualfolders`

**Template Links:**

- **http://www.sap.com/adt/categories/repository/virtualfolders/contents**
  - Template: `/sap/bc/adt/repository/informationsystem/virtualfolders/contents{?withVersions,ignoreShortDescriptions}`

**Accepted Content Types:**

- `application/vnd.sap.adt.repository.virtualfolders.result.v1+xml`

---

#### Facets supported by Virtual Folders

**Path:** `/sap/bc/adt/repository/informationsystem/virtualfolders/facets`

**Categories:**

- Term: `facets`
  - Scheme: `http://www.sap.com/adt/categories/repository/virtualfolders`

---

#### Facets Validation

**Path:** `/sap/bc/adt/repository/informationsystem/virtualfolders/facets/validation`

**Categories:**

- Term: `facetvalidation`
  - Scheme: `http://www.sap.com/adt/categories/repository/virtualfolders`

**Template Links:**

- **http://www.sap.com/adt/categories/repository/virtualfolders/facetvalidation**
  - Template: `/sap/bc/adt/repository/informationsystem/virtualfolders/facets/validation{?context}`

---

#### Object Properties

**Path:** `/sap/bc/adt/repository/informationsystem/objectproperties/values`

**Categories:**

- Term: `objectProperties`
  - Scheme: `http://www.sap.com/adt/categories/repository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/objectProperties**
  - Template: `/sap/bc/adt/repository/informationsystem/objectproperties/values{?uri}`
- **http://www.sap.com/adt/relations/informationsystem/objectProperties/facet**
  - Template: `/sap/bc/adt/repository/informationsystem/objectproperties/values{?facet}`

---

#### Object Favorites

**Path:** `/sap/bc/adt/repository/favorites/lists`

**Categories:**

- Term: `objectFavorites`
  - Scheme: `http://www.sap.com/adt/categories/repository/virtualfolders`

---

#### Transport Properties

**Path:** `/sap/bc/adt/repository/informationsystem/objectproperties/transports`

**Categories:**

- Term: `transportProperties`
  - Scheme: `http://www.sap.com/adt/categories/repository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/transportProperties**
  - Template: `/sap/bc/adt/repository/informationsystem/objectproperties/transports{?uri}`

---

#### Property Values

**Path:** `/sap/bc/adt/repository/informationsystem/properties/values`

**Categories:**

- Term: `propertyvalues`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/propertyvalues**
  - Template: `/sap/bc/adt/repository/informationsystem/properties/values{?maxItemCount,name,data}`

---

#### OSL Object References

**Path:** `/sap/bc/adt/repository/informationsystem/objectsets/references`

**Categories:**

- Term: `adtReferences`
  - Scheme: `http://www.sap.com/adt/categories/objectsets`

**Template Links:**

- **http://www.sap.com/adt/categories/objectsets/id/adtReferences**
  - Template: `/sap/bc/adt/repository/informationsystem/objectsets/references/{id}`

---

#### OSL Object References Metrics

**Path:** `/sap/bc/adt/repository/informationsystem/objectsets/metrics`

**Categories:**

- Term: `metrics`
  - Scheme: `http://www.sap.com/adt/categories/objectsets`

---

#### Node Path

**Path:** `/sap/bc/adt/repository/nodepath`

**Categories:**

- Term: `nodepath`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Accepted Content Types:**

- `application/tdevc.v1+csv`

---

#### Object Structure

**Path:** `/sap/bc/adt/repository/objectstructure`

**Categories:**

- Term: `objectstructure`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Node Structure

**Path:** `/sap/bc/adt/repository/nodestructure`

**Categories:**

- Term: `nodestructure`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Type Structure

**Path:** `/sap/bc/adt/repository/typestructure`

**Categories:**

- Term: `typestructure`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Proxy URI Mappings

**Path:** `/sap/bc/adt/repository/proxyurimappings`

**Categories:**

- Term: `proxyurimappings`
  - Scheme: `http://www.sap.com/adt/categories/respository`

---

#### Repository Objects Generators

**Path:** `/sap/bc/adt/repository/generators`

**Categories:**

- Term: `generators`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/categories/repository/generators**
  - Template: `/sap/bc/adt/repository/generators{?referencedObject,fetchAllGenerators,type,id}`

---

#### Element Info

**Path:** `/sap/bc/adt/repository/informationsystem/elementinfo`

**Categories:**

- Term: `elementinfo`
  - Scheme: `http://www.sap.com/adt/categories/respository`

**Template Links:**

- **http://www.sap.com/adt/relations/informationsystem/elementinfo**
  - Template: `/sap/bc/adt/repository/informationsystem/elementinfo{?path,type*}`

---

## Relation Explorer

| Collection | Path | Categories |
|------------|------|------------|
| Object relations | `/sap/bc/adt/objectrelations/network` | network |
| Object relations | `/sap/bc/adt/objectrelations/components` | components |
| References in Object Relation | `/sap/bc/adt/objectrelations/references` | references |
| References in Object Relation | `/sap/bc/adt/objectrelations` | relations |

### Collection Details

#### Object relations

**Path:** `/sap/bc/adt/objectrelations/network`

**Categories:**

- Term: `network`
  - Scheme: `http://www.sap.com/adt/categories/objectrelations`

**Accepted Content Types:**

- `application/vnd.sap.adt.objectrelations.request.v1+xml`

---

#### Object relations

**Path:** `/sap/bc/adt/objectrelations/components`

**Categories:**

- Term: `components`
  - Scheme: `http://www.sap.com/adt/categories/objectrelations`

**Accepted Content Types:**

- `application/vnd.sap.adt.objectrelations.request.v1+xml`

---

#### References in Object Relation

**Path:** `/sap/bc/adt/objectrelations/references`

**Categories:**

- Term: `references`
  - Scheme: `http://www.sap.com/adt/categories/objectrelations`

**Accepted Content Types:**

- `application/vnd.sap.adt.objectrelations.request.references.v1+xml`

---

#### References in Object Relation

**Path:** `/sap/bc/adt/objectrelations`

**Categories:**

- Term: `relations`
  - Scheme: `http://www.sap.com/adt/categories/objectrelations`

**Template Links:**

- **http://www.sap.com/adt/categories/objectrelations/id/relations**
  - Template: `/sap/bc/adt/objectrelations/{id}`
  - Type: `application/vnd.sap.adt.objectrelations.request.sets.v1+xml`

**Accepted Content Types:**

- `application/vnd.sap.adt.objectrelations.request.sets.v1+xml`

---

## Service Binding Types

| Collection | Path | Categories |
|------------|------|------------|
| OData V4 | `/sap/bc/adt/businessservices/odatav4` | ODataV4 |
| OData V2 | `/sap/bc/adt/businessservices/odatav2` | ODataV2 |
| Service Binding Classification | `/sap/bc/adt/businessservices/release` | SrvbRelease |

### Collection Details

#### OData V4

**Path:** `/sap/bc/adt/businessservices/odatav4`

**Categories:**

- Term: `ODataV4`
  - Scheme: `http://www.sap.com/categories/servicebindings/bindingtypes`

**Template Links:**

- **http://www.sap.com/adt/businessservices/servicebinding/odatav4**
  - Template: `/sap/bc/adt/businessservices/odatav4/{objectname}{?servicename,serviceversion,srvdname}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav4/feap/params**
  - Template: `/sap/bc/adt/businessservices/odatav4/feap{?feapParams}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav4/feap/params/fileredirection**
  - Template: `/sap/bc/adt/businessservices/odatav4/feap/{feapParams}/{filename}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav4/feap/params/fileredirection**
  - Template: `/sap/bc/adt/businessservices/odatav4/feap/{feapParams}/{fileresource}/{filename}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav4/feap/feappagename**
  - Template: `/sap/bc/adt/businessservices/odatav4/feap/{feapParams}/{feappagename}{?feapParams}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav4/testclient**
  - Template: `/sap/bc/adt/businessservices/odatav4/testclient{?url,serverName,serverPort,serverPath}`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.odatav4.v2+xml`

---

#### OData V2

**Path:** `/sap/bc/adt/businessservices/odatav2`

**Categories:**

- Term: `ODataV2`
  - Scheme: `http://www.sap.com/categories/servicebindings/bindingtypes`

**Template Links:**

- **http://www.sap.com/adt/businessservices/servicebinding/odatav2**
  - Template: `/sap/bc/adt/businessservices/odatav2/{objectname}{?servicename,serviceversion,srvdname}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav2/publish**
  - Template: `/sap/bc/adt/businessservices/odatav2/publishjobs{?servicename,serviceversion}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav2/unpublish**
  - Template: `/sap/bc/adt/businessservices/odatav2/unpublishjobs{?servicename,serviceversion}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav2/feap/params**
  - Template: `/sap/bc/adt/businessservices/odatav2/feap{?feapParams}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav2/feap/params/fileredirection**
  - Template: `/sap/bc/adt/businessservices/odatav2/feap/{feapParams}/{filename}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav2/feap/params/fileredirection**
  - Template: `/sap/bc/adt/businessservices/odatav2/feap/{feapParams}/{fileresource}/{filename}`
- **http://www.sap.com/adt/businessservices/servicebinding/odatav2/testclient**
  - Template: `/sap/bc/adt/businessservices/odatav2/testclient{?url,serverName,serverPort,serverPath}`

**Accepted Content Types:**

- `application/vnd.sap.adt.businessservices.odatav2.v3+xml`

---

#### Service Binding Classification

**Path:** `/sap/bc/adt/businessservices/release`

**Categories:**

- Term: `SrvbRelease`
  - Scheme: `http://www.sap.com/categories/servicebindings/bindingtypes`

**Template Links:**

- **http://www.sap.com/adt/businessservices/servicebinding/bindingtypes/release**
  - Template: `/sap/bc/adt/businessservices/release{?objectname,bindtype,bindtypeversion,repositoryid,servicename,serviceversion}`

---

## Debugger

| Collection | Path | Categories |
|------------|------|------------|
| Debugger | `/sap/bc/adt/debugger` | debugger |
| Memory Sizes | `/sap/bc/adt/debugger/memorysizes` | debugger-memorysizes |
| System Areas | `/sap/bc/adt/debugger/systemareas` | debugger-systemareas |
| Statements for Breakpoints | `/sap/bc/adt/debugger/breakpoints/statements` | debugger-breakpoints-statements |
| Message Types for Breakpoints | `/sap/bc/adt/debugger/breakpoints/messagetypes` | debugger-breakpoints-messagetypes |
| Breakpoints | `/sap/bc/adt/debugger/breakpoints` | debugger-breakpoints |
| Breakpoint Condition | `/sap/bc/adt/debugger/breakpoints/conditions` | debugger-breakpoints-conditions |
| Breakpoint Validation | `/sap/bc/adt/debugger/breakpoints/validations` | debugger-breakpoints-validations |
| VIT Breakpoints | `/sap/bc/adt/debugger/breakpoints/vit` | debugger-breakpoints-vit |
| Debugger Listeners | `/sap/bc/adt/debugger/listeners` | debugger-listeners |
| Debugger Variables | `/sap/bc/adt/debugger/variables` | debugger-variables |
| Debugger Actions | `/sap/bc/adt/debugger/actions` | debugger-actions |
| Debugger Stack | `/sap/bc/adt/debugger/stack` | debugger-stack |
| Debugger Watchpoints | `/sap/bc/adt/debugger/watchpoints` | debugger-watchpoints |
| Debugger Batch Request | `/sap/bc/adt/debugger/batch` | debugger-batch |

### Collection Details

#### Debugger

**Path:** `/sap/bc/adt/debugger`

**Categories:**

- Term: `debugger`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### Memory Sizes

**Path:** `/sap/bc/adt/debugger/memorysizes`

**Categories:**

- Term: `debugger-memorysizes`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **http://www.sap.com/adt/debugger/relations/memorysizes**
  - Template: `/sap/bc/adt/debugger/memorysizes{?includeAbap}`

---

#### System Areas

**Path:** `/sap/bc/adt/debugger/systemareas`

**Categories:**

- Term: `debugger-systemareas`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **self**
  - Template: `/sap/bc/adt/debugger/systemareas/{systemarea}{?offset,length,element,isSelection,selectedLine,selectedColumn,programContext,filter}`

---

#### Statements for Breakpoints

**Path:** `/sap/bc/adt/debugger/breakpoints/statements`

**Categories:**

- Term: `debugger-breakpoints-statements`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### Message Types for Breakpoints

**Path:** `/sap/bc/adt/debugger/breakpoints/messagetypes`

**Categories:**

- Term: `debugger-breakpoints-messagetypes`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### Breakpoints

**Path:** `/sap/bc/adt/debugger/breakpoints`

**Categories:**

- Term: `debugger-breakpoints`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **http://www.sap.com/adt/debugger/relations/synchronize**
  - Template: `/sap/bc/adt/debugger/breakpoints{?checkConflict}`

---

#### Breakpoint Condition

**Path:** `/sap/bc/adt/debugger/breakpoints/conditions`

**Categories:**

- Term: `debugger-breakpoints-conditions`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### Breakpoint Validation

**Path:** `/sap/bc/adt/debugger/breakpoints/validations`

**Categories:**

- Term: `debugger-breakpoints-validations`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### VIT Breakpoints

**Path:** `/sap/bc/adt/debugger/breakpoints/vit`

**Categories:**

- Term: `debugger-breakpoints-vit`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### Debugger Listeners

**Path:** `/sap/bc/adt/debugger/listeners`

**Categories:**

- Term: `debugger-listeners`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **http://www.sap.com/adt/debugger/relations/launch**
  - Template: `/sap/bc/adt/debugger/listeners{?debuggingMode,requestUser,terminalId,ideId,timeout,checkConflict,isNotifiedOnConflict}`
- **http://www.sap.com/adt/debugger/relations/stop**
  - Template: `/sap/bc/adt/debugger/listeners{?debuggingMode,requestUser,terminalId,ideId,checkConflict,notifyConflict}`
- **http://www.sap.com/adt/debugger/relations/get**
  - Template: `/sap/bc/adt/debugger/listeners{?debuggingMode,requestUser,terminalId,ideId,checkConflict}`

---

#### Debugger Variables

**Path:** `/sap/bc/adt/debugger/variables`

**Categories:**

- Term: `debugger-variables`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **http://www.sap.com/adt/debugger/relations/maxlength**
  - Template: `/sap/bc/adt/debugger/variables/{variableName}/{part}{?maxLength}`
  - Title: Debugger Variables Maxlength
- **http://www.sap.com/adt/debugger/relations/subcomponents**
  - Template: `/sap/bc/adt/debugger/variables/{variableName}/{part}{?component,line}`
  - Title: Variable Subcomponents
- **http://www.sap.com/adt/debugger/relations/csv**
  - Template: `/sap/bc/adt/debugger/variables/{variableName}/{part}{?offset,length,filter,sortComponent,sortDirection,whereClause,c*}`
  - Title: Variable data as CSV
- **http://www.sap.com/adt/debugger/relations/json**
  - Template: `/sap/bc/adt/debugger/variables/{variableName}/{part}{?offset,length,filter,sortComponent,sortDirection,whereClause,c*}`
  - Title: Variable data as JSON
- **http://www.sap.com/adt/debugger/relations/valueStatement**
  - Template: `/sap/bc/adt/debugger/variables/{variableName}/{part}{?rows,maxStringLength,maxNestingLevel,maxTotalSize,ignoreInitialValues,c*,lineBreakThreshold}`
  - Title: Generate value statement

---

#### Debugger Actions

**Path:** `/sap/bc/adt/debugger/actions`

**Categories:**

- Term: `debugger-actions`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **http://www.sap.com/adt/debugger/relations/action**
  - Template: `/sap/bc/adt/debugger/actions{?action,value}`

---

#### Debugger Stack

**Path:** `/sap/bc/adt/debugger/stack`

**Categories:**

- Term: `debugger-stack`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

#### Debugger Watchpoints

**Path:** `/sap/bc/adt/debugger/watchpoints`

**Categories:**

- Term: `debugger-watchpoints`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

**Template Links:**

- **http://www.sap.com/adt/debugger/relations/insert**
  - Template: `/sap/bc/adt/debugger/watchpoints{?variableName,condition}`
- **http://www.sap.com/adt/debugger/relations/get**
  - Template: `/sap/bc/adt/debugger/watchpoints`

---

#### Debugger Batch Request

**Path:** `/sap/bc/adt/debugger/batch`

**Categories:**

- Term: `debugger-batch`
  - Scheme: `http://www.sap.com/adt/categories/debugger`

---

## Task handler integration

| Collection | Path | Categories |
|------------|------|------------|
| Work Processes | `/sap/bc/adt/runtime/workprocesses` | processlist |

### Collection Details

#### Work Processes

**Path:** `/sap/bc/adt/runtime/workprocesses`

**Categories:**

- Term: `processlist`
  - Scheme: `http://www.sap.com/adt/categories/runtime/workprocesses`

---

## Web Dynpro

| Collection | Path | Categories |
|------------|------|------------|
| WebDynpro Application | `/sap/bc/adt/wdy/applications` | WebDynproApplication |
| WebDynpro Interface View | `/sap/bc/adt/wdy/interfaceviews` | WebDynproInterfaceView |
| WebDynpro Component | `/sap/bc/adt/wdy/components` | WebDynproComponent |
| WebDynpro ComponentInterface | `/sap/bc/adt/wdy/componentinterfaces` | WebDynproComponentInterface |
| Component Controller | `/sap/bc/adt/wdy/componentcontrollers` | ComponentController |
| Window Controller | `/sap/bc/adt/wdy/windows` | WindowController |
| Webdynpro Code Completion | `/sap/bc/adt/wdy/abapsource/codecompletion/proposal` | WDACodeCompletion |
| Webdynpro element information | `/sap/bc/adt/wdy/abapsource/codecompletion/elementinfo` | WDAElementinformation |
| Webdynpro Pretty Printer | `/sap/bc/adt/wdy/abapsource/prettyprinter` | WDAPrettyPrinter |
| Webdynpro element insertion | `/sap/bc/adt/wdy/abapsource/codecompletion/insertion` | WDACodeinsertion |
| Web Dynpro Application launcher | `/sap/bc/adt/wdy/launchconfiguration` | WDALaunchConfigurations |
| Webdynpro View UI Element Library | `/sap/bc/adt/wdy/viewdesigner/uielementlibrary` | WDAViewUILibrary |
| Webdynpro View | `/sap/bc/adt/wdy/views` | Views |
| Interface Controller | `/sap/bc/adt/wdy/interfacecontrollers` | InterfaceController |
| Custom Controller | `/sap/bc/adt/wdy/customcontrollers` | CustomController |
| Interface view Controller for a Component Interface | `/sap/bc/adt/wdy/interfaceviews` | InterfaceViews |
| Navigation controller | `/sap/bc/adt/wdy/navigation/target` | Navigation |
| Search WDA Entities | `/sap/bc/adt/wdy/search` | Search |
| Code template | `/sap/bc/adt/wdy/codetemplate` | CodeTemplate |
| Web Dynpro Configuration | `/sap/bc/adt/wdy/componentconfig` | ComponentConfiguration |
| Application Configuration | `/sap/bc/adt/wdy/applicationconfig` | ApplicationConfiguration |
| FPM Application Configuration | `/sap/bc/adt/wdy/fpmapplications` | FPMApplicationConfiguration |
| FPM Flooplan Configuration | `/sap/bc/adt/wdy/fpmfloorplans` | FPMFloorPlanConfiguration |
| FPM Adaptable Configuration | `/sap/bc/adt/wdy/fpmadaptables` | FPMAdaptableConfiguration |
| FPM Layout Component Configuration | `/sap/bc/adt/wdy/fpmcomponents` | FPMLayoutConfiguration |
| FPM Adaptable Configuration | `/sap/bc/adt/wdy/fpmguibbs` | FPMGUIBBConfiguration |
| FPM Adaptable Configuration | `/sap/bc/adt/wdy/fpmruibbs` | FPMRU |

### Collection Details

#### WebDynpro Application

**Path:** `/sap/bc/adt/wdy/applications`

**Categories:**

- Term: `WebDynproApplication`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/applications/editor**
  - Template: `/sap/bc/adt/wdy/applications/{object_name}`

---

#### WebDynpro Interface View

**Path:** `/sap/bc/adt/wdy/interfaceviews`

**Categories:**

- Term: `WebDynproInterfaceView`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### WebDynpro Component

**Path:** `/sap/bc/adt/wdy/components`

**Categories:**

- Term: `WebDynproComponent`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/components/editor**
  - Template: `/sap/bc/adt/wdy/components/{object_name}`

**Accepted Content Types:**

- `application/vnd.sap.adt.wdy.component.create.v1+xml`

---

#### WebDynpro ComponentInterface

**Path:** `/sap/bc/adt/wdy/componentinterfaces`

**Categories:**

- Term: `WebDynproComponentInterface`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### Component Controller

**Path:** `/sap/bc/adt/wdy/componentcontrollers`

**Categories:**

- Term: `ComponentController`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Accepted Content Types:**

- `application/vnd.sap.adt.wdy.controller.overview.v1+xml`

---

#### Window Controller

**Path:** `/sap/bc/adt/wdy/windows`

**Categories:**

- Term: `WindowController`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Accepted Content Types:**

- `application/vnd.sap.adt.wdy.window.create.v1+xml`

---

#### Webdynpro Code Completion

**Path:** `/sap/bc/adt/wdy/abapsource/codecompletion/proposal`

**Categories:**

- Term: `WDACodeCompletion`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/WDACodeCompletion**
  - Template: `/sap/bc/adt/wdy/abapsource/codecompletion/proposal{?uri,signalCompleteness}`

---

#### Webdynpro element information

**Path:** `/sap/bc/adt/wdy/abapsource/codecompletion/elementinfo`

**Categories:**

- Term: `WDAElementinformation`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/WDAElementinformation**
  - Template: `/sap/bc/adt/wdy/abapsource/codecompletion/elementinfo{?uri}`

---

#### Webdynpro Pretty Printer

**Path:** `/sap/bc/adt/wdy/abapsource/prettyprinter`

**Categories:**

- Term: `WDAPrettyPrinter`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/WDAPrettyPrinter**
  - Template: `/sap/bc/adt/wdy/abapsource/prettyprinter{?uri}`

---

#### Webdynpro element insertion

**Path:** `/sap/bc/adt/wdy/abapsource/codecompletion/insertion`

**Categories:**

- Term: `WDACodeinsertion`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/WDACodeinsertion**
  - Template: `/sap/bc/adt/wdy/abapsource/codecompletion/insertion{?uri,patternKey}`

---

#### Web Dynpro Application launcher

**Path:** `/sap/bc/adt/wdy/launchconfiguration`

**Categories:**

- Term: `WDALaunchConfigurations`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/launchconfigurations**
  - Template: `/sap/bc/adt/wdy/launchconfiguration/{object_type}/{object_name}`

---

#### Webdynpro View UI Element Library

**Path:** `/sap/bc/adt/wdy/viewdesigner/uielementlibrary`

**Categories:**

- Term: `WDAViewUILibrary`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### Webdynpro View

**Path:** `/sap/bc/adt/wdy/views`

**Categories:**

- Term: `Views`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/view/validatecontextbinding**
  - Template: `/sap/bc/adt/wdy/views/{comp_name}/{view_name}{?_action,elementDefName,elementLibName,property}`

**Accepted Content Types:**

- `application/vnd.sap.adt.wdy.view+xml`
- `application/vnd.sap.adt.wdy.view.v1+xml`

---

#### Interface Controller

**Path:** `/sap/bc/adt/wdy/interfacecontrollers`

**Categories:**

- Term: `InterfaceController`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### Custom Controller

**Path:** `/sap/bc/adt/wdy/customcontrollers`

**Categories:**

- Term: `CustomController`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Accepted Content Types:**

- `application/vnd.sap.adt.wdy.custom.create.v1+xml`

---

#### Interface view Controller for a Component Interface

**Path:** `/sap/bc/adt/wdy/interfaceviews`

**Categories:**

- Term: `InterfaceViews`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### Navigation controller

**Path:** `/sap/bc/adt/wdy/navigation/target`

**Categories:**

- Term: `Navigation`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/Navigation**
  - Template: `/sap/bc/adt/wdy/navigation/target{?uri}`

---

#### Search WDA Entities

**Path:** `/sap/bc/adt/wdy/search`

**Categories:**

- Term: `Search`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/search/mime**
  - Template: `/sap/bc/adt/wdy/search{?operation,mime_source,component_name,query,maxResults}`
- **http://www.sap.com/adt/categories/webdynpro/search/otr**
  - Template: `/sap/bc/adt/wdy/search{?operation,package,query}`
- **http://www.sap.com/adt/categories/webdynpro/search/otr/alias**
  - Template: `/sap/bc/adt/wdy/search{?operation,alias}`
- **http://www.sap.com/adt/categories/webdynpro/search/events**
  - Template: `/sap/bc/adt/wdy/search{?operation,componentName,controllerName,version}`
- **http://www.sap.com/adt/categories/webdynpro/search/usablecontrollers**
  - Template: `/sap/bc/adt/wdy/search{?operation,componentName,controllerName}`
- **http://www.sap.com/adt/categories/webdynpro/search/typeformattingoptions**
  - Template: `/sap/bc/adt/wdy/search{?operation,typeName}`
- **http://www.sap.com/adt/categories/webdynpro/search/ovscompusages**
  - Template: `/sap/bc/adt/wdy/search{?operation,componentName}`
- **http://www.sap.com/adt/categories/webdynpro/search/ddicfields**
  - Template: `/sap/bc/adt/wdy/search{?operation,ddicName}`
- **http://www.sap.com/adt/categories/webdynpro/search/interfaceviewsplugs**
  - Template: `/sap/bc/adt/wdy/search{?operation,componentName}`

---

#### Code template

**Path:** `/sap/bc/adt/wdy/codetemplate`

**Categories:**

- Term: `CodeTemplate`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/CodeTemplate**
  - Template: `/sap/bc/adt/wdy/codetemplate{?compname,contname,version}`

---

#### Web Dynpro Configuration

**Path:** `/sap/bc/adt/wdy/componentconfig`

**Categories:**

- Term: `ComponentConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/componentconfig/create**
  - Template: `/sap/bc/adt/wdy/https://rsc-079-adm.wdf.sap.corp/sap/bc/webdynpro/sap/configure_component`

---

#### Application Configuration

**Path:** `/sap/bc/adt/wdy/applicationconfig`

**Categories:**

- Term: `ApplicationConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

**Template Links:**

- **http://www.sap.com/adt/categories/webdynpro/applicationconfig/create**
  - Template: `/sap/bc/adt/wdy/https://rsc-079-adm.wdf.sap.corp/sap/bc/webdynpro/sap/configure_application`

---

#### FPM Application Configuration

**Path:** `/sap/bc/adt/wdy/fpmapplications`

**Categories:**

- Term: `FPMApplicationConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### FPM Flooplan Configuration

**Path:** `/sap/bc/adt/wdy/fpmfloorplans`

**Categories:**

- Term: `FPMFloorPlanConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### FPM Adaptable Configuration

**Path:** `/sap/bc/adt/wdy/fpmadaptables`

**Categories:**

- Term: `FPMAdaptableConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### FPM Layout Component Configuration

**Path:** `/sap/bc/adt/wdy/fpmcomponents`

**Categories:**

- Term: `FPMLayoutConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### FPM Adaptable Configuration

**Path:** `/sap/bc/adt/wdy/fpmguibbs`

**Categories:**

- Term: `FPMGUIBBConfiguration`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

#### FPM Adaptable Configuration

**Path:** `/sap/bc/adt/wdy/fpmruibbs`

**Categories:**

- Term: `FPMRU`
  - Scheme: `http://www.sap.com/adt/categories/webdynpro`

---

## ABAP Cross Trace

| Collection | Path | Categories |
|------------|------|------------|
| ABAP Cross Trace: Traces | `/sap/bc/adt/crosstrace/traces` | traces |
| ABAP Cross Trace: Activations | `/sap/bc/adt/crosstrace/activations` | activations |
| ABAP Cross Trace: Components | `/sap/bc/adt/crosstrace/components` | components |
| ABAP Cross Trace: Request Types | `/sap/bc/adt/crosstrace/request_types` | request_types |
| ABAP Cross Trace: URI Mapping | `/sap/bc/adt/crosstrace/urimapping` | urimapping |

### Collection Details

#### ABAP Cross Trace: Traces

**Path:** `/sap/bc/adt/crosstrace/traces`

**Categories:**

- Term: `traces`
  - Scheme: `http://www.sap.com/adt/crosstrace`

**Template Links:**

- **traces**
  - Template: `/sap/bc/adt/crosstrace/traces{?traceUser,actCreateUser,actChangeUser}`
  - Type: `application/vnd.sap.adt.crosstrace.traces.v1+xml`
- **trace**
  - Template: `/sap/bc/adt/crosstrace/traces/{traceId}`
  - Type: `application/vnd.sap.adt.crosstrace.traces.v1+xml`
- **trace**
  - Template: `/sap/bc/adt/crosstrace/traces/{traceId}{?includeSensitiveData}`
  - Type: `application/vnd.sap.adt.crosstrace.trace.full.v1+json`
- **records**
  - Template: `/sap/bc/adt/crosstrace/traces/{traceId}/records`
- **record-content**
  - Template: `/sap/bc/adt/crosstrace/traces/{traceId}/records/{recordNumber}/content`

**Accepted Content Types:**

- `application/vnd.sap.adt.crosstrace.trace.full.v1+json`

---

#### ABAP Cross Trace: Activations

**Path:** `/sap/bc/adt/crosstrace/activations`

**Categories:**

- Term: `activations`
  - Scheme: `http://www.sap.com/adt/crosstrace`

**Template Links:**

- **activation**
  - Template: `/sap/bc/adt/crosstrace/activations/{activationId}`

**Accepted Content Types:**

- `application/vnd.sap.adt.crosstrace.activations.v1+xml`
- `application/vnd.sap.adt.crosstrace.activations.v1.b+xml`

---

#### ABAP Cross Trace: Components

**Path:** `/sap/bc/adt/crosstrace/components`

**Categories:**

- Term: `components`
  - Scheme: `http://www.sap.com/adt/crosstrace`

---

#### ABAP Cross Trace: Request Types

**Path:** `/sap/bc/adt/crosstrace/request_types`

**Categories:**

- Term: `request_types`
  - Scheme: `http://www.sap.com/adt/crosstrace`

---

#### ABAP Cross Trace: URI Mapping

**Path:** `/sap/bc/adt/crosstrace/urimapping`

**Categories:**

- Term: `urimapping`
  - Scheme: `http://www.sap.com/adt/crosstrace`

**Template Links:**

- **include**
  - Template: `/sap/bc/adt/crosstrace/urimapping{?program,include,line,offset}`
- **workbench-object**
  - Template: `/sap/bc/adt/crosstrace/urimapping{?objectType,objectName,component,subComponent}`

---

## ABAP Language Help

| Collection | Path | Categories |
|------------|------|------------|
| ABAP Language Help | `/sap/bc/adt/docu/abap/langu` | adtlanguagehelp |

### Collection Details

#### ABAP Language Help

**Path:** `/sap/bc/adt/docu/abap/langu`

**Categories:**

- Term: `adtlanguagehelp`
  - Scheme: `http://www.sap.com/adt/categories/documentation/abap`

**Template Links:**

- **http://www.sap.com/adt/relations/docu/abap/langu/docu**
  - Template: `/sap/bc/adt/docu/abap/langu{?format,language,uri,version}`
  - Title: ABAP Language Documentation ABAP Editor
- **http://www.sap.com/adt/relations/docu/abap/langu/docu/query**
  - Template: `/sap/bc/adt/docu/abap/langu{?format,language,query,version}`
  - Title: ABAP Language Documentation Search field

---

## Transformation

| Collection | Path | Categories |
|------------|------|------------|
| Transformation | `/sap/bc/adt/xslt/transformations` | transformations |

### Collection Details

#### Transformation

**Path:** `/sap/bc/adt/xslt/transformations`

**Categories:**

- Term: `transformations`
  - Scheme: `http://www.sap.com/adt/categories/transformations`

**Template Links:**

- **http://www.sap.com/adt/categories/transformations/formatter**
  - Template: `/sap/bc/adt/xslt/transformations/{transformationname}/formatter`
  - Title: Formatter
- **http://www.sap.com/adt/categories/transformations/navigation**
  - Template: `/sap/bc/adt/xslt/transformations/{transformationname}/navigation`
  - Title: Navigation
- **http://www.sap.com/adt/categories/transformations/validation**
  - Template: `/sap/bc/adt/xslt/transformations/{transformationname}/validation`
  - Title: Validation

**Accepted Content Types:**

- `application/vnd.sap.adt.transformations+xml`

---
