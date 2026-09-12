import { Outlet } from 'react-router-dom'
import { FarmerProgress } from './FarmerProgress'

export function FarmerLayout() {
  return (
    <div className="min-h-dvh bg-emerald-50 text-stone-950">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <div className="bg-emerald-900 px-4 py-3 text-white">
          <p className="text-sm font-bold tracking-wide">PRANA</p>
          <p className="text-lg font-semibold">Farmer health report</p>
          <FarmerProgress />
        </div>
        <main className="flex-1 px-4 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
