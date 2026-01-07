import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  Tag,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
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
  return (
    <aside className={styles.sidebar}>
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
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.hasSubmenu && (
              <ChevronRight size={16} className={styles.chevron} />
            )}
          </a>
        ))}
      </nav>

      <div className={styles.userProfile}>
        <img
          src="https://i.pravatar.cc/40?img=8"
          alt="Evano"
          className={styles.userAvatar}
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>Evano</span>
          <span className={styles.userRole}>Project Manager</span>
        </div>
      </div>
    </aside>
  )
}
