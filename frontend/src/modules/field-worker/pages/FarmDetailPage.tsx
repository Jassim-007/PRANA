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
      {loading ? <p className="font-body text-stone-600">Loading farm details…</p> : null}
      {error ? <p className="font-body text-rose-700">{error}</p> : null}

      {farm ? (
        <section className="prana-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                Farm identification
              </p>
              <p className="mt-1 font-heading text-lg font-bold">{farm.name}</p>
              <p className="font-ui text-sm text-stone-500">{farm.id}</p>
              {farm.owner_name ? (
                <p className="mt-1 font-body text-sm text-stone-600">Owner: {farm.owner_name}</p>
              ) : null}
            </div>
            <VisitStatusBadge status={visitStatus} />
          </div>
          <p className="mt-3 font-body text-sm text-stone-600">
            {[farm.village, farm.block, farm.district].filter(Boolean).join(' · ') ||
              'Administrative location not provided'}
          </p>
          <p className="mt-2 font-ui text-sm capitalize text-stone-500">
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
        <p className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 font-body text-sm text-stone-500">
          Farm coordinates are not available yet. You can still capture GPS during the visit.
        </p>
      )}

      <Link
        to={`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farmId)}/visit`}
        className="prana-btn prana-btn-primary mt-6"
      >
        Start farm health visit
      </Link>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">Recent health events</h2>
        {events.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-stone-200 bg-white p-4 font-body text-sm text-stone-500">
            No previous health events were returned for this farm.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {events.map((event) => (
              <li key={event.id} className="prana-card p-4">
                <p className="font-heading font-semibold text-[#262322]">
                  {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                </p>
                <p className="mt-1 font-body text-sm text-stone-500">
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
