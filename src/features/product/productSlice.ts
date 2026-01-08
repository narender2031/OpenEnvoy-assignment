import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { Product, ProductSortBy } from '@/types/product'
import { productService, type ProductsQueryParams } from '@/services/productService'

interface ProductState {
  products: Product[]
  total: number
  totalPages: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  search: string
  sortBy: ProductSortBy
  currentPage: number
  pageSize: number
}

const initialState: ProductState = {
  products: [],
  total: 0,
  totalPages: 0,
  status: 'idle',
  error: null,
  search: '',
  sortBy: 'newest',
  currentPage: 1,
  pageSize: 8,
}

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: ProductsQueryParams) => {
    return productService.getProducts(params)
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.currentPage = 1
    },
    setSortBy: (state, action: PayloadAction<ProductSortBy>) => {
      state.sortBy = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch products'
      })
  },
})

export const { setSearch, setSortBy, setCurrentPage } = productSlice.actions

export const selectProducts = (state: RootState) => state.product.products
export const selectProductStatus = (state: RootState) => state.product.status
export const selectProductError = (state: RootState) => state.product.error
export const selectProductSearch = (state: RootState) => state.product.search
export const selectProductSortBy = (state: RootState) => state.product.sortBy
export const selectProductCurrentPage = (state: RootState) => state.product.currentPage
export const selectProductTotalPages = (state: RootState) => state.product.totalPages
export const selectProductTotal = (state: RootState) => state.product.total
export const selectProductPageSize = (state: RootState) => state.product.pageSize

export const selectProductQueryParams = createSelector(
  [selectProductCurrentPage, selectProductPageSize, selectProductSearch, selectProductSortBy],
  (page, pageSize, search, sortBy): ProductsQueryParams => ({
    page,
    pageSize,
    search: search || undefined,
    sortBy,
  })
)

export default productSlice.reducer
