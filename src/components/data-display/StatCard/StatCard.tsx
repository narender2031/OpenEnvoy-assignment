import { ReactNode } from 'react'
import styles from './StatCard.module.css'

export interface StatCardProps {
  /** Icon to display */
  icon: ReactNode
  /** Icon background color class */
  iconBg?: 'green' | 'purple' | 'blue'
  /** Title/label of the stat */
  title: string
  /** Main value to display */
  value: string | number
  /** Optional footer content (trend indicator, avatars, etc.) */
  footer?: ReactNode
}

export function StatCard({
  icon,
  iconBg = 'green',
  title,
  value,
  footer,
}: StatCardProps) {
  return (
    <article className={styles.card} aria-label={`${title}: ${value}`}>
      <div className={`${styles.iconWrapper} ${styles[iconBg]}`}>
        {icon}
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <strong className={styles.value}>{value}</strong>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </article>
  )
}
