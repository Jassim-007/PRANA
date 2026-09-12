import { useLocation } from 'react-router-dom'

const STEPS = [
  '/farmer/species',
  '/farmer/symptoms',
  '/farmer/counts',
  '/farmer/duration',
  '/farmer/location',
  '/farmer/details',
  '/farmer/review',
]

export function FarmerProgress() {
  const location = useLocation()
  const stepIndex = STEPS.findIndex((path) => location.pathname === path)
  if (stepIndex < 0) return null
  const progress = ((stepIndex + 1) / STEPS.length) * 100
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-950">
      <div className="h-full bg-lime-300" style={{ width: `${progress}%` }} />
    </div>
  )
}
