import type { RiskLevel } from './types'

export const RISK_LEVELS: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

export const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#059669',
  MODERATE: '#d97706',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
}

export const RISK_BADGE_CLASS: Record<RiskLevel, string> = {
  LOW: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  MODERATE: 'bg-amber-50 text-amber-800 ring-amber-200',
  HIGH: 'bg-orange-50 text-orange-900 ring-orange-200',
  CRITICAL: 'bg-red-50 text-red-800 ring-red-200',
}

export const DEFAULT_MAP_CENTER: [number, number] = [10.85, 76.27]
export const DEFAULT_MAP_ZOOM = 8

export const DISCLAIMER =
  'PRANA is a disease early-warning and decision-support system. AI assessment indicates possible disease only. Risk colours and thresholds are not clinically validated and do not constitute a confirmed diagnosis.'
