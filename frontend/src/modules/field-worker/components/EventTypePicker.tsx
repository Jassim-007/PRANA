import { EVENT_TYPE_LABELS } from '../constants'
import { EVENT_TYPES, type EventType } from '../types'

type EventTypePickerProps = {
  value: EventType
  onChange: (value: EventType) => void
}

export function EventTypePicker({ value, onChange }: EventTypePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {EVENT_TYPES.map((eventType) => {
        const selected = value === eventType
        return (
          <button
            key={eventType}
            type="button"
            onClick={() => onChange(eventType)}
            className={`min-h-12 rounded-xl px-3 py-3 font-ui text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
              selected
                ? 'bg-[#262322] text-[#C1EDCC]'
                : 'border border-stone-200 bg-white text-[#262322] hover:border-[#8fd6a0]'
            }`}
          >
            {EVENT_TYPE_LABELS[eventType]}
          </button>
        )
      })}
    </div>
  )
}
