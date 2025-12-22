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
 *
 * @example With loading status callback (Radix-style)
 * ```tsx
 * <AgentAvatar
 *   src="/avatar.png"
 *   name="Claude"
 *   onLoadingStatusChange={(status) => console.log(status)}
 *   fallbackDelayMs={600}
 * />
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

/**
 * Image loading status (Radix-style)
 */
export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

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
   * Callback when image loading status changes (Radix-style)
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void
  /**
   * Delay in ms before showing fallback (gives image time to load)
   * @default 0
   */
  fallbackDelayMs?: number
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
// Hooks
// ============================================================================

/**
 * Hook to track image loading status (Radix-style)
 */
function useImageLoadingStatus(
  src: string | undefined,
  onStatusChange?: (status: ImageLoadingStatus) => void
): ImageLoadingStatus {
  const [status, setStatus] = React.useState<ImageLoadingStatus>('idle')

  React.useEffect(() => {
    if (!src) {
      setStatus('idle')
      onStatusChange?.('idle')
      return
    }

    setStatus('loading')
    onStatusChange?.('loading')

    const img = new Image()

    img.onload = () => {
      setStatus('loaded')
      onStatusChange?.('loaded')
    }

    img.onerror = () => {
      setStatus('error')
      onStatusChange?.('error')
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, onStatusChange])

  return status
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
 *
 * Features:
 * - Image loading status tracking (Radix-style)
 * - Automatic fallback with optional delay
 * - Multiple color variants
 * - Online/offline/busy status indicators
 */
export const AgentAvatar = React.forwardRef<HTMLDivElement, AgentAvatarProps>(
  (
    {
      src,
      name,
      icon,
      variant = 'neutral',
      status,
      size = 'md',
      onLoadingStatusChange,
      fallbackDelayMs = 0,
      className,
    },
    ref
  ) => {
    const imageStatus = useImageLoadingStatus(src, onLoadingStatusChange)
    const [showFallback, setShowFallback] = React.useState(!src)

    // Handle fallback delay
    React.useEffect(() => {
      if (!src) {
        setShowFallback(true)
        return
      }

      if (imageStatus === 'loaded') {
        setShowFallback(false)
        return
      }

      if (imageStatus === 'error') {
        setShowFallback(true)
        return
      }

      // During loading, optionally delay showing fallback
      if (fallbackDelayMs > 0) {
        setShowFallback(false)
        const timer = setTimeout(() => {
          if (imageStatus === 'loading') {
            setShowFallback(true)
          }
        }, fallbackDelayMs)
        return () => clearTimeout(timer)
      } else {
        setShowFallback(true)
      }
    }, [src, imageStatus, fallbackDelayMs])

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const showImage = src && imageStatus === 'loaded'

    return (
      <div ref={ref} className={cn('relative inline-block shrink-0', className)}>
        {/* Image layer */}
        {src && (
          <img
            src={src}
            alt={name}
            className={cn(
              'rounded-full object-cover',
              sizeClasses[size],
              showImage ? 'opacity-100' : 'opacity-0 absolute inset-0'
            )}
          />
        )}

        {/* Fallback layer */}
        {(!src || showFallback) && !showImage && (
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

        {/* Status indicator */}
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

export { variantClasses as avatarVariantClasses, useImageLoadingStatus }
