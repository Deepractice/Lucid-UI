import * as React from 'react'
import { Streamdown } from 'streamdown'
import { cn } from '../utils'

export interface StreamMarkdownProps {
  /**
   * The markdown content to render
   */
  content: string
  /**
   * Whether content is still streaming
   * Note: Streamdown handles streaming automatically via Remend
   */
  isStreaming?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * StreamMarkdown Component
 *
 * Renders markdown content with full streaming support.
 * Powered by Vercel Streamdown for optimal AI streaming scenarios.
 *
 * Features:
 * - GitHub Flavored Markdown (tables, task lists, strikethrough)
 * - Syntax highlighted code blocks (Shiki)
 * - LaTeX math equations (KaTeX)
 * - Mermaid diagrams
 * - Automatic self-healing for incomplete markdown (Remend)
 * - Memoized rendering for performance
 * - Security hardening (rehype-harden)
 *
 * @example
 * ```tsx
 * <StreamMarkdown
 *   content={streamingContent}
 *   isStreaming={true}
 * />
 * ```
 */
export function StreamMarkdown({
  content,
  isStreaming = false,
  className,
}: StreamMarkdownProps) {
  return (
    <div
      className={cn(
        'prose prose-gray max-w-none',
        // Lucid UI typography styles
        'prose-headings:text-foreground prose-headings:font-semibold',
        'prose-p:text-foreground prose-p:leading-relaxed',
        'prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:text-primary-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        'prose-pre:p-0 prose-pre:bg-transparent',
        'prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-600',
        'prose-ul:text-foreground prose-ol:text-foreground',
        'prose-li:marker:text-gray-400',
        'prose-table:text-sm',
        'prose-th:bg-gray-50 prose-th:text-foreground prose-th:font-medium',
        'prose-td:text-foreground',
        className
      )}
    >
      <Streamdown mode={isStreaming ? 'streaming' : 'static'}>{content}</Streamdown>
    </div>
  )
}

/**
 * Re-export Streamdown component for advanced usage
 */
export { Streamdown } from 'streamdown'
