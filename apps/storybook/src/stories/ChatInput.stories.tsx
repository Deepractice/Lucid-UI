import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within, fn } from 'storybook/test'
import * as React from 'react'
import {
  ChatInput,
  ChatInputTextarea,
  ChatInputToolbar,
  ChatInputTools,
  ChatInputButton,
  ChatInputSubmit,
} from '@uix/agent'

const meta: Meta<typeof ChatInput> = {
  title: 'Components/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatInput>

/**
 * 基础用法 - 组合模式
 */
export const Basic: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="max-w-2xl">
        <ChatInput onSubmit={() => alert(`发送: ${value}`)}>
          <ChatInputTextarea
            value={value}
            onChange={setValue}
            placeholder="输入消息..."
          />
          <ChatInputToolbar>
            <ChatInputSubmit />
          </ChatInputToolbar>
        </ChatInput>
      </div>
    )
  },
}

/**
 * 完整工具栏
 */
export const WithToolbar: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="max-w-2xl">
        <ChatInput onSubmit={() => alert(`发送: ${value}`)}>
          <ChatInputTextarea
            value={value}
            onChange={setValue}
            placeholder="Ask anything..."
          />
          <ChatInputToolbar>
            <ChatInputTools>
              <ChatInputButton onClick={() => alert('附件')}>
                📎
              </ChatInputButton>
              <ChatInputButton onClick={() => alert('图片')}>
                🖼️
              </ChatInputButton>
              <ChatInputButton onClick={() => alert('麦克风')}>
                🎤
              </ChatInputButton>
            </ChatInputTools>
            <ChatInputSubmit />
          </ChatInputToolbar>
        </ChatInput>
      </div>
    )
  },
}

/**
 * 不同状态
 */
export const DifferentStatus: Story = {
  render: () => {
    const [value, setValue] = React.useState('正在发送的消息...')

    return (
      <div className="max-w-2xl space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">空闲状态 (idle)</p>
          <ChatInput>
            <ChatInputTextarea
              value=""
              onChange={() => {}}
              placeholder="输入消息..."
            />
            <ChatInputToolbar>
              <ChatInputSubmit status="idle" />
            </ChatInputToolbar>
          </ChatInput>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">已提交 (submitted)</p>
          <ChatInput>
            <ChatInputTextarea
              value={value}
              onChange={setValue}
              placeholder="输入消息..."
            />
            <ChatInputToolbar>
              <ChatInputSubmit status="submitted" />
            </ChatInputToolbar>
          </ChatInput>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">流式响应中 (streaming)</p>
          <ChatInput>
            <ChatInputTextarea
              value={value}
              onChange={setValue}
              placeholder="输入消息..."
            />
            <ChatInputToolbar>
              <ChatInputSubmit status="streaming" />
            </ChatInputToolbar>
          </ChatInput>
        </div>
      </div>
    )
  },
}

/**
 * 自动调整高度
 *
 * 输入框会根据内容自动调整高度
 */
export const AutoResize: Story = {
  render: () => {
    const [value, setValue] = React.useState(
      '这是一段较长的文本，用于演示输入框的自动高度调整功能。\n\n当内容超过一行时，输入框会自动增加高度。\n\n你可以继续输入更多内容来测试这个功能。'
    )

    return (
      <div className="max-w-2xl">
        <ChatInput onSubmit={() => {}}>
          <ChatInputTextarea
            value={value}
            onChange={setValue}
            placeholder="输入消息..."
            minHeight={48}
            maxHeight={200}
          />
          <ChatInputToolbar>
            <ChatInputSubmit />
          </ChatInputToolbar>
        </ChatInput>
      </div>
    )
  },
}

/**
 * 禁用状态
 */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-2xl">
      <ChatInput>
        <ChatInputTextarea
          value=""
          onChange={() => {}}
          placeholder="输入已禁用..."
          disabled
        />
        <ChatInputToolbar>
          <ChatInputSubmit disabled />
        </ChatInputToolbar>
      </ChatInput>
    </div>
  ),
}

/**
 * 交互测试示例
 *
 * 演示如何使用 play 函数进行交互测试
 */
export const InteractionTest: Story = {
  args: {
    onSubmit: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = React.useState('')

    return (
      <div className="max-w-2xl">
        <ChatInput onSubmit={() => args.onSubmit?.(value)}>
          <ChatInputTextarea
            value={value}
            onChange={setValue}
            placeholder="输入消息进行测试..."
            data-testid="chat-textarea"
          />
          <ChatInputToolbar>
            <ChatInputSubmit data-testid="submit-button" />
          </ChatInputToolbar>
        </ChatInput>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // 找到文本框并输入内容
    const textarea = canvas.getByPlaceholderText('输入消息进行测试...')
    await userEvent.type(textarea, 'Hello, Storybook!')

    // 验证输入内容
    await expect(textarea).toHaveValue('Hello, Storybook!')

    // 点击提交按钮
    const submitButton = canvas.getByRole('button')
    await userEvent.click(submitButton)

    // 验证 onSubmit 被调用
    await expect(args.onSubmit).toHaveBeenCalledWith('Hello, Storybook!')
  },
}
