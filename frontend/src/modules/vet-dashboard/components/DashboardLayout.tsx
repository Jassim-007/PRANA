import { NavLink, Outlet } from 'react-router-dom'
import { DISCLAIMER } from '../constants'

const links = [
  { to: '/vet', label: 'Overview', end: true },
  { to: '/vet/map', label: 'Risk map' },
  { to: '/vet/events', label: 'Health events' },
  { to: '/vet/alerts', label: 'Alerts' },
]

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Government veterinary surveillance
            </p>
            <h1 className="text-xl font-semibold">PRANA decision support</h1>
          </div>
          <p className="max-w-md text-right text-xs text-slate-300">
            Identify high-risk events, emerging patterns, geographical clusters, and cases needing field follow-up.
          </p>
        </div>
        <nav className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-3 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-emerald-400 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs leading-5 text-slate-500">{DISCLAIMER}</p>
      </footer>
    </div>
  )
}
