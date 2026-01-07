export interface Customer {
  id: string
  name: string
  company: string
  phone: string
  email: string
  country: string
  status: 'active' | 'inactive'
  createdAt: Date
}

export interface Stats {
  totalCustomers: number
  totalCustomersTrend: number
  members: number
  membersTrend: number
  activeNow: number
  activeNowAvatars: string[]
}

export type SortBy = 'newest' | 'name' | 'status'
