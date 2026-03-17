import '@testing-library/jest-dom'

class MemoryStorage implements Storage {
  #store = new Map<string, string>()

  get length() {
    return this.#store.size
  }

  clear() {
    this.#store.clear()
  }

  getItem(key: string) {
    return this.#store.get(String(key)) ?? null
  }

  key(index: number) {
    return Array.from(this.#store.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.#store.delete(String(key))
  }

  setItem(key: string, value: string) {
    this.#store.set(String(key), String(value))
  }
}

const localStorageIsUsable =
  typeof window !== 'undefined' &&
  typeof window.localStorage?.getItem === 'function' &&
  typeof window.localStorage?.setItem === 'function' &&
  typeof window.localStorage?.clear === 'function'

if (!localStorageIsUsable) {
  const storage = new MemoryStorage()

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage,
  })
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  })
}
