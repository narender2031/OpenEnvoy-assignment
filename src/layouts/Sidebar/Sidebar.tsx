import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  Tag,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
import { useUser } from '@/contexts'
import styles from './Sidebar.module.css'

interface NavItem {
  icon: React.ReactNode
  label: string
  active?: boolean
  hasSubmenu?: boolean
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { icon: <ShoppingBag size={20} />, label: 'Product', hasSubmenu: true },
  { icon: <Users size={20} />, label: 'Customers', active: true, hasSubmenu: true },
  { icon: <Wallet size={20} />, label: 'Income', hasSubmenu: true },
  { icon: <Tag size={20} />, label: 'Promote', hasSubmenu: true },
  { icon: <HelpCircle size={20} />, label: 'Help', hasSubmenu: true },
]

export function Sidebar() {
  const user = useUser()

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <LayoutDashboard size={24} />
        </div>
        <span className={styles.logoText}>Dashboard</span>
        <span className={styles.version}>v.01</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`${styles.navItem} ${item.active ? styles.active : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.hasSubmenu && (
              <ChevronRight size={16} className={styles.chevron} aria-hidden="true" />
            )}
          </a>
        ))}
      </nav>

      <div className={styles.userProfile}>
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className={styles.userAvatar}
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userRole}>{user.role}</span>
        </div>
      </div>
    </aside>
  )
}
