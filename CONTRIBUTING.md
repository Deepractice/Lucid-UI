# Contributing to Lucid UI

Thanks for your interest in contributing! This guide will help you add new components or improve existing ones.

## 📋 Component Development Checklist

When creating a new component, ensure it meets these criteria:

### 1. **Accessibility First**
- [ ] Keyboard navigation support
- [ ] Screen reader compatible (ARIA labels)
- [ ] Focus management
- [ ] Proper semantic HTML

### 2. **Design Consistency**
- [ ] Uses design tokens from `@lucidui/tokens`
- [ ] Follows Lucid color philosophy (no AI purple)
- [ ] Consistent with existing component patterns
- [ ] Responsive by default

### 3. **Developer Experience**
- [ ] TypeScript types fully defined
- [ ] Props documented with JSDoc comments
- [ ] Examples in component file
- [ ] Composable via `asChild` when appropriate

### 4. **AI Readability**
- [ ] Clear inline documentation
- [ ] Usage examples in comments
- [ ] Design rationale explained
- [ ] Common patterns demonstrated

---

## 🏗️ Component Structure

```
packages/react/src/components/[component-name]/
├── [component-name].tsx    # Main component file
├── index.ts                 # Exports
└── README.md               # Component-specific docs (optional)
```

---

## 📝 Component Template

Use this template when creating a new component:

```tsx
/**
 * [ComponentName] Component
 *
 * [Brief description of what this component does]
 *
 * ## AI Usage Guide
 *
 * ### Basic Usage
 * ```tsx
 * import { ComponentName } from '@lucidui/react'
 *
 * <ComponentName>Content</ComponentName>
 * ```
 *
 * ### Design Principles
 * - [Principle 1]
 * - [Principle 2]
 *
 * ### Variants
 * - variant1: [description]
 * - variant2: [description]
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const componentVariants = cva(
  // Base styles
  'base-class-here',
  {
    variants: {
      variant: {
        default: 'default-classes',
        // Add more variants
      },
      size: {
        sm: 'small-size-classes',
        default: 'default-size-classes',
        lg: 'large-size-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>, // or appropriate HTML element
    VariantProps<typeof componentVariants> {
  /**
   * Prop description
   */
  propName?: string
}

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ComponentName.displayName = 'ComponentName'

export { ComponentName, componentVariants }
```

---

## 🎨 Design Token Usage

Always use design tokens, never hardcoded values:

### ✅ Good
```tsx
className="bg-primary-500 text-white border-border"
```

### ❌ Bad
```tsx
className="bg-[#0EA5E9] text-[#FFFFFF] border-[#E5E5E5]"
```

### Semantic Tokens
Prefer semantic tokens when available:
```tsx
className="bg-background text-foreground" // ✅
className="bg-white text-gray-900"        // ⚠️ Less semantic
```

---

## 🧪 Testing Your Component

1. **Build the package:**
```bash
cd packages/react
pnpm build
```

2. **Check TypeScript types:**
```bash
pnpm tsc --noEmit
```

3. **Test in Storybook** (once configured):
```bash
pnpm storybook
```

---

## 📚 Documentation Standards

### Component File Documentation

Every component should have:

1. **Header comment** explaining purpose
2. **AI Usage Guide** section with:
   - Basic usage examples
   - Design principles
   - Variant explanations
3. **JSDoc for all props**
4. **Inline comments** for complex logic

### Example:
```tsx
/**
 * Render as a child element instead of a div.
 * Useful for creating links that look like cards.
 *
 * @example
 * <Card asChild>
 *   <a href="/somewhere">Card link</a>
 * </Card>
 */
asChild?: boolean
```

---

## 🚀 Submitting Changes

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feat/add-card-component
   ```
3. **Make your changes**
4. **Commit with clear message:**
   ```bash
   git commit -m "feat: add Card component with variants"
   ```
5. **Push and create PR:**
   ```bash
   git push origin feat/add-card-component
   ```

### Commit Message Format
```
type(scope): subject

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

---

## 🎯 Component Priorities

We're building components in this order:

### Phase 1: Foundations
- [x] Button
- [ ] Input
- [ ] Card
- [ ] Badge

### Phase 2: AI-Specific
- [ ] ChatBubble
- [ ] StreamText
- [ ] ThinkingIndicator
- [ ] CodeBlock

### Phase 3: Advanced
- [ ] Dialog
- [ ] Dropdown
- [ ] Tabs
- [ ] Table

---

## 💡 Best Practices

### 1. Composition over Configuration
Prefer simple, composable components:
```tsx
// ✅ Good
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid
<Card title="Title" content="Content" />
```

### 2. Radix UI Integration
Use Radix primitives for complex interactions:
```tsx
import * as Dialog from '@radix-ui/react-dialog'

// Build on top of Radix, add Lucid styling
```

### 3. Avoid Over-Engineering
Keep it simple:
- Don't add variants "just in case"
- Don't create abstractions for single use cases
- Prefer explicit over clever

### 4. Mobile-First
Always design mobile-first with Tailwind:
```tsx
// ✅ Mobile-first
className="text-sm md:text-base lg:text-lg"

// ❌ Desktop-first
className="text-lg md:text-base sm:text-sm"
```

---

## 🤔 Questions?

- Open an issue: https://github.com/Deepractice/Lucid-UI/issues
- Discussion: https://github.com/Deepractice/Lucid-UI/discussions

---

Made with ❤️ by Deepractice
