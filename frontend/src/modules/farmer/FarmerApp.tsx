import { Navigate, Route, Routes } from 'react-router-dom'
import { FarmerLayout } from './components/FarmerLayout'
import { ReportProvider } from './context/ReportContext'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { CountsPage } from './pages/CountsPage'
import { DetailsPage } from './pages/DetailsPage'
import { DurationPage } from './pages/DurationPage'
import { HomePage } from './pages/HomePage'
import { LocationPage } from './pages/LocationPage'
import { ReviewPage } from './pages/ReviewPage'
import { SpeciesPage } from './pages/SpeciesPage'
import { SymptomsPage } from './pages/SymptomsPage'

export function FarmerApp() {
  return (
    <ReportProvider>
      <Routes>
        <Route element={<FarmerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="species" element={<SpeciesPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="counts" element={<CountsPage />} />
          <Route path="duration" element={<DurationPage />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="details" element={<DetailsPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
        </Route>

        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </ReportProvider>
  )
}