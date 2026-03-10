import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '@uix/lucid-react'

const meta: Meta<typeof Skeleton> = {
  title: 'Base/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

/**
 * 默认骨架屏
 */
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
}

/**
 * 文本行骨架 - 模拟多行文本加载
 */
export const TextLines: Story = {
  render: () => (
    <div className="space-y-3" style={{ width: 300 }}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[85%]" />
      <Skeleton className="h-4 w-[70%]" />
    </div>
  ),
}

/**
 * 卡片骨架 - 模拟卡片内容加载中
 */
export const CardSkeleton: Story = {
  render: () => (
    <div
      className="rounded-lg border border-gray-200 p-6 space-y-4"
      style={{ width: 350 }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-3 w-[40%]" />
        </div>
      </div>
      <Skeleton className="h-[120px] w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  ),
}

/**
 * 圆形骨架 - 用于头像等圆形元素的加载占位
 */
export const CircleSkeleton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-16 w-16 rounded-full" />
    </div>
  ),
}
