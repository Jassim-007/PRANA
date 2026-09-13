type Props = {
  label: string
  value: number
  min?: number
  onChange: (value: number) => void
  helper?: string
}

export function NumberStepper({ label, value, min = 0, onChange, helper }: Props) {
  return (
    <div className="prana-card p-4 sm:p-5">
      <p className="font-heading text-lg font-bold text-[#262322]">{label}</p>
      {helper ? <p className="mt-1 font-body text-sm text-stone-600 sm:text-base">{helper}</p> : null}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#262322] font-heading text-3xl font-bold text-[#C1EDCC] transition hover:bg-[#3a3634]"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          inputMode="numeric"
          className="prana-input h-14 min-w-0 flex-1 text-center font-display text-3xl font-bold"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value.replace(/[^\d]/g, ''))
            onChange(Number.isNaN(next) ? min : Math.max(min, next))
          }}
          aria-label={label}
        />
        <button
          type="button"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#262322] font-heading text-3xl font-bold text-[#C1EDCC] transition hover:bg-[#3a3634]"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
