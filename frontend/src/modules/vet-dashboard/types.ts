export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

export type EventSource = 'farmer' | 'field_worker' | 'vet'

export type FeedbackDecision = 'confirmed' | 'rejected' | 'needs_followup'

export interface HealthEvent {
  id: string
  farm_id: string
  farm_name?: string
  source: EventSource | string
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
  possible_disease?: string | null
  risk_level?: RiskLevel | string | null
  risk_score?: number | null
  ai_confidence?: number | null
  zoonotic_flag?: boolean | null
  explanation?: string[] | string | null
  location_label?: string | null
}

export interface Farm {
  id: string
  name?: string
  village?: string
  block?: string
  district?: string
  latitude?: number | null
  longitude?: number | null
  species?: string
  animal_count?: number
}

export interface AlertItem {
  id: string
  type?: string
  severity?: string
  title?: string
  message?: string
  status?: string
  created_at?: string
  event_id?: string
  cluster_id?: string
  zoonotic?: boolean
  risk_level?: RiskLevel | string
}

export interface ClusterItem {
  id: string
  disease?: string
  latitude?: number | null
  longitude?: number | null
  radius_km?: number | null
  event_count?: number
  affected_count?: number
  risk_level?: RiskLevel | string | null
}

export interface DashboardSummary {
  total_farms?: number
  active_events?: number
  total_events?: number
  critical_events?: number
  high_risk_events?: number
  active_clusters?: number
  active_alerts?: number
  affected_animals?: number
  deaths?: number
}

export interface TrendPoint {
  date: string
  event_count: number
}

export interface FeedbackPayload {
  vet_id: string
  decision: FeedbackDecision
  notes: string
  action_taken: string
}
