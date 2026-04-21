import type { ApiAttraction, ApiEvent, City } from "./types"

const API_BASE_URL = "http://localhost:4000/api"

const fetchJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
    }
    return response.json() as Promise<T>
}

export const fetchEvents = () =>
    fetchJson<ApiEvent[]>(`${API_BASE_URL}/events`)

export const fetchAttractions = () =>
    fetchJson<ApiAttraction[]>(`${API_BASE_URL}/attractions`)

export const fetchCities = () =>
    fetchJson<City[]>(`${API_BASE_URL}/city`)
    