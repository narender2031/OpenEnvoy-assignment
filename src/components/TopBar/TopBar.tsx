import { Search } from 'lucide-react'
import styles from './TopBar.module.css'

export function TopBar() {
  return (
    <header className={styles.topBar}>
      <h1 className={styles.greeting}>
        Hello Evano <span className={styles.wave}>👋</span>,
      </h1>

      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>
    </header>
  )
}
