export const CATEGORY_ORDER = [
  'geography',
  'entertainment',
  'history',
  'arts',
  'science',
  'sports',
] as const

export type Category = (typeof CATEGORY_ORDER)[number]

export type CategoryMeta = {
  label: string
  prompt: string
  accent: string
}

export type CategoryMetaOverride = {
  label: string
  prompt: string
  accent?: string
}

export type DeckCategoryMeta = Partial<Record<Category, CategoryMetaOverride>>

export type CardEntry = {
  category: Category
  question: string
  answer: string
  explanation?: string
  source?: {
    label: string
    url?: string
  }
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export type TriviaCard = {
  id: string
  entries: [
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
  ]
  difficulty?: Difficulty
  tags?: string[]
  source?: string
  deckId?: string
}

export type TriviaDeck = {
  id: string
  name: string
  description?: string
  categoryMeta?: DeckCategoryMeta
  cards: TriviaCard[]
}

export type GameSession = {
  currentCardId: string | null
  selectedCategory: Category | null
  answerRevealed: boolean
  usedCardIds: string[]
}
