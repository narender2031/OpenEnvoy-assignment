import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 40,
  },
}

export const MiddlePage: Story = {
  args: {
    currentPage: 20,
    totalPages: 40,
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 40,
    totalPages: 40,
  },
}

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 5,
  },
}

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
}

// Interactive story
const InteractivePagination = () => {
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={40}
      onPageChange={setCurrentPage}
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractivePagination />,
}
