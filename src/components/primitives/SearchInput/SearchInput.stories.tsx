import type { Meta, StoryObj } from '@storybook/react'
import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Primitives/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Search',
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Search',
    defaultValue: 'John Doe',
  },
}

export const CustomWidth: Story = {
  args: {
    placeholder: 'Search customers...',
    width: 300,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Search',
    disabled: true,
  },
}
