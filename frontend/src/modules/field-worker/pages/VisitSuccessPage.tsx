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
      <div className="animate-scale-in rounded-2xl bg-[#C1EDCC]/30 p-6 text-center">
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
          Submission successful
        </p>
        <p className="mt-3 font-display text-xl font-bold text-[#262322]">
          {state.message ?? 'Health event created successfully'}
        </p>
        {state.eventId ? (
          <p className="mt-3 font-mono text-sm text-emerald-800">Event ID: {state.eventId}</p>
        ) : null}
      </div>

      <p className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 font-body text-sm text-stone-600">
        {DECISION_SUPPORT_NOTICE}
      </p>

      <div className="mt-6 grid gap-3">
        <Link
          to={`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farmId)}/visit`}
          className="prana-btn border border-stone-200 bg-white text-[#262322] hover:bg-stone-50"
        >
          Record another event
        </Link>
        <Link
          to={`${FIELD_WORKER_BASE}/farms`}
          className="prana-btn prana-btn-primary"
        >
          Back to assigned farms
        </Link>
      </div>
    </ScreenLayout>
  )
}
