import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
]

export const Default: Story = {
  args: {
    options: sortOptions,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Sort by:',
    options: sortOptions,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Sort by:',
    options: sortOptions,
    disabled: true,
  },
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Sort by:',
    options: sortOptions,
    defaultValue: 'name',
  },
}
