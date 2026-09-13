import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  FarmerReportDraft,
  Species,
  SubmissionResult,
} from '../types'

const STORAGE_KEY = 'prana.farmer.report'

const DEFAULT_DRAFT: FarmerReportDraft = {
  farmId: 'F001',
  species: null,
  symptoms: [],
  affectedCount: 1,
  deathCount: 0,
  durationDays: 1,
  latitude: null,
  longitude: null,
  notes: '',
  photoDataUrl: null,
}

function loadDraft(): FarmerReportDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DRAFT
    return { ...DEFAULT_DRAFT, ...(JSON.parse(raw) as FarmerReportDraft) }
  } catch {
    return DEFAULT_DRAFT
  }
}

type ReportContextValue = {
  draft: FarmerReportDraft
  result: SubmissionResult | null
  updateDraft: (patch: Partial<FarmerReportDraft>) => void
  setSpecies: (species: Species) => void
  toggleSymptom: (id: string) => void
  setResult: (result: SubmissionResult | null) => void
  resetDraft: () => void
}

const ReportContext = createContext<ReportContextValue | null>(null)

export function ReportProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<FarmerReportDraft>(loadDraft)
  const [result, setResultState] = useState<SubmissionResult | null>(null)

  const value = useMemo<ReportContextValue>(() => {
    const persist = (next: FarmerReportDraft) => {
      setDraft(next)
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Storage quota exceeded (e.g. a very large photo) — keep the
        // draft in memory so the current session still works, just
        // without cross-refresh persistence for this update.
      }
    }

    return {
      draft,
      result,
      updateDraft: (patch) => persist({ ...draft, ...patch }),
      setSpecies: (species) =>
        persist({
          ...draft,
          species,
          symptoms: draft.species === species ? draft.symptoms : [],
          affectedCount: species === 'poultry' ? Math.max(draft.affectedCount, 1) : draft.affectedCount,
        }),
      toggleSymptom: (id) => {
        const selected = draft.symptoms.includes(id)
          ? draft.symptoms.filter((item) => item !== id)
          : [...draft.symptoms, id]
        persist({ ...draft, symptoms: selected })
      },
      setResult: (next) => setResultState(next),
      resetDraft: () => {
        persist(DEFAULT_DRAFT)
        setResultState(null)
      },
    }
  }, [draft, result])

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}

export function useFarmerReport() {
  const ctx = useContext(ReportContext)
  if (!ctx) {
    throw new Error('useFarmerReport must be used inside ReportProvider')
  }
  return ctx
}
