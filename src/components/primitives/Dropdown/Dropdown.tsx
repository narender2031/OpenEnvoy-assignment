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
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const selectedOption = options.find(opt => opt.value === value)
  const selectedIndex = options.findIndex(opt => opt.value === value)

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    // Return focus to trigger after selection
    triggerRef.current?.focus()
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        triggerRef.current?.focus()
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : options.length - 1)
        }
        break
    }
  }, [isOpen, selectedIndex, options.length])

  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % options.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev - 1 + options.length) % options.length)
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value)
        }
        break
      case 'Tab':
        // Close menu on tab and let natural tab order continue
        setIsOpen(false)
        break
    }
  }, [options, focusedIndex, handleSelect])

  // Focus the option when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus()
    }
  }, [isOpen, focusedIndex])

  // Reset focused index when menu opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    } else {
      setFocusedIndex(-1)
    }
  }, [isOpen, selectedIndex])

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
          ref={triggerRef}
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel ?? label}
          aria-activedescendant={isOpen && focusedIndex >= 0 ? `option-${options[focusedIndex]?.value}` : undefined}
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
            className={styles.menu}
            role="listbox"
            aria-label={ariaLabel ?? label}
            onKeyDown={handleMenuKeyDown}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                ref={(el) => { optionRefs.current[index] = el }}
                id={`option-${option.value}`}
                type="button"
                className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                role="option"
                aria-selected={option.value === value}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => handleSelect(option.value)}
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
