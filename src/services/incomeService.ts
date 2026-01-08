import type { Transaction, IncomeStats, TransactionSortBy } from '@/types/income'
import type { PaginatedResponse } from '@/types/customer'

const API_DELAY = 300

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const customerNames = [
  'John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Brown', 'David Lee',
  'Lisa Anderson', 'James Taylor', 'Jennifer Martinez', 'Robert Garcia', 'Maria Rodriguez',
]

const descriptions = [
  'Product purchase', 'Subscription renewal', 'Service fee', 'Premium upgrade',
  'Bulk order', 'Consultation fee', 'Monthly plan', 'Annual subscription',
]

function generateTransaction(index: number): Transaction {
  const types: Transaction['type'][] = ['sale', 'sale', 'sale', 'subscription', 'refund', 'fee']
  const statuses: Transaction['status'][] = ['completed', 'completed', 'completed', 'pending', 'failed']
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    id: `txn_${index.toString().padStart(6, '0')}`,
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    amount: type === 'refund' ? -(Math.floor(Math.random() * 200) + 20) : Math.floor(Math.random() * 2000) + 50,
    type,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    customer: customerNames[Math.floor(Math.random() * customerNames.length)],
  }
}

const allTransactions = Array.from({ length: 300 }, (_, i) => generateTransaction(i))

const mockStats: IncomeStats = {
  totalRevenue: 847293,
  revenueTrend: 14.2,
  pendingPayments: 23450,
  pendingTrend: -5.3,
  completedTransactions: 1247,
  completedTrend: 8.7,
}

export interface TransactionsQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: TransactionSortBy
}

export const incomeService = {
  async getStats(): Promise<IncomeStats> {
    await delay(API_DELAY)
    return mockStats
  },

  async getTransactions(params: TransactionsQueryParams = {}): Promise<PaginatedResponse<Transaction>> {
    await delay(API_DELAY)

    const { page = 1, pageSize = 8, search = '', sortBy = 'newest' } = params

    let filtered = [...allTransactions]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        t => t.description.toLowerCase().includes(searchLower) ||
             t.customer.toLowerCase().includes(searchLower)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'newest':
        default:
          return b.date.getTime() - a.date.getTime()
      }
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages }
  },
}
