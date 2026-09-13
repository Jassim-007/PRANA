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
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="progress-bar-fill h-full rounded-full bg-[#C1EDCC] transition-[width] duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
