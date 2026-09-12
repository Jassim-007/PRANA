import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function PrimaryButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: Props) {
  const styles = {
    primary:
      'bg-emerald-800 text-white hover:bg-emerald-900 disabled:bg-emerald-800/40',
    secondary:
      'bg-white text-emerald-900 border-2 border-emerald-800 hover:bg-emerald-50 disabled:opacity-50',
    ghost: 'bg-transparent text-emerald-900 hover:bg-emerald-50 disabled:opacity-50',
  }[variant]

  return (
    <button
      type="button"
      className={`min-h-14 w-full rounded-2xl px-5 text-lg font-semibold shadow-sm transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
