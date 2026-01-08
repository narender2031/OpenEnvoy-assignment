/**
 * Icon Registry
 *
 * Maps icon names (strings) to Lucide React components.
 * This allows navigation config to use serializable strings
 * instead of JSX elements.
 *
 * To add a new icon:
 * 1. Import it from 'lucide-react'
 * 2. Add it to the iconRegistry object
 * 3. Add the name to IconName type in navigation.ts
 */

import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  Tag,
  HelpCircle,
  Settings,
  BarChart,
  FileText,
  Bell,
  Mail,
  Calendar,
  Folder,
  CreditCard,
  Truck,
  Package,
  Star,
  Heart,
  Shield,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from './navigation'

/**
 * Registry mapping icon names to Lucide components
 */
export const iconRegistry: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  Tag,
  HelpCircle,
  Settings,
  BarChart,
  FileText,
  Bell,
  Mail,
  Calendar,
  Folder,
  CreditCard,
  Truck,
  Package,
  Star,
  Heart,
  Shield,
  Lock,
}

/**
 * Get an icon component by name
 */
export function getIcon(name: IconName): LucideIcon {
  return iconRegistry[name]
}
