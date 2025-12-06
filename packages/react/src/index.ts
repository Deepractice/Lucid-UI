/**
 * Lucid UI React Components
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
 * pnpm add @lucidui/react @lucidui/tokens
 * ```
 *
 * ## Usage
 * ```tsx
 * import { Button } from '@lucidui/react'
 *
 * function App() {
 *   return <Button>Click me</Button>
 * }
 * ```
 *
 * ## Styling
 * This library uses Tailwind CSS. Add to your tailwind.config.ts:
 * ```ts
 * import { lucidPreset } from '@lucidui/tokens/tailwind'
 *
 * export default {
 *   presets: [lucidPreset],
 *   content: ['./src/**\/*.{ts,tsx}'],
 * }
 * ```
 */

// Components
export * from './components/button'

// Utils
export { cn } from './lib/utils'
