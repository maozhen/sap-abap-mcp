/**
 * Logger Utility for SAP ABAP MCP Server
 * Provides consistent logging with levels, timestamps, and context
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export interface LogContext {
  module?: string;
  operation?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: string;
  message: string;
  context?: LogContext;
  error?: Error;
  data?: unknown;
}

export interface LoggerConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableColor: boolean;
  outputFormat: 'json' | 'text';
}

// ANSI color codes for terminal output
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

const LevelColors: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: Colors.gray,
  [LogLevel.INFO]: Colors.cyan,
  [LogLevel.WARN]: Colors.yellow,
  [LogLevel.ERROR]: Colors.red,
  [LogLevel.NONE]: Colors.reset
};

const LevelNames: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.NONE]: 'NONE'
};

/**
 * Logger class for consistent logging across the MCP server
 */
export class Logger {
  private config: LoggerConfig;
  private defaultContext: LogContext;

  constructor(config?: Partial<LoggerConfig>, defaultContext?: LogContext) {
    this.config = {
      level: config?.level ?? LogLevel.INFO,
      enableTimestamp: config?.enableTimestamp ?? true,
      enableColor: config?.enableColor ?? true,
      outputFormat: config?.outputFormat ?? 'text'
    };
    this.defaultContext = defaultContext ?? {};
  }

  /**
   * Set the log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get the current log level
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger(this.config, {
      ...this.defaultContext,
      ...context
    });
    return childLogger;
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: unknown, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: unknown, context?: LogContext): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown, context?: LogContext): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : undefined;
    const data = error instanceof Error ? undefined : error;
    this.log(LogLevel.ERROR, message, data, context, errorObj);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: LogContext,
    error?: Error
  ): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      levelName: LevelNames[level],
      message,
      context: { ...this.defaultContext, ...context },
      error,
      data
    };

    if (this.config.outputFormat === 'json') {
      this.outputJSON(entry);
    } else {
      this.outputText(entry);
    }
  }

  /**
   * Output log entry as JSON
   */
  private outputJSON(entry: LogEntry): void {
    const output: Record<string, unknown> = {
      timestamp: entry.timestamp,
      level: entry.levelName,
      message: entry.message
    };

    if (entry.context && Object.keys(entry.context).length > 0) {
      output.context = entry.context;
    }

    if (entry.data !== undefined) {
      output.data = entry.data;
    }

    if (entry.error) {
      output.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack
      };
    }

    const stream = entry.level >= LogLevel.ERROR ? process.stderr : process.stderr;
    stream.write(JSON.stringify(output) + '\n');
  }

  /**
   * Output log entry as formatted text
   */
  private outputText(entry: LogEntry): void {
    const parts: string[] = [];

    // Timestamp
    if (this.config.enableTimestamp) {
      const timestamp = this.config.enableColor
        ? `${Colors.dim}${entry.timestamp}${Colors.reset}`
        : entry.timestamp;
      parts.push(`[${timestamp}]`);
    }

    // Level
    const levelName = this.config.enableColor
      ? `${LevelColors[entry.level]}${entry.levelName.padEnd(5)}${Colors.reset}`
      : entry.levelName.padEnd(5);
    parts.push(`[${levelName}]`);

    // Context (module, operation)
    if (entry.context?.module) {
      const module = this.config.enableColor
        ? `${Colors.magenta}${entry.context.module}${Colors.reset}`
        : entry.context.module;
      parts.push(`[${module}]`);
    }

    if (entry.context?.operation) {
      const operation = this.config.enableColor
        ? `${Colors.blue}${entry.context.operation}${Colors.reset}`
        : entry.context.operation;
      parts.push(`[${operation}]`);
    }

    // Message
    parts.push(entry.message);

    // Data
    if (entry.data !== undefined) {
      const dataStr = typeof entry.data === 'string'
        ? entry.data
        : JSON.stringify(entry.data, null, 2);
      parts.push('\n' + dataStr);
    }

    // Error
    if (entry.error) {
      const errorStr = this.config.enableColor
        ? `${Colors.red}${entry.error.name}: ${entry.error.message}${Colors.reset}`
        : `${entry.error.name}: ${entry.error.message}`;
      parts.push('\n' + errorStr);
      if (entry.error.stack) {
        const stackStr = this.config.enableColor
          ? `${Colors.dim}${entry.error.stack}${Colors.reset}`
          : entry.error.stack;
        parts.push('\n' + stackStr);
      }
    }

    const stream = entry.level >= LogLevel.ERROR ? process.stderr : process.stderr;
    stream.write(parts.join(' ') + '\n');
  }

  /**
   * Log method entry with parameters (for debugging)
   */
  methodEntry(methodName: string, params?: Record<string, unknown>): void {
    this.debug(`Entering ${methodName}`, params ? { params } : undefined, {
      operation: methodName
    });
  }

  /**
   * Log method exit with result (for debugging)
   */
  methodExit(methodName: string, result?: unknown): void {
    this.debug(`Exiting ${methodName}`, result !== undefined ? { result } : undefined, {
      operation: methodName
    });
  }

  /**
   * Log HTTP request
   */
  httpRequest(method: string, url: string, headers?: Record<string, string>): void {
    this.debug(`HTTP Request: ${method} ${url}`, headers ? { headers } : undefined, {
      operation: 'http-request'
    });
  }

  /**
   * Log HTTP response
   */
  httpResponse(statusCode: number, statusText: string, duration?: number): void {
    const durationStr = duration !== undefined ? ` (${duration}ms)` : '';
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(level, `HTTP Response: ${statusCode} ${statusText}${durationStr}`, undefined, {
      operation: 'http-response'
    });
  }

  /**
   * Log ADT operation
   */
  adtOperation(operation: string, objectType?: string, objectName?: string): void {
    const details = [objectType, objectName].filter(Boolean).join('/');
    this.info(`ADT: ${operation}${details ? ` - ${details}` : ''}`, undefined, {
      operation: 'adt'
    });
  }

  /**
   * Log MCP tool call
   */
  mcpToolCall(toolName: string, args?: Record<string, unknown>): void {
    this.info(`MCP Tool: ${toolName}`, args ? { arguments: args } : undefined, {
      operation: 'mcp-tool'
    });
  }

  /**
   * Log MCP tool result
   */
  mcpToolResult(toolName: string, success: boolean, duration?: number): void {
    const durationStr = duration !== undefined ? ` (${duration}ms)` : '';
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    const status = success ? 'completed' : 'failed';
    this.log(level, `MCP Tool: ${toolName} ${status}${durationStr}`, undefined, {
      operation: 'mcp-tool'
    });
  }
}

/**
 * Parse log level from string
 */
export function parseLogLevel(levelStr: string): LogLevel {
  const normalized = levelStr.toUpperCase();
  switch (normalized) {
    case 'DEBUG':
      return LogLevel.DEBUG;
    case 'INFO':
      return LogLevel.INFO;
    case 'WARN':
    case 'WARNING':
      return LogLevel.WARN;
    case 'ERROR':
      return LogLevel.ERROR;
    case 'NONE':
    case 'OFF':
      return LogLevel.NONE;
    default:
      return LogLevel.INFO;
  }
}

/**
 * Create logger from environment variables
 */
export function createLoggerFromEnv(defaultContext?: LogContext): Logger {
  const level = parseLogLevel(process.env.LOG_LEVEL ?? 'INFO');
  const outputFormat = process.env.LOG_FORMAT === 'json' ? 'json' : 'text';
  const enableColor = process.env.NO_COLOR === undefined && process.env.LOG_FORMAT !== 'json';

  return new Logger(
    {
      level,
      enableTimestamp: true,
      enableColor,
      outputFormat
    },
    defaultContext
  );
}

// Default logger instance
export const logger = createLoggerFromEnv({ module: 'sap-abap-mcp' });

export default logger;