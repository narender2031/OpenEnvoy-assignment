import type { Stats, CustomersQueryParams, PaginatedResponse, Customer } from '../types/customer'
import { generateCustomersPage, mockStats } from '../mocks/customers'

const API_DELAY = 300 // Simulate network latency

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const customerService = {
  async getCustomers(params: CustomersQueryParams): Promise<PaginatedResponse<Customer>> {
    await delay(API_DELAY)
    // Simulate occasional errors for testing error state
    // if (Math.random() < 0.1) throw new Error('Network error')
    return generateCustomersPage(params)
  },

  async getStats(): Promise<Stats> {
    await delay(API_DELAY)
    return mockStats
  },
}

// To switch to real backend, replace with:
// export const customerService = {
//   async getCustomers(params: CustomersQueryParams): Promise<PaginatedResponse<Customer>> {
//     const queryString = new URLSearchParams({
//       page: String(params.page),
//       pageSize: String(params.pageSize),
//       ...(params.search && { search: params.search }),
//       ...(params.sortBy && { sortBy: params.sortBy }),
//     }).toString()
//     const res = await fetch(`/api/customers?${queryString}`)
//     if (!res.ok) throw new Error('Failed to fetch customers')
//     return res.json()
//   },
//   async getStats(): Promise<Stats> {
//     const res = await fetch('/api/stats')
//     if (!res.ok) throw new Error('Failed to fetch stats')
//     return res.json()
//   },
// }
