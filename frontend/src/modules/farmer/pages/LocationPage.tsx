import { Navigate, useNavigate } from 'react-router-dom'
import { LocationPicker } from '../components/LocationPicker'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'

export function LocationPage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()

  if (!draft.species) return <Navigate to="/farmer/species" replace />

  const ready = draft.latitude != null && draft.longitude != null

  return (
    <div>
      <StepHeader
        title="Where is this happening?"
        subtitle="Use GPS or tap the map for the farm, flock, or shed."
        backTo="/farmer/duration"
        step={5}
      />
      <LocationPicker
        latitude={draft.latitude}
        longitude={draft.longitude}
        onChange={(latitude, longitude) => updateDraft({ latitude, longitude })}
      />
      <div className="mt-6">
        <PrimaryButton disabled={!ready} onClick={() => navigate('/farmer/details')}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  )
}
