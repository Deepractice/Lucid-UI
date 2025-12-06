/**
 * Button Component
 *
 * A foundational interactive component for user actions.
 * Built with Radix UI Slot for composition and class-variance-authority for variants.
 *
 * ## AI Usage Guide
 *
 * ### Basic Usage
 * ```tsx
 * import { Button } from '@lucidui/react'
 *
 * <Button>Click me</Button>
 * <Button variant="outline">Outline</Button>
 * <Button size="sm">Small</Button>
 * ```
 *
 * ### Design Principles
 * - Clear visual hierarchy through variants
 * - Consistent sizing scale
 * - Accessible by default (keyboard, screen readers)
 * - Composable via asChild prop
 *
 * ### Variants
 * - default: Primary action, blue background
 * - outline: Secondary action, bordered
 * - ghost: Subtle action, no background
 * - destructive: Dangerous action, red accent
 *
 * ### Sizes
 * - sm: Compact, for tight spaces
 * - default: Standard size
 * - lg: Prominent, for primary CTAs
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100',
        ghost: 'hover:bg-gray-100 active:bg-gray-200',
        destructive: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as a child element instead of a button.
   * Useful for creating links that look like buttons.
   *
   * @example
   * <Button asChild>
   *   <a href="/somewhere">Go</a>
   * </Button>
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
