import { formatNumber } from '../utils'

interface Card {
  label: string
  value: number | undefined
  hint: string
}

export function OverviewCards({ cards }: { cards: Card[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{formatNumber(card.value ?? 0)}</p>
          <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
