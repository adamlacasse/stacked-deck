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

- 24 tests across `useDeck.test.ts` (15 tests) and `validateDeck.test.ts` (9 tests)
- covers `startGame`, non-repeating draws, `selectCategory`, `revealAnswer`, `resetSession`, `restartGame`, and localStorage persistence
- run with `npm test`

### ✅ Add subtle card transitions

CSS animations added in `CardView.module.css` and `QuestionView.module.css`.

- card entrance animation plays on each new card draw (via `key={card.id}` on `CardView`)
- question panel re-animates when a new category is selected (via `key={selectedCategory}` on `QuestionView`)
- answer block has its own fade-in when revealed
- all animations respect `prefers-reduced-motion` (existing global rule in `index.css`)

## Now

### 1. Add a shuffle moment on game start

Goal:
Reinforce the deck metaphor at the start of each game session.

Acceptance criteria:

- briefly display a "Shuffling…" message or animation when `startGame` or `restartGame` is triggered
- the transition takes no more than 500ms so it doesn't delay play
- `prefers-reduced-motion` skips the animation entirely
- no new dependencies

### 2. Add swipe-to-next as a progressive enhancement

Goal:
Let players swipe the card away to draw the next one on touch devices.

Acceptance criteria:

- swipe left or right on the active card triggers `drawNextCard`
- requires answer to have been revealed first (same constraint as the Next Card button)
- falls back gracefully to buttons on non-touch devices
- implemented with native pointer events, no swipe library needed

### 3. Move deck content to local JSON

Goal:
Separate card authoring from TypeScript compilation so content can be edited without a build step.

Acceptance criteria:

- cards live in `src/data/deck.json`
- `src/data/deck.ts` imports and re-exports the JSON through validation
- existing TypeScript types still apply via a type assertion or Zod-like check
- no change to the component layer

## Later

- add richer source metadata for disputed questions
- add difficulty filter or mode selection before drawing

## Not now

Do not treat these as backlog items unless product direction changes:

- authentication
- backend services
- multiplayer sync
- routing
- global state libraries
- live LLM gameplay features
