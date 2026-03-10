# UIX Skills

AI-readable design rules and component documentation, distributed as skills for Claude, Cursor, and other AI coding tools.

## Available Skills

### `lucid-ui` — Anti-AI-Purple Design System
**For everyone.** Professional UI design rules that prevent generic AI aesthetics. Works with any project, no UIX dependency needed.

- Concrete color palette (Rational Blue + Sentient Gold)
- Typography, spacing, and shadow systems
- Explicit anti-patterns: what NOT to generate
- Tailwind CSS utility patterns

### `uix-components` — UIX Component & Protocol Guide
**For UIX users.** Complete API reference for AgentChat, adapters, and the UIX IR type system.

- 3-line quick start patterns
- Full component props reference
- Adapter usage (Vercel AI SDK, AG-UI, A2UI)
- Common integration patterns (Next.js, custom rendering)

## Installation

### Claude Code
```bash
# Install from the skills marketplace (when available)
claude plugin install lucid-ui@deepractice-uix
claude plugin install uix-components@deepractice-uix
```

### Claude.ai
Upload the `SKILL.md` file from either skill directory via the Claude.ai interface.

### Cursor
Copy the skill content to your project's `.cursor/rules` file:
```bash
# For design rules
cp skills/lucid-ui/SKILL.md .cursor/rules/lucid-ui.md

# For UIX components
cp skills/uix-components/SKILL.md .cursor/rules/uix-components.md
```

### Windsurf
Copy to `.windsurfrules`:
```bash
cat skills/lucid-ui/SKILL.md >> .windsurfrules
```

### GitHub Copilot
Copy to `.github/copilot-instructions.md`:
```bash
cat skills/lucid-ui/SKILL.md >> .github/copilot-instructions.md
```

### Any AI Tool
The skill files are plain Markdown. Copy the content into whatever system prompt or context mechanism your AI tool supports.

## Why?

AI models default to purple gradients, neon colors, and generic layouts because that's what dominates their training data. These skills provide explicit design constraints that produce professional, distinctive UIs instead.

**Before (without skill):** Every AI-generated page looks the same — purple gradients, rounded-3xl cards, floating blobs.

**After (with Lucid UI skill):** Clean, intentional design with a professional dual-tone color system, restrained borders, and clear visual hierarchy.

## Links

- [UIX Repository](https://github.com/Deepractice/UIX)
- [Anthropic Skills Standard](https://github.com/anthropics/skills)
- [Agent Skills Specification](https://agentskills.io)
