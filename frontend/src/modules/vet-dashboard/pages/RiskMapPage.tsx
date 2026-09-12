import { useEffect, useState } from 'react'
import { fetchClusters, fetchHealthEvents } from '../api'
import { RiskMap } from '../components/RiskMap'
import { StatusBanner } from '../components/StatusBanner'
import type { ClusterItem, HealthEvent } from '../types'

export function RiskMapPage() {
  const [events, setEvents] = useState<HealthEvent[]>([])
  const [clusters, setClusters] = useState<ClusterItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const results = await Promise.allSettled([fetchHealthEvents(), fetchClusters()])
      if (cancelled) return
      if (results[0].status === 'fulfilled') setEvents(results[0].value)
      if (results[1].status === 'fulfilled') setClusters(results[1].value)
      const failures = [
        results[0].status === 'rejected' ? 'health events' : null,
        results[1].status === 'rejected' ? 'clusters' : null,
      ].filter(Boolean)
      setError(failures.length ? `Map layers unavailable: ${failures.join(', ')}.` : null)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Risk map</h2>
        <p className="mt-1 text-sm text-slate-600">
          Health events are plotted by latitude and longitude. Circles mark potential outbreak clusters when coordinates are provided.
        </p>
      </div>
      <StatusBanner loading={loading} error={error} />
      <RiskMap events={events} clusters={clusters} />
    </div>
  )
}
