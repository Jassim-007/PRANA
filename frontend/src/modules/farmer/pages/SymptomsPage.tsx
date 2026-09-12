import { Navigate, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'
import { isPoultry } from '../data/species'
import { symptomsForSpecies } from '../data/symptoms'

export function SymptomsPage() {
  const navigate = useNavigate()
  const { draft, toggleSymptom } = useFarmerReport()

  if (!draft.species) return <Navigate to="/farmer/species" replace />

  const options = symptomsForSpecies(draft.species)

  return (
    <div>
      <StepHeader
        title={isPoultry(draft.species) ? 'What is happening in the flock?' : 'What signs do you see?'}
        subtitle="Tap all that apply. You can choose more than one."
        backTo="/farmer/species"
        step={2}
      />
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = draft.symptoms.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleSymptom(option.id)}
              className={`min-h-14 rounded-2xl border-2 px-4 text-left text-lg font-semibold ${
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white'
                  : 'border-stone-400 bg-white text-stone-900'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      <div className="mt-6">
        <PrimaryButton
          disabled={draft.symptoms.length === 0}
          onClick={() => navigate('/farmer/counts')}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  )
}
