import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomersPage } from './CustomersPage'
import { customerService } from '@/services/customerService'
import { renderWithProviders } from '@/test/utils'
import type { Customer, Stats, PaginatedResponse } from '@/types/customer'

// Mock the customer service
vi.mock('@/services/customerService', () => ({
  customerService: {
    getCustomers: vi.fn(),
    getStats: vi.fn(),
  },
}))

// Mock UserContext
vi.mock('@/contexts', () => ({
  useUser: () => ({
    name: 'Test User',
    role: 'Admin',
    avatar: 'test-avatar.jpg',
  }),
}))

const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Doe',
    company: 'Acme Inc',
    phone: '(555) 123-4567',
    email: 'john@acme.com',
    country: 'United States',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'cust-2',
    name: 'Jane Smith',
    company: 'Tech Corp',
    phone: '(555) 987-6543',
    email: 'jane@techcorp.com',
    country: 'Canada',
    status: 'inactive',
    createdAt: new Date('2024-02-20'),
  },
]

const mockPaginatedResponse: PaginatedResponse<Customer> = {
  data: mockCustomers,
  total: 100,
  page: 1,
  pageSize: 8,
  totalPages: 13,
}

const mockStats: Stats = {
  totalCustomers: 5423,
  totalCustomersTrend: 16,
  members: 1893,
  membersTrend: -1,
  activeNow: 189,
  activeNowAvatars: ['avatar1.jpg', 'avatar2.jpg'],
}

describe('CustomersPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(customerService.getCustomers).mockResolvedValue(mockPaginatedResponse)
    vi.mocked(customerService.getStats).mockResolvedValue(mockStats)
  })

  it('renders loading state initially', () => {
    // Make the promise never resolve to keep loading state
    vi.mocked(customerService.getCustomers).mockImplementation(() => new Promise(() => {}))

    renderWithProviders(<CustomersPage />)

    expect(screen.getByText('Loading customers...')).toBeInTheDocument()
  })

  it('renders customers after loading', async () => {
    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Acme Inc')).toBeInTheDocument()
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
  })

  it('renders stats cards', async () => {
    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('5,423')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Active Now')).toBeInTheDocument()
  })

  it('shows entry count in footer', async () => {
    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText(/Showing data/)).toBeInTheDocument()
      expect(screen.getByText(/100 entries/)).toBeInTheDocument()
    })
  })

  it('filters customers by search', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search')
    await user.type(searchInput, 'john')

    // The service should be called with search param
    await waitFor(() => {
      expect(customerService.getCustomers).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'john',
          page: 1,
        })
      )
    })
  })

  it('changes sort order', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Open the dropdown
    const sortDropdown = screen.getByRole('button', { name: /sort/i })
    await user.click(sortDropdown)

    // Select "Name" option
    const nameOption = screen.getByRole('option', { name: /name/i })
    await user.click(nameOption)

    await waitFor(() => {
      expect(customerService.getCustomers).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'name',
        })
      )
    })
  })

  it('displays error state when fetch fails', async () => {
    vi.mocked(customerService.getCustomers).mockRejectedValue(
      new Error('Network error')
    )

    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('retries fetch on retry button click', async () => {
    const user = userEvent.setup()

    vi.mocked(customerService.getCustomers).mockRejectedValueOnce(
      new Error('Network error')
    )

    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    // Reset mock to succeed on retry
    vi.mocked(customerService.getCustomers).mockResolvedValue(mockPaginatedResponse)

    await user.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('displays empty state when no customers', async () => {
    vi.mocked(customerService.getCustomers).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 8,
      totalPages: 0,
    })

    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('No customers found')).toBeInTheDocument()
    })
  })

  it('renders customer status badges correctly', async () => {
    renderWithProviders(<CustomersPage />)

    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument()
    })

    expect(screen.getByText('inactive')).toBeInTheDocument()
  })
})
