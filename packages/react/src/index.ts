/**
 * UIX Lucid React Components
 * A Lucid Design System for AI Generation
 *
 * ## Quick Start for AI
 *
 * This is a React component library built for the AI era.
 * All components follow these principles:
 *
 * 1. **Clarity** - Clean, readable interfaces
 * 2. **Consistency** - Predictable API patterns
 * 3. **Composability** - Components work together seamlessly
 *
 * ## Installation
 * ```bash
 * pnpm add @uix-ai/lucid-react
 * ```
 *
 * ## Usage
 * ```tsx
 * import { Button } from '@uix-ai/lucid-react'
 *
 * function App() {
 *   return <Button>Click me</Button>
 * }
 * ```
 *
 * ## Styling
 * This library uses Tailwind CSS. Add to your tailwind.config.ts:
 * ```ts
 * import { lucidPreset } from '@uix-ai/lucid-tokens/tailwind'
 *
 * export default {
 *   presets: [lucidPreset],
 *   content: ['./src/**\/*.{ts,tsx}'],
 * }
 * ```
 */

// Components
export * from './components/button'
export * from './components/input'
export * from './components/badge'
export * from './components/card'
export * from './components/skeleton'

// Utils
export { cn } from './lib/utils'
