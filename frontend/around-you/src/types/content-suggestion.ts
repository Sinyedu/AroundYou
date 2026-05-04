export type ContentSuggestionType = 'attraction' | 'event' | 'city'
export type ContentSuggestionStatus = 'pending' | 'approved' | 'rejected'

export type ContentSuggestionPayload = Record<string, string | number | boolean | string[]>

export type ContentSuggestion = {
  _id: string
  type: ContentSuggestionType
  status: ContentSuggestionStatus
  payload: ContentSuggestionPayload
  submittedBy: string
  submittedByName: string
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}
