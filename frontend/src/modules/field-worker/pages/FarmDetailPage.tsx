import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FarmMap } from '../components/FarmMap'
import { ScreenLayout } from '../components/ScreenLayout'
import { VisitStatusBadge } from '../components/VisitStatusBadge'
import { getAssignedFarms, getFarmHealthEvents } from '../api'
import { EVENT_TYPE_LABELS, FIELD_WORKER_BASE } from '../constants'
import type { Farm, HealthEvent } from '../types'
import { readVisitStatus } from '../visitStatus'
import { readFieldWorkerId } from '../workerId'

export function FarmDetailPage() {
  const { farmId = '' } = useParams()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [events, setEvents] = useState<HealthEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [assigned, farmEvents] = await Promise.all([
          getAssignedFarms(readFieldWorkerId()),
          getFarmHealthEvents(farmId).catch(() => [] as HealthEvent[]),
        ])
        if (cancelled) {
          return
        }
        const match = assigned.find((item) => item.id === farmId) ?? {
          id: farmId,
          name: `Farm ${farmId}`,
        }
        setFarm(match)
        setEvents(farmEvents)
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Unable to load farm')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [farmId])

  const visitStatus = readVisitStatus(farmId)
  const hasCoordinates =
    farm &&
    typeof farm.latitude === 'number' &&
    typeof farm.longitude === 'number'

  return (
    <ScreenLayout
      title={farm?.name ?? 'Farm'}
      subtitle={farm ? `${farm.id} · ${[farm.village, farm.district].filter(Boolean).join(', ')}` : 'Loading farm'}
      backTo={`${FIELD_WORKER_BASE}/farms`}
    >
      {loading ? <p className="text-slate-300">Loading farm details…</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}

      {farm ? (
        <section className="rounded-2xl bg-slate-900 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                Farm identification
              </p>
              <p className="mt-1 text-lg font-bold">{farm.name}</p>
              <p className="text-sm text-slate-300">{farm.id}</p>
              {farm.owner_name ? (
                <p className="mt-1 text-sm text-slate-400">Owner: {farm.owner_name}</p>
              ) : null}
            </div>
            <VisitStatusBadge status={visitStatus} />
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {[farm.village, farm.block, farm.district].filter(Boolean).join(' · ') ||
              'Administrative location not provided'}
          </p>
          <p className="mt-2 text-sm capitalize text-slate-400">
            {farm.species ?? 'species unknown'}
            {typeof farm.animal_count === 'number' ? ` · ${farm.animal_count} animals` : ''}
          </p>
        </section>
      ) : null}

      {hasCoordinates && farm ? (
        <div className="mt-4">
          <FarmMap
            latitude={farm.latitude as number}
            longitude={farm.longitude as number}
            label={farm.name}
          />
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-slate-900 p-4 text-sm text-slate-400">
          Farm coordinates are not available yet. You can still capture GPS during the visit.
        </p>
      )}

      <Link
        to={`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farmId)}/visit`}
        className="mt-6 flex min-h-16 items-center justify-center rounded-2xl bg-emerald-500 px-4 text-lg font-bold text-slate-950"
      >
        Start farm health visit
      </Link>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Recent health events</h2>
        {events.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-slate-900 p-4 text-sm text-slate-400">
            No previous health events were returned for this farm.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {events.map((event) => (
              <li key={event.id} className="rounded-2xl bg-slate-900 p-4">
                <p className="font-semibold text-white">
                  {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {event.species} · source {event.source} · affected {event.affected_count ?? 0}
                  {event.created_at ? ` · ${event.created_at}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ScreenLayout>
  )
}
