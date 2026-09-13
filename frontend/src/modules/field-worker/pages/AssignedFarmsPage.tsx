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
      {loading ? <p className="font-body text-stone-600">Loading assigned farms…</p> : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="font-heading font-semibold text-rose-900">Could not load farms</p>
          <p className="mt-1 font-body text-sm text-rose-800">{error}</p>
          <button
            type="button"
            onClick={() => void loadFarms()}
            className="prana-btn prana-btn-ink mt-4"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && farms.length === 0 ? (
        <p className="prana-card p-4 font-body text-stone-600">
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
