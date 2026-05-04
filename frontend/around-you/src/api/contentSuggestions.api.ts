import { apiRequest, jsonHeaders } from '@/api/http'
import type {
  ContentSuggestion,
  ContentSuggestionPayload,
  ContentSuggestionType,
} from '@/types/content-suggestion'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function createContentSuggestion(
  type: ContentSuggestionType,
  payload: ContentSuggestionPayload,
): Promise<ContentSuggestion> {
  return apiRequest<ContentSuggestion>('/suggestions', {
    method: 'POST',
    token: getToken(),
    headers: jsonHeaders(),
    body: JSON.stringify({ type, payload }),
  })
}

export function fetchPendingContentSuggestions(): Promise<ContentSuggestion[]> {
  return apiRequest<ContentSuggestion[]>('/admin/suggestions?status=pending', {
    token: getToken(),
  })
}

export function approveContentSuggestion(id: string): Promise<unknown> {
  return apiRequest(`/admin/suggestions/${id}/approve`, {
    method: 'POST',
    token: getToken(),
  })
}

export function rejectContentSuggestion(id: string, reason: string): Promise<ContentSuggestion> {
  return apiRequest<ContentSuggestion>(`/admin/suggestions/${id}/reject`, {
    method: 'POST',
    token: getToken(),
    headers: jsonHeaders(),
    body: JSON.stringify({ reason }),
  })
}
