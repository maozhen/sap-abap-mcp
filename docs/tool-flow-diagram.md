# Cline 工具调用流程图

本文档包含 Cline 工具系统的详细流程图，使用 Mermaid 格式。

## 1. 工具系统整体架构图

```mermaid
graph TB
    subgraph "Cline Extension"
        Task["Task<br/>任务类"]
        ToolExecutor["ToolExecutor<br/>工具执行器"]
        Coordinator["ToolExecutorCoordinator<br/>工具执行协调器"]
        Validator["ToolValidator<br/>工具验证器"]
        
        subgraph "Tool Handlers (23个)"
            ReadFile["ReadFileToolHandler"]
            WriteFile["WriteToFileToolHandler"]
            ExecuteCmd["ExecuteCommandToolHandler"]
            Browser["BrowserToolHandler"]
            UseMcp["UseMcpToolHandler"]
            Others["...其他处理器"]
        end
        
        subgraph "MCP System"
            McpHub["McpHub<br/>MCP服务中心"]
            
            subgraph "Transports"
                Stdio["Stdio Transport"]
                SSE["SSE Transport"]
                HTTP["StreamableHTTP Transport"]
            end
        end
    end
    
    subgraph "External MCP Servers"
        LocalServer["本地MCP服务器<br/>(命令行进程)"]
        RemoteServer["远程MCP服务器<br/>(SSE/HTTP)"]
    end
    
    Task --> ToolExecutor
    ToolExecutor --> Coordinator
    ToolExecutor --> Validator
    Coordinator --> ReadFile
    Coordinator --> WriteFile
    Coordinator --> ExecuteCmd
    Coordinator --> Browser
    Coordinator --> UseMcp
    Coordinator --> Others
    
    UseMcp --> McpHub
    McpHub --> Stdio
    McpHub --> SSE
    McpHub --> HTTP
    
    Stdio --> LocalServer
    SSE --> RemoteServer
    HTTP --> RemoteServer
    
    style Task fill:#e1f5fe
    style ToolExecutor fill:#e8f5e9
    style Coordinator fill:#fff3e0
    style McpHub fill:#fce4ec
```

## 2. 工具调用主流程

```mermaid
flowchart TD
    A[AI模型响应] --> B{解析内容块类型}
    B -->|text| C[显示文本]
    B -->|tool_use| D[Task.presentAssistantMessage]
    
    D --> E[ToolExecutor.execute]
    
    E --> F{工具是否已注册?}
    F -->|否| G[返回 false]
    F -->|是| H{用户是否拒绝前一工具?}
    
    H -->|是| I[pushToolResult: 用户拒绝]
    H -->|否| J{计划模式限制?}
    
    J -->|受限| K[pushToolResult: 模式限制]
    J -->|允许| L{块是否部分完成?}
    
    L -->|是 partial=true| M[handlePartialBlock<br/>流式UI更新]
    L -->|否 partial=false| N[handleCompleteBlock<br/>完整执行]
    
    M --> O[等待下一个块]
    
    N --> P[运行 PreToolUse 钩子]
    P --> Q[coordinator.execute]
    Q --> R[运行 PostToolUse 钩子]
    R --> S[保存检查点]
    S --> T[pushToolResult]
    
    style A fill:#e3f2fd
    style D fill:#e8f5e9
    style E fill:#fff3e0
    style N fill:#fce4ec
    style Q fill:#f3e5f5
```

## 3. 工具处理器执行流程

```mermaid
flowchart TD
    A[ToolExecutorCoordinator.execute] --> B[获取处理器<br/>handlers.get]
    B --> C{处理器存在?}
    C -->|否| D[抛出错误]
    C -->|是| E[handler.execute]
    
    E --> F[参数验证<br/>validator.assertRequiredParams]
    F --> G{参数有效?}
    G -->|否| H[返回错误响应]
    G -->|是| I[路径权限检查<br/>checkClineIgnorePath]
    
    I --> J{路径允许?}
    J -->|否| K[返回权限错误]
    J -->|是| L{需要用户批准?}
    
    L -->|是| M[请求用户批准]
    M --> N{用户批准?}
    N -->|否| O[返回 toolDenied]
    N -->|是| P[执行具体操作]
    
    L -->|否 自动批准| P
    
    P --> Q[返回执行结果]
    
    style A fill:#e3f2fd
    style E fill:#e8f5e9
    style F fill:#fff3e0
    style P fill:#c8e6c9
```

## 4. MCP 工具调用流程

```mermaid
flowchart TD
    A["use_mcp_tool<br/>(server_name, tool_name, arguments)"] --> B[UseMcpToolHandler.execute]
    
    B --> C{验证 server_name}
    C -->|缺失| D[返回参数错误]
    C -->|存在| E{验证 tool_name}
    
    E -->|缺失| F[返回参数错误]
    E -->|存在| G{解析 arguments JSON}
    
    G -->|解析失败| H[返回 JSON 格式错误]
    G -->|解析成功| I{检查自动批准}
    
    I -->|自动批准| J[显示工具调用信息]
    I -->|需手动批准| K[请求用户批准]
    
    K --> L{用户批准?}
    L -->|否| M[返回 toolDenied]
    L -->|是| N[运行 PreToolUse 钩子]
    
    J --> N
    
    N --> O{钩子取消?}
    O -->|是| P[返回 toolDenied]
    O -->|否| Q[显示请求开始]
    
    Q --> R[处理待处理通知]
    R --> S[McpHub.callTool]
    
    S --> T[查找服务器连接]
    T --> U{连接存在?}
    U -->|否| V[返回连接错误]
    U -->|是| W{服务器已启用?}
    
    W -->|否| X[返回禁用错误]
    W -->|是| Y[发送 tools/call 请求]
    
    Y --> Z[等待 MCP 服务器响应]
    Z --> AA[处理响应内容]
    AA --> AB[返回格式化结果]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e9
    style S fill:#fce4ec
    style Y fill:#fff3e0
    style Z fill:#f3e5f5
```

## 5. MCP 服务器连接流程

```mermaid
flowchart TD
    A[读取 MCP 设置文件] --> B[解析服务器配置]
    B --> C{遍历每个服务器}
    
    C --> D{服务器类型?}
    
    D -->|stdio| E[创建 StdioClientTransport]
    E --> F[启动本地进程]
    F --> G[连接标准输入输出]
    
    D -->|sse| H[创建 SSEClientTransport]
    H --> I[连接 SSE 端点]
    I --> J[设置重连机制]
    
    D -->|streamableHttp| K[创建 StreamableHTTPTransport]
    K --> L[连接 HTTP 端点]
    
    G --> M[创建 MCP Client]
    J --> M
    L --> M
    
    M --> N[client.connect]
    N --> O{连接成功?}
    
    O -->|否 需要OAuth| P[标记需要认证]
    O -->|否 其他错误| Q[记录错误状态]
    O -->|是| R[设置状态为 connected]
    
    R --> S[注册通知处理器]
    S --> T[获取工具列表<br/>tools/list]
    T --> U[获取资源列表<br/>resources/list]
    U --> V[完成连接]
    
    style A fill:#e3f2fd
    style D fill:#fff3e0
    style M fill:#e8f5e9
    style N fill:#fce4ec
    style V fill:#c8e6c9
```

## 6. 工具类型分类图

```mermaid
graph LR
    subgraph "文件操作工具"
        read_file["read_file<br/>读取文件"]
        write_to_file["write_to_file<br/>写入文件"]
        replace_in_file["replace_in_file<br/>替换内容"]
        apply_patch["apply_patch<br/>应用补丁"]
        list_files["list_files<br/>列出文件"]
        search_files["search_files<br/>搜索文件"]
        list_code_def["list_code_definition_names<br/>代码定义"]
    end
    
    subgraph "命令与浏览器"
        execute_command["execute_command<br/>执行命令"]
        browser_action["browser_action<br/>浏览器操作"]
    end
    
    subgraph "网络操作"
        web_fetch["web_fetch<br/>获取网页"]
        web_search["web_search<br/>网络搜索"]
    end
    
    subgraph "MCP 扩展"
        use_mcp_tool["use_mcp_tool<br/>使用MCP工具"]
        access_mcp_resource["access_mcp_resource<br/>访问MCP资源"]
        load_mcp_docs["load_mcp_documentation<br/>加载MCP文档"]
    end
    
    subgraph "交互工具"
        ask_followup["ask_followup_question<br/>询问用户"]
        attempt_completion["attempt_completion<br/>尝试完成"]
    end
    
    subgraph "模式工具"
        plan_mode["plan_mode_respond<br/>计划模式"]
        act_mode["act_mode_respond<br/>执行模式"]
    end
    
    subgraph "任务管理"
        new_task["new_task<br/>新任务"]
        summarize_task["summarize_task<br/>摘要任务"]
        condense["condense<br/>压缩上下文"]
        focus_chain["focus_chain<br/>焦点链"]
    end
    
    subgraph "其他"
        report_bug["report_bug<br/>报告Bug"]
        new_rule["new_rule<br/>新规则"]
        generate_explanation["generate_explanation<br/>生成解释"]
        use_skill["use_skill<br/>使用技能"]
    end
    
    style read_file fill:#e8f5e9
    style write_to_file fill:#e8f5e9
    style execute_command fill:#fff3e0
    style browser_action fill:#fff3e0
    style use_mcp_tool fill:#fce4ec
    style ask_followup fill:#e3f2fd
```

## 7. 工具批准流程

```mermaid
flowchart TD
    A[工具调用请求] --> B{检查自动批准设置}
    
    B --> C{全局自动批准?}
    C -->|是| D{工具类型允许自动批准?}
    C -->|否| E[请求用户批准]
    
    D -->|是| F{连续自动批准次数}
    D -->|否| E
    
    F --> G{超过阈值?}
    G -->|是| H[触发安全确认]
    G -->|否| I[执行工具]
    
    H --> J{用户确认?}
    J -->|是| I
    J -->|否| K[中断执行]
    
    E --> L{用户响应}
    L -->|批准| I
    L -->|拒绝| M[标记拒绝状态]
    L -->|提供反馈| N[记录反馈并处理]
    
    I --> O[记录遥测数据]
    O --> P[继续执行流程]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style I fill:#c8e6c9
    style K fill:#ffcdd2
    style M fill:#ffcdd2
```

## 8. 钩子机制流程

```mermaid
flowchart TD
    subgraph "PreToolUse 钩子"
        A1[工具执行前] --> B1{PreToolUse 钩子启用?}
        B1 -->|是| C1[运行 PreToolUse]
        B1 -->|否| D1[跳过]
        
        C1 --> E1{钩子结果}
        E1 -->|通过| F1[继续执行]
        E1 -->|取消| G1[抛出 CancellationError]
    end
    
    subgraph "工具执行"
        H[执行工具操作] --> I[获取执行结果]
    end
    
    subgraph "PostToolUse 钩子"
        J1[工具执行后] --> K1{PostToolUse 钩子启用?}
        K1 -->|是| L1[运行 PostToolUse]
        K1 -->|否| M1[跳过]
        
        L1 --> N1[处理钩子响应]
    end
    
    F1 --> H
    D1 --> H
    I --> J1
    
    style A1 fill:#e3f2fd
    style H fill:#e8f5e9
    style J1 fill:#fce4ec
```

---

## 使用说明

这些流程图使用 [Mermaid](https://mermaid.js.org/) 语法编写，可以在以下环境中渲染：

1. **GitHub** - 直接在 GitHub 上查看 Markdown 文件
2. **VS Code** - 安装 Mermaid 预览插件
3. **Mermaid Live Editor** - https://mermaid.live/
4. **GitLab** - 原生支持 Mermaid
5. **Notion** - 支持 Mermaid 代码块

## 图例说明

| 颜色 | 含义 |
|------|------|
| 蓝色 (#e3f2fd) | 入口点/起始 |
| 绿色 (#e8f5e9) | 主要处理逻辑 |
| 橙色 (#fff3e0) | 决策/分支 |
| 粉色 (#fce4ec) | MCP 相关 |
| 红色 (#ffcdd2) | 错误/终止 |
| 浅绿 (#c8e6c9) | 成功完成 |