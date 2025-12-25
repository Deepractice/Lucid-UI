import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  MessageList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  type Message,
} from '@uix/agent'

const meta: Meta<typeof MessageList> = {
  title: 'Components/MessageList',
  component: MessageList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MessageList>

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'system',
    content: '会话开始',
    timestamp: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '2',
    role: 'user',
    content: '你好，请帮我解释一下 React Hooks 是什么？',
    timestamp: new Date('2024-01-15T10:01:00'),
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'React Hooks 是 React 16.8 引入的特性，让你可以在函数组件中使用 state 和其他 React 特性。主要的 Hooks 包括：\n\n1. useState - 管理组件状态\n2. useEffect - 处理副作用\n3. useContext - 使用上下文\n4. useRef - 获取 DOM 引用或保存可变值',
    avatar: '/claude-avatar.png',
    name: 'Claude',
    timestamp: new Date('2024-01-15T10:01:30'),
  },
  {
    id: '4',
    role: 'user',
    content: '那 useEffect 和 useLayoutEffect 有什么区别？',
    timestamp: new Date('2024-01-15T10:02:00'),
  },
  {
    id: '5',
    role: 'assistant',
    content:
      '主要区别在于执行时机：\n\n• useEffect 在浏览器绑制后异步执行，不会阻塞渲染\n• useLayoutEffect 在 DOM 更新后、浏览器绑制前同步执行\n\n一般情况下优先使用 useEffect。只有当你需要在绘制前读取 DOM 布局或同步触发重渲染时，才使用 useLayoutEffect。',
    avatar: '/claude-avatar.png',
    name: 'Claude',
    timestamp: new Date('2024-01-15T10:02:30'),
  },
]

/**
 * 基础用法
 *
 * 使用默认渲染器显示消息列表
 */
export const Basic: Story = {
  render: () => (
    <div className="h-96 border rounded-lg">
      <MessageList messages={sampleMessages} />
    </div>
  ),
}

/**
 * 不同角色
 *
 * 展示 user、assistant、system 三种角色的样式
 */
export const DifferentRoles: Story = {
  render: () => {
    const messages: Message[] = [
      {
        id: '1',
        role: 'system',
        content: '系统消息 - 居中显示，灰色背景',
      },
      {
        id: '2',
        role: 'user',
        content: '用户消息 - 右对齐，主色调背景',
      },
      {
        id: '3',
        role: 'assistant',
        content: 'AI 消息 - 左对齐，灰色背景，带头像',
        avatar: '/claude-avatar.png',
        name: 'Claude',
      },
    ]

    return (
      <div className="h-64 border rounded-lg">
        <MessageList messages={messages} />
      </div>
    )
  },
}

/**
 * 自定义渲染器
 *
 * 通过 renderMessage 属性自定义消息渲染
 */
export const CustomRenderer: Story = {
  render: () => {
    const messages: Message[] = [
      {
        id: '1',
        role: 'user',
        content: '这是用户消息',
      },
      {
        id: '2',
        role: 'assistant',
        content: '这是 AI 回复',
        name: 'Custom Bot',
      },
    ]

    return (
      <div className="h-64 border rounded-lg">
        <MessageList
          messages={messages}
          renderMessage={(message) => (
            <ChatMessage role={message.role}>
              <ChatMessageAvatar name={message.name} />
              <ChatMessageContent>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {message.role}
                  </span>
                  <span>{message.content}</span>
                </div>
              </ChatMessageContent>
            </ChatMessage>
          )}
        />
      </div>
    )
  },
}

/**
 * 自动滚动
 *
 * 新消息时自动滚动到底部
 */
export const AutoScroll: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '点击按钮添加新消息，观察自动滚动效果',
        name: 'Bot',
      },
    ])

    const addMessage = () => {
      const newId = String(messages.length + 1)
      const isUser = messages.length % 2 === 1

      setMessages((prev) => [
        ...prev,
        {
          id: newId,
          role: isUser ? 'user' : 'assistant',
          content: isUser
            ? `用户消息 #${newId}`
            : `AI 回复 #${newId} - 这是一条较长的消息，用于测试消息气泡的自动换行功能。`,
          name: isUser ? undefined : 'Bot',
          timestamp: new Date(),
        },
      ])
    }

    return (
      <div className="space-y-4">
        <button
          onClick={addMessage}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          添加消息
        </button>
        <div className="h-64 border rounded-lg">
          <MessageList messages={messages} autoScroll />
        </div>
      </div>
    )
  },
}

/**
 * 节流滚动
 *
 * 在流式响应时使用 throttleMs 优化性能
 */
export const ThrottledScroll: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<Message[]>([
      {
        id: '1',
        role: 'user',
        content: '请写一首诗',
      },
      {
        id: '2',
        role: 'assistant',
        content: '',
        name: 'Claude',
      },
    ])

    const [isStreaming, setIsStreaming] = React.useState(false)

    const simulateStream = () => {
      const poem = `静夜思
床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。`

      setIsStreaming(true)
      let index = 0

      const interval = setInterval(() => {
        if (index < poem.length) {
          setMessages((prev) => {
            const updated = [...prev]
            updated[1] = {
              ...updated[1],
              content: poem.slice(0, index + 1),
            }
            return updated
          })
          index++
        } else {
          clearInterval(interval)
          setIsStreaming(false)
        }
      }, 50)
    }

    return (
      <div className="space-y-4">
        <button
          onClick={simulateStream}
          disabled={isStreaming}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          {isStreaming ? '流式输出中...' : '模拟流式响应'}
        </button>
        <p className="text-sm text-gray-500">
          使用 throttleMs=50 限制滚动更新频率
        </p>
        <div className="h-64 border rounded-lg">
          <MessageList messages={messages} autoScroll throttleMs={50} />
        </div>
      </div>
    )
  },
}

/**
 * 长对话
 *
 * 展示包含多条消息的长对话
 */
export const LongConversation: Story = {
  render: () => {
    const longMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      role: i % 2 === 0 ? 'user' : 'assistant',
      content:
        i % 2 === 0
          ? `这是第 ${i + 1} 条用户消息`
          : `这是第 ${i + 1} 条 AI 回复。回复内容会比较长一些，以便测试消息气泡的自动换行效果和整体布局。`,
      name: i % 2 === 0 ? undefined : 'Claude',
      timestamp: new Date(Date.now() - (20 - i) * 60000),
    }))

    return (
      <div className="h-96 border rounded-lg">
        <MessageList messages={longMessages} autoScroll />
      </div>
    )
  },
}
