import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { UserProvider } from '@/contexts'
import { Sidebar } from './Sidebar'
import type { NavGroup } from '@/config'

const meta: Meta<typeof Sidebar> = {
  title: 'Layouts/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UserProvider>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </UserProvider>
    ),
  ],
  argTypes: {
    currentPath: {
      control: 'select',
      options: [
        '/dashboard',
        '/product',
        '/customers',
        '/income',
        '/promote',
        '/help',
      ],
      description: 'Current active path',
    },
    logoText: {
      control: 'text',
      description: 'Logo text',
    },
    version: {
      control: 'text',
      description: 'Version text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default sidebar with all navigation items from config
 */
export const Default: Story = {
  args: {
    currentPath: '/customers',
  },
}

/**
 * Dashboard page selected
 */
export const DashboardActive: Story = {
  args: {
    currentPath: '/dashboard',
  },
}

/**
 * Interactive story showing navigation and submenu expansion
 */
export const Interactive: Story = {
  render: function InteractiveSidebar() {
    const [currentPath, setCurrentPath] = useState('/customers')

    return (
      <UserProvider>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar
            currentPath={currentPath}
            onNavigate={(path) => {
              setCurrentPath(path)
              console.log('Navigate to:', path)
            }}
          />
          <div style={{ marginLeft: 306, padding: 24 }}>
            <h2>Current Path: {currentPath}</h2>
            <p>Click sidebar items to navigate</p>
          </div>
        </div>
      </UserProvider>
    )
  },
}

/**
 * Custom navigation configuration example
 */
const customNavigation: NavGroup[] = [
  {
    items: [
      { icon: 'LayoutDashboard', label: 'Overview', path: '/overview' },
      { icon: 'Users', label: 'Team', path: '/team', badge: 5 },
      {
        icon: 'Folder',
        label: 'Projects',
        path: '/projects',
        children: [
          { label: 'Active', path: '/projects/active', badge: 3 },
          { label: 'Archived', path: '/projects/archived' },
        ],
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      { icon: 'Settings', label: 'General', path: '/settings' },
      { icon: 'Shield', label: 'Security', path: '/settings/security' },
      { icon: 'Bell', label: 'Notifications', path: '/settings/notifications' },
    ],
  },
]

export const CustomNavigation: Story = {
  args: {
    currentPath: '/team',
    navigation: customNavigation,
    logoText: 'MyApp',
    version: 'v2.0',
  },
}

/**
 * Minimal configuration with just a few items
 */
const minimalNavigation: NavGroup[] = [
  {
    items: [
      { icon: 'LayoutDashboard', label: 'Home', path: '/' },
      { icon: 'Users', label: 'Users', path: '/users' },
      { icon: 'Settings', label: 'Settings', path: '/settings' },
    ],
  },
]

export const MinimalNavigation: Story = {
  args: {
    currentPath: '/',
    navigation: minimalNavigation,
  },
}

/**
 * Extended navigation with many items and groups
 */
const extendedNavigation: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
      { icon: 'BarChart', label: 'Analytics', path: '/analytics', badge: 12 },
      {
        icon: 'Users',
        label: 'Customers',
        path: '/customers',
        children: [
          { label: 'All Customers', path: '/customers' },
          { label: 'Segments', path: '/customers/segments' },
          { label: 'Import', path: '/customers/import' },
        ],
      },
      {
        icon: 'ShoppingBag',
        label: 'Products',
        path: '/products',
        children: [
          { label: 'Inventory', path: '/products' },
          { label: 'Categories', path: '/products/categories' },
          { label: 'Pricing', path: '/products/pricing' },
        ],
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: 'Wallet', label: 'Revenue', path: '/revenue' },
      { icon: 'CreditCard', label: 'Payments', path: '/payments' },
      { icon: 'FileText', label: 'Invoices', path: '/invoices', badge: 3 },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { icon: 'Tag', label: 'Campaigns', path: '/campaigns' },
      { icon: 'Mail', label: 'Email', path: '/email' },
      { icon: 'Star', label: 'Reviews', path: '/reviews' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: 'Settings', label: 'Settings', path: '/settings' },
      { icon: 'Shield', label: 'Security', path: '/security' },
      { icon: 'HelpCircle', label: 'Help', path: '/help' },
    ],
  },
]

export const ExtendedNavigation: Story = {
  args: {
    currentPath: '/dashboard',
    navigation: extendedNavigation,
    logoText: 'Enterprise',
    version: 'v3.0',
  },
}

/**
 * With custom user profile
 */
export const WithCustomUser: Story = {
  args: {
    currentPath: '/customers',
  },
  decorators: [
    (Story) => (
      <UserProvider
        user={{
          name: 'Jane Smith',
          role: 'Admin',
          avatar: 'https://i.pravatar.cc/150?img=5',
        }}
      >
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </UserProvider>
    ),
  ],
}
