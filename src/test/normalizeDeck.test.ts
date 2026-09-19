import { describe, expect, it } from 'vitest'

import { normalizeDeck } from '../data/normalizeDeck'
import { validateDeck } from '../data/validateDeck'
import { CATEGORY_ORDER } from '../types'
import type { TriviaDeck } from '../types'

const sampleCategoryMeta = {
  geography: {
    label: 'Rivers',
    prompt: 'Waterways and the places they pass through',
  },
  entertainment: {
    label: 'Films',
    prompt: 'Movies, directors, and casts',
  },
  history: {
    label: 'Wars',
    prompt: 'Conflicts, treaties, and turning points',
  },
  arts: {
    label: 'Painters',
    prompt: 'Artists, movements, and famous works',
  },
  science: {
    label: 'Physics',
    prompt: 'Forces, particles, and laws of nature',
  },
  sports: {
    label: 'Football',
    prompt: 'Clubs, players, and tournaments',
  },
} satisfies TriviaDeck['categoryMeta']

function makeLaneEntries() {
  return ['Rivers', 'Films', 'Wars', 'Painters', 'Physics', 'Football'].map(
    (lane) => ({
      lane,
      question: `${lane} question?`,
      answer: `${lane} answer`,
    }),
  )
}

describe('normalizeDeck', () => {
  it('accepts lane-based entries without source metadata', () => {
    const deck = normalizeDeck({
      id: 'sample-themed-deck',
      name: 'Sample Themed Deck',
      categoryMeta: sampleCategoryMeta,
      cards: [
        {
          id: 'themed-card-0001',
          difficulty: 'easy',
          tags: ['themed'],
          entries: makeLaneEntries(),
        },
      ],
    })

    expect(deck.cards[0]?.entries.map((entry) => entry.category)).toEqual(
      CATEGORY_ORDER,
    )
    expect(deck.cards[0]?.entries[0].source).toBeUndefined()
    expect(validateDeck(deck)).toEqual({ valid: true })
  })

  it('falls back to six-entry order when category and lane are absent', () => {
    const deck = normalizeDeck({
      id: 'simple-deck',
      name: 'Simple Deck',
      cards: [
        {
          id: 'card-1',
          entries: CATEGORY_ORDER.map((category) => ({
            question: `${category} question?`,
            answer: `${category} answer`,
          })),
        },
      ],
    })

    expect(deck.cards[0]?.entries.map((entry) => entry.category)).toEqual(
      CATEGORY_ORDER,
    )
    expect(validateDeck(deck)).toEqual({ valid: true })
  })
})
