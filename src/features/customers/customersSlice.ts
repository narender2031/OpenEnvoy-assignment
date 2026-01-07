import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Customer, Stats, SortBy } from '../../types/customer'
import { customerService } from '../../services/customerService'
import type { RootState } from '../../store/store'

interface CustomersState {
  customers: Customer[]
  stats: Stats | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  search: string
  sortBy: SortBy
  currentPage: number
  pageSize: number
}

const initialState: CustomersState = {
  customers: [],
  stats: null,
  status: 'idle',
  error: null,
  search: '',
  sortBy: 'newest',
  currentPage: 1,
  pageSize: 8,
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const customers = await customerService.getCustomers()
    return customers
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
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.customers = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch customers'
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { setSearch, setSortBy, setCurrentPage } = customersSlice.actions

// Selectors
export const selectCustomersStatus = (state: RootState) => state.customers.status
export const selectCustomersError = (state: RootState) => state.customers.error
export const selectStats = (state: RootState) => state.customers.stats
export const selectSearch = (state: RootState) => state.customers.search
export const selectSortBy = (state: RootState) => state.customers.sortBy
export const selectCurrentPage = (state: RootState) => state.customers.currentPage
export const selectPageSize = (state: RootState) => state.customers.pageSize

export const selectFilteredCustomers = (state: RootState) => {
  const { customers, search } = state.customers
  if (!search.trim()) return customers

  const searchLower = search.toLowerCase()
  return customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchLower) ||
      customer.company.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
  )
}

export const selectSortedCustomers = (state: RootState) => {
  const filtered = selectFilteredCustomers(state)
  const { sortBy } = state.customers

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status === b.status ? 0 : a.status === 'active' ? -1 : 1
      default:
        return 0
    }
  })
}

export const selectPaginatedCustomers = (state: RootState) => {
  const sorted = selectSortedCustomers(state)
  const { currentPage, pageSize } = state.customers
  const startIndex = (currentPage - 1) * pageSize
  return sorted.slice(startIndex, startIndex + pageSize)
}

export const selectTotalPages = (state: RootState) => {
  const filtered = selectFilteredCustomers(state)
  const { pageSize } = state.customers
  return Math.ceil(filtered.length / pageSize)
}

export const selectTotalEntries = (state: RootState) => {
  return selectFilteredCustomers(state).length
}

export default customersSlice.reducer
