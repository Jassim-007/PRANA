import { Link, Outlet } from 'react-router-dom'
import { BrandMark } from '../../../ui/BrandMark'
import { InkBand } from '../../../ui/InkBand'
import { FarmerProgress } from './FarmerProgress'

export function FarmerLayout() {
  return (
    <div className="min-h-dvh bg-stone-50 font-sans text-[#262322]">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <BrandMark />
          <nav className="flex items-center gap-4 font-ui text-sm font-medium text-stone-600">
            <span className="hidden sm:inline">Farmer reporting</span>
            <Link to="/" className="transition hover:text-[#262322]">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <InkBand>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-[#C1EDCC]">
            PRANA
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Farmer health report
          </h1>
          <FarmerProgress />
        </div>
      </InkBand>

      <main className="mx-auto w-full max-w-lg px-5 py-6 sm:max-w-xl sm:py-8 lg:max-w-2xl">
        <div className="animate-fade-up rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
