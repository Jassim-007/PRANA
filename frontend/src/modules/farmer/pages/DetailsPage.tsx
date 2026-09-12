import { Navigate, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'

export function DetailsPage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()

  if (!draft.species) return <Navigate to="/farmer/species" replace />

  function onPhoto(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) {
      updateDraft({ photoDataUrl: null })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      updateDraft({ photoDataUrl: typeof reader.result === 'string' ? reader.result : null })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <StepHeader
        title="Photo and notes"
        subtitle="Both are optional. Photos stay on this phone and are not uploaded yet."
        backTo="/farmer/location"
        step={6}
      />
      <label className="block text-lg font-bold" htmlFor="photo">
        Photo of animals / shed
      </label>
      <input
        id="photo"
        type="file"
        accept="image/*"
        capture="environment"
        className="mt-2 block w-full text-base"
        onChange={(event) => onPhoto(event.target.files)}
      />
      {draft.photoDataUrl ? (
        <img
          src={draft.photoDataUrl}
          alt="Selected livestock or shed"
          className="mt-3 max-h-48 w-full rounded-2xl object-cover"
        />
      ) : null}

      <label className="mt-5 block text-lg font-bold" htmlFor="notes">
        Notes
      </label>
      <textarea
        id="notes"
        rows={4}
        className="mt-2 w-full rounded-2xl border-2 border-stone-400 bg-white p-4 text-lg"
        placeholder="Anything else the team should know"
        value={draft.notes}
        onChange={(event) => updateDraft({ notes: event.target.value })}
      />

      <div className="mt-6">
        <PrimaryButton onClick={() => navigate('/farmer/review')}>Review report</PrimaryButton>
      </div>
    </div>
  )
}
