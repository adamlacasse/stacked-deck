# Backlog

This is the working backlog for the next few implementation slices.

Keep it short. Only list tasks that are still worth doing soon.

## Done

### ✅ Add deck validation

Implemented in `src/data/validateDeck.ts`.

- validates unique card ids, exactly six entries, all canonical categories present, non-empty questions and answers
- `assertValidDeck` runs in development mode and throws with clear error messages
- wired into `src/data/deck.ts` at module load time

### ✅ Expand the starter deck

Deck expanded from 5 to 15 cards in `src/data/deck.ts`.

- mixed easy/medium/hard difficulty
- all cards follow canonical category order
- no duplicate questions

### ✅ Add lightweight tests for `useDeck`

Test suite added using Vitest in `src/test/`.

- 26 tests across `useDeck.test.ts` (17 tests) and `validateDeck.test.ts` (9 tests)
- covers `startGame`, non-repeating draws, `selectCategory`, `revealAnswer`, `resetSession`, `restartGame`, and localStorage persistence
- run with `npm test`

### ✅ Add subtle card transitions

CSS animations added in `CardView.module.css` and `QuestionView.module.css`.

- card entrance animation plays on each new card draw (via `key={card.id}` on `CardView`)
- question panel re-animates when a new category is selected (via `key={selectedCategory}` on `QuestionView`)
- answer block has its own fade-in when revealed
- all animations respect `prefers-reduced-motion` (existing global rule in `index.css`)

### ✅ Add a shuffle moment on game start

Brief "Shuffling…" state added to `useDeck` and `App.tsx`.

- `isShuffling` state exposed from `useDeck`
- 400ms delay before drawing a card on `startGame` and `restartGame`
- `prefers-reduced-motion` skips the delay entirely
- shuffling UI shown in the hero panel during the delay
- no new dependencies

### ✅ Add swipe-to-next as a progressive enhancement

Swipe gesture detection added to `CardView.tsx`.

- pointer events (`onPointerDown`, `onPointerUp`, `onPointerCancel`) track horizontal swipes
- swipe left or right triggers `drawNextCard` when answer has been revealed
- 60px horizontal threshold with directional guard (only fires if dx > dy)
- `touch-action: pan-y` on the card shell lets browsers handle vertical scrolling
- native pointer events, no library

### ✅ Move deck content to local JSON

Cards moved from `src/data/deck.ts` to `src/data/deck.json`.

- `src/data/deck.ts` imports the JSON and re-exports through validation
- type assertion used for JSON import (`as unknown as TriviaDeck`)
- `resolveJsonModule: true` added to `tsconfig.app.json`
- no change to the component layer

### ✅ Add difficulty filter before drawing

Difficulty filter added to `useDeck` and `App.tsx`.

- `difficultyFilter` state (`'all' | 'easy' | 'medium' | 'hard'`) exposed from `useDeck`
- `setDifficultyFilter` guards against changes during active play
- `filteredCards` derived via `useMemo`; `deckSize` and `remainingCount` reflect the active filter
- difficulty selector shown on the start and finished screens in `App.tsx`
- filter resets to `'all'` on page load; not persisted to `localStorage`
- 5 new tests in `useDeck.test.ts` cover filter defaults, deckSize, draw behavior, and phase guard

## Later

- add richer source metadata for disputed questions
- expand the deck with more cards across all difficulty levels
- add component tests for CardView, CategoryList, and QuestionView (rendering and interactions)
- add an error boundary to handle corrupted localStorage gracefully
- accessibility audit: ARIA labels, keyboard navigation, color contrast check
- extract magic numbers to named constants (swipe threshold 60px, shuffle delay 400ms)

## Not now

Do not treat these as backlog items unless product direction changes:

- authentication
- backend services
- multiplayer sync
- routing
- global state libraries
- live LLM gameplay features
