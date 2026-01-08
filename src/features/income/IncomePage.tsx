import { useEffect, useCallback, useRef } from 'react'
import { DollarSign, Clock, CheckCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchIncomeStats,
  fetchTransactions,
  selectTransactions,
  selectIncomeStats,
  selectTransactionsStatus,
  selectIncomeStatsStatus,
  selectTransactionsError,
  selectIncomeSearch,
  selectIncomeSortBy,
  selectIncomeCurrentPage,
  selectIncomeTotalPages,
  selectIncomeTotal,
  selectIncomePageSize,
  selectIncomeQueryParams,
  setSearch,
  setSortBy,
  setCurrentPage,
} from './incomeSlice'
import { StatCard, TrendIndicator, Table, Pagination, SearchInput, Select, Badge, Spinner, EmptyState, ErrorState } from '@/components'
import type { Column } from '@/components'
import type { Transaction, TransactionSortBy } from '@/types/income'
import styles from './IncomePage.module.css'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'amount', label: 'Amount' },
  { value: 'status', label: 'Status' },
]

const columns: Column<Transaction>[] = [
  {
    key: 'date',
    header: 'Date',
    render: (row) => row.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  },
  { key: 'description', header: 'Description', render: (row) => row.description },
  { key: 'customer', header: 'Customer', render: (row) => row.customer },
  {
    key: 'type',
    header: 'Type',
    render: (row) => <span className={styles[row.type]}>{row.type}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row) => (
      <span className={row.amount < 0 ? styles.negative : styles.positive}>
        {row.amount < 0 ? '-' : '+'}${Math.abs(row.amount).toFixed(2)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'completed' ? 'success' : row.status === 'pending' ? 'success' : 'danger'}>
        {row.status}
      </Badge>
    ),
  },
]

export function IncomePage() {
  const dispatch = useAppDispatch()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const transactions = useAppSelector(selectTransactions)
  const stats = useAppSelector(selectIncomeStats)
  const transactionsStatus = useAppSelector(selectTransactionsStatus)
  const statsStatus = useAppSelector(selectIncomeStatsStatus)
  const error = useAppSelector(selectTransactionsError)
  const search = useAppSelector(selectIncomeSearch)
  const sortBy = useAppSelector(selectIncomeSortBy)
  const currentPage = useAppSelector(selectIncomeCurrentPage)
  const totalPages = useAppSelector(selectIncomeTotalPages)
  const total = useAppSelector(selectIncomeTotal)
  const pageSize = useAppSelector(selectIncomePageSize)
  const queryParams = useAppSelector(selectIncomeQueryParams)

  useEffect(() => {
    dispatch(fetchIncomeStats())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTransactions(queryParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, queryParams.page, queryParams.sortBy])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchTransactions({ ...queryParams, page: 1 }))
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
      dispatch(setSortBy(e.target.value as TransactionSortBy))
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
    dispatch(fetchTransactions(queryParams))
  }, [dispatch, queryParams])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const startEntry = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, total)

  return (
    <div className={styles.page}>
      {/* Stats Strip */}
      <section className={styles.statsStrip} aria-label="Income Statistics">
        <StatCard
          icon={<DollarSign size={32} />}
          iconBg="green"
          title="Total Revenue"
          value={statsStatus === 'succeeded' && stats ? formatCurrency(stats.totalRevenue) : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.revenueTrend} suffix="this month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<Clock size={32} />}
          iconBg="purple"
          title="Pending Payments"
          value={statsStatus === 'succeeded' && stats ? formatCurrency(stats.pendingPayments) : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.pendingTrend} suffix="this month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<CheckCircle size={32} />}
          iconBg="blue"
          title="Completed"
          value={statsStatus === 'succeeded' && stats ? stats.completedTransactions.toString() : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.completedTrend} suffix="this month" />
            ) : undefined
          }
        />
      </section>

      {/* Transactions Table */}
      <section className={styles.tableCard}>
        <header className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h2>All Transactions</h2>
            <span className={styles.subtitle}>Payment History</span>
          </div>
          <div className={styles.tableControls}>
            <SearchInput
              placeholder="Search transactions..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search transactions"
            />
            <Select
              label="Sort by:"
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort transactions"
            />
          </div>
        </header>

        <div className={styles.tableContent}>
          {transactionsStatus === 'loading' && (
            <div className={styles.loadingState}>
              <Spinner size="lg" label="Loading transactions" />
              <p>Loading transactions...</p>
            </div>
          )}

          {transactionsStatus === 'failed' && (
            <ErrorState message={error || 'Failed to load transactions'} onRetry={handleRetry} />
          )}

          {transactionsStatus === 'succeeded' && transactions.length === 0 && (
            <EmptyState
              title="No transactions found"
              description={search ? 'Try adjusting your search.' : 'No transactions recorded yet.'}
            />
          )}

          {transactionsStatus === 'succeeded' && transactions.length > 0 && (
            <Table columns={columns} data={transactions} rowKey={(row) => row.id} />
          )}
        </div>

        {transactionsStatus === 'succeeded' && total > 0 && (
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
