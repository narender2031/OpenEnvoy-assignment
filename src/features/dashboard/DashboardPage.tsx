import { useEffect, useCallback } from 'react'
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, UserPlus, CreditCard } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchDashboardStats,
  fetchActivities,
  selectDashboardStats,
  selectActivities,
  selectStatsStatus,
  selectActivitiesStatus,
} from './dashboardSlice'
import { StatCard, TrendIndicator, Spinner, ErrorState } from '@/components'
import styles from './DashboardPage.module.css'

const activityIcons = {
  order: ShoppingCart,
  customer: UserPlus,
  product: Package,
  payment: CreditCard,
}

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const stats = useAppSelector(selectDashboardStats)
  const activities = useAppSelector(selectActivities)
  const statsStatus = useAppSelector(selectStatsStatus)
  const activitiesStatus = useAppSelector(selectActivitiesStatus)

  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchActivities())
  }, [dispatch])

  const handleRetry = useCallback(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchActivities())
  }, [dispatch])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (statsStatus === 'failed') {
    return (
      <div className={styles.page}>
        <ErrorState message="Failed to load dashboard data" onRetry={handleRetry} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* Stats Grid */}
      <section className={styles.statsGrid} aria-label="Dashboard Statistics">
        <StatCard
          icon={<DollarSign size={32} />}
          iconBg="green"
          title="Total Revenue"
          value={statsStatus === 'succeeded' && stats ? formatCurrency(stats.totalRevenue) : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.revenueTrend} suffix="vs last month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<ShoppingCart size={32} />}
          iconBg="purple"
          title="Total Orders"
          value={statsStatus === 'succeeded' && stats ? formatNumber(stats.totalOrders) : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.ordersTrend} suffix="vs last month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<Users size={32} />}
          iconBg="blue"
          title="Total Customers"
          value={statsStatus === 'succeeded' && stats ? formatNumber(stats.totalCustomers) : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.customersTrend} suffix="vs last month" />
            ) : undefined
          }
        />
        <StatCard
          icon={<TrendingUp size={32} />}
          iconBg="green"
          title="Conversion Rate"
          value={statsStatus === 'succeeded' && stats ? `${stats.conversionRate}%` : '—'}
          footer={
            statsStatus === 'succeeded' && stats ? (
              <TrendIndicator value={stats.conversionTrend} suffix="vs last month" />
            ) : undefined
          }
        />
      </section>

      {/* Activity Feed */}
      <section className={styles.activitySection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Activity</h2>
        </div>
        <div className={styles.activityCard}>
          {activitiesStatus === 'loading' && (
            <div className={styles.loadingState}>
              <Spinner size="md" label="Loading activities" />
            </div>
          )}
          {activitiesStatus === 'succeeded' && activities.length > 0 && (
            <ul className={styles.activityList}>
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type]
                return (
                  <li key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                      <Icon size={16} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityMessage}>{activity.message}</p>
                      <span className={styles.activityTime}>{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
