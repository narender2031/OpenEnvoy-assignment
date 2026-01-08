import type { Meta, StoryObj } from '@storybook/react'
import { Users, UserCheck, Monitor } from 'lucide-react'
import { StatCard } from './StatCard'
import { TrendIndicator } from '../TrendIndicator'

const meta: Meta<typeof StatCard> = {
  title: 'Data Display/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const TotalCustomers: Story = {
  args: {
    icon: <Users size={32} />,
    iconBg: 'green',
    title: 'Total Customers',
    value: '5,423',
    footer: <TrendIndicator value={16} suffix="this month" />,
  },
}

export const Members: Story = {
  args: {
    icon: <UserCheck size={32} />,
    iconBg: 'purple',
    title: 'Members',
    value: '1,893',
    footer: <TrendIndicator value={-1} suffix="this month" />,
  },
}

export const ActiveNow: Story = {
  args: {
    icon: <Monitor size={32} />,
    iconBg: 'blue',
    title: 'Active Now',
    value: '189',
  },
}

export const WithoutFooter: Story = {
  args: {
    icon: <Users size={32} />,
    iconBg: 'green',
    title: 'Total Users',
    value: '12,345',
  },
}
