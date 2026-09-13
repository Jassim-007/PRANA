import { Link } from 'react-router-dom'

export function BrandMark({
  to = '/',
  compact = false,
}: {
  to?: string
  compact?: boolean
}) {
  return (
    <Link to={to} className="flex items-center text-[#262322]">
      <img
        src="/prana.svg"
        alt="PRANA"
        className={`h-8 w-auto max-w-full object-contain sm:h-9 ${compact ? 'md:h-8' : 'md:h-10'}`}
      />
    </Link>
  )
}
