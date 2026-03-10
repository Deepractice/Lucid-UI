/**
 * Input Component
 *
 * A foundational text input component for forms.
 * Built with class-variance-authority for variants.
 *
 * ## AI Usage Guide
 *
 * ### Basic Usage
 * ```tsx
 * import { Input } from '@uix-ai/react'
 *
 * <Input placeholder="Enter text..." />
 * <Input variant="error" placeholder="Invalid input" />
 * <Input size="sm" />
 * ```
 *
 * ### Variants
 * - default: Standard input with border
 * - error: Red border for validation errors
 *
 * ### Sizes
 * - sm: Compact input
 * - md: Standard size
 * - lg: Larger input
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  // Base styles
  'flex w-full rounded-md border bg-white text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:border-primary-500',
        error: 'border-error-500 focus-visible:border-error-500 focus-visible:ring-error-200',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
