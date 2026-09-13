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
      className="prana-card block p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
            {farm.id}
          </p>
          <h2 className="mt-1 font-heading text-lg font-bold text-[#262322]">{farm.name}</h2>
          <p className="mt-1 font-body text-sm text-stone-600">
            {[farm.village, farm.block, farm.district].filter(Boolean).join(' · ') ||
              'Location not listed'}
          </p>
        </div>
        <VisitStatusBadge status={visitStatus} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 font-ui text-sm text-stone-600">
        {farm.species ? (
          <span className="rounded-full bg-stone-100 px-3 py-1 capitalize">{farm.species}</span>
        ) : null}
        {typeof farm.animal_count === 'number' ? (
          <span className="rounded-full bg-stone-100 px-3 py-1">
            {farm.animal_count} animals
          </span>
        ) : null}
      </div>
    </Link>
  )
}
