import * as React from 'react'
import { cn } from '../utils'

export interface AgentAvatarProps {
  /**
   * Avatar image URL
   */
  src?: string
  /**
   * Agent name (used for fallback initials)
   */
  name: string
  /**
   * Online status
   */
  status?: 'online' | 'offline' | 'busy'
  /**
   * Avatar size
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-amber-500',
}

const statusSizes = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
}

/**
 * AgentAvatar Component
 *
 * Displays an agent's avatar with optional status indicator.
 *
 * @example
 * ```tsx
 * <AgentAvatar
 *   src="/claude.png"
 *   name="Claude"
 *   status="online"
 *   size="md"
 * />
 * ```
 */
export function AgentAvatar({
  src,
  name,
  status,
  size = 'md',
  className,
}: AgentAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium',
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={status}
        />
      )}
    </div>
  )
}
