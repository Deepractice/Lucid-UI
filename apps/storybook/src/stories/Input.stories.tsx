import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@uix-ai/react'

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

/**
 * 交互式 Playground - 使用 Controls 面板调整属性
 */
export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    placeholder: '请输入内容...',
  },
}

/**
 * 不同尺寸 - sm / md / lg
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="小尺寸 (sm)" />
      <Input size="md" placeholder="中等尺寸 (md)" />
      <Input size="lg" placeholder="大尺寸 (lg)" />
    </div>
  ),
}

/**
 * 错误状态 - 用于表单验证失败时
 */
export const ErrorVariant: Story = {
  args: {
    variant: 'error',
    placeholder: '输入有误',
  },
}

/**
 * 禁用状态
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '不可编辑',
    value: '已禁用的输入框',
  },
}

/**
 * 带占位文本
 */
export const WithPlaceholder: Story = {
  args: {
    placeholder: '请输入您的邮箱地址...',
  },
}
