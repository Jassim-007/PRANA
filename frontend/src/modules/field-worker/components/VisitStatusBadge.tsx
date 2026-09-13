import type { VisitStatus } from '../types'

const LABELS: Record<VisitStatus, string> = {
  not_started: 'Not started',
  in_progress: 'Visit in progress',
  submitted: 'Submitted',
}

const STYLES: Record<VisitStatus, string> = {
  not_started: 'bg-stone-100 text-stone-700',
  in_progress: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  submitted: 'bg-[#C1EDCC]/60 text-[#262322] ring-1 ring-[#8fd6a0]',
}

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 font-ui text-xs font-semibold ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
