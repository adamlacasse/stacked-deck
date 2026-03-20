import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryList } from '../components/CategoryList'
import { CATEGORY_META } from '../data/categories'
import { CATEGORY_ORDER, type TriviaCard } from '../types'

function makeEntries(): TriviaCard['entries'] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    question: `Question for ${category}`,
    answer: `Answer for ${category}`,
  })) as TriviaCard['entries']
}

describe('CategoryList', () => {
  it('renders all six category buttons in card order', () => {
    render(
      <CategoryList
        entries={makeEntries()}
        selectedCategory={null}
        onSelectCategory={vi.fn()}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(6)
    expect(buttons[0]).toHaveTextContent('#1')
    expect(buttons[5]).toHaveTextContent('#6')
    expect(buttons[0]).toHaveTextContent(CATEGORY_META.geography.label)
    expect(buttons[5]).toHaveTextContent(CATEGORY_META.sports.label)
  })

  it('marks only the selected category button as selected', () => {
    render(
      <CategoryList
        entries={makeEntries()}
        selectedCategory="science"
        onSelectCategory={vi.fn()}
      />,
    )

    const scienceButton = screen.getByRole('button', { name: /science/i })
    const historyButton = screen.getByRole('button', { name: /history/i })

    expect(scienceButton).toHaveAttribute('data-selected', 'true')
    expect(historyButton).toHaveAttribute('data-selected', 'false')
    expect(scienceButton).toHaveAttribute('aria-pressed', 'true')
    expect(historyButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelectCategory with the clicked category', () => {
    const onSelectCategory = vi.fn()

    render(
      <CategoryList
        entries={makeEntries()}
        selectedCategory={null}
        onSelectCategory={onSelectCategory}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /history/i }))

    expect(onSelectCategory).toHaveBeenCalledTimes(1)
    expect(onSelectCategory).toHaveBeenCalledWith('history')
  })
})
