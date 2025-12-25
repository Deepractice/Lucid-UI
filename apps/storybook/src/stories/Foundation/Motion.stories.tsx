import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, ThinkingIndicator } from '@uix/agent'

const meta: Meta = {
  title: 'Foundation/Motion',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

/** Avatar 的 5 种动画状态 */
export const AvatarStatus: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(['idle', 'thinking', 'planning', 'responding', 'tool-calling'] as const).map((status) => (
        <div key={status} className="text-center">
          <Avatar size="lg" status={status}>
            <AvatarFallback variant="primary">AI</AvatarFallback>
          </Avatar>
          <p className="text-xs text-gray-500 mt-2">{status}</p>
        </div>
      ))}
    </div>
  ),
}

/** ThinkingIndicator 的 5 种变体 */
export const ThinkingVariants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(['dots', 'pulse', 'bounce', 'wave', 'spinner'] as const).map((variant) => (
        <div key={variant} className="text-center">
          <div className="h-8 flex items-center justify-center">
            <ThinkingIndicator variant={variant} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{variant}</p>
        </div>
      ))}
    </div>
  ),
}

/** 消息状态流转 */
export const MessageFlow: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="idle" color="gray" />
      <Arrow />
      <StatusBadge status="thinking" color="blue" pulse />
      <Arrow />
      <StatusBadge status="streaming" color="blue" ping />
      <Arrow />
      <div className="flex flex-col gap-2">
        <StatusBadge status="complete" color="green" />
        <StatusBadge status="error" color="red" />
      </div>
    </div>
  ),
}

/** 在线状态 */
export const Presence: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {([
        { status: 'online', color: 'bg-green-500' },
        { status: 'offline', color: 'bg-gray-400' },
        { status: 'busy', color: 'bg-amber-500' },
      ] as const).map(({ status, color }) => (
        <div key={status} className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <span className={`absolute bottom-0 right-0 w-3 h-3 ${color} rounded-full border-2 border-white`} />
          </div>
          <span className="text-sm">{status}</span>
        </div>
      ))}
    </div>
  ),
}

// Helper components
function StatusBadge({ status, color, pulse, ping }: {
  status: string
  color: 'gray' | 'blue' | 'green' | 'red'
  pulse?: boolean
  ping?: boolean
}) {
  const colors = {
    gray: 'bg-gray-100 border-gray-200 text-gray-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }
  const dotColors = {
    gray: 'bg-gray-400',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors[color]}`}>
      <div className={`w-2 h-2 rounded-full ${dotColors[color]} ${pulse ? 'animate-pulse' : ''} ${ping ? 'animate-ping' : ''}`} />
      <span className="text-xs font-medium">{status}</span>
    </div>
  )
}

function Arrow() {
  return <span className="text-gray-300">→</span>
}
