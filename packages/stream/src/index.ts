/**
 * @uix/stream
 *
 * Streaming content renderer for AI Agent applications.
 * Powered by Vercel Streamdown for optimal streaming performance.
 *
 * Features:
 * - StreamMarkdown: Full-featured markdown with streaming support
 *   - GitHub Flavored Markdown (tables, task lists, strikethrough)
 *   - Syntax highlighted code blocks (Shiki)
 *   - LaTeX math equations (KaTeX)
 *   - Mermaid diagrams
 *   - Automatic self-healing (Remend)
 *   - Security hardening (rehype-harden)
 * - StreamText: Simple text with typing cursor
 * - CodeBlock: Standalone syntax highlighted code blocks
 *
 * @example
 * ```tsx
 * import { StreamMarkdown, StreamText, CodeBlock } from '@uix/stream'
 *
 * // Streaming markdown (auto-heals incomplete content)
 * <StreamMarkdown content={response} isStreaming={true} />
 *
 * // Simple text with cursor
 * <StreamText showCursor>{text}</StreamText>
 *
 * // Code block
 * <CodeBlock language="typescript">{code}</CodeBlock>
 * ```
 */

export * from './components'
export { cn, healMarkdown } from './utils'
