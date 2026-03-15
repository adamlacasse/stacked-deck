# Backlog

This is the working backlog for the next few implementation slices.

Keep it short. Only list tasks that are still worth doing soon.

## Now

### 1. Add deck validation

Goal:
Make invalid deck content fail loudly during development.

Acceptance criteria:

- validate that each card has a unique `id`
- validate that each card has exactly six entries
- validate that each canonical category appears exactly once
- validate that every question and answer is non-empty
- surface clear error messages during development

### 2. Expand the starter deck

Goal:
Make the app feel more representative during development without changing architecture.

Acceptance criteria:

- add more cards to `src/data/deck.ts`
- preserve canonical category order on every card
- avoid obvious duplicates
- follow `docs/CONTENT_GUIDE.md`

### 3. Add lightweight tests for `useDeck`

Goal:
Lock down the core gameplay flow before more features are added.

Acceptance criteria:

- cover `startGame`
- cover non-repeating draws across a full session
- cover `selectCategory` resetting answer reveal state
- cover `resetSession`
- cover `restartGame`

### 4. Add subtle card transitions

Goal:
Improve the deck feel without turning the app into an animation-heavy interface.

Acceptance criteria:

- next-card flow feels intentional
- transitions remain fast and readable
- reduced-motion preferences are respected
- buttons remain available for all actions

## Later

- move deck content from TypeScript to local JSON if it improves authoring
- add richer source metadata for disputed questions
- add a shuffle moment on game start
- add swipe-to-next as a progressive enhancement

## Not now

Do not treat these as backlog items unless product direction changes:

- authentication
- backend services
- multiplayer sync
- routing
- global state libraries
- live LLM gameplay features
