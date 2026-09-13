import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { useFarmerReport } from '../context/ReportContext'

export function HomePage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()

  return (
    <div className="flex min-h-[60vh] flex-col">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#262322]">
        Report a livestock health issue
      </h1>
      <p className="mt-3 font-body text-lg leading-relaxed text-stone-600">
        PRANA is an early-warning tool. A report helps local teams watch for outbreaks. It is not a
        confirmed veterinary diagnosis.
      </p>

      <label className="mt-6 block font-heading text-lg font-bold text-[#262322]" htmlFor="farm-id">
        Farm ID
      </label>
      <input
        id="farm-id"
        className="prana-input mt-2 text-lg font-semibold"
        value={draft.farmId}
        onChange={(event) => updateDraft({ farmId: event.target.value })}
      />
      <p className="mt-2 font-body text-base text-stone-600">Demo farm ID is F001 if you are not sure.</p>

      <div className="mt-auto space-y-3 pt-8">
        <PrimaryButton onClick={() => navigate('/farmer/species')}>
          Start health report
        </PrimaryButton>
      </div>
    </div>
  )
}
