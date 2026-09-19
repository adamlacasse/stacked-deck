import type { TriviaDeck } from '../types'
import { normalizeDeck } from './normalizeDeck'
import { assertValidDeck } from './validateDeck'
import generalKnowledgeDeckJson from './general-knowledge-deck.json'

function loadDeck(deckJson: unknown): TriviaDeck {
  const deckData = normalizeDeck(deckJson)

  assertValidDeck(deckData)
  return deckData
}

// The start screen shows a deck picker automatically once more than one deck is listed here.
export const availableDecks = [
  loadDeck(generalKnowledgeDeckJson),
]

export const defaultDeck = availableDecks[0]
