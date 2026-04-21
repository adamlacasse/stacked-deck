import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { validateDeck } from '../src/data/validateDeck.ts'
import { CATEGORY_ORDER } from '../src/types.ts'
import type {
  CardEntry,
  Category,
  DeckCategoryMeta,
  Difficulty,
  TriviaCard,
  TriviaDeck,
} from '../src/types.ts'

type Lane = 'Foundations' | 'Architectures' | 'Training' | 'Math & Loss' | 'Frameworks' | 'Applications'

interface ModuleFile {
  moduleNumber: number
  filePath: string
}

interface ParsedOptions {
  courseRepo: string
  modules: number[] | null
  output: string
}

interface RawEntry {
  lane: string
  question: string
  answer: string
  explanation?: string
  sourcePath: string
}

interface RawCard {
  id: string
  difficulty?: string
  tags?: unknown[]
  entries: unknown[]
}

interface RawCardFile {
  cards: unknown[]
}

const DECK_ID = 'csc-6314-study-guide'
const MODULE_CARD_FILENAME = 'study-deck-cards.json'
const MODULE_DIRECTORY_PATTERN = /^Module (\d+)$/
const MODULE_SOURCE_PATTERN = /^Module (\d+)(?:\/|$)/
const GENERATED_CARD_SOURCE_PATTERN = /^Module (\d+)\/study-deck-cards\.json$/
const CARD_ID_MODULE_PATTERN = /^m(\d+)-card-\d+$/i
const SCRIPT_FILE_PATH = import.meta.url.startsWith('file:')
  ? fileURLToPath(import.meta.url)
  : null
const DEFAULT_OUTPUT = SCRIPT_FILE_PATH
  ? path.resolve(path.dirname(SCRIPT_FILE_PATH), '../src/data/csc-6314-deck.json')
  : path.resolve(process.cwd(), 'src/data/csc-6314-deck.json')

const REQUIRED_LANES: Lane[] = [
  'Foundations',
  'Architectures',
  'Training',
  'Math & Loss',
  'Frameworks',
  'Applications',
]

const LANE_TO_CATEGORY: Record<Lane, Category> = {
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
} satisfies DeckCategoryMeta

const TEXT_SOURCE_EXTENSIONS = new Set(['.md', '.txt', '.html'])

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard'
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function parseModuleList(value: string): number[] {
  return [...new Set(
    value.split(',').map((segment) => {
      const trimmed = segment.trim()
      assert(/^\d+$/.test(trimmed), `Invalid module number "${segment}".`)
      return Number(trimmed)
    }),
  )].sort((left, right) => left - right)
}

function parseArgs(argv: string[]): ParsedOptions {
  const options: { courseRepo: string | null; modules: number[] | null; output: string } = {
    courseRepo: null,
    modules: null,
    output: DEFAULT_OUTPUT,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const nextValue = argv[index + 1]

    if (arg === '--course-repo') {
      assert(hasText(nextValue), 'Missing value for --course-repo.')
      options.courseRepo = nextValue
      index += 1
      continue
    }

    if (arg === '--modules') {
      assert(hasText(nextValue), 'Missing value for --modules.')
      options.modules = parseModuleList(nextValue)
      index += 1
      continue
    }

    if (arg === '--output') {
      assert(hasText(nextValue), 'Missing value for --output.')
      options.output = path.resolve(nextValue)
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

function getModuleNumberFromDirectoryName(name: string): number | null {
  const match = MODULE_DIRECTORY_PATTERN.exec(name)
  return match ? Number(match[1]) : null
}

function getModuleLabel(moduleNumber: number): string {
  return `Module ${moduleNumber}`
}

function getModuleCardSourceLabel(moduleNumber: number): string {
  return `${getModuleLabel(moduleNumber)}/${MODULE_CARD_FILENAME}`
}

function normalizeRelativePath(courseRepo: string, absolutePath: string): string {
  return path.relative(courseRepo, absolutePath).split(path.sep).join('/')
}

function extractModuleNumberFromPath(value: string | undefined): number | null {
  if (!hasText(value)) {
    return null
  }

  const match = MODULE_SOURCE_PATTERN.exec(value)
  return match ? Number(match[1]) : null
}

function extractModuleNumberFromCardId(cardId: string): number | null {
  const match = CARD_ID_MODULE_PATTERN.exec(cardId)
  return match ? Number(match[1]) : null
}

function getCardModuleNumber(card: TriviaCard): number | null {
  if (hasText(card.source)) {
    const sourceMatch = GENERATED_CARD_SOURCE_PATTERN.exec(card.source)
    if (sourceMatch) {
      return Number(sourceMatch[1])
    }
  }

  const entryModuleNumbers = card.entries
    .map((entry) => extractModuleNumberFromPath(entry.source?.label))
    .filter((moduleNumber): moduleNumber is number => moduleNumber !== null)

  if (entryModuleNumbers.length !== card.entries.length) {
    return extractModuleNumberFromCardId(card.id)
  }

  if (entryModuleNumbers.every((moduleNumber) => moduleNumber === entryModuleNumbers[0])) {
    return entryModuleNumbers[0]
  }

  return extractModuleNumberFromCardId(card.id)
}

async function assertTextSourceExists(
  courseRepo: string,
  sourcePath: unknown,
  context: string,
): Promise<string> {
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

function sortEntries(entries: CardEntry[]): TriviaCard['entries'] {
  assert(
    entries.length === CATEGORY_ORDER.length,
    `Generated card must have exactly ${CATEGORY_ORDER.length} entries before sorting.`,
  )

  return [...entries].sort(
    (left, right) =>
      CATEGORY_ORDER.indexOf(left.category) - CATEGORY_ORDER.indexOf(right.category),
  ) as TriviaCard['entries']
}

function compareModuleNumbers(left: number | null, right: number | null): number {
  if (left === right) {
    return 0
  }

  if (left === null) {
    return 1
  }

  if (right === null) {
    return -1
  }

  return left - right
}

function sortCards(cards: TriviaCard[]): TriviaCard[] {
  return [...cards].sort(
    (left, right) =>
      compareModuleNumbers(getCardModuleNumber(left), getCardModuleNumber(right)) ||
      left.id.localeCompare(right.id),
  )
}

function assertDeckValid(deck: TriviaDeck, context: string): void {
  const result = validateDeck(deck)
  if (result.valid) {
    return
  }

  throw new Error(
    [
      `${context} is invalid:`,
      ...result.errors.map((error) => `- ${error}`),
    ].join('\n'),
  )
}

function buildDeck(cards: TriviaCard[]): TriviaDeck {
  const deck: TriviaDeck = {
    id: DECK_ID,
    name: 'CSC-6314 Study Guide',
    description: 'Course-aligned flashcards for CSC-6314 Deep Learning review sessions.',
    categoryMeta: CSC6314_CATEGORY_META,
    cards: sortCards(cards),
  }

  assertDeckValid(deck, 'Generated deck')
  return deck
}

async function loadModuleCardFile(
  courseRepo: string,
  moduleFile: ModuleFile,
): Promise<TriviaCard[]> {
  const fileContents = await readFile(moduleFile.filePath, 'utf8')
  let parsed: unknown

  try {
    parsed = JSON.parse(fileContents) as unknown
  } catch (error) {
    throw new Error(
      `${normalizeRelativePath(courseRepo, moduleFile.filePath)} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  assert(
    typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed),
    `${normalizeRelativePath(courseRepo, moduleFile.filePath)} must contain an object.`,
  )

  const file = parsed as RawCardFile
  const cards = file.cards
  assert(
    Array.isArray(cards) && cards.length > 0,
    `${normalizeRelativePath(courseRepo, moduleFile.filePath)} must include a non-empty cards array.`,
  )

  return Promise.all(
    cards.map(async (rawCard, cardIndex) => {
      const cardContext = `${normalizeRelativePath(courseRepo, moduleFile.filePath)} card #${cardIndex + 1}`

      assert(
        typeof rawCard === 'object' && rawCard !== null && !Array.isArray(rawCard),
        `${cardContext} must be an object.`,
      )

      const card = rawCard as RawCard
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

      const seenLanes = new Set<string>()
      const deckEntries = await Promise.all(
        card.entries.map(async (rawEntry, entryIndex) => {
          const entryContext = `${cardContext} entry #${entryIndex + 1}`
          assert(
            typeof rawEntry === 'object' && rawEntry !== null && !Array.isArray(rawEntry),
            `${entryContext} must be an object.`,
          )

          const entry = rawEntry as RawEntry
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

          const lane = entry.lane as Lane
          return {
            category: LANE_TO_CATEGORY[lane],
            question: entry.question.trim(),
            answer: entry.answer.trim(),
            ...(entry.explanation ? { explanation: entry.explanation.trim() } : {}),
            source: {
              label: normalizedSourcePath,
            },
          } satisfies CardEntry
        }),
      )

      for (const lane of REQUIRED_LANES) {
        assert(seenLanes.has(lane), `${cardContext} is missing lane "${lane}".`)
      }

      return {
        id: card.id.trim(),
        source: getModuleCardSourceLabel(moduleFile.moduleNumber),
        deckId: DECK_ID,
        ...(isDifficulty(card.difficulty) ? { difficulty: card.difficulty } : {}),
        ...(card.tags ? { tags: [...card.tags].filter((tag): tag is string => hasText(tag)) } : {}),
        entries: sortEntries(deckEntries),
      } satisfies TriviaCard
    }),
  )
}

export async function findModuleCardFiles(
  courseRepo: string,
  modules: number[] | null = null,
): Promise<ModuleFile[]> {
  if (modules && modules.length > 0) {
    return modules.map((moduleNumber) => ({
      moduleNumber,
      filePath: path.join(courseRepo, getModuleLabel(moduleNumber), MODULE_CARD_FILENAME),
    }))
  }

  const directoryEntries = await readdir(courseRepo, { withFileTypes: true })

  return directoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      moduleNumber: getModuleNumberFromDirectoryName(entry.name),
    }))
    .filter((entry): entry is { name: string; moduleNumber: number } => entry.moduleNumber !== null)
    .map((entry) => ({
      moduleNumber: entry.moduleNumber,
      filePath: path.join(courseRepo, entry.name, MODULE_CARD_FILENAME),
    }))
    .sort((left, right) => left.moduleNumber - right.moduleNumber)
}

export async function generateDeckData({
  courseRepo,
  modules = null,
}: {
  courseRepo: string
  modules?: number[] | null
}): Promise<TriviaDeck> {
  const moduleFiles = await findModuleCardFiles(courseRepo, modules)
  const existingModuleFiles: ModuleFile[] = []

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

  const generatedCards: TriviaCard[] = []
  const seenCardIds = new Set<string>()

  for (const moduleFile of existingModuleFiles) {
    const loadedCards = await loadModuleCardFile(courseRepo, moduleFile)

    for (const card of loadedCards) {
      assert(
        !seenCardIds.has(card.id),
        `Duplicate curated card id "${card.id}" across study deck sources.`,
      )
      seenCardIds.add(card.id)
      generatedCards.push(card)
    }
  }

  return buildDeck(generatedCards)
}

async function readExistingDeckFile(outputPath: string): Promise<TriviaDeck | null> {
  let fileContents: string

  try {
    fileContents = await readFile(outputPath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }

    throw error
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(fileContents)
  } catch (error) {
    throw new Error(
      `${outputPath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  assert(
    typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed),
    `${outputPath} must contain a deck object.`,
  )

  const deck = parsed as TriviaDeck
  assert(
    deck.id === DECK_ID,
    `Existing deck at ${outputPath} must have id "${DECK_ID}".`,
  )
  assertDeckValid(deck, `Existing deck at ${outputPath}`)

  return deck
}

function mergeDecksForModules(
  existingDeck: TriviaDeck,
  generatedDeck: TriviaDeck,
  modules: number[],
  outputPath: string,
): TriviaDeck {
  const targetModules = new Set(modules)

  for (const card of existingDeck.cards) {
    assert(
      getCardModuleNumber(card) !== null,
      `Cannot safely apply --modules to ${outputPath} because existing card "${card.id}" is not traceable to a module. Run a full regeneration first.`,
    )
  }

  const preservedCards = existingDeck.cards.filter((card) => {
    const moduleNumber = getCardModuleNumber(card)
    return moduleNumber === null || !targetModules.has(moduleNumber)
  })

  return buildDeck([...preservedCards, ...generatedDeck.cards])
}

export async function writeDeckFile(outputPath: string, deck: TriviaDeck): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(deck, null, 2)}\n`, 'utf8')
}

export async function syncDeckFile(options: ParsedOptions): Promise<TriviaDeck> {
  const generatedDeck = await generateDeckData(options)

  if (!options.modules || options.modules.length === 0) {
    await writeDeckFile(options.output, generatedDeck)
    return generatedDeck
  }

  const existingDeck = await readExistingDeckFile(options.output)
  assert(
    existingDeck !== null,
    `Cannot apply --modules because ${options.output} does not exist yet. Run a full generation first.`,
  )

  const mergedDeck = mergeDecksForModules(
    existingDeck,
    generatedDeck,
    options.modules,
    options.output,
  )

  await writeDeckFile(options.output, mergedDeck)
  return mergedDeck
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  const deck = await syncDeckFile(options)
  console.log(
    `Generated ${deck.cards.length} CSC-6314 cards into ${options.output}.`,
  )
}

const isDirectRun =
  SCRIPT_FILE_PATH !== null &&
  process.argv[1] &&
  path.resolve(process.argv[1]) === SCRIPT_FILE_PATH

if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
