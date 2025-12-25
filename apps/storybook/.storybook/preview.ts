import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'Playground',
          'Foundation',
          ['Colors', 'Typography', 'Motion', 'Theming'],
          'Components',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#1a1a1a' },
        gray: { name: 'gray', value: '#f5f5f5' }
      }
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        wide: {
          name: 'Wide Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
}

export default preview
