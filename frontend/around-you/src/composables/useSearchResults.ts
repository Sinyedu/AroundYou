import { computed, onMounted, ref, type Ref } from 'vue'

import { fetchAttractions, fetchCities, fetchEvents } from '@/api/searchApi'
import type {
  ApiAttraction,
  ApiEvent,
  City,
  Coordinates,
  SearchFilters,
  SearchResult,
} from '@/types/search'

const parseGpsPosition = (value?: string): Coordinates | null => {
  if (!value) {
    return null
  }
  const [latRaw, lngRaw] = value.split(',').map((part) => part.trim())
  const lat = Number(latRaw)
  const lng = Number(lngRaw)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }
  return { lat, lng }
}

const toRadians = (value: number) => (value * Math.PI) / 180

const distanceKm = (from: Coordinates, to: Coordinates) => {
  const earthRadius = 6371
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}

const getNearestCityName = (gpsPosition: string | undefined, cities: City[]) => {
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

const toDateOnly = (value?: string) => {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toISOString().slice(0, 10)
}

const mapEvent = (event: ApiEvent, cities: City[]): SearchResult => {
  return {
    id: event._id,
    title: event.name,
    description: event.description,
    location: getNearestCityName(event.gpsPosition, cities),
    type: 'event',
    date: toDateOnly(event.startDate),
    rating: event.rating ?? 0,
    reviews: 0,
    image: event.heroImage,
    categories: event.slugArray ?? [],
  }
}

const mapAttraction = (attraction: ApiAttraction, cities: City[]): SearchResult => {
  return {
    id: attraction._id,
    title: attraction.name,
    description: attraction.description,
    location: getNearestCityName(attraction.gpsPosition, cities),
    type: 'attraction',
    date: toDateOnly(attraction.updateAt),
    rating: attraction.rating ?? 0,
    reviews: 0,
    image: attraction.heroImage,
    categories: attraction.slugArray ?? [],
  }
}

export const useSearchResults = (filters: Ref<SearchFilters>) => {
  const results = ref<SearchResult[]>([])
  const isLoading = ref(true)
  const errorMessage = ref('')

  const fetchResults = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const [events, attractions, cities] = await Promise.all([
        fetchEvents(),
        fetchAttractions(),
        fetchCities(),
      ])

      results.value = [
        ...events.map((event) => mapEvent(event, cities)),
        ...attractions.map((attraction) => mapAttraction(attraction, cities)),
      ]
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error.'
      errorMessage.value = message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchResults()
  })

  const filteredResults = computed(() => {
    const query = filters.value.location.trim().toLowerCase()
    const hasQuery = query.length > 0

    return results.value.filter((item) => {
      const matchesLocation = hasQuery ? item.location.toLowerCase().includes(query) : true
      const matchesType = filters.value.type === 'all' || item.type === filters.value.type
      const matchesDate = filters.value.date ? item.date === filters.value.date : true
      const matchesCategories = filters.value.categories.length
        ? filters.value.categories.some((category) => item.categories.includes(category))
        : true

      return matchesLocation && matchesType && matchesDate && matchesCategories
    })
  })

  const locationOptions = computed(() => {
    const unique = new Set(
      results.value
        .map((item) => item.location)
        .filter((location) => location && location !== 'Ukendt'),
    )
    return Array.from(unique).sort()
  })

  const categoryOptions = computed(() => {
    const unique = new Set(results.value.flatMap((item) => item.categories))
    return Array.from(unique).sort()
  })

  return {
    results,
    filteredResults,
    locationOptions,
    categoryOptions,
    isLoading,
    errorMessage,
    fetchResults,
  }
}
