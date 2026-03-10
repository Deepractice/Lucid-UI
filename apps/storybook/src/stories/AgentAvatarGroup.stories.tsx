import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AvatarGroup,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@uix/agent'

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AgentAvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: 'number',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    direction: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
}

export default meta
type Story = StoryObj<typeof AvatarGroup>

/**
 * 默认头像组 - 堆叠展示多个头像
 */
export const Default: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/anthropics.png" alt="Claude" />
        <AvatarFallback variant="primary">CL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="secondary">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback variant="warning">CD</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
}

/**
 * 超出最大数量时显示溢出计数 (+N)
 */
export const WithMax: Story = {
  render: () => (
    <AvatarGroup max={3}>
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

/**
 * 不同尺寸的头像组
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-500 mb-2">xs</p>
        <AvatarGroup size="xs">
          <Avatar>
            <AvatarFallback variant="primary">A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="secondary">B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="warning">C</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">sm</p>
        <AvatarGroup size="sm">
          <Avatar>
            <AvatarFallback variant="primary">A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="secondary">B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="warning">C</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">md</p>
        <AvatarGroup size="md">
          <Avatar>
            <AvatarFallback variant="primary">A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="secondary">B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="warning">C</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">lg</p>
        <AvatarGroup size="lg">
          <Avatar>
            <AvatarFallback variant="primary">A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="secondary">B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="warning">C</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">xl</p>
        <AvatarGroup size="xl">
          <Avatar>
            <AvatarFallback variant="primary">A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="secondary">B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback variant="warning">C</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
    </div>
  ),
}

/**
 * 右对齐方向 - 头像从右向左堆叠
 */
export const DirectionRight: Story = {
  render: () => (
    <AvatarGroup direction="right" max={3}>
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
    </AvatarGroup>
  ),
}
