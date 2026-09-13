import { Link } from 'react-router-dom'
import type { AlertItem } from '../types'
import { isPriorityAlert, labelize, formatDate } from '../utils'
import { RiskBadge } from './RiskBadge'

export function AlertList({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-4 py-8 text-center font-body text-sm text-stone-500">
        No active alerts returned by the API.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const priority = isPriorityAlert(alert)
        return (
          <article
            key={alert.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              priority ? 'border-red-200 ring-1 ring-red-100' : 'border-stone-200'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-semibold text-[#262322]">{alert.title ?? 'Surveillance alert'}</h3>
                  <RiskBadge level={alert.risk_level ?? alert.severity} />
                  {alert.zoonotic ? (
                    <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold text-fuchsia-800 ring-1 ring-fuchsia-200">
                      Zoonotic flag
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-body text-sm text-stone-600">{alert.message ?? 'Review this signal as decision support.'}</p>
              </div>
              <p className="font-ui text-xs text-stone-500">{formatDate(alert.created_at)}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 font-ui text-xs uppercase tracking-wide text-stone-500">
              <span>{labelize(alert.type)}</span>
              <span>{labelize(alert.status)}</span>
              {alert.cluster_id ? (
                <Link className="text-emerald-800 underline" to={`/vet/clusters/${alert.cluster_id}`}>
                  Potential outbreak cluster
                </Link>
              ) : null}
              {alert.event_id ? (
                <Link className="text-emerald-800 underline" to={`/vet/events/${alert.event_id}`}>
                  Related health event
                </Link>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
