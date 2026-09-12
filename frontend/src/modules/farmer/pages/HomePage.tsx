import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { useFarmerReport } from '../context/ReportContext'

export function HomePage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()

  return (
    <div className="flex min-h-[70vh] flex-col">
      <h1 className="text-3xl font-extrabold text-stone-950">Report a livestock health issue</h1>
      <p className="mt-3 text-lg leading-snug text-stone-800">
        PRANA is an early-warning tool. A report helps local teams watch for outbreaks. It is not a
        confirmed veterinary diagnosis.
      </p>

      <label className="mt-6 block text-lg font-bold text-stone-900" htmlFor="farm-id">
        Farm ID
      </label>
      <input
        id="farm-id"
        className="mt-2 min-h-14 w-full rounded-2xl border-2 border-stone-400 bg-white px-4 text-lg font-semibold"
        value={draft.farmId}
        onChange={(event) => updateDraft({ farmId: event.target.value })}
      />
      <p className="mt-2 text-base text-stone-700">Demo farm ID is F001 if you are not sure.</p>

      <div className="mt-auto space-y-3 pt-8">
        <PrimaryButton onClick={() => navigate('/farmer/species')}>
          Start health report
        </PrimaryButton>
      </div>
    </div>
  )
}
