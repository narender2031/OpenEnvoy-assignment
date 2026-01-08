import type { Product, ProductSortBy } from '@/types/product'
import type { PaginatedResponse } from '@/types/customer'

const API_DELAY = 300

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys']
const productNames = [
  'Premium Widget', 'Ultra Gadget', 'Smart Device', 'Pro Controller', 'Elite Speaker',
  'Wireless Hub', 'Digital Display', 'Power Bank', 'LED Strip', 'Smart Watch',
  'Bluetooth Headset', 'USB Adapter', 'Portable Charger', 'Gaming Mouse', 'Mechanical Keyboard',
]

function generateProduct(index: number): Product {
  const name = productNames[index % productNames.length]
  const variant = Math.floor(index / productNames.length) + 1
  return {
    id: `prod_${index.toString().padStart(6, '0')}`,
    name: variant > 1 ? `${name} v${variant}` : name,
    sku: `SKU-${(1000 + index).toString()}`,
    price: Math.floor(Math.random() * 500) + 10,
    stock: Math.floor(Math.random() * 200),
    category: categories[index % categories.length],
    status: ['active', 'active', 'active', 'draft', 'archived'][Math.floor(Math.random() * 5)] as Product['status'],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  }
}

const allProducts = Array.from({ length: 500 }, (_, i) => generateProduct(i))

export interface ProductsQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: ProductSortBy
}

export const productService = {
  async getProducts(params: ProductsQueryParams = {}): Promise<PaginatedResponse<Product>> {
    await delay(API_DELAY)

    const { page = 1, pageSize = 8, search = '', sortBy = 'newest' } = params

    let filtered = [...allProducts]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(searchLower) ||
             p.sku.toLowerCase().includes(searchLower) ||
             p.category.toLowerCase().includes(searchLower)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return b.price - a.price
        case 'stock':
          return b.stock - a.stock
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages }
  },
}
