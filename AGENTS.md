# AGENTS.md

## Purpose
This document gives implementation instructions to AI coding agents working on **Stacked Deck**.

Read this before making any code changes.

## Project Summary
Stacked Deck is a responsive web app that replaces the physical trivia card deck while preserving the social feel of playing with a real board game.

The app is a **deck replacement**, not a full trivia platform.

Current product shape:
- single-page app
- mobile-friendly and responsive
- one person reads from the device during group play
- cards are drawn digitally
- each card contains six category-based questions

## Current MVP Flow
1. Start or enter the game
2. Draw a card
3. Show six categories for that card
4. Select a category
5. Show one question
6. Reveal one answer
7. Move to next card

## Chosen Stack
- Vite
- React
- TypeScript
- CSS Modules
- modern CSS

## Non-Goals for MVP
Do **not** add the following unless explicitly requested:
- authentication
- backend services
- databases
- multiplayer sync
- live LLM calls during gameplay
- Tailwind
- Sass/SCSS
- Redux or other heavy state libraries
- Next.js
- React Native
- analytics SDKs
- push notifications
- app store packaging

## Architectural Defaults
When in doubt, default to:
- static/local data
- local component state
- React hooks
- CSS Modules
- simple explicit code
- small components
- small utility functions
- no new dependency unless it clearly earns its keep

## UI and UX Rules
Optimize for game-night use around a table.

Priorities:
- readability
- low friction
- fast category-to-question flow
- large tap targets
- obvious reveal action
- obvious next-card action

The app should feel like a **deck of cards**, not a dashboard.

## Styling Rules
Use CSS Modules for component styling.

Use global CSS only for:
- CSS variables / design tokens
- base element styles
- app-wide resets

Prefer:
- semantic component class names
- CSS custom properties
- simple layout primitives (flex, grid, gap)
- minimal selector nesting

Avoid:
- global utility-class systems
- deep selector chains
- overdesigned animation systems

## Interaction Rules
Preserve the six-category card model.

Important:
- show categories first
- do not show all questions immediately
- do not reveal all answers at once
- reveal only the selected category question and answer
- keep the UI spoiler-resistant

## Data Rules
Treat cards as the primary unit of content.

Do not remodel the system around loose standalone questions unless explicitly requested.

A card should remain six-centric and category-based.

## Code Quality Rules
1. Prefer clarity over cleverness.
2. Keep functions small and named plainly.
3. Avoid abstraction until duplication is real.
4. Do not introduce patterns because they are fashionable.
5. Keep the codebase easy for both humans and AI agents to inspect.
6. Leave code in a predictable, boring, maintainable state.

## Dependency Rules
Before adding a dependency, ask:
1. Can this be done with React and the platform?
2. Is this dependency needed for MVP?
3. Does it increase hosting or architectural complexity?

If the answer is not strongly favorable, do not add it.

## File and Naming Guidance
Prefer names like:
- `CardView`
- `CategoryList`
- `QuestionView`
- `RevealAnswerButton`
- `useDeck`
- `deck.ts`
- `types.ts`

Avoid vague or overly abstract names.

## Routing Guidance
Current assumption: **single-page app**.

Do not introduce routing unless explicitly requested.

## State Guidance
For MVP, prefer:
- `useState`
- `useMemo`
- `useEffect` only when truly needed
- localStorage for lightweight persistence

Avoid global state libraries.

## Animation Guidance
Use lightweight CSS transitions only when they improve the card/deck feel.

Examples that are appropriate:
- subtle card slide
- gentle fade between states
- tiny shuffle feedback

Avoid animation-heavy implementations.

## Safe Contribution Pattern
When adding or changing a feature:
1. keep the change local
2. avoid touching unrelated files
3. explain tradeoffs briefly
4. preserve the existing product direction

## If You Are Unsure
Choose the simpler option.

If there are two valid paths, prefer the one that:
- adds fewer dependencies
- keeps the app static-first
- keeps the UI calmer
- preserves portability

