import { useEffect, useCallback, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchCampaigns,
  selectCampaigns,
  selectPromoteStatus,
  selectPromoteError,
  selectPromoteSearch,
  selectPromoteSortBy,
  selectPromoteCurrentPage,
  selectPromoteTotalPages,
  selectPromoteTotal,
  selectPromotePageSize,
  selectPromoteQueryParams,
  setSearch,
  setSortBy,
  setCurrentPage,
} from './promoteSlice'
import { Table, Pagination, SearchInput, Dropdown, Badge, Spinner, EmptyState, ErrorState } from '@/components'
import type { Column } from '@/components'
import type { Campaign, CampaignSortBy } from '@/types/promote'
import styles from './PromotePage.module.css'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
  { value: 'reach', label: 'Reach' },
]

const typeColors: Record<Campaign['type'], string> = {
  email: 'email',
  social: 'social',
  ads: 'ads',
  discount: 'discount',
}

const columns: Column<Campaign>[] = [
  { key: 'name', header: 'Campaign Name', render: (row) => row.name },
  {
    key: 'type',
    header: 'Type',
    render: (row) => <span className={styles[typeColors[row.type]]}>{row.type}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'danger'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'duration',
    header: 'Duration',
    render: (row) => `${row.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${row.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
  },
  {
    key: 'reach',
    header: 'Reach',
    render: (row) => row.reach >= 1000 ? `${(row.reach / 1000).toFixed(1)}K` : row.reach.toString(),
  },
  {
    key: 'conversions',
    header: 'Conversions',
    render: (row) => row.conversions.toString(),
  },
  {
    key: 'budget',
    header: 'Budget',
    render: (row) => (
      <div className={styles.budgetCell}>
        <span>${row.spent.toLocaleString()} / ${row.budget.toLocaleString()}</span>
        <div className={styles.budgetBar}>
          <div
            className={styles.budgetProgress}
            style={{ width: `${Math.min((row.spent / row.budget) * 100, 100)}%` }}
          />
        </div>
      </div>
    ),
  },
]

export function PromotePage() {
  const dispatch = useAppDispatch()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const campaigns = useAppSelector(selectCampaigns)
  const status = useAppSelector(selectPromoteStatus)
  const error = useAppSelector(selectPromoteError)
  const search = useAppSelector(selectPromoteSearch)
  const sortBy = useAppSelector(selectPromoteSortBy)
  const currentPage = useAppSelector(selectPromoteCurrentPage)
  const totalPages = useAppSelector(selectPromoteTotalPages)
  const total = useAppSelector(selectPromoteTotal)
  const pageSize = useAppSelector(selectPromotePageSize)
  const queryParams = useAppSelector(selectPromoteQueryParams)

  useEffect(() => {
    dispatch(fetchCampaigns(queryParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, queryParams.page, queryParams.sortBy])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchCampaigns({ ...queryParams, page: 1 }))
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
    (value: string) => {
      dispatch(setSortBy(value as CampaignSortBy))
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
    dispatch(fetchCampaigns(queryParams))
  }, [dispatch, queryParams])

  const startEntry = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, total)

  return (
    <div className={styles.page}>
      <section className={styles.tableCard}>
        <header className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h2>All Campaigns</h2>
            <span className={styles.subtitle}>Marketing & Promotions</span>
          </div>
          <div className={styles.tableControls}>
            <SearchInput
              placeholder="Search campaigns..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search campaigns"
            />
            <Dropdown
              label="Sort by:"
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort campaigns"
            />
          </div>
        </header>

        <div className={styles.tableContent}>
          {status === 'loading' && (
            <div className={styles.loadingState}>
              <Spinner size="lg" label="Loading campaigns" />
              <p>Loading campaigns...</p>
            </div>
          )}

          {status === 'failed' && (
            <ErrorState message={error || 'Failed to load campaigns'} onRetry={handleRetry} />
          )}

          {status === 'succeeded' && campaigns.length === 0 && (
            <EmptyState
              title="No campaigns found"
              description={search ? 'Try adjusting your search.' : 'No campaigns created yet.'}
            />
          )}

          {status === 'succeeded' && campaigns.length > 0 && (
            <Table columns={columns} data={campaigns} rowKey={(row) => row.id} />
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
