import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import styles from './ErrorState.module.css'

export interface ErrorStateProps {
  /** Icon to display */
  icon?: ReactNode
  /** Main title */
  title?: string
  /** Error message */
  message: string
  /** Optional retry action */
  onRetry?: () => void
  /** Custom retry button text */
  retryText?: string
}

export function ErrorState({
  icon = <AlertCircle size={48} />,
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try again',
}: ErrorStateProps) {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
        >
          {retryText}
        </button>
      )}
    </div>
  )
}
