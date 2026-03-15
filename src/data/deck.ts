import type { TriviaDeck } from '../types'
import { assertValidDeck } from './validateDeck'
import deckJson from './deck.json'

const deckData = deckJson as unknown as TriviaDeck

assertValidDeck(deckData)

export const starterDeck = deckData
