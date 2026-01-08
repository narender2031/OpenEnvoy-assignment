import { ReactNode } from 'react'
import { Sidebar } from './Sidebar/Sidebar'
import { TopBar } from './TopBar/TopBar'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
