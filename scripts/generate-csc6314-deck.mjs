import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const DECK_ID = 'csc-6314-study-guide'
const REQUIRED_LANES = [
  'Foundations',
  'Architectures',
  'Training',
  'Math & Loss',
  'Frameworks',
  'Applications',
]

const LANE_TO_CATEGORY = {
  Foundations: 'geography',
  Architectures: 'entertainment',
  Training: 'history',
  'Math & Loss': 'arts',
  Frameworks: 'science',
  Applications: 'sports',
}

export const CSC6314_CATEGORY_META = {
  geography: {
    label: 'Foundations',
    prompt: 'Core ideas, definitions, and distinctions',
  },
  entertainment: {
    label: 'Architectures',
    prompt: 'Model families, layer roles, and structure',
  },
  history: {
    label: 'Training',
    prompt: 'Optimization, convergence, and regularization',
  },
  arts: {
    label: 'Math & Loss',
    prompt: 'Formulas, metrics, objectives, and notation',
  },
  science: {
    label: 'Frameworks',
    prompt: 'PyTorch, TensorFlow, Keras, and tooling',
  },
  sports: {
    label: 'Applications',
    prompt: 'Real-world use cases and assignment contexts',
  },
}

const TEXT_SOURCE_EXTENSIONS = new Set(['.md', '.txt', '.html'])
const CATEGORY_ORDER = [
  'geography',
  'entertainment',
  'history',
  'arts',
  'science',
  'sports',
]

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isDifficulty(value) {
  return value === 'easy' || value === 'medium' || value === 'hard'
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function parseModuleList(value) {
  return value.split(',').map((segment) => {
    const trimmed = segment.trim()
    assert(/^\d+$/.test(trimmed), `Invalid module number "${segment}".`)
    return Number(trimmed)
  })
}

function parseArgs(argv) {
  const options = {
    courseRepo: null,
    modules: null,
    output: fileURLToPath(
      new URL('../src/data/csc-6314-deck.json', import.meta.url),
    ),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--course-repo') {
      options.courseRepo = argv[index + 1] ?? null
      index += 1
      continue
    }

    if (arg === '--modules') {
      options.modules = parseModuleList(argv[index + 1] ?? '')
      index += 1
      continue
    }

    if (arg === '--output') {
      options.output = path.resolve(argv[index + 1] ?? '')
      index += 1
      continue
    }

    throw new Error(`Unknown argument "${arg}".`)
  }

  assert(
    hasText(options.courseRepo),
    'Missing required --course-repo /absolute/path argument.',
  )

  return {
    courseRepo: path.resolve(options.courseRepo),
    modules: options.modules,
    output: options.output,
  }
}

function getModuleNumberFromDirectoryName(name) {
  const match = /^Module (\d+)$/.exec(name)
  return match ? Number(match[1]) : null
}

function getModuleLabel(moduleNumber) {
  return `Module ${moduleNumber}`
}

function normalizeRelativePath(courseRepo, absolutePath) {
  return path.relative(courseRepo, absolutePath).split(path.sep).join('/')
}

async function assertTextSourceExists(courseRepo, sourcePath, context) {
  assert(
    hasText(sourcePath) && !path.isAbsolute(sourcePath),
    `${context} sourcePath must be a non-empty repo-relative path.`,
  )

  const resolved = path.resolve(courseRepo, sourcePath)
  const relative = path.relative(courseRepo, resolved)
  assert(
    relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative),
    `${context} sourcePath must stay inside the course repo.`,
  )

  const extension = path.extname(resolved).toLowerCase()
  assert(
    TEXT_SOURCE_EXTENSIONS.has(extension),
    `${context} sourcePath must point to a text source (.md, .txt, or .html).`,
  )

  let sourceStats

  try {
    sourceStats = await stat(resolved)
  } catch {
    throw new Error(`${context} sourcePath "${sourcePath}" does not exist.`)
  }

  assert(sourceStats.isFile(), `${context} sourcePath "${sourcePath}" must be a file.`)

  return normalizeRelativePath(courseRepo, resolved)
}

function sortEntries(entries) {
  return [...entries].sort(
    (left, right) =>
      CATEGORY_ORDER.indexOf(left.category) - CATEGORY_ORDER.indexOf(right.category),
  )
}

function validateDeckShape(deck) {
  assert(hasText(deck.id), 'Generated deck is missing an id.')
  assert(hasText(deck.name), 'Generated deck is missing a name.')
  assert(Array.isArray(deck.cards) && deck.cards.length > 0, 'Generated deck has no cards.')

  for (const category of CATEGORY_ORDER) {
    const meta = deck.categoryMeta?.[category]
    assert(meta && hasText(meta.label), `Generated deck categoryMeta "${category}" is missing a label.`)
    assert(meta && hasText(meta.prompt), `Generated deck categoryMeta "${category}" is missing a prompt.`)
  }

  const seenCardIds = new Set()

  for (const card of deck.cards) {
    assert(hasText(card.id), 'Generated card is missing an id.')
    assert(!seenCardIds.has(card.id), `Duplicate generated card id "${card.id}".`)
    seenCardIds.add(card.id)
    assert(Array.isArray(card.entries) && card.entries.length === 6, `Generated card "${card.id}" must have exactly 6 entries.`)

    const seenCategories = new Set()
    for (const entry of card.entries) {
      assert(CATEGORY_ORDER.includes(entry.category), `Generated card "${card.id}" has unsupported category "${entry.category}".`)
      assert(!seenCategories.has(entry.category), `Generated card "${card.id}" duplicates category "${entry.category}".`)
      seenCategories.add(entry.category)
      assert(hasText(entry.question), `Generated card "${card.id}" has an empty question.`)
      assert(hasText(entry.answer), `Generated card "${card.id}" has an empty answer.`)
      if (entry.explanation !== undefined) {
        assert(hasText(entry.explanation), `Generated card "${card.id}" has an empty explanation.`)
      }
      if (entry.source !== undefined) {
        assert(hasText(entry.source.label), `Generated card "${card.id}" has an invalid source label.`)
      }
    }
  }
}

async function loadModuleCardFile(courseRepo, moduleNumber, filePath) {
  const fileContents = await readFile(filePath, 'utf8')
  let parsed

  try {
    parsed = JSON.parse(fileContents)
  } catch (error) {
    throw new Error(
      `${normalizeRelativePath(courseRepo, filePath)} is not valid JSON: ${error.message}`,
    )
  }

  assert(
    typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed),
    `${normalizeRelativePath(courseRepo, filePath)} must contain an object.`,
  )

  const cards = parsed.cards
  assert(
    Array.isArray(cards) && cards.length > 0,
    `${normalizeRelativePath(courseRepo, filePath)} must include a non-empty cards array.`,
  )

  return Promise.all(
    cards.map(async (card, cardIndex) => {
      const cardContext = `${normalizeRelativePath(courseRepo, filePath)} card #${cardIndex + 1}`

      assert(
        typeof card === 'object' && card !== null && !Array.isArray(card),
        `${cardContext} must be an object.`,
      )
      assert(hasText(card.id), `${cardContext} is missing an id.`)

      if (card.difficulty !== undefined) {
        assert(
          isDifficulty(card.difficulty),
          `${cardContext} has unsupported difficulty "${card.difficulty}".`,
        )
      }

      if (card.tags !== undefined) {
        assert(Array.isArray(card.tags), `${cardContext} tags must be an array.`)
        for (const tag of card.tags) {
          assert(hasText(tag), `${cardContext} tags must be non-empty strings.`)
        }
      }

      assert(
        Array.isArray(card.entries) && card.entries.length === REQUIRED_LANES.length,
        `${cardContext} must include exactly ${REQUIRED_LANES.length} entries.`,
      )

      const seenLanes = new Set()
      const deckEntries = await Promise.all(
        card.entries.map(async (entry, entryIndex) => {
          const entryContext = `${cardContext} entry #${entryIndex + 1}`
          assert(
            typeof entry === 'object' && entry !== null && !Array.isArray(entry),
            `${entryContext} must be an object.`,
          )
          assert(hasText(entry.lane), `${entryContext} is missing a lane.`)
          assert(
            Object.hasOwn(LANE_TO_CATEGORY, entry.lane),
            `${entryContext} uses unsupported lane "${entry.lane}".`,
          )
          assert(!seenLanes.has(entry.lane), `${cardContext} duplicates lane "${entry.lane}".`)
          seenLanes.add(entry.lane)
          assert(hasText(entry.question), `${entryContext} has an empty question.`)
          assert(hasText(entry.answer), `${entryContext} has an empty answer.`)
          if (entry.explanation !== undefined) {
            assert(hasText(entry.explanation), `${entryContext} has an empty explanation.`)
          }

          const normalizedSourcePath = await assertTextSourceExists(
            courseRepo,
            entry.sourcePath,
            entryContext,
          )

          return {
            category: LANE_TO_CATEGORY[entry.lane],
            question: entry.question.trim(),
            answer: entry.answer.trim(),
            ...(entry.explanation ? { explanation: entry.explanation.trim() } : {}),
            source: {
              label: normalizedSourcePath,
            },
          }
        }),
      )

      for (const lane of REQUIRED_LANES) {
        assert(seenLanes.has(lane), `${cardContext} is missing lane "${lane}".`)
      }

      return {
        moduleNumber,
        card: {
          id: card.id.trim(),
          deckId: DECK_ID,
          ...(card.difficulty ? { difficulty: card.difficulty } : {}),
          ...(card.tags ? { tags: [...card.tags] } : {}),
          entries: sortEntries(deckEntries),
        },
      }
    }),
  )
}

export async function findModuleCardFiles(courseRepo, modules = null) {
  if (modules && modules.length > 0) {
    return modules.map((moduleNumber) => ({
      moduleNumber,
      filePath: path.join(courseRepo, getModuleLabel(moduleNumber), 'study-deck-cards.json'),
    }))
  }

  const directoryEntries = await readdir(courseRepo, { withFileTypes: true })

  return directoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      moduleNumber: getModuleNumberFromDirectoryName(entry.name),
    }))
    .filter((entry) => entry.moduleNumber !== null)
    .map((entry) => ({
      moduleNumber: entry.moduleNumber,
      filePath: path.join(courseRepo, entry.name, 'study-deck-cards.json'),
    }))
}

export async function generateDeckData({ courseRepo, modules = null }) {
  const moduleFiles = await findModuleCardFiles(courseRepo, modules)
  const existingModuleFiles = []

  for (const moduleFile of moduleFiles) {
    try {
      const fileStats = await stat(moduleFile.filePath)
      if (fileStats.isFile()) {
        existingModuleFiles.push(moduleFile)
      }
    } catch {
      if (modules && modules.length > 0) {
        throw new Error(
          `Missing study deck source for ${getModuleLabel(moduleFile.moduleNumber)} at ${normalizeRelativePath(courseRepo, moduleFile.filePath)}.`,
        )
      }
    }
  }

  assert(existingModuleFiles.length > 0, 'No Module X/study-deck-cards.json files were found.')

  const cardsWithModule = []
  const seenCardIds = new Set()

  for (const moduleFile of existingModuleFiles) {
    const loadedCards = await loadModuleCardFile(
      courseRepo,
      moduleFile.moduleNumber,
      moduleFile.filePath,
    )

    for (const loaded of loadedCards) {
      assert(
        !seenCardIds.has(loaded.card.id),
        `Duplicate curated card id "${loaded.card.id}" across study deck sources.`,
      )
      seenCardIds.add(loaded.card.id)
      cardsWithModule.push(loaded)
    }
  }

  cardsWithModule.sort(
    (left, right) =>
      left.moduleNumber - right.moduleNumber ||
      left.card.id.localeCompare(right.card.id),
  )

  const deck = {
    id: DECK_ID,
    name: 'CSC-6314 Study Guide',
    description: 'Course-aligned flashcards for CSC-6314 Deep Learning review sessions.',
    categoryMeta: CSC6314_CATEGORY_META,
    cards: cardsWithModule.map(({ card }) => card),
  }

  validateDeckShape(deck)
  return deck
}

export async function writeDeckFile(outputPath, deck) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(deck, null, 2)}\n`, 'utf8')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const deck = await generateDeckData(options)
  await writeDeckFile(options.output, deck)
  console.log(
    `Generated ${deck.cards.length} CSC-6314 cards into ${options.output}.`,
  )
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
