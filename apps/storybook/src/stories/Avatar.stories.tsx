import type { Meta, StoryObj } from '@storybook/react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatusIndicator,
  AvatarGroup,
} from '@uix/agent'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: ['idle', 'thinking', 'planning', 'responding', 'tool-calling'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

/**
 * 基础头像 - 带图片和 fallback
 */
export const Basic: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/anthropics.png" alt="Claude" />
      <AvatarFallback>CL</AvatarFallback>
    </Avatar>
  ),
}

/**
 * 不同尺寸
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}

/**
 * 颜色变体
 */
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback variant="primary">U</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="secondary">A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="neutral">S</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="warning">T</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="error">!</AvatarFallback>
      </Avatar>
    </div>
  ),
}

/**
 * AI 状态动画
 */
export const AIStatus: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <Avatar status="idle">
          <AvatarFallback variant="secondary">A</AvatarFallback>
        </Avatar>
        <p className="text-xs mt-2 text-gray-500">idle</p>
      </div>
      <div className="text-center">
        <Avatar status="thinking">
          <AvatarFallback variant="secondary">A</AvatarFallback>
        </Avatar>
        <p className="text-xs mt-2 text-gray-500">thinking</p>
      </div>
      <div className="text-center">
        <Avatar status="responding">
          <AvatarFallback variant="secondary">A</AvatarFallback>
        </Avatar>
        <p className="text-xs mt-2 text-gray-500">responding</p>
      </div>
      <div className="text-center">
        <Avatar status="tool-calling">
          <AvatarFallback variant="secondary">A</AvatarFallback>
        </Avatar>
        <p className="text-xs mt-2 text-gray-500">tool-calling</p>
      </div>
    </div>
  ),
}

/**
 * 在线状态指示器
 */
export const PresenceStatus: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/anthropics.png" />
        <AvatarFallback>CL</AvatarFallback>
        <AvatarStatusIndicator status="online" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="primary">U</AvatarFallback>
        <AvatarStatusIndicator status="busy" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="neutral">S</AvatarFallback>
        <AvatarStatusIndicator status="offline" />
      </Avatar>
    </div>
  ),
}

/**
 * 头像组 - 堆叠展示
 */
export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar>
        <AvatarFallback variant="primary">A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="secondary">B</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="warning">C</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="error">D</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="neutral">E</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="primary">F</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
}
