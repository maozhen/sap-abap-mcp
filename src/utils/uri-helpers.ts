/**
 * URI Helper Utilities
 * Provides functions for encoding SAP object names in URIs
 */

/**
 * Encode object name for use in SAP ADT URIs
 * 
 * SAP ABAP object names can contain forward slashes (/) for namespaced objects,
 * e.g., /SMB98/PARAMS_FROM_FILENAME, /NAMESPACE/OBJECT_NAME
 * 
 * When constructing URIs, these slashes must be encoded as %2F to avoid
 * being interpreted as path separators.
 * 
 * Example:
 * - Input: /SMB98/PARAMS_FROM_FILENAME
 * - Output: %2fsmb98%2fparams_from_filename
 * 
 * @param name - The object name to encode (will be lowercased)
 * @returns The encoded object name suitable for use in URIs
 */
export function encodeObjectNameForUri(name: string): string {
  // First convert to lowercase as SAP ADT expects lowercase in URIs
  const lowercaseName = name.toLowerCase();
  
  // Encode forward slashes as %2F (and other special characters if needed)
  // Using encodeURIComponent which encodes / as %2F
  return encodeURIComponent(lowercaseName);
}

/**
 * Encode a function group name for use in SAP ADT URIs
 * This is a convenience alias for encodeObjectNameForUri
 * 
 * @param functionGroup - The function group name to encode
 * @returns The encoded function group name
 */
export function encodeFunctionGroupForUri(functionGroup: string): string {
  return encodeObjectNameForUri(functionGroup);
}

/**
 * Build a full object URI with proper encoding
 * 
 * @param uriPrefix - The URI prefix (e.g., '/oo/classes', '/functions/groups')
 * @param objectName - The object name to append
 * @returns The full encoded URI
 */
export function buildObjectUri(uriPrefix: string, objectName: string): string {
  return `${uriPrefix}/${encodeObjectNameForUri(objectName)}`;
}

/**
 * Build a function module URI with proper encoding
 * 
 * @param functionGroup - The function group name
 * @param functionName - The function module name (optional)
 * @returns The encoded URI for the function module or function group's fmodules collection
 */
export function buildFunctionModuleUri(functionGroup: string, functionName?: string): string {
  const baseUri = `/functions/groups/${encodeObjectNameForUri(functionGroup)}/fmodules`;
  if (functionName) {
    return `${baseUri}/${encodeObjectNameForUri(functionName)}`;
  }
  return baseUri;
}