import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { MentionPopover, MentionItem, type MentionAgent } from '@uix/agent'

const meta: Meta<typeof MentionPopover> = {
  title: 'Components/MentionPopover',
  component: MentionPopover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MentionPopover>

const mockAgents: MentionAgent[] = [
  { id: '1', name: 'Claude', avatar: 'https://github.com/anthropics.png', description: 'AI 助手', status: 'online' },
  { id: '2', name: 'GPT-4', description: 'OpenAI 模型', status: 'online' },
  { id: '3', name: 'Gemini', description: 'Google AI', status: 'busy' },
  { id: '4', name: 'Llama', description: 'Meta AI', status: 'offline' },
]

/**
 * 基础用法
 */
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    const anchorRef = React.useRef<HTMLButtonElement>(null)

    return (
      <div className="relative w-80">
        <button
          ref={anchorRef}
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-gray-100 rounded-lg w-full text-left"
        >
          点击打开 @mention 选择器
        </button>

        <MentionPopover
          open={open}
          anchorRef={anchorRef}
          agents={mockAgents}
          onSelect={(agent) => {
            alert(`选择了 ${agent.name}`)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      </div>
    )
  },
}

/**
 * 带搜索过滤
 */
export const WithFilter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    return (
      <div className="w-80">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(e.target.value.length > 0)
          }}
          onFocus={() => query.length > 0 && setOpen(true)}
          placeholder="输入搜索 Agent..."
          className="w-full px-4 py-2 border rounded-lg"
        />

        <MentionPopover
          open={open}
          anchorRef={inputRef}
          query={query}
          agents={mockAgents}
          onSelect={(agent) => {
            setQuery(`@${agent.name} `)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      </div>
    )
  },
}

/**
 * 不同状态的 Agent
 */
export const AgentStatus: Story = {
  render: () => {
    const anchorRef = React.useRef<HTMLDivElement>(null)

    return (
      <div ref={anchorRef} className="w-80">
        <p className="text-sm text-gray-500 mb-2">
          Agent 可以有不同状态: online, busy, offline
        </p>
        <MentionPopover
          open={true}
          anchorRef={anchorRef}
          agents={mockAgents}
          onSelect={(agent) => alert(`选择了 ${agent.name}`)}
        />
      </div>
    )
  },
}

/**
 * 键盘导航
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    const anchorRef = React.useRef<HTMLDivElement>(null)

    return (
      <div ref={anchorRef} className="w-80" tabIndex={0}>
        <p className="text-sm text-gray-500 mb-2">
          使用 ↑↓ 键导航，Enter 选择，Escape 关闭
        </p>
        <MentionPopover
          open={open}
          anchorRef={anchorRef}
          agents={mockAgents}
          onSelect={(agent) => {
            alert(`选择了 ${agent.name}`)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      </div>
    )
  },
}

/**
 * 空状态
 */
export const EmptyState: Story = {
  render: () => {
    const anchorRef = React.useRef<HTMLDivElement>(null)

    return (
      <div ref={anchorRef} className="w-80">
        <p className="text-sm text-gray-500 mb-2">
          当没有匹配的 Agent 时显示空状态
        </p>
        <MentionPopover
          open={true}
          anchorRef={anchorRef}
          query="不存在的agent"
          agents={mockAgents}
          emptyMessage="没有找到匹配的 Agent"
          onSelect={() => {}}
        />
      </div>
    )
  },
}

/**
 * 自定义渲染
 */
export const CustomRenderer: Story = {
  render: () => {
    const anchorRef = React.useRef<HTMLDivElement>(null)

    return (
      <div ref={anchorRef} className="w-80">
        <p className="text-sm text-gray-500 mb-2">
          使用 children 函数自定义渲染
        </p>
        <MentionPopover
          open={true}
          anchorRef={anchorRef}
          agents={mockAgents}
          onSelect={(agent) => alert(`选择了 ${agent.name}`)}
        >
          {(filteredAgents) => (
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-2 px-2">可用 Agent ({filteredAgents.length})</div>
              {filteredAgents.map((agent) => (
                <MentionItem key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </MentionPopover>
      </div>
    )
  },
}
