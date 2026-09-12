type Props = {
  selected: boolean
  title: string
  subtitle?: string
  icon?: string
  onClick: () => void
}

export function ChoiceCard({ selected, title, subtitle, icon, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-20 w-full items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left shadow-sm transition ${
        selected
          ? 'border-emerald-800 bg-emerald-50'
          : 'border-stone-300 bg-white hover:border-emerald-700'
      }`}
    >
      {icon ? <span className="text-4xl">{icon}</span> : null}
      <span className="flex-1">
        <span className="block text-xl font-bold text-stone-900">{title}</span>
        {subtitle ? (
          <span className="mt-1 block text-base text-stone-700">{subtitle}</span>
        ) : null}
      </span>
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border-2 ${
          selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-400'
        }`}
      >
        {selected ? '✓' : ''}
      </span>
    </button>
  )
}
