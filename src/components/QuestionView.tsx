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
  const explanation = entry.explanation?.trim() || null
  const sourceLabel = entry.source?.label?.trim() || null
  const source = sourceLabel ? entry.source : null
  const hasContext = Boolean(explanation || sourceLabel)

  return (
    <section className={styles.panel}>
      <p className={styles.eyebrow}>{meta.label}</p>
      <h2 className={styles.title}>{entry.question}</h2>

      {answerRevealed ? (
        <div className={styles.answerBlock}>
          <p className={styles.answerLabel}>Answer</p>
          <p className={styles.answer}>{entry.answer}</p>
          {hasContext ? (
            <section className={styles.contextBlock} aria-label="Answer context">
              <p className={styles.contextLabel}>Context</p>
              {explanation ? (
                <p className={styles.contextText}>{explanation}</p>
              ) : null}
              {source && sourceLabel ? (
                <p className={styles.contextSource}>
                  Source:{' '}
                  {source.url ? (
                    <a
                      className={styles.contextLink}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sourceLabel}
                    </a>
                  ) : (
                    <span>{sourceLabel}</span>
                  )}
                </p>
              ) : null}
            </section>
          ) : null}
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
