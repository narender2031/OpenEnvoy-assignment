import type { Customer, Stats } from '../types/customer'
import { mockCustomers, mockStats } from '../mocks/customers'

const API_DELAY = 500 // Simulate network latency

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await delay(API_DELAY)
    // Simulate occasional errors for testing error state
    // if (Math.random() < 0.1) throw new Error('Network error')
    return mockCustomers
  },

  async getStats(): Promise<Stats> {
    await delay(API_DELAY)
    return mockStats
  },
}

// To switch to real backend, replace with:
// export const customerService = {
//   async getCustomers(): Promise<Customer[]> {
//     const res = await fetch('/api/customers')
//     if (!res.ok) throw new Error('Failed to fetch customers')
//     return res.json()
//   },
//   async getStats(): Promise<Stats> {
//     const res = await fetch('/api/stats')
//     if (!res.ok) throw new Error('Failed to fetch stats')
//     return res.json()
//   },
// }
