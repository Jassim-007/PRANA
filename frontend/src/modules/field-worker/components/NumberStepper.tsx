type NumberStepperProps = {
  label: string
  value: number
  onChange: (value: number) => void
}

export function NumberStepper({ label, value, onChange }: NumberStepperProps) {
  return (
    <div className="prana-card p-4 sm:p-5">
      <p className="font-ui text-sm font-medium text-stone-600">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          className="h-14 w-14 shrink-0 rounded-2xl bg-[#262322] font-heading text-2xl font-bold text-[#C1EDCC] transition hover:bg-[#3a3634]"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          className="prana-input h-14 w-full text-center font-display text-2xl font-bold"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange(Number.isFinite(next) ? Math.max(0, Math.floor(next)) : 0)
          }}
        />
        <button
          type="button"
          className="h-14 w-14 shrink-0 rounded-2xl bg-[#262322] font-heading text-2xl font-bold text-[#C1EDCC] transition hover:bg-[#3a3634]"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
