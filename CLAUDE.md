# UIX Project Rules

This is the UIX monorepo — an AI-to-UI Intermediate Representation (IR) protocol layer.

## Design System: Lucid UI

When generating any UI code in this project, follow the Lucid design system:

### Colors
- **Primary**: Rational Blue `#0284c7` (NOT purple, NOT indigo)
- **Secondary**: Sentient Gold `#f59e0b`
- **Background**: White `#FFFFFF` (light) / Gray-900 `#171717` (dark)
- **Text**: Gray-700 `#404040` on white, Gray-300 on dark

### Forbidden
- Purple/violet/fuchsia gradients
- Neon colors
- Rainbow gradients
- `rounded-3xl` on everything
- Decorative background blobs
- Gradient buttons

### Preferred Patterns
- Solid color buttons with `rounded-md`
- `border border-gray-200` over heavy shadows
- Inter font family
- 4px grid spacing
- Subtle animations (150-300ms)

## Architecture
- Monorepo with pnpm workspaces
- Packages: core, agent, lucid-tokens, lucid-react, stream, adapter-vercel, adapter-agui, adapter-a2ui
- Build: tsup (ESM only), Vite for apps
- Test: vitest
- Styling: Tailwind CSS

## Git
- Author: `deepracticexc <ax6101@gmail.com>`
- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`

## Full Design Rules
See `skills/lucid-ui/SKILL.md` for the complete design system specification.
