import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import customersReducer, {
  setSearch,
  setSortBy,
  setCurrentPage,
  fetchCustomers,
  fetchStats,
  selectCustomers,
  selectCustomersStatus,
  selectStatsStatus,
  selectSearch,
  selectSortBy,
  selectCurrentPage,
  selectPageSize,
  selectTotalPages,
  selectTotalEntries,
  selectQueryParams,
  selectStats,
} from './customersSlice'
import { dashboardReducer } from '@/features/dashboard'
import { productReducer } from '@/features/product'
import { incomeReducer } from '@/features/income'
import { promoteReducer } from '@/features/promote'
import { helpReducer } from '@/features/help'
import { profileReducer } from '@/features/profile'
import { customerService } from '@/services/customerService'
import type { Customer, Stats, PaginatedResponse } from '@/types/customer'

// Mock the customer service
vi.mock('@/services/customerService', () => ({
  customerService: {
    getCustomers: vi.fn(),
    getStats: vi.fn(),
  },
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

function createStore() {
  return configureStore({
    reducer: {
      customers: customersReducer,
      dashboard: dashboardReducer,
      product: productReducer,
      income: incomeReducer,
      promote: promoteReducer,
      help: helpReducer,
      profile: profileReducer,
    },
  })
}

describe('customersSlice', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState()

      expect(selectCustomers(state)).toEqual([])
      expect(selectCustomersStatus(state)).toBe('idle')
      expect(selectStatsStatus(state)).toBe('idle')
      expect(selectSearch(state)).toBe('')
      expect(selectSortBy(state)).toBe('newest')
      expect(selectCurrentPage(state)).toBe(1)
      expect(selectPageSize(state)).toBe(8)
      expect(selectTotalPages(state)).toBe(0)
      expect(selectTotalEntries(state)).toBe(0)
    })
  })

  describe('reducers', () => {
    describe('setSearch', () => {
      it('should update search term', () => {
        store.dispatch(setSearch('john'))
        expect(selectSearch(store.getState())).toBe('john')
      })

      it('should reset current page to 1 when search changes', () => {
        store.dispatch(setCurrentPage(5))
        expect(selectCurrentPage(store.getState())).toBe(5)

        store.dispatch(setSearch('test'))
        expect(selectCurrentPage(store.getState())).toBe(1)
      })
    })

    describe('setSortBy', () => {
      it('should update sort order to name', () => {
        store.dispatch(setSortBy('name'))
        expect(selectSortBy(store.getState())).toBe('name')
      })

      it('should update sort order to status', () => {
        store.dispatch(setSortBy('status'))
        expect(selectSortBy(store.getState())).toBe('status')
      })
    })

    describe('setCurrentPage', () => {
      it('should update current page', () => {
        store.dispatch(setCurrentPage(3))
        expect(selectCurrentPage(store.getState())).toBe(3)
      })
    })
  })

  describe('async thunks', () => {
    describe('fetchCustomers', () => {
      it('should set status to loading when pending', () => {
        vi.mocked(customerService.getCustomers).mockImplementation(
          () => new Promise(() => {})
        )

        store.dispatch(fetchCustomers({ page: 1, pageSize: 8 }))
        expect(selectCustomersStatus(store.getState())).toBe('loading')
      })

      it('should store customers and update pagination on success', async () => {
        vi.mocked(customerService.getCustomers).mockResolvedValue(mockPaginatedResponse)

        await store.dispatch(fetchCustomers({ page: 1, pageSize: 8 }))

        const state = store.getState()
        expect(selectCustomersStatus(state)).toBe('succeeded')
        expect(selectCustomers(state)).toEqual(mockCustomers)
        expect(selectTotalEntries(state)).toBe(100)
        expect(selectTotalPages(state)).toBe(13)
        expect(selectCurrentPage(state)).toBe(1)
      })

      it('should set error status on failure', async () => {
        vi.mocked(customerService.getCustomers).mockRejectedValue(
          new Error('Network error')
        )

        await store.dispatch(fetchCustomers({ page: 1, pageSize: 8 }))

        const state = store.getState()
        expect(selectCustomersStatus(state)).toBe('failed')
        expect(state.customers.customersError).toBe('Network error')
      })
    })

    describe('fetchStats', () => {
      it('should set status to loading when pending', () => {
        vi.mocked(customerService.getStats).mockImplementation(
          () => new Promise(() => {})
        )

        store.dispatch(fetchStats())
        expect(selectStatsStatus(store.getState())).toBe('loading')
      })

      it('should store stats on success', async () => {
        vi.mocked(customerService.getStats).mockResolvedValue(mockStats)

        await store.dispatch(fetchStats())

        const state = store.getState()
        expect(selectStatsStatus(state)).toBe('succeeded')
        expect(selectStats(state)).toEqual(mockStats)
      })

      it('should set error status on failure', async () => {
        vi.mocked(customerService.getStats).mockRejectedValue(
          new Error('Stats fetch failed')
        )

        await store.dispatch(fetchStats())

        const state = store.getState()
        expect(selectStatsStatus(state)).toBe('failed')
        expect(state.customers.statsError).toBe('Stats fetch failed')
      })
    })
  })

  describe('selectors', () => {
    describe('selectQueryParams', () => {
      it('should return current query params', () => {
        store.dispatch(setSearch('test'))
        store.dispatch(setSortBy('name'))
        store.dispatch(setCurrentPage(2))

        const params = selectQueryParams(store.getState())

        expect(params).toEqual({
          page: 2,
          pageSize: 8,
          search: 'test',
          sortBy: 'name',
        })
      })

      it('should return undefined for empty search', () => {
        const params = selectQueryParams(store.getState())
        expect(params.search).toBeUndefined()
      })
    })
  })
})
