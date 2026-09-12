const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type ApiErrorBody = {
  detail?: string
}

export async function farmerApiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const text = await response.text()
  const data = text ? (JSON.parse(text) as T | ApiErrorBody) : null

  if (!response.ok) {
    const detail =
      data && typeof data === 'object' && 'detail' in data && data.detail
        ? String(data.detail)
        : `Request failed (${response.status})`
    throw new Error(detail)
  }

  return data as T
}
