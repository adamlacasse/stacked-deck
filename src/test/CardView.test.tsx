import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SWIPE_THRESHOLD_PX } from '../constants'
import { CardView } from '../components/CardView'
import { CATEGORY_ORDER, type DeckCategoryMeta, type TriviaCard } from '../types'

function makeCard(): TriviaCard {
  return {
    id: 'card-1',
    entries: CATEGORY_ORDER.map((category) => ({
      category,
      question: `Question for ${category}`,
      answer: `Answer for ${category}`,
    })) as TriviaCard['entries'],
  }
}

function getCardShell() {
  const title = screen.getByRole('heading', { name: 'Pick a category' })
  const shell = title.closest('section')
  expect(shell).not.toBeNull()
  return shell as HTMLElement
}

const customCategoryMeta: DeckCategoryMeta = {
  geography: {
    label: 'Foundations',
    prompt: 'Definitions and core distinctions',
  },
}

describe('CardView', () => {
  it('renders deck-specific category labels and prompts when provided', () => {
    render(
      <CardView
        card={makeCard()}
        deckName="General Knowledge"
        categoryMeta={customCategoryMeta}
        selectedCategory={null}
        selectedEntry={null}
        answerRevealed={false}
        onSelectCategory={vi.fn()}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
        remainingCount={5}
      />,
    )

    expect(screen.getByRole('button', { name: /foundations/i })).toBeInTheDocument()
    expect(screen.getByText('Definitions and core distinctions')).toBeInTheDocument()
  })

  it('delegates category selection from the category list', () => {
    const onSelectCategory = vi.fn()

    render(
      <CardView
        card={makeCard()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory={null}
        selectedEntry={null}
        answerRevealed={false}
        onSelectCategory={onSelectCategory}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
        remainingCount={5}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /entertainment/i }))

    expect(onSelectCategory).toHaveBeenCalledTimes(1)
    expect(onSelectCategory).toHaveBeenCalledWith('entertainment')
  })

  it('wires question-state modal actions to callbacks', () => {
    const card = makeCard()
    const onCloseQuestion = vi.fn()
    const onRevealAnswer = vi.fn()

    render(
      <CardView
        card={card}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory="geography"
        selectedEntry={card.entries[0]}
        answerRevealed={false}
        onSelectCategory={vi.fn()}
        onCloseQuestion={onCloseQuestion}
        onRevealAnswer={onRevealAnswer}
        onNextCard={vi.fn()}
        remainingCount={5}
      />,
    )

    expect(screen.getByRole('dialog', { name: /question/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reveal answer' }))
    fireEvent.click(screen.getByRole('button', { name: 'Back to categories' }))

    expect(onRevealAnswer).toHaveBeenCalledTimes(1)
    expect(onCloseQuestion).toHaveBeenCalledTimes(1)
  })

  it('wires answer-state modal actions to callbacks', () => {
    const card = makeCard()
    const onCloseQuestion = vi.fn()
    const onNextCard = vi.fn()

    render(
      <CardView
        card={card}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory="geography"
        selectedEntry={card.entries[0]}
        answerRevealed
        onSelectCategory={vi.fn()}
        onCloseQuestion={onCloseQuestion}
        onRevealAnswer={vi.fn()}
        onNextCard={onNextCard}
        remainingCount={5}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Answer' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next card' }))
    fireEvent.click(screen.getByRole('button', { name: 'Back to categories' }))

    expect(onNextCard).toHaveBeenCalledTimes(1)
    expect(onCloseQuestion).toHaveBeenCalledTimes(1)
  })

  it('advances on a qualifying horizontal swipe after reveal', () => {
    const onNextCard = vi.fn()

    render(
      <CardView
        card={makeCard()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory={null}
        selectedEntry={null}
        answerRevealed
        onSelectCategory={vi.fn()}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={onNextCard}
        remainingCount={5}
      />,
    )

    const shell = getCardShell()

    fireEvent.pointerDown(shell, { clientX: 20, clientY: 20 })
    fireEvent.pointerUp(shell, {
      clientX: 20 + SWIPE_THRESHOLD_PX + 10,
      clientY: 24,
    })

    expect(onNextCard).toHaveBeenCalledTimes(1)
  })

  it('does not advance on a qualifying swipe before reveal', () => {
    const onNextCard = vi.fn()

    render(
      <CardView
        card={makeCard()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory={null}
        selectedEntry={null}
        answerRevealed={false}
        onSelectCategory={vi.fn()}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={onNextCard}
        remainingCount={5}
      />,
    )

    const shell = getCardShell()

    fireEvent.pointerDown(shell, { clientX: 20, clientY: 20 })
    fireEvent.pointerUp(shell, {
      clientX: 20 + SWIPE_THRESHOLD_PX + 10,
      clientY: 24,
    })

    expect(onNextCard).not.toHaveBeenCalled()
  })

  it('does not advance on vertical-dominant movement', () => {
    const onNextCard = vi.fn()

    render(
      <CardView
        card={makeCard()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory={null}
        selectedEntry={null}
        answerRevealed
        onSelectCategory={vi.fn()}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={onNextCard}
        remainingCount={5}
      />,
    )

    const shell = getCardShell()

    fireEvent.pointerDown(shell, { clientX: 20, clientY: 20 })
    fireEvent.pointerUp(shell, {
      clientX: 20 + SWIPE_THRESHOLD_PX + 15,
      clientY: 20 + SWIPE_THRESHOLD_PX + 35,
    })

    expect(onNextCard).not.toHaveBeenCalled()
  })

  it('does not advance after pointer cancellation', () => {
    const onNextCard = vi.fn()

    render(
      <CardView
        card={makeCard()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        selectedCategory={null}
        selectedEntry={null}
        answerRevealed
        onSelectCategory={vi.fn()}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={onNextCard}
        remainingCount={5}
      />,
    )

    const shell = getCardShell()

    fireEvent.pointerDown(shell, { clientX: 20, clientY: 20 })
    fireEvent.pointerCancel(shell)
    fireEvent.pointerUp(shell, {
      clientX: 20 + SWIPE_THRESHOLD_PX + 20,
      clientY: 20,
    })

    expect(onNextCard).not.toHaveBeenCalled()
  })
})
