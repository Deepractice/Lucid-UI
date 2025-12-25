import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageTimestamp,
  ChatMessageThinking,
  ChatMessageError,
  ChatMessageSimple,
  StreamText,
} from '@uix/agent'

const meta: Meta<typeof ChatMessage> = {
  title: 'Components/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatMessage>

/**
 * 组合模式 - 完整示例
 */
export const Composition: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      {/* 用户消息 */}
      <ChatMessage role="user">
        <ChatMessageContent>
          你好，请帮我解释一下什么是 React 组合模式？
        </ChatMessageContent>
      </ChatMessage>

      {/* AI 回复 */}
      <ChatMessage role="assistant">
        <ChatMessageAvatar src="https://github.com/anthropics.png" name="Claude" />
        <ChatMessageContent name="Claude">
          React 组合模式是一种设计模式，通过将组件作为 children 传递，
          而不是通过 props 配置所有行为。这使得组件更加灵活和可扩展。
          <ChatMessageTimestamp time={new Date()} />
        </ChatMessageContent>
      </ChatMessage>
    </div>
  ),
}

/**
 * 不同角色
 */
export const Roles: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <ChatMessage role="user">
        <ChatMessageContent>用户消息 - 右对齐，蓝色背景</ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="assistant">
        <ChatMessageAvatar name="A" />
        <ChatMessageContent>AI 助手消息 - 左对齐，灰色背景</ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="system">
        <ChatMessageContent>系统消息 - 居中，淡色背景</ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="tool">
        <ChatMessageAvatar name="T" />
        <ChatMessageContent>工具调用结果 - 橙色主题</ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="error">
        <ChatMessageAvatar name="!" />
        <ChatMessageContent>错误消息 - 红色主题</ChatMessageContent>
      </ChatMessage>
    </div>
  ),
}

/**
 * 思考状态
 */
export const ThinkingState: Story = {
  render: () => (
    <div className="max-w-2xl">
      <ChatMessage role="assistant" status="thinking">
        <ChatMessageAvatar name="Claude" />
        <ChatMessageContent>
          <ChatMessageThinking label="正在分析问题..." />
        </ChatMessageContent>
      </ChatMessage>
    </div>
  ),
}

/**
 * 流式输出
 */
export const Streaming: Story = {
  render: function StreamingDemo() {
    const text = '这是一个流式输出的演示。文字会像打字一样逐个显示出来，模拟 AI 实时生成响应的效果。'

    return (
      <div className="max-w-2xl">
        <ChatMessage role="assistant" status="streaming">
          <ChatMessageAvatar name="Claude" />
          <ChatMessageContent name="Claude">
            <StreamText text={text} speed={30} cursor />
          </ChatMessageContent>
        </ChatMessage>
      </div>
    )
  },
}

/**
 * 错误状态
 */
export const ErrorState: Story = {
  render: () => (
    <div className="max-w-2xl">
      <ChatMessage role="assistant" status="error">
        <ChatMessageAvatar name="Claude" />
        <ChatMessageContent>
          <ChatMessageError
            message="网络连接失败，请检查网络设置"
            onRetry={() => alert('重试')}
          />
        </ChatMessageContent>
      </ChatMessage>
    </div>
  ),
}

/**
 * 简化版 - ChatMessageSimple
 *
 * 当不需要完全自定义时，可以使用预组合的简化版本
 */
export const SimpleVersion: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <ChatMessageSimple
        role="user"
        content="这是简化版组件的用法"
      />

      <ChatMessageSimple
        role="assistant"
        status="complete"
        content="简化版自动处理 Avatar、Content、Timestamp 的组合，适合快速使用。"
        avatar="https://github.com/anthropics.png"
        name="Claude"
        timestamp={new Date()}
      />

      <ChatMessageSimple
        role="assistant"
        status="thinking"
        name="Claude"
        thinkingLabel="思考中..."
      />
    </div>
  ),
}

/**
 * 对话流示例
 */
export const ConversationFlow: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl p-4 bg-gray-50 rounded-xl">
      <ChatMessage role="user">
        <ChatMessageContent>
          帮我写一个 React Hook
        </ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="assistant">
        <ChatMessageAvatar name="Claude" />
        <ChatMessageContent name="Claude">
          <div>
            好的，我来帮你写一个自定义 Hook。这是一个用于管理表单状态的 Hook：
            <pre className="mt-2 p-3 bg-gray-800 text-gray-100 rounded text-sm overflow-x-auto">
              <code>{`function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  // ...
}`}</code>
            </pre>
          </div>
          <ChatMessageTimestamp time={new Date()} />
        </ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="user">
        <ChatMessageContent>
          能加上验证功能吗？
        </ChatMessageContent>
      </ChatMessage>

      <ChatMessage role="assistant" status="streaming">
        <ChatMessageAvatar name="Claude" />
        <ChatMessageContent name="Claude">
          <StreamText
            text="当然可以！我来添加验证功能。你可以传入一个 validate 函数..."
            speed={25}
            cursor
          />
        </ChatMessageContent>
      </ChatMessage>
    </div>
  ),
}
