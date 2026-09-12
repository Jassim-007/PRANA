import { SYMPTOM_LABELS } from '../constants'
import { SYMPTOMS } from '../types'

type SymptomPickerProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export function SymptomPicker({ value, onChange }: SymptomPickerProps) {
  function toggle(symptom: string) {
    if (value.includes(symptom)) {
      onChange(value.filter((item) => item !== symptom))
      return
    }
    onChange([...value, symptom])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {SYMPTOMS.map((symptom) => {
        const selected = value.includes(symptom)
        return (
          <button
            key={symptom}
            type="button"
            onClick={() => toggle(symptom)}
            className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold ${
              selected
                ? 'bg-sky-400 text-slate-950'
                : 'bg-slate-800 text-slate-100'
            }`}
          >
            {SYMPTOM_LABELS[symptom]}
          </button>
        )
      })}
    </div>
  )
}
