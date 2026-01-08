import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { TopBar } from './TopBar/TopBar'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className={styles.layout}>
      <Sidebar
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />
      <div className={styles.main}>
        <TopBar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
