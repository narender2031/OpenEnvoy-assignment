import { ReactNode } from 'react'
import styles from './Badge.module.css'

export interface BadgeProps {
  variant: 'success' | 'danger'
  children: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  )
}
