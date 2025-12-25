import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { ToolResult } from '@uix/agent'

const meta: Meta<typeof ToolResult> = {
  title: 'Components/ToolResult',
  component: ToolResult,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToolResult>

/**
 * 成功状态
 */
export const Success: Story = {
  render: () => (
    <div className="max-w-xl">
      <ToolResult tool="search_web" status="success">
        <pre className="text-sm">
          {JSON.stringify(
            {
              results: [
                { title: 'React Documentation', url: 'https://react.dev' },
                { title: 'Next.js Documentation', url: 'https://nextjs.org' },
              ],
            },
            null,
            2
          )}
        </pre>
      </ToolResult>
    </div>
  ),
}

/**
 * 错误状态
 */
export const Error: Story = {
  render: () => (
    <div className="max-w-xl">
      <ToolResult
        tool="execute_code"
        status="error"
        error="SyntaxError: Unexpected token at line 5"
      />
    </div>
  ),
}

/**
 * 运行中状态
 */
export const Running: Story = {
  render: () => (
    <div className="max-w-xl">
      <ToolResult tool="analyze_image" status="running" />
    </div>
  ),
}

/**
 * 需要审批
 */
export const ApprovalRequired: Story = {
  render: () => {
    const [status, setStatus] = React.useState<'approval-required' | 'approved' | 'denied' | 'running' | 'success'>('approval-required')

    return (
      <div className="max-w-xl">
        <ToolResult
          tool="delete_file"
          status={status}
          onApprove={() => {
            setStatus('approved')
            setTimeout(() => setStatus('running'), 500)
            setTimeout(() => setStatus('success'), 2000)
          }}
          onDeny={(reason) => {
            setStatus('denied')
            console.log('Denied with reason:', reason)
          }}
        >
          <div className="text-sm text-gray-600">
            <p className="font-medium">将要删除以下文件：</p>
            <code className="block mt-2 p-2 bg-gray-100 rounded">
              /tmp/user-uploads/temp-file.txt
            </code>
          </div>
        </ToolResult>
      </div>
    )
  },
}

/**
 * 所有状态展示
 */
export const AllStatuses: Story = {
  render: () => (
    <div className="max-w-xl space-y-4">
      <ToolResult tool="pending_tool" status="pending" />
      <ToolResult tool="streaming_tool" status="streaming" />
      <ToolResult tool="ready_tool" status="ready" />
      <ToolResult tool="running_tool" status="running" />
      <ToolResult
        tool="approval_tool"
        status="approval-required"
        onApprove={() => {}}
        onDeny={() => {}}
      />
      <ToolResult tool="approved_tool" status="approved" />
      <ToolResult tool="denied_tool" status="denied" />
      <ToolResult tool="success_tool" status="success">
        <span className="text-sm">Operation completed successfully</span>
      </ToolResult>
      <ToolResult
        tool="error_tool"
        status="error"
        error="Connection timeout"
      />
    </div>
  ),
}

/**
 * 可折叠
 */
export const Collapsible: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false)

    return (
      <div className="max-w-xl">
        <ToolResult
          tool="fetch_data"
          status="success"
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        >
          <pre className="text-sm">
            {JSON.stringify(
              {
                data: {
                  users: 150,
                  orders: 89,
                  revenue: '$12,500',
                },
              },
              null,
              2
            )}
          </pre>
        </ToolResult>
      </div>
    )
  },
}
