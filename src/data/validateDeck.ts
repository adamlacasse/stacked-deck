import { CATEGORY_ORDER } from '../types'
import type { TriviaDeck } from '../types'

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] }

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidSourceUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateDeck(deck: TriviaDeck): ValidationResult {
  const errors: string[] = []
  const seenCardIds = new Set<string>()

  if (!deck.id) {
    errors.push('Deck is missing an id.')
  }

  if (!deck.name) {
    errors.push('Deck is missing a name.')
  }

  if (deck.categoryMeta !== undefined) {
    if (
      typeof deck.categoryMeta !== 'object' ||
      deck.categoryMeta === null ||
      Array.isArray(deck.categoryMeta)
    ) {
      errors.push('Deck categoryMeta must be an object.')
    } else {
      for (const [category, meta] of Object.entries(deck.categoryMeta)) {
        if (!CATEGORY_ORDER.includes(category as (typeof CATEGORY_ORDER)[number])) {
          errors.push(`Deck categoryMeta has an unsupported category "${category}".`)
          continue
        }

        if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
          errors.push(`Deck categoryMeta "${category}" must be an object.`)
          continue
        }

        const metaRecord = meta as Record<string, unknown>

        if (!hasText(metaRecord.label)) {
          errors.push(
            `Deck categoryMeta "${category}" must include a non-empty label.`,
          )
        }

        if (!hasText(metaRecord.prompt)) {
          errors.push(
            `Deck categoryMeta "${category}" must include a non-empty prompt.`,
          )
        }

        if (
          metaRecord.accent !== undefined &&
          !hasText(metaRecord.accent)
        ) {
          errors.push(
            `Deck categoryMeta "${category}" accent must be a non-empty string.`,
          )
        }
      }
    }
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
      if (!hasText(entry?.question)) {
        errors.push(
          `${prefix} entry "${entry?.category ?? '(unknown)'}" has an empty question.`,
        )
      }

      if (!hasText(entry?.answer)) {
        errors.push(
          `${prefix} entry "${entry?.category ?? '(unknown)'}" has an empty answer.`,
        )
      }

      if (entry?.explanation !== undefined && !hasText(entry.explanation)) {
        errors.push(
          `${prefix} entry "${entry?.category ?? '(unknown)'}" has an empty explanation.`,
        )
      }

      if (entry?.source !== undefined) {
        const source = entry.source as Record<string, unknown>

        if (typeof source !== 'object' || source === null) {
          errors.push(
            `${prefix} entry "${entry?.category ?? '(unknown)'}" has an invalid source object.`,
          )
          continue
        }

        if (!hasText(source.label)) {
          errors.push(
            `${prefix} entry "${entry?.category ?? '(unknown)'}" source must include a non-empty label.`,
          )
        }

        if (
          source.url !== undefined &&
          (typeof source.url !== 'string' || !isValidSourceUrl(source.url))
        ) {
          errors.push(
            `${prefix} entry "${entry?.category ?? '(unknown)'}" source url must be an absolute http(s) URL.`,
          )
        }
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
