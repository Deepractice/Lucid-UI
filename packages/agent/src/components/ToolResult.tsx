import * as React from 'react'
import type { ToolStatus } from '@uix/core'
import { cn } from '../utils'

export interface ToolResultProps {
  /**
   * Tool name
   */
  tool: string
  /**
   * Execution status (extended to support approval workflow)
   */
  status: ToolStatus
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
   * Callback when user approves tool execution
   */
  onApprove?: () => void
  /**
   * Callback when user denies tool execution
   */
  onDeny?: (reason?: string) => void
  /**
   * Additional CSS classes
   */
  className?: string
}

const statusIcons: Record<ToolStatus, string> = {
  pending: '⏳',
  streaming: '📡',
  ready: '📋',
  running: '⚡',
  'approval-required': '🔐',
  approved: '✅',
  denied: '🚫',
  success: '✓',
  error: '✗',
}

const statusColors: Record<ToolStatus, string> = {
  pending: 'text-gray-500 bg-gray-50 border-gray-200',
  streaming: 'text-blue-600 bg-blue-50 border-blue-200',
  ready: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  running: 'text-amber-600 bg-amber-50 border-amber-200',
  'approval-required': 'text-purple-600 bg-purple-50 border-purple-200',
  approved: 'text-green-600 bg-green-50 border-green-200',
  denied: 'text-gray-600 bg-gray-50 border-gray-200',
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
}

const statusLabels: Record<ToolStatus, string> = {
  pending: 'Pending',
  streaming: 'Receiving parameters...',
  ready: 'Ready to execute',
  running: 'Running...',
  'approval-required': 'Waiting for approval',
  approved: 'Approved',
  denied: 'Denied',
  success: 'Completed',
  error: 'Failed',
}

/**
 * ToolResult Component
 *
 * Displays the result of a tool/function call with support for
 * approval workflows and extended status states.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ToolResult tool="search" status="success">
 *   Found 10 results...
 * </ToolResult>
 *
 * // With error
 * <ToolResult tool="code_execution" status="error" error="Timeout">
 *   Execution failed
 * </ToolResult>
 *
 * // With approval workflow
 * <ToolResult
 *   tool="delete_file"
 *   status="approval-required"
 *   onApprove={() => handleApprove()}
 *   onDeny={(reason) => handleDeny(reason)}
 * >
 *   This will delete important_file.txt
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
  onApprove,
  onDeny,
  className,
}: ToolResultProps) {
  const showApprovalButtons = status === 'approval-required' && (onApprove || onDeny)
  const isAnimating = ['streaming', 'running'].includes(status)

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
        <span className={cn('text-xs', isAnimating && 'animate-pulse')}>
          {statusLabels[status]}
        </span>
        {onToggle && (
          <span className="ml-auto text-xs">
            {collapsed ? '▶' : '▼'}
          </span>
        )}
      </div>

      {/* Approval Buttons */}
      {showApprovalButtons && (
        <div className="flex gap-2 px-4 py-2 bg-white border-t border-inherit">
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
          )}
          {onDeny && (
            <button
              onClick={() => onDeny()}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Deny
            </button>
          )}
        </div>
      )}

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
