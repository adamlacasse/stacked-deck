import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { QuestionView } from '../components/QuestionView'
import type { CardEntry, DeckCategoryMeta } from '../types'

function makeEntry(): CardEntry {
  return {
    category: 'geography',
    question: 'What is the longest river in the world?',
    answer: 'The Nile',
    explanation:
      'Some modern measurements argue the Amazon is longer; many trivia sets still accept the Nile.',
    source: {
      label: 'Encyclopaedia Britannica',
      url: 'https://www.britannica.com/place/Nile-River',
    },
  }
}

const customCategoryMeta: DeckCategoryMeta = {
  geography: {
    label: 'Foundations',
    prompt: 'Definitions and core distinctions',
  },
}

describe('QuestionView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a category prompt when no entry is selected', () => {
    render(
      <QuestionView
        entry={null}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByText('Choose a category to open a question.')).toBeInTheDocument()
  })

  it('renders deck-specific category labels and prompts in question state', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={customCategoryMeta}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByText('Foundations question')).toBeInTheDocument()
    expect(screen.getByText('Definitions and core distinctions')).toBeInTheDocument()
  })

  it('keeps context hidden before answer reveal', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.queryByLabelText('Answer context')).not.toBeInTheDocument()
  })

  it('renders question inside a modal dialog immediately after category selection', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    const dialog = screen.getByRole('dialog', { name: /question/i })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: 'Reveal answer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to categories' })).toBeInTheDocument()
  })

  it('shows context and linked source after answer reveal', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Answer context')).toBeInTheDocument()
    expect(screen.getByText(/Some modern measurements argue the Amazon is longer/i)).toBeInTheDocument()

    const sourceLink = screen.getByRole('link', {
      name: 'Encyclopaedia Britannica',
    })
    expect(sourceLink).toHaveAttribute(
      'href',
      'https://www.britannica.com/place/Nile-River',
    )
  })

  it('renders source label without a link when no url is provided', () => {
    const entryWithoutUrl: CardEntry = {
      ...makeEntry(),
      source: {
        label: 'Game-night reference card',
      },
    }

    render(
      <QuestionView
        entry={entryWithoutUrl}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByText('Game-night reference card')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Game-night reference card' })).not.toBeInTheDocument()
  })

  it('renders an answer-only modal state when revealed', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    const dialog = screen.getByRole('dialog', { name: 'Answer' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('The Nile')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reveal answer' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask ChatGPT for more' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to categories' })).toBeInTheDocument()
    expect(screen.queryByText('What is the longest river in the world?')).not.toBeInTheDocument()
  })

  it('moves focus to reveal button when question state opens', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Reveal answer' })).toHaveFocus()
  })

  it('moves focus to next-card button when answer state opens', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Next card' })).toHaveFocus()
  })

  it('does not render a modal dialog before category selection', () => {
    render(
      <QuestionView
        entry={null}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onCloseQuestion when back to categories is pressed', () => {
    const onCloseQuestion = vi.fn()

    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={onCloseQuestion}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Back to categories' }))
    expect(onCloseQuestion).toHaveBeenCalledTimes(1)
  })

  it('calls onCloseQuestion when Escape is pressed in question state', () => {
    const onCloseQuestion = vi.fn()

    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed={false}
        remainingCount={5}
        onCloseQuestion={onCloseQuestion}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCloseQuestion).toHaveBeenCalledTimes(1)
  })

  it('does not close on Escape once answer is revealed', () => {
    const onCloseQuestion = vi.fn()

    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={onCloseQuestion}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCloseQuestion).not.toHaveBeenCalled()
  })

  it('calls onCloseQuestion when back to categories is pressed after reveal', () => {
    const onCloseQuestion = vi.fn()

    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={onCloseQuestion}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Back to categories' }))
    expect(onCloseQuestion).toHaveBeenCalledTimes(1)
  })

  it('opens ChatGPT in a new tab with a prefilled prompt after answer reveal', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)

    render(
      <QuestionView
        entry={makeEntry()}
        deckName="General Knowledge"
        categoryMeta={undefined}
        answerRevealed
        remainingCount={5}
        onCloseQuestion={vi.fn()}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ask ChatGPT for more' }))

    expect(openSpy).toHaveBeenCalledTimes(1)

    const [url, target, features] = openSpy.mock.calls[0] ?? []
    expect(target).toBe('_blank')
    expect(features).toBe('noopener,noreferrer')
    expect(typeof url).toBe('string')

    const parsedUrl = new URL(url as string)
    expect(parsedUrl.origin).toBe('https://chatgpt.com')

    const prompt = parsedUrl.searchParams.get('q')
    expect(prompt).toContain('Deck: General Knowledge')
    expect(prompt).toContain('Category: Geography')
    expect(prompt).toContain('Question: What is the longest river in the world?')
    expect(prompt).toContain('Answer: The Nile')
    expect(prompt).toContain('Existing source label: Encyclopaedia Britannica')
  })
})
