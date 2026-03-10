import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatWindow,
  ChatWindowHeader,
  ChatWindowHeaderAvatar,
  ChatWindowHeaderInfo,
  ChatWindowHeaderActions,
  ChatWindowMessages,
  ChatWindowInput,
  ChatWindowEmpty,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageSimple,
} from '@uix-ai/agent'
import { StreamMarkdown } from '@uix-ai/stream'
import type { ChatWindowAgent, Message } from '@uix-ai/agent'

const meta: Meta<typeof ChatWindow> = {
  title: 'Layout/ChatWindow',
  component: ChatWindow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatWindow>

// Mock data
const mockAgent: ChatWindowAgent = {
  id: 'claude',
  name: 'Claude',
  avatar: 'https://github.com/anthropics.png',
  status: 'online',
  description: 'AI 助手',
}

const mockMessages: Message[] = [
  { id: '1', role: 'user', content: '你好，请帮我解释一下什么是 React？' },
  {
    id: '2',
    role: 'assistant',
    content:
      'React 是一个用于构建用户界面的 JavaScript 库。它由 Facebook 开发，采用组件化的方式来构建 UI，使得代码更易于维护和复用。',
  },
  { id: '3', role: 'user', content: '那 React 和 Vue 有什么区别？' },
  {
    id: '4',
    role: 'assistant',
    content:
      'React 和 Vue 的主要区别在于：\n\n1. **模板语法**：Vue 使用模板语法，React 使用 JSX\n2. **数据绑定**：Vue 是双向绑定，React 是单向数据流\n3. **学习曲线**：Vue 相对更容易上手，React 需要理解更多概念',
  },
]

/**
 * 组合模式 - 完整示例（使用 StreamMarkdown 渲染 Markdown）
 */
export const Composition: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatWindow agent={mockAgent} status="idle">
        <ChatWindowHeader>
          <ChatWindowHeaderAvatar agent={mockAgent} />
          <ChatWindowHeaderInfo agent={mockAgent} />
          <ChatWindowHeaderActions>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </ChatWindowHeaderActions>
        </ChatWindowHeader>

        <ChatWindowMessages>
          {mockMessages.map((msg) =>
            msg.role === 'user' ? (
              <ChatMessageSimple
                key={msg.id}
                role="user"
                content={msg.content}
              />
            ) : (
              <ChatMessage key={msg.id} role="assistant">
                <ChatMessageAvatar src={mockAgent.avatar} name={mockAgent.name} />
                <ChatMessageContent name={mockAgent.name}>
                  <StreamMarkdown content={msg.content} />
                </ChatMessageContent>
              </ChatMessage>
            )
          )}
        </ChatWindowMessages>

        <ChatWindowInput
          placeholder="输入消息..."
          onSend={(msg) => console.log('Send:', msg)}
        />
      </ChatWindow>
    </div>
  ),
}

/**
 * 默认用法 - Header 自动渲染
 */
export const DefaultHeader: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatWindow agent={mockAgent} status="idle">
        <ChatWindowHeader />
        <ChatWindowMessages>
          <ChatMessageSimple
            role="assistant"
            content="你好！有什么我可以帮助你的吗？"
            avatar={mockAgent.avatar}
            name={mockAgent.name}
          />
        </ChatWindowMessages>
        <ChatWindowInput onSend={(msg) => console.log('Send:', msg)} />
      </ChatWindow>
    </div>
  ),
}

/**
 * 流式状态
 */
export const StreamingState: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatWindow agent={mockAgent} status="streaming">
        <ChatWindowHeader />
        <ChatWindowMessages>
          <ChatMessageSimple role="user" content="给我讲一个故事" />
          <ChatMessage role="assistant" status="streaming">
            <ChatMessageAvatar src={mockAgent.avatar} name={mockAgent.name} />
            <ChatMessageContent name={mockAgent.name}>
              从前有一座山，山里有一座庙...
              <span className="animate-pulse">▋</span>
            </ChatMessageContent>
          </ChatMessage>
        </ChatWindowMessages>
        <ChatWindowInput onSend={(msg) => console.log('Send:', msg)} />
      </ChatWindow>
    </div>
  ),
}

/**
 * 空状态
 */
export const EmptyState: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatWindow agent={mockAgent} status="idle">
        <ChatWindowHeader />
        <ChatWindowEmpty
          title="开始新对话"
          description="向 Claude 提问任何问题"
        />
        <ChatWindowInput onSend={(msg) => console.log('Send:', msg)} />
      </ChatWindow>
    </div>
  ),
}

/**
 * 自定义空状态
 */
export const CustomEmptyState: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatWindow agent={mockAgent} status="idle">
        <ChatWindowHeader />
        <ChatWindowEmpty
          icon={
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-4xl">🤖</span>
            </div>
          }
          title="欢迎使用 AI 助手"
          description="我可以帮你回答问题、写代码、翻译文本等"
        >
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
              开始对话
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              查看示例
            </button>
          </div>
        </ChatWindowEmpty>
        <ChatWindowInput onSend={(msg) => console.log('Send:', msg)} />
      </ChatWindow>
    </div>
  ),
}

/**
 * 不同 Agent 状态
 */
export const AgentStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['online', 'offline', 'busy'] as const).map((status) => (
        <div
          key={status}
          className="w-80 h-[300px] border border-gray-200 rounded-lg overflow-hidden"
        >
          <ChatWindow agent={{ ...mockAgent, status }} status="idle">
            <ChatWindowHeader />
            <ChatWindowMessages>
              <ChatMessageSimple
                role="assistant"
                content={`Agent 状态: ${status}`}
                name={mockAgent.name}
              />
            </ChatWindowMessages>
          </ChatWindow>
        </div>
      ))}
    </div>
  ),
}

/**
 * 无 Agent（仅作为容器）
 */
export const NoAgent: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatWindow status="idle">
        <ChatWindowHeader>
          <h2 className="font-semibold text-gray-900">自定义标题</h2>
        </ChatWindowHeader>
        <ChatWindowMessages>
          <ChatMessageSimple role="user" content="这是一个无 Agent 的示例" />
          <ChatMessageSimple
            role="assistant"
            content="ChatWindow 也可以不绑定 Agent，作为纯容器使用"
          />
        </ChatWindowMessages>
        <ChatWindowInput onSend={(msg) => console.log('Send:', msg)} />
      </ChatWindow>
    </div>
  ),
}

/**
 * Markdown 渲染示例
 *
 * 使用 StreamMarkdown 渲染富文本内容，支持：
 * - 标题、粗体、斜体
 * - 列表（有序/无序）
 * - 代码块（语法高亮）
 * - 表格
 */
export const MarkdownRendering: Story = {
  render: () => {
    const markdownContent = `## React 核心概念

React 有几个**核心概念**需要掌握：

### 1. 组件 (Components)

组件是 React 的基本构建块。有两种类型：

- **函数组件** - 推荐使用
- **类组件** - 传统写法

### 2. JSX

JSX 是 JavaScript 的语法扩展：

\`\`\`jsx
function Hello({ name }) {
  return <h1>Hello, {name}!</h1>
}
\`\`\`

### 3. Props vs State

| 特性 | Props | State |
|------|-------|-------|
| 可变性 | 不可变 | 可变 |
| 来源 | 父组件 | 组件内部 |
| 更新 | 父组件更新 | setState |

> 记住：**Props 向下流动，Events 向上冒泡**`

    return (
      <div className="h-[700px] border border-gray-200 rounded-lg overflow-hidden">
        <ChatWindow agent={mockAgent} status="idle">
          <ChatWindowHeader />
          <ChatWindowMessages>
            <ChatMessageSimple role="user" content="帮我总结一下 React 的核心概念" />
            <ChatMessage role="assistant">
              <ChatMessageAvatar src={mockAgent.avatar} name={mockAgent.name} />
              <ChatMessageContent name={mockAgent.name}>
                <StreamMarkdown content={markdownContent} />
              </ChatMessageContent>
            </ChatMessage>
          </ChatWindowMessages>
          <ChatWindowInput onSend={(msg) => console.log('Send:', msg)} />
        </ChatWindow>
      </div>
    )
  },
}
