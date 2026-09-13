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
    <header className="mb-6 animate-fade-up">
      {backTo ? (
        <Link
          to={backTo}
          className="mb-3 inline-flex min-h-11 items-center font-ui text-base font-semibold text-emerald-800 transition hover:text-[#262322]"
        >
          ← Back
        </Link>
      ) : null}
      {step ? (
        <p className="font-ui text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
          Step {step} of {totalSteps}
        </p>
      ) : null}
      <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight tracking-tight text-[#262322] sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 font-body text-base leading-relaxed text-stone-600 sm:text-lg">{subtitle}</p>
      ) : null}
    </header>
  )
}
