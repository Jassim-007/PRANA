import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/DashboardLayout'
import { AlertsPage } from './pages/AlertsPage'
import { ClusterDetailsPage } from './pages/ClusterDetailsPage'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { HealthEventsPage } from './pages/HealthEventsPage'
import { OverviewPage } from './pages/OverviewPage'
import { RiskMapPage } from './pages/RiskMapPage'

export function VetDashboardApp() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="map" element={<RiskMapPage />} />
        <Route path="events" element={<HealthEventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="clusters/:id" element={<ClusterDetailsPage />} />
        <Route path="*" element={<Navigate to="/vet" replace />} />
      </Route>
    </Routes>
  )
}
