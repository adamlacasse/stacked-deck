import { useEffect, useState } from 'react'

import type { Category, GameSession, TriviaCard, TriviaDeck } from '../types'

const STORAGE_KEY = 'stacked-deck-session'

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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  const currentCard =
    deck.cards.find((card) => card.id === session.currentCardId) ?? null
  const selectedEntry =
    currentCard?.entries.find((entry) => entry.category === session.selectedCategory) ??
    null
  const remainingCount = deck.cards.length - session.usedCardIds.length

  const phase = currentCard
    ? 'active'
    : session.usedCardIds.length > 0 && remainingCount === 0
      ? 'finished'
      : 'idle'

  function startGame() {
    setSession((currentSession) => {
      if (currentSession.currentCardId) {
        return currentSession
      }

      return createSessionForNextCard(deck.cards, currentSession.usedCardIds)
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
    setSession((currentSession) =>
      createSessionForNextCard(deck.cards, currentSession.usedCardIds),
    )
  }

  function resetSession() {
    setSession(createEmptySession())
  }

  function restartGame() {
    setSession(createSessionForNextCard(deck.cards, []))
  }

  return {
    phase,
    currentCard,
    selectedCategory: session.selectedCategory,
    selectedEntry,
    answerRevealed: session.answerRevealed,
    usedCount: session.usedCardIds.length,
    remainingCount,
    deckSize: deck.cards.length,
    deckName: deck.name,
    startGame,
    selectCategory,
    revealAnswer,
    drawNextCard,
    resetSession,
    restartGame,
  }
}
