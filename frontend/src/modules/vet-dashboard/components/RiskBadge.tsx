import { RISK_BADGE_CLASS } from '../constants'
import type { RiskLevel } from '../types'
import { asRiskLevel } from '../utils'

export function RiskBadge({ level }: { level?: string | null }) {
  const risk = asRiskLevel(level)
  if (!risk) {
    return (
      <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 font-ui text-xs font-medium text-stone-600 ring-1 ring-stone-200">
        Not assessed
      </span>
    )
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 font-ui text-xs font-semibold ring-1 ${RISK_BADGE_CLASS[risk as RiskLevel]}`}
    >
      {risk}
    </span>
  )
}
