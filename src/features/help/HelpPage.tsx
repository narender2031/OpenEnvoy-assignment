import { useEffect, useCallback, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchCategories,
  fetchFAQs,
  selectCategories,
  selectFAQs,
  selectCategoriesStatus,
  selectFAQsStatus,
  selectSelectedCategory,
  setSelectedCategory,
} from './helpSlice'
import { SearchInput, Spinner, ErrorState } from '@/components'
import { getIcon } from '@/config'
import type { IconName } from '@/config'
import styles from './HelpPage.module.css'

export function HelpPage() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const faqs = useAppSelector(selectFAQs)
  const categoriesStatus = useAppSelector(selectCategoriesStatus)
  const faqsStatus = useAppSelector(selectFAQsStatus)
  const selectedCategory = useAppSelector(selectSelectedCategory)

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchFAQs())
  }, [dispatch])

  const handleCategoryClick = useCallback(
    (categoryName: string | null) => {
      dispatch(setSelectedCategory(categoryName))
      if (categoryName) {
        dispatch(fetchFAQs(categoryName))
      } else {
        dispatch(fetchFAQs())
      }
    },
    [dispatch]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    },
    []
  )

  const toggleFaq = useCallback((faqId: string) => {
    setExpandedFaq(prev => prev === faqId ? null : faqId)
  }, [])

  const handleRetry = useCallback(() => {
    dispatch(fetchCategories())
    dispatch(fetchFAQs())
  }, [dispatch])

  const filteredFaqs = searchQuery
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

  if (categoriesStatus === 'failed') {
    return (
      <div className={styles.page}>
        <ErrorState message="Failed to load help content" onRetry={handleRetry} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Help Center</h1>
        <p>Find answers to common questions and learn how to use our platform.</p>
        <div className={styles.searchContainer}>
          <SearchInput
            placeholder="Search for help..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search help articles"
          />
        </div>
      </header>

      {/* Categories */}
      {categoriesStatus === 'loading' && (
        <div className={styles.loadingState}>
          <Spinner size="lg" label="Loading categories" />
        </div>
      )}

      {categoriesStatus === 'succeeded' && !searchQuery && (
        <section className={styles.categoriesSection}>
          <h2>Browse by Category</h2>
          <div className={styles.categoriesGrid}>
            <button
              className={`${styles.categoryCard} ${selectedCategory === null ? styles.active : ''}`}
              onClick={() => handleCategoryClick(null)}
            >
              <div className={styles.categoryIcon}>
                <span>All</span>
              </div>
              <div className={styles.categoryInfo}>
                <h3>All Topics</h3>
                <p>Browse all FAQ items</p>
              </div>
            </button>
            {categories.map((category) => {
              const Icon = getIcon(category.icon as IconName)
              return (
                <button
                  key={category.id}
                  className={`${styles.categoryCard} ${selectedCategory === category.name ? styles.active : ''}`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className={styles.categoryIcon}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.categoryInfo}>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className={styles.faqSection}>
        <h2>
          {searchQuery
            ? `Search Results (${filteredFaqs.length})`
            : selectedCategory
            ? `${selectedCategory} FAQs`
            : 'Frequently Asked Questions'}
        </h2>

        {faqsStatus === 'loading' && (
          <div className={styles.loadingState}>
            <Spinner size="md" label="Loading FAQs" />
          </div>
        )}

        {faqsStatus === 'succeeded' && filteredFaqs.length === 0 && (
          <div className={styles.emptyState}>
            <p>No FAQs found. Try a different search or category.</p>
          </div>
        )}

        {faqsStatus === 'succeeded' && filteredFaqs.length > 0 && (
          <div className={styles.faqList}>
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={expandedFaq === faq.id}
                >
                  <span>{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                    <span className={styles.faqCategory}>{faq.category}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
