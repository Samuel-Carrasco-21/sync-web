const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

export class ApiError extends Error {
  code: string
  status: number
  details: Record<string, unknown>

  constructor(message: string, options: { code?: string; status: number; details?: Record<string, unknown> }) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code ?? 'ERROR'
    this.status = options.status
    this.details = options.details ?? {}
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  }

  let message = 'Ocurrió un error inesperado.'
  let code = 'ERROR'
  let details: Record<string, unknown> = {}
  try {
    const body = await response.json()
    if (body?.error) {
      message = body.error.message ?? message
      code = body.error.code ?? code
      details = body.error.details ?? {}
    }
  } catch {
    // non-JSON error body; keep the generic Spanish message
  }
  throw new ApiError(message, { code, status: response.status, details })
}

export function apiGet<T>(path: string): Promise<T> {
  return fetch(`${BASE_URL}${path}`).then((r) => handleResponse<T>(r))
}

export function apiPostJson<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((r) => handleResponse<T>(r))
}

export function apiPatchJson<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((r) => handleResponse<T>(r))
}

export function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  return fetch(`${BASE_URL}${path}`, { method: 'POST', body: formData }).then((r) =>
    handleResponse<T>(r),
  )
}

export function apiPost<T>(path: string): Promise<T> {
  return fetch(`${BASE_URL}${path}`, { method: 'POST' }).then((r) => handleResponse<T>(r))
}

export function mediaDownloadUrl(mediaAssetId: string): string {
  return `${BASE_URL}/media/${mediaAssetId}/original`
}
