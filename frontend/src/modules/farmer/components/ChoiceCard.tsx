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
      className={`flex min-h-20 w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected
          ? 'border-[#8fd6a0] bg-[#C1EDCC]/35'
          : 'border-stone-200 bg-white hover:border-[#8fd6a0]'
      }`}
    >
      {icon ? <span className="text-4xl">{icon}</span> : null}
      <span className="flex-1">
        <span className="block font-heading text-lg font-bold text-[#262322] sm:text-xl">{title}</span>
        {subtitle ? (
          <span className="mt-1 block font-body text-sm text-stone-600 sm:text-base">{subtitle}</span>
        ) : null}
      </span>
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border-2 transition ${
          selected ? 'border-[#262322] bg-[#262322] text-[#C1EDCC]' : 'border-stone-300'
        }`}
      >
        {selected ? '✓' : ''}
      </span>
    </button>
  )
}
