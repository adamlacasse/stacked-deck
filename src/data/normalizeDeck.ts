import { CATEGORY_ORDER } from '../types'
import type {
  CardEntry,
  Category,
  DeckCategoryMeta,
  Difficulty,
  TriviaCard,
  TriviaDeck,
} from '../types'

type RawRecord = Record<string, unknown>

function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'string' &&
    CATEGORY_ORDER.includes(value as Category)
  )
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard'
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function buildLaneCategoryMap(categoryMeta: unknown): Map<string, Category> {
  const laneCategoryMap = new Map<string, Category>()

  if (!isRecord(categoryMeta)) {
    return laneCategoryMap
  }

  for (const category of CATEGORY_ORDER) {
    const meta = categoryMeta[category]

    if (!isRecord(meta) || typeof meta.label !== 'string') {
      continue
    }

    const label = meta.label.trim().toLowerCase()
    if (label) {
      laneCategoryMap.set(label, category)
    }
  }

  return laneCategoryMap
}

function inferEntryCategory(
  entry: RawRecord,
  index: number,
  laneCategoryMap: Map<string, Category>,
): Category {
  if (isCategory(entry.category)) {
    return entry.category
  }

  if (typeof entry.lane === 'string') {
    const laneCategory = laneCategoryMap.get(entry.lane.trim().toLowerCase())

    if (laneCategory) {
      return laneCategory
    }
  }

  return CATEGORY_ORDER[index] ?? CATEGORY_ORDER[0]
}

function normalizeEntry(
  rawEntry: unknown,
  index: number,
  laneCategoryMap: Map<string, Category>,
): CardEntry {
  const entry = isRecord(rawEntry) ? rawEntry : {}
  const normalizedEntry: CardEntry = {
    category: inferEntryCategory(entry, index, laneCategoryMap),
    question: optionalText(entry.question) ?? '',
    answer: optionalText(entry.answer) ?? '',
  }

  if (entry.explanation !== undefined) {
    normalizedEntry.explanation = entry.explanation as string
  }

  if (entry.source !== undefined) {
    normalizedEntry.source = entry.source as CardEntry['source']
  }

  return normalizedEntry
}

function normalizeCard(rawCard: unknown, laneCategoryMap: Map<string, Category>): TriviaCard {
  const card = isRecord(rawCard) ? rawCard : {}
  const rawEntries = Array.isArray(card.entries) ? card.entries : []
  const normalizedCard: TriviaCard = {
    id: optionalText(card.id) ?? '',
    entries: rawEntries.map((entry, index) =>
      normalizeEntry(entry, index, laneCategoryMap),
    ) as TriviaCard['entries'],
  }

  if (isDifficulty(card.difficulty)) {
    normalizedCard.difficulty = card.difficulty
  }

  if (Array.isArray(card.tags)) {
    normalizedCard.tags = card.tags.filter(
      (tag): tag is string => typeof tag === 'string',
    )
  }

  if (typeof card.source === 'string') {
    normalizedCard.source = card.source
  }

  if (typeof card.deckId === 'string') {
    normalizedCard.deckId = card.deckId
  }

  return normalizedCard
}

export function normalizeDeck(deckJson: unknown): TriviaDeck {
  const deck = isRecord(deckJson) ? deckJson : {}
  const laneCategoryMap = buildLaneCategoryMap(deck.categoryMeta)
  const rawCards = Array.isArray(deck.cards) ? deck.cards : []
  const normalizedDeck: TriviaDeck = {
    id: optionalText(deck.id) ?? '',
    name: optionalText(deck.name) ?? '',
    cards: rawCards.map((card) => normalizeCard(card, laneCategoryMap)),
  }

  if (typeof deck.description === 'string') {
    normalizedDeck.description = deck.description
  }

  if (deck.categoryMeta !== undefined) {
    normalizedDeck.categoryMeta = deck.categoryMeta as DeckCategoryMeta
  }

  return normalizedDeck
}
