import { describe, expect, it } from 'vitest'

import { normalizeDeck } from '../data/normalizeDeck'
import { validateDeck } from '../data/validateDeck'
import { CATEGORY_ORDER } from '../types'
import type { TriviaDeck } from '../types'

const courseCategoryMeta = {
  geography: {
    label: 'Foundations',
    prompt: 'Core ideas, definitions, and distinctions',
  },
  entertainment: {
    label: 'Architectures',
    prompt: 'Model families, layer roles, and structure',
  },
  history: {
    label: 'Training',
    prompt: 'Optimization, convergence, and regularization',
  },
  arts: {
    label: 'Math & Loss',
    prompt: 'Formulas, metrics, objectives, and notation',
  },
  science: {
    label: 'Frameworks',
    prompt: 'PyTorch, TensorFlow, Keras, and tooling',
  },
  sports: {
    label: 'Applications',
    prompt: 'Real-world use cases and assignment contexts',
  },
} satisfies TriviaDeck['categoryMeta']

function makeLaneEntries() {
  return [
    'Foundations',
    'Architectures',
    'Training',
    'Math & Loss',
    'Frameworks',
    'Applications',
  ].map((lane) => ({
    lane,
    question: `${lane} question?`,
    answer: `${lane} answer`,
  }))
}

describe('normalizeDeck', () => {
  it('accepts lane-based entries without source metadata', () => {
    const deck = normalizeDeck({
      id: 'csc-6314-study-guide',
      name: 'CSC-6314 Study Guide',
      categoryMeta: courseCategoryMeta,
      cards: [
        {
          id: 'dl-card-0001',
          difficulty: 'easy',
          tags: ['deep-learning'],
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
