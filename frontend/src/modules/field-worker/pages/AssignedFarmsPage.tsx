import { useEffect, useState } from 'react'
import { FarmCard } from '../components/FarmCard'
import { ScreenLayout } from '../components/ScreenLayout'
import { getAssignedFarms } from '../api'
import { FIELD_WORKER_BASE } from '../constants'
import type { Farm } from '../types'
import { readVisitStatus } from '../visitStatus'
import { readFieldWorkerId } from '../workerId'

export function AssignedFarmsPage() {
  const workerId = readFieldWorkerId()
  const [farms, setFarms] = useState<Farm[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadFarms() {
    setLoading(true)
    setError(null)
    try {
      const result = await getAssignedFarms(workerId)
      setFarms(result)
    } catch (cause) {
      setFarms([])
      setError(cause instanceof Error ? cause.message : 'Unable to load assigned farms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFarms()
  }, [workerId])

  return (
    <ScreenLayout
      title="Assigned farms"
      subtitle={`Worker ${workerId} — select a farm to start a health visit.`}
      backTo={FIELD_WORKER_BASE}
    >
      {loading ? <p className="text-slate-300">Loading assigned farms…</p> : null}

      {error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="font-semibold text-rose-200">Could not load farms</p>
          <p className="mt-1 text-sm text-rose-100">{error}</p>
          <button
            type="button"
            onClick={() => void loadFarms()}
            className="mt-4 min-h-12 w-full rounded-xl bg-rose-400 px-4 font-bold text-slate-950"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && farms.length === 0 ? (
        <p className="rounded-2xl bg-slate-900 p-4 text-slate-300">
          No farms are assigned to this field worker yet.
        </p>
      ) : null}

      <div className="grid gap-3">
        {farms.map((farm) => (
          <FarmCard key={farm.id} farm={farm} visitStatus={readVisitStatus(farm.id)} />
        ))}
      </div>
    </ScreenLayout>
  )
}
