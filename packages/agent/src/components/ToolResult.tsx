import * as React from 'react'
import { cn } from '../utils'

export interface ToolResultProps {
  /**
   * Tool name
   */
  tool: string
  /**
   * Execution status
   */
  status: 'pending' | 'running' | 'success' | 'error'
  /**
   * Tool output content
   */
  children?: React.ReactNode
  /**
   * Whether the result is collapsed
   */
  collapsed?: boolean
  /**
   * Callback when collapse state changes
   */
  onToggle?: () => void
  /**
   * Error message (when status is 'error')
   */
  error?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

const statusIcons = {
  pending: '⏳',
  running: '⚡',
  success: '✓',
  error: '✗',
}

const statusColors = {
  pending: 'text-gray-500 bg-gray-50 border-gray-200',
  running: 'text-amber-600 bg-amber-50 border-amber-200',
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
}

/**
 * ToolResult Component
 *
 * Displays the result of a tool/function call.
 *
 * @example
 * ```tsx
 * <ToolResult tool="search" status="success">
 *   Found 10 results...
 * </ToolResult>
 *
 * <ToolResult tool="code_execution" status="error" error="Timeout">
 *   Execution failed
 * </ToolResult>
 * ```
 */
export function ToolResult({
  tool,
  status,
  children,
  collapsed = false,
  onToggle,
  error,
  className,
}: ToolResultProps) {
  return (
    <div
      className={cn(
        'my-4 rounded-lg border overflow-hidden',
        statusColors[status],
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2',
          onToggle && 'cursor-pointer hover:bg-black/5'
        )}
        onClick={onToggle}
      >
        <span className="text-lg">{statusIcons[status]}</span>
        <span className="font-mono text-sm font-medium">{tool}</span>
        {status === 'running' && (
          <span className="text-xs animate-pulse">Running...</span>
        )}
        {onToggle && (
          <span className="ml-auto text-xs">
            {collapsed ? '▶' : '▼'}
          </span>
        )}
      </div>

      {/* Content */}
      {!collapsed && (children || error) && (
        <div className="px-4 py-3 bg-white border-t border-inherit">
          {error ? (
            <div className="text-sm text-red-600 font-mono">{error}</div>
          ) : (
            <div className="text-sm">{children}</div>
          )}
        </div>
      )}
    </div>
  )
}
