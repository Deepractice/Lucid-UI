import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per specified interval.
 *
 * @param fn - The function to throttle
 * @param waitMs - The minimum time between invocations in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  waitMs: number
): T {
  let lastCallTime = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = waitMs - (now - lastCallTime)

    lastArgs = args

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCallTime = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        timeoutId = null
        if (lastArgs) {
          fn(...lastArgs)
        }
      }, remaining)
    }
  }

  return throttled as T
}
