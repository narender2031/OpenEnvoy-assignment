import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchCustomers,
  fetchStats,
  selectStats,
  selectCustomersStatus,
} from './customersSlice'
import styles from './CustomersPage.module.css'

export function CustomersPage() {
  const dispatch = useAppDispatch()
  const stats = useAppSelector(selectStats)
  const status = useAppSelector(selectCustomersStatus)

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchStats())
  }, [dispatch])

  return (
    <div className={styles.page}>
      {/* Stats Strip - placeholder */}
      <div className={styles.statsStrip}>
        <div className={styles.statCard}>
          <span>Total Customers</span>
          <strong>{stats?.totalCustomers?.toLocaleString() ?? '—'}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Members</span>
          <strong>{stats?.members?.toLocaleString() ?? '—'}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Active Now</span>
          <strong>{stats?.activeNow ?? '—'}</strong>
        </div>
      </div>

      {/* Customers Table Card - placeholder */}
      <div className={styles.tableCard}>
        <header className={styles.tableHeader}>
          <h2>All Customers</h2>
          <span className={styles.activeLink}>Active Members</span>
        </header>

        <div className={styles.tableContent}>
          {status === 'loading' && <p>Loading customers...</p>}
          {status === 'failed' && <p>Error loading customers</p>}
          {status === 'succeeded' && <p>Table will be rendered here</p>}
        </div>
      </div>
    </div>
  )
}
