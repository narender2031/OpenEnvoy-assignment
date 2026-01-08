import { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode
  /** Main title */
  title: string
  /** Description text */
  description?: string
  /** Optional action button/content */
  action?: ReactNode
}

export function EmptyState({
  icon = <Inbox size={48} />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.container} role="status">
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
