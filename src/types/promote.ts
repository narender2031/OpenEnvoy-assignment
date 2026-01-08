export interface Campaign {
  id: string
  name: string
  type: 'email' | 'social' | 'ads' | 'discount'
  status: 'active' | 'paused' | 'completed' | 'draft'
  startDate: Date
  endDate: Date
  reach: number
  conversions: number
  budget: number
  spent: number
}

export type CampaignSortBy = 'newest' | 'name' | 'status' | 'reach'
