import { Link, useLocation, useParams } from 'react-router-dom'
import { ScreenLayout } from '../components/ScreenLayout'
import { DECISION_SUPPORT_NOTICE, FIELD_WORKER_BASE } from '../constants'

type SuccessState = {
  eventId?: string
  message?: string
  farmName?: string
}

export function VisitSuccessPage() {
  const { farmId = '' } = useParams()
  const location = useLocation()
  const state = (location.state ?? {}) as SuccessState

  return (
    <ScreenLayout
      title="Visit submitted"
      subtitle={state.farmName ?? farmId}
      backTo={`${FIELD_WORKER_BASE}/farms`}
    >
      <div className="rounded-2xl bg-emerald-500/15 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
          Submission successful
        </p>
        <p className="mt-3 text-xl font-bold text-white">
          {state.message ?? 'Health event created successfully'}
        </p>
        {state.eventId ? (
          <p className="mt-3 font-mono text-sm text-emerald-200">Event ID: {state.eventId}</p>
        ) : null}
      </div>

      <p className="mt-6 rounded-2xl bg-slate-900 p-4 text-sm text-slate-300">
        {DECISION_SUPPORT_NOTICE}
      </p>

      <div className="mt-6 grid gap-3">
        <Link
          to={`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farmId)}/visit`}
          className="flex min-h-14 items-center justify-center rounded-2xl bg-slate-800 font-bold"
        >
          Record another event
        </Link>
        <Link
          to={`${FIELD_WORKER_BASE}/farms`}
          className="flex min-h-14 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950"
        >
          Back to assigned farms
        </Link>
      </div>
    </ScreenLayout>
  )
}
