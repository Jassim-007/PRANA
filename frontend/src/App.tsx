import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './modules/home/HomePage'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

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