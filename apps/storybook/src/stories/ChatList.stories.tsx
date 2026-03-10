import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatList,
  ChatListHeader,
  ChatListSearch,
  ChatListGroup,
  ChatListItem,
  ChatListItemAvatar,
  ChatListItemContent,
  ChatListItemBadge,
  ChatListEmpty,
} from '@uix-ai/agent'
import type { Conversation } from '@uix-ai/agent'

const meta: Meta<typeof ChatList> = {
  title: 'Layout/ChatList',
  component: ChatList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatList>

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'React 组件设计模式',
    lastMessage: '好的，我来帮你分析这个组件...',
    lastActiveAt: new Date(),
    unreadCount: 2,
    agent: {
      id: 'claude',
      name: 'Claude',
      avatar: 'https://github.com/anthropics.png',
    },
  },
  {
    id: '2',
    title: '代码审查讨论',
    lastMessage: '这段代码需要优化一下',
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000),
    agent: {
      id: 'claude',
      name: 'Claude',
      avatar: 'https://github.com/anthropics.png',
    },
  },
  {
    id: '3',
    title: 'TypeScript 类型问题',
    lastMessage: '你可以使用泛型来解决这个问题',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 5,
    agent: {
      id: 'gpt',
      name: 'GPT-4',
      avatar: 'https://github.com/openai.png',
    },
  },
  {
    id: '4',
    title: 'API 设计讨论',
    lastMessage: 'RESTful 还是 GraphQL？',
    lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    agent: {
      id: 'claude',
      name: 'Claude',
    },
  },
  {
    id: '5',
    title: '性能优化',
    lastMessage: '我们来看看如何减少渲染次数',
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    pinned: true,
    agent: {
      id: 'claude',
      name: 'Claude',
      avatar: 'https://github.com/anthropics.png',
    },
  },
]

/**
 * 组合模式 - 完整示例
 */
export const Composition: Story = {
  render: function CompositionDemo() {
    const [activeId, setActiveId] = useState<string>('1')
    const [search, setSearch] = useState('')

    const filteredConversations = mockConversations.filter((conv) =>
      conv.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
      <div className="w-80 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <ChatList activeId={activeId} onSelect={setActiveId}>
          <ChatListHeader title="会话" />
          <ChatListSearch value={search} onChange={setSearch} />

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ChatListItem key={conv.id} conversation={conv} />
              ))
            ) : (
              <ChatListEmpty
                title="未找到会话"
                description="尝试其他搜索词"
              />
            )}
          </div>
        </ChatList>
      </div>
    )
  },
}

/**
 * 分组显示
 */
export const WithGroups: Story = {
  render: function GroupsDemo() {
    const [activeId, setActiveId] = useState<string>('5')

    const pinnedConversations = mockConversations.filter((c) => c.pinned)
    const recentConversations = mockConversations.filter((c) => !c.pinned)

    return (
      <div className="w-80 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <ChatList activeId={activeId} onSelect={setActiveId}>
          <ChatListHeader title="会话" />

          <div className="flex-1 overflow-y-auto">
            {pinnedConversations.length > 0 && (
              <ChatListGroup label="置顶">
                {pinnedConversations.map((conv) => (
                  <ChatListItem key={conv.id} conversation={conv} />
                ))}
              </ChatListGroup>
            )}

            <ChatListGroup label="最近">
              {recentConversations.map((conv) => (
                <ChatListItem key={conv.id} conversation={conv} />
              ))}
            </ChatListGroup>
          </div>
        </ChatList>
      </div>
    )
  },
}

/**
 * 自定义 Item 渲染
 */
export const CustomItem: Story = {
  render: function CustomItemDemo() {
    const [activeId, setActiveId] = useState<string>('1')

    return (
      <div className="w-80 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <ChatList activeId={activeId} onSelect={setActiveId}>
          <ChatListHeader>
            <div className="flex items-center justify-between w-full">
              <h2 className="font-semibold text-gray-900">我的对话</h2>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </ChatListHeader>

          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <ChatListItem key={conv.id} conversation={conv}>
                <ChatListItemAvatar agent={conv.agent} />
                <ChatListItemContent conversation={conv} />
                <div className="flex flex-col items-end gap-1">
                  {conv.unreadCount && conv.unreadCount > 0 && (
                    <ChatListItemBadge count={conv.unreadCount} />
                  )}
                  {conv.pinned && (
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.828.722a.5.5 0 01.354 0l7 3a.5.5 0 01.318.465v3.163a.5.5 0 01-.318.465l-7 3a.5.5 0 01-.354 0l-7-3A.5.5 0 012.5 7.35V4.187a.5.5 0 01.318-.465l7-3z" />
                    </svg>
                  )}
                </div>
              </ChatListItem>
            ))}
          </div>
        </ChatList>
      </div>
    )
  },
}

/**
 * 空状态
 */
export const EmptyState: Story = {
  render: () => (
    <div className="w-80 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatList>
        <ChatListHeader title="会话" />
        <ChatListEmpty
          title="暂无会话"
          description="点击下方按钮开始新对话"
        >
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
            新建会话
          </button>
        </ChatListEmpty>
      </ChatList>
    </div>
  ),
}

/**
 * 带搜索的空状态
 */
export const SearchEmpty: Story = {
  render: function SearchEmptyDemo() {
    const [search, setSearch] = useState('不存在的内容')

    return (
      <div className="w-80 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <ChatList>
          <ChatListHeader title="会话" />
          <ChatListSearch value={search} onChange={setSearch} />
          <ChatListEmpty
            icon={
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            title="未找到结果"
            description={`没有与"${search}"相关的会话`}
          />
        </ChatList>
      </div>
    )
  },
}

/**
 * 加载状态模拟
 */
export const LoadingState: Story = {
  render: () => (
    <div className="w-80 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <ChatList>
        <ChatListHeader title="会话" />
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </ChatList>
    </div>
  ),
}
