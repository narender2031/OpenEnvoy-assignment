import type { Customer, Stats, CustomersQueryParams, PaginatedResponse } from '../types/customer'

// Total customers to simulate (256K as per requirements)
export const TOTAL_CUSTOMERS = 256000

// Sample data arrays
const firstNames = [
  'Jane', 'Floyd', 'Ronald', 'Marvin', 'Jerome', 'Kathryn', 'Jacob', 'Kristin',
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'Mason', 'Isabella',
  'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper'
]

const lastNames = [
  'Cooper', 'Miles', 'Richards', 'McKinney', 'Bell', 'Murphy', 'Jones', 'Watson',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia'
]

const companies = [
  'Microsoft', 'Yahoo', 'Adobe', 'Tesla', 'Google', 'Facebook', 'Apple', 'Amazon',
  'Netflix', 'Spotify', 'Twitter', 'LinkedIn', 'Salesforce', 'Oracle', 'SAP', 'IBM'
]

const countries = [
  'United States', 'Kiribati', 'Israel', 'Iran', 'Réunion', 'Curaçao', 'Brazil',
  'Åland Islands', 'Germany', 'France', 'Japan', 'Canada', 'Australia', 'India',
  'United Kingdom', 'Mexico', 'Spain', 'Italy', 'South Korea', 'Netherlands'
]

// Seeded random number generator for consistent data across requests
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff
    return this.seed / 0x7fffffff
  }

  fromArray<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }
}

// Generate a customer deterministically based on index
function generateCustomerByIndex(index: number): Customer {
  const rng = new SeededRandom(index + 1)

  const firstName = rng.fromArray(firstNames)
  const lastName = rng.fromArray(lastNames)
  const company = rng.fromArray(companies)
  const emailDomain = company.toLowerCase().replace(/\s/g, '') + '.com'

  const areaCode = Math.floor(rng.next() * 900) + 100
  const suffix = String(Math.floor(rng.next() * 10000)).padStart(4, '0')
  const phone = `(${areaCode}) 555-${suffix}`

  const startTime = new Date(2023, 0, 1).getTime()
  const endTime = new Date(2025, 11, 31).getTime()
  const createdAt = new Date(startTime + rng.next() * (endTime - startTime))

  return {
    id: `cust-${index}`,
    name: `${firstName} ${lastName}`,
    company,
    phone,
    email: `${firstName.toLowerCase()}@${emailDomain}`,
    country: rng.fromArray(countries),
    status: rng.next() > 0.3 ? 'active' : 'inactive',
    createdAt,
  }
}

// Generate customers for a specific page on-demand
export function generateCustomersPage(params: CustomersQueryParams): PaginatedResponse<Customer> {
  const { page, pageSize, search, sortBy } = params

  // For search, we need to scan through customers to find matches
  // In a real backend, this would be indexed
  if (search && search.trim()) {
    return generateSearchResults(params)
  }

  // Calculate total pages
  const totalPages = Math.ceil(TOTAL_CUSTOMERS / pageSize)

  // Generate only the customers for this page
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, TOTAL_CUSTOMERS)

  let customers: Customer[] = []
  for (let i = startIndex; i < endIndex; i++) {
    customers.push(generateCustomerByIndex(i))
  }

  // Apply sorting
  customers = sortCustomers(customers, sortBy)

  return {
    data: customers,
    total: TOTAL_CUSTOMERS,
    page,
    pageSize,
    totalPages,
  }
}

// Handle search with lazy evaluation (simulates indexed search)
function generateSearchResults(params: CustomersQueryParams): PaginatedResponse<Customer> {
  const { page, pageSize, search = '', sortBy } = params
  const searchLower = search.toLowerCase()

  // For demo purposes, we'll search through a sample set and extrapolate
  // In production, this would be a backend indexed search
  const SEARCH_SAMPLE_SIZE = 10000
  const matches: Customer[] = []

  for (let i = 0; i < SEARCH_SAMPLE_SIZE && matches.length < pageSize * 10; i++) {
    const customer = generateCustomerByIndex(i)
    if (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.company.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    ) {
      matches.push(customer)
    }
  }

  // Sort matches
  const sorted = sortCustomers(matches, sortBy)

  // Paginate
  const startIndex = (page - 1) * pageSize
  const paginatedData = sorted.slice(startIndex, startIndex + pageSize)
  const totalMatches = matches.length

  return {
    data: paginatedData,
    total: totalMatches,
    page,
    pageSize,
    totalPages: Math.ceil(totalMatches / pageSize),
  }
}

function sortCustomers(customers: Customer[], sortBy?: string): Customer[] {
  if (!sortBy) return customers

  return [...customers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status === b.status ? 0 : a.status === 'active' ? -1 : 1
      default:
        return 0
    }
  })
}

// Sample avatar URLs (placeholder images)
const avatarUrls = [
  'https://i.pravatar.cc/32?img=1',
  'https://i.pravatar.cc/32?img=2',
  'https://i.pravatar.cc/32?img=3',
  'https://i.pravatar.cc/32?img=4',
  'https://i.pravatar.cc/32?img=5',
]

export const mockStats: Stats = {
  totalCustomers: 5423,
  totalCustomersTrend: 16,
  members: 1893,
  membersTrend: -1,
  activeNow: 189,
  activeNowAvatars: avatarUrls,
}
