import { ReactNode, HTMLAttributes } from 'react'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Shadow elevation */
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  /** Border radius */
  radius?: 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  padding = 'lg',
  elevation = 'sm',
  radius = 'lg',
  className,
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`padding-${padding}`],
    styles[`elevation-${elevation}`],
    styles[`radius-${radius}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}
