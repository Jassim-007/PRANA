import type { VisitStatus } from '../types'

const LABELS: Record<VisitStatus, string> = {
  not_started: 'Not started',
  in_progress: 'Visit in progress',
  submitted: 'Submitted',
}

const STYLES: Record<VisitStatus, string> = {
  not_started: 'bg-slate-800 text-slate-200',
  in_progress: 'bg-amber-500/20 text-amber-300',
  submitted: 'bg-emerald-500/20 text-emerald-300',
}

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
