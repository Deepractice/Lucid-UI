import type { Meta, StoryObj } from '@storybook/react-vite'
import { SourceBlock } from '@uix/agent'

const meta: Meta<typeof SourceBlock> = {
  title: 'Components/SourceBlock',
  component: SourceBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SourceBlock>

/**
 * URL 来源
 *
 * 用于显示网页链接来源
 */
export const UrlSource: Story = {
  render: () => (
    <div className="max-w-xl">
      <SourceBlock
        source={{
          sourceId: 'src-1',
          sourceType: 'url',
          title: 'React Documentation - Thinking in React',
          url: 'https://react.dev/learn/thinking-in-react',
        }}
      />
    </div>
  ),
}

/**
 * 文档来源
 *
 * 用于显示上传的文档来源
 */
export const DocumentSource: Story = {
  render: () => (
    <div className="max-w-xl">
      <SourceBlock
        source={{
          sourceId: 'src-2',
          sourceType: 'document',
          title: 'Company Policy Guidelines',
          filename: 'company-policy-2024.pdf',
          mediaType: 'application/pdf',
        }}
      />
    </div>
  ),
}

/**
 * 带摘要的来源
 *
 * 显示来源的相关内容摘要
 */
export const WithExcerpt: Story = {
  render: () => (
    <div className="max-w-xl">
      <SourceBlock
        source={{
          sourceId: 'src-3',
          sourceType: 'document',
          title: 'Employee Handbook',
          filename: 'handbook.pdf',
          mediaType: 'application/pdf',
          excerpt:
            '所有员工必须在入职后 30 天内完成安全培训。培训内容包括数据保护、网络安全基础知识和公司安全政策。',
        }}
        showExcerpt
      />
    </div>
  ),
}

/**
 * 多个来源
 *
 * RAG 应用中常见的多来源引用场景
 */
export const MultipleSources: Story = {
  render: () => (
    <div className="max-w-xl space-y-3">
      <p className="text-sm text-gray-500">引用来源：</p>
      <SourceBlock
        source={{
          sourceId: 'src-1',
          sourceType: 'url',
          title: 'TypeScript Handbook',
          url: 'https://www.typescriptlang.org/docs/handbook/',
        }}
      />
      <SourceBlock
        source={{
          sourceId: 'src-2',
          sourceType: 'url',
          title: 'React TypeScript Cheatsheet',
          url: 'https://react-typescript-cheatsheet.netlify.app/',
        }}
      />
      <SourceBlock
        source={{
          sourceId: 'src-3',
          sourceType: 'document',
          title: 'Internal Coding Standards',
          filename: 'coding-standards.md',
          mediaType: 'text/markdown',
          excerpt: '使用 TypeScript 的严格模式，确保类型安全...',
        }}
        showExcerpt
      />
    </div>
  ),
}

/**
 * 不同文件类型
 */
export const DifferentFileTypes: Story = {
  render: () => (
    <div className="max-w-xl space-y-3">
      <SourceBlock
        source={{
          sourceId: 'doc-1',
          sourceType: 'document',
          title: 'Technical Report',
          filename: 'report.pdf',
          mediaType: 'application/pdf',
        }}
      />
      <SourceBlock
        source={{
          sourceId: 'doc-2',
          sourceType: 'document',
          title: 'Data Export',
          filename: 'data.xlsx',
          mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }}
      />
      <SourceBlock
        source={{
          sourceId: 'doc-3',
          sourceType: 'document',
          title: 'Meeting Notes',
          filename: 'notes.docx',
          mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }}
      />
      <SourceBlock
        source={{
          sourceId: 'doc-4',
          sourceType: 'document',
          title: 'Configuration',
          filename: 'config.json',
          mediaType: 'application/json',
        }}
      />
    </div>
  ),
}
