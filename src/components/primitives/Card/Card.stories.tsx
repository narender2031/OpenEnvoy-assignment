import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    elevation: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div style={{ width: 300 }}>
        <h3 style={{ margin: '0 0 8px' }}>Card Title</h3>
        <p style={{ margin: 0, color: '#757575' }}>
          This is a card component with default styling.
        </p>
      </div>
    ),
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: 'Card with small padding',
  },
}

export const MediumElevation: Story = {
  args: {
    elevation: 'md',
    children: (
      <div style={{ width: 300 }}>
        <h3 style={{ margin: '0 0 8px' }}>Elevated Card</h3>
        <p style={{ margin: 0, color: '#757575' }}>
          This card has medium elevation shadow.
        </p>
      </div>
    ),
  },
}

export const LargeElevation: Story = {
  args: {
    elevation: 'lg',
    children: (
      <div style={{ width: 300 }}>
        <h3 style={{ margin: '0 0 8px' }}>High Elevation Card</h3>
        <p style={{ margin: 0, color: '#757575' }}>
          This card has large elevation shadow for emphasis.
        </p>
      </div>
    ),
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <img
        src="https://via.placeholder.com/300x150"
        alt="Placeholder"
        style={{ display: 'block', borderRadius: 'inherit' }}
      />
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card elevation="none" style={{ width: 150 }}>No shadow</Card>
      <Card elevation="sm" style={{ width: 150 }}>Small shadow</Card>
      <Card elevation="md" style={{ width: 150 }}>Medium shadow</Card>
      <Card elevation="lg" style={{ width: 150 }}>Large shadow</Card>
    </div>
  ),
}
