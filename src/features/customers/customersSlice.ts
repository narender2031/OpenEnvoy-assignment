import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Customer, Stats, SortBy, CustomersQueryParams, PaginatedResponse } from '@/types/customer'
import { customerService } from '@/services/customerService'
import type { RootState } from '@/store/store'

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface CustomersState {
  customers: Customer[]
  total: number
  totalPages: number
  stats: Stats | null
  customersStatus: LoadingStatus
  statsStatus: LoadingStatus
  customersError: string | null
  statsError: string | null
  search: string
  sortBy: SortBy
  currentPage: number
  pageSize: number
}

const initialState: CustomersState = {
  customers: [],
  total: 0,
  totalPages: 0,
  stats: null,
  customersStatus: 'idle',
  statsStatus: 'idle',
  customersError: null,
  statsError: null,
  search: '',
  sortBy: 'newest',
  currentPage: 1,
  pageSize: 8,
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: CustomersQueryParams) => {
    const response = await customerService.getCustomers(params)
    return response
  }
)

export const fetchStats = createAsyncThunk(
  'customers/fetchStats',
  async () => {
    const stats = await customerService.getStats()
    return stats
  }
)

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.currentPage = 1 // Reset to first page on search
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.customersStatus = 'loading'
        state.customersError = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<PaginatedResponse<Customer>>) => {
        state.customersStatus = 'succeeded'
        state.customers = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.page
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersStatus = 'failed'
        state.customersError = action.error.message || 'Failed to fetch customers'
      })
      // Stats
      .addCase(fetchStats.pending, (state) => {
        state.statsStatus = 'loading'
        state.statsError = null
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.statsError = action.error.message || 'Failed to fetch stats'
      })
  },
})

export const { setSearch, setSortBy, setCurrentPage } = customersSlice.actions

// Selectors
export const selectCustomers = (state: RootState) => state.customers.customers
export const selectCustomersStatus = (state: RootState) => state.customers.customersStatus
export const selectStatsStatus = (state: RootState) => state.customers.statsStatus
export const selectCustomersError = (state: RootState) => state.customers.customersError
export const selectStatsError = (state: RootState) => state.customers.statsError
export const selectStats = (state: RootState) => state.customers.stats
export const selectSearch = (state: RootState) => state.customers.search
export const selectSortBy = (state: RootState) => state.customers.sortBy
export const selectCurrentPage = (state: RootState) => state.customers.currentPage
export const selectPageSize = (state: RootState) => state.customers.pageSize
export const selectTotalPages = (state: RootState) => state.customers.totalPages
export const selectTotalEntries = (state: RootState) => state.customers.total

// Build query params from current state (memoized)
export const selectQueryParams = createSelector(
  [selectCurrentPage, selectPageSize, selectSearch, selectSortBy],
  (page, pageSize, search, sortBy): CustomersQueryParams => ({
    page,
    pageSize,
    search: search || undefined,
    sortBy,
  })
)

export default customersSlice.reducer
