import { Navigate, useNavigate } from 'react-router-dom'
import { NumberStepper } from '../components/NumberStepper'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'
import { isPoultry } from '../data/species'

export function CountsPage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()

  if (!draft.species) return <Navigate to="/farmer/species" replace />

  const poultry = isPoultry(draft.species)

  return (
    <div className="space-y-4">
      <StepHeader
        title={poultry ? 'How many birds are affected?' : 'How many animals are affected?'}
        subtitle={
          poultry
            ? 'Report the flock or shed, not each bird one by one.'
            : 'Enter the number that look sick, then any deaths.'
        }
        backTo="/farmer/symptoms"
        step={3}
      />
      <NumberStepper
        label={poultry ? 'Birds / flock affected' : 'Animals affected'}
        helper={poultry ? 'Count sick birds in the shed or flock.' : 'Count sick animals.'}
        value={draft.affectedCount}
        min={1}
        onChange={(affectedCount) => updateDraft({ affectedCount })}
      />
      <NumberStepper
        label={poultry ? 'Birds that died' : 'Animals that died'}
        helper="Enter 0 if none have died."
        value={draft.deathCount}
        min={0}
        onChange={(deathCount) => updateDraft({ deathCount })}
      />
      <PrimaryButton onClick={() => navigate('/farmer/duration')}>Continue</PrimaryButton>
    </div>
  )
}
