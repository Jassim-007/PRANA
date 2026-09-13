import { formatNumber } from '../utils'

interface Card {
  label: string
  value: number | undefined
  hint: string
}

export function OverviewCards({ cards }: { cards: Card[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => (
        <article
          key={card.label}
          className="prana-card p-5"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{card.label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[#262322]">{formatNumber(card.value ?? 0)}</p>
          <p className="mt-1 font-body text-xs text-stone-500">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
