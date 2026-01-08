/**
 * Navigation Configuration
 *
 * This file defines the sidebar navigation structure.
 * To add a new page, simply add an entry to the appropriate section.
 *
 * @example
 * // Add a new top-level page:
 * { icon: 'Settings', label: 'Settings', path: '/settings' }
 *
 * @example
 * // Add a page with children (submenu):
 * {
 *   icon: 'Users',
 *   label: 'Customers',
 *   path: '/customers',
 *   children: [
 *     { label: 'All Customers', path: '/customers' },
 *     { label: 'Add Customer', path: '/customers/new' },
 *   ]
 * }
 */

export type IconName =
  | 'LayoutDashboard'
  | 'ShoppingBag'
  | 'Users'
  | 'Wallet'
  | 'Tag'
  | 'HelpCircle'
  | 'Settings'
  | 'BarChart'
  | 'FileText'
  | 'Bell'
  | 'Mail'
  | 'Calendar'
  | 'Folder'
  | 'CreditCard'
  | 'Truck'
  | 'Package'
  | 'Star'
  | 'Heart'
  | 'Shield'
  | 'Lock'

export interface NavItemChild {
  /** Display label for the nav item */
  label: string
  /** Route path (e.g., '/customers/new') */
  path: string
  /** Optional badge count to display */
  badge?: number
}

export interface NavItem {
  /** Icon name from the icon registry */
  icon: IconName
  /** Display label for the nav item */
  label: string
  /** Route path (e.g., '/dashboard') */
  path: string
  /** Nested navigation items (creates expandable submenu) */
  children?: NavItemChild[]
  /** Optional badge count to display */
  badge?: number
}

export interface NavGroup {
  /** Optional group title (e.g., 'Main', 'Settings') */
  title?: string
  /** Navigation items in this group */
  items: NavItem[]
}

/**
 * Main navigation configuration
 *
 * Add new pages here. The sidebar will automatically render them.
 * Active state is determined by matching the current URL path.
 */
export const navigationConfig: NavGroup[] = [
  {
    // Main navigation (no title for primary nav)
    items: [
      {
        icon: 'LayoutDashboard',
        label: 'Dashboard',
        path: '/dashboard',
      },
      {
        icon: 'ShoppingBag',
        label: 'Product',
        path: '/product',
        children: [
          { label: 'All Products', path: '/product' },
          { label: 'Add Product', path: '/product/new' },
          { label: 'Categories', path: '/product/categories' },
        ],
      },
      {
        icon: 'Users',
        label: 'Customers',
        path: '/customers',
        children: [
          { label: 'All Customers', path: '/customers' },
          { label: 'Add Customer', path: '/customers/new' },
          { label: 'Segments', path: '/customers/segments' },
        ],
      },
      {
        icon: 'Wallet',
        label: 'Income',
        path: '/income',
        children: [
          { label: 'Overview', path: '/income' },
          { label: 'Transactions', path: '/income/transactions' },
          { label: 'Reports', path: '/income/reports' },
        ],
      },
      {
        icon: 'Tag',
        label: 'Promote',
        path: '/promote',
        children: [
          { label: 'Campaigns', path: '/promote' },
          { label: 'Discounts', path: '/promote/discounts' },
          { label: 'Coupons', path: '/promote/coupons' },
        ],
      },
      {
        icon: 'HelpCircle',
        label: 'Help',
        path: '/help',
        children: [
          { label: 'Documentation', path: '/help' },
          { label: 'FAQs', path: '/help/faqs' },
          { label: 'Contact Support', path: '/help/support' },
        ],
      },
    ],
  },
  // Example: Add a settings group (uncomment to use)
  // {
  //   title: 'Settings',
  //   items: [
  //     { icon: 'Settings', label: 'General', path: '/settings' },
  //     { icon: 'Shield', label: 'Security', path: '/settings/security' },
  //     { icon: 'Bell', label: 'Notifications', path: '/settings/notifications' },
  //   ],
  // },
]

/**
 * Helper to find a nav item by path
 */
export function findNavItemByPath(path: string): NavItem | NavItemChild | undefined {
  for (const group of navigationConfig) {
    for (const item of group.items) {
      if (item.path === path) return item
      if (item.children) {
        const child = item.children.find(c => c.path === path)
        if (child) return child
      }
    }
  }
  return undefined
}

/**
 * Helper to check if a path is active (exact or parent match)
 */
export function isPathActive(itemPath: string, currentPath: string): boolean {
  // Exact match
  if (itemPath === currentPath) return true
  // Parent match (e.g., /customers is active when on /customers/new)
  if (currentPath.startsWith(itemPath + '/')) return true
  return false
}
