import { TrendingUp, TrendingDown } from 'lucide-react'
import styles from './TrendIndicator.module.css'

export interface TrendIndicatorProps {
  /** The trend percentage value (positive = up, negative = down) */
  value: number
  /** Optional suffix text (e.g., "this month") */
  suffix?: string
}

export function TrendIndicator({ value, suffix }: TrendIndicatorProps) {
  const isPositive = value >= 0
  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <span
      className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}
      aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(value)}%${suffix ? ` ${suffix}` : ''}`}
    >
      <Icon size={16} aria-hidden="true" />
      <span className={styles.value}>{Math.abs(value)}%</span>
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </span>
  )
}
