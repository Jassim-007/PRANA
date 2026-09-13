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
    primary: 'prana-btn prana-btn-primary disabled:opacity-40',
    secondary:
      'prana-btn border border-[#262322] bg-white text-[#262322] hover:bg-[#C1EDCC] disabled:opacity-50',
    ghost:
      'prana-btn bg-transparent text-[#262322] hover:bg-stone-100 disabled:opacity-50',
  }[variant]

  return (
    <button
      type="button"
      className={`w-full sm:w-auto min-h-10 px-4 sm:px-5 text-sm sm:text-base ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}