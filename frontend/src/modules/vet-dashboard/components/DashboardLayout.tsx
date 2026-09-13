import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '../../../ui/BrandMark'
import { InkBand } from '../../../ui/InkBand'
import { DISCLAIMER } from '../constants'

const links = [
  { to: '/vet', label: 'Overview', end: true },
  { to: '/vet/map', label: 'Risk map' },
  { to: '/vet/events', label: 'Health events' },
  { to: '/vet/alerts', label: 'Alerts' },
]

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-[#262322]">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
          <BrandMark />
          <p className="hidden font-ui text-sm font-medium text-stone-500 md:block">
            Veterinary decision support
          </p>
        </div>
      </header>

      <InkBand>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
          <div>
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C1EDCC]">
              Government veterinary surveillance
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              PRANA decision support
            </h1>
          </div>
          <p className="max-w-md font-body text-xs leading-relaxed text-stone-300 sm:text-right">
            Identify high-risk events, emerging patterns, geographical clusters, and cases needing field follow-up.
          </p>
        </div>
        <nav className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-3 font-ui text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-b-2 border-[#C1EDCC] text-white'
                      : 'border-b-2 border-transparent text-stone-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </InkBand>

      <main className="mx-auto max-w-7xl px-5 py-6 sm:py-8">
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <p className="mx-auto max-w-7xl px-5 py-4 font-body text-xs leading-5 text-stone-500">{DISCLAIMER}</p>
      </footer>
    </div>
  )
}
