import type { Config } from 'tailwindcss'
import { lucidPreset } from '@lucidui/tokens/tailwind'

export default {
  presets: [lucidPreset],
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config
