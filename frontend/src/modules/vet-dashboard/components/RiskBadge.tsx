import { RISK_BADGE_CLASS } from '../constants'
import type { RiskLevel } from '../types'
import { asRiskLevel } from '../utils'

export function RiskBadge({ level }: { level?: string | null }) {
  const risk = asRiskLevel(level)
  if (!risk) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
        Not assessed
      </span>
    )
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${RISK_BADGE_CLASS[risk as RiskLevel]}`}
    >
      {risk}
    </span>
  )
}
