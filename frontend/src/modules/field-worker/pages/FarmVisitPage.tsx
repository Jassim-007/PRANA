import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EventTypePicker } from '../components/EventTypePicker'
import { NumberStepper } from '../components/NumberStepper'
import { ScreenLayout } from '../components/ScreenLayout'
import { SymptomPicker } from '../components/SymptomPicker'
import { createFieldWorkerHealthEvent, getAssignedFarms } from '../api'
import { FIELD_WORKER_BASE } from '../constants'
import type { EventType, Farm, VisitFormState } from '../types'
import { writeVisitStatus } from '../visitStatus'
import { readFieldWorkerId } from '../workerId'

function emptyForm(farm: Farm | null): VisitFormState {
  return {
    species: farm?.species ?? 'cattle',
    event_type: 'illness',
    symptoms: [],
    affected_count: 0,
    death_count: 0,
    duration_days: '',
    notes: '',
    latitude: farm?.latitude != null ? String(farm.latitude) : '',
    longitude: farm?.longitude != null ? String(farm.longitude) : '',
    farmer_self_treatment: false,
    government_vet_consulted: false,
    private_vet_consulted: false,
    treatment_unsuccessful: false,
  }
}

function buildNotes(form: VisitFormState): string | undefined {
  const extras: string[] = []
  if (form.farmer_self_treatment) extras.push('Farmer self-treatment reported')
  if (form.government_vet_consulted) extras.push('Government vet consulted')
  if (form.private_vet_consulted) extras.push('Private vet consulted')
  if (form.treatment_unsuccessful) extras.push('Treatment unsuccessful')

  const parts = [form.notes.trim(), extras.length > 0 ? extras.join('; ') : '']
    .filter((part) => part.length > 0)

  if (parts.length === 0) {
    return undefined
  }
  return `Observed during farm visit. ${parts.join(' | ')}`
}

export function FarmVisitPage() {
  const { farmId = '' } = useParams()
  const navigate = useNavigate()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [form, setForm] = useState<VisitFormState>(() => emptyForm(null))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gpsMessage, setGpsMessage] = useState<string | null>(null)

  useEffect(() => {
    writeVisitStatus(farmId, 'in_progress')

    async function loadFarm() {
      try {
        const farms = await getAssignedFarms(readFieldWorkerId())
        const match = farms.find((item) => item.id === farmId) ?? {
          id: farmId,
          name: `Farm ${farmId}`,
        }
        setFarm(match)
        setForm(emptyForm(match))
      } catch {
        const fallback = { id: farmId, name: `Farm ${farmId}` }
        setFarm(fallback)
        setForm(emptyForm(fallback))
      }
    }

    void loadFarm()
  }, [farmId])

  const canSubmit = useMemo(() => {
    return form.species.trim().length > 0 && form.event_type.trim().length > 0
  }, [form.event_type, form.species])

  function captureGps() {
    if (!navigator.geolocation) {
      setGpsMessage('GPS is not available on this device.')
      return
    }
    setGpsMessage('Capturing location…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: String(Number(position.coords.latitude.toFixed(6))),
          longitude: String(Number(position.coords.longitude.toFixed(6))),
        }))
        setGpsMessage('Location captured from device GPS.')
      },
      () => {
        setGpsMessage('Could not capture GPS. Enter coordinates or use farm location.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit || submitting) {
      return
    }
    setSubmitting(true)
    setError(null)

    const duration = form.duration_days.trim()
    const latitude = form.latitude.trim()
    const longitude = form.longitude.trim()

    try {
      const result = await createFieldWorkerHealthEvent({
        farm_id: farmId,
        source: 'field_worker',
        species: form.species,
        event_type: form.event_type,
        symptoms: form.symptoms,
        affected_count: form.affected_count,
        death_count: form.death_count,
        ...(duration ? { duration_days: Number(duration) } : {}),
        ...(latitude ? { latitude: Number(latitude) } : {}),
        ...(longitude ? { longitude: Number(longitude) } : {}),
        notes: buildNotes(form),
      })
      writeVisitStatus(farmId, 'submitted')
      navigate(`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farmId)}/success`, {
        state: {
          eventId: result.id,
          message: result.message ?? 'Health event created successfully',
          farmName: farm?.name ?? farmId,
        },
      })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScreenLayout
      title="Farm health visit"
      subtitle={farm ? `${farm.id} · ${farm.name}` : farmId}
      backTo={`${FIELD_WORKER_BASE}/farms/${encodeURIComponent(farmId)}`}
    >
      <form onSubmit={handleSubmit} className="grid gap-6">
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Species
          </h2>
          <select
            className="h-14 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-lg text-white"
            value={form.species}
            onChange={(event) => setForm((current) => ({ ...current, species: event.target.value }))}
          >
            <option value="cattle">Cattle</option>
            <option value="buffalo">Buffalo</option>
            <option value="goat">Goat</option>
            <option value="sheep">Sheep</option>
            <option value="poultry">Poultry</option>
          </select>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Health event
          </h2>
          <EventTypePicker
            value={form.event_type}
            onChange={(event_type: EventType) => setForm((current) => ({ ...current, event_type }))}
          />
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Symptoms
          </h2>
          <SymptomPicker
            value={form.symptoms}
            onChange={(symptoms) => setForm((current) => ({ ...current, symptoms }))}
          />
        </section>

        <NumberStepper
          label="Affected count"
          value={form.affected_count}
          onChange={(affected_count) => setForm((current) => ({ ...current, affected_count }))}
        />
        <NumberStepper
          label="Death count"
          value={form.death_count}
          onChange={(death_count) => setForm((current) => ({ ...current, death_count }))}
        />

        <section>
          <label htmlFor="duration" className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Duration (days)
          </label>
          <input
            id="duration"
            type="number"
            min={0}
            inputMode="numeric"
            className="mt-2 h-14 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-lg text-white"
            value={form.duration_days}
            onChange={(event) =>
              setForm((current) => ({ ...current, duration_days: event.target.value }))
            }
          />
        </section>

        <section className="grid gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Treatment context
          </h2>
          {(
            [
              ['farmer_self_treatment', 'Farmer self-treatment'],
              ['government_vet_consulted', 'Government vet consulted'],
              ['private_vet_consulted', 'Private vet consulted'],
              ['treatment_unsuccessful', 'Treatment unsuccessful'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex min-h-14 items-center gap-3 rounded-xl bg-slate-900 px-4">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={form[key]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.checked }))
                }
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </section>

        <section>
          <label htmlFor="notes" className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Observations / notes
          </label>
          <textarea
            id="notes"
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white"
            placeholder="What did you observe during this visit?"
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          />
        </section>

        <section className="grid gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Location
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              aria-label="Latitude"
              placeholder="Latitude"
              className="h-14 rounded-xl border border-slate-700 bg-slate-900 px-4 text-white"
              value={form.latitude}
              onChange={(event) =>
                setForm((current) => ({ ...current, latitude: event.target.value }))
              }
            />
            <input
              aria-label="Longitude"
              placeholder="Longitude"
              className="h-14 rounded-xl border border-slate-700 bg-slate-900 px-4 text-white"
              value={form.longitude}
              onChange={(event) =>
                setForm((current) => ({ ...current, longitude: event.target.value }))
              }
            />
          </div>
          <button
            type="button"
            onClick={captureGps}
            className="min-h-12 rounded-xl bg-slate-800 font-semibold text-white"
          >
            Use current GPS
          </button>
          {gpsMessage ? <p className="text-sm text-slate-400">{gpsMessage}</p> : null}
        </section>

        {error ? (
          <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-200">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="min-h-16 rounded-2xl bg-emerald-500 text-lg font-bold text-slate-950 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit visit / health event'}
        </button>
      </form>
    </ScreenLayout>
  )
}
