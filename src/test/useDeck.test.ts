import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
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
  vi.useRealTimers()
})

beforeEach(() => {
  vi.useFakeTimers()
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
  it('shows shuffling state before the card is drawn', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => { result.current.startGame() })
    expect(result.current.isShuffling).toBe(true)
    expect(result.current.phase).toBe('idle')
  })

  it('transitions to active phase and draws a card after shuffle', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    expect(result.current.isShuffling).toBe(false)
    expect(result.current.phase).toBe('active')
    expect(result.current.currentCard).not.toBeNull()
  })

  it('does not draw a new card if one is already active', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    const firstCardId = result.current.currentCard?.id
    await act(async () => result.current.startGame())
    expect(result.current.currentCard?.id).toBe(firstCardId)
  })

  it('decrements remainingCount after drawing a card', async () => {
    const { result } = renderHook(() => useDeck(multiCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    expect(result.current.remainingCount).toBe(2)
    expect(result.current.usedCount).toBe(1)
  })
})

describe('useDeck – drawNextCard (non-repeating draws)', () => {
  it('never repeats a card within a session', async () => {
    const { result } = renderHook(() => useDeck(multiCardDeck))
    const seen = new Set<string>()

    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    seen.add(result.current.currentCard!.id)

    await act(async () => result.current.drawNextCard())
    seen.add(result.current.currentCard!.id)

    await act(async () => result.current.drawNextCard())
    seen.add(result.current.currentCard!.id)

    expect(seen.size).toBe(3)
  })

  it('enters finished phase when all cards are used', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.drawNextCard())
    expect(result.current.phase).toBe('finished')
    expect(result.current.currentCard).toBeNull()
  })
})

describe('useDeck – selectCategory', () => {
  it('sets selectedCategory', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.selectCategory('science'))
    expect(result.current.selectedCategory).toBe('science')
  })

  it('resets answerRevealed when a new category is selected', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.selectCategory('science'))
    await act(async () => result.current.revealAnswer())
    expect(result.current.answerRevealed).toBe(true)
    await act(async () => result.current.selectCategory('history'))
    expect(result.current.answerRevealed).toBe(false)
  })

  it('provides the correct selectedEntry', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.selectCategory('geography'))
    expect(result.current.selectedEntry?.category).toBe('geography')
  })
})

describe('useDeck – revealAnswer', () => {
  it('sets answerRevealed to true', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.selectCategory('arts'))
    await act(async () => result.current.revealAnswer())
    expect(result.current.answerRevealed).toBe(true)
  })
})

describe('useDeck – resetSession', () => {
  it('clears the session and returns to idle phase', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.resetSession())
    expect(result.current.phase).toBe('idle')
    expect(result.current.currentCard).toBeNull()
    expect(result.current.usedCount).toBe(0)
  })

  it('clears localStorage', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.resetSession())
    const stored = window.localStorage.getItem('stacked-deck-session')
    const parsed = JSON.parse(stored!)
    expect(parsed.usedCardIds).toEqual([])
    expect(parsed.currentCardId).toBeNull()
  })
})

describe('useDeck – restartGame', () => {
  it('shows shuffling state before drawing a fresh card', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.drawNextCard())
    expect(result.current.phase).toBe('finished')

    await act(async () => { result.current.restartGame() })
    expect(result.current.isShuffling).toBe(true)
  })

  it('clears used cards and draws a fresh card', async () => {
    const { result } = renderHook(() => useDeck(singleCardDeck))
    await act(async () => {
      result.current.startGame()
      vi.runAllTimers()
    })
    await act(async () => result.current.drawNextCard())
    expect(result.current.phase).toBe('finished')

    await act(async () => {
      result.current.restartGame()
      vi.runAllTimers()
    })
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

