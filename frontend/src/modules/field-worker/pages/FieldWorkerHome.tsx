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
      <section className="prana-card p-4 sm:p-5">
        <label htmlFor="worker-id" className="font-ui text-sm font-medium text-stone-600">
          Field worker ID
        </label>
        <input
          id="worker-id"
          value={workerId}
          onChange={(event) => setWorkerId(event.target.value)}
          className="prana-input mt-2 text-lg"
          placeholder="FW001"
        />
        <p className="mt-2 font-body text-xs text-stone-500">
          Authentication is not part of this MVP. Use your assigned worker ID to load farms.
        </p>
      </section>

      <div className="mt-6 grid gap-3">
        <Link
          to={`${FIELD_WORKER_BASE}/farms`}
          className="prana-btn prana-btn-primary"
        >
          View assigned farms
        </Link>
      </div>
    </ScreenLayout>
  )
}
