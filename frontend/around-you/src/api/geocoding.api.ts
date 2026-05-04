import { apiRequest } from '@/api/http'

type ReverseGeocodeResponse = {
  displayName: string
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
