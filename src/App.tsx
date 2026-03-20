import styles from './App.module.css'
import { CardView } from './components/CardView'
import { starterDeck } from './data/deck'
import { useDeck } from './hooks/useDeck'

function App() {
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
  } = useDeck(starterDeck)

  const DIFFICULTY_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ] as const

  return (
    <main className={styles.shell}>
      <div className={styles.frame}>
        {phase === 'active' && currentCard ? (
          <>
            <CardView
              key={currentCard.id}
              card={currentCard}
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
                    : 'One card, one category, one reveal.'}
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
