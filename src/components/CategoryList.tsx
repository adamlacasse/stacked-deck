import type { CSSProperties } from 'react'

import { getCategoryMeta } from '../data/categories'
import type { CardEntry, Category, DeckCategoryMeta } from '../types'
import styles from './CategoryList.module.css'

type CategoryListProps = {
  entries: CardEntry[]
  categoryMeta?: DeckCategoryMeta
  selectedCategory: Category | null
  onSelectCategory: (category: Category) => void
}

export function CategoryList({
  entries,
  categoryMeta,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className={styles.list}>
      {entries.map((entry, index) => {
        const meta = getCategoryMeta(entry.category, categoryMeta)
        const isSelected = selectedCategory === entry.category

        return (
          <button
            key={entry.category}
            type="button"
            className={styles.categoryButton}
            data-selected={isSelected}
            aria-pressed={isSelected}
            style={{ '--category-accent': meta.accent } as CSSProperties}
            onClick={() => onSelectCategory(entry.category)}
          >
            <span className={styles.badge}>#{index + 1}</span>
            <span className={styles.label}>{meta.label}</span>
            <span className={styles.prompt}>{meta.prompt}</span>
          </button>
        )
      })}
    </div>
  )
}
