import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@uix-ai/react'

const meta: Meta<typeof Badge> = {
  title: 'Base/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/**
 * 交互式 Playground - 使用 Controls 面板调整属性
 */
export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Badge',
  },
}

/**
 * 所有变体 - 展示全部 7 种样式
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

/**
 * 不同尺寸 - sm / md
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">小尺寸</Badge>
      <Badge size="md">中等尺寸</Badge>
    </div>
  ),
}
