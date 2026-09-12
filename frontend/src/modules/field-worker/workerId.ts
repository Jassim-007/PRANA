import { DEFAULT_FIELD_WORKER_ID, WORKER_ID_STORAGE_KEY } from './constants'

export function readFieldWorkerId(): string {
  try {
    const stored = sessionStorage.getItem(WORKER_ID_STORAGE_KEY)
    if (stored && stored.trim().length > 0) {
      return stored.trim()
    }
  } catch {
    // sessionStorage may be unavailable in some browser modes.
  }
  return DEFAULT_FIELD_WORKER_ID
}

export function writeFieldWorkerId(id: string): void {
  const value = id.trim() || DEFAULT_FIELD_WORKER_ID
  try {
    sessionStorage.setItem(WORKER_ID_STORAGE_KEY, value)
  } catch {
    // Ignore storage failures; in-memory default still works for the session.
  }
}
