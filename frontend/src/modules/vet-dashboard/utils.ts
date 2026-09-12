import type { RiskLevel } from './types'
import { RISK_LEVELS } from './constants'

export function asRiskLevel(value: string | null | undefined): RiskLevel | null {
  if (!value) return null
  const normalized = value.toUpperCase() as RiskLevel
  return RISK_LEVELS.includes(normalized) ? normalized : null
}

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatNumber(value?: number | null): string {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString()
}

export function formatPercent(value?: number | null): string {
  if (value === null || value === undefined) return '—'
  const ratio = value > 1 ? value / 100 : value
  return `${Math.round(ratio * 100)}%`
}

export function labelize(value?: string | null): string {
  if (!value) return '—'
  return value.replaceAll('_', ' ')
}

export function explanationList(value?: string[] | string | null): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}

export function isHighPriorityRisk(value?: string | null): boolean {
  const level = asRiskLevel(value)
  return level === 'HIGH' || level === 'CRITICAL'
}

export function isPriorityAlert(alert: {
  severity?: string
  type?: string
  zoonotic?: boolean
  risk_level?: string
}): boolean {
  const severity = (alert.severity ?? alert.risk_level ?? '').toLowerCase()
  const type = (alert.type ?? '').toLowerCase()
  return (
    alert.zoonotic === true ||
    severity.includes('high') ||
    severity.includes('critical') ||
    type.includes('cluster') ||
    type.includes('outbreak') ||
    type.includes('zoonotic')
  )
}
