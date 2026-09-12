import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { VetDashboardApp } from './modules/vet-dashboard'

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <p className="text-xs tracking-[0.25em] uppercase text-emerald-400/80">
          Livestock health surveillance
        </p>
        <h1 className="mt-3 text-5xl font-bold text-emerald-400">PRANA</h1>
        <p className="mt-4 text-lg text-slate-200">
          Early-warning and decision-support platform for veterinary officers.
        </p>
        <Link
          to="/vet"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Open veterinary dashboard
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vet/*" element={<VetDashboardApp />} />
        <Route path="/dashboard" element={<Navigate to="/vet" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
