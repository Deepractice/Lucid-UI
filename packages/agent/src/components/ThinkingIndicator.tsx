import * as React from 'react'
import { cn } from '../utils'

export interface ThinkingIndicatorProps {
  /**
   * Custom label text
   */
  label?: string
  /**
   * Multiple agents thinking in parallel
   */
  agents?: string[]
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * ThinkingIndicator Component
 *
 * Shows AI thinking/processing state with animated dots.
 *
 * @example
 * ```tsx
 * <ThinkingIndicator />
 * <ThinkingIndicator label="Analyzing..." />
 * <ThinkingIndicator agents={['Claude', 'GPT']} />
 * ```
 */
export function ThinkingIndicator({
  label,
  agents,
  className,
}: ThinkingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-3 my-4', className)}>
      {/* Animated dots */}
      <div className="flex items-center gap-1">
        <span
          className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>

      {/* Label or agents */}
      {agents && agents.length > 0 ? (
        <span className="text-sm text-gray-500">
          {agents.join(', ')} {agents.length > 1 ? 'are' : 'is'} thinking...
        </span>
      ) : label ? (
        <span className="text-sm text-gray-500">{label}</span>
      ) : (
        <span className="text-sm text-gray-500">Thinking...</span>
      )}
    </div>
  )
}
