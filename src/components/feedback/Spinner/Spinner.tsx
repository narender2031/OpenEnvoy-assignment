import styles from './Spinner.module.css'

export interface SpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg'
  /** Optional label for screen readers */
  label?: string
}

export function Spinner({ size = 'md', label = 'Loading' }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}
