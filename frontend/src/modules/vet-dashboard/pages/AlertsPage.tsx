import { useEffect, useMemo, useState } from 'react'
import { fetchAlerts } from '../api'
import { AlertList } from '../components/AlertList'
import { StatusBanner } from '../components/StatusBanner'
import type { AlertItem } from '../types'
import { isPriorityAlert } from '../utils'

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await fetchAlerts()
        if (!cancelled) {
          setAlerts(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setAlerts([])
          setError(err instanceof Error ? err.message : 'Unable to load alerts.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const sorted = useMemo(
    () =>
      [...alerts].sort((a, b) => Number(isPriorityAlert(b)) - Number(isPriorityAlert(a))),
    [alerts],
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#262322]">Alerts</h2>
        <p className="mt-1 font-body text-sm text-stone-600">
          Highlighted items include high/critical risk, zoonotic flags, and geographical cluster signals.
        </p>
      </div>
      <StatusBanner loading={loading} error={error} empty={!loading && !error && sorted.length === 0} />
      <AlertList alerts={sorted} />
    </div>
  )
}
