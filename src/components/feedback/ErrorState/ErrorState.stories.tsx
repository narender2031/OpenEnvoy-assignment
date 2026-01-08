import type { Meta, StoryObj } from '@storybook/react'
import { WifiOff } from 'lucide-react'
import { ErrorState } from './ErrorState'

const meta: Meta<typeof ErrorState> = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Failed to load customers. Please try again.',
  },
}

export const WithRetry: Story = {
  args: {
    message: 'Failed to load customers. Please try again.',
    onRetry: () => alert('Retrying...'),
  },
}

export const NetworkError: Story = {
  args: {
    icon: <WifiOff size={48} />,
    title: 'No connection',
    message: 'Please check your internet connection and try again.',
    onRetry: () => alert('Retrying...'),
    retryText: 'Reconnect',
  },
}

export const CustomTitle: Story = {
  args: {
    title: 'Access denied',
    message: 'You don\'t have permission to view this resource.',
  },
}
