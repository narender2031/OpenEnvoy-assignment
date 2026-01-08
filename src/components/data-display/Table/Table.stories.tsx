import type { Meta, StoryObj } from '@storybook/react'
import { Table, Column } from './Table'
import { Badge } from '../../primitives'

interface SampleUser {
  id: string
  name: string
  company: string
  phone: string
  email: string
  country: string
  status: 'active' | 'inactive'
}

const sampleData: SampleUser[] = [
  { id: '1', name: 'Jane Cooper', company: 'Microsoft', phone: '(225) 555-0118', email: 'jane@microsoft.com', country: 'United States', status: 'active' },
  { id: '2', name: 'Floyd Miles', company: 'Yahoo', phone: '(205) 555-0100', email: 'floyd@yahoo.com', country: 'Kiribati', status: 'inactive' },
  { id: '3', name: 'Ronald Richards', company: 'Adobe', phone: '(302) 555-0107', email: 'ronald@adobe.com', country: 'Israel', status: 'inactive' },
  { id: '4', name: 'Marvin McKinney', company: 'Tesla', phone: '(252) 555-0126', email: 'marvin@tesla.com', country: 'Iran', status: 'active' },
]

const columns: Column<SampleUser>[] = [
  { key: 'name', header: 'Customer Name', render: (row) => row.name },
  { key: 'company', header: 'Company', render: (row) => row.company },
  { key: 'phone', header: 'Phone Number', render: (row) => row.phone },
  { key: 'email', header: 'Email', render: (row) => row.email },
  { key: 'country', header: 'Country', render: (row) => row.country },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'danger'}>
        {row.status}
      </Badge>
    ),
  },
]

const meta: Meta<typeof Table<SampleUser>> = {
  title: 'Data Display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table<SampleUser>>

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    rowKey: (row) => row.id,
  },
}

export const Empty: Story = {
  args: {
    columns,
    data: [],
    rowKey: (row) => row.id,
  },
}

export const SingleRow: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 1),
    rowKey: (row) => row.id,
  },
}
