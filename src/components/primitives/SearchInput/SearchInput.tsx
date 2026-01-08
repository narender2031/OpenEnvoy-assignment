import { InputHTMLAttributes, forwardRef } from 'react'
import { Search } from 'lucide-react'
import styles from './SearchInput.module.css'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Width of the input container */
  width?: string | number
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ width, className, ...props }, ref) => {
    return (
      <div
        className={`${styles.container} ${className ?? ''}`}
        style={{ width }}
      >
        <Search
          size={18}
          className={styles.icon}
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="search"
          className={styles.input}
          aria-label={props['aria-label'] ?? 'Search'}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
