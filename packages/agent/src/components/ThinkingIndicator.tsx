/**
 * ThinkingIndicator - AI thinking/processing state indicator
 *
 * Shows animated dots or custom loading states for AI processing.
 * Supports multiple variants and multi-agent parallel thinking display.
 *
 * @example Basic usage
 * ```tsx
 * <ThinkingIndicator />
 * <ThinkingIndicator label="Analyzing..." />
 * ```
 *
 * @example Multi-agent
 * ```tsx
 * <ThinkingIndicator agents={['Claude', 'GPT']} />
 * ```
 *
 * @example Different variants
 * ```tsx
 * <ThinkingIndicator variant="dots" />
 * <ThinkingIndicator variant="pulse" />
 * <ThinkingIndicator variant="bounce" />
 * <ThinkingIndicator variant="wave" />
 * ```
 *
 * @example Inline in text
 * ```tsx
 * <p>Processing<ThinkingIndicator variant="dots" inline /></p>
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'

// ============================================================================
// Types
// ============================================================================

export type ThinkingVariant = 'dots' | 'pulse' | 'bounce' | 'wave' | 'spinner'

export interface ThinkingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom label text
   */
  label?: string
  /**
   * Multiple agents thinking in parallel
   */
  agents?: string[]
  /**
   * Animation variant
   * @default "bounce"
   */
  variant?: ThinkingVariant
  /**
   * Size of the indicator
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Render inline (no wrapper div)
   * @default false
   */
  inline?: boolean
  /**
   * Color scheme
   * @default "secondary" (gold/amber)
   */
  color?: 'primary' | 'secondary' | 'neutral'
}

// ============================================================================
// Constants
// ============================================================================

const sizeClasses = {
  sm: { dot: 'w-1 h-1', gap: 'gap-0.5', text: 'text-xs' },
  md: { dot: 'w-1.5 h-1.5', gap: 'gap-1', text: 'text-sm' },
  lg: { dot: 'w-2 h-2', gap: 'gap-1.5', text: 'text-base' },
}

const colorClasses = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  neutral: 'bg-gray-400',
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Animated dots (default)
 */
function DotsAnimation({
  size,
  color,
}: {
  size: 'sm' | 'md' | 'lg'
  color: 'primary' | 'secondary' | 'neutral'
}) {
  const { dot, gap } = sizeClasses[size]
  return (
    <span className={cn('inline-flex items-center', gap)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dot, colorClasses[color], 'rounded-full animate-pulse')}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  )
}

/**
 * Bouncing dots
 */
function BounceAnimation({
  size,
  color,
}: {
  size: 'sm' | 'md' | 'lg'
  color: 'primary' | 'secondary' | 'neutral'
}) {
  const { dot, gap } = sizeClasses[size]
  return (
    <span className={cn('inline-flex items-end', gap)} style={{ height: '1em' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dot, colorClasses[color], 'rounded-full animate-bounce')}
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '600ms' }}
        />
      ))}
    </span>
  )
}

/**
 * Wave animation (sequential height change)
 */
function WaveAnimation({
  size,
  color,
}: {
  size: 'sm' | 'md' | 'lg'
  color: 'primary' | 'secondary' | 'neutral'
}) {
  const { gap } = sizeClasses[size]
  const barWidth = size === 'sm' ? 'w-0.5' : size === 'md' ? 'w-1' : 'w-1.5'
  return (
    <span className={cn('inline-flex items-center', gap)} style={{ height: '1em' }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(barWidth, colorClasses[color], 'rounded-full')}
          style={{
            animation: 'wave 1s ease-in-out infinite',
            animationDelay: `${i * 100}ms`,
            height: '0.5em',
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 0.3em; }
          50% { height: 1em; }
        }
      `}</style>
    </span>
  )
}

/**
 * Pulse ring
 */
function PulseAnimation({
  size,
  color,
}: {
  size: 'sm' | 'md' | 'lg'
  color: 'primary' | 'secondary' | 'neutral'
}) {
  const ringSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <span className="relative inline-flex">
      <span className={cn(ringSize, colorClasses[color], 'rounded-full animate-ping opacity-75')} />
      <span
        className={cn(
          ringSize,
          colorClasses[color],
          'rounded-full absolute inset-0'
        )}
      />
    </span>
  )
}

/**
 * Spinner
 */
function SpinnerAnimation({
  size,
  color,
}: {
  size: 'sm' | 'md' | 'lg'
  color: 'primary' | 'secondary' | 'neutral'
}) {
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
  const borderColor = color === 'primary' ? 'border-primary-500' : color === 'secondary' ? 'border-secondary-500' : 'border-gray-400'
  return (
    <span
      className={cn(
        spinnerSize,
        'inline-block rounded-full border-2 border-transparent animate-spin',
        `border-t-2 ${borderColor}`
      )}
    />
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * ThinkingIndicator Component
 *
 * Flexible AI thinking state indicator with multiple animation variants.
 * Uses sentient gold (secondary-500) color by default to represent
 * AI's generative thinking process.
 */
export const ThinkingIndicator = React.forwardRef<HTMLDivElement, ThinkingIndicatorProps>(
  (
    {
      label,
      agents,
      variant = 'bounce',
      size = 'md',
      inline = false,
      color = 'secondary',
      className,
      ...props
    },
    ref
  ) => {
    const { text } = sizeClasses[size]

    // Render animation based on variant
    const renderAnimation = () => {
      switch (variant) {
        case 'dots':
          return <DotsAnimation size={size} color={color} />
        case 'pulse':
          return <PulseAnimation size={size} color={color} />
        case 'wave':
          return <WaveAnimation size={size} color={color} />
        case 'spinner':
          return <SpinnerAnimation size={size} color={color} />
        case 'bounce':
        default:
          return <BounceAnimation size={size} color={color} />
      }
    }

    // Generate label text
    const labelText = agents && agents.length > 0
      ? `${agents.join(', ')} ${agents.length > 1 ? 'are' : 'is'} thinking...`
      : label || 'Thinking...'

    // Inline mode
    if (inline) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={cn('inline-flex items-center gap-2', className)}
          role="status"
          aria-live="polite"
          aria-label={labelText}
          {...(props as React.HTMLAttributes<HTMLSpanElement>)}
        >
          {renderAnimation()}
        </span>
      )
    }

    // Block mode (default)
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-3 my-4', className)}
        role="status"
        aria-live="polite"
        aria-label={labelText}
        {...props}
      >
        {renderAnimation()}
        <span className={cn('text-gray-500', text)}>{labelText}</span>
      </div>
    )
  }
)
ThinkingIndicator.displayName = 'ThinkingIndicator'

// ============================================================================
// Exports
// ============================================================================

export {
  DotsAnimation,
  BounceAnimation,
  WaveAnimation,
  PulseAnimation,
  SpinnerAnimation,
}
