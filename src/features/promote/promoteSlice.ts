import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { Campaign, CampaignSortBy } from '@/types/promote'
import { promoteService, type CampaignsQueryParams } from '@/services/promoteService'

interface PromoteState {
  campaigns: Campaign[]
  total: number
  totalPages: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  search: string
  sortBy: CampaignSortBy
  currentPage: number
  pageSize: number
}

const initialState: PromoteState = {
  campaigns: [],
  total: 0,
  totalPages: 0,
  status: 'idle',
  error: null,
  search: '',
  sortBy: 'newest',
  currentPage: 1,
  pageSize: 8,
}

export const fetchCampaigns = createAsyncThunk(
  'promote/fetchCampaigns',
  async (params: CampaignsQueryParams) => {
    return promoteService.getCampaigns(params)
  }
)

const promoteSlice = createSlice({
  name: 'promote',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.currentPage = 1
    },
    setSortBy: (state, action: PayloadAction<CampaignSortBy>) => {
      state.sortBy = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.campaigns = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch campaigns'
      })
  },
})

export const { setSearch, setSortBy, setCurrentPage } = promoteSlice.actions

export const selectCampaigns = (state: RootState) => state.promote.campaigns
export const selectPromoteStatus = (state: RootState) => state.promote.status
export const selectPromoteError = (state: RootState) => state.promote.error
export const selectPromoteSearch = (state: RootState) => state.promote.search
export const selectPromoteSortBy = (state: RootState) => state.promote.sortBy
export const selectPromoteCurrentPage = (state: RootState) => state.promote.currentPage
export const selectPromoteTotalPages = (state: RootState) => state.promote.totalPages
export const selectPromoteTotal = (state: RootState) => state.promote.total
export const selectPromotePageSize = (state: RootState) => state.promote.pageSize

export const selectPromoteQueryParams = createSelector(
  [selectPromoteCurrentPage, selectPromotePageSize, selectPromoteSearch, selectPromoteSortBy],
  (page, pageSize, search, sortBy): CampaignsQueryParams => ({
    page,
    pageSize,
    search: search || undefined,
    sortBy,
  })
)

export default promoteSlice.reducer
