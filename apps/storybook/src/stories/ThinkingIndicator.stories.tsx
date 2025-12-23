import type { Meta, StoryObj } from '@storybook/react'
import { ThinkingIndicator } from '@uix/agent'

const meta: Meta<typeof ThinkingIndicator> = {
  title: 'Components/ThinkingIndicator',
  component: ThinkingIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dots', 'pulse', 'bounce', 'wave', 'spinner'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ThinkingIndicator>

/**
 * 默认 - 三点动画
 */
export const Default: Story = {
  args: {
    label: '思考中...',
  },
}

/**
 * 所有变体
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ThinkingIndicator variant="dots" />
        <span className="text-sm text-gray-500">dots</span>
      </div>
      <div className="flex items-center gap-4">
        <ThinkingIndicator variant="pulse" />
        <span className="text-sm text-gray-500">pulse</span>
      </div>
      <div className="flex items-center gap-4">
        <ThinkingIndicator variant="bounce" />
        <span className="text-sm text-gray-500">bounce</span>
      </div>
      <div className="flex items-center gap-4">
        <ThinkingIndicator variant="wave" />
        <span className="text-sm text-gray-500">wave</span>
      </div>
      <div className="flex items-center gap-4">
        <ThinkingIndicator variant="spinner" />
        <span className="text-sm text-gray-500">spinner</span>
      </div>
    </div>
  ),
}

/**
 * 不同尺寸
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <ThinkingIndicator size="sm" />
        <p className="text-xs mt-2 text-gray-500">sm</p>
      </div>
      <div className="text-center">
        <ThinkingIndicator size="md" />
        <p className="text-xs mt-2 text-gray-500">md</p>
      </div>
      <div className="text-center">
        <ThinkingIndicator size="lg" />
        <p className="text-xs mt-2 text-gray-500">lg</p>
      </div>
    </div>
  ),
}

/**
 * 颜色变体
 */
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <ThinkingIndicator color="primary" />
        <p className="text-xs mt-2 text-gray-500">primary</p>
      </div>
      <div className="text-center">
        <ThinkingIndicator color="secondary" />
        <p className="text-xs mt-2 text-gray-500">secondary</p>
      </div>
      <div className="text-center">
        <ThinkingIndicator color="muted" />
        <p className="text-xs mt-2 text-gray-500">muted</p>
      </div>
    </div>
  ),
}

/**
 * 带标签
 */
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <ThinkingIndicator label="正在分析..." />
      <ThinkingIndicator variant="spinner" label="加载中" />
      <ThinkingIndicator variant="wave" label="处理请求" />
    </div>
  ),
}

/**
 * 内联使用
 */
export const Inline: Story = {
  render: () => (
    <p className="text-base">
      AI 正在思考 <ThinkingIndicator inline size="sm" /> 请稍候...
    </p>
  ),
}
