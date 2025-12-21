/**
 * @lucidui/stream
 *
 * Streaming content renderer for AI Agent applications.
 *
 * Features:
 * - StreamMarkdown: Markdown rendering with self-healing for streaming
 * - StreamText: Simple text with typing cursor
 * - CodeBlock: Syntax highlighted code blocks
 *
 * @example
 * ```tsx
 * import { StreamMarkdown, StreamText, CodeBlock } from '@lucidui/stream'
 *
 * // Streaming markdown
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
