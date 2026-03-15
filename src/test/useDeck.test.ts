import { renderHook, act } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { useDeck } from '../hooks/useDeck'
import type { TriviaDeck } from '../types'

const makeEntry = (category: string, q = 'Q?', a = 'A') => ({
  category,
  question: q,
  answer: a,
})

function makeCard(id: string) {
  return {
    id,
    entries: [
      makeEntry('geography'),
      makeEntry('entertainment'),
      makeEntry('history'),
      makeEntry('arts'),
      makeEntry('science'),
      makeEntry('sports'),
    ] as TriviaDeck['cards'][number]['entries'],
  }
}

const singleCardDeck: TriviaDeck = {
  id: 'test-deck',
  name: 'Test Deck',
  cards: [makeCard('c1')],
}

const multiCardDeck: TriviaDeck = {
  id: 'test-deck',
  name: 'Test Deck',
  cards: [makeCard('c1'), makeCard('c2'), makeCard('c3')],
}

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe('useDeck – initial state', () => {
  it('starts in idle phase with no current card', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    expect(result.current.phase).toBe('idle')
    expect(result.current.currentCard).toBeNull()
  })

  it('reports correct deck size and remaining count', () => {
    const { result } = renderHook(() => useDeck(multiCardDeck))
    expect(result.current.deckSize).toBe(3)
    expect(result.current.remainingCount).toBe(3)
  })
})

describe('useDeck – startGame', () => {
  it('transitions to active phase and draws a card', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    expect(result.current.phase).toBe('active')
    expect(result.current.currentCard).not.toBeNull()
  })

  it('does not draw a new card if one is already active', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    const firstCardId = result.current.currentCard?.id
    act(() => result.current.startGame())
    expect(result.current.currentCard?.id).toBe(firstCardId)
  })

  it('decrements remainingCount after drawing a card', () => {
    const { result } = renderHook(() => useDeck(multiCardDeck))
    act(() => result.current.startGame())
    expect(result.current.remainingCount).toBe(2)
    expect(result.current.usedCount).toBe(1)
  })
})

describe('useDeck – drawNextCard (non-repeating draws)', () => {
  it('never repeats a card within a session', () => {
    const { result } = renderHook(() => useDeck(multiCardDeck))
    const seen = new Set<string>()

    act(() => result.current.startGame())
    seen.add(result.current.currentCard!.id)

    act(() => result.current.drawNextCard())
    seen.add(result.current.currentCard!.id)

    act(() => result.current.drawNextCard())
    seen.add(result.current.currentCard!.id)

    expect(seen.size).toBe(3)
  })

  it('enters finished phase when all cards are used', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.drawNextCard())
    expect(result.current.phase).toBe('finished')
    expect(result.current.currentCard).toBeNull()
  })
})

describe('useDeck – selectCategory', () => {
  it('sets selectedCategory', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.selectCategory('science'))
    expect(result.current.selectedCategory).toBe('science')
  })

  it('resets answerRevealed when a new category is selected', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.selectCategory('science'))
    act(() => result.current.revealAnswer())
    expect(result.current.answerRevealed).toBe(true)
    act(() => result.current.selectCategory('history'))
    expect(result.current.answerRevealed).toBe(false)
  })

  it('provides the correct selectedEntry', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.selectCategory('geography'))
    expect(result.current.selectedEntry?.category).toBe('geography')
  })
})

describe('useDeck – revealAnswer', () => {
  it('sets answerRevealed to true', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.selectCategory('arts'))
    act(() => result.current.revealAnswer())
    expect(result.current.answerRevealed).toBe(true)
  })
})

describe('useDeck – resetSession', () => {
  it('clears the session and returns to idle phase', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.resetSession())
    expect(result.current.phase).toBe('idle')
    expect(result.current.currentCard).toBeNull()
    expect(result.current.usedCount).toBe(0)
  })

  it('clears localStorage', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.resetSession())
    const stored = window.localStorage.getItem('stacked-deck-session')
    const parsed = JSON.parse(stored!)
    expect(parsed.usedCardIds).toEqual([])
    expect(parsed.currentCardId).toBeNull()
  })
})

describe('useDeck – restartGame', () => {
  it('clears used cards and draws a fresh card', () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    act(() => result.current.startGame())
    act(() => result.current.drawNextCard())
    expect(result.current.phase).toBe('finished')

    act(() => result.current.restartGame())
    expect(result.current.phase).toBe('active')
    expect(result.current.currentCard).not.toBeNull()
    expect(result.current.usedCount).toBe(1)
  })
})

describe('useDeck – localStorage persistence', () => {
  it('restores an in-progress session on mount', () => {
    const session = {
      currentCardId: 'c2',
      selectedCategory: 'history',
      answerRevealed: false,
      usedCardIds: ['c1', 'c2'],
    }
    window.localStorage.setItem('stacked-deck-session', JSON.stringify(session))

    const { result } = renderHook(() => useDeck(multiCardDeck))
    expect(result.current.phase).toBe('active')
    expect(result.current.currentCard?.id).toBe('c2')
    expect(result.current.selectedCategory).toBe('history')
    expect(result.current.usedCount).toBe(2)
  })
})
