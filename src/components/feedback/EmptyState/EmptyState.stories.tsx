import type { Meta, StoryObj } from '@storybook/react'
import { Search, Users } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { Button } from '../../primitives'

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filter to find what you are looking for.',
  },
}

export const NoCustomers: Story = {
  args: {
    icon: <Users size={48} />,
    title: 'No customers yet',
    description: 'Start by adding your first customer to the system.',
    action: <Button>Add Customer</Button>,
  },
}

export const SearchEmpty: Story = {
  args: {
    icon: <Search size={48} />,
    title: 'No matches found',
    description: 'We couldn\'t find any customers matching your search criteria.',
  },
}

export const Simple: Story = {
  args: {
    title: 'Nothing here',
  },
}
