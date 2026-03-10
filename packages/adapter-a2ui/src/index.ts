/**
 * @uix-ai/adapter-a2ui
 *
 * Adapter to convert Google A2UI protocol payloads to UIX Lucid IR format.
 *
 * A2UI is a declarative UI protocol where agents generate JSON payloads
 * describing UI components. Unlike AG-UI (event streaming), A2UI is
 * snapshot-based - the agent sends a complete UI description as JSON.
 *
 * This adapter converts A2UI's component tree into UIX LucidConversation
 * and LucidBlock structures for rendering with UIX components.
 *
 * @see https://github.com/google/A2UI
 *
 * @example
 * ```typescript
 * import { fromA2UIPayload, toA2UIPayload } from '@uix-ai/adapter-a2ui'
 *
 * // Convert A2UI payload to UIX Lucid IR
 * const conversation = fromA2UIPayload(a2uiPayload)
 *
 * // Convert UIX Lucid IR back to A2UI payload
 * const payload = toA2UIPayload(conversation)
 * ```
 */

import type {
  LucidConversation,
  LucidBlock,
  ContentStatus,
  BlockType,
  TextBlockContent,
  ImageBlockContent,
  ErrorBlockContent,
} from '@uix-ai/core'

// ============================================================================
// A2UI Protocol Types
// ============================================================================

/**
 * A2UI protocol version
 */
export type A2UIVersion = 'v0.8' | 'v0.9' | 'v0.10'

/**
 * A2UI display component types
 */
export type A2UIDisplayComponent = 'Text' | 'Image' | 'Icon' | 'Video' | 'AudioPlayer'

/**
 * A2UI container component types
 */
export type A2UIContainerComponent = 'Row' | 'Column' | 'Card' | 'List' | 'Tabs' | 'Modal'

/**
 * A2UI input component types
 */
export type A2UIInputComponent = 'TextField' | 'CheckBox' | 'DateTimeInput' | 'ChoicePicker' | 'Slider'

/**
 * A2UI interactive component types
 */
export type A2UIInteractiveComponent = 'Button' | 'Divider'

/**
 * Union of all A2UI component type names
 */
export type A2UIComponentType =
  | A2UIDisplayComponent
  | A2UIContainerComponent
  | A2UIInputComponent
  | A2UIInteractiveComponent

// ============================================================================
// A2UI Dynamic Value Types
// ============================================================================

/**
 * A2UI dynamic string - either a literal or a data-binding reference
 */
export type A2UIDynamicString = string | { path: string } | { call: string; args: Record<string, unknown> }

/**
 * A2UI dynamic number
 */
export type A2UIDynamicNumber = number | { path: string } | { call: string; args: Record<string, unknown> }

/**
 * A2UI dynamic boolean
 */
export type A2UIDynamicBoolean = boolean | { path: string } | { call: string; args: Record<string, unknown> }

/**
 * A2UI child list - either an array of IDs or a template binding
 */
export type A2UIChildList = string[] | { path: string; componentId: string }

// ============================================================================
// A2UI Validation & Actions
// ============================================================================

/**
 * A2UI validation check
 */
export interface A2UICheck {
  call: string
  args: Record<string, unknown>
  message: string
}

/**
 * A2UI event action
 */
export interface A2UIEventAction {
  name: string
  context?: Record<string, unknown>
}

/**
 * A2UI function call action
 */
export interface A2UIFunctionCallAction {
  name: string
  args?: Record<string, unknown>
}

/**
 * A2UI action - either an event or a function call
 */
export interface A2UIAction {
  event?: A2UIEventAction
  functionCall?: A2UIFunctionCallAction
}

// ============================================================================
// A2UI Component Definition
// ============================================================================

/**
 * A2UI component object in the flat adjacency list
 *
 * Components are stored as a flat array and reference each other by ID.
 * The tree structure is built via `children` and `child` properties.
 */
export interface A2UIComponent {
  /** Unique identifier for this component */
  id: string
  /** Component type name */
  component: A2UIComponentType | string
  /** Child component IDs (for container components like Row, Column, List) */
  children?: A2UIChildList
  /** Single child component ID (for Card, Modal) */
  child?: string
  /** Text content (for Text, Button) */
  text?: A2UIDynamicString
  /** Label (for input components) */
  label?: A2UIDynamicString
  /** URL (for Image, Video, AudioPlayer) */
  url?: A2UIDynamicString
  /** Icon name (for Icon) */
  name?: A2UIDynamicString
  /** Value binding (for input components) */
  value?: A2UIDynamicString | A2UIDynamicNumber | A2UIDynamicBoolean
  /** Action on interaction (for Button) */
  action?: A2UIAction
  /** Validation checks (for TextField, Button) */
  checks?: A2UICheck[]
  /** Button variant */
  variant?: string
  /** Layout alignment */
  justify?: string
  /** Layout cross-axis alignment */
  align?: string
  /** Axis for Divider */
  axis?: string
  /** Tabs configuration */
  tabs?: Array<{ title: A2UIDynamicString; child: string }>
  /** Slider min value */
  min?: number
  /** Slider max value */
  max?: number
  /** Choice picker options */
  options?: Array<{ label: A2UIDynamicString; value: string }>
  /** Any additional properties from custom or extended components */
  [key: string]: unknown
}

// ============================================================================
// A2UI Theme
// ============================================================================

/**
 * A2UI surface theme configuration
 */
export interface A2UITheme {
  primaryColor?: string
  [key: string]: unknown
}

// ============================================================================
// A2UI Message Types
// ============================================================================

/**
 * createSurface message - initializes a new UI surface
 */
export interface A2UICreateSurface {
  surfaceId: string
  catalogId?: string
  theme?: A2UITheme
  sendDataModel?: boolean
}

/**
 * updateComponents message - adds or updates UI components
 */
export interface A2UIUpdateComponents {
  surfaceId: string
  components: A2UIComponent[]
}

/**
 * updateDataModel message - modifies data model via JSON pointer
 */
export interface A2UIUpdateDataModel {
  surfaceId: string
  path?: string
  value?: unknown
}

/**
 * deleteSurface message - removes a surface
 */
export interface A2UIDeleteSurface {
  surfaceId: string
}

// ============================================================================
// A2UI Payload (Top-Level Message)
// ============================================================================

/**
 * Top-level A2UI message payload.
 *
 * Each message contains exactly one of the four message types:
 * - `createSurface`: Initialize a new UI surface
 * - `updateComponents`: Add or update components on a surface
 * - `updateDataModel`: Modify the surface data model
 * - `deleteSurface`: Remove a surface
 */
export interface A2UIPayload {
  /** A2UI protocol version */
  version: string
  /** Create a new surface */
  createSurface?: A2UICreateSurface
  /** Update components on a surface */
  updateComponents?: A2UIUpdateComponents
  /** Update the data model */
  updateDataModel?: A2UIUpdateDataModel
  /** Delete a surface */
  deleteSurface?: A2UIDeleteSurface
}

// ============================================================================
// Conversion Options
// ============================================================================

/**
 * Options for A2UI to Lucid IR conversion
 */
export interface A2UIConversionOptions {
  /**
   * Custom ID generator for conversations
   * @default () => `a2ui-conv-${surfaceId}`
   */
  generateConversationId?: (surfaceId: string) => string

  /**
   * Custom ID generator for blocks
   * @default () => `a2ui-block-${componentId}`
   */
  generateBlockId?: (componentId: string) => string

  /**
   * Resolve dynamic string values against a data model.
   * If not provided, dynamic bindings are serialized as-is.
   */
  resolveValue?: (dynamic: A2UIDynamicString | A2UIDynamicNumber | A2UIDynamicBoolean) => string
}

// ============================================================================
// Internal Helpers
// ============================================================================

let blockIdCounter = 0

function defaultConversationId(surfaceId: string): string {
  return `a2ui-conv-${surfaceId}`
}

function defaultBlockId(componentId: string): string {
  return `a2ui-block-${componentId}-${++blockIdCounter}`
}

/**
 * Resolve a dynamic value to a plain string.
 * Literal values are returned directly; bindings are serialized for display.
 */
function resolveDynamic(
  value: A2UIDynamicString | A2UIDynamicNumber | A2UIDynamicBoolean | undefined,
  resolver?: (v: A2UIDynamicString | A2UIDynamicNumber | A2UIDynamicBoolean) => string
): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (resolver) return resolver(value)
  // Fallback: serialize binding as a readable placeholder
  if ('path' in value) return `{{${value.path}}}`
  if ('call' in value) return `{{${value.call}(...)}}`
  return JSON.stringify(value)
}

/**
 * Build a lookup map from component array
 */
function buildComponentMap(components: A2UIComponent[]): Map<string, A2UIComponent> {
  const map = new Map<string, A2UIComponent>()
  for (const comp of components) {
    map.set(comp.id, comp)
  }
  return map
}

/**
 * Find the root component (id === 'root') in the component list
 */
function findRoot(components: A2UIComponent[]): A2UIComponent | undefined {
  return components.find((c) => c.id === 'root')
}

/**
 * Get direct children IDs from a component
 */
function getChildIds(component: A2UIComponent): string[] {
  if (component.child) return [component.child]
  if (Array.isArray(component.children)) return component.children
  // Template children (data-bound) cannot be resolved without a data model
  return []
}

// ============================================================================
// A2UI Component to LucidBlock Mapping
// ============================================================================

/**
 * Map an A2UI component type to a UIX BlockType.
 *
 * Direct mappings:
 * - Text -> 'text'
 * - Image -> 'image'
 *
 * Components without a direct mapping are represented as 'text' blocks
 * with a structured description of the component.
 */
function mapComponentType(componentType: string): BlockType {
  switch (componentType) {
    case 'Text':
      return 'text'
    case 'Image':
      return 'image'
    default:
      return 'text'
  }
}

/**
 * Convert a single A2UI component to a LucidBlock.
 *
 * For components that map directly to UIX block types (Text, Image),
 * the content is converted to the matching block content type.
 *
 * For other components (Button, TextField, Card, etc.), a text block
 * is produced with a structured markdown representation.
 */
function componentToBlock(
  component: A2UIComponent,
  options: A2UIConversionOptions = {}
): LucidBlock {
  const genBlockId = options.generateBlockId ?? defaultBlockId
  const blockId = genBlockId(component.id)
  const resolve = (v: A2UIDynamicString | A2UIDynamicNumber | A2UIDynamicBoolean | undefined) =>
    resolveDynamic(v, options.resolveValue)

  switch (component.component) {
    case 'Text':
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: resolve(component.text),
        } as TextBlockContent,
      }

    case 'Image':
      return {
        id: blockId,
        type: 'image',
        status: 'completed' as ContentStatus,
        content: {
          url: resolve(component.url),
          alt: component.id,
        } as ImageBlockContent,
      }

    case 'Button': {
      const label = resolve(component.text) || component.id
      const actionDesc = component.action?.event
        ? `action:${component.action.event.name}`
        : component.action?.functionCall
          ? `call:${component.action.functionCall.name}`
          : ''
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[Button: ${label}]${actionDesc ? ` (${actionDesc})` : ''}`,
        } as TextBlockContent,
      }
    }

    case 'TextField': {
      const label = resolve(component.label) || component.id
      const val = resolve(component.value)
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[TextField: ${label}]${val ? ` value="${val}"` : ''}`,
        } as TextBlockContent,
      }
    }

    case 'CheckBox': {
      const label = resolve(component.label) || component.id
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[CheckBox: ${label}]`,
        } as TextBlockContent,
      }
    }

    case 'DateTimeInput': {
      const label = resolve(component.label) || component.id
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[DateTimeInput: ${label}]`,
        } as TextBlockContent,
      }
    }

    case 'ChoicePicker': {
      const label = resolve(component.label) || component.id
      const optionLabels = component.options
        ? component.options.map((o) => resolve(o.label)).join(', ')
        : ''
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[ChoicePicker: ${label}]${optionLabels ? ` options=[${optionLabels}]` : ''}`,
        } as TextBlockContent,
      }
    }

    case 'Slider': {
      const label = resolve(component.label) || component.id
      const min = component.min ?? 0
      const max = component.max ?? 100
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[Slider: ${label}] range=[${min}, ${max}]`,
        } as TextBlockContent,
      }
    }

    case 'Video':
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[Video: ${resolve(component.url)}]`,
        } as TextBlockContent,
      }

    case 'AudioPlayer':
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[Audio: ${resolve(component.url)}]`,
        } as TextBlockContent,
      }

    case 'Icon':
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[Icon: ${resolve(component.name)}]`,
        } as TextBlockContent,
      }

    case 'Divider':
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: '---',
        } as TextBlockContent,
      }

    // Container components (Row, Column, Card, List, Tabs, Modal)
    // are flattened - their children are emitted as separate blocks.
    // A container itself does not produce a block.
    // This default handles any unknown/custom component types.
    default:
      return {
        id: blockId,
        type: 'text',
        status: 'completed' as ContentStatus,
        content: {
          text: `[${component.component}: ${component.id}]`,
        } as TextBlockContent,
      }
  }
}

/**
 * Container component types whose children should be traversed
 * but which do not produce blocks themselves.
 */
const CONTAINER_TYPES = new Set(['Row', 'Column', 'Card', 'List', 'Tabs', 'Modal'])

/**
 * Recursively flatten the A2UI component tree into LucidBlocks.
 *
 * Container components are traversed but not emitted as blocks.
 * Leaf/display/input/interactive components are converted to blocks.
 */
function flattenComponents(
  rootId: string,
  componentMap: Map<string, A2UIComponent>,
  options: A2UIConversionOptions = {},
  visited: Set<string> = new Set()
): LucidBlock[] {
  if (visited.has(rootId)) return []
  visited.add(rootId)

  const component = componentMap.get(rootId)
  if (!component) return []

  const isContainer = CONTAINER_TYPES.has(component.component)
  const childIds = getChildIds(component)

  // For Tabs, children are defined differently
  if (component.component === 'Tabs' && component.tabs) {
    const blocks: LucidBlock[] = []
    for (const tab of component.tabs) {
      const title = resolveDynamic(tab.title, options.resolveValue)
      const genBlockId = options.generateBlockId ?? defaultBlockId
      blocks.push({
        id: genBlockId(`${component.id}-tab-${tab.child}`),
        type: 'text',
        status: 'completed' as ContentStatus,
        content: { text: `**${title}**` } as TextBlockContent,
      })
      blocks.push(...flattenComponents(tab.child, componentMap, options, visited))
    }
    return blocks
  }

  if (isContainer) {
    // Recurse into children, skip the container itself
    const blocks: LucidBlock[] = []
    for (const childId of childIds) {
      blocks.push(...flattenComponents(childId, componentMap, options, visited))
    }
    return blocks
  }

  // Leaf component - convert to block, then also traverse any children
  const blocks: LucidBlock[] = [componentToBlock(component, options)]
  for (const childId of childIds) {
    blocks.push(...flattenComponents(childId, componentMap, options, visited))
  }
  return blocks
}

// ============================================================================
// Public Conversion Functions
// ============================================================================

/**
 * Convert an A2UI payload (containing updateComponents) to a UIX LucidConversation.
 *
 * The A2UI component tree is flattened into a linear sequence of LucidBlocks:
 * - `Text` components become text blocks
 * - `Image` components become image blocks
 * - Input and interactive components become text blocks with structured descriptions
 * - Container components (Row, Column, Card, etc.) are traversed but not emitted
 *
 * @param payload - An A2UI payload message (must contain updateComponents)
 * @param options - Conversion options
 * @returns A LucidConversation representing the A2UI surface, or null if the payload
 *          does not contain updateComponents
 *
 * @example
 * ```typescript
 * const payload: A2UIPayload = {
 *   version: 'v0.10',
 *   updateComponents: {
 *     surfaceId: 'form_1',
 *     components: [
 *       { id: 'root', component: 'Column', children: ['title', 'img'] },
 *       { id: 'title', component: 'Text', text: 'Hello World' },
 *       { id: 'img', component: 'Image', url: 'https://example.com/photo.png' }
 *     ]
 *   }
 * }
 *
 * const conversation = fromA2UIPayload(payload)
 * // conversation.blocks[0] -> text block "Hello World"
 * // conversation.blocks[1] -> image block
 * ```
 */
export function fromA2UIPayload(
  payload: A2UIPayload,
  options: A2UIConversionOptions = {}
): LucidConversation | null {
  const update = payload.updateComponents
  if (!update) return null

  const { surfaceId, components } = update
  const genConvId = options.generateConversationId ?? defaultConversationId

  const componentMap = buildComponentMap(components)
  const root = findRoot(components)

  let blocks: LucidBlock[]
  if (root) {
    blocks = flattenComponents(root.id, componentMap, options)
  } else {
    // No root found - convert all components linearly
    blocks = components
      .filter((c) => !CONTAINER_TYPES.has(c.component))
      .map((c) => componentToBlock(c, options))
  }

  return {
    id: genConvId(surfaceId),
    role: 'assistant',
    status: 'completed',
    blocks,
    timestamp: Date.now(),
  }
}

/**
 * Convert multiple A2UI payloads (a stream of messages) to LucidConversations.
 *
 * Processes an array of A2UI messages and returns one LucidConversation per
 * updateComponents message encountered.
 *
 * @param payloads - Array of A2UI payload messages
 * @param options - Conversion options
 * @returns Array of LucidConversations
 *
 * @example
 * ```typescript
 * const messages: A2UIPayload[] = [
 *   { version: 'v0.10', createSurface: { surfaceId: 's1', catalogId: '...' } },
 *   { version: 'v0.10', updateComponents: { surfaceId: 's1', components: [...] } },
 * ]
 *
 * const conversations = fromA2UIPayloads(messages)
 * ```
 */
export function fromA2UIPayloads(
  payloads: A2UIPayload[],
  options: A2UIConversionOptions = {}
): LucidConversation[] {
  const results: LucidConversation[] = []
  for (const payload of payloads) {
    const conv = fromA2UIPayload(payload, options)
    if (conv) results.push(conv)
  }
  return results
}

/**
 * Convert a UIX LucidConversation back to an A2UI payload.
 *
 * Maps LucidBlocks back to A2UI components wrapped in a Column layout:
 * - text blocks -> Text components
 * - image blocks -> Image components
 * - Other block types -> Text components with type annotation
 *
 * @param conversation - A UIX LucidConversation
 * @param surfaceId - Optional surface ID (defaults to conversation.id)
 * @param version - A2UI protocol version (defaults to 'v0.10')
 * @returns An A2UI payload with updateComponents
 *
 * @example
 * ```typescript
 * const conversation: LucidConversation = {
 *   id: 'conv-1',
 *   role: 'assistant',
 *   status: 'completed',
 *   blocks: [
 *     { id: 'b1', type: 'text', status: 'completed', content: { text: 'Hello' } },
 *     { id: 'b2', type: 'image', status: 'completed', content: { url: 'https://...' } }
 *   ],
 *   timestamp: Date.now()
 * }
 *
 * const payload = toA2UIPayload(conversation)
 * ```
 */
export function toA2UIPayload(
  conversation: LucidConversation,
  surfaceId?: string,
  version: string = 'v0.10'
): A2UIPayload {
  const sid = surfaceId ?? conversation.id
  const components: A2UIComponent[] = []
  const childIds: string[] = []

  for (const block of conversation.blocks) {
    const compId = `comp-${block.id}`
    childIds.push(compId)

    switch (block.type) {
      case 'text': {
        const content = block.content as TextBlockContent
        components.push({
          id: compId,
          component: 'Text',
          text: content.text,
        })
        break
      }

      case 'image': {
        const content = block.content as ImageBlockContent
        components.push({
          id: compId,
          component: 'Image',
          url: content.url,
        })
        break
      }

      case 'thinking': {
        const content = block.content as { reasoning: string }
        components.push({
          id: compId,
          component: 'Text',
          text: `*Thinking: ${content.reasoning}*`,
        })
        break
      }

      case 'tool': {
        const content = block.content as { name: string; input: unknown; output?: unknown; status: string }
        const parts = [`**Tool: ${content.name}**`]
        if (content.input) parts.push(`Input: \`${JSON.stringify(content.input)}\``)
        if (content.output) parts.push(`Output: \`${JSON.stringify(content.output)}\``)
        parts.push(`Status: ${content.status}`)
        components.push({
          id: compId,
          component: 'Text',
          text: parts.join('\n\n'),
        })
        break
      }

      case 'error': {
        const content = block.content as ErrorBlockContent
        components.push({
          id: compId,
          component: 'Text',
          text: `**Error [${content.code}]:** ${content.message}`,
        })
        break
      }

      case 'file': {
        const content = block.content as { name: string; url: string; type: string }
        components.push({
          id: compId,
          component: 'Text',
          text: `[File: ${content.name}](${content.url})`,
        })
        break
      }

      case 'source': {
        const content = block.content as { title: string; url?: string; excerpt?: string }
        const text = content.url
          ? `[Source: ${content.title}](${content.url})`
          : `Source: ${content.title}`
        components.push({
          id: compId,
          component: 'Text',
          text: content.excerpt ? `${text}\n\n> ${content.excerpt}` : text,
        })
        break
      }

      default: {
        components.push({
          id: compId,
          component: 'Text',
          text: `[${block.type}: ${block.id}]`,
        })
        break
      }
    }
  }

  // Wrap all components in a root Column
  components.unshift({
    id: 'root',
    component: 'Column',
    children: childIds,
  })

  return {
    version,
    updateComponents: {
      surfaceId: sid,
      components,
    },
  }
}
