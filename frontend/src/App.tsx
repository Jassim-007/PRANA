import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { FarmerApp } from './modules/farmer'
import { FieldWorkerRoutes } from './modules/field-worker'
import {
  AlertsPage,
  ClusterDetailsPage,
  DashboardLayout,
  EventDetailsPage,
  HealthEventsPage,
  OverviewPage,
  RiskMapPage,
} from './modules/vet-dashboard'

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <p className="text-xs tracking-[0.25em] uppercase text-emerald-400/80">
          Livestock health surveillance
        </p>

        <h1 className="mt-3 text-5xl font-bold text-emerald-400">
          PRANA
        </h1>

        <p className="mt-4 text-lg text-slate-200">
          Early-warning and decision-support platform for livestock health.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/farmer"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Farmer Module
          </Link>

          <Link
            to="/field-worker"
            className="inline-flex items-center justify-center rounded-md border border-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-400/10"
          >
            Field Worker Module
          </Link>

          <Link
            to="/vet"
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Veterinary Dashboard
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

        <Route path="/dashboard" element={<Navigate to="/vet" replace />} />

        <Route path="/vet" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="map" element={<RiskMapPage />} />
          <Route path="events" element={<HealthEventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="clusters/:id" element={<ClusterDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App