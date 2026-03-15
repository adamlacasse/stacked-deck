# Architecture

This document describes the current implementation shape of Stacked Deck.

It is intentionally narrow. It should describe what exists today and the expected places to extend it, not a speculative future system.

## Current scope

The app currently supports a single-screen local gameplay loop:

1. start game
2. draw one unused card
3. show six categories
4. select one category
5. reveal one question
6. reveal one answer
7. move to the next unused card

Everything is local. There is no routing, backend, account system, or multiplayer state.

## Source tree map

```text
src/
  App.tsx                    top-level screen and phase switching
  App.module.css             app shell layout and large-scale styling
  main.tsx                   React entry point
  index.css                  global tokens, resets, base elements
  types.ts                   domain types and canonical category order
  data/
    categories.ts            UI metadata for category labels and colors
    deck.ts                  local starter deck (15 cards), validated at load time
    validateDeck.ts          deck validation utility and dev-mode assertion
  hooks/
    useDeck.ts               game session state and draw logic
  components/
    CardView.tsx             active card container
    CategoryList.tsx         category chooser
    QuestionView.tsx         question and answer reveal panel
  test/
    setup.ts                 Vitest global setup (@testing-library/jest-dom)
    useDeck.test.ts          hook behavior tests (15 tests)
    validateDeck.test.ts     validation utility tests (9 tests)
```

`src/assets/*` currently contains leftover Vite scaffold assets and is not part of the active app flow.

## Runtime model

The app has three practical phases:

- `idle`: no active card yet
- `active`: a card is in play
- `finished`: all cards in the local deck have been used once

That state is derived inside `useDeck`.

## Session model

The local session shape is:

```ts
type GameSession = {
  currentCardId: string | null
  selectedCategory: Category | null
  answerRevealed: boolean
  usedCardIds: string[]
}
```

Session data is persisted in `localStorage` under:

```ts
'stacked-deck-session'
```

### Important behavior

- A card is marked as used when it is drawn, not after its answer is revealed.
- Selecting a category clears any previously revealed answer for that card.
- `resetSession` clears the in-memory session and writes the empty session back to `localStorage`.
- `restartGame` starts a fresh run from the same deck by clearing used card history and immediately drawing a new card.

## Draw logic

`useDeck` owns all gameplay state.

Current draw behavior:

1. filter out cards whose ids are already in `usedCardIds`
2. pick one remaining card at random
3. set that card as `currentCardId`
4. append its id to `usedCardIds`
5. reset `selectedCategory` and `answerRevealed`

If no cards remain, the hook enters the `finished` phase.

## Component responsibilities

### `App.tsx`

- calls `useDeck(starterDeck)`
- renders the shell, stats, and high-level phase UI
- chooses between the idle/finished hero panel and the active card view

### `CardView.tsx`

- renders the active card shell
- composes `CategoryList` and `QuestionView`
- does not own session state

### `CategoryList.tsx`

- renders six category buttons from the active card entries
- uses `CATEGORY_META` for label, accent, and helper text
- sends the selected category upward

### `QuestionView.tsx`

- renders one of two states:
  - placeholder prompt when no category is selected
  - selected question and answer reveal actions when a category is selected
- never reveals more than one answer

## Styling boundaries

Global styling belongs in `src/index.css` only when it is one of these:

- design tokens
- resets
- element-level defaults
- shared button/base behavior

Component-specific styling belongs in colocated CSS Modules.

Current visual direction:

- warm paper-like palette
- deck/card metaphor
- strong contrast for reading aloud
- large touch-friendly actions

## Data boundaries

The source of truth for card data is the deck object in `src/data/deck.ts`.

The source of truth for category ids and ordering is `src/types.ts`.

The source of truth for category display labels and colors is `src/data/categories.ts`.

Do not hardcode category labels, colors, or alternate category orders in components.

## Safe extension points

Future work should prefer these locations:

- deck validation: `src/data/validateDeck.ts`
- deck loading adapters: `src/data/*`
- UI-only refinements: colocated component module CSS
- gameplay state changes: `src/hooks/useDeck.ts`
- reusable domain helpers: `src/types.ts` or `src/data/*`

## Things intentionally not present

These are not omissions by accident:

- routing
- server APIs
- remote persistence
- authentication
- multiplayer state
- global state library
- animation library

Do not add them without an explicit product reason.

## Known technical gaps

The current implementation has addressed all initial gaps:

- ✅ deck validation implemented in `src/data/validateDeck.ts`
- ✅ automated tests in `src/test/` (24 tests, run with `npm test`)
- ✅ starter deck expanded to 15 cards
- ✅ card and question panel transitions added via CSS animations

Next areas to improve: shuffle moment on game start, swipe-to-next gesture, move deck content to JSON.
