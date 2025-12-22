/**
 * AgentAvatar - Flexible avatar for agents and users
 *
 * General-purpose avatar component supporting images, icons, and initials
 * with multiple color variants and status indicators.
 *
 * @example Basic usage
 * ```tsx
 * <AgentAvatar name="Claude" />
 * <AgentAvatar src="/avatar.png" name="Claude" status="online" />
 * ```
 *
 * @example With variants
 * ```tsx
 * <AgentAvatar name="AI" variant="primary" />
 * <AgentAvatar name="User" variant="secondary" />
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'

// ============================================================================
// Types
// ============================================================================

/**
 * Color variants for avatar backgrounds
 */
export type AvatarVariant =
  | 'primary'    // Blue - AI/rational
  | 'secondary'  // Amber/gold - User/sentient
  | 'success'    // Green
  | 'warning'    // Yellow
  | 'error'      // Red
  | 'info'       // Blue (alias)
  | 'neutral'    // Gray (default)

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
   * Custom icon component (displayed instead of initials when no src)
   */
  icon?: React.ReactNode
  /**
   * Color variant
   * @default "neutral"
   */
  variant?: AvatarVariant
  /**
   * Online status indicator
   */
  status?: 'online' | 'offline' | 'busy'
  /**
   * Avatar size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const variantClasses: Record<AvatarVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
}

const statusColors: Record<'online' | 'offline' | 'busy', string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-amber-500',
}

const statusSizes = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
}

// ============================================================================
// Component
// ============================================================================

/**
 * AgentAvatar Component
 *
 * Flexible avatar component for displaying agents and users.
 * Supports images, custom icons, and fallback initials with
 * multiple color variants and status indicators.
 */
export const AgentAvatar = React.forwardRef<HTMLDivElement, AgentAvatarProps>(
  ({ src, name, icon, variant = 'neutral', status, size = 'md', className }, ref) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div ref={ref} className={cn('relative inline-block shrink-0', className)}>
        {src ? (
          <img
            src={src}
            alt={name}
            className={cn('rounded-full object-cover', sizeClasses[size])}
          />
        ) : (
          <div
            className={cn(
              'rounded-full flex items-center justify-center font-medium',
              variantClasses[variant],
              sizeClasses[size]
            )}
            role="img"
            aria-label={name}
          >
            {icon || initials}
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
)
AgentAvatar.displayName = 'AgentAvatar'

// ============================================================================
// Utility exports
// ============================================================================

export { variantClasses as avatarVariantClasses }
