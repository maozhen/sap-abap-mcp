# Cline 原生工具系统分析报告

## 目录
1. [概述](#概述)
2. [原生工具列表](#原生工具列表)
3. [工具系统架构](#工具系统架构)
4. [工具调用流程](#工具调用流程)
5. [工具扩展机制](#工具扩展机制)
6. [关键代码分析](#关键代码分析)

---

## 概述

Cline 是一个 VSCode 扩展，提供 AI 辅助编程功能。其工具系统是核心组件之一，负责执行各种操作如文件读写、命令执行、浏览器操作等。

### 核心特点
- **模块化设计**：每个工具有独立的处理器（Handler）
- **统一接口**：所有工具实现 `IToolHandler` 接口
- **流式支持**：支持部分块（partial block）处理，实现实时 UI 更新
- **可扩展性**：通过 MCP（Model Context Protocol）支持外部工具扩展

---

## 原生工具列表

Cline 定义了 **26 个原生工具**，在 `src/shared/tools.ts` 中通过 `ClineDefaultTool` 枚举定义：

| 类别 | 工具名称 | 描述 |
|------|----------|------|
| **文件操作** | `read_file` | 读取文件内容 |
| | `write_to_file` | 创建或覆盖文件 |
| | `replace_in_file` | 使用 SEARCH/REPLACE 块修改文件 |
| | `apply_patch` | 应用补丁修改 |
| | `list_files` | 列出目录文件 |
| | `search_files` | 正则搜索文件内容 |
| | `list_code_definition_names` | 列出代码定义名称 |
| **命令执行** | `execute_command` | 执行 CLI 命令 |
| **浏览器操作** | `browser_action` | Puppeteer 浏览器控制 |
| **网络操作** | `web_fetch` | 获取网页内容 |
| | `web_search` | 网络搜索 |
| **MCP 工具** | `use_mcp_tool` | 使用 MCP 服务器工具 |
| | `access_mcp_resource` | 访问 MCP 资源 |
| | `load_mcp_documentation` | 加载 MCP 文档 |
| **交互工具** | `ask_followup_question` | 询问用户问题 |
| | `attempt_completion` | 尝试完成任务 |
| **模式工具** | `plan_mode_respond` | Plan 模式响应 |
| | `act_mode_respond` | Act 模式响应 |
| **任务管理** | `new_task` | 创建新任务 |
| | `summarize_task` | 摘要任务 |
| | `condense` | 压缩上下文 |
| | `focus_chain` | 焦点链/TODO 管理 |
| **其他** | `report_bug` | 报告 Bug |
| | `new_rule` | 创建新规则 |
| | `generate_explanation` | 生成代码解释 |
| | `use_skill` | 使用技能 |

### 只读工具
以下工具被标记为只读（不修改工作区状态）：
```typescript
export const READ_ONLY_TOOLS = [
  "read_file", "search_files", "list_files", 
  "list_code_definition_names", "browser_action",
  "use_mcp_tool", "access_mcp_resource", "web_search", "web_fetch"
] as const
```

---

## 工具系统架构

### 核心组件

```
┌─────────────────────────────────────────────────────────────────┐
│                         Task (任务类)                            │
│                    src/core/task/index.ts                        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ToolExecutor (工具执行器)                    │
│                   src/core/task/ToolExecutor.ts                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - registerToolHandlers(): 注册23个工具处理器              │    │
│  │  - execute(): 主执行入口                                  │    │
│  │  - handlePartialBlock(): 处理流式UI更新                   │    │
│  │  - handleCompleteBlock(): 处理完整块执行                  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               ToolExecutorCoordinator (工具执行协调器)            │
│           src/core/task/tools/ToolExecutorCoordinator.ts         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - handlers: Map<string, IToolHandler>                   │    │
│  │  - register(): 注册处理器                                 │    │
│  │  - execute(): 路由到对应处理器                            │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ToolHandler 1  │ │  ToolHandler 2  │ │  ToolHandler N  │
│ (ReadFileHandler)│ │(WriteFileHandler)│ │   (...)        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 关键接口

```typescript
// 工具处理器接口
export interface IToolHandler {
  readonly name: ClineDefaultTool
  execute(config: TaskConfig, block: ToolUse): Promise<ToolResponse>
  getDescription(block: ToolUse): string
}

// 部分块处理器接口（支持流式UI）
export interface IPartialBlockHandler {
  handlePartialBlock(block: ToolUse, uiHelpers: StronglyTypedUIHelpers): Promise<void>
}

// 完全托管工具接口（处理自己的批准流程）
export interface IFullyManagedTool extends IToolHandler, IPartialBlockHandler {}

// 共享工具处理器（允许一个处理器注册多个工具名）
export class SharedToolHandler implements IToolHandler {
  constructor(
    public readonly name: ClineDefaultTool,
    private delegate: IToolHandler
  )
}
```

### 工具处理器列表

在 `src/core/task/tools/handlers/` 目录下有 **23 个处理器文件**：

| 处理器文件 | 工具名称 |
|------------|----------|
| `ReadFileToolHandler.ts` | read_file |
| `WriteToFileToolHandler.ts` | write_to_file, replace_in_file, new_rule |
| `ListFilesToolHandler.ts` | list_files |
| `SearchFilesToolHandler.ts` | search_files |
| `ListCodeDefinitionNamesToolHandler.ts` | list_code_definition_names |
| `ExecuteCommandToolHandler.ts` | execute_command |
| `BrowserToolHandler.ts` | browser_action |
| `AskFollowupQuestionToolHandler.ts` | ask_followup_question |
| `AttemptCompletionHandler.ts` | attempt_completion |
| `UseMcpToolHandler.ts` | use_mcp_tool |
| `AccessMcpResourceHandler.ts` | access_mcp_resource |
| `LoadMcpDocumentationHandler.ts` | load_mcp_documentation |
| `NewTaskHandler.ts` | new_task |
| `PlanModeRespondHandler.ts` | plan_mode_respond |
| `ActModeRespondHandler.ts` | act_mode_respond |
| `WebFetchToolHandler.ts` | web_fetch |
| `WebSearchToolHandler.ts` | web_search |
| `CondenseHandler.ts` | condense |
| `SummarizeTaskHandler.ts` | summarize_task |
| `ReportBugHandler.ts` | report_bug |
| `ApplyPatchHandler.ts` | apply_patch |
| `GenerateExplanationToolHandler.ts` | generate_explanation |
| `UseSkillToolHandler.ts` | use_skill |

---

## 工具调用流程

### 流程图

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            AI 模型响应                                    │
│                    (包含 tool_use 类型的内容块)                           │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Task.presentAssistantMessage()                        │
│                        src/core/task/index.ts                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  const block = assistantMessageContent[currentStreamingContentIndex]│  │
│  │  switch (block.type) {                                              │  │
│  │    case "text": await this.say("text", content); break              │  │
│  │    case "tool_use": await this.toolExecutor.executeTool(block)      │  │
│  │  }                                                                  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       ToolExecutor.execute()                              │
│                    src/core/task/ToolExecutor.ts                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1. 检查工具是否已注册: if (!coordinator.has(block.name))           │  │
│  │  2. 检查用户是否拒绝前一工具: if (taskState.didRejectTool)          │  │
│  │  3. 检查计划模式限制: if (strictPlanModeEnabled && isPlanRestricted)│  │
│  │  4. 处理部分块（流式）: if (block.partial) handlePartialBlock()     │  │
│  │  5. 处理完整块: handleCompleteBlock()                               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
              ▼                                     ▼
┌─────────────────────────────┐       ┌─────────────────────────────────────┐
│   handlePartialBlock()      │       │      handleCompleteBlock()           │
│   (流式UI更新)               │       │      (完整执行流程)                   │
│  ┌───────────────────────┐  │       │  ┌───────────────────────────────┐  │
│  │ 检查是否实现           │  │       │  │ 1. 运行 PreToolUse 钩子        │  │
│  │ IPartialBlockHandler  │  │       │  │ 2. 执行工具: coordinator.execute│  │
│  │ 或 IFullyManagedTool  │  │       │  │ 3. 运行 PostToolUse 钩子       │  │
│  │ 调用 handlePartialBlock│  │       │  │ 4. 保存检查点                  │  │
│  └───────────────────────┘  │       │  │ 5. 推送工具结果                │  │
└─────────────────────────────┘       │  └───────────────────────────────┘  │
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │    ToolExecutorCoordinator.execute() │
                                      │  ┌───────────────────────────────┐  │
                                      │  │ handler = handlers.get(name)  │  │
                                      │  │ return handler.execute(config,│  │
                                      │  │                        block) │  │
                                      │  └───────────────────────────────┘  │
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │      具体工具处理器执行               │
                                      │  (如 ReadFileToolHandler.execute())  │
                                      │  ┌───────────────────────────────┐  │
                                      │  │ 1. 参数验证                    │  │
                                      │  │ 2. 请求用户批准（如需要）       │  │
                                      │  │ 3. 执行具体操作                │  │
                                      │  │ 4. 返回结果                    │  │
                                      │  └───────────────────────────────┘  │
                                      └─────────────────────────────────────┘
```

### 详细执行流程

#### 1. 部分块处理（Partial Block）- 流式 UI
```typescript
private async handlePartialBlock(block: ToolUse, config: TaskConfig): Promise<void> {
  const handler = this.coordinator.getHandler(block.name)
  
  // 检查是否是完全托管工具
  if (this.isFullyManagedTool(handler)) {
    await handler.handlePartialBlock(block, this.uiHelpers)
    return
  }
  
  // 检查是否实现部分块处理
  if (this.hasPartialBlockHandler(handler)) {
    await handler.handlePartialBlock(block, this.uiHelpers)
  }
}
```

#### 2. 完整块处理（Complete Block）- 标准执行
```typescript
private async handleCompleteBlock(block: ToolUse, config: TaskConfig): Promise<void> {
  const handler = this.coordinator.getHandler(block.name)
  
  // 完全托管工具自己处理整个流程
  if (this.isFullyManagedTool(handler)) {
    const result = await handler.execute(config, block)
    this.taskState.pushToolResult(result)
    return
  }
  
  // 标准流程
  // 1. 运行 PreToolUse 钩子
  await ToolHookUtils.runPreToolUseIfEnabled(config, block)
  
  // 2. 执行工具
  const result = await this.coordinator.execute(config, block)
  
  // 3. 运行 PostToolUse 钩子
  await ToolHookUtils.runPostToolUseIfEnabled(config, block, result)
  
  // 4. 保存检查点
  await this.saveCheckpoint()
  
  // 5. 推送结果
  this.taskState.pushToolResult(result)
}
```

---

## 工具扩展机制

Cline 支持通过 **MCP（Model Context Protocol）** 扩展工具系统。

### MCP 架构

```
┌─────────────────────────────────────────────────────────────────┐
│                          Cline Extension                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                        McpHub                              │  │
│  │                src/services/mcp/McpHub.ts                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  - connections: McpConnection[]                      │  │  │
│  │  │  - connectToServer(): 连接MCP服务器                   │  │  │
│  │  │  - callTool(): 调用MCP工具                           │  │  │
│  │  │  - readResource(): 读取MCP资源                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                  MCP Transport Layer                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │  │
│  │  │   Stdio     │ │    SSE      │ │  StreamableHTTP     │  │  │
│  │  │ Transport   │ │ Transport   │ │    Transport        │  │  │
│  │  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘  │  │
│  └─────────┼───────────────┼───────────────────┼─────────────┘  │
└────────────┼───────────────┼───────────────────┼────────────────┘
             │               │                   │
             ▼               ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   Local MCP     │ │   Remote MCP    │ │    HTTP MCP         │
│    Server       │ │    Server       │ │     Server          │
│  (命令行进程)    │ │   (SSE连接)     │ │  (HTTP REST API)    │
└─────────────────┘ └─────────────────┘ └─────────────────────┘
```

### MCP 服务器配置

MCP 服务器在 `cline_mcp_settings.json` 中配置：

```json
{
  "mcpServers": {
    "example-server": {
      "type": "stdio",
      "command": "node",
      "args": ["path/to/server/index.js"],
      "env": {},
      "autoApprove": ["tool1", "tool2"],
      "timeout": 60
    },
    "remote-server": {
      "type": "sse",
      "url": "https://example.com/mcp",
      "headers": {}
    }
  }
}
```

### MCP 工具调用流程

```
┌─────────────────────────────────────────────────────────────────┐
│                  AI 请求使用 MCP 工具                            │
│           use_mcp_tool(server_name, tool_name, arguments)        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   UseMcpToolHandler.execute()                    │
│           src/core/task/tools/handlers/UseMcpToolHandler.ts      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. 验证 server_name 和 tool_name 参数                     │  │
│  │  2. 解析 JSON arguments                                    │  │
│  │  3. 检查自动批准设置                                       │  │
│  │  4. 请求用户批准（如需要）                                  │  │
│  │  5. 运行 PreToolUse 钩子                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     McpHub.callTool()                            │
│                  src/services/mcp/McpHub.ts                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. 查找服务器连接                                         │  │
│  │  2. 获取超时配置                                           │  │
│  │  3. 发送 tools/call 请求到 MCP 服务器                       │  │
│  │  4. 返回执行结果                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MCP Server                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  执行工具逻辑，返回结果                                     │  │
│  │  {                                                         │  │
│  │    content: [                                              │  │
│  │      { type: "text", text: "result" },                     │  │
│  │      { type: "image", data: "base64...", mimeType: "..." } │  │
│  │    ],                                                      │  │
│  │    isError: false                                          │  │
│  │  }                                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 添加自定义 MCP 服务器

要扩展 Cline 的工具能力，可以：

1. **创建 MCP 服务器**：实现 MCP 协议的服务器
2. **配置服务器**：在 `cline_mcp_settings.json` 中添加配置
3. **使用工具**：AI 可以通过 `use_mcp_tool` 调用服务器提供的工具

MCP 服务器类型：
- **Stdio**：本地命令行进程
- **SSE**：Server-Sent Events 远程服务器
- **StreamableHTTP**：HTTP REST API 服务器

---

## 关键代码分析

### 1. 工具注册机制

```typescript
// src/core/task/ToolExecutor.ts
private registerToolHandlers(): void {
  const validator = new ToolValidator(this.clineIgnoreController)
  
  // 注册标准工具处理器
  this.coordinator.register(new ListFilesToolHandler(validator))
  this.coordinator.register(new ReadFileToolHandler(validator))
  this.coordinator.register(new SearchFilesToolHandler(validator))
  // ... 其他处理器
  
  // 使用 SharedToolHandler 共享实现
  const writeHandler = new WriteToFileToolHandler(validator)
  this.coordinator.register(writeHandler)  // write_to_file
  this.coordinator.register(new SharedToolHandler(ClineDefaultTool.FILE_EDIT, writeHandler))  // replace_in_file
  this.coordinator.register(new SharedToolHandler(ClineDefaultTool.NEW_RULE, writeHandler))   // new_rule
}
```

### 2. 工具验证机制

```typescript
// src/core/task/tools/ToolValidator.ts
export class ToolValidator {
  // 验证必需参数
  assertRequiredParams(block: ToolUse, ...params: ToolParamName[]): ValidationResult {
    for (const param of params) {
      if (!block.params[param]) {
        return { valid: false, error: `Missing required parameter: ${param}` }
      }
    }
    return { valid: true }
  }
  
  // 检查 .clineignore 路径权限
  checkClineIgnorePath(relPath: string): ValidationResult {
    if (this.clineIgnoreController?.isIgnored(relPath)) {
      return { valid: false, error: `Path is ignored by .clineignore: ${relPath}` }
    }
    return { valid: true }
  }
}
```

### 3. 自动批准机制

```typescript
// MCP 工具自动批准检查
const isToolAutoApproved = config.services.mcpHub.connections
  ?.find((conn) => conn.server.name === server_name)
  ?.server.tools?.find((tool) => tool.name === tool_name)?.autoApprove

if (config.callbacks.shouldAutoApproveTool(block.name) && isToolAutoApproved) {
  // 自动批准流程
  await config.callbacks.say("use_mcp_server", completeMessage)
} else {
  // 手动批准流程
  const didApprove = await ToolResultUtils.askApprovalAndPushFeedback(...)
  if (!didApprove) {
    return formatResponse.toolDenied()
  }
}
```

### 4. 钩子机制

```typescript
// PreToolUse 钩子 - 工具执行前
await ToolHookUtils.runPreToolUseIfEnabled(config, block)

// PostToolUse 钩子 - 工具执行后
await ToolHookUtils.runPostToolUseIfEnabled(config, block, result)
```

---

## 总结

Cline 的工具系统设计体现了以下优秀实践：

1. **模块化**：每个工具独立封装在处理器中
2. **接口统一**：所有工具实现相同接口，便于管理
3. **流式支持**：支持实时 UI 更新的部分块处理
4. **可扩展**：通过 MCP 协议支持无限扩展
5. **安全性**：多层批准机制和 .clineignore 权限控制
6. **钩子机制**：支持工具执行前后的自定义逻辑

这种架构使得 Cline 既能提供丰富的内置工具，又能通过 MCP 协议灵活扩展，满足各种复杂的 AI 辅助编程场景。