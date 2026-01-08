import styles from './AvatarGroup.module.css'

export interface AvatarGroupProps {
  /** Array of avatar image URLs */
  avatars: string[]
  /** Maximum number of avatars to display before showing +N */
  max?: number
  /** Size of each avatar in pixels */
  size?: number
}

export function AvatarGroup({ avatars, max = 5, size = 32 }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div
      className={styles.group}
      role="group"
      aria-label={`${avatars.length} users`}
    >
      {displayAvatars.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          className={styles.avatar}
          style={{
            width: size,
            height: size,
            zIndex: displayAvatars.length - index,
          }}
        />
      ))}
      {remaining > 0 && (
        <span
          className={styles.more}
          style={{ width: size, height: size }}
          aria-label={`and ${remaining} more`}
        >
          +{remaining}
        </span>
      )}
    </div>
  )
}
