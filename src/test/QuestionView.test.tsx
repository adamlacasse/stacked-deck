import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { QuestionView } from '../components/QuestionView'
import type { CardEntry } from '../types'

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

describe('QuestionView', () => {
  it('shows a category prompt when no entry is selected', () => {
    render(
      <QuestionView
        entry={null}
        answerRevealed={false}
        remainingCount={5}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByText('Pick a category to see the question.')).toBeInTheDocument()
  })

  it('keeps context hidden before answer reveal', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        answerRevealed={false}
        remainingCount={5}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.queryByLabelText('Answer context')).not.toBeInTheDocument()
  })

  it('shows context and linked source after answer reveal', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        answerRevealed
        remainingCount={5}
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
        answerRevealed
        remainingCount={5}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.getByText('Game-night reference card')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Game-night reference card' })).not.toBeInTheDocument()
  })

  it('renders answer inside a modal dialog when revealed', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        answerRevealed
        remainingCount={5}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    const dialog = screen.getByRole('dialog', { name: 'Answer' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('The Nile')).toBeInTheDocument()
  })

  it('does not render a modal dialog before answer reveal', () => {
    render(
      <QuestionView
        entry={makeEntry()}
        answerRevealed={false}
        remainingCount={5}
        onRevealAnswer={vi.fn()}
        onNextCard={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
