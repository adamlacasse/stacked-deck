import { CATEGORY_META } from '../data/categories'
import type { CardEntry } from '../types'
import styles from './QuestionView.module.css'

type QuestionViewProps = {
  entry: CardEntry | null
  answerRevealed: boolean
  remainingCount: number
  onRevealAnswer: () => void
  onNextCard: () => void
}

export function QuestionView({
  entry,
  answerRevealed,
  remainingCount,
  onRevealAnswer,
  onNextCard,
}: QuestionViewProps) {
  if (!entry) {
    return (
      <section className={styles.panel}>
        <h2 className={styles.title}>Pick a category to see the question.</h2>
      </section>
    )
  }

  const meta = CATEGORY_META[entry.category]
  const nextLabel = remainingCount > 0 ? 'Next card' : 'Finish deck'

  return (
    <section className={styles.panel}>
      <p className={styles.eyebrow}>{meta.label}</p>
      <h2 className={styles.title}>{entry.question}</h2>

      {answerRevealed ? (
        <div className={styles.answerBlock}>
          <p className={styles.answerLabel}>Answer</p>
          <p className={styles.answer}>{entry.answer}</p>
          <button type="button" className={styles.primaryAction} onClick={onNextCard}>
            {nextLabel}
          </button>
        </div>
      ) : (
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={onRevealAnswer}
          >
            Reveal answer
          </button>
        </div>
      )}
    </section>
  )
}
