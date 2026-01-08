import { useEffect, useState, useRef } from 'react'
import styles from './LiveRegion.module.css'

export interface LiveRegionProps {
  /** Message to announce to screen readers */
  message: string
  /** Politeness level: polite waits for user idle, assertive interrupts */
  politeness?: 'polite' | 'assertive'
  /** Clear the message after announcing (default: true) */
  clearOnAnnounce?: boolean
  /** Delay before announcing in ms (helps with rapid updates) */
  delay?: number
}

/**
 * LiveRegion - Announces dynamic content changes to screen readers
 *
 * Use this component to notify screen reader users of:
 * - Loading states
 * - Success/error messages
 * - Filter results count changes
 * - Any dynamic content updates
 *
 * @example
 * <LiveRegion message={isLoading ? 'Loading...' : `Found ${count} results`} />
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearOnAnnounce = true,
  delay = 100,
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('')
  const timeoutRef = useRef<number>()

  useEffect(() => {
    if (!message) {
      setAnnouncement('')
      return
    }

    // Clear any pending timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    // Delay announcement to batch rapid updates
    timeoutRef.current = window.setTimeout(() => {
      setAnnouncement(message)

      if (clearOnAnnounce) {
        // Clear after screen reader has time to announce
        timeoutRef.current = window.setTimeout(() => {
          setAnnouncement('')
        }, 1000)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [message, clearOnAnnounce, delay])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={styles.srOnly}
    >
      {announcement}
    </div>
  )
}
