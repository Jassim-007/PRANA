import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { FarmerApp } from './modules/farmer'
import { FieldWorkerRoutes } from './modules/field-worker'

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-emerald-400">
          PRANA
        </h1>

        <p className="mt-4 text-xl text-white">
          Livestock Health Surveillance Platform
        </p>

        <p className="mt-2 text-slate-400">
          Early warning and health monitoring for livestock
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/farmer"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-500 px-5 font-semibold text-slate-950"
          >
            Farmer Module
          </Link>

          <Link
            to="/field-worker"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-400 px-5 font-semibold text-emerald-400"
          >
            Field Worker Module
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer/*" element={<FarmerApp />} />
        <Route path="/field-worker/*" element={<FieldWorkerRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
