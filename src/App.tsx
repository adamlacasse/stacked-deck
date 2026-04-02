import { useState } from 'react'

import styles from './App.module.css'
import { CardView } from './components/CardView'
import { availableDecks, defaultDeck } from './data/deck'
import { useDeck } from './hooks/useDeck'
import type { TriviaDeck } from './types'

function App() {
  const [selectedDeckId, setSelectedDeckId] = useState(defaultDeck.id)
  const selectedDeck =
    availableDecks.find((deck) => deck.id === selectedDeckId) ?? defaultDeck

  return (
    <DeckShell
      key={selectedDeck.id}
      deck={selectedDeck}
      selectedDeckId={selectedDeckId}
      onSelectDeck={setSelectedDeckId}
    />
  )
}

type DeckShellProps = {
  deck: TriviaDeck
  selectedDeckId: string
  onSelectDeck: (deckId: string) => void
}

function DeckShell({ deck, selectedDeckId, onSelectDeck }: DeckShellProps) {
  const deckLabelId = 'deck-filter-label'
  const difficultyLabelId = 'difficulty-filter-label'
  const {
    phase,
    currentCard,
    selectedCategory,
    selectedEntry,
    answerRevealed,
    usedCount,
    remainingCount,
    deckSize,
    deckName,
    deckDescription,
    startGame,
    selectCategory,
    clearSelectedCategory,
    revealAnswer,
    drawNextCard,
    resetSession,
    restartGame,
    isShuffling,
    difficultyFilter,
    setDifficultyFilter,
  } = useDeck(deck)

  const DIFFICULTY_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ] as const

  const canChangeDeck = phase !== 'active' && !isShuffling

  return (
    <main className={styles.shell}>
      <div className={styles.frame}>
        {phase === 'active' && currentCard ? (
          <>
            <CardView
              key={currentCard.id}
              card={currentCard}
              deckName={deck.name}
              categoryMeta={deck.categoryMeta}
              selectedCategory={selectedCategory}
              selectedEntry={selectedEntry}
              answerRevealed={answerRevealed}
              onSelectCategory={selectCategory}
              onCloseQuestion={clearSelectedCategory}
              onRevealAnswer={revealAnswer}
              onNextCard={drawNextCard}
              remainingCount={remainingCount}
            />
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={resetSession}
              >
                Reset session
              </button>
            </div>
          </>
        ) : (
          <section className={`${styles.heroPanel} ${styles.centeredPanel}`}>
            <div className={`${styles.heroBody} ${styles.centeredBody}`}>
              {!isShuffling ? (
                <>
                  <div className={styles.deckMeta}>
                    <span className={styles.metaPill}>{deckName}</span>
                    <span className={styles.metaPill}>
                      {difficultyFilter === 'all'
                        ? `${deckSize} cards`
                        : `${deckSize} ${difficultyFilter} cards`}
                    </span>
                  </div>

                  <div
                    className={styles.filterSection}
                    role="group"
                    aria-labelledby={deckLabelId}
                  >
                    <span id={deckLabelId} className={styles.filterLabel}>
                      Deck
                    </span>
                    {availableDecks.map((availableDeck) => (
                      <button
                        key={availableDeck.id}
                        type="button"
                        aria-pressed={selectedDeckId === availableDeck.id}
                        className={`${styles.filterButton} ${selectedDeckId === availableDeck.id ? styles.filterButtonActive : ''}`}
                        onClick={() => onSelectDeck(availableDeck.id)}
                        disabled={!canChangeDeck}
                      >
                        {availableDeck.name}
                      </button>
                    ))}
                  </div>

                  <div
                    className={styles.filterSection}
                    role="group"
                    aria-labelledby={difficultyLabelId}
                  >
                    <span id={difficultyLabelId} className={styles.filterLabel}>
                      Difficulty
                    </span>
                    {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={difficultyFilter === value}
                        className={`${styles.filterButton} ${difficultyFilter === value ? styles.filterButtonActive : ''}`}
                        onClick={() => setDifficultyFilter(value)}
                        disabled={isShuffling}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              <h1 className={`${styles.heroTitle} ${isShuffling ? styles.shufflingTitle : ''}`}>
                {isShuffling
                  ? 'Shuffling…'
                  : phase === 'finished'
                    ? 'Deck complete.'
                    : 'Stacked Deck'}
              </h1>

              {!isShuffling ? (
                <p className={styles.heroText}>
                  {phase === 'finished'
                    ? 'Every card in this filter has been used once. Shuffle again or clear the session to start fresh.'
                    : deckDescription ?? 'The modern trivia deck.'}
                </p>
              ) : null}
            </div>

            {!isShuffling ? (
              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={phase === 'finished' ? restartGame : startGame}
                >
                  {phase === 'finished' ? 'Play again' : 'Start game'}
                </button>
                {usedCount > 0 ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={resetSession}
                  >
                    Clear session
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>
        )}
      </div>
    </main>
  )
}

export default App
