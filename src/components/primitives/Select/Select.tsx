import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Label displayed before the select */
  label?: string
  /** Options to display in the select */
  options: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => {
    return (
      <div className={`${styles.container} ${className ?? ''}`}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            className={styles.select}
            aria-label={props['aria-label'] ?? label}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className={styles.icon}
            aria-hidden="true"
          />
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'
