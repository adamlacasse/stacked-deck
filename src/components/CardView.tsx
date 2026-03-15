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
  return (
    <section className={styles.cardShell}>
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
