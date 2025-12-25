import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { StreamText } from '@uix/agent'

const meta: Meta<typeof StreamText> = {
  title: 'Components/StreamText',
  component: StreamText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StreamText>

/**
 * 模拟打字效果
 */
export const TypingAnimation: Story = {
  args: {
    text: '你好！我是 Claude，一个 AI 助手。我可以帮助你完成各种任务，包括写作、编程、分析等。有什么我可以帮助你的吗？',
    speed: 30,
    cursor: true,
  },
}

/**
 * 不同速度
 */
export const DifferentSpeeds: Story = {
  render: () => {
    const text = '这是一段演示文本，展示不同的打字速度效果。'
    return (
      <div className="space-y-6 w-96">
        <div>
          <p className="text-xs text-gray-500 mb-2">慢速 (speed=80)</p>
          <StreamText text={text} speed={80} cursor />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">正常 (speed=30)</p>
          <StreamText text={text} speed={30} cursor />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">快速 (speed=10)</p>
          <StreamText text={text} speed={10} cursor />
        </div>
      </div>
    )
  },
}

/**
 * 自定义光标
 */
export const CustomCursor: Story = {
  render: () => (
    <div className="space-y-4">
      <StreamText text="默认光标 ▋" cursor cursorChar="▋" speed={50} />
      <StreamText text="下划线光标 _" cursor cursorChar="_" speed={50} />
      <StreamText text="竖线光标 |" cursor cursorChar="|" speed={50} />
    </div>
  ),
}

/**
 * 真实流式数据
 */
export const RealStream: Story = {
  render: function StreamDemo() {
    const [stream, setStream] = React.useState<AsyncIterable<string> | undefined>()
    const [isStreaming, setIsStreaming] = React.useState(false)

    const startStream = () => {
      const words = '这是一个模拟的流式响应。每个词会逐个出现，就像真正的 AI 响应一样。你可以看到文本是如何一点一点显示出来的。'.split('')

      async function* generateStream() {
        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 50))
          yield word
        }
      }

      setIsStreaming(true)
      setStream(generateStream())
    }

    return (
      <div className="w-96 space-y-4">
        <button
          onClick={startStream}
          disabled={isStreaming}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50"
        >
          {isStreaming ? '流式输出中...' : '开始流式输出'}
        </button>
        <div className="p-4 bg-gray-100 rounded-lg min-h-24">
          {stream ? (
            <StreamText
              stream={stream}
              cursor
              onComplete={() => setIsStreaming(false)}
            />
          ) : (
            <span className="text-gray-400">点击按钮开始演示</span>
          )}
        </div>
      </div>
    )
  },
}

/**
 * 无光标
 */
export const NoCursor: Story = {
  args: {
    text: '这段文字没有光标效果，适合用于已完成的消息。',
    cursor: false,
    speed: 20,
  },
}
