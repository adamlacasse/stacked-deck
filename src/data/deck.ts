import type { TriviaDeck } from '../types'
import { assertValidDeck } from './validateDeck'
import csc6314DeckJson from './csc-6314-deck.json'
import generalKnowledgeDeckJson from './general-knowledge-deck.json'

function loadDeck(deckJson: unknown): TriviaDeck {
  const deckData = deckJson as TriviaDeck

  assertValidDeck(deckData)
  return deckData
}

export const availableDecks = [
  loadDeck(generalKnowledgeDeckJson),
  loadDeck(csc6314DeckJson),
]

export const defaultDeck = availableDecks[0]
