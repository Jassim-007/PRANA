import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'
import { photoErrorMessage, processPhotoFile } from '../utils/photo'

export function DetailsPage() {
  const navigate = useNavigate()
  const { draft, updateDraft } = useFarmerReport()
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [processingPhoto, setProcessingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!draft.species) return <Navigate to="/farmer/species" replace />

  async function onPhoto(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return

    setPhotoError(null)
    setProcessingPhoto(true)
    const result = await processPhotoFile(file)
    setProcessingPhoto(false)

    if (!result.ok && 'error' in result) {
      setPhotoError(photoErrorMessage(result.error))
      return
    }
    updateDraft({ photoDataUrl: result.dataUrl })
  }

  function removePhoto() {
    updateDraft({ photoDataUrl: null })
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <StepHeader
        title="Photo and notes"
        subtitle="Both are optional. A photo helps the field team understand what's happening."
        backTo="/farmer/location"
        step={6}
      />

      <label className="block font-heading text-lg font-bold" htmlFor="photo">
        Photo of animals / shed
      </label>

      {draft.photoDataUrl ? (
        <div className="mt-2 space-y-2">
          <div className="relative overflow-hidden rounded-2xl border border-stone-200">
            <img
              src={draft.photoDataUrl}
              alt="Selected livestock or shed"
              className="max-h-56 w-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            <PrimaryButton
              type="button"
              variant="secondary"
              className="w-auto flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace photo
            </PrimaryButton>
            <PrimaryButton
              type="button"
              variant="ghost"
              className="w-auto flex-1"
              onClick={removePhoto}
            >
              Remove
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={processingPhoto}
          className="mt-2 flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 text-stone-600 transition hover:border-[#8fd6a0] hover:bg-[#C1EDCC]/20 hover:text-[#262322] disabled:opacity-60"
        >
          <span className="text-3xl" aria-hidden="true">
            📷
          </span>
          <span className="text-base font-semibold">
            {processingPhoto ? 'Preparing photo…' : 'Tap to add a photo'}
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        id="photo"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        onChange={(event) => void onPhoto(event.target.files)}
      />

      {photoError ? (
        <p className="mt-2 rounded-xl bg-red-50 p-3 font-ui text-base font-semibold text-red-900" role="alert">
          {photoError}
        </p>
      ) : null}

      <label className="mt-5 block font-heading text-lg font-bold" htmlFor="notes">
        Notes
      </label>
      <textarea
        id="notes"
        rows={4}
        className="prana-textarea mt-2 text-lg"
        placeholder="Anything else the team should know"
        value={draft.notes}
        onChange={(event) => updateDraft({ notes: event.target.value })}
      />

      <div className="mt-6">
        <PrimaryButton disabled={processingPhoto} onClick={() => navigate('/farmer/review')}>
          Review report
        </PrimaryButton>
      </div>
    </div>
  )
}
