import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { CATEGORY_META } from '../data/categories'
import type { CardEntry } from '../types'
import styles from './QuestionView.module.css'

type QuestionViewProps = {
  entry: CardEntry | null
  answerRevealed: boolean
  remainingCount: number
  onCloseQuestion: () => void
  onRevealAnswer: () => void
  onNextCard: () => void
}

export function QuestionView({
  entry,
  answerRevealed,
  remainingCount,
  onCloseQuestion,
  onRevealAnswer,
  onNextCard,
}: QuestionViewProps) {
  const revealButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!entry) return

    document.body.style.overflow = 'hidden'
    if (answerRevealed) {
      nextButtonRef.current?.focus()
    } else {
      revealButtonRef.current?.focus()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !answerRevealed) {
        onCloseQuestion()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [answerRevealed, entry, onCloseQuestion])
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!answerRevealed || !entry) return

    document.body.style.overflow = 'hidden'
    nextButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = ''
    }
  }, [answerRevealed, entry])

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

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={answerRevealed ? 'Answer' : 'Question'}
    >
      <div className={styles.modalPanel}>
        {!answerRevealed ? (
          <>
            <p className={styles.eyebrow}>{meta.label}</p>
            <h2 className={styles.title}>{entry.question}</h2>
            <div className={styles.modalActions}>
              <button
                ref={revealButtonRef}
                type="button"
                className={styles.primaryAction}
                onClick={onRevealAnswer}
              >
                Reveal answer
              </button>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={onCloseQuestion}
              >
                Back to categories
              </button>
            </div>
          </>
        ) : (
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
            <button
              ref={nextButtonRef}
              type="button"
              className={styles.primaryAction}
              onClick={onNextCard}
            >
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  return (
    <>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>{meta.label}</p>
        <h2 className={styles.title}>{entry.question}</h2>

        {!answerRevealed && (
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

      {answerRevealed &&
        createPortal(
          <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Answer"
          >
            <div className={styles.modalPanel}>
              <p className={styles.eyebrow}>{meta.label}</p>
              <h2 className={styles.title}>{entry.question}</h2>

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
                <button
                  ref={nextButtonRef}
                  type="button"
                  className={styles.primaryAction}
                  onClick={onNextCard}
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
