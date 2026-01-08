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

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CustomersQueryParams {
  page: number
  pageSize: number
  search?: string
  sortBy?: SortBy
}
