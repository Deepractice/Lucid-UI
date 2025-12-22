/**
 * ChatInput - Composable input components for AI chat
 *
 * Follows the "composition over configuration" pattern from shadcn/ui and Vercel.
 * Components can be freely composed to create custom input layouts.
 *
 * @example Basic usage
 * ```tsx
 * <ChatInput onSubmit={handleSubmit}>
 *   <ChatInputTextarea placeholder="Ask anything..." />
 *   <ChatInputToolbar>
 *     <ChatInputTools>
 *       <ChatInputButton onClick={handleAttach}>
 *         <PaperclipIcon />
 *       </ChatInputButton>
 *     </ChatInputTools>
 *     <ChatInputSubmit status={status} />
 *   </ChatInputToolbar>
 * </ChatInput>
 * ```
 *
 * @example With mentions
 * ```tsx
 * <ChatInput onSubmit={handleSubmit}>
 *   <ChatInputTextarea
 *     onMentionQuery={searchAgents}
 *     mentionTrigger="@"
 *   />
 *   <ChatInputToolbar>
 *     <ChatInputSubmit />
 *   </ChatInputToolbar>
 * </ChatInput>
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'

// ============================================================================
// Types
// ============================================================================

export type ChatStatus = 'idle' | 'submitted' | 'streaming' | 'error'

/**
 * @deprecated Use MentionAgent from MentionPopover instead
 */
export interface ChatInputMentionItem {
  id: string
  name: string
  avatar?: string
  description?: string
}

// Internal alias for backward compatibility
type MentionItem = ChatInputMentionItem

// ============================================================================
// ChatInput (Container)
// ============================================================================

export interface ChatInputProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Callback when form is submitted
   */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

/**
 * Container component for chat input.
 * Renders as a form element.
 */
export const ChatInput = React.forwardRef<HTMLFormElement, ChatInputProps>(
  ({ className, onSubmit, ...props }, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onSubmit?.(e)
    }

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          'w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm',
          'focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500',
          'transition-shadow',
          className
        )}
        {...props}
      />
    )
  }
)
ChatInput.displayName = 'ChatInput'

// ============================================================================
// ChatInputTextarea
// ============================================================================

export interface ChatInputTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /**
   * Controlled value
   */
  value?: string
  /**
   * Value change callback
   */
  onChange?: (value: string) => void
  /**
   * Minimum height in pixels
   * @default 48
   */
  minHeight?: number
  /**
   * Maximum height in pixels
   * @default 200
   */
  maxHeight?: number
  /**
   * Trigger character for mentions
   * @default "@"
   */
  mentionTrigger?: string
  /**
   * Callback to query mention candidates
   */
  onMentionQuery?: (query: string) => MentionItem[]
  /**
   * Available mention items (used if onMentionQuery not provided)
   */
  mentionItems?: MentionItem[]
  /**
   * Callback when a mention is selected
   */
  onMentionSelect?: (item: MentionItem) => void
}

/**
 * Auto-resizing textarea with optional @mention support.
 */
export const ChatInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ChatInputTextareaProps
>(
  (
    {
      className,
      value,
      onChange,
      placeholder = 'Type a message...',
      minHeight = 48,
      maxHeight = 200,
      mentionTrigger = '@',
      onMentionQuery,
      mentionItems = [],
      onMentionSelect,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null)

    // Combine forwarded ref with internal ref
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

    // Mention state
    const [showMentions, setShowMentions] = React.useState(false)
    const [mentionQuery, setMentionQuery] = React.useState('')
    const [mentionIndex, setMentionIndex] = React.useState(0)
    const [mentionPosition, setMentionPosition] = React.useState<{
      top: number
      left: number
    } | null>(null)
    const mentionStartRef = React.useRef<number | null>(null)

    // Get filtered mentions
    const filteredMentions = React.useMemo(() => {
      if (onMentionQuery) {
        return onMentionQuery(mentionQuery)
      }
      if (!mentionQuery) return mentionItems.slice(0, 8)
      const query = mentionQuery.toLowerCase()
      return mentionItems
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        )
        .slice(0, 8)
    }, [mentionQuery, mentionItems, onMentionQuery])

    // Auto-resize
    React.useEffect(() => {
      const textarea = innerRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
        textarea.style.height = `${newHeight}px`
      }
    }, [value, minHeight, maxHeight])

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      const selectionStart = e.target.selectionStart
      onChange?.(newValue)

      // Check for mention trigger
      const textBeforeCursor = newValue.slice(0, selectionStart)
      const lastTriggerIndex = textBeforeCursor.lastIndexOf(mentionTrigger)

      if (lastTriggerIndex !== -1) {
        const textAfterTrigger = textBeforeCursor.slice(lastTriggerIndex + 1)
        // Valid mention context: no space, reasonable length
        if (!textAfterTrigger.includes(' ') && textAfterTrigger.length <= 20) {
          mentionStartRef.current = lastTriggerIndex
          setMentionQuery(textAfterTrigger)
          setShowMentions(true)
          setMentionIndex(0)

          // Calculate popup position
          if (innerRef.current) {
            const rect = innerRef.current.getBoundingClientRect()
            setMentionPosition({
              top: rect.bottom + 4,
              left: rect.left,
            })
          }
          return
        }
      }

      setShowMentions(false)
      mentionStartRef.current = null
    }

    // Select mention
    const selectMention = React.useCallback(
      (item: MentionItem) => {
        if (mentionStartRef.current === null || value === undefined) return

        const before = value.slice(0, mentionStartRef.current)
        const after = value.slice(mentionStartRef.current + mentionQuery.length + 1)
        const newValue = `${before}${mentionTrigger}${item.name} ${after}`

        onChange?.(newValue)
        onMentionSelect?.(item)
        setShowMentions(false)
        mentionStartRef.current = null

        // Focus back
        setTimeout(() => {
          if (innerRef.current) {
            const newCursorPos = before.length + item.name.length + 2
            innerRef.current.focus()
            innerRef.current.setSelectionRange(newCursorPos, newCursorPos)
          }
        }, 0)
      },
      [value, mentionQuery, mentionTrigger, onChange, onMentionSelect]
    )

    // Handle keyboard
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Mention navigation
      if (showMentions && filteredMentions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setMentionIndex((prev) => (prev + 1) % filteredMentions.length)
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setMentionIndex((prev) => (prev - 1 + filteredMentions.length) % filteredMentions.length)
          return
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault()
          selectMention(filteredMentions[mentionIndex])
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          setShowMentions(false)
          return
        }
      }

      // Submit on Enter (without Shift), respecting IME
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault()
        const form = e.currentTarget.form
        if (form) {
          form.requestSubmit()
        }
      }

      onKeyDown?.(e)
    }

    return (
      <>
        <textarea
          ref={innerRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className={cn(
            'w-full resize-none border-none bg-transparent p-4',
            'text-sm text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ minHeight, maxHeight }}
          {...props}
        />

        {/* Mention popup */}
        {showMentions && filteredMentions.length > 0 && mentionPosition && (
          <InternalMentionPopover
            items={filteredMentions}
            selectedIndex={mentionIndex}
            onSelect={selectMention}
            style={{
              position: 'fixed',
              top: mentionPosition.top,
              left: mentionPosition.left,
            }}
          />
        )}
      </>
    )
  }
)
ChatInputTextarea.displayName = 'ChatInputTextarea'

// ============================================================================
// ChatInputToolbar
// ============================================================================

export interface ChatInputToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Toolbar container for input actions.
 * Typically placed below the textarea.
 */
export const ChatInputToolbar = React.forwardRef<HTMLDivElement, ChatInputToolbarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between border-t border-gray-100 p-2', className)}
      {...props}
    />
  )
)
ChatInputToolbar.displayName = 'ChatInputToolbar'

// ============================================================================
// ChatInputTools
// ============================================================================

export interface ChatInputToolsProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Container for tool buttons (left side of toolbar).
 */
export const ChatInputTools = React.forwardRef<HTMLDivElement, ChatInputToolsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-1', className)} {...props} />
  )
)
ChatInputTools.displayName = 'ChatInputTools'

// ============================================================================
// ChatInputButton
// ============================================================================

export interface ChatInputButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant
   */
  variant?: 'ghost' | 'default'
}

/**
 * Button for toolbar actions (attach, emoji, etc.)
 */
export const ChatInputButton = React.forwardRef<HTMLButtonElement, ChatInputButtonProps>(
  ({ className, variant = 'ghost', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg p-2 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'ghost' && 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
        variant === 'default' && 'bg-primary-500 text-white hover:bg-primary-600',
        className
      )}
      {...props}
    />
  )
)
ChatInputButton.displayName = 'ChatInputButton'

// ============================================================================
// ChatInputSubmit
// ============================================================================

export interface ChatInputSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Current chat status
   */
  status?: ChatStatus
  /**
   * Callback when stop is clicked (during streaming)
   */
  onStop?: () => void
}

/**
 * Submit button with status-aware icons.
 */
export const ChatInputSubmit = React.forwardRef<HTMLButtonElement, ChatInputSubmitProps>(
  ({ className, status = 'idle', onStop, disabled, type, ...props }, ref) => {
    const isStreaming = status === 'streaming'
    const isSubmitting = status === 'submitted'
    const isDisabled = disabled || isSubmitting

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isStreaming && onStop) {
        e.preventDefault()
        onStop()
      }
    }

    return (
      <button
        ref={ref}
        type={isStreaming ? 'button' : 'submit'}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded-lg p-2 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:pointer-events-none disabled:opacity-50',
          isStreaming
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-primary-500 text-white hover:bg-primary-600',
          className
        )}
        {...props}
      >
        {isSubmitting ? (
          <LoaderIcon className="h-5 w-5 animate-spin" />
        ) : isStreaming ? (
          <StopIcon className="h-5 w-5" />
        ) : (
          <SendIcon className="h-5 w-5" />
        )}
      </button>
    )
  }
)
ChatInputSubmit.displayName = 'ChatInputSubmit'

// ============================================================================
// Internal MentionPopover (simple version for ChatInput)
// For full-featured MentionPopover, use the standalone component
// ============================================================================

interface InternalMentionPopoverProps {
  items: MentionItem[]
  selectedIndex: number
  onSelect: (item: MentionItem) => void
  style?: React.CSSProperties
  className?: string
}

/**
 * Internal popup for @mention selection.
 * @internal
 */
function InternalMentionPopover({
  items,
  selectedIndex,
  onSelect,
  style,
  className,
}: InternalMentionPopoverProps) {
  return (
    <div
      className={cn(
        'z-50 w-72 max-h-64 overflow-y-auto',
        'bg-white rounded-xl shadow-lg border border-gray-200',
        'py-1',
        className
      )}
      style={style}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 text-left',
            'transition-colors',
            index === selectedIndex
              ? 'bg-primary-50 text-primary-900'
              : 'hover:bg-gray-50'
          )}
        >
          {/* Avatar */}
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
              <span className="text-sm font-medium text-primary-700">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-gray-900">{item.name}</div>
            {item.description && (
              <div className="truncate text-xs text-gray-500">{item.description}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// Icons
// ============================================================================

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
