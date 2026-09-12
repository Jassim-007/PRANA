import type {
  AiAnalyzeResponse,
  HealthEventCreateRequest,
  HealthEventCreateResponse,
} from '../types'
import { farmerApiRequest } from './client'

export function createHealthEvent(payload: HealthEventCreateRequest) {
  return farmerApiRequest<HealthEventCreateResponse>('/api/health-events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function analyzeHealthEvent(payload: {
  species: string
  symptoms: string[]
  affected_count: number
  death_count: number
}) {
  return farmerApiRequest<AiAnalyzeResponse>('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
