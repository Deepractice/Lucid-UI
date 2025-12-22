/**
 * AgentAvatarGroup - Multi-agent avatar stack component
 *
 * Displays multiple agent avatars in a stacked layout with overflow handling.
 * Useful for showing which agents are participating in a conversation.
 *
 * @example Basic usage
 * ```tsx
 * <AgentAvatarGroup
 *   agents={[
 *     { name: 'Claude', src: '/claude.png' },
 *     { name: 'GPT', src: '/gpt.png' },
 *     { name: 'Gemini' }
 *   ]}
 * />
 * ```
 *
 * @example With active agent highlight
 * ```tsx
 * <AgentAvatarGroup
 *   agents={agents}
 *   activeAgent="Claude"
 *   max={4}
 * />
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'
import { AgentAvatar, type AvatarVariant } from './AgentAvatar'

// ============================================================================
// Types
// ============================================================================

export interface AgentAvatarGroupItem {
  /**
   * Agent name (required for display and identification)
   */
  name: string
  /**
   * Avatar image URL
   */
  src?: string
  /**
   * Color variant
   */
  variant?: AvatarVariant
}

export interface AgentAvatarGroupProps {
  /**
   * List of agents to display
   */
  agents: AgentAvatarGroupItem[]
  /**
   * Maximum number of avatars to show before overflow
   * @default 4
   */
  max?: number
  /**
   * Name of the currently active agent (will be highlighted)
   */
  activeAgent?: string
  /**
   * Avatar size
   * @default "sm"
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Stack direction
   * @default "left"
   */
  direction?: 'left' | 'right'
  /**
   * Additional CSS classes
   */
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

const overlapClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: '-ml-2',
  md: '-ml-3',
  lg: '-ml-4',
}

// ============================================================================
// Component
// ============================================================================

/**
 * AgentAvatarGroup Component
 *
 * Displays a stack of agent avatars with:
 * - Overlap effect (later avatars partially cover earlier ones)
 * - Overflow indicator (+N) when exceeding max
 * - Active agent highlighting with ring
 * - Hover effect to show full avatar
 */
export const AgentAvatarGroup = React.forwardRef<HTMLDivElement, AgentAvatarGroupProps>(
  ({ agents, max = 4, activeAgent, size = 'sm', direction = 'left', className }, ref) => {
    const visibleAgents = agents.slice(0, max)
    const overflowCount = agents.length - max

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          direction === 'right' && 'flex-row-reverse',
          className
        )}
        role="group"
        aria-label={`${agents.length} agents`}
      >
        {visibleAgents.map((agent, index) => {
          const isActive = agent.name === activeAgent
          const isFirst = index === 0

          return (
            <div
              key={agent.name}
              className={cn(
                'relative transition-transform hover:z-10 hover:scale-110',
                !isFirst && (direction === 'left' ? overlapClasses[size] : '-mr-2'),
                isActive && 'z-10'
              )}
              style={{ zIndex: isActive ? 10 : visibleAgents.length - index }}
            >
              <AgentAvatar
                name={agent.name}
                src={agent.src}
                variant={agent.variant || 'neutral'}
                size={size}
                className={cn(
                  'border-2 border-white',
                  isActive && 'ring-2 ring-primary-500 ring-offset-1'
                )}
              />
            </div>
          )
        })}

        {/* Overflow indicator */}
        {overflowCount > 0 && (
          <div
            className={cn(
              'relative flex items-center justify-center rounded-full',
              'bg-gray-200 text-gray-600 font-medium border-2 border-white',
              sizeClasses[size],
              direction === 'left' ? overlapClasses[size] : '-mr-2'
            )}
            style={{ zIndex: 0 }}
            role="img"
            aria-label={`${overflowCount} more agents`}
          >
            +{overflowCount}
          </div>
        )}
      </div>
    )
  }
)
AgentAvatarGroup.displayName = 'AgentAvatarGroup'
