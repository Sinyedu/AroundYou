import { apiRequest } from '@/api/http'

type ReverseGeocodeResponse = {
  displayName: string
}

type ForwardGeocodeResponse = {
  latitude: number
  longitude: number
  displayName: string
}

export async function getGeocodedCoordinates(
  address: string | null,
  city: string,
): Promise<ForwardGeocodeResponse> {
  const query = new URLSearchParams({ city })

  if (address?.trim()) {
    query.set('address', address.trim())
  }

  return apiRequest<ForwardGeocodeResponse>(`/geocode?${query}`)
}

export async function getReverseGeocodedAddress(
  latitude: number,
  longitude: number,
): Promise<string> {
  const query = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  })
  const response = await apiRequest<ReverseGeocodeResponse>(`/geocode/reverse?${query}`)

  return response.displayName
}
