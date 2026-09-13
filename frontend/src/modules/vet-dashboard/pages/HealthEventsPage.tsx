import { useEffect, useMemo, useState } from 'react'
import { fetchHealthEvents } from '../api'
import { EventTable } from '../components/EventTable'
import { StatusBanner } from '../components/StatusBanner'
import { RISK_LEVELS } from '../constants'
import type { HealthEvent } from '../types'

export function HealthEventsPage() {
  const [events, setEvents] = useState<HealthEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [species, setSpecies] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [source, setSource] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await fetchHealthEvents({
          species,
          risk_level: riskLevel,
          source,
          status,
        })
        if (!cancelled) {
          setEvents(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setEvents([])
          setError(err instanceof Error ? err.message : 'Unable to load health events.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [riskLevel, source, species, status])

  const followUp = useMemo(
    () =>
      events.filter((event) => {
        const level = (event.risk_level ?? '').toUpperCase()
        return level === 'HIGH' || level === 'CRITICAL' || event.status === 'open'
      }),
    [events],
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#262322]">Health events</h2>
        <p className="mt-1 font-body text-sm text-stone-600">
          {followUp.length} record(s) may need field follow-up based on open status or elevated risk level.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block font-ui text-xs uppercase tracking-[0.12em] text-stone-500">Species</span>
          <select className="prana-select min-h-11" value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option value="">All</option>
            <option value="cattle">cattle</option>
            <option value="buffalo">buffalo</option>
            <option value="goat">goat</option>
            <option value="sheep">sheep</option>
            <option value="poultry">poultry</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-ui text-xs uppercase tracking-[0.12em] text-stone-500">Risk level</span>
          <select className="prana-select min-h-11" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
            <option value="">All</option>
            {RISK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-ui text-xs uppercase tracking-[0.12em] text-stone-500">Source</span>
          <select className="prana-select min-h-11" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All</option>
            <option value="farmer">farmer</option>
            <option value="field_worker">field_worker</option>
            <option value="vet">vet</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-ui text-xs uppercase tracking-[0.12em] text-stone-500">Status</span>
          <select className="prana-select min-h-11" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="open">open</option>
            <option value="investigating">investigating</option>
            <option value="closed">closed</option>
          </select>
        </label>
      </div>

      <StatusBanner loading={loading} error={error} />
      <EventTable events={events} />
    </div>
  )
}
