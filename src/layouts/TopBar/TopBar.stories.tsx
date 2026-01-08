import type { Meta, StoryObj } from '@storybook/react'
import { UserProvider } from '@/contexts'
import { TopBar } from './TopBar'

const meta: Meta<typeof TopBar> = {
  title: 'Layouts/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UserProvider>
        <Story />
      </UserProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCustomUser: Story = {
  decorators: [
    (Story) => (
      <UserProvider
        user={{
          name: 'Jane Smith',
          role: 'Admin',
          avatar: 'https://i.pravatar.cc/150?img=5',
        }}
      >
        <Story />
      </UserProvider>
    ),
  ],
}

export const InContainer: Story = {
  decorators: [
    (Story) => (
      <UserProvider>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Story />
        </div>
      </UserProvider>
    ),
  ],
}
