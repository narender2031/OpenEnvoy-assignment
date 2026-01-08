import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table, Column } from './Table'

interface TestData {
  id: string
  name: string
  email: string
}

const testData: TestData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com' },
]

const columns: Column<TestData>[] = [
  { key: 'name', header: 'Name', render: (row) => row.name },
  { key: 'email', header: 'Email', render: (row) => row.email },
]

describe('Table', () => {
  it('renders column headers', () => {
    render(
      <Table
        columns={columns}
        data={testData}
        rowKey={(row) => row.id}
      />
    )

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(
      <Table
        columns={columns}
        data={testData}
        rowKey={(row) => row.id}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('renders correct number of rows', () => {
    render(
      <Table
        columns={columns}
        data={testData}
        rowKey={(row) => row.id}
      />
    )

    const rows = screen.getAllByRole('row')
    // +1 for header row
    expect(rows).toHaveLength(testData.length + 1)
  })

  it('renders empty table when no data', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        rowKey={(row) => row.id}
      />
    )

    const rows = screen.getAllByRole('row')
    // Only header row
    expect(rows).toHaveLength(1)
  })

  it('applies custom className', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={testData}
        rowKey={(row) => row.id}
        className="custom-class"
      />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('supports custom render functions', () => {
    const columnsWithCustomRender: Column<TestData>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (row) => <strong data-testid="custom-render">{row.name}</strong>,
      },
    ]

    render(
      <Table
        columns={columnsWithCustomRender}
        data={[testData[0]]}
        rowKey={(row) => row.id}
      />
    )

    expect(screen.getByTestId('custom-render')).toBeInTheDocument()
    expect(screen.getByTestId('custom-render').tagName).toBe('STRONG')
  })

  it('has accessible table role', () => {
    render(
      <Table
        columns={columns}
        data={testData}
        rowKey={(row) => row.id}
      />
    )

    // Table should use native table role (not grid) for non-interactive tables
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
