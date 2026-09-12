import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ScreenLayout } from '../components/ScreenLayout'
import { FIELD_WORKER_BASE } from '../constants'
import { readFieldWorkerId, writeFieldWorkerId } from '../workerId'

export function FieldWorkerHome() {
  const [workerId, setWorkerId] = useState(readFieldWorkerId)

  useEffect(() => {
    writeFieldWorkerId(workerId)
  }, [workerId])

  return (
    <ScreenLayout
      title="Field worker home"
      subtitle="Active farm surveillance — record health events even when farmers have not reported."
    >
      <section className="rounded-2xl bg-slate-900 p-4">
        <label htmlFor="worker-id" className="text-sm font-medium text-slate-300">
          Field worker ID
        </label>
        <input
          id="worker-id"
          value={workerId}
          onChange={(event) => setWorkerId(event.target.value)}
          className="mt-2 h-14 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-lg text-white"
          placeholder="FW001"
        />
        <p className="mt-2 text-xs text-slate-500">
          Authentication is not part of this MVP. Use your assigned worker ID to load farms.
        </p>
      </section>

      <div className="mt-6 grid gap-3">
        <Link
          to={`${FIELD_WORKER_BASE}/farms`}
          className="flex min-h-16 items-center justify-center rounded-2xl bg-emerald-500 px-4 text-lg font-bold text-slate-950"
        >
          View assigned farms
        </Link>
      </div>
    </ScreenLayout>
  )
}
