import { API_BASE_URL } from '@/constants/config'

type RequestOptions = RequestInit & {
  token?: string | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed for ${path}`

    try {
      const error = (await response.json()) as { message?: string }
      message = error.message ?? message
    } catch {
      message = `${message}: ${response.status}`
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' }
}
