// Composable Avatar System (primary API)
export * from './Avatar'
export { AvatarGroup } from './AgentAvatarGroup'
export type { AvatarGroupProps } from './AgentAvatarGroup'

// Legacy/Convenience wrappers (keep for backward compatibility)
export * from './AgentAvatar'
export * from './MessageAvatar'

// Chat components
export * from './ChatBubble'
export * from './ChatInput'
export * from './ChatMessage'
export * from './MentionPopover'

// Streaming & AI status
export * from './StreamText'
export * from './ThinkingIndicator'

// Message components
export * from './ToolResult'
export * from './MessageList'
export * from './SourceBlock'
