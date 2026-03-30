/** Prefix for per-deck persisted game sessions in localStorage. */
export const STORAGE_KEY_PREFIX = 'stacked-deck-session'

export function getSessionStorageKey(deckId: string): string {
  return `${STORAGE_KEY_PREFIX}:${deckId}`
}

export function clearStoredSessions(storage: Storage): void {
  const keysToRemove = Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key): key is string => key !== null)
    .filter(
      (key) => key === STORAGE_KEY_PREFIX || key.startsWith(`${STORAGE_KEY_PREFIX}:`),
    )

  for (const key of keysToRemove) {
    storage.removeItem(key)
  }
}

/** Minimum horizontal swipe distance (px) required to advance to the next card. */
export const SWIPE_THRESHOLD_PX = 60

/** Duration (ms) of the shuffle animation before a card is drawn. */
export const SHUFFLE_DELAY_MS = 400
