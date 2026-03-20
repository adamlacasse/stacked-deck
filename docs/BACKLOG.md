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

### ✅ Expand the deck with more cards across all difficulty levels

Deck expanded from 15 to 30 cards in `src/data/deck.json`.

- 10 easy, 13 medium, 7 hard cards
- broad topic variety across all six categories
- no duplicate questions; all cards pass validation

### ✅ Add difficulty filter before drawing

Difficulty filter added to `useDeck` and `App.tsx`.

- `difficultyFilter` state (`'all' | 'easy' | 'medium' | 'hard'`) exposed from `useDeck`
- `setDifficultyFilter` guards against changes during active play
- `filteredCards` derived via `useMemo`; `deckSize` and `remainingCount` reflect the active filter
- difficulty selector shown on the start and finished screens in `App.tsx`
- filter resets to `'all'` on page load; not persisted to `localStorage`
- 5 new tests in `useDeck.test.ts` cover filter defaults, deckSize, draw behavior, and phase guard

### ✅ Add an error boundary for corrupted localStorage

Error boundary added to `src/components/ErrorBoundary.tsx`, wired in `src/main.tsx`.

- `ErrorBoundary` is a React class component wrapping the entire app
- catches render errors and shows a styled fallback UI matching the app's navy/gold design
- "Clear data & restart" button removes the `stacked-deck-session` key from localStorage and reloads
- "Try again" button resets boundary state without clearing data (for non-storage errors)
- error message displayed in a muted monospace block for debugging context
- localStorage write in `useDeck` wrapped in try/catch so a full storage error won't crash the app mid-session

### ✅ Extract magic numbers to named constants

Shared constants extracted to `src/constants.ts`; CSS timing variables added to `index.css`.

- `STORAGE_KEY`, `SWIPE_THRESHOLD_PX`, and `SHUFFLE_DELAY_MS` moved from their local file definitions into `src/constants.ts`
- `useDeck.ts`, `CardView.tsx`, and `ErrorBoundary.tsx` now import from the shared module — eliminating the `STORAGE_KEY` duplication introduced by the error boundary
- `--ease-card` CSS custom property added to `:root` for the repeated `cubic-bezier(0.22, 0.61, 0.36, 1)` easing used in card and panel entrance animations
- `--duration-button` CSS custom property added for the `160ms` button transition duration
- `CardView.module.css`, `QuestionView.module.css`, and `index.css` updated to reference the new custom properties
- Hardcoded `#c89730` in `QuestionView.module.css` replaced with `var(--color-accent)` (already defined in `:root`)

### ✅ Add post-answer context panel for disputed questions

Context metadata now appears only after the answer is revealed in `QuestionView`.

- `CardEntry` now supports optional `explanation` and structured `source` metadata (`label`, optional `url`)
- `validateDeck` now validates optional explanation/source fields (non-empty labels, valid absolute `http(s)` URLs)
- `QuestionView` renders a `Context` block post-reveal with explanation text and a source link when present
- starter deck entries with commonly disputed facts now include context/source examples (Nile/Amazon, Canada lakes, Marie Curie Nobel)
- tests expanded for validation coverage and `QuestionView` rendering behavior

### ✅ Add static-hosting polish for deployment

`public/_headers` added for Cloudflare Pages.

- `/assets/*` gets `Cache-Control: public, max-age=31536000, immutable` (Vite fingerprints filenames so this is safe)
- `/` and `/*` get `must-revalidate` so users always receive the latest deploy
- Security headers on all routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restricting camera/mic/geolocation

### ✅ Shift `QuestionView` to a modal-first flow

Category selection now opens the focused question modal immediately.

- question state: modal shows only the selected question with `Reveal answer` and `Back to categories`
- answer state: same modal switches to answer-only content plus optional explanation/source context
- `Escape` dismisses the modal in question state to recover from accidental category taps
- modal state changes covered by `QuestionView` tests; `useDeck` now exposes `clearSelectedCategory`

## Later

### Post-modal production hardening (deferred from this branch)

- add CI checks to enforce `npm run lint`, `npm run build`, and `npm test` on pull requests
- apply low-risk dependency patch updates (`vite` 8.0.1 and `typescript-eslint` 8.57.1) in a separate maintenance pass
- decide whether to self-host the display font instead of loading from Google Fonts in `src/index.css`
- move deploy/runbook instructions into a stable deployment doc (`README.md` or `docs/DEPLOYMENT.md`) so they are not buried in backlog notes

- continue expanding the deck toward a large card library (currently 30; target: hundreds, then thousands)
- add component tests for CardView and CategoryList (rendering and interactions)
- modal UX follow-up: keep `Back to categories` visible in the modal during both question and answer states (it currently disappears after reveal)
- accessibility audit: ARIA labels, keyboard navigation, color contrast check
- deploy the static Vite build to Cloudflare Pages with GitHub integration (`main` -> production, branch/PR preview deploys enabled), with `stacked-deck.adamlcasse.dev` as the intended production URL
  - **Deploy contract:** build command `npm run build`, output directory `dist`, Node version `22` (matches `engines` field in `package.json`)
  - In the Cloudflare Pages UI: Workers & Pages → Create → Connect to Git → select `adamlacasse/stacked-deck` → Framework preset: `Vite` → Build command: `npm run build` → Build output directory: `dist`
  - Rollback: Cloudflare Pages keeps every deployment; use the Deployments tab to re-promote any prior build to production instantly
- wire the production subdomain `stacked-deck.adamlcasse.dev` to the Pages project via Cloudflare custom-domain setup and DNS; do not add a repo-level `CNAME` file unless the deployment target changes to GitHub Pages
  - In the Pages project: Custom Domains → Add domain → `stacked-deck.adamlcasse.dev` → Cloudflare will auto-add a CNAME record in your DNS
- smoke-test the deployed site on phone-sized Safari and Chrome, focusing on first-load speed, localStorage session persistence, and game-night readability on real devices

### Multi-Device Tabletop Sync (N-Players)

Transition the app from a single-device reader to a synchronized shared deck for multiple players, focusing on zero-friction onboarding and lightweight state sync.

- **Investigate Lightweight Backend:** Evaluate low-cost/serverless real-time state solutions (e.g., PartyKit, Cloudflare Workers with Durable Objects, WebSockets, or WebRTC) to replace the pure `localStorage` approach.
- **Core Deck Synchronization:** - Sync the "drawn" state globally across all connected devices so no two players draw the same card.
  - Sync global deck settings (e.g., difficulty filter) and the "Reset Deck" action from the host to all clients.
- **Low-Friction Joining (Lobby):**
  - Implement 4-letter Room Codes (e.g., `ABCD`) for quick joining without accounts.
  - Add a QR Code Quick-Join feature so players can scan the host's screen to instantly connect.
  - Allow stateless player nicknames (e.g., first name or a color) just to populate a "Players at the table" list.
  - Ensure graceful auto-reconnection when a player's phone wakes up from sleep during the game.
- **Tabletop UI Mechanics:**
  - Implement a "Free Draw" open deck by default, relying on the real-life social contract for turn-taking.
  - Add a passive "Player X is reading..." state on other devices to keep attention focused on the active reader and prevent accidental draws.
  - Allow the active reader to cast a disputed card to a "shared view," or let other players view the source metadata of a previously played card on their own screens.
- **Future Enhancement (Edge Cases):**
  - Add race-condition handling to resolve conflicts if multiple people tap "Draw Card" at the exact same millisecond.

## Not now

Do not treat these as backlog items unless product direction changes:

- authentication
- routing
- global state libraries
- live LLM gameplay features
