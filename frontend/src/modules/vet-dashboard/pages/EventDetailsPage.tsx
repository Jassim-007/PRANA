import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchFarm, fetchHealthEvent, fetchHealthEvents } from '../api'
import { FeedbackForm } from '../components/FeedbackForm'
import { RiskBadge } from '../components/RiskBadge'
import { RiskMap } from '../components/RiskMap'
import { StatusBanner } from '../components/StatusBanner'
import type { Farm, HealthEvent } from '../types'
import { explanationList, formatDate, formatNumber, formatPercent, labelize } from '../utils'

export function EventDetailsPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<HealthEvent | null>(null)
  const [farm, setFarm] = useState<Farm | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        let record: HealthEvent
        try {
          record = await fetchHealthEvent(id as string)
        } catch {
          const list = await fetchHealthEvents()
          const found = list.find((item) => item.id === id)
          if (!found) throw new Error('Health event not found.')
          record = found
        }

        if (cancelled) return
        setEvent(record)
        setError(null)

        try {
          const farmRecord = await fetchFarm(record.farm_id)
          if (!cancelled) setFarm(farmRecord)
        } catch {
          if (!cancelled) setFarm(null)
        }
      } catch (err) {
        if (!cancelled) {
          setEvent(null)
          setError(err instanceof Error ? err.message : 'Unable to load event details.')
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

  const location =
    event?.location_label ||
    [farm?.village, farm?.block, farm?.district].filter(Boolean).join(', ') ||
    (event?.latitude != null && event?.longitude != null
      ? `${event.latitude}, ${event.longitude}`
      : 'Location not reported')

  return (
    <div className="space-y-4">
      <Link to="/vet/events" className="font-ui text-sm text-emerald-800 hover:underline">
        ← Health events
      </Link>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#262322]">Event details</h2>
        <p className="mt-1 font-body text-sm text-stone-600">
          AI assessment is decision support only. Possible disease is not a confirmed diagnosis.
        </p>
      </div>

      <StatusBanner loading={loading} error={error} />

      {event ? (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:col-span-2 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg font-semibold">{farm?.name ?? event.farm_name ?? event.farm_id}</h3>
                <RiskBadge level={event.risk_level} />
                {event.zoonotic_flag ? (
                  <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold text-fuchsia-800 ring-1 ring-fuchsia-200">
                    Zoonotic flag
                  </span>
                ) : null}
              </div>
              <dl className="mt-4 grid gap-3 font-body text-sm sm:grid-cols-2">
                <Detail label="Date" value={formatDate(event.created_at)} />
                <Detail label="Source" value={labelize(event.source)} />
                <Detail label="Species" value={labelize(event.species)} />
                <Detail label="Event type" value={labelize(event.event_type)} />
                <Detail label="Possible disease" value={event.possible_disease ?? 'Pending AI assessment'} />
                <Detail label="AI confidence" value={formatPercent(event.ai_confidence)} />
                <Detail label="Risk score" value={formatNumber(event.risk_score)} />
                <Detail label="Risk level" value={event.risk_level ?? 'Not assessed'} />
                <Detail label="Affected count" value={formatNumber(event.affected_count)} />
                <Detail label="Death count" value={formatNumber(event.death_count)} />
                <Detail label="Duration (days)" value={formatNumber(event.duration_days)} />
                <Detail label="Status" value={labelize(event.status)} />
                <Detail label="Location" value={location} />
                <Detail
                  label="Symptoms"
                  value={event.symptoms?.length ? event.symptoms.map(labelize).join(', ') : '—'}
                />
              </dl>
              <div className="mt-4">
                <p className="font-ui text-xs font-semibold uppercase tracking-wide text-stone-500">AI explanation</p>
                {explanationList(event.explanation).length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-body text-sm text-stone-700">
                    {explanationList(event.explanation).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 font-body text-sm text-stone-500">No explanation provided yet.</p>
                )}
              </div>
              <div className="mt-4">
                <p className="font-ui text-xs font-semibold uppercase tracking-wide text-stone-500">Notes</p>
                <p className="mt-2 font-body text-sm text-stone-700">{event.notes || '—'}</p>
              </div>
            </article>
            <FeedbackForm eventId={event.id} />
          </section>
          <RiskMap events={[event]} clusters={[]} height="360px" />
        </>
      ) : null}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-ui text-xs uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-0.5 font-heading font-medium text-[#262322]">{value}</dd>
    </div>
  )
}
