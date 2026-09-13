import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { createHealthEvent } from '../api/healthEvents'
import { PrimaryButton } from '../components/PrimaryButton'
import { StepHeader } from '../components/StepHeader'
import { useFarmerReport } from '../context/ReportContext'
import { speciesLabel } from '../data/species'
import type { HealthEventCreateRequest } from '../types'

export function ReviewPage() {
  const navigate = useNavigate()
  const { draft, setResult } = useFarmerReport()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!draft.species || draft.latitude == null || draft.longitude == null) {
    return <Navigate to="/farmer/species" replace />
  }

  async function submit() {
  if (!draft.species || draft.latitude == null || draft.longitude == null) return

  setSubmitting(true)
  setError(null)

  const payload: HealthEventCreateRequest = {
    farm_id: '14c0419a-86b6-4e48-a105-ffc748bb1c38',
    source: 'farmer',
    species: draft.species,
    event_type: 'illness',
    symptoms: draft.symptoms,
    affected_count: draft.affectedCount,
    death_count: draft.deathCount,
    duration_days: draft.durationDays,
    latitude: draft.latitude,
    longitude: draft.longitude,
  }

  const notes = draft.notes.trim()
  if (notes) {
    payload.notes = notes
  }
  if (draft.photoDataUrl) {
    payload.photo_base64 = draft.photoDataUrl
  }

  try {
    const event = await createHealthEvent(payload)

const analysis = event.analysis ?? null

setResult({ event, analysis })
    navigate('/farmer/confirmation')
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Could not send the report.'
    )
  } finally {
    setSubmitting(false)
  }
}
  return (
    <div>
      <StepHeader
        title="Check before sending"
        subtitle="Make sure this looks right. You can go back to change any step."
        backTo="/farmer/details"
        step={7}
      />
      <dl className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 font-body text-lg sm:p-5">
        <Row label="Farm" value={draft.farmId} />
        <Row label="Species" value={speciesLabel(draft.species)} />
        <Row label="Signs" value={draft.symptoms.join(', ')} />
        <Row label="Affected" value={String(draft.affectedCount)} />
        <Row label="Deaths" value={String(draft.deathCount)} />
        <Row label="Days" value={String(draft.durationDays)} />
        <Row
          label="Location"
          value={`${draft.latitude.toFixed(4)}, ${draft.longitude.toFixed(4)}`}
        />
        {notesRow(draft.notes)}
      </dl>
      {draft.photoDataUrl ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <img src={draft.photoDataUrl} alt="Attached" className="max-h-56 w-full object-cover" />
        </div>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 p-3 font-ui text-base font-semibold text-red-900">{error}</p>
      ) : null}
      <div className="mt-6">
        <PrimaryButton disabled={submitting} onClick={() => void submit()}>
          {submitting ? 'Sending…' : 'Submit health event'}
        </PrimaryButton>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-stone-500">{label}</dt>
      <dd className="font-heading font-semibold text-[#262322]">{value}</dd>
    </div>
  )
}

function notesRow(notes: string) {
  if (!notes.trim()) return null
  return <Row label="Notes" value={notes} />
}
