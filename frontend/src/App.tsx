import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-emerald-400">PRANA</h1>

        <p className="mt-4 text-xl text-slate-200">
          Livestock Health Surveillance Platform
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/farmer"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Farmer
          </Link>

          <Link
            to="/field-worker"
            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-400"
          >
            Field Worker
          </Link>

          <Link
            to="/vet"
            className="rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white hover:bg-purple-400"
          >
            Vet Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function Farmer() {
  return <div className="p-8">Farmer App</div>;
}

function FieldWorker() {
  return <div className="p-8">Field Worker App</div>;
}

function Vet() {
  return <div className="p-8">Vet Dashboard</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer" element={<Farmer />} />
        <Route path="/field-worker" element={<FieldWorker />} />
        <Route path="/vet" element={<Vet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;