import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  MessageList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageThinking,
  ChatInput,
  ChatInputTextarea,
  ChatInputToolbar,
  ChatInputTools,
  ChatInputButton,
  ChatInputSubmit,
  ToolResult,
  SourceBlock,
  type Message,
} from '@uix/agent'

const meta: Meta = {
  title: 'Playground',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

/**
 * 完整聊天界面
 *
 * 展示 UIX 组件组合成完整的 AI Chat 应用
 */
export const ChatDemo: Story = {
  render: () => <ChatPlayground />,
}

function ChatPlayground() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 AI 助手，有什么可以帮你的吗？',
      name: 'Claude',
    },
  ])
  const [input, setInput] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simulate AI response
    setIsStreaming(true)
    const aiMessageId = String(Date.now() + 1)

    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: 'assistant', content: '', name: 'Claude' },
    ])

    // Simulate streaming
    const response = '这是一个模拟的 AI 回复。在实际应用中，这里会显示来自 AI 的流式响应内容。UIX 组件库提供了完整的流式文本支持，可以实时显示 AI 生成的内容。'
    let index = 0

    const interval = setInterval(() => {
      if (index < response.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: response.slice(0, index + 1) }
              : msg
          )
        )
        index++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 30)
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">AI Chat</h1>
        <p className="text-sm text-gray-500">UIX Playground</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          autoScroll
          throttleMs={50}
          className="h-full"
          renderMessage={(message) => (
            <ChatMessage role={message.role}>
              <ChatMessageAvatar name={message.name} />
              <ChatMessageContent name={message.name}>
                {message.content || (isStreaming && message.role === 'assistant' && (
                  <ChatMessageThinking label="思考中..." />
                ))}
              </ChatMessageContent>
            </ChatMessage>
          )}
        />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t p-4">
        <ChatInput onSubmit={handleSubmit}>
          <ChatInputTextarea
            value={input}
            onChange={setInput}
            placeholder="输入消息..."
            disabled={isStreaming}
          />
          <ChatInputToolbar>
            <ChatInputTools>
              <ChatInputButton onClick={() => alert('附件功能')}>
                📎
              </ChatInputButton>
            </ChatInputTools>
            <ChatInputSubmit
              status={isStreaming ? 'streaming' : 'idle'}
              disabled={!input.trim()}
            />
          </ChatInputToolbar>
        </ChatInput>
      </div>
    </div>
  )
}

/**
 * 工具调用示例
 *
 * 展示 AI 调用工具的完整流程
 */
export const ToolUseDemo: Story = {
  render: () => (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <ChatMessage role="user">
        <ChatMessageContent>帮我搜索一下 React 19 的新特性</ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="assistant">
        <ChatMessageAvatar name="Claude" />
        <ChatMessageContent name="Claude">
          好的，让我搜索一下相关信息。
        </ChatMessageContent>
      </ChatMessage>

      <ToolResult tool="search_web" status="success">
        <pre className="text-xs">
          {JSON.stringify({ query: 'React 19 new features', results: 3 }, null, 2)}
        </pre>
      </ToolResult>

      <ChatMessage role="assistant">
        <ChatMessageAvatar name="Claude" />
        <ChatMessageContent name="Claude">
          根据搜索结果，React 19 的主要新特性包括：

          1. **Actions** - 简化异步操作和表单处理
          2. **use() Hook** - 在渲染时读取资源
          3. **Server Components** - 改进的服务端组件支持

          以下是相关来源：
        </ChatMessageContent>
      </ChatMessage>

      <div className="ml-12 space-y-2">
        <SourceBlock
          source={{
            sourceId: '1',
            sourceType: 'url',
            title: 'React 19 Release Notes',
            url: 'https://react.dev/blog/2024/react-19',
          }}
        />
        <SourceBlock
          source={{
            sourceId: '2',
            sourceType: 'url',
            title: 'What\'s New in React 19',
            url: 'https://example.com/react-19-features',
          }}
        />
      </div>
    </div>
  ),
}

/**
 * 审批流程示例
 *
 * 展示工具需要用户审批的场景
 */
export const ApprovalDemo: Story = {
  render: () => {
    const [status, setStatus] = React.useState<'approval-required' | 'approved' | 'running' | 'success'>('approval-required')

    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <ChatMessage role="user">
          <ChatMessageContent>删除 temp 目录下的所有文件</ChatMessageContent>
        </ChatMessage>

        <ChatMessage role="assistant">
          <ChatMessageAvatar name="Claude" />
          <ChatMessageContent name="Claude">
            我需要删除以下目录中的文件，请确认：
          </ChatMessageContent>
        </ChatMessage>

        <ToolResult
          tool="delete_files"
          status={status}
          onApprove={() => {
            setStatus('approved')
            setTimeout(() => setStatus('running'), 500)
            setTimeout(() => setStatus('success'), 2000)
          }}
          onDeny={() => alert('已取消操作')}
        >
          <div className="text-sm">
            <p className="font-medium text-gray-700">将删除：</p>
            <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
              /tmp/user-uploads/*.tmp (12 个文件)
            </code>
          </div>
        </ToolResult>

        {status === 'success' && (
          <ChatMessage role="assistant">
            <ChatMessageAvatar name="Claude" />
            <ChatMessageContent name="Claude">
              已成功删除 12 个临时文件。
            </ChatMessageContent>
          </ChatMessage>
        )}
      </div>
    )
  },
}
