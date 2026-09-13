import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchClusters, fetchHealthEvents } from '../api'
import { EventTable } from '../components/EventTable'
import { RiskBadge } from '../components/RiskBadge'
import { RiskMap } from '../components/RiskMap'
import { StatusBanner } from '../components/StatusBanner'
import type { ClusterItem, HealthEvent } from '../types'
import { formatNumber } from '../utils'

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export function ClusterDetailsPage() {
  const { id } = useParams()
  const [cluster, setCluster] = useState<ClusterItem | null>(null)
  const [events, setEvents] = useState<HealthEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [clusters, healthEvents] = await Promise.all([fetchClusters(), fetchHealthEvents()])
        if (cancelled) return
        const found = clusters.find((item) => item.id === id) ?? null
        setCluster(found)
        setEvents(healthEvents)
        setError(found ? null : 'Potential outbreak cluster not found.')
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load cluster details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  const nearby = useMemo(() => {
    if (!cluster || cluster.latitude == null || cluster.longitude == null) return []
    const radius = cluster.radius_km ?? 5
    return events.filter((event) => {
      if (event.latitude == null || event.longitude == null) return false
      return distanceKm(cluster.latitude as number, cluster.longitude as number, event.latitude, event.longitude) <= radius
    })
  }, [cluster, events])

  return (
    <div className="space-y-4">
      <Link to="/vet/map" className="font-ui text-sm text-emerald-800 hover:underline">
        ← Risk map
      </Link>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#262322]">Potential outbreak cluster</h2>
        <p className="mt-1 font-body text-sm text-stone-600">
          Geographical grouping of similar health events. This is a potential pattern for investigation, not a guaranteed outbreak.
        </p>
      </div>

      <StatusBanner loading={loading} error={error} />

      {cluster ? (
        <>
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-semibold">{cluster.disease ?? 'Unspecified possible disease'}</h3>
              <RiskBadge level={cluster.risk_level} />
            </div>
            <dl className="mt-4 grid gap-3 font-body text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-ui text-xs uppercase text-stone-500">Cluster ID</dt>
                <dd className="font-heading font-medium">{cluster.id}</dd>
              </div>
              <div>
                <dt className="font-ui text-xs uppercase text-stone-500">Event count</dt>
                <dd className="font-heading font-medium">{formatNumber(cluster.event_count)}</dd>
              </div>
              <div>
                <dt className="font-ui text-xs uppercase text-stone-500">Affected count</dt>
                <dd className="font-heading font-medium">{formatNumber(cluster.affected_count)}</dd>
              </div>
              <div>
                <dt className="font-ui text-xs uppercase text-stone-500">Radius</dt>
                <dd className="font-heading font-medium">{cluster.radius_km != null ? `${cluster.radius_km} km` : '—'}</dd>
              </div>
            </dl>
          </section>
          <RiskMap events={nearby} clusters={[cluster]} height="400px" />
          <EventTable events={nearby} />
        </>
      ) : null}
    </div>
  )
}
