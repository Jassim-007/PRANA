import { Navigate, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'

const PRESETS = [
  { days: 1, label: '1 day' },
  { days: 2, label: '2 days' },
  { days: 3, label: '3 days' },
  { days: 7, label: '1 week' },
  { days: 14, label: '2 weeks' },
]

export function DurationPage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()

  if (!draft.species) return <Navigate to="/farmer/species" replace />

  return (
    <div>
      <StepHeader
        title="How long has this been going on?"
        subtitle="Choose the closest time. You can also type a number of days."
        backTo="/farmer/counts"
        step={4}
      />
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.days}
            type="button"
            onClick={() => updateDraft({ durationDays: preset.days })}
            className={`min-h-16 rounded-2xl border-2 text-lg font-bold ${
              draft.durationDays === preset.days
                ? 'border-emerald-800 bg-emerald-800 text-white'
                : 'border-stone-400 bg-white text-stone-900'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <label className="mt-5 block text-lg font-bold" htmlFor="duration-days">
        Days
      </label>
      <input
        id="duration-days"
        inputMode="numeric"
        className="mt-2 min-h-14 w-full rounded-2xl border-2 border-stone-400 bg-white px-4 text-2xl font-bold"
        value={draft.durationDays}
        onChange={(event) => {
          const next = Number(event.target.value.replace(/[^\d]/g, ''))
          updateDraft({ durationDays: Number.isNaN(next) ? 1 : Math.max(1, next) })
        }}
      />
      <div className="mt-6">
        <PrimaryButton onClick={() => navigate('/farmer/location')}>Continue</PrimaryButton>
      </div>
    </div>
  )
}
