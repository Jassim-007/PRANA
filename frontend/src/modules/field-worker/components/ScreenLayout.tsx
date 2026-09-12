import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DECISION_SUPPORT_NOTICE } from '../constants'

type ScreenLayoutProps = {
  title: string
  subtitle?: string
  backTo?: string
  children: ReactNode
}

export function ScreenLayout({ title, subtitle, backTo, children }: ScreenLayoutProps) {
  return (
    <div className="min-h-dvh bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto w-full max-w-2xl">
          {backTo ? (
            <Link to={backTo} className="mb-2 inline-flex min-h-11 items-center text-sm font-semibold text-emerald-400">
              ← Back
            </Link>
          ) : null}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            PRANA Field Surveillance
          </p>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 py-5">{children}</main>
      <p className="mx-auto max-w-2xl px-4 pb-8 text-xs text-slate-500">{DECISION_SUPPORT_NOTICE}</p>
    </div>
  )
}
