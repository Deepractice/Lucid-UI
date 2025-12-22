/**
 * MentionPopover - @mention agent selector
 *
 * Popover component for selecting agents when typing @mention.
 * Follows composition pattern with keyboard navigation support.
 *
 * @example Basic usage with ChatInput
 * ```tsx
 * const [open, setOpen] = useState(false)
 * const [query, setQuery] = useState('')
 * const [position, setPosition] = useState({ top: 0, left: 0 })
 *
 * <ChatInput
 *   onMentionTrigger={({ query, position }) => {
 *     setQuery(query)
 *     setPosition(position)
 *     setOpen(true)
 *   }}
 *   onMentionClose={() => setOpen(false)}
 * />
 *
 * <MentionPopover
 *   open={open}
 *   query={query}
 *   position={position}
 *   agents={agents}
 *   onSelect={(agent) => { insertMention(agent); setOpen(false) }}
 *   onClose={() => setOpen(false)}
 * />
 * ```
 *
 * @example Composable with custom item renderer
 * ```tsx
 * <MentionPopover open={open} agents={agents} onSelect={handleSelect}>
 *   <MentionPopoverContent>
 *     {(filteredAgents) => filteredAgents.map(agent => (
 *       <MentionItem key={agent.id} agent={agent}>
 *         <CustomAgentCard agent={agent} />
 *       </MentionItem>
 *     ))}
 *   </MentionPopoverContent>
 * </MentionPopover>
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'
import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

// ============================================================================
// Types
// ============================================================================

export interface MentionAgent {
  /**
   * Unique identifier
   */
  id: string
  /**
   * Display name
   */
  name: string
  /**
   * Avatar URL
   */
  avatar?: string
  /**
   * Description or role
   */
  description?: string
  /**
   * Online status
   */
  status?: 'online' | 'offline' | 'busy'
}

export interface MentionPopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Whether the popover is open
   */
  open: boolean
  /**
   * Search query (text after @)
   */
  query?: string
  /**
   * Available agents to mention
   */
  agents: MentionAgent[]
  /**
   * Position for the popover
   */
  position?: { top: number; left: number }
  /**
   * Called when an agent is selected
   */
  onSelect?: (agent: MentionAgent) => void
  /**
   * Called when popover should close
   */
  onClose?: () => void
  /**
   * Maximum items to show
   * @default 5
   */
  maxItems?: number
  /**
   * Custom filter function
   */
  filter?: (agent: MentionAgent, query: string) => boolean
  /**
   * Empty state message
   * @default "No agents found"
   */
  emptyMessage?: string
  /**
   * Custom children (overrides default rendering)
   */
  children?: React.ReactNode
}

export interface MentionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Agent data
   */
  agent: MentionAgent
  /**
   * Whether this item is highlighted/focused
   */
  highlighted?: boolean
  /**
   * Called when item is selected
   */
  onSelect?: (agent: MentionAgent) => void
}

// ============================================================================
// Context
// ============================================================================

interface MentionContextValue {
  query: string
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  onSelect: (agent: MentionAgent) => void
}

const MentionContext = React.createContext<MentionContextValue | null>(null)

function useMentionContext() {
  const context = React.useContext(MentionContext)
  if (!context) {
    throw new Error('MentionItem must be used within MentionPopover')
  }
  return context
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Individual mention item
 */
export const MentionItem = React.forwardRef<HTMLDivElement, MentionItemProps>(
  ({ agent, highlighted = false, onSelect, className, children, ...props }, ref) => {
    const context = React.useContext(MentionContext)
    const handleSelect = onSelect || context?.onSelect

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={highlighted}
        className={cn(
          'flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors',
          highlighted ? 'bg-primary-50 text-primary-900' : 'hover:bg-gray-50',
          className
        )}
        onClick={() => handleSelect?.(agent)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleSelect?.(agent)
          }
        }}
        tabIndex={0}
        {...props}
      >
        {children || (
          <>
            <Avatar size="sm">
              {agent.avatar && <AvatarImage src={agent.avatar} alt={agent.name} />}
              <AvatarFallback variant="secondary">
                {agent.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{agent.name}</div>
              {agent.description && (
                <div className="text-xs text-gray-500 truncate">{agent.description}</div>
              )}
            </div>
            {agent.status && (
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  agent.status === 'online' && 'bg-green-500',
                  agent.status === 'busy' && 'bg-amber-500',
                  agent.status === 'offline' && 'bg-gray-300'
                )}
              />
            )}
          </>
        )}
      </div>
    )
  }
)
MentionItem.displayName = 'MentionItem'

/**
 * Popover content wrapper
 */
export const MentionPopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode | ((agents: MentionAgent[]) => React.ReactNode)
  }
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('py-1', className)}
      {...props}
    >
      {children}
    </div>
  )
})
MentionPopoverContent.displayName = 'MentionPopoverContent'

// ============================================================================
// Component
// ============================================================================

/**
 * MentionPopover Component
 *
 * Floating popover for @mention agent selection.
 * Features:
 * - Fuzzy search filtering
 * - Keyboard navigation (↑/↓/Enter/Esc)
 * - Composable item rendering
 * - Accessibility support (listbox pattern)
 */
export const MentionPopover = React.forwardRef<HTMLDivElement, MentionPopoverProps>(
  (
    {
      open,
      query = '',
      agents,
      position,
      onSelect,
      onClose,
      maxItems = 5,
      filter,
      emptyMessage = 'No agents found',
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)

    // Default filter function
    const defaultFilter = React.useCallback(
      (agent: MentionAgent, q: string) => {
        const searchLower = q.toLowerCase()
        return (
          agent.name.toLowerCase().includes(searchLower) ||
          agent.description?.toLowerCase().includes(searchLower) ||
          false
        )
      },
      []
    )

    // Filter agents
    const filteredAgents = React.useMemo(() => {
      const filterFn = filter || defaultFilter
      return agents.filter((agent) => filterFn(agent, query)).slice(0, maxItems)
    }, [agents, query, maxItems, filter, defaultFilter])

    // Reset highlight when filtered results change
    React.useEffect(() => {
      setHighlightedIndex(0)
    }, [filteredAgents.length])

    // Handle keyboard navigation
    React.useEffect(() => {
      if (!open) return

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setHighlightedIndex((prev) =>
              prev < filteredAgents.length - 1 ? prev + 1 : 0
            )
            break
          case 'ArrowUp':
            e.preventDefault()
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredAgents.length - 1
            )
            break
          case 'Enter':
            e.preventDefault()
            if (filteredAgents[highlightedIndex]) {
              onSelect?.(filteredAgents[highlightedIndex])
            }
            break
          case 'Escape':
            e.preventDefault()
            onClose?.()
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, filteredAgents, highlightedIndex, onSelect, onClose])

    // Don't render if closed
    if (!open) return null

    const contextValue: MentionContextValue = {
      query,
      highlightedIndex,
      setHighlightedIndex,
      onSelect: onSelect || (() => {}),
    }

    return (
      <MentionContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="listbox"
          aria-label="Select an agent to mention"
          className={cn(
            'absolute z-50 min-w-[200px] max-w-[300px]',
            'bg-white rounded-lg shadow-lg border border-gray-200',
            'overflow-hidden',
            className
          )}
          style={{
            top: position?.top,
            left: position?.left,
            ...style,
          }}
          {...props}
        >
          {children || (
            <MentionPopoverContent>
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => (
                  <MentionItem
                    key={agent.id}
                    agent={agent}
                    highlighted={index === highlightedIndex}
                    onSelect={onSelect}
                  />
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  {emptyMessage}
                </div>
              )}
            </MentionPopoverContent>
          )}

          {/* Keyboard hint */}
          <div className="border-t border-gray-100 px-3 py-1.5 bg-gray-50">
            <span className="text-xs text-gray-400">
              ↑↓ to navigate · Enter to select · Esc to close
            </span>
          </div>
        </div>
      </MentionContext.Provider>
    )
  }
)
MentionPopover.displayName = 'MentionPopover'

// ============================================================================
// Exports
// ============================================================================

export { useMentionContext }
