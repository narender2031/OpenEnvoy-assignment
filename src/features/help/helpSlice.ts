import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { FAQ, HelpCategory } from '@/types/help'
import { helpService } from '@/services/helpService'

interface HelpState {
  categories: HelpCategory[]
  faqs: FAQ[]
  categoriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  faqsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  categoriesError: string | null
  faqsError: string | null
  selectedCategory: string | null
  searchQuery: string
}

const initialState: HelpState = {
  categories: [],
  faqs: [],
  categoriesStatus: 'idle',
  faqsStatus: 'idle',
  categoriesError: null,
  faqsError: null,
  selectedCategory: null,
  searchQuery: '',
}

export const fetchCategories = createAsyncThunk(
  'help/fetchCategories',
  async () => {
    return helpService.getCategories()
  }
)

export const fetchFAQs = createAsyncThunk(
  'help/fetchFAQs',
  async (category?: string) => {
    return helpService.getFAQs(category)
  }
)

export const searchFAQs = createAsyncThunk(
  'help/searchFAQs',
  async (query: string) => {
    return helpService.searchFAQs(query)
  }
)

const helpSlice = createSlice({
  name: 'help',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading'
        state.categoriesError = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded'
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed'
        state.categoriesError = action.error.message || 'Failed to fetch categories'
      })
      .addCase(fetchFAQs.pending, (state) => {
        state.faqsStatus = 'loading'
        state.faqsError = null
      })
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.faqsStatus = 'succeeded'
        state.faqs = action.payload
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.faqsStatus = 'failed'
        state.faqsError = action.error.message || 'Failed to fetch FAQs'
      })
      .addCase(searchFAQs.pending, (state) => {
        state.faqsStatus = 'loading'
        state.faqsError = null
      })
      .addCase(searchFAQs.fulfilled, (state, action) => {
        state.faqsStatus = 'succeeded'
        state.faqs = action.payload
      })
      .addCase(searchFAQs.rejected, (state, action) => {
        state.faqsStatus = 'failed'
        state.faqsError = action.error.message || 'Failed to search FAQs'
      })
  },
})

export const { setSelectedCategory, setSearchQuery } = helpSlice.actions

export const selectCategories = (state: RootState) => state.help.categories
export const selectFAQs = (state: RootState) => state.help.faqs
export const selectCategoriesStatus = (state: RootState) => state.help.categoriesStatus
export const selectFAQsStatus = (state: RootState) => state.help.faqsStatus
export const selectSelectedCategory = (state: RootState) => state.help.selectedCategory
export const selectSearchQuery = (state: RootState) => state.help.searchQuery

export default helpSlice.reducer
