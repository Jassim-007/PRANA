import { useState, type FormEvent } from 'react'
import { submitEventFeedback } from '../api'
import type { FeedbackDecision } from '../types'

const decisions: { value: FeedbackDecision; label: string }[] = [
  { value: 'needs_followup', label: 'Needs field follow-up' },
  { value: 'confirmed', label: 'Signal confirmed for follow-up' },
  { value: 'rejected', label: 'Signal not supported' },
]

export function FeedbackForm({ eventId }: { eventId: string }) {
  const [vetId, setVetId] = useState('V001')
  const [decision, setDecision] = useState<FeedbackDecision>('needs_followup')
  const [notes, setNotes] = useState('')
  const [actionTaken, setActionTaken] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setStatus(null)
    try {
      const result = await submitEventFeedback(eventId, {
        vet_id: vetId,
        decision,
        notes,
        action_taken: actionTaken,
      })
      setStatus(result.message || 'Veterinary review recorded.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to record review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Veterinary review</h3>
      <p className="mt-1 text-xs text-slate-500">
        Record a decision-support review. This does not issue a confirmed diagnosis.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Officer ID</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            value={vetId}
            onChange={(e) => setVetId(e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Decision</span>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            value={decision}
            onChange={(e) => setDecision(e.target.value as FeedbackDecision)}
          >
            {decisions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Notes</span>
          <textarea
            className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Action taken</span>
          <textarea
            className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-2"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {saving ? 'Recording…' : 'Record review'}
      </button>
      {status ? <p className="mt-2 text-sm text-emerald-700">{status}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </form>
  )
}
