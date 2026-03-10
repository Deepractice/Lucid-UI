/**
 * Badge Component
 *
 * A status indicator for labels, counts, and tags.
 * Built with class-variance-authority for variants.
 *
 * ## AI Usage Guide
 *
 * ### Basic Usage
 * ```tsx
 * import { Badge } from '@uix-ai/lucid-react'
 *
 * <Badge>Default</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Failed</Badge>
 * ```
 *
 * ### Variants
 * - default: Neutral gray
 * - primary: Primary brand color
 * - secondary: Subtle secondary
 * - success: Green for positive states
 * - warning: Yellow for caution
 * - error: Red for negative states
 * - outline: Bordered, no fill
 *
 * ### Sizes
 * - sm: Compact badge
 * - md: Standard size
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  // Base styles
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-gray-50 text-gray-600',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        error: 'bg-error-100 text-error-700',
        outline: 'border border-gray-300 text-gray-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
