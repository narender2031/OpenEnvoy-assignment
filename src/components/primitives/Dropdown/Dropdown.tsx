import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './Dropdown.module.css'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps {
  /** Label displayed before the dropdown */
  label?: string
  /** Options to display in the dropdown */
  options: DropdownOption[]
  /** Currently selected value */
  value: string
  /** Callback when selection changes */
  onChange: (value: string) => void
  /** Placeholder when no value selected */
  placeholder?: string
  /** Accessible label */
  'aria-label'?: string
  /** Additional class name */
  className?: string
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  'aria-label': ariaLabel,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault()
      setIsOpen(true)
    }
  }, [isOpen, handleToggle])

  const handleOptionKeyDown = useCallback((e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(optionValue)
    }
  }, [handleSelect])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className ?? ''}`}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel ?? label}
        >
          <span className={styles.triggerText}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className={styles.menu}
            role="listbox"
            aria-label={ariaLabel ?? label}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check size={16} className={styles.checkIcon} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
