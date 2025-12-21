import * as React from 'react'
import { cn } from '../utils'

export interface StreamTextProps {
  /**
   * The text content to display
   */
  children: string
  /**
   * Whether to show typing cursor
   */
  showCursor?: boolean
  /**
   * Cursor style
   */
  cursorStyle?: 'block' | 'line' | 'underscore'
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * StreamText Component
 *
 * Simple streaming text display with optional typing cursor.
 * Use this for plain text streaming without markdown.
 *
 * @example
 * ```tsx
 * <StreamText showCursor={isStreaming}>
 *   {streamingText}
 * </StreamText>
 * ```
 */
export function StreamText({
  children,
  showCursor = false,
  cursorStyle = 'line',
  className,
}: StreamTextProps) {
  const cursorClasses = {
    block: 'inline-block w-2 h-5 bg-primary-500 animate-pulse ml-0.5 align-middle',
    line: 'inline-block w-0.5 h-5 bg-primary-500 animate-pulse ml-0.5 align-middle',
    underscore: 'inline-block w-2 h-0.5 bg-primary-500 animate-pulse ml-0.5 align-bottom',
  }

  return (
    <span className={cn('text-foreground', className)}>
      {children}
      {showCursor && (
        <span
          className={cursorClasses[cursorStyle]}
          aria-hidden="true"
        />
      )}
    </span>
  )
}
