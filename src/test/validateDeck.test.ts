import { describe, it, expect } from 'vitest'
import { validateDeck } from '../data/validateDeck'
import type { TriviaDeck } from '../types'

type MutableEntry = {
  category: string
  question: string
  answer: string
  explanation?: string
  source?: {
    label: string
    url?: string
  }
}

function makeEntry(category: string): MutableEntry {
  return { category, question: 'Q?', answer: 'A' }
}

function mutableEntries(card: ReturnType<typeof makeCard>): MutableEntry[] {
  return card.entries as unknown as MutableEntry[]
}

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

const validDeck: TriviaDeck = {
  id: 'test',
  name: 'Test Deck',
  cards: [makeCard('c1'), makeCard('c2')],
}

describe('validateDeck – valid deck', () => {
  it('returns valid for a well-formed deck', () => {
    expect(validateDeck(validDeck)).toEqual({ valid: true })
  })

  it('allows optional deck-level category metadata overrides', () => {
    const deck: TriviaDeck = {
      ...validDeck,
      categoryMeta: {
        geography: {
          label: 'Foundations',
          prompt: 'Core ideas and definitions',
        },
      },
    }

    expect(validateDeck(deck)).toEqual({ valid: true })
  })

  it('allows optional explanation and source metadata', () => {
    const card = makeCard('c1')
    mutableEntries(card)[0].explanation = 'Some sources disagree on this ranking.'
    mutableEntries(card)[0].source = {
      label: 'Example Source',
      url: 'https://example.com/fact-check',
    }

    const deck = { ...validDeck, cards: [card, makeCard('c2')] }
    expect(validateDeck(deck)).toEqual({ valid: true })
  })
})

describe('validateDeck – deck-level errors', () => {
  it('reports a missing deck id', () => {
    const deck = { ...validDeck, id: '' }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.errors.some((e) => e.includes('id'))).toBe(true)
  })

  it('reports a missing deck name', () => {
    const deck = { ...validDeck, name: '' }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.errors.some((e) => e.includes('name'))).toBe(true)
  })

  it('reports an empty cards array', () => {
    const deck = { ...validDeck, cards: [] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('at least one card'))).toBe(true)
  })

  it('reports invalid category metadata overrides', () => {
    const deck = {
      ...validDeck,
      categoryMeta: {
        geography: {
          label: '',
          prompt: 'Core ideas',
        },
        unknown: {
          label: 'Unsupported',
          prompt: 'Should fail',
        },
      },
    } as unknown as TriviaDeck

    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.includes('non-empty label'))).toBe(true)
      expect(result.errors.some((e) => e.includes('unsupported category'))).toBe(true)
    }
  })
})

describe('validateDeck – card-level errors', () => {
  it('reports duplicate card ids', () => {
    const deck = {
      ...validDeck,
      cards: [makeCard('c1'), makeCard('c1')],
    }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('duplicated'))).toBe(true)
  })

  it('reports wrong number of entries', () => {
    const card = {
      id: 'c1',
      entries: [makeEntry('geography')] as unknown as TriviaDeck['cards'][number]['entries'],
    }
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('exactly 6'))).toBe(true)
  })

  it('reports a missing category', () => {
    const card = makeCard('c1')
    // Replace sports with a duplicate geography
    mutableEntries(card)[5] = makeEntry('geography')
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.includes('missing a "sports"'))).toBe(true)
      expect(result.errors.some((e) => e.includes('"geography"') && e.includes('2'))).toBe(true)
    }
  })

  it('reports an empty question', () => {
    const card = makeCard('c1')
    mutableEntries(card)[0].question = ''
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('empty question'))).toBe(true)
  })

  it('reports an empty answer', () => {
    const card = makeCard('c1')
    mutableEntries(card)[0].answer = ''
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('empty answer'))).toBe(true)
  })

  it('reports an empty explanation', () => {
    const card = makeCard('c1')
    mutableEntries(card)[0].explanation = '   '
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('empty explanation'))).toBe(true)
  })

  it('reports source metadata without a label', () => {
    const card = makeCard('c1')
    mutableEntries(card)[0].source = { label: '' }
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('source must include'))).toBe(true)
  })

  it('reports invalid source urls', () => {
    const card = makeCard('c1')
    mutableEntries(card)[0].source = {
      label: 'My source',
      url: 'not-a-url',
    }
    const deck = { ...validDeck, cards: [card] }
    const result = validateDeck(deck)
    expect(result.valid).toBe(false)
    if (!result.valid)
      expect(result.errors.some((e) => e.includes('absolute http(s) URL'))).toBe(true)
  })
})
