import { useRef } from 'react'
import { CategoryList } from './CategoryList'
import { QuestionView } from './QuestionView'
import styles from './CardView.module.css'
import type { CardEntry, Category, TriviaCard } from '../types'

type CardViewProps = {
  card: TriviaCard
  selectedCategory: Category | null
  selectedEntry: CardEntry | null
  answerRevealed: boolean
  onSelectCategory: (category: Category) => void
  onRevealAnswer: () => void
  onNextCard: () => void
  remainingCount: number
}

const SWIPE_THRESHOLD_PX = 60

export function CardView({
  card,
  selectedCategory,
  selectedEntry,
  answerRevealed,
  onSelectCategory,
  onRevealAnswer,
  onNextCard,
  remainingCount,
}: CardViewProps) {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)

  function handlePointerDown(e: React.PointerEvent<HTMLElement>) {
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLElement>) {
    if (!pointerStartRef.current) return

    const deltaX = e.clientX - pointerStartRef.current.x
    const deltaY = e.clientY - pointerStartRef.current.y
    pointerStartRef.current = null

    if (
      answerRevealed &&
      Math.abs(deltaX) >= SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      onNextCard()
    }
  }

  function handlePointerCancel() {
    pointerStartRef.current = null
  }

  return (
    <section
      className={styles.cardShell}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Active card</p>
            <h1 className={styles.title}>Choose a category and read it aloud.</h1>
          </div>
          <p className={styles.cardId}>{card.id}</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.categories}>
            <CategoryList
              entries={card.entries}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          </div>

          <QuestionView
            key={selectedCategory ?? 'none'}
            entry={selectedEntry}
            answerRevealed={answerRevealed}
            remainingCount={remainingCount}
            onRevealAnswer={onRevealAnswer}
            onNextCard={onNextCard}
          />
        </div>
      </div>
    </section>
  )
}
