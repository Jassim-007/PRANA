import { EVENT_TYPE_LABELS } from '../constants'
import { EVENT_TYPES, type EventType } from '../types'

type EventTypePickerProps = {
  value: EventType
  onChange: (value: EventType) => void
}

export function EventTypePicker({ value, onChange }: EventTypePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {EVENT_TYPES.map((eventType) => {
        const selected = value === eventType
        return (
          <button
            key={eventType}
            type="button"
            onClick={() => onChange(eventType)}
            className={`min-h-12 rounded-xl px-3 py-3 text-sm font-semibold ${
              selected
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-100'
            }`}
          >
            {EVENT_TYPE_LABELS[eventType]}
          </button>
        )
      })}
    </div>
  )
}
