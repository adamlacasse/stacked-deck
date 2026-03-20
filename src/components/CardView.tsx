import { useRef } from 'react'
import { CategoryList } from './CategoryList'
import { QuestionView } from './QuestionView'
import styles from './CardView.module.css'
import { SWIPE_THRESHOLD_PX } from '../constants'
import type { CardEntry, Category, TriviaCard } from '../types'

type CardViewProps = {
  card: TriviaCard
  selectedCategory: Category | null
  selectedEntry: CardEntry | null
  answerRevealed: boolean
  onSelectCategory: (category: Category) => void
  onCloseQuestion: () => void
  onRevealAnswer: () => void
  onNextCard: () => void
  remainingCount: number
}

export function CardView({
  card,
  selectedCategory,
  selectedEntry,
  answerRevealed,
  onSelectCategory,
  onCloseQuestion,
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
          <h1 className={styles.title}>Pick a category</h1>
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
            onCloseQuestion={onCloseQuestion}
            onRevealAnswer={onRevealAnswer}
            onNextCard={onNextCard}
          />
        </div>
      </div>
    </section>
  )
}
