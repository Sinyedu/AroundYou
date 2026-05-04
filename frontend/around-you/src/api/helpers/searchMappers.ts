import type { ApiAttraction } from '@/types/search-api-attraction'
import type { ApiEvent } from '@/types/search-api-event'
import type { City } from '@/types/search-city'
import type { SearchResult } from '@/types/search-result'
import { toDateOnly } from '@/utils/date'
import { distanceKm, parseGpsPosition } from '@/utils/geo'

function getNearestCityName(gpsPosition: string | undefined, cities: City[]): string {
  const coords = parseGpsPosition(gpsPosition)

  if (!coords || !cities.length) {
    return 'Ukendt'
  }

  let nearest = cities[0]
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const city of cities) {
    const cityCoords = parseGpsPosition(city.gpsPosition)

    if (!cityCoords) {
      continue
    }

    const km = distanceKm(coords, cityCoords)

    if (km < nearestDistance) {
      nearestDistance = km
      nearest = city
    }
  }

  return nearest?.name || 'Ukendt'
}

export function mapEventToSearchResult(event: ApiEvent, cities: City[]): SearchResult {
  return {
    id: event._id,
    title: event.name,
    location: getNearestCityName(event.gpsPosition, cities),
    type: 'event',
    date: toDateOnly(event.startDate),
    rating: event.rating ?? 0,
    reviews: 0,
    image: event.heroImage,
    categories: event.slugArray ?? [],
  }
}

export function mapAttractionToSearchResult(
  attraction: ApiAttraction,
  cities: City[],
): SearchResult {
  return {
    id: attraction._id,
    title: attraction.name,
    location: getNearestCityName(attraction.gpsPosition, cities),
    type: 'attraction',
    date: toDateOnly(attraction.updateAt),
    rating: attraction.rating ?? 0,
    reviews: 0,
    image: attraction.heroImage,
    categories: attraction.slugArray ?? [],
  }
}
