import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/tailwind.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
})
