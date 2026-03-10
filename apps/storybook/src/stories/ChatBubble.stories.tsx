import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatBubble } from '@uix-ai/agent'

const meta: Meta<typeof ChatBubble> = {
  title: 'Components/ChatBubble',
  component: ChatBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**已弃用**: 请使用 `ChatMessageSimple` 替代。ChatBubble 将在未来版本中移除。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['user', 'assistant', 'system'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatBubble>

/**
 * 助手消息 - 左侧对齐，带头像
 */
export const AssistantMessage: Story = {
  render: () => (
    <ChatBubble role="assistant" name="Claude">
      你好！有什么我可以帮助你的吗？
    </ChatBubble>
  ),
}

/**
 * 用户消息 - 右侧对齐
 */
export const UserMessage: Story = {
  render: () => (
    <ChatBubble role="user" name="User">
      请帮我写一个 React 组件。
    </ChatBubble>
  ),
}

/**
 * 系统消息 - 居中显示，样式简洁
 */
export const SystemMessage: Story = {
  render: () => (
    <ChatBubble role="system">
      会话已开始
    </ChatBubble>
  ),
}

/**
 * 带时间戳的消息
 */
export const WithTimestamp: Story = {
  render: () => (
    <div>
      <ChatBubble role="assistant" name="Claude" timestamp="14:30">
        这是一条带时间戳的消息。
      </ChatBubble>
      <ChatBubble role="user" timestamp={new Date()}>
        用户的回复也可以显示时间。
      </ChatBubble>
    </div>
  ),
}

/**
 * 带头像图片的助手消息
 */
export const WithAvatar: Story = {
  render: () => (
    <ChatBubble
      role="assistant"
      name="Claude"
      avatar="https://github.com/anthropics.png"
    >
      这条消息的助手头像使用了自定义图片。
    </ChatBubble>
  ),
}
