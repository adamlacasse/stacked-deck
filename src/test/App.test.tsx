import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { TriviaDeck } from '../types'

const deckState = vi.hoisted(() => ({
  decks: [] as TriviaDeck[],
}))

vi.mock('../data/deck', () => ({
  get availableDecks() {
    return deckState.decks
  },
  get defaultDeck() {
    return deckState.decks[0]
  },
}))

import App from '../App'

function makeDeck(id: string, name: string): TriviaDeck {
  return {
    id,
    name,
    description: `${name} description`,
    cards: [
      {
        id: `${id}-card-1`,
        entries: [
          { category: 'geography', question: 'Q1', answer: 'A1' },
          { category: 'entertainment', question: 'Q2', answer: 'A2' },
          { category: 'history', question: 'Q3', answer: 'A3' },
          { category: 'arts', question: 'Q4', answer: 'A4' },
          { category: 'science', question: 'Q5', answer: 'A5' },
          { category: 'sports', question: 'Q6', answer: 'A6' },
        ],
      },
    ],
  }
}

const deckA = makeDeck('deck-a', 'Deck A')
const deckB = makeDeck('deck-b', 'Deck B')

describe('App deck picker', () => {
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it('shows the deck picker when more than one deck is registered', () => {
    deckState.decks = [deckA, deckB]

    render(<App />)

    const deckGroup = screen.getByRole('group', { name: 'Deck' })
    const deckAButton = screen.getByRole('button', { name: 'Deck A' })
    const deckBButton = screen.getByRole('button', { name: 'Deck B' })

    expect(deckGroup).toContainElement(deckAButton)
    expect(deckGroup).toContainElement(deckBButton)
    expect(deckAButton).toHaveAttribute('aria-pressed', 'true')
    expect(deckBButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText(`${deckA.name} description`)).toBeInTheDocument()
  })

  it('switches the active deck when another deck is selected', () => {
    deckState.decks = [deckA, deckB]

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Deck B' }))

    expect(screen.getByRole('button', { name: 'Deck B' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Deck A' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByText(`${deckB.name} description`)).toBeInTheDocument()
  })

  it('hides the deck picker when only one deck is registered', () => {
    deckState.decks = [deckA]

    render(<App />)

    expect(screen.queryByRole('group', { name: 'Deck' })).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Difficulty' })).toBeInTheDocument()
    expect(screen.getByText('Deck A')).toBeInTheDocument()
  })
})
