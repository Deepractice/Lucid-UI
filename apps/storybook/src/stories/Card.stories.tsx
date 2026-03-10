import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@uix-ai/lucid-react'

const meta: Meta<typeof Card> = {
  title: 'Base/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

/**
 * 基础卡片 - 标题加内容
 */
export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
      </CardHeader>
      <CardContent>
        <p>这是卡片的主要内容区域，可以放置任意内容。</p>
      </CardContent>
    </Card>
  ),
}

/**
 * 带描述信息的卡片
 */
export const WithDescription: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>项目概览</CardTitle>
        <CardDescription>查看项目的最新状态和进度信息</CardDescription>
      </CardHeader>
      <CardContent>
        <p>项目进展顺利，当前完成度为 85%。</p>
      </CardContent>
    </Card>
  ),
}

/**
 * 带底部操作区的卡片
 */
export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>确认操作</CardTitle>
      </CardHeader>
      <CardContent>
        <p>确定要执行此操作吗？该操作不可撤销。</p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700">
            取消
          </button>
          <button className="px-4 py-2 text-sm rounded-md bg-primary-600 text-white">
            确认
          </button>
        </div>
      </CardFooter>
    </Card>
  ),
}

/**
 * 完整卡片 - 包含所有子组件
 */
export const FullCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>用户设置</CardTitle>
        <CardDescription>管理您的账户偏好和通知设置</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">当前方案：专业版</p>
          <p className="text-sm text-gray-500">
            您的订阅将于 2026 年 4 月 15 日续费。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 text-sm rounded-md bg-primary-600 text-white">
          管理订阅
        </button>
      </CardFooter>
    </Card>
  ),
}
