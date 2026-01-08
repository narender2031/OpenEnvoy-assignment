export interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'sale' | 'refund' | 'subscription' | 'fee'
  status: 'completed' | 'pending' | 'failed'
  customer: string
}

export interface IncomeStats {
  totalRevenue: number
  revenueTrend: number
  pendingPayments: number
  pendingTrend: number
  completedTransactions: number
  completedTrend: number
}

export type TransactionSortBy = 'newest' | 'amount' | 'status'
