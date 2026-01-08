import { useEffect, useCallback, useRef } from 'react'
import { Users, UserCheck, Monitor } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchCustomers,
  fetchStats,
  selectStats,
  selectStatsStatus,
  selectCustomersStatus,
  selectCustomersError,
  selectCustomers,
  selectTotalPages,
  selectTotalEntries,
  selectCurrentPage,
  selectPageSize,
  selectSearch,
  selectSortBy,
  selectQueryParams,
  setSearch,
  setSortBy,
  setCurrentPage,
} from './customersSlice'
import {
  StatCard,
  TrendIndicator,
  AvatarGroup,
  Table,
  Pagination,
  SearchInput,
  Select,
  Badge,
  Spinner,
  EmptyState,
  ErrorState,
} from '@/components'
import type { Column } from '@/components'
import type { Customer, SortBy } from '@/types/customer'
import styles from './CustomersPage.module.css'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
]

const columns: Column<Customer>[] = [
  { key: 'name', header: 'Customer Name', render: (row) => row.name },
  { key: 'company', header: 'Company', render: (row) => row.company },
  { key: 'phone', header: 'Phone Number', render: (row) => row.phone },
  { key: 'email', header: 'Email', render: (row) => row.email },
  { key: 'country', header: 'Country', render: (row) => row.country },
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

export function CustomersPage() {
  const dispatch = useAppDispatch()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Selectors
  const stats = useAppSelector(selectStats)
  const statsStatus = useAppSelector(selectStatsStatus)
  const customersStatus = useAppSelector(selectCustomersStatus)
  const customersError = useAppSelector(selectCustomersError)
  const customers = useAppSelector(selectCustomers)
  const totalPages = useAppSelector(selectTotalPages)
  const totalEntries = useAppSelector(selectTotalEntries)
  const currentPage = useAppSelector(selectCurrentPage)
  const pageSize = useAppSelector(selectPageSize)
  const search = useAppSelector(selectSearch)
  const sortBy = useAppSelector(selectSortBy)
  const queryParams = useAppSelector(selectQueryParams)

  // Load stats on mount
  useEffect(() => {
    dispatch(fetchStats())
  }, [dispatch])

  // Fetch customers when page or sort changes (immediate, not debounced)
  useEffect(() => {
    dispatch(fetchCustomers(queryParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only fetch on page/sort changes, search is debounced separately
  }, [dispatch, queryParams.page, queryParams.sortBy])

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchCustomers({ ...queryParams, page: 1 }))
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger debounce on search change, other params handled above
  }, [dispatch, queryParams.search])

  // Handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearch(e.target.value))
    },
    [dispatch]
  )

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortBy(e.target.value as SortBy))
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
    dispatch(fetchCustomers(queryParams))
  }, [dispatch, queryParams])

  // Calculate showing range
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, totalEntries)

  // Format total entries for display (e.g., 256K)
  const formatEntries = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  return (
    <div className={styles.page}>
      {/* Stats Strip */}
      <section className={styles.statsStrip} aria-label="Statistics">
        <StatCard
          icon={<Users size={32} />}
          iconBg="green"
          title="Total Customers"
          value={stats?.totalCustomers?.toLocaleString() ?? '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.totalCustomersTrend} suffix="this month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<UserCheck size={32} />}
          iconBg="purple"
          title="Members"
          value={stats?.members?.toLocaleString() ?? '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.membersTrend} suffix="this month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<Monitor size={32} />}
          iconBg="blue"
          title="Active Now"
          value={stats?.activeNow?.toString() ?? '—'}
          footer={
            statsStatus === 'succeeded' && stats?.activeNowAvatars ? (
              <AvatarGroup avatars={stats.activeNowAvatars} max={5} size={28} />
            ) : undefined
          }
        />
      </section>

      {/* Customers Table Card */}
      <section className={styles.tableCard}>
        <header className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h2>All Customers</h2>
            <span className={styles.activeLink}>Active Members</span>
          </div>
          <div className={styles.tableControls}>
            <SearchInput
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              aria-label="Search customers"
            />
            <Select
              label="Sort by:"
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort customers"
            />
          </div>
        </header>

        <div className={styles.tableContent}>
          {customersStatus === 'loading' && (
            <div className={styles.loadingState}>
              <Spinner size="lg" label="Loading customers" />
              <p>Loading customers...</p>
            </div>
          )}

          {customersStatus === 'failed' && (
            <ErrorState
              message={customersError || 'Failed to load customers'}
              onRetry={handleRetry}
            />
          )}

          {customersStatus === 'succeeded' && customers.length === 0 && (
            <EmptyState
              title="No customers found"
              description={
                search
                  ? 'Try adjusting your search to find what you are looking for.'
                  : 'No customers have been added yet.'
              }
            />
          )}

          {customersStatus === 'succeeded' && customers.length > 0 && (
            <Table
              columns={columns}
              data={customers}
              rowKey={(row) => row.id}
            />
          )}
        </div>

        {customersStatus === 'succeeded' && totalEntries > 0 && (
          <footer className={styles.tableFooter}>
            <span className={styles.showingText}>
              Showing data {startEntry} to {endEntry} of {formatEntries(totalEntries)} entries
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
