import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { getCategoryMeta } from '../data/categories'
import type { CardEntry, DeckCategoryMeta } from '../types'
import styles from './QuestionView.module.css'

const CHATGPT_URL = 'https://chatgpt.com/'

type QuestionViewProps = {
  entry: CardEntry | null
  deckName: string
  categoryMeta?: DeckCategoryMeta
  answerRevealed: boolean
  remainingCount: number
  onCloseQuestion: () => void
  onRevealAnswer: () => void
  onNextCard: () => void
}

export function QuestionView({
  entry,
  deckName,
  categoryMeta,
  answerRevealed,
  remainingCount,
  onCloseQuestion,
  onRevealAnswer,
  onNextCard,
}: QuestionViewProps) {
  const revealButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const dialogLabelId = useId()
  const dialogDescriptionId = useId()

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

  if (!entry) {
    return <p className={styles.hint}>Choose a category to open a question.</p>
  }

  const meta = getCategoryMeta(entry.category, categoryMeta)
  const chatGptUrl = buildChatGptUrl({
    answer: entry.answer,
    categoryLabel: meta.label,
    deckName,
    explanation: entry.explanation,
    question: entry.question,
    sourceLabel: entry.source?.label,
    sourceUrl: entry.source?.url,
  })
  const nextLabel = remainingCount > 0 ? 'Next card' : 'Finish deck'
  const explanation = entry.explanation?.trim() || null
  const sourceLabel = entry.source?.label?.trim() || null
  const source = sourceLabel ? entry.source : null
  const hasContext = Boolean(explanation || sourceLabel)

  function handleAskChatGpt() {
    window.open(chatGptUrl, '_blank', 'noopener,noreferrer')
  }

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogLabelId}
      aria-describedby={dialogDescriptionId}
    >
      <div className={styles.modalPanel}>
        {!answerRevealed ? (
          <>
            <p id={dialogLabelId} className={styles.eyebrow}>
              {meta.label} question
            </p>
            <p className={styles.categoryPrompt}>{meta.prompt}</p>
            <h2 id={dialogDescriptionId} className={styles.title}>
              {entry.question}
            </h2>
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
            <p id={dialogLabelId} className={styles.answerLabel}>
              Answer
            </p>
            <p id={dialogDescriptionId} className={styles.answer}>
              {entry.answer}
            </p>
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
            <div className={styles.modalActions}>
              <button
                ref={nextButtonRef}
                type="button"
                className={styles.primaryAction}
                onClick={onNextCard}
              >
                {nextLabel}
              </button>
              <button
                type="button"
                className={styles.tertiaryAction}
                onClick={handleAskChatGpt}
              >
                Ask ChatGPT for more
              </button>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={onCloseQuestion}
              >
                Back to categories
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

type ChatGptPromptInput = {
  answer: string
  categoryLabel: string
  deckName: string
  explanation?: string
  question: string
  sourceLabel?: string
  sourceUrl?: string
}

function buildChatGptUrl({
  answer,
  categoryLabel,
  deckName,
  explanation,
  question,
  sourceLabel,
  sourceUrl,
}: ChatGptPromptInput): string {
  const searchParams = new URLSearchParams({
    q: buildChatGptPrompt({
      answer,
      categoryLabel,
      deckName,
      explanation,
      question,
      sourceLabel,
      sourceUrl,
    }),
  })

  return `${CHATGPT_URL}?${searchParams.toString()}`
}

function buildChatGptPrompt({
  answer,
  categoryLabel,
  deckName,
  explanation,
  question,
  sourceLabel,
  sourceUrl,
}: ChatGptPromptInput): string {
  const promptSections = [
    'I am using a trivia deck during a board game. Give me a short, lively explanation of the revealed answer so I can read it aloud or paraphrase it for the table.',
    `Deck: ${limitPromptField(deckName, 80)}`,
    `Category: ${limitPromptField(categoryLabel, 60)}`,
    `Question: ${limitPromptField(question, 280)}`,
    `Answer: ${limitPromptField(answer, 180)}`,
  ]

  const trimmedExplanation = explanation?.trim()
  if (trimmedExplanation) {
    promptSections.push(
      `Existing context: ${limitPromptField(trimmedExplanation, 320)}`,
    )
  }

  const trimmedSourceLabel = sourceLabel?.trim()
  if (trimmedSourceLabel) {
    promptSections.push(
      `Existing source label: ${limitPromptField(trimmedSourceLabel, 120)}`,
    )
  }

  const trimmedSourceUrl = sourceUrl?.trim()
  if (trimmedSourceUrl) {
    promptSections.push(`Existing source URL: ${limitPromptField(trimmedSourceUrl, 200)}`)
  }

  promptSections.push(
    'Keep it under 140 words. Explain why the answer is correct, mention any notable caveat if one matters, and include one memorable extra detail.',
  )

  return promptSections.join('\n')
}

function limitPromptField(value: string, maxLength: number): string {
  const trimmedValue = value.trim()
  if (trimmedValue.length <= maxLength) {
    return trimmedValue
  }

  return `${trimmedValue.slice(0, maxLength - 3).trimEnd()}...`
}
