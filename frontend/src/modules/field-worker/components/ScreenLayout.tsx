import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../../../ui/BrandMark'
import { InkBand } from '../../../ui/InkBand'
import { DECISION_SUPPORT_NOTICE } from '../constants'

type ScreenLayoutProps = {
  title: string
  subtitle?: string
  backTo?: string
  children: ReactNode
}

export function ScreenLayout({ title, subtitle, backTo, children }: ScreenLayoutProps) {
  return (
    <div className="min-h-dvh bg-stone-50 font-sans text-[#262322]">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <BrandMark />
          <nav className="flex items-center gap-4 font-ui text-sm font-medium text-stone-600">
            <span className="hidden sm:inline">Field surveillance</span>
            <Link to="/" className="transition hover:text-[#262322]">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <InkBand>
        <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
          {backTo ? (
            <Link
              to={backTo}
              className="mb-3 inline-flex min-h-11 items-center font-ui text-sm font-semibold text-[#C1EDCC] transition hover:text-white"
            >
              ← Back
            </Link>
          ) : null}
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-[#C1EDCC]">
            PRANA Field Surveillance
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-stone-300 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </InkBand>

      <main className="mx-auto w-full max-w-3xl px-5 py-6 sm:py-8">
        <div className="animate-fade-up">{children}</div>
      </main>
      <p className="mx-auto max-w-3xl px-5 pb-10 font-body text-xs leading-relaxed text-stone-500">
        {DECISION_SUPPORT_NOTICE}
      </p>
    </div>
  )
}
