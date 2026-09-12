import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
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
          Frontend initialization successful 🚀
        </p>

        <Link
          to="/field-worker"
          className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-emerald-500 px-5 font-semibold text-slate-950"
        >
          Open field worker module
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
        <Route path="/field-worker/*" element={<FieldWorkerRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
