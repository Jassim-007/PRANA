import { Navigate, Route, Routes } from 'react-router-dom'
import { AssignedFarmsPage } from './pages/AssignedFarmsPage'
import { FarmDetailPage } from './pages/FarmDetailPage'
import { FarmVisitPage } from './pages/FarmVisitPage'
import { FieldWorkerHome } from './pages/FieldWorkerHome'
import { VisitSuccessPage } from './pages/VisitSuccessPage'

export function FieldWorkerRoutes() {
  return (
    <Routes>
      <Route index element={<FieldWorkerHome />} />
      <Route path="farms" element={<AssignedFarmsPage />} />
      <Route path="farms/:farmId" element={<FarmDetailPage />} />
      <Route path="farms/:farmId/visit" element={<FarmVisitPage />} />
      <Route path="farms/:farmId/success" element={<VisitSuccessPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}
