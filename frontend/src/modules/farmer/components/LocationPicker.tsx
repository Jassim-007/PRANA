import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { PrimaryButton } from './PrimaryButton'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER: [number, number] = [10.1632, 76.6413]

type Props = {
  latitude: number | null
  longitude: number | null
  onChange: (latitude: number, longitude: number) => void
}

function MapClick({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 14))
  }, [lat, lng, map])
  return null
}

export function LocationPicker({ latitude, longitude, onChange }: Props) {
  const hasPoint = latitude != null && longitude != null
  const center: [number, number] = hasPoint ? [latitude, longitude] : DEFAULT_CENTER

  function useMyLocation() {
    if (!navigator.geolocation) {
      window.alert('Location is not available on this device.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => onChange(position.coords.latitude, position.coords.longitude),
      () => window.alert('Could not read GPS. Please tap the map instead.'),
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  return (
    <div className="space-y-3">
      <PrimaryButton onClick={useMyLocation}>Use my current location</PrimaryButton>
      <p className="text-base text-stone-700">Or tap the map to mark the farm / shed.</p>
      <div className="h-64 overflow-hidden rounded-2xl border-2 border-stone-400">
        <MapContainer
          center={center}
          zoom={hasPoint ? 15 : 8}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClick onChange={onChange} />
          {hasPoint ? (
            <>
              <Marker position={[latitude, longitude]} />
              <Recenter lat={latitude} lng={longitude} />
            </>
          ) : null}
        </MapContainer>
      </div>
      {hasPoint ? (
        <p className="text-base font-semibold text-stone-900">
          Saved: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </p>
      ) : (
        <p className="text-base font-semibold text-red-800">Location not selected yet.</p>
      )}
    </div>
  )
}
