import type { ReactNode } from 'react'

export function InkBand({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative overflow-hidden bg-[#262322] text-white ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C1EDCC 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative">{children}</div>
    </section>
  )
}
