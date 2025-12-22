import * as React from 'react'
import type { SourceBlockContent } from '@uix/core'
import { cn } from '../utils'

export interface SourceBlockProps {
  /**
   * Source content from LucidBlock
   */
  source: SourceBlockContent
  /**
   * Whether to show the excerpt/snippet
   */
  showExcerpt?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * SourceBlock Component
 *
 * Displays a source/citation reference, commonly used in RAG applications
 * to show where information was retrieved from.
 *
 * @example
 * ```tsx
 * // URL source
 * <SourceBlock
 *   source={{
 *     sourceId: 'src-1',
 *     sourceType: 'url',
 *     title: 'React Documentation',
 *     url: 'https://react.dev/learn'
 *   }}
 * />
 *
 * // Document source with excerpt
 * <SourceBlock
 *   source={{
 *     sourceId: 'src-2',
 *     sourceType: 'document',
 *     title: 'Company Policy',
 *     filename: 'policy.pdf',
 *     mediaType: 'application/pdf',
 *     excerpt: 'All employees must...'
 *   }}
 *   showExcerpt
 * />
 * ```
 */
export function SourceBlock({
  source,
  showExcerpt = true,
  className,
}: SourceBlockProps) {
  const isUrl = source.sourceType === 'url'
  const Icon = isUrl ? LinkIcon : DocumentIcon

  return (
    <div
      className={cn(
        'my-2 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden',
        className
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {isUrl && source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block"
            >
              {source.title}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-900 truncate block">
              {source.title}
            </span>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
            {source.filename && (
              <span className="truncate">{source.filename}</span>
            )}
            {source.mediaType && (
              <span className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                {formatMediaType(source.mediaType)}
              </span>
            )}
            {isUrl && source.url && (
              <span className="truncate">{new URL(source.url).hostname}</span>
            )}
          </div>

          {/* Excerpt */}
          {showExcerpt && source.excerpt && (
            <p className="mt-2 text-xs text-gray-600 line-clamp-2">
              {source.excerpt}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Compact inline source citation
 */
export function SourceCitation({
  source,
  index,
  className,
}: {
  source: SourceBlockContent
  index?: number
  className?: string
}) {
  const isUrl = source.sourceType === 'url'

  if (isUrl && source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded',
          'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors',
          className
        )}
      >
        {index !== undefined && (
          <span className="font-medium">[{index + 1}]</span>
        )}
        <span className="truncate max-w-[150px]">{source.title}</span>
      </a>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded',
        'bg-gray-100 text-gray-700',
        className
      )}
    >
      {index !== undefined && (
        <span className="font-medium">[{index + 1}]</span>
      )}
      <span className="truncate max-w-[150px]">{source.title}</span>
    </span>
  )
}

/**
 * List of sources, typically shown at the end of a response
 */
export function SourceList({
  sources,
  title = 'Sources',
  className,
}: {
  sources: SourceBlockContent[]
  title?: string
  className?: string
}) {
  if (sources.length === 0) return null

  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <SourceBlock key={source.sourceId} source={source} showExcerpt={false} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatMediaType(mediaType: string): string {
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'TXT',
    'text/markdown': 'MD',
    'text/html': 'HTML',
    'application/json': 'JSON',
  }
  return typeMap[mediaType] || mediaType.split('/').pop()?.toUpperCase() || 'FILE'
}

// ============================================================================
// Icons
// ============================================================================

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}
