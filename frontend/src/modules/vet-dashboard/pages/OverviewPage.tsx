import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAlerts, fetchClusters, fetchDashboardSummary, fetchDashboardTrends, fetchHealthEvents } from '../api'
import type { AlertItem, ClusterItem, DashboardSummary, HealthEvent, TrendPoint } from '../types'
import { OverviewCards } from '../components/OverviewCards'
import { RiskMap } from '../components/RiskMap'
import { StatusBanner } from '../components/StatusBanner'
import { EventTable } from '../components/EventTable'
import { isHighPriorityRisk } from '../utils'

export function OverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary>({})
  const [trends, setTrends] = useState<TrendPoint[]>([])
  const [events, setEvents] = useState<HealthEvent[]>([])
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [clusters, setClusters] = useState<ClusterItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const results = await Promise.allSettled([
        fetchDashboardSummary(),
        fetchDashboardTrends(),
        fetchHealthEvents(),
        fetchAlerts(),
        fetchClusters(),
      ])
      if (cancelled) return

      const [summaryResult, trendsResult, eventsResult, alertsResult, clustersResult] = results
      const failures: string[] = []

      if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value)
      else failures.push('dashboard summary')
      if (trendsResult.status === 'fulfilled') setTrends(trendsResult.value)
      else failures.push('trends')
      if (eventsResult.status === 'fulfilled') setEvents(eventsResult.value)
      else failures.push('health events')
      if (alertsResult.status === 'fulfilled') setAlerts(alertsResult.value)
      else failures.push('alerts')
      if (clustersResult.status === 'fulfilled') setClusters(clustersResult.value)
      else failures.push('clusters')

      setError(failures.length ? `Some APIs are unavailable: ${failures.join(', ')}.` : null)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const derived = useMemo(() => {
    const highRisk = events.filter((event) => isHighPriorityRisk(event.risk_level)).length
    const affected = events.reduce((sum, event) => sum + (event.affected_count ?? 0), 0)
    const deaths = events.reduce((sum, event) => sum + (event.death_count ?? 0), 0)
    return {
      total: summary.total_events ?? summary.active_events ?? events.length,
      highRisk: summary.high_risk_events ?? highRisk,
      alerts: summary.active_alerts ?? alerts.length,
      clusters: summary.active_clusters ?? clusters.length,
      affected: summary.affected_animals ?? affected,
      deaths: summary.deaths ?? deaths,
    }
  }, [alerts.length, clusters.length, events, summary])

  const maxTrend = Math.max(1, ...trends.map((point) => point.event_count))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Surveillance overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Operational picture for veterinary officers. Figures support triage; they are not a confirmed diagnosis.
        </p>
      </div>

      <StatusBanner loading={loading} error={error} />

      <OverviewCards
        cards={[
          { label: 'Total health events', value: derived.total, hint: 'All reported health events in view' },
          { label: 'High-risk events', value: derived.highRisk, hint: 'HIGH and CRITICAL risk levels' },
          { label: 'Active alerts', value: derived.alerts, hint: 'Signals requiring officer attention' },
          { label: 'Potential clusters', value: derived.clusters, hint: 'Potential outbreak clusters, not guaranteed outbreaks' },
          { label: 'Affected animals', value: derived.affected, hint: 'Reported affected count across events' },
          { label: 'Deaths', value: derived.deaths, hint: 'Reported deaths across events' },
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Health event trend</h3>
          <p className="text-xs text-slate-500">Daily counts from /api/dashboard/trends</p>
          {trends.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No trend series available yet.</p>
          ) : (
            <div className="mt-4 flex h-40 items-end gap-2">
              {trends.map((point) => (
                <div key={point.date} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t bg-emerald-700"
                    style={{ height: `${Math.max(8, (point.event_count / maxTrend) * 100)}%` }}
                    title={`${point.date}: ${point.event_count}`}
                  />
                  <span className="text-[10px] text-slate-500">{point.date.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Attention queue</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-emerald-800 hover:underline" to="/vet/alerts">
                Review high-risk, zoonotic, and cluster alerts
              </Link>
            </li>
            <li>
              <Link className="text-emerald-800 hover:underline" to="/vet/map">
                Inspect geographical clusters on the risk map
              </Link>
            </li>
            <li>
              <Link className="text-emerald-800 hover:underline" to="/vet/events">
                Open health events needing field follow-up
              </Link>
            </li>
          </ul>
        </article>
      </section>

      <RiskMap events={events} clusters={clusters} height="420px" />
      <EventTable events={events.slice(0, 8)} />
    </div>
  )
}
