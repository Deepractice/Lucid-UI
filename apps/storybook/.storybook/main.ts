import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import type { Plugin } from 'vite'

const require = createRequire(import.meta.url)

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

// Plugin to fix pnpm file:// path resolution issue
function pnpmFileProtocolFix(): Plugin {
  return {
    name: 'pnpm-file-protocol-fix',
    enforce: 'pre',
    resolveId(source) {
      if (source.startsWith('file://')) {
        return fileURLToPath(source)
      }
      return null
    },
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite') as '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins || []
    config.plugins.push(pnpmFileProtocolFix())
    // Set base path for deployment
    config.base = '/storybook/'
    return config
  },
}

export default config
