import { Link } from 'react-router-dom'

type Props = {
  title: string
  subtitle?: string
  backTo?: string
  step?: number
  totalSteps?: number
}

export function StepHeader({ title, subtitle, backTo, step, totalSteps = 7 }: Props) {
  return (
    <header className="mb-6">
      {backTo ? (
        <Link
          to={backTo}
          className="mb-3 inline-flex min-h-11 items-center text-lg font-semibold text-emerald-900"
        >
          ← Back
        </Link>
      ) : null}
      {step ? (
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">
          Step {step} of {totalSteps}
        </p>
      ) : null}
      <h1 className="mt-1 text-3xl font-extrabold leading-tight text-stone-950">{title}</h1>
      {subtitle ? <p className="mt-2 text-lg leading-snug text-stone-700">{subtitle}</p> : null}
    </header>
  )
}
