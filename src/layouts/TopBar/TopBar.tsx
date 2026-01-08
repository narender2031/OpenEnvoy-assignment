import { Search } from 'lucide-react'
import { useUser } from '@/contexts'
import styles from './TopBar.module.css'

export function TopBar() {
  const user = useUser()

  return (
    <header className={styles.topBar}>
      <h1 className={styles.greeting}>
        Hello {user.name} <span className={styles.wave} aria-hidden="true">👋</span>,
      </h1>

      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search"
          className={styles.searchInput}
          aria-label="Global search"
        />
      </div>
    </header>
  )
}
