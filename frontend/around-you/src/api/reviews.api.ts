const API_BASE_URL = 'http://localhost:4000/api'

export type ReviewTargetType = 'city' | 'event' | 'attraction'

export interface ReviewItem {
  _id: string
  targetId: string
  targetType: ReviewTargetType
  author: string
  title: string
  description: string
  rating: number
  likes: number
  likedBy: string[]
  edited: boolean
  image: string
  createdAt: string
}

export interface CreateReviewPayload {
  targetId: string
  targetType: ReviewTargetType
  title: string
  description: string
  rating: number
  image?: string
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

export async function getReviewsByTarget(targetId: string): Promise<ReviewItem[]> {
  const res = await fetch(`${API_BASE_URL}/reviews/target/${encodeURIComponent(targetId)}`)
  if (!res.ok) throw new Error('Kunne ikke hente reviews')
  return res.json() as Promise<ReviewItem[]>
}

export async function createReview(payload: CreateReviewPayload): Promise<ReviewItem> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Kunne ikke oprette review')
  }
  return res.json() as Promise<ReviewItem>
}

export async function likeReview(reviewId: string): Promise<ReviewItem> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/reviews/${encodeURIComponent(reviewId)}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error('Kunne ikke like review')
  return res.json() as Promise<ReviewItem>
}

export async function reportReview(reviewId: string, reason: string): Promise<ReviewItem> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/reviews/${encodeURIComponent(reviewId)}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ reason }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Kunne ikke rapportere review')
  }

  return res.json() as Promise<ReviewItem>
}

export interface UpdateReviewPayload {
  title?: string
  description?: string
  rating?: number
  image?: string
}

export async function updateReview(reviewId: string, payload: UpdateReviewPayload): Promise<ReviewItem> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Kunne ikke opdatere review')
  }
  return res.json() as Promise<ReviewItem>
}
