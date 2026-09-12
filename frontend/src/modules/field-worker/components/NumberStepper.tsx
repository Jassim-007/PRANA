type NumberStepperProps = {
  label: string
  value: number
  onChange: (value: number) => void
}

export function NumberStepper({ label, value, onChange }: NumberStepperProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          className="h-14 w-14 rounded-2xl bg-slate-800 text-2xl font-bold text-white"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950 text-center text-2xl font-bold text-white"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange(Number.isFinite(next) ? Math.max(0, Math.floor(next)) : 0)
          }}
        />
        <button
          type="button"
          className="h-14 w-14 rounded-2xl bg-slate-800 text-2xl font-bold text-white"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
