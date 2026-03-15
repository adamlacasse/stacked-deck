# Stacked Deck — Project Brief

## Purpose
Stacked Deck is a responsive web app that replaces the physical trivia card deck while preserving the social feel of playing with a real board game.

The app is not trying to replace the board, the wedges, or the shared table experience. It is a modern, durable question-and-answer source that keeps games fresh.

## Core Product Idea
Use the physical board game as usual, but draw trivia cards digitally.

The app should feel like:
- a deck replacement
- a lightweight game-night companion
- a calm, readable interface for one person to hold and read aloud

The app should **not** feel like:
- a noisy mobile game
- a social network
- a trivia content firehose
- an enterprise app with heavy flows or setup

## Primary Use Case
Friends are gathered around a table playing a Trivial Pursuit-style board game.

One person opens Stacked Deck on a phone or laptop and uses it as the source of cards:
- draw card
- read questions
- reveal answers
- move to next card

## Product Principles
1. **Replace the cards, keep the board.**
2. **Fast to use at the table.** Low friction, low ceremony.
3. **Readable from a slight distance.** Big text, obvious controls.
4. **Freshness matters.** Avoid repeats whenever practical.
5. **Tactile feel over feature bloat.** The app should feel deck-like.
6. **Static-first architecture.** Keep cost and complexity near zero for MVP.
7. **Portable implementation.** Avoid choices that lock the product into a specific platform or vendor.

## Naming
Working title: **Stacked Deck**

Why this name works:
- refers to a card deck
- has a subtle competitive edge
- is short and memorable
- fits the product's role as a board-game accessory

## MVP Scope
The MVP should include:
- responsive web UI
- draw a trivia card
- show six categories for that card
- select a category
- show one question
- reveal one answer
- next card
- reset deck/session
- avoid repeats within a session
- optionally persist used cards on a device

The MVP should not include:
- authentication
- multiplayer sync
- backend services unless clearly needed
- live LLM calls during gameplay
- app store packaging
- elaborate animation systems
- user-generated content workflows

## Tech Stack
Chosen stack:
- Vite
- React
- TypeScript
- CSS Modules
- modern CSS

### Why this stack
- low mental overhead
- familiar and fast to ship
- static-host friendly
- near-zero hosting cost potential
- easy to evolve later

## Styling Guidance
Use CSS Modules and modern CSS.

Preferred characteristics:
- clean component markup
- local component styles
- minimal global CSS
- CSS custom properties for tokens
- responsive layout with modern CSS primitives

Avoid:
- Tailwind unless there is a compelling reason
- Sass unless modern CSS proves insufficient
- giant global stylesheet patterns

### Global Style Tokens
Define a small set of CSS variables in a global stylesheet.

Example direction:

```
:root {
  --color-bg: #f7f4ee;
  --color-surface: #fffdf9;
  --color-text: #1f2937;
  --color-accent: #7c3aed;

  --radius-card: 16px;
  --shadow-card: 0 8px 24px rgba(0,0,0,0.08);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
}
```

## Card Interaction Model
The digital UI preserves the **six-category card concept** while improving readability and avoiding spoilers.

Interaction flow:

1. Draw card
2. Show six categories
3. Select a category
4. Show that question
5. Reveal the answer
6. Move to next card

This preserves the ritual of the physical game while improving usability.

### Category View
The card initially displays the six categories only.

Example layout:

```
Science
Geography
History
Arts
Sports
Entertainment
```

No questions or answers are visible yet.

### Question View
After selecting a category:

```
Science

What element has the symbol Ne?

[Reveal Answer]
```

### Answer Reveal

```
Neon

[Next Card]
```

Other questions on the card remain hidden to prevent spoilers.

## Deck Interaction Design
The app should visually reinforce the feeling of drawing from a **deck of cards**, not browsing a list.

### Stacked Card Visual
Show subtle stacked cards behind the active card.

```
┌───────────────┐
│               │
│   Categories  │
│               │
└───────────────┘
   ▭
  ▭
 ▭
```

This helps reinforce the deck metaphor.

### Card Draw
When drawing the next card:
- the current card slides away
- the next card appears

Simple CSS transitions are sufficient.

### Swipe Interaction (optional)
Users may swipe the card left/right to move to the next card.

Buttons should still exist for accessibility.

### Shuffle Moment
When starting a game, briefly show a shuffle animation or "Shuffling deck" message to reinforce randomness.

## Category Styling
Categories should use the classic trivia color palette to evoke the board game feeling.

Suggested mapping:

```
Blue   Geography
Pink   Entertainment
Yellow History
Brown  Arts
Green  Science
Orange Sports
```

This visual cue immediately communicates the trivia-card concept.

## UX Direction
The app should feel calm, tactile, and game-night friendly.

Key UX priorities:
- large tap targets
- large readable text
- strong contrast
- quick reveal and next-card flow
- minimal configuration before play
- readable from arm's length

The UI should optimize for **one person reading the question aloud**.

## Architectural Guidance
Build the app as static-first.

For MVP:
- questions can come from local JSON files
- session state can live in React state + localStorage
- no backend unless needed

Design the code so that the question source can later be swapped from:
- local JSON
- to API
- to database
- to curated admin workflow

without requiring a major UI rewrite.

## Data Model Direction
Model data around **cards**, not isolated questions.

A card should typically contain:
- id
- optional metadata such as difficulty/tags/edition
- six category-based question/answer pairs

The UI should consume cards through a clean boundary so the storage source can change later.

## Success Criteria for MVP
The MVP is successful if:
- it is pleasant to use around a table
- it is faster and less annoying than using old physical cards
- it avoids obvious repeats
- it works well on a phone
- it can be hosted cheaply or free

## Coding Constitution
These guidelines should govern all human and AI contributions.

### 1. Favor simplicity
Prefer the simplest implementation that satisfies the product need.

### 2. Avoid premature backend work
Do not introduce servers, databases, auth, or APIs unless the feature clearly requires them.

### 3. Preserve portability
Avoid vendor-specific features that would make hosting or migration painful.

### 4. Keep components focused
Components should be small, readable, and easy to replace.

### 5. Keep styling local
Prefer CSS Modules over global styles. Use global CSS only for app-wide tokens/base rules.

### 6. Minimize hidden magic
Prefer explicit code over clever abstractions.

### 7. Make AI-friendly code
Use clear names, small files, and predictable structures so AI agents can contribute safely.

### 8. Optimize for game flow
When in doubt, prioritize speed, readability, and social usability over technical cleverness.

## AI Agent Instructions
When contributing code or designs to this project, follow these rules:

1. Respect the chosen stack: Vite, React, TypeScript, CSS Modules, modern CSS.
2. Do not introduce Tailwind, Sass, Redux, Next.js, server components, or backend dependencies unless explicitly requested.
3. Do not add features beyond the stated MVP unless asked.
4. Keep files and functions small and easy to reason about.
5. Prefer straightforward data structures and avoid overengineering.
6. Preserve the app's identity as a deck replacement, not a full trivia platform.
7. Prioritize mobile responsiveness and readability.
8. When proposing changes, explain the tradeoffs briefly and concretely.
9. If uncertain, choose the lower-complexity option.
10. Avoid speculative scale architecture.

## Open Questions
These can be decided next:
- exact card JSON schema
- whether cards are stored in one file or split by deck/category
- whether to use React Router or keep a single-screen app initially
- how session persistence should work
- whether reader mode is MVP or v1.1
- how to generate and curate large trivia sets over time

## Immediate Next Steps
1. Finalize the project brief and AI instructions.
2. Create the Vite project.
3. Establish the initial folder structure.
4. Define the card schema.
5. Add a tiny sample deck.
6. Build the simplest playable flow.

