import { useNavigate } from 'react-router-dom'
import { ChoiceCard } from '../components/ChoiceCard'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'
import { SPECIES_OPTIONS } from '../data/species'

export function SpeciesPage() {
  const navigate = useNavigate()
  const { draft, setSpecies } = useFarmerReport()

  return (
    <div>
      <StepHeader
        title="Which animals are affected?"
        subtitle="Choose one species. For poultry, you will report the whole flock or shed."
        backTo="/farmer"
        step={1}
      />
      <div className="space-y-3">
        {SPECIES_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.id}
            icon={option.icon}
            title={option.label}
            subtitle={option.helper}
            selected={draft.species === option.id}
            onClick={() => setSpecies(option.id)}
          />
        ))}
      </div>
      <div className="mt-6">
        <PrimaryButton disabled={!draft.species} onClick={() => navigate('/farmer/symptoms')}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  )
}
