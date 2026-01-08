import type { Campaign, CampaignSortBy } from '@/types/promote'
import type { PaginatedResponse } from '@/types/customer'

const API_DELAY = 300

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const campaignNames = [
  'Summer Sale 2024', 'New Customer Welcome', 'Flash Friday', 'VIP Members Only',
  'Holiday Special', 'Back to School', 'Clearance Event', 'Loyalty Rewards',
  'Product Launch', 'Anniversary Sale', 'Free Shipping Week', 'Bundle Deal',
]

function generateCampaign(index: number): Campaign {
  const types: Campaign['type'][] = ['email', 'social', 'ads', 'discount']
  const statuses: Campaign['status'][] = ['active', 'active', 'paused', 'completed', 'draft']
  const startDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
  const endDate = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
  const budget = Math.floor(Math.random() * 10000) + 500

  return {
    id: `camp_${index.toString().padStart(4, '0')}`,
    name: campaignNames[index % campaignNames.length] + (index >= campaignNames.length ? ` #${Math.floor(index / campaignNames.length) + 1}` : ''),
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    startDate,
    endDate,
    reach: Math.floor(Math.random() * 50000) + 1000,
    conversions: Math.floor(Math.random() * 500) + 10,
    budget,
    spent: Math.floor(Math.random() * budget),
  }
}

const allCampaigns = Array.from({ length: 100 }, (_, i) => generateCampaign(i))

export interface CampaignsQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: CampaignSortBy
}

export const promoteService = {
  async getCampaigns(params: CampaignsQueryParams = {}): Promise<PaginatedResponse<Campaign>> {
    await delay(API_DELAY)

    const { page = 1, pageSize = 8, search = '', sortBy = 'newest' } = params

    let filtered = [...allCampaigns]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        c => c.name.toLowerCase().includes(searchLower) ||
             c.type.toLowerCase().includes(searchLower)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'reach':
          return b.reach - a.reach
        case 'newest':
        default:
          return b.startDate.getTime() - a.startDate.getTime()
      }
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages }
  },
}
