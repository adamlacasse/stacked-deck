import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

import { afterEach, describe, expect, it } from 'vitest'

import { validateDeck } from '../data/validateDeck'
import { generateDeckData } from '../../scripts/generate-csc6314-deck.mjs'

const REQUIRED_LANES = [
  'Foundations',
  'Architectures',
  'Training',
  'Math & Loss',
  'Frameworks',
  'Applications',
]

function makeEntries(sourcePath = 'Module 1/source.md') {
  return REQUIRED_LANES.map((lane, index) => ({
    lane,
    question: `${lane} question ${index + 1}?`,
    answer: `${lane} answer ${index + 1}`,
    sourcePath,
  }))
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function writeText(filePath, contents = '# Source\n') {
  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, contents, 'utf8')
}

function createCourseRepo(fixtures) {
  const courseRepo = mkdtempSync(path.join(os.tmpdir(), 'csc6314-course-'))

  for (const fixture of fixtures) {
    const moduleDir = path.join(courseRepo, `Module ${fixture.moduleNumber}`)
    mkdirSync(moduleDir, { recursive: true })

    const defaultSourcePath = `Module ${fixture.moduleNumber}/source.md`
    writeText(path.join(courseRepo, defaultSourcePath))

    if (fixture.extraSources) {
      for (const sourcePath of fixture.extraSources) {
        writeText(path.join(courseRepo, sourcePath))
      }
    }

    writeJson(path.join(moduleDir, 'study-deck-cards.json'), {
      cards: fixture.cards.map((card, index) => ({
        id: card.id ?? `module-${fixture.moduleNumber}-card-${index + 1}`,
        difficulty: card.difficulty ?? 'easy',
        tags: card.tags ?? [`module-${fixture.moduleNumber}`],
        entries: card.entries ?? makeEntries(defaultSourcePath),
      })),
    })
  }

  return courseRepo
}

const tempDirs = []

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop(), { recursive: true, force: true })
  }
})

describe('generateDeckData', () => {
  it('builds a valid CSC-6314 deck from module study files', async () => {
    const courseRepo = createCourseRepo([
      {
        moduleNumber: 2,
        cards: [{ id: 'm02-card-0001', difficulty: 'medium' }],
      },
      {
        moduleNumber: 1,
        cards: [{ id: 'm01-card-0001', difficulty: 'easy' }],
      },
    ])
    tempDirs.push(courseRepo)

    const deck = await generateDeckData({ courseRepo })

    expect(deck.categoryMeta.geography.label).toBe('Foundations')
    expect(deck.cards.map((card) => card.id)).toEqual([
      'm01-card-0001',
      'm02-card-0001',
    ])
    expect(validateDeck(deck)).toEqual({ valid: true })
  })

  it('rejects invalid source paths', async () => {
    const courseRepo = createCourseRepo([
      {
        moduleNumber: 1,
        cards: [
          {
            id: 'm01-card-0001',
            entries: makeEntries('Module 1/missing-source.md'),
          },
        ],
      },
    ])
    tempDirs.push(courseRepo)

    await expect(generateDeckData({ courseRepo })).rejects.toThrow(
      'does not exist',
    )
  })

  it('rejects duplicate card ids across modules', async () => {
    const courseRepo = createCourseRepo([
      {
        moduleNumber: 1,
        cards: [{ id: 'duplicate-card' }],
      },
      {
        moduleNumber: 2,
        cards: [{ id: 'duplicate-card' }],
      },
    ])
    tempDirs.push(courseRepo)

    await expect(generateDeckData({ courseRepo })).rejects.toThrow(
      'Duplicate curated card id "duplicate-card"',
    )
  })

  it('rejects cards with missing lanes', async () => {
    const courseRepo = createCourseRepo([
      {
        moduleNumber: 1,
        cards: [
          {
            id: 'm01-card-0001',
            entries: makeEntries().slice(0, 5),
          },
        ],
      },
    ])
    tempDirs.push(courseRepo)

    await expect(generateDeckData({ courseRepo })).rejects.toThrow(
      'must include exactly 6 entries',
    )
  })

  it('rejects unsupported lane names', async () => {
    const entries = makeEntries()
    entries[0] = {
      ...entries[0],
      lane: 'Hardware',
    }

    const courseRepo = createCourseRepo([
      {
        moduleNumber: 1,
        cards: [
          {
            id: 'm01-card-0001',
            entries,
          },
        ],
      },
    ])
    tempDirs.push(courseRepo)

    await expect(generateDeckData({ courseRepo })).rejects.toThrow(
      'unsupported lane "Hardware"',
    )
  })
})
