# Content Guide

This document covers how to add or edit trivia cards without breaking the MVP data model or gameplay flow.

Use it whenever you touch `src/data/deck.json` or any future deck content file.

## Core rule

The primary content unit is a card.

Do not author loose standalone questions for the MVP. Every question belongs to a six-entry card.

## Canonical category order

Every card must use this order:

1. `geography`
2. `entertainment`
3. `history`
4. `arts`
5. `science`
6. `sports`

Keep the stored order stable even if the UI layout changes later.

## Required card shape

Each card should include:

- a stable `id`
- exactly six `entries`
- exactly one entry per canonical category
- a non-empty `question`
- a non-empty `answer`

Optional metadata that is safe to use:

- `difficulty`
- `tags`
- `source`
- `deckId`
- `explanation`

## Authoring rules

Prefer questions that are:

- broadly recognizable
- answerable with one clear response
- stable over time
- easy to read aloud
- short enough to scan quickly on a phone

Avoid questions that are:

- time-sensitive without a date or source
- opinion-based
- trick questions unless explicitly intended
- dependent on niche wording
- likely to have multiple equally valid answers

## Answer rules

Answers should be:

- concise
- specific enough to settle a dispute
- phrased in the most recognizable form

Examples:

- prefer `The Danube` over a paragraph
- prefer `Johannes Vermeer` over `Vermeer` when ambiguity is possible
- prefer `Carbon dioxide` over `CO2` unless the symbol is clearly the expected answer

## Metadata guidance

Use metadata sparingly.

- `difficulty`: only when the label is obvious
- `tags`: for broad grouping, not presentation
- `source`: useful when a question could be disputed
- `explanation`: only when it adds real clarifying value

Do not put UI-specific copy in the deck data.

## Authoring checklist

Before adding a card, confirm:

- all six categories are present exactly once
- the entry order matches the canonical order
- each question can be read aloud naturally
- each answer is short and unambiguous
- there are no obvious duplicate questions elsewhere in the same deck
- the card id is unique

## Example card template

```ts
{
  id: 'card-0006',
  difficulty: 'medium',
  tags: ['starter', 'general'],
  entries: [
    {
      category: 'geography',
      question: '...',
      answer: '...',
    },
    {
      category: 'entertainment',
      question: '...',
      answer: '...',
    },
    {
      category: 'history',
      question: '...',
      answer: '...',
    },
    {
      category: 'arts',
      question: '...',
      answer: '...',
    },
    {
      category: 'science',
      question: '...',
      answer: '...',
    },
    {
      category: 'sports',
      question: '...',
      answer: '...',
    },
  ],
}
```

## Preferred workflow for content changes

1. Add or edit cards in `src/data/deck.json`.
2. Keep cards in canonical category order.
3. Re-read the card as if someone is reading it aloud to a table.
4. Run `npm run lint` and `npm run build`.
5. Update `docs/DATA_MODEL.md` only if the content shape itself changed.
