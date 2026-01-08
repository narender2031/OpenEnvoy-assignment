import type { FAQ, HelpCategory } from '@/types/help'

const API_DELAY = 300

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockCategories: HelpCategory[] = [
  { id: '1', name: 'Getting Started', icon: 'LayoutDashboard', description: 'Learn the basics of using the platform' },
  { id: '2', name: 'Account & Billing', icon: 'CreditCard', description: 'Manage your account and payments' },
  { id: '3', name: 'Products', icon: 'ShoppingBag', description: 'Product management and inventory' },
  { id: '4', name: 'Customers', icon: 'Users', description: 'Customer data and segments' },
  { id: '5', name: 'Reports', icon: 'BarChart', description: 'Analytics and reporting features' },
]

const mockFAQs: FAQ[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create my first product?',
    answer: 'Navigate to the Products tab, click "Add Product", fill in the product details including name, SKU, price, and stock quantity, then click Save.',
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'How do I import existing customers?',
    answer: 'Go to Customers > Import, download our CSV template, fill in your customer data, and upload the file. The system will validate and import your customers.',
  },
  {
    id: '3',
    category: 'Account & Billing',
    question: 'How do I upgrade my plan?',
    answer: 'Visit Settings > Billing, click "Upgrade Plan", select your desired plan tier, and complete the payment process. Your new features will be available immediately.',
  },
  {
    id: '4',
    category: 'Account & Billing',
    question: 'Can I get a refund?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact our support team through Help > Contact Support to request a refund.',
  },
  {
    id: '5',
    category: 'Products',
    question: 'How do I manage inventory levels?',
    answer: 'Each product has a stock quantity field. You can set low stock alerts in Settings > Notifications to be notified when inventory drops below your threshold.',
  },
  {
    id: '6',
    category: 'Products',
    question: 'Can I bulk edit products?',
    answer: 'Yes! Select multiple products using the checkboxes, then click "Bulk Actions" to edit price, status, or category for all selected products at once.',
  },
  {
    id: '7',
    category: 'Customers',
    question: 'How do I create customer segments?',
    answer: 'Go to Customers > Segments, click "New Segment", define your criteria (e.g., purchase history, location), and save. Segments update automatically.',
  },
  {
    id: '8',
    category: 'Customers',
    question: 'How do I export customer data?',
    answer: 'From the Customers list, click the Export button in the top right. Choose your format (CSV or Excel) and the data fields you want to include.',
  },
  {
    id: '9',
    category: 'Reports',
    question: 'How often are reports updated?',
    answer: 'Dashboard stats update in real-time. Detailed reports are refreshed every hour. You can manually refresh any report by clicking the refresh icon.',
  },
  {
    id: '10',
    category: 'Reports',
    question: 'Can I schedule automated reports?',
    answer: 'Yes! Go to Reports > Scheduled, create a new schedule, select your report type, frequency (daily, weekly, monthly), and recipient email addresses.',
  },
]

export const helpService = {
  async getCategories(): Promise<HelpCategory[]> {
    await delay(API_DELAY)
    return mockCategories
  },

  async getFAQs(category?: string): Promise<FAQ[]> {
    await delay(API_DELAY)
    if (category) {
      return mockFAQs.filter(faq => faq.category === category)
    }
    return mockFAQs
  },

  async searchFAQs(query: string): Promise<FAQ[]> {
    await delay(API_DELAY)
    const queryLower = query.toLowerCase()
    return mockFAQs.filter(
      faq => faq.question.toLowerCase().includes(queryLower) ||
             faq.answer.toLowerCase().includes(queryLower)
    )
  },
}
