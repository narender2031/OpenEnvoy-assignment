import type { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from './AvatarGroup'

const meta: Meta<typeof AvatarGroup> = {
  title: 'Data Display/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleAvatars = [
  'https://i.pravatar.cc/32?img=1',
  'https://i.pravatar.cc/32?img=2',
  'https://i.pravatar.cc/32?img=3',
  'https://i.pravatar.cc/32?img=4',
  'https://i.pravatar.cc/32?img=5',
  'https://i.pravatar.cc/32?img=6',
  'https://i.pravatar.cc/32?img=7',
]

export const Default: Story = {
  args: {
    avatars: sampleAvatars.slice(0, 5),
  },
}

export const WithOverflow: Story = {
  args: {
    avatars: sampleAvatars,
    max: 5,
  },
}

export const SmallMax: Story = {
  args: {
    avatars: sampleAvatars,
    max: 3,
  },
}

export const LargerSize: Story = {
  args: {
    avatars: sampleAvatars.slice(0, 4),
    size: 48,
  },
}

export const SingleAvatar: Story = {
  args: {
    avatars: sampleAvatars.slice(0, 1),
  },
}
