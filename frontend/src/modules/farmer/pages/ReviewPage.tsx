import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { analyzeHealthEvent, createHealthEvent } from '../api/healthEvents'
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
      farm_id: draft.farmId || 'F001',
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
    if (notes) payload.notes = notes

    try {
      const event = await createHealthEvent(payload)
      let analysis = null
      if (event.risk || event.prediction) {
        analysis = {
          prediction: event.prediction ?? { disease: 'Unknown', confidence: 0 },
          risk: event.risk ?? { score: 0, level: 'LOW' },
          zoonotic: event.zoonotic ?? { flag: false },
          explanation: event.explanation ?? [],
        }
      } else {
        try {
          analysis = await analyzeHealthEvent({
            species: payload.species,
            symptoms: payload.symptoms,
            affected_count: payload.affected_count,
            death_count: payload.death_count,
          })
        } catch {
          analysis = null
        }
      }
      setResult({ event, analysis })
      navigate('/farmer/confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the report.')
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
      <dl className="space-y-3 rounded-2xl border-2 border-stone-300 bg-white p-4 text-lg">
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
      {error ? (
        <p className="mt-4 rounded-2xl bg-red-100 p-3 text-base font-semibold text-red-900">{error}</p>
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
      <dt className="text-sm font-bold uppercase tracking-wide text-stone-600">{label}</dt>
      <dd className="font-semibold text-stone-950">{value}</dd>
    </div>
  )
}

function notesRow(notes: string) {
  if (!notes.trim()) return null
  return <Row label="Notes" value={notes} />
}
