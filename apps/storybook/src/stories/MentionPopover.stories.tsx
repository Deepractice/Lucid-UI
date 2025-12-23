import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { MentionPopover, MentionItem } from '@uix/agent'

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

const mockAgents = [
  { id: '1', name: 'Claude', avatar: 'https://github.com/anthropics.png', description: 'AI 助手', status: 'online' as const },
  { id: '2', name: 'GPT-4', description: 'OpenAI 模型', status: 'online' as const },
  { id: '3', name: 'Gemini', description: 'Google AI', status: 'busy' as const },
  { id: '4', name: 'Llama', description: 'Meta AI', status: 'offline' as const },
]

/**
 * 基础用法
 */
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    const [selected, setSelected] = React.useState<string | null>(null)

    return (
      <div className="relative w-80">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-gray-100 rounded-lg w-full text-left"
        >
          {selected ? `已选择: ${selected}` : '点击打开 @mention 选择器'}
        </button>

        <MentionPopover
          open={open}
          onOpenChange={setOpen}
          onSelect={(agent) => {
            setSelected(agent.name)
            setOpen(false)
          }}
        >
          {mockAgents.map((agent) => (
            <MentionItem key={agent.id} agent={agent} />
          ))}
        </MentionPopover>
      </div>
    )
  },
}

/**
 * 带搜索过滤
 */
export const WithFilter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    const [query, setQuery] = React.useState('')

    const filteredAgents = mockAgents.filter(agent =>
      agent.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
      <div className="w-80">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="输入 @ 搜索 Agent..."
          className="w-full px-4 py-2 border rounded-lg"
        />

        <MentionPopover
          open={open && query.length > 0}
          onOpenChange={setOpen}
          onSelect={(agent) => {
            setQuery(`@${agent.name} `)
            setOpen(false)
          }}
        >
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <MentionItem key={agent.id} agent={agent} />
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              未找到匹配的 Agent
            </div>
          )}
        </MentionPopover>
      </div>
    )
  },
}

/**
 * 不同状态的 Agent
 */
export const AgentStatus: Story = {
  render: () => (
    <div className="w-80 border rounded-lg overflow-hidden">
      {mockAgents.map((agent) => (
        <MentionItem
          key={agent.id}
          agent={agent}
          onSelect={() => alert(`选择了 ${agent.name}`)}
        />
      ))}
    </div>
  ),
}

/**
 * 键盘导航
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((i) => (i + 1) % mockAgents.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((i) => (i - 1 + mockAgents.length) % mockAgents.length)
      } else if (e.key === 'Enter') {
        alert(`选择了 ${mockAgents[highlightedIndex].name}`)
      }
    }

    return (
      <div className="w-80" onKeyDown={handleKeyDown} tabIndex={0}>
        <p className="text-sm text-gray-500 mb-2">
          使用 ↑↓ 键导航，Enter 选择
        </p>
        <MentionPopover
          open={open}
          onOpenChange={setOpen}
          onSelect={(agent) => alert(`选择了 ${agent.name}`)}
        >
          {mockAgents.map((agent, index) => (
            <MentionItem
              key={agent.id}
              agent={agent}
              highlighted={index === highlightedIndex}
            />
          ))}
        </MentionPopover>
      </div>
    )
  },
}

/**
 * 空状态
 */
export const EmptyState: Story = {
  render: () => (
    <div className="w-80">
      <MentionPopover open onOpenChange={() => {}}>
        <div className="px-4 py-8 text-center text-gray-500">
          <p className="text-sm">没有可用的 Agent</p>
          <p className="text-xs mt-1">请先添加 Agent 到工作区</p>
        </div>
      </MentionPopover>
    </div>
  ),
}
