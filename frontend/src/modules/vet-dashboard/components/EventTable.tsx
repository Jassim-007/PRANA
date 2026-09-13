import { Link } from 'react-router-dom'
import type { HealthEvent } from '../types'
import { formatDate, formatNumber, labelize } from '../utils'
import { RiskBadge } from './RiskBadge'

export function EventTable({ events }: { events: HealthEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-4 py-8 text-center font-body text-sm text-stone-500">
        No health events match the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
      <table className="min-w-full text-left font-ui text-sm">
        <thead className="bg-stone-50 font-ui text-xs uppercase tracking-[0.12em] text-stone-500">
          <tr>
            <th className="px-3 py-3 font-semibold">Date</th>
            <th className="px-3 py-3 font-semibold">Farm</th>
            <th className="px-3 py-3 font-semibold">Species</th>
            <th className="px-3 py-3 font-semibold">Event type</th>
            <th className="px-3 py-3 font-semibold">Possible disease</th>
            <th className="px-3 py-3 font-semibold">Risk level</th>
            <th className="px-3 py-3 font-semibold">Affected</th>
            <th className="px-3 py-3 font-semibold">Deaths</th>
            <th className="px-3 py-3 font-semibold">Source</th>
            <th className="px-3 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t border-stone-100 transition hover:bg-[#C1EDCC]/20">
              <td className="px-3 py-3 whitespace-nowrap text-stone-600">{formatDate(event.created_at)}</td>
              <td className="px-3 py-3">
                <Link className="font-medium text-emerald-800 hover:underline" to={`/vet/events/${event.id}`}>
                  {event.farm_name ?? event.farm_id}
                </Link>
              </td>
              <td className="px-3 py-3 capitalize">{labelize(event.species)}</td>
              <td className="px-3 py-3 capitalize">{labelize(event.event_type)}</td>
              <td className="px-3 py-3">{event.possible_disease ?? 'Pending AI assessment'}</td>
              <td className="px-3 py-3">
                <RiskBadge level={event.risk_level} />
              </td>
              <td className="px-3 py-3">{formatNumber(event.affected_count)}</td>
              <td className="px-3 py-3">{formatNumber(event.death_count)}</td>
              <td className="px-3 py-3 capitalize">{labelize(event.source)}</td>
              <td className="px-3 py-3 capitalize">{labelize(event.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
