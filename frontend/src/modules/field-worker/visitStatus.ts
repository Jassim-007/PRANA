import type { VisitStatus } from './types'

const STORAGE_PREFIX = 'prana.fieldVisitStatus.'

export function readVisitStatus(farmId: string): VisitStatus {
  try {
    const value = sessionStorage.getItem(`${STORAGE_PREFIX}${farmId}`)
    if (value === 'in_progress' || value === 'submitted' || value === 'not_started') {
      return value
    }
  } catch {
    // Ignore storage access errors.
  }
  return 'not_started'
}

export function writeVisitStatus(farmId: string, status: VisitStatus): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${farmId}`, status)
  } catch {
    // Visit status is a local UI hint only.
  }
}
