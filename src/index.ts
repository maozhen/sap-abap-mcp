#!/usr/bin/env node
/**
 * SAP ABAP MCP Server - Entry Point
 * 
 * This is the main entry point for the SAP ABAP MCP Server.
 * It reads configuration from environment variables and starts the server.
 */

import { SAPABAPMCPServer } from './server.js';
import { SAPConnectionConfig, MCPServerConfig } from './types/index.js';

/**
 * Get required environment variable or throw error
 */
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Error: Required environment variable ${name} is not set`);
    process.exit(1);
  }
  return value;
}

/**
 * Get optional environment variable with default value
 */
function getOptionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Parse boolean environment variable
 */
function getBoolEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse number environment variable
 */
function getNumberEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Build SAP connection configuration from environment variables
 */
function buildSAPConfig(): SAPConnectionConfig {
  return {
    host: getRequiredEnv('SAP_HOST'),
    port: getNumberEnv('SAP_PORT', 443),
    client: getRequiredEnv('SAP_CLIENT'),
    username: getRequiredEnv('SAP_USER'),
    password: getRequiredEnv('SAP_PASSWORD'),
    https: getBoolEnv('SAP_SSL', true),
    language: getOptionalEnv('SAP_LANGUAGE', 'EN'),
    allowInsecure: getBoolEnv('SAP_ALLOW_INSECURE', false),
  };
}

/**
 * Validate SAP package name format
 * Package names must start with Z, Y, or $ (customer namespace)
 */
function validatePackageName(packageName: string | undefined): string | undefined {
  const upperName = packageName ? packageName.toUpperCase(): '';
  if (!upperName.startsWith('Z') && !upperName.startsWith('Y') && !upperName.startsWith('$')) {
    console.error(`Error: SAP_PACKAGE_NAME must start with Z, Y, or $ (customer namespace)`);
    console.error(`  Current value: ${packageName}`);
    process.exit(1);
  }
  
  return packageName;
}

/**
 * Build MCP server configuration from environment variables
 */
function buildMCPConfig(sapConnection: SAPConnectionConfig): MCPServerConfig {
  return {
    name: 'sap-abap-mcp-server',
    version: '1.0.0',
    sapConnection,
    logLevel: getOptionalEnv('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
    timeout: getNumberEnv('REQUEST_TIMEOUT', 30000),
    maxRetries: getNumberEnv('MAX_RETRIES', 3),
    packageName: validatePackageName(process.env.SAP_PACKAGE_NAME),
  };
}

/**
 * Print startup banner
 */
function printBanner(): void {
  console.error('╔════════════════════════════════════════════════════════════╗');
  console.error('║           SAP ABAP MCP Server v1.0.0                       ║');
  console.error('║   Model Context Protocol Server for ABAP Development       ║');
  console.error('╚════════════════════════════════════════════════════════════╝');
  console.error('');
}

/**
 * Print configuration summary (hiding sensitive data)
 */
function printConfig(sapConfig: SAPConnectionConfig, mcpConfig: MCPServerConfig): void {
  console.error('Configuration:');
  console.error(`  SAP Host: ${sapConfig.host}`);
  console.error(`  SAP Port: ${sapConfig.port}`);
  console.error(`  SAP Client: ${sapConfig.client}`);
  console.error(`  SAP User: ${sapConfig.username}`);
  console.error(`  SSL: ${sapConfig.https}`);
  console.error(`  Allow Insecure: ${sapConfig.allowInsecure}`);
  console.error(`  Language: ${sapConfig.language}`);
  console.error(`  Log Level: ${mcpConfig.logLevel}`);
  console.error(`  Timeout: ${mcpConfig.timeout}ms`);
  console.error(`  Max Retries: ${mcpConfig.maxRetries}`);
  console.error(`  SAP Package: ${mcpConfig.packageName}`);
  console.error('');
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  printBanner();

  // Build configurations
  const sapConfig = buildSAPConfig();
  const mcpConfig = buildMCPConfig(sapConfig);

  printConfig(sapConfig, mcpConfig);

  // Create and start server
  const server = new SAPABAPMCPServer(mcpConfig, sapConfig);

  // Handle graceful shutdown
  const shutdown = async (signal: string) => {
    console.error(`\nReceived ${signal}, shutting down...`);
    try {
      await server.stop();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  // Start the server
  try {
    await server.start();
    console.error('Server is running. Press Ctrl+C to stop.');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});