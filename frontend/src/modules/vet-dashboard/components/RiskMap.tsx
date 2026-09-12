import { Circle, CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, RISK_COLORS } from '../constants'
import type { ClusterItem, HealthEvent } from '../types'
import { asRiskLevel, labelize } from '../utils'

function eventColor(event: HealthEvent): string {
  const level = asRiskLevel(event.risk_level)
  return level ? RISK_COLORS[level] : '#64748b'
}

function clusterColor(cluster: ClusterItem): string {
  const level = asRiskLevel(cluster.risk_level)
  return level ? RISK_COLORS[level] : '#7c3aed'
}

export function RiskMap({
  events,
  clusters,
  height = '560px',
}: {
  events: HealthEvent[]
  clusters: ClusterItem[]
  height?: string
}) {
  const locatedEvents = events.filter(
    (event) => typeof event.latitude === 'number' && typeof event.longitude === 'number',
  )
  const locatedClusters = clusters.filter(
    (cluster) => typeof cluster.latitude === 'number' && typeof cluster.longitude === 'number',
  )

  const first = locatedEvents[0] ?? locatedClusters[0]
  const center: [number, number] =
    first && typeof first.latitude === 'number' && typeof first.longitude === 'number'
      ? [first.latitude, first.longitude]
      : DEFAULT_MAP_CENTER

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Geographical risk map</h2>
          <p className="text-xs text-slate-500">OpenStreetMap tiles. Marker colours reflect operational risk levels, not clinical validation.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          {Object.entries(RISK_COLORS).map(([level, color]) => (
            <span key={level} className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {level}
            </span>
          ))}
        </div>
      </div>
      <div style={{ height }}>
        <MapContainer center={center} zoom={DEFAULT_MAP_ZOOM} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locatedClusters.map((cluster) => (
            <Circle
              key={cluster.id}
              center={[cluster.latitude as number, cluster.longitude as number]}
              radius={(cluster.radius_km ?? 2) * 1000}
              pathOptions={{
                color: clusterColor(cluster),
                fillColor: clusterColor(cluster),
                fillOpacity: 0.12,
                weight: 2,
              }}
            >
              <Popup>
                <p className="font-semibold">Potential outbreak cluster</p>
                <p className="text-sm">{cluster.disease ?? 'Pattern under review'}</p>
                <p className="text-xs">Risk level: {cluster.risk_level ?? 'Not assessed'}</p>
                <Link className="text-sm text-emerald-800 underline" to={`/vet/clusters/${cluster.id}`}>
                  Open cluster details
                </Link>
              </Popup>
            </Circle>
          ))}
          {locatedEvents.map((event) => (
            <CircleMarker
              key={event.id}
              center={[event.latitude as number, event.longitude as number]}
              radius={(event.affected_count ?? 0) > 10 ? 10 : 7}
              pathOptions={{
                color: eventColor(event),
                fillColor: eventColor(event),
                fillOpacity: 0.85,
                weight: 1,
              }}
            >
              <Popup>
                <p className="font-semibold">{event.farm_name ?? event.farm_id}</p>
                <p className="text-sm">Possible disease: {event.possible_disease ?? 'Pending AI assessment'}</p>
                <p className="text-xs capitalize">
                  {labelize(event.species)} · {labelize(event.event_type)}
                </p>
                <Link className="text-sm text-emerald-800 underline" to={`/vet/events/${event.id}`}>
                  Open event details
                </Link>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
