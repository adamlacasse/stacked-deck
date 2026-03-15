import { CATEGORY_ORDER } from '../types'
import type { TriviaDeck } from '../types'

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] }

export function validateDeck(deck: TriviaDeck): ValidationResult {
  const errors: string[] = []
  const seenCardIds = new Set<string>()

  if (!deck.id) {
    errors.push('Deck is missing an id.')
  }

  if (!deck.name) {
    errors.push('Deck is missing a name.')
  }

  if (!Array.isArray(deck.cards) || deck.cards.length === 0) {
    errors.push('Deck must contain at least one card.')
    return { valid: false, errors }
  }

  for (const card of deck.cards) {
    const prefix = `Card "${card.id ?? '(no id)'}"`

    if (!card.id) {
      errors.push(`${prefix} Card is missing an id.`)
    } else if (seenCardIds.has(card.id)) {
      errors.push(`Card id "${card.id}" is duplicated.`)
    } else {
      seenCardIds.add(card.id)
    }

    if (!Array.isArray(card.entries)) {
      errors.push(`${prefix} entries must be an array.`)
      continue
    }

    if (card.entries.length !== 6) {
      errors.push(
        `${prefix} must have exactly 6 entries, but has ${card.entries.length}.`,
      )
    }

    const categoriesFound = card.entries.map((e) => e?.category)

    for (const category of CATEGORY_ORDER) {
      const count = categoriesFound.filter((c) => c === category).length

      if (count === 0) {
        errors.push(`${prefix} is missing a "${category}" entry.`)
      } else if (count > 1) {
        errors.push(`${prefix} has ${count} entries for "${category}" (expected 1).`)
      }
    }

    for (const entry of card.entries) {
      if (!entry?.question?.trim()) {
        errors.push(
          `${prefix} entry "${entry?.category ?? '(unknown)'}" has an empty question.`,
        )
      }

      if (!entry?.answer?.trim()) {
        errors.push(
          `${prefix} entry "${entry?.category ?? '(unknown)'}" has an empty answer.`,
        )
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return { valid: true }
}

export function assertValidDeck(deck: TriviaDeck): void {
  if (import.meta.env.DEV) {
    const result = validateDeck(deck)

    if (!result.valid) {
      const message = [
        `[Stacked Deck] Invalid deck "${deck.id ?? '(no id)'}":`,
        ...result.errors.map((e) => `  • ${e}`),
      ].join('\n')

      console.error(message)
      throw new Error(message)
    }
  }
}
