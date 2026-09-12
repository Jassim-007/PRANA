import { Navigate, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/PrimaryButton'
import { useFarmerReport } from '../context/ReportContext'

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-emerald-100 text-emerald-950',
  MODERATE: 'bg-amber-100 text-amber-950',
  HIGH: 'bg-orange-100 text-orange-950',
  CRITICAL: 'bg-red-100 text-red-950',
}

export function ConfirmationPage() {
  const navigate = useNavigate()
  const { result, resetDraft } = useFarmerReport()

  if (!result) return <Navigate to="/farmer" replace />

  const { event, analysis } = result
  const riskLevel = analysis?.risk.level ?? null

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-emerald-800 bg-white p-4">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">Report received</p>
        <h1 className="mt-1 text-3xl font-extrabold text-stone-950">Thank you</h1>
        <p className="mt-2 text-lg text-stone-800">
          Your health event was submitted. A field team can use this as an early-warning signal.
        </p>
        <p className="mt-3 text-lg font-semibold text-stone-950">Event ID: {event.id}</p>
        <p className="text-base text-stone-700">Status: {event.status}</p>
      </div>

      {analysis ? (
        <div className="rounded-2xl border-2 border-stone-300 bg-white p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-stone-600">Decision support</p>
          <p className="mt-2 text-base font-semibold text-red-900">
            This is not a confirmed diagnosis. It is only decision support for further checking.
          </p>
          <p className="mt-3 text-xl font-bold text-stone-950">
            Possible concern: {analysis.prediction.disease}
          </p>
          <p className="text-base text-stone-800">
            Confidence: {Math.round(analysis.prediction.confidence * 100)}%
          </p>
          {riskLevel ? (
            <p
              className={`mt-3 inline-block rounded-full px-3 py-1 text-base font-bold ${
                RISK_STYLES[riskLevel] ?? 'bg-stone-200 text-stone-950'
              }`}
            >
              Risk {riskLevel} ({analysis.risk.score})
            </p>
          ) : null}
          {analysis.zoonotic.flag ? (
            <p className="mt-3 text-base font-bold text-red-900">
              Public-health review flag: possible zoonotic concern. Ask a veterinarian.
            </p>
          ) : null}
          {analysis.explanation.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-stone-800">
              {analysis.explanation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="rounded-2xl bg-white p-4 text-lg text-stone-800">
          The report was saved. No extra risk summary was returned by the server.
        </p>
      )}

      <PrimaryButton
        onClick={() => {
          resetDraft()
          navigate('/farmer')
        }}
      >
        New report
      </PrimaryButton>
    </div>
  )
}
