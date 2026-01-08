import { Navigate } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard'
import { ProductPage } from '@/features/product'
import { CustomersPage } from '@/features/customers'
import { IncomePage } from '@/features/income'
import { PromotePage } from '@/features/promote'
import { HelpPage } from '@/features/help'

export interface RouteConfig {
  path: string
  element: React.ReactNode
}

export const routes: RouteConfig[] = [
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/product', element: <ProductPage /> },
  { path: '/customers', element: <CustomersPage /> },
  { path: '/income', element: <IncomePage /> },
  { path: '/promote', element: <PromotePage /> },
  { path: '/help', element: <HelpPage /> },
]
