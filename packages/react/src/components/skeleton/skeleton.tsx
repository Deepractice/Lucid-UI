/**
 * Skeleton Component
 *
 * A loading placeholder with pulse animation.
 *
 * ## AI Usage Guide
 *
 * ### Basic Usage
 * ```tsx
 * import { Skeleton } from '@uix-ai/react'
 *
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton className="h-[125px] w-full" />
 * ```
 *
 * ### Design Principles
 * - Use to indicate content is loading
 * - Match dimensions of the content being loaded
 * - Combine multiple skeletons for complex layouts
 */

import * as React from 'react'
import { cn } from '../../lib/utils'

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('animate-pulse rounded-md bg-gray-200', className)}
    {...props}
  />
))
Skeleton.displayName = 'Skeleton'

export { Skeleton }
