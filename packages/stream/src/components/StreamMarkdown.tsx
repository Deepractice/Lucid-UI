import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn, healMarkdown } from '../utils'
import { CodeBlock } from './CodeBlock'

export interface StreamMarkdownProps {
  /**
   * The markdown content to render
   */
  content: string
  /**
   * Whether content is still streaming (applies self-healing)
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
 * Renders markdown content with support for streaming scenarios.
 * Automatically heals incomplete markdown when streaming.
 *
 * Features:
 * - GitHub Flavored Markdown (tables, task lists, strikethrough)
 * - Syntax highlighted code blocks
 * - Self-healing for incomplete markdown during streaming
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
  // Apply self-healing if streaming
  const processedContent = isStreaming ? healMarkdown(content) : content

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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block rendering
          code({ node, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '')
            const isInline = !match

            if (isInline) {
              return (
                <code className={codeClassName} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            )
          },
          // Custom link rendering (open in new tab for external links)
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
