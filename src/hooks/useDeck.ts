import { useEffect, useMemo, useRef, useState } from 'react'

import type { Category, Difficulty, GameSession, TriviaCard, TriviaDeck } from '../types'

const STORAGE_KEY = 'stacked-deck-session'
const SHUFFLE_DELAY_MS = 400

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function createEmptySession(): GameSession {
  return {
    currentCardId: null,
    selectedCategory: null,
    answerRevealed: false,
    usedCardIds: [],
  }
}

function loadSession(): GameSession {
  if (typeof window === 'undefined') {
    return createEmptySession()
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return createEmptySession()
    }

    const parsed = JSON.parse(stored) as Partial<GameSession>

    return {
      currentCardId:
        typeof parsed.currentCardId === 'string' ? parsed.currentCardId : null,
      selectedCategory:
        typeof parsed.selectedCategory === 'string'
          ? (parsed.selectedCategory as Category)
          : null,
      answerRevealed: Boolean(parsed.answerRevealed),
      usedCardIds: Array.isArray(parsed.usedCardIds)
        ? parsed.usedCardIds.filter(
            (cardId): cardId is string => typeof cardId === 'string',
          )
        : [],
    }
  } catch {
    return createEmptySession()
  }
}

function drawCard(cards: TriviaCard[], usedCardIds: string[]): TriviaCard | null {
  const availableCards = cards.filter((card) => !usedCardIds.includes(card.id))

  if (availableCards.length === 0) {
    return null
  }

  const nextIndex = Math.floor(Math.random() * availableCards.length)

  return availableCards[nextIndex] ?? null
}

function createSessionForNextCard(
  cards: TriviaCard[],
  usedCardIds: string[],
): GameSession {
  const nextCard = drawCard(cards, usedCardIds)

  if (!nextCard) {
    return {
      currentCardId: null,
      selectedCategory: null,
      answerRevealed: false,
      usedCardIds,
    }
  }

  return {
    currentCardId: nextCard.id,
    selectedCategory: null,
    answerRevealed: false,
    usedCardIds: [...usedCardIds, nextCard.id],
  }
}

export function useDeck(deck: TriviaDeck) {
  const [session, setSession] = useState<GameSession>(() => loadSession())
  const [isShuffling, setIsShuffling] = useState(false)
  const [difficultyFilter, setDifficultyFilterState] = useState<Difficulty | 'all'>('all')
  const shuffleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current !== null) {
        clearTimeout(shuffleTimerRef.current)
      }
    }
  }, [])

  const filteredCards = useMemo(() => {
    if (difficultyFilter === 'all') return deck.cards
    return deck.cards.filter((card) => card.difficulty === difficultyFilter)
  }, [deck.cards, difficultyFilter])

  const currentCard =
    deck.cards.find((card) => card.id === session.currentCardId) ?? null
  const selectedEntry =
    currentCard?.entries.find((entry) => entry.category === session.selectedCategory) ??
    null
  const remainingCount = filteredCards.filter(
    (card) => !session.usedCardIds.includes(card.id),
  ).length

  const phase = currentCard
    ? 'active'
    : session.usedCardIds.length > 0 && remainingCount === 0
      ? 'finished'
      : 'idle'

  function triggerShuffle(drawSession: () => void) {
    if (prefersReducedMotion()) {
      drawSession()
      return
    }

    if (shuffleTimerRef.current !== null) {
      clearTimeout(shuffleTimerRef.current)
    }

    setIsShuffling(true)
    shuffleTimerRef.current = setTimeout(() => {
      setIsShuffling(false)
      drawSession()
    }, SHUFFLE_DELAY_MS)
  }

  function startGame() {
    if (session.currentCardId || isShuffling) return

    const cardsToUse = filteredCards
    triggerShuffle(() => {
      setSession((currentSession) => createSessionForNextCard(cardsToUse, currentSession.usedCardIds))
    })
  }

  function selectCategory(category: Category) {
    setSession((currentSession) => ({
      ...currentSession,
      selectedCategory: category,
      answerRevealed: false,
    }))
  }

  function revealAnswer() {
    setSession((currentSession) => ({
      ...currentSession,
      answerRevealed: true,
    }))
  }

  function drawNextCard() {
    const cardsToUse = filteredCards
    setSession((currentSession) =>
      createSessionForNextCard(cardsToUse, currentSession.usedCardIds),
    )
  }

  function resetSession() {
    setSession(createEmptySession())
  }

  function restartGame() {
    if (isShuffling) return

    const cardsToUse = filteredCards
    triggerShuffle(() => {
      setSession(createSessionForNextCard(cardsToUse, []))
    })
  }

  function setDifficultyFilter(filter: Difficulty | 'all') {
    if (phase === 'active') return
    setDifficultyFilterState(filter)
  }

  return {
    phase,
    currentCard,
    selectedCategory: session.selectedCategory,
    selectedEntry,
    answerRevealed: session.answerRevealed,
    usedCount: session.usedCardIds.length,
    remainingCount,
    deckSize: filteredCards.length,
    deckName: deck.name,
    startGame,
    selectCategory,
    revealAnswer,
    drawNextCard,
    resetSession,
    restartGame,
    isShuffling,
    difficultyFilter,
    setDifficultyFilter,
  }
}
