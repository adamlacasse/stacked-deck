import styles from './App.module.css'
import { CardView } from './components/CardView'
import { starterDeck } from './data/deck'
import { useDeck } from './hooks/useDeck'

function App() {
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
        <header className={styles.masthead}>
          <div>
            <p className={styles.kicker}>Stacked Deck</p>
            <h1 className={styles.headline}>Deck replacement for game night.</h1>
            <p className={styles.intro}>
              Draw one card, pick one category, reveal one answer, and keep the
              table moving. No dashboard clutter and no spoiler dump.
            </p>
          </div>

          <div className={styles.stats} aria-label="Deck stats">
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Cards drawn</span>
              <span className={styles.statValue}>
                {usedCount}/{deckSize}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Remaining</span>
              <span className={styles.statValue}>{remainingCount}</span>
            </div>
          </div>
        </header>

        <section className={styles.playArea}>
          {phase === 'active' && currentCard ? (
            <>
              <CardView
                key={currentCard.id}
                card={currentCard}
                selectedCategory={selectedCategory}
                selectedEntry={selectedEntry}
                answerRevealed={answerRevealed}
                onSelectCategory={selectCategory}
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
          ) : isShuffling ? (
            <section className={styles.heroPanel}>
              <div className={styles.heroBody}>
                <h2 className={`${styles.heroTitle} ${styles.shufflingTitle}`}>
                  Shuffling…
                </h2>
                <p className={styles.heroText}>Getting the deck ready.</p>
              </div>
            </section>
          ) : (
            <section className={styles.heroPanel}>
              <div className={styles.heroBody}>
                <div className={styles.deckMeta}>
                  <span className={styles.metaPill}>{deckName}</span>
                  <span className={styles.metaPill}>
                    {difficultyFilter === 'all'
                      ? `${deckSize} cards`
                      : `${deckSize} ${difficultyFilter} cards`}
                  </span>
                  <span className={styles.metaPill}>Single screen flow</span>
                </div>

                <div className={styles.filterSection}>
                  <span className={styles.filterLabel}>Difficulty</span>
                  {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.filterButton} ${difficultyFilter === value ? styles.filterButtonActive : ''}`}
                      onClick={() => setDifficultyFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <h2 className={styles.heroTitle}>
                  {phase === 'finished'
                    ? 'That was the whole deck.'
                    : 'Shuffle up and hand the phone to the reader.'}
                </h2>

                <p className={styles.heroText}>
                  {phase === 'finished'
                    ? 'All cards have been used once in this session. Shuffle the deck again to restart, or clear the local session and begin fresh.'
                    : 'The MVP keeps the ritual simple: categories first, one question at a time, and one answer reveal when the table is ready.'}
                </p>
              </div>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={phase === 'finished' ? restartGame : startGame}
                >
                  {phase === 'finished' ? 'Shuffle and play again' : 'Start game'}
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

              <p className={styles.footerNote}>
                Session state is stored locally so a refresh can continue the same
                deck.
              </p>
            </section>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
