import type { Meta, StoryObj } from '@storybook/react-vite'
import { AgentAvatar } from '@uix-ai/agent'

const meta: Meta<typeof AgentAvatar> = {
  title: 'Components/AgentAvatar',
  component: AgentAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy'],
    },
  },
}

export default meta
type Story = StoryObj<typeof AgentAvatar>

/**
 * 交互式 Playground - 使用 Controls 面板调整属性
 */
export const Playground: Story = {
  args: {
    name: 'Claude',
    variant: 'neutral',
    size: 'md',
  },
}

/**
 * 带图片的头像
 */
export const WithImage: Story = {
  render: () => (
    <AgentAvatar
      src="https://github.com/anthropics.png"
      name="Claude"
      size="lg"
    />
  ),
}

/**
 * 带自定义图标的头像
 */
export const WithIcon: Story = {
  render: () => (
    <AgentAvatar
      name="Bot"
      variant="primary"
      size="lg"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M9 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
        </svg>
      }
    />
  ),
}

/**
 * 所有颜色变体
 */
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <AgentAvatar name="Primary" variant="primary" />
      <AgentAvatar name="Secondary" variant="secondary" />
      <AgentAvatar name="Success" variant="success" />
      <AgentAvatar name="Warning" variant="warning" />
      <AgentAvatar name="Error" variant="error" />
      <AgentAvatar name="Info" variant="info" />
      <AgentAvatar name="Neutral" variant="neutral" />
    </div>
  ),
}

/**
 * 不同尺寸
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <AgentAvatar name="Small" variant="primary" size="sm" />
      <AgentAvatar name="Medium" variant="primary" size="md" />
      <AgentAvatar name="Large" variant="primary" size="lg" />
    </div>
  ),
}

/**
 * 在线状态指示器
 */
export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <AgentAvatar name="Online" variant="primary" size="lg" status="online" />
        <p className="text-xs mt-2 text-gray-500">online</p>
      </div>
      <div className="text-center">
        <AgentAvatar name="Offline" variant="neutral" size="lg" status="offline" />
        <p className="text-xs mt-2 text-gray-500">offline</p>
      </div>
      <div className="text-center">
        <AgentAvatar name="Busy" variant="warning" size="lg" status="busy" />
        <p className="text-xs mt-2 text-gray-500">busy</p>
      </div>
    </div>
  ),
}

/**
 * 首字母回退 - 自动从名称中提取首字母
 */
export const FallbackInitials: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <AgentAvatar name="Claude" variant="primary" />
      <AgentAvatar name="AI Assistant" variant="secondary" />
      <AgentAvatar name="System Monitor" variant="neutral" />
      <AgentAvatar name="X" variant="error" />
    </div>
  ),
}
