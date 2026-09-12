type Props = {
  label: string
  value: number
  min?: number
  onChange: (value: number) => void
  helper?: string
}

export function NumberStepper({ label, value, min = 0, onChange, helper }: Props) {
  return (
    <div className="rounded-2xl border-2 border-stone-300 bg-white p-4">
      <p className="text-lg font-bold text-stone-900">{label}</p>
      {helper ? <p className="mt-1 text-base text-stone-700">{helper}</p> : null}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-800 text-3xl font-bold text-white"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          inputMode="numeric"
          className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-stone-400 bg-stone-50 text-center text-3xl font-bold text-stone-900"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value.replace(/[^\d]/g, ''))
            onChange(Number.isNaN(next) ? min : Math.max(min, next))
          }}
          aria-label={label}
        />
        <button
          type="button"
          className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-800 text-3xl font-bold text-white"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
