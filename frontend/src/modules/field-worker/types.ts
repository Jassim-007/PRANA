export const SPECIES = [
  'cattle',
  'buffalo',
  'goat',
  'sheep',
  'poultry',
] as const

export type Species = (typeof SPECIES)[number]

export const EVENT_TYPES = [
  'illness',
  'death',
  'recovery',
  'production_drop',
  'vaccination',
  'treatment',
  'animal_movement',
  'new_animal',
  'unusual_observation',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export const SYMPTOMS = [
  'fever',
  'mouth_lesions',
  'lameness',
  'nasal_discharge',
  'reduced_appetite',
  'diarrhea',
  'coughing',
  'swelling',
  'discharge',
  'sudden_weakness',
] as const

export type Symptom = (typeof SYMPTOMS)[number]

export type Farm = {
  id: string
  name: string
  owner_name?: string
  village?: string
  block?: string
  district?: string
  latitude?: number | null
  longitude?: number | null
  species?: string
  animal_count?: number
}

export type HealthEvent = {
  id: string
  farm_id: string
  source: string
  species: string
  event_type: string
  symptoms?: string[]
  affected_count?: number
  death_count?: number
  duration_days?: number | null
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
  status?: string
  created_at?: string
}

export type HealthEventCreate = {
  farm_id: string
  source: 'field_worker'
  species: string
  event_type: string
  symptoms: string[]
  affected_count: number
  death_count: number
  duration_days?: number
  latitude?: number
  longitude?: number
  notes?: string
}

export type HealthEventCreateResponse = {
  id: string
  status: string
  message?: string
  created_at?: string
}

export type VisitStatus = 'not_started' | 'in_progress' | 'submitted'

export type VisitFormState = {
  species: string
  event_type: EventType
  symptoms: string[]
  affected_count: number
  death_count: number
  duration_days: string
  notes: string
  latitude: string
  longitude: string
  farmer_self_treatment: boolean
  government_vet_consulted: boolean
  private_vet_consulted: boolean
  treatment_unsuccessful: boolean
}
