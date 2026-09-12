import type {
  Farm,
  HealthEvent,
  HealthEventCreate,
  HealthEventCreateResponse,
} from './types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:8000'

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string }
    if (typeof body.detail === 'string' && body.detail.length > 0) {
      return body.detail
    }
  } catch {
    // Ignore JSON parse failures and fall back to status text.
  }
  return response.statusText || `Request failed (${response.status})`
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as T
}

function asFarmList(payload: unknown): Farm[] {
  if (Array.isArray(payload)) {
    return payload as Farm[]
  }
  if (payload && typeof payload === 'object' && 'farms' in payload) {
    const farms = (payload as { farms: unknown }).farms
    return Array.isArray(farms) ? (farms as Farm[]) : []
  }
  return []
}

function asEventList(payload: unknown): HealthEvent[] {
  if (Array.isArray(payload)) {
    return payload as HealthEvent[]
  }
  if (payload && typeof payload === 'object' && 'events' in payload) {
    const events = (payload as { events: unknown }).events
    return Array.isArray(events) ? (events as HealthEvent[]) : []
  }
  return []
}

export async function getAssignedFarms(fieldWorkerId: string): Promise<Farm[]> {
  const payload = await requestJson<unknown>(
    `/api/field-workers/${encodeURIComponent(fieldWorkerId)}/farms`,
  )
  return asFarmList(payload)
}

export async function getFarmHealthEvents(farmId: string): Promise<HealthEvent[]> {
  const payload = await requestJson<unknown>(
    `/api/farms/${encodeURIComponent(farmId)}/health-events`,
  )
  return asEventList(payload)
}

export async function createFieldWorkerHealthEvent(
  payload: HealthEventCreate,
): Promise<HealthEventCreateResponse> {
  return requestJson<HealthEventCreateResponse>('/api/health-events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export { API_BASE }
