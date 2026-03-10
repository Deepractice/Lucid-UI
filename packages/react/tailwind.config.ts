import type { Config } from 'tailwindcss'
import { lucidPreset } from '@uix-ai/tokens/tailwind'

export default {
  presets: [lucidPreset],
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config
