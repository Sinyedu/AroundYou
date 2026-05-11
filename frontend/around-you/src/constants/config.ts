const DEFAULT_API_BASE_URL = 'http://localhost:4000/api'
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (import.meta.env.PROD && !configuredApiBaseUrl) {
  throw new Error('Missing VITE_API_BASE_URL for production build')
}

export const API_BASE_URL = (configuredApiBaseUrl ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')

export const USER_API_URL = `${API_BASE_URL}/user`
