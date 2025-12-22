/**
 * StreamText - Streaming text display with cursor effect
 *
 * Core component for AI streaming responses. Supports real async streams
 * and simulated typing animation.
 *
 * @example Real streaming
 * ```tsx
 * <StreamText stream={asyncIterator} onComplete={() => setDone(true)} />
 * ```
 *
 * @example With cursor
 * ```tsx
 * <StreamText stream={stream} cursor cursorChar="▋" />
 * ```
 *
 * @example Simulated typing (for non-streaming APIs)
 * ```tsx
 * <StreamText text="Hello, I am Claude." speed={30} />
 * ```
 *
 * @example Composed with custom renderer
 * ```tsx
 * <StreamText stream={stream}>
 *   {(text, isStreaming) => (
 *     <Markdown className={isStreaming ? 'opacity-90' : ''}>{text}</Markdown>
 *   )}
 * </StreamText>
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'

// ============================================================================
// Types
// ============================================================================

export type StreamSource =
  | AsyncIterable<string>
  | ReadableStream<string>
  | string

export interface StreamTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'onError'> {
  /**
   * Stream source: AsyncIterable, ReadableStream, or plain string
   */
  stream?: AsyncIterable<string> | ReadableStream<string>
  /**
   * Static text for simulated typing (mutually exclusive with stream)
   */
  text?: string
  /**
   * Show blinking cursor during streaming
   * @default true
   */
  cursor?: boolean
  /**
   * Cursor character
   * @default "▋"
   */
  cursorChar?: string
  /**
   * Typing speed in ms per character (only for text prop)
   * @default 30
   */
  speed?: number
  /**
   * Called when streaming/typing completes
   */
  onComplete?: () => void
  /**
   * Called on streaming error
   */
  onError?: (error: Error) => void
  /**
   * Custom render function for advanced use (e.g., markdown rendering)
   */
  children?: (text: string, isStreaming: boolean) => React.ReactNode
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to consume an async iterable stream
 */
function useAsyncStream(
  stream: AsyncIterable<string> | ReadableStream<string> | undefined,
  onComplete?: () => void,
  onError?: (error: Error) => void
): { text: string; isStreaming: boolean; error: Error | null } {
  const [text, setText] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (!stream) {
      setText('')
      setIsStreaming(false)
      return
    }

    let cancelled = false
    setIsStreaming(true)
    setText('')
    setError(null)

    const consume = async () => {
      try {
        // Convert ReadableStream to AsyncIterable if needed
        const iterable = isReadableStream(stream)
          ? readableStreamToAsyncIterable(stream)
          : stream

        for await (const chunk of iterable) {
          if (cancelled) break
          setText((prev) => prev + chunk)
        }

        if (!cancelled) {
          setIsStreaming(false)
          onComplete?.()
        }
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          setIsStreaming(false)
          onError?.(error)
        }
      }
    }

    consume()

    return () => {
      cancelled = true
    }
  }, [stream, onComplete, onError])

  return { text, isStreaming, error }
}

/**
 * Hook for simulated typing animation
 */
function useTypingAnimation(
  text: string | undefined,
  speed: number,
  onComplete?: () => void
): { displayText: string; isTyping: boolean } {
  const [displayText, setDisplayText] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)

  React.useEffect(() => {
    if (!text) {
      setDisplayText('')
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    setDisplayText('')

    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return { displayText, isTyping }
}

// ============================================================================
// Utilities
// ============================================================================

function isReadableStream(value: unknown): value is ReadableStream<string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getReader' in value &&
    typeof (value as ReadableStream).getReader === 'function'
  )
}

async function* readableStreamToAsyncIterable(
  stream: ReadableStream<string>
): AsyncIterable<string> {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) yield value
    }
  } finally {
    reader.releaseLock()
  }
}

// ============================================================================
// Components
// ============================================================================

/**
 * Blinking cursor component
 */
const StreamCursor = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { char?: string }
>(({ char = '▋', className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('animate-pulse ml-0.5', className)}
    aria-hidden="true"
    {...props}
  >
    {char}
  </span>
))
StreamCursor.displayName = 'StreamCursor'

/**
 * StreamText Component
 *
 * Renders streaming text from async sources with optional cursor effect.
 * Supports both real streaming (AsyncIterable/ReadableStream) and
 * simulated typing animation for static text.
 */
export const StreamText = React.forwardRef<HTMLSpanElement, StreamTextProps>(
  (
    {
      stream,
      text,
      cursor = true,
      cursorChar = '▋',
      speed = 30,
      onComplete,
      onError,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Use stream if provided, otherwise use typing animation
    const {
      text: streamedText,
      isStreaming,
      error,
    } = useAsyncStream(stream, onComplete, onError)

    const { displayText: typedText, isTyping } = useTypingAnimation(
      stream ? undefined : text,
      speed,
      stream ? undefined : onComplete
    )

    const displayText = stream ? streamedText : typedText
    const isActive = stream ? isStreaming : isTyping
    const showCursor = cursor && isActive

    // Custom render function
    if (children) {
      return (
        <span ref={ref} className={className} {...props}>
          {children(displayText, isActive)}
          {showCursor && <StreamCursor char={cursorChar} />}
        </span>
      )
    }

    return (
      <span
        ref={ref}
        className={cn('whitespace-pre-wrap', className)}
        aria-live="polite"
        aria-busy={isActive}
        {...props}
      >
        {displayText}
        {showCursor && <StreamCursor char={cursorChar} />}
        {error && (
          <span className="text-red-500 ml-2" role="alert">
            Error: {error.message}
          </span>
        )}
      </span>
    )
  }
)
StreamText.displayName = 'StreamText'

// ============================================================================
// Exports
// ============================================================================

export { StreamCursor, useAsyncStream, useTypingAnimation }
