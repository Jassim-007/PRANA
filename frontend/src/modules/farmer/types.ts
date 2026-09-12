export type Species = 'cattle' | 'buffalo' | 'goat' | 'sheep' | 'poultry'

export type EventType = 'illness'

export type HealthEventCreateRequest = {
  farm_id: string
  source: 'farmer'
  species: Species
  event_type: EventType
  symptoms: string[]
  affected_count: number
  death_count: number
  duration_days: number
  latitude: number
  longitude: number
  notes?: string
}

export type HealthEventCreateResponse = {
  id: string
  status: string
  message?: string
  created_at?: string
  prediction?: AiPrediction
  risk?: AiRisk
  zoonotic?: AiZoonotic
  explanation?: string[]
}

export type AiPrediction = {
  disease: string
  confidence: number
}

export type AiRisk = {
  score: number
  level: string
}

export type AiZoonotic = {
  flag: boolean
}

export type AiAnalyzeResponse = {
  prediction: AiPrediction
  risk: AiRisk
  zoonotic: AiZoonotic
  explanation: string[]
}

export type FarmerReportDraft = {
  farmId: string
  species: Species | null
  symptoms: string[]
  affectedCount: number
  deathCount: number
  durationDays: number
  latitude: number | null
  longitude: number | null
  notes: string
  photoDataUrl: string | null
}

export type SubmissionResult = {
  event: HealthEventCreateResponse
  analysis: AiAnalyzeResponse | null
}
