# DATA_MODEL.md

## Purpose
This document defines the canonical data model for **Stacked Deck** during the MVP phase.

The goal is to keep the content model simple, six-centric, and easy for both humans and AI agents to work with.

## Guiding Principle
The primary content unit is a **card**, not a loose question.

This mirrors the physical trivia-card model while allowing the UI to reveal only one category at a time.

## Core Concepts

### Deck
A deck is a collection of cards.

For MVP, there may only be one deck in practice, but the data model should allow for multiple decks later.

### Card
A card is the fundamental gameplay unit.

A card contains exactly six category-based question/answer pairs.

### Category
A category represents one of the six classic trivia categories.

Canonical category values for MVP:
- `geography`
- `entertainment`
- `history`
- `arts`
- `science`
- `sports`

These values should be treated as the source of truth in code and data.

### Entry
An entry is one category-specific question/answer pair on a card.

Each card contains one entry per category.

### Session
A session represents local gameplay state on a device.

For MVP, session state may include:
- current card id
- selected category
- whether the answer is revealed
- used card ids

## TypeScript Direction

```ts
type Category =
  | "geography"
  | "entertainment"
  | "history"
  | "arts"
  | "science"
  | "sports";

type CardEntry = {
  category: Category;
  question: string;
  answer: string;
  explanation?: string;
};

type TriviaCard = {
  id: string;
  entries: [
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry
  ];
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  source?: string;
  deckId?: string;
};

type TriviaDeck = {
  id: string;
  name: string;
  description?: string;
  cards: TriviaCard[];
};
```

## Important Modeling Rules
1. A card must contain exactly six entries.
2. A card must contain exactly one entry for each canonical category.
3. Category values should be lowercase canonical identifiers.
4. UI labels may differ from internal values, but the internal values should remain stable.
5. Do not store presentation-specific text directly in the card data unless needed.

## JSON Shape for MVP
The JSON should be easy to read, diff, validate, and generate.

Recommended MVP shape:

```json
{
  "id": "core-deck",
  "name": "Core Deck",
  "cards": [
    {
      "id": "card-0001",
      "difficulty": "medium",
      "tags": ["general", "modern"],
      "entries": [
        {
          "category": "geography",
          "question": "What river flows through Budapest?",
          "answer": "The Danube"
        },
        {
          "category": "entertainment",
          "question": "Which 1994 film features Vincent Vega and Jules Winnfield?",
          "answer": "Pulp Fiction"
        },
        {
          "category": "history",
          "question": "Which treaty ended World War I in 1919?",
          "answer": "The Treaty of Versailles"
        },
        {
          "category": "arts",
          "question": "Who wrote The Name of the Rose?",
          "answer": "Umberto Eco"
        },
        {
          "category": "science",
          "question": "What element has the symbol Ne?",
          "answer": "Neon"
        },
        {
          "category": "sports",
          "question": "What term in tennis means a score of zero?",
          "answer": "Love"
        }
      ]
    }
  ]
}
```

## Why `entries` Instead of Hardcoding Six Fields
Preferred:

```json
{
  "entries": [
    { "category": "geography", ... },
    { "category": "entertainment", ... }
  ]
}
```

Avoid:

```json
{
  "geography": { ... },
  "entertainment": { ... }
}
```

Reasons:
- easier validation and iteration
- easier rendering
- easier sorting/filtering later
- easier for AI-generated content pipelines
- easier future portability

## Ordering Guidance
For consistency, entries should be stored in a standard category order.

Recommended canonical order:
1. `geography`
2. `entertainment`
3. `history`
4. `arts`
5. `science`
6. `sports`

This makes rendering predictable and reduces drift.

## Validation Expectations
Any content-loading logic should assume that card data may need validation.

At minimum, validation should check:
- card has an id
- card has exactly six entries
- all six canonical categories are present exactly once
- question is non-empty
- answer is non-empty

## Session Shape Direction
For MVP, a local session object may look like this:

```ts
type GameSession = {
  currentCardId: string | null;
  selectedCategory: Category | null;
  answerRevealed: boolean;
  usedCardIds: string[];
};
```

This is implementation guidance, not a strict persistence contract.

## Future-Friendly Fields
These fields are allowed later, but should not drive MVP complexity:
- `explanation`
- `difficulty`
- `tags`
- `source`
- `deckId`
- `era`
- `verifiedAt`

They may be added if useful, but MVP should work without depending on them.

## Content Authoring Guidance
When generating or curating cards:
- prefer clear, unambiguous wording
- avoid trick questions unless intentional
- avoid questions with multiple plausible answers
- prefer broadly recognizable facts for core gameplay
- keep answers concise
- add explanation only when it genuinely helps settle disputes

## Summary
The MVP data model should remain:
- card-centric
- six-category based
- simple to validate
- easy to render
- easy for AI tools to generate and edit

