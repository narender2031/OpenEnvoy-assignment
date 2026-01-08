import type { Meta, StoryObj } from '@storybook/react'
import { TrendIndicator } from './TrendIndicator'

const meta: Meta<typeof TrendIndicator> = {
  title: 'Data Display/TrendIndicator',
  component: TrendIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Positive: Story = {
  args: {
    value: 16,
    suffix: 'this month',
  },
}

export const Negative: Story = {
  args: {
    value: -1,
    suffix: 'this month',
  },
}

export const NoSuffix: Story = {
  args: {
    value: 25,
  },
}

export const Zero: Story = {
  args: {
    value: 0,
    suffix: 'no change',
  },
}
