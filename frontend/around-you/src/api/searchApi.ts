import { apiGetCached } from '@/api/http'
import type { ApiAttraction } from '@/types/search-api-attraction'
import type { ApiEvent } from '@/types/search-api-event'
import type { City } from '@/types/search-city'

export const fetchEvents = () => apiGetCached<ApiEvent[]>('/events')

export const fetchAttractions = () => apiGetCached<ApiAttraction[]>('/attractions')

export const fetchCities = () => apiGetCached<City[]>('/city')
