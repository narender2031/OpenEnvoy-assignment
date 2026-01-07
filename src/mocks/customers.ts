import type { Customer, Stats } from '../types/customer'

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

// Utility functions
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generatePhone(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100
  const prefix = 555
  const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `(${areaCode}) ${prefix}-${suffix}`
}

function randomDate(startYear: number, endYear: number): Date {
  const start = new Date(startYear, 0, 1).getTime()
  const end = new Date(endYear, 11, 31).getTime()
  return new Date(start + Math.random() * (end - start))
}

function generateCustomer(index: number): Customer {
  const firstName = randomFrom(firstNames)
  const lastName = randomFrom(lastNames)
  const company = randomFrom(companies)
  const emailDomain = company.toLowerCase().replace(/\s/g, '') + '.com'

  return {
    id: `cust-${index}`,
    name: `${firstName} ${lastName}`,
    company,
    phone: generatePhone(),
    email: `${firstName.toLowerCase()}@${emailDomain}`,
    country: randomFrom(countries),
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    createdAt: randomDate(2023, 2025),
  }
}

// Generate 256K mock customers (using 1000 for development, can increase)
// Note: For actual 256K entries, you may want to generate on-demand or paginate server-side
const CUSTOMER_COUNT = 1000 // Increase to 256000 for full dataset

export const mockCustomers: Customer[] = Array.from(
  { length: CUSTOMER_COUNT },
  (_, i) => generateCustomer(i)
)

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
