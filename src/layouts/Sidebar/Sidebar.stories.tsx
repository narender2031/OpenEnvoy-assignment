import type { Meta, StoryObj } from '@storybook/react'
import { UserProvider } from '@/contexts'
import { Sidebar } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Layouts/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UserProvider>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
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
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </UserProvider>
    ),
  ],
}

export const DarkBackground: Story = {
  decorators: [
    (Story) => (
      <UserProvider>
        <div style={{ height: '100vh', backgroundColor: '#1a1a1a' }}>
          <Story />
        </div>
      </UserProvider>
    ),
  ],
}
