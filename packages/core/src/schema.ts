/**
 * UIX IR JSON Schema utilities
 *
 * Provides schema metadata and a validation function stub
 * for the UIX Intermediate Representation protocol.
 */

import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Current schema version */
export const SCHEMA_VERSION = '0.1.0'

/** Canonical URL for the published JSON Schema */
export const SCHEMA_URL = 'https://uix.deepractice.org/schema/uix-ir.schema.json'

/**
 * Resolve the absolute path to the bundled JSON Schema file.
 */
export function getSchemaPath(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return resolve(__dirname, '../schema/uix-ir.schema.json')
}

/**
 * Validate a value against the UIX IR schema.
 *
 * This is a stub that performs basic structural checks.
 * For full JSON Schema validation, use a library such as Ajv
 * with the schema file returned by {@link getSchemaPath}.
 *
 * @param data - The value to validate
 * @returns An object indicating whether validation passed and any errors
 */
export function validate(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Root value must be an object'] }
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.id !== 'string') {
    errors.push('Missing or invalid "id" (expected string)')
  }
  if (!['user', 'assistant', 'system'].includes(obj.role as string)) {
    errors.push('Missing or invalid "role" (expected "user" | "assistant" | "system")')
  }
  if (!['streaming', 'completed', 'error'].includes(obj.status as string)) {
    errors.push('Missing or invalid "status" (expected "streaming" | "completed" | "error")')
  }
  if (!Array.isArray(obj.blocks)) {
    errors.push('Missing or invalid "blocks" (expected array)')
  }
  if (typeof obj.timestamp !== 'number') {
    errors.push('Missing or invalid "timestamp" (expected number)')
  }

  return { valid: errors.length === 0, errors }
}
