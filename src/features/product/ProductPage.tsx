import { useEffect, useCallback, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchProducts,
  selectProducts,
  selectProductStatus,
  selectProductError,
  selectProductSearch,
  selectProductSortBy,
  selectProductCurrentPage,
  selectProductTotalPages,
  selectProductTotal,
  selectProductPageSize,
  selectProductQueryParams,
  setSearch,
  setSortBy,
  setCurrentPage,
} from './productSlice'
import { Table, Pagination, SearchInput, Select, Badge, Spinner, EmptyState, ErrorState } from '@/components'
import type { Column } from '@/components'
import type { Product, ProductSortBy } from '@/types/product'
import styles from './ProductPage.module.css'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stock', label: 'Stock' },
]

const columns: Column<Product>[] = [
  { key: 'name', header: 'Product Name', render: (row) => row.name },
  { key: 'sku', header: 'SKU', render: (row) => row.sku },
  { key: 'category', header: 'Category', render: (row) => row.category },
  { key: 'price', header: 'Price', render: (row) => `$${row.price.toFixed(2)}` },
  { key: 'stock', header: 'Stock', render: (row) => row.stock.toString() },
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

export function ProductPage() {
  const dispatch = useAppDispatch()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectProductStatus)
  const error = useAppSelector(selectProductError)
  const search = useAppSelector(selectProductSearch)
  const sortBy = useAppSelector(selectProductSortBy)
  const currentPage = useAppSelector(selectProductCurrentPage)
  const totalPages = useAppSelector(selectProductTotalPages)
  const total = useAppSelector(selectProductTotal)
  const pageSize = useAppSelector(selectProductPageSize)
  const queryParams = useAppSelector(selectProductQueryParams)

  useEffect(() => {
    dispatch(fetchProducts(queryParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, queryParams.page, queryParams.sortBy])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchProducts({ ...queryParams, page: 1 }))
    }, 300)
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, queryParams.search])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearch(e.target.value))
    },
    [dispatch]
  )

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortBy(e.target.value as ProductSortBy))
    },
    [dispatch]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
    },
    [dispatch]
  )

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts(queryParams))
  }, [dispatch, queryParams])

  const startEntry = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, total)

  return (
    <div className={styles.page}>
      <section className={styles.tableCard}>
        <header className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h2>All Products</h2>
            <span className={styles.subtitle}>Inventory Management</span>
          </div>
          <div className={styles.tableControls}>
            <SearchInput
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search products"
            />
            <Select
              label="Sort by:"
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort products"
            />
          </div>
        </header>

        <div className={styles.tableContent}>
          {status === 'loading' && (
            <div className={styles.loadingState}>
              <Spinner size="lg" label="Loading products" />
              <p>Loading products...</p>
            </div>
          )}

          {status === 'failed' && (
            <ErrorState message={error || 'Failed to load products'} onRetry={handleRetry} />
          )}

          {status === 'succeeded' && products.length === 0 && (
            <EmptyState
              title="No products found"
              description={search ? 'Try adjusting your search.' : 'No products have been added yet.'}
            />
          )}

          {status === 'succeeded' && products.length > 0 && (
            <Table columns={columns} data={products} rowKey={(row) => row.id} />
          )}
        </div>

        {status === 'succeeded' && total > 0 && (
          <footer className={styles.tableFooter}>
            <span className={styles.showingText}>
              Showing data {startEntry} to {endEntry} of {total} entries
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </footer>
        )}
      </section>
    </div>
  )
}
