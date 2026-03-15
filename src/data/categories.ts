import type { Category } from '../types'

export const CATEGORY_META: Record<
  Category,
  { label: string; accent: string; prompt: string }
> = {
  geography: {
    label: 'Geography',
    accent: '#4d81c5',
    prompt: 'Places, maps, and landmarks',
  },
  entertainment: {
    label: 'Entertainment',
    accent: '#c8568f',
    prompt: 'Film, television, and music',
  },
  history: {
    label: 'History',
    accent: '#d6af33',
    prompt: 'Events, eras, and people',
  },
  arts: {
    label: 'Arts',
    accent: '#8f5c35',
    prompt: 'Books, painting, and culture',
  },
  science: {
    label: 'Science',
    accent: '#4f8c4a',
    prompt: 'Nature, medicine, and tech',
  },
  sports: {
    label: 'Sports',
    accent: '#d97732',
    prompt: 'Games, athletes, and records',
  },
}
