import type {
  AttractionPayload,
  CityPayload,
  EventPayload,
  UploadedImageResponse,
} from '@/types/content'

const API_BASE_URL = 'http://localhost:4000/api'

const authHeaders = (token: string | null, includeJsonContentType = true) => {
  return {
    ...(includeJsonContentType ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const toBackendError = async (response: Response, fallbackMessage: string) => {
  try {
    const errorBody = await response.json()
    const backendMessage =
      typeof errorBody?.message === 'string' ? errorBody.message : fallbackMessage
    return new Error(backendMessage)
  } catch {
    return new Error(fallbackMessage)
  }
}

export const uploadImageFile = async (file: File, token: string | null) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    headers: authHeaders(token, false),
    body: formData,
  })

  if (!response.ok) {
    throw await toBackendError(response, `Image upload failed: ${response.status}`)
  }

  const body = (await response.json()) as UploadedImageResponse

  if (!body.imageUrl) {
    throw new Error('Image upload returned no image URL')
  }

  return body.imageUrl
}

const postJson = async <T>(url: string, body: T, token: string | null) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw await toBackendError(response, `Request failed: ${response.status}`)
  }

  return response.json()
}

export const createEvent = (payload: EventPayload, token: string | null) => {
  return postJson(`${API_BASE_URL}/events`, payload, token)
}

export const createAttraction = (payload: AttractionPayload, token: string | null) => {
  return postJson(`${API_BASE_URL}/attractions`, payload, token)
}

export const createCity = (payload: CityPayload, token: string | null) => {
  return postJson(`${API_BASE_URL}/city`, payload, token)
}
