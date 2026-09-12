import type {
  AlertItem,
  ClusterItem,
  DashboardSummary,
  Farm,
  FeedbackPayload,
  HealthEvent,
  TrendPoint,
} from './types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    ...init,
  })

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = { detail: text }
    }
  }

  if (!response.ok) {
    const detail =
      data && typeof data === 'object' && 'detail' in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${response.status})`
    throw new ApiError(detail, response.status)
  }

  return data as T
}

function asList<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object') {
    const value = (data as Record<string, unknown>)[key]
    if (Array.isArray(value)) return value as T[]
  }
  return []
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const data = await request<unknown>('/api/dashboard')
  if (data && typeof data === 'object' && 'summary' in data) {
    return ((data as { summary: DashboardSummary }).summary) ?? {}
  }
  return (data as DashboardSummary) ?? {}
}

export async function fetchDashboardTrends(): Promise<TrendPoint[]> {
  const data = await request<unknown>('/api/dashboard/trends')
  return asList<TrendPoint>(data, 'trends')
}

export async function fetchHealthEvents(params?: Record<string, string>): Promise<HealthEvent[]> {
  const search = new URLSearchParams(
    Object.fromEntries(Object.entries(params ?? {}).filter(([, value]) => value)),
  )
  const query = search.toString() ? `?${search.toString()}` : ''
  const data = await request<unknown>(`/api/health-events${query}`)
  return asList<HealthEvent>(data, 'events')
}

export async function fetchHealthEvent(id: string): Promise<HealthEvent> {
  return request<HealthEvent>(`/api/health-events/${id}`)
}

export async function fetchFarm(id: string): Promise<Farm> {
  const data = await request<unknown>(`/api/farms/${id}`)
  if (data && typeof data === 'object' && 'farm' in data) {
    return (data as { farm: Farm }).farm
  }
  return data as Farm
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const data = await request<unknown>('/api/alerts')
  return asList<AlertItem>(data, 'alerts')
}

export async function fetchClusters(): Promise<ClusterItem[]> {
  const data = await request<unknown>('/api/clusters')
  return asList<ClusterItem>(data, 'clusters')
}

export async function submitEventFeedback(id: string, payload: FeedbackPayload) {
  return request<{ status: string; message: string }>(`/api/health-events/${id}/feedback`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
