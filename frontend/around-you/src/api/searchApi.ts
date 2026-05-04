import { apiRequest } from '@/api/http'
import type { ApiAttraction } from '@/types/search-api-attraction'
import type { ApiEvent } from '@/types/search-api-event'
import type { City } from '@/types/search-city'

export const fetchEvents = () => apiRequest<ApiEvent[]>('/events')

export const fetchAttractions = () => apiRequest<ApiAttraction[]>('/attractions')

export const fetchCities = () => apiRequest<City[]>('/city')
