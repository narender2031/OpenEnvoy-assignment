export interface DashboardStats {
  totalRevenue: number
  revenueTrend: number
  totalOrders: number
  ordersTrend: number
  totalCustomers: number
  customersTrend: number
  conversionRate: number
  conversionTrend: number
}

export interface Activity {
  id: string
  type: 'order' | 'customer' | 'product' | 'payment'
  message: string
  timestamp: Date
}
