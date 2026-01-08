import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'danger'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: {
    variant: 'success',
    children: 'Active',
  },
}

export const Inactive: Story = {
  args: {
    variant: 'danger',
    children: 'Inactive',
  },
}
