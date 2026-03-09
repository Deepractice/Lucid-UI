/**
 * AgentChat - One-component AI chat interface
 *
 * The fastest way to add an AI conversation UI to your app.
 * Combines ChatWindow, MessageList, and ChatInput into a single
 * pre-composed component that works out of the box.
 *
 * @example Minimal usage (3 lines)
 * ```tsx
 * import { AgentChat } from '@uix/agent'
 *
 * <AgentChat
 *   conversations={conversations}
 *   onSend={(text) => sendToAgent(text)}
 * />
 * ```
 *
 * @example With agent info
 * ```tsx
 * <AgentChat
 *   conversations={conversations}
 *   agent={{ id: '1', name: 'Claude', status: 'online' }}
 *   onSend={(text) => sendToAgent(text)}
 *   onStop={() => abortController.abort()}
 * />
 * ```
 *
 * @example Full integration with AG-UI
 * ```tsx
 * import { AgentChat } from '@uix/agent'
 * import { useAGUI } from '@uix/adapter-agui/react'
 *
 * function App() {
 *   const { conversations, status, send } = useAGUI({ url: '/api/agent' })
 *   return <AgentChat conversations={conversations} status={status} onSend={send} />
 * }
 * ```
 *
 * @example Full integration with Vercel AI SDK
 * ```tsx
 * import { AgentChat } from '@uix/agent'
 * import { useVercelChat } from '@uix/adapter-vercel/react'
 *
 * function App() {
 *   const chat = useVercelChat()
 *   return <AgentChat conversations={chat.conversations} status={chat.status} onSend={chat.send} />
 * }
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'
import type {
  ChatWindowAgent,
  ChatWindowStatus,
} from '../types'
import type {
  LucidConversation,
  LucidBlock,
  TextBlockContent,
  ThinkingBlockContent,
  ToolBlockContent,
  SourceBlockContent,
  ErrorBlockContent,
} from '@uix/core'
import {
  isTextBlock,
  isThinkingBlock,
  isToolBlock,
  isSourceBlock,
  isErrorBlock,
} from '@uix/core'
import {
  ChatWindow,
  ChatWindowHeader,
  ChatWindowMessages,
  ChatWindowInput,
  ChatWindowEmpty,
} from './ChatWindow'
import { ThinkingIndicator } from './ThinkingIndicator'
import { ToolResult } from './ToolResult'
import { SourceBlock, SourceList } from './SourceBlock'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageTimestamp,
} from './ChatMessage'

// ============================================================================
// AgentChat Props
// ============================================================================

export interface AgentChatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /**
   * UIX LucidConversation array - the universal format from any adapter.
   * Can come from @uix/adapter-vercel, @uix/adapter-agui, or any custom source.
   */
  conversations: LucidConversation[]

  /**
   * Agent information displayed in the header.
   * Omit to hide the header.
   */
  agent?: ChatWindowAgent | null

  /**
   * Chat status - controls input state and submit button behavior.
   * @default 'idle'
   */
  status?: ChatWindowStatus

  /**
   * Called when the user sends a message.
   */
  onSend?: (message: string) => void

  /**
   * Called when the user clicks stop during streaming.
   */
  onStop?: () => void

  /**
   * Called when the user clicks retry on an error message.
   */
  onRetry?: () => void

  /**
   * Called when the user approves a tool execution.
   */
  onToolApprove?: (toolCallId: string) => void

  /**
   * Called when the user denies a tool execution.
   */
  onToolDeny?: (toolCallId: string, reason?: string) => void

  /**
   * Input placeholder text.
   * @default '输入消息...'
   */
  placeholder?: string

  /**
   * Empty state configuration.
   */
  emptyState?: {
    icon?: React.ReactNode
    title?: string
    description?: string
  }

  /**
   * Custom block renderer. Return null to use default rendering.
   */
  renderBlock?: (block: LucidBlock, conversation: LucidConversation) => React.ReactNode | null

  /**
   * Whether to show the header.
   * @default true if agent is provided
   */
  showHeader?: boolean

  /**
   * Auto scroll to bottom on new messages.
   * @default true
   */
  autoScroll?: boolean
}

// ============================================================================
// Default Block Renderer
// ============================================================================

function DefaultBlockRenderer({
  block,
}: {
  block: LucidBlock
}) {
  if (isTextBlock(block)) {
    const content = block.content as TextBlockContent
    return (
      <div className="whitespace-pre-wrap break-words">
        {content.text}
        {block.status === 'streaming' && (
          <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-text-bottom" />
        )}
      </div>
    )
  }

  if (isThinkingBlock(block)) {
    const content = block.content as ThinkingBlockContent
    if (block.status === 'streaming') {
      return <ThinkingIndicator label={content.reasoning || undefined} />
    }
    if (content.reasoning) {
      return (
        <details className="text-sm text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">思考过程</summary>
          <div className="mt-1 pl-3 border-l-2 border-gray-200 whitespace-pre-wrap">
            {content.reasoning}
          </div>
        </details>
      )
    }
    return null
  }

  if (isToolBlock(block)) {
    const content = block.content as ToolBlockContent
    return (
      <ToolResult
        tool={content.name}
        status={content.status}
        error={content.error}
      >
        {content.output != null && (
          <pre className="text-xs overflow-x-auto">
            {typeof content.output === 'string'
              ? content.output
              : JSON.stringify(content.output, null, 2)}
          </pre>
        )}
      </ToolResult>
    )
  }

  if (isSourceBlock(block)) {
    const content = block.content as SourceBlockContent
    return <SourceBlock source={content} />
  }

  if (isErrorBlock(block)) {
    const content = block.content as ErrorBlockContent
    return (
      <div className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">
        {content.message}
      </div>
    )
  }

  return null
}

// ============================================================================
// Conversation-to-Message Renderer
// ============================================================================

function ConversationMessage({
  conversation,
  renderBlock,
  onToolApprove,
  onToolDeny,
}: {
  conversation: LucidConversation
  renderBlock?: AgentChatProps['renderBlock']
  onToolApprove?: AgentChatProps['onToolApprove']
  onToolDeny?: AgentChatProps['onToolDeny']
}) {
  // Collect source blocks separately for grouped rendering
  const sourceBlocks: LucidBlock[] = []
  const contentBlocks: LucidBlock[] = []

  for (const block of conversation.blocks) {
    if (isSourceBlock(block)) {
      sourceBlocks.push(block)
    } else {
      contentBlocks.push(block)
    }
  }

  return (
    <ChatMessage role={conversation.role} status={conversation.status === 'streaming' ? 'streaming' : 'complete'}>
      <ChatMessageAvatar
        name={conversation.role === 'user' ? '用户' : 'AI'}
      />
      <ChatMessageContent>
        <div className="space-y-2">
          {contentBlocks.map((block) => {
            // Try custom renderer first
            if (renderBlock) {
              const custom = renderBlock(block, conversation)
              if (custom !== null) {
                return <React.Fragment key={block.id}>{custom}</React.Fragment>
              }
            }

            return (
              <DefaultBlockRenderer key={block.id} block={block} />
            )
          })}

          {/* Grouped source citations */}
          {sourceBlocks.length > 0 && (
            <SourceList
              sources={sourceBlocks.map((block) => block.content as SourceBlockContent)}
            />
          )}
        </div>
        <ChatMessageTimestamp time={new Date(conversation.timestamp)} />
      </ChatMessageContent>
    </ChatMessage>
  )
}

// ============================================================================
// AgentChat Component
// ============================================================================

export const AgentChat = React.forwardRef<HTMLDivElement, AgentChatProps>(
  (
    {
      conversations,
      agent,
      status = 'idle',
      onSend,
      onStop,
      onRetry,
      onToolApprove,
      onToolDeny,
      placeholder,
      emptyState,
      renderBlock,
      showHeader,
      autoScroll = true,
      className,
      ...props
    },
    ref
  ) => {
    const shouldShowHeader = showHeader ?? !!agent

    return (
      <ChatWindow
        ref={ref}
        agent={agent}
        status={status}
        className={cn('h-full', className)}
        {...props}
      >
        {/* Header */}
        {shouldShowHeader && <ChatWindowHeader />}

        {/* Messages or Empty State */}
        {conversations.length === 0 ? (
          <ChatWindowEmpty
            icon={emptyState?.icon}
            title={emptyState?.title}
            description={emptyState?.description}
          />
        ) : (
          <ChatWindowMessages autoScroll={autoScroll}>
            {conversations.map((conversation) => (
              <ConversationMessage
                key={conversation.id}
                conversation={conversation}
                renderBlock={renderBlock}
                onToolApprove={onToolApprove}
                onToolDeny={onToolDeny}
              />
            ))}
          </ChatWindowMessages>
        )}

        {/* Input */}
        <ChatWindowInput
          onSend={onSend}
          placeholder={placeholder}
        />
      </ChatWindow>
    )
  }
)
AgentChat.displayName = 'AgentChat'
