import type { ApiAttraction, ApiEvent, City } from '../types/search'
import { apiRequest } from '@/api/http'

export const fetchEvents = () => apiRequest<ApiEvent[]>('/events')

export const fetchAttractions = () => apiRequest<ApiAttraction[]>('/attractions')

export const fetchCities = () => apiRequest<City[]>('/city')
