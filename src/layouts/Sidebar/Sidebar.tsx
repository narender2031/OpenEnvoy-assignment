import { useState, useCallback } from 'react'
import { LayoutDashboard, ChevronRight, ChevronDown } from 'lucide-react'
import { useUser } from '@/contexts'
import {
  navigationConfig,
  isPathActive,
  getIcon,
  type NavItem,
  type NavGroup,
} from '@/config'
import styles from './Sidebar.module.css'

export interface SidebarProps {
  /** Current active path (e.g., '/customers') */
  currentPath?: string
  /** Callback when a nav item is clicked */
  onNavigate?: (path: string) => void
  /** Custom navigation config (optional, uses default if not provided) */
  navigation?: NavGroup[]
  /** Logo text (default: 'Dashboard') */
  logoText?: string
  /** Version text (default: 'v.01') */
  version?: string
}

/**
 * Sidebar navigation component
 *
 * Config-driven sidebar that supports:
 * - Unlimited nav items via configuration
 * - Nested submenus with expand/collapse
 * - Nav groups with optional titles
 * - Active state detection from current path
 * - Icon registry for serializable config
 *
 * @example
 * // Basic usage with current path
 * <Sidebar currentPath="/customers" onNavigate={(path) => navigate(path)} />
 *
 * @example
 * // Custom navigation config
 * <Sidebar
 *   currentPath="/custom"
 *   navigation={[{ items: [{ icon: 'Users', label: 'Custom', path: '/custom' }] }]}
 * />
 */
export function Sidebar({
  currentPath = '/customers',
  onNavigate,
  navigation = navigationConfig,
  logoText = 'Dashboard',
  version = 'v.01',
}: SidebarProps) {
  const user = useUser()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = useCallback((path: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const handleNavClick = useCallback(
    (e: React.MouseEvent, item: NavItem) => {
      e.preventDefault()
      if (item.children && item.children.length > 0) {
        toggleExpanded(item.path)
      } else if (onNavigate) {
        onNavigate(item.path)
      }
    },
    [onNavigate, toggleExpanded]
  )

  const handleChildClick = useCallback(
    (e: React.MouseEvent, path: string) => {
      e.preventDefault()
      if (onNavigate) {
        onNavigate(path)
      }
    },
    [onNavigate]
  )

  const renderNavItem = (item: NavItem) => {
    const Icon = getIcon(item.icon)
    const isActive = isPathActive(item.path, currentPath)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.path)

    return (
      <div key={item.path} className={styles.navItemWrapper}>
        <a
          href={item.path}
          className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          aria-current={isActive ? 'page' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          onClick={(e) => handleNavClick(e, item)}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <Icon size={20} />
          </span>
          <span className={styles.navLabel}>{item.label}</span>
          {item.badge !== undefined && (
            <span className={styles.badge}>{item.badge}</span>
          )}
          {hasChildren && (
            <span className={styles.chevron} aria-hidden="true">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </a>

        {hasChildren && isExpanded && (
          <div className={styles.submenu} role="menu">
            {item.children!.map(child => (
              <a
                key={child.path}
                href={child.path}
                className={`${styles.submenuItem} ${
                  currentPath === child.path ? styles.active : ''
                }`}
                role="menuitem"
                onClick={(e) => handleChildClick(e, child.path)}
              >
                {child.label}
                {child.badge !== undefined && (
                  <span className={styles.badge}>{child.badge}</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderNavGroup = (group: NavGroup, index: number) => (
    <div key={group.title || index} className={styles.navGroup}>
      {group.title && (
        <div className={styles.groupTitle}>{group.title}</div>
      )}
      {group.items.map(renderNavItem)}
    </div>
  )

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <LayoutDashboard size={24} />
        </div>
        <span className={styles.logoText}>{logoText}</span>
        <span className={styles.version}>{version}</span>
      </div>

      <nav className={styles.nav}>
        {navigation.map(renderNavGroup)}
      </nav>

      <a
        href="/profile"
        className={`${styles.userProfile} ${currentPath === '/profile' ? styles.userProfileActive : ''}`}
        onClick={(e) => {
          e.preventDefault()
          if (onNavigate) {
            onNavigate('/profile')
          }
        }}
      >
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className={styles.userAvatar}
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userRole}>{user.role}</span>
        </div>
      </a>
    </aside>
  )
}
