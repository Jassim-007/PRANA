import { Link } from 'react-router-dom'
import { FIELD_WORKER_BASE } from '../constants'
import type { Farm, VisitStatus } from '../types'
import { VisitStatusBadge } from './VisitStatusBadge'

type FarmCardProps = {
  farm: Farm
  visitStatus: VisitStatus
}

export function FarmCard({ farm, visitStatus }: FarmCardProps) {
  return (
    <Link
      to={`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farm.id)}`}
      className="block rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            {farm.id}
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">{farm.name}</h2>
          <p className="mt-1 text-sm text-slate-300">
            {[farm.village, farm.block, farm.district].filter(Boolean).join(' · ') ||
              'Location not listed'}
          </p>
        </div>
        <VisitStatusBadge status={visitStatus} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
        {farm.species ? (
          <span className="rounded-full bg-slate-800 px-3 py-1 capitalize">{farm.species}</span>
        ) : null}
        {typeof farm.animal_count === 'number' ? (
          <span className="rounded-full bg-slate-800 px-3 py-1">
            {farm.animal_count} animals
          </span>
        ) : null}
      </div>
    </Link>
  )
}
