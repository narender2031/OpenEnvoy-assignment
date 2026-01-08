export interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  status: 'active' | 'draft' | 'archived'
  createdAt: Date
}

export type ProductSortBy = 'newest' | 'name' | 'price' | 'stock'
