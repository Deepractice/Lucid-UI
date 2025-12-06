/**
 * Lucid UI Design Tokens
 * A Lucid Design System for AI Agents
 */

export * from './colors'
export * from './typography'
export * from './spacing'
export * from './radius'
export * from './shadows'

// Re-export as single tokens object
import { colors, semanticColors } from './colors'
import { fontFamily, fontSize, fontWeight, letterSpacing } from './typography'
import { spacing } from './spacing'
import { radius } from './radius'
import { shadows } from './shadows'

export const tokens = {
  colors,
  semanticColors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  spacing,
  radius,
  shadows,
} as const

export type Tokens = typeof tokens
