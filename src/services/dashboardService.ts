import type { DashboardStats, Activity } from '@/types/dashboard'

const API_DELAY = 300

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockStats: DashboardStats = {
  totalRevenue: 2456789,
  revenueTrend: 12.5,
  totalOrders: 1847,
  ordersTrend: 8.2,
  totalCustomers: 256000,
  customersTrend: 16,
  conversionRate: 3.24,
  conversionTrend: -2.1,
}

const mockActivities: Activity[] = [
  { id: '1', type: 'order', message: 'New order #12847 placed by John Doe', timestamp: new Date(Date.now() - 5 * 60000) },
  { id: '2', type: 'customer', message: 'New customer Sarah Wilson registered', timestamp: new Date(Date.now() - 15 * 60000) },
  { id: '3', type: 'payment', message: 'Payment of $1,250 received from Acme Corp', timestamp: new Date(Date.now() - 30 * 60000) },
  { id: '4', type: 'product', message: 'Product "Premium Widget" stock low (5 remaining)', timestamp: new Date(Date.now() - 45 * 60000) },
  { id: '5', type: 'order', message: 'Order #12846 shipped to Mike Johnson', timestamp: new Date(Date.now() - 60 * 60000) },
  { id: '6', type: 'customer', message: 'Customer feedback received (5 stars)', timestamp: new Date(Date.now() - 90 * 60000) },
  { id: '7', type: 'payment', message: 'Refund of $89 processed for order #12820', timestamp: new Date(Date.now() - 120 * 60000) },
  { id: '8', type: 'product', message: 'New product "Ultra Widget Pro" added to catalog', timestamp: new Date(Date.now() - 180 * 60000) },
]

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await delay(API_DELAY)
    return mockStats
  },

  async getActivities(): Promise<Activity[]> {
    await delay(API_DELAY)
    return mockActivities
  },
}
