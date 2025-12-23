import { lucidPreset } from '@uix/lucid-tokens/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/agent/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [lucidPreset],
}
