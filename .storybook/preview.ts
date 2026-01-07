import type { Preview } from '@storybook/react'
import '../src/styles/tokens.css'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FAFBFF' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
}

export default preview
