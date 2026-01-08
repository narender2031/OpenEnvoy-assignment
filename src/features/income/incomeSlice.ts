import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { Transaction, IncomeStats, TransactionSortBy } from '@/types/income'
import { incomeService, type TransactionsQueryParams } from '@/services/incomeService'

interface IncomeState {
  transactions: Transaction[]
  stats: IncomeStats | null
  total: number
  totalPages: number
  transactionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  statsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  transactionsError: string | null
  statsError: string | null
  search: string
  sortBy: TransactionSortBy
  currentPage: number
  pageSize: number
}

const initialState: IncomeState = {
  transactions: [],
  stats: null,
  total: 0,
  totalPages: 0,
  transactionsStatus: 'idle',
  statsStatus: 'idle',
  transactionsError: null,
  statsError: null,
  search: '',
  sortBy: 'newest',
  currentPage: 1,
  pageSize: 8,
}

export const fetchIncomeStats = createAsyncThunk(
  'income/fetchStats',
  async () => {
    return incomeService.getStats()
  }
)

export const fetchTransactions = createAsyncThunk(
  'income/fetchTransactions',
  async (params: TransactionsQueryParams) => {
    return incomeService.getTransactions(params)
  }
)

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.currentPage = 1
    },
    setSortBy: (state, action: PayloadAction<TransactionSortBy>) => {
      state.sortBy = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomeStats.pending, (state) => {
        state.statsStatus = 'loading'
        state.statsError = null
      })
      .addCase(fetchIncomeStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchIncomeStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.statsError = action.error.message || 'Failed to fetch stats'
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsStatus = 'loading'
        state.transactionsError = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsStatus = 'succeeded'
        state.transactions = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsStatus = 'failed'
        state.transactionsError = action.error.message || 'Failed to fetch transactions'
      })
  },
})

export const { setSearch, setSortBy, setCurrentPage } = incomeSlice.actions

export const selectTransactions = (state: RootState) => state.income.transactions
export const selectIncomeStats = (state: RootState) => state.income.stats
export const selectTransactionsStatus = (state: RootState) => state.income.transactionsStatus
export const selectIncomeStatsStatus = (state: RootState) => state.income.statsStatus
export const selectTransactionsError = (state: RootState) => state.income.transactionsError
export const selectIncomeSearch = (state: RootState) => state.income.search
export const selectIncomeSortBy = (state: RootState) => state.income.sortBy
export const selectIncomeCurrentPage = (state: RootState) => state.income.currentPage
export const selectIncomeTotalPages = (state: RootState) => state.income.totalPages
export const selectIncomeTotal = (state: RootState) => state.income.total
export const selectIncomePageSize = (state: RootState) => state.income.pageSize

export const selectIncomeQueryParams = createSelector(
  [selectIncomeCurrentPage, selectIncomePageSize, selectIncomeSearch, selectIncomeSortBy],
  (page, pageSize, search, sortBy): TransactionsQueryParams => ({
    page,
    pageSize,
    search: search || undefined,
    sortBy,
  })
)

export default incomeSlice.reducer
