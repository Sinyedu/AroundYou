import { computed, onMounted, ref, watch, type Ref } from 'vue'

import { fetchAttractions, fetchCities, fetchEvents } from '@/api/searchApi'
import { useGeolocationStore } from '@/stores/geolocation'
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
    coordinates: parseGpsPosition(event.gpsPosition),
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
    coordinates: parseGpsPosition(attraction.gpsPosition),
    type: 'attraction',
    date: toDateOnly(attraction.updateAt),
    rating: attraction.rating ?? 0,
    reviews: 0,
    image: attraction.heroImage,
    categories: attraction.slugArray ?? [],
  }
}

const mapCity = (city: City): SearchResult => {
  return {
    id: city._id,
    title: city.name || 'Ukendt',
    description: city.description || '',
    location: city.name || 'Ukendt',
    coordinates: parseGpsPosition(city.gpsPosition),
    type: 'city',
    date: '',
    rating: city.rating ?? 0,
    reviews: 0,
    image: city.heroImage || '',
    categories: [],
  }
}

export const useSearchResults = (filters: Ref<SearchFilters>) => {
  const geolocationStore = useGeolocationStore()
  const results = ref<SearchResult[]>([])
  const largestCityResults = ref<SearchResult[]>([])
  const cityCoordinates = ref<Record<string, Coordinates>>({})
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

      cityCoordinates.value = cities.reduce<Record<string, Coordinates>>((accumulator, city) => {
        if (!city.name) {
          return accumulator
        }

        const parsed = parseGpsPosition(city.gpsPosition)
        if (!parsed) {
          return accumulator
        }

        accumulator[city.name.toLowerCase()] = parsed
        return accumulator
      }, {})

      const sortedCities = [...cities].sort(
        (first, second) => (second.population ?? 0) - (first.population ?? 0),
      )

      largestCityResults.value = sortedCities.slice(0, 6).map((city) => mapCity(city))

      results.value = [
        ...sortedCities.map((city) => mapCity(city)),
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

    if (!geolocationStore.coords && !geolocationStore.loading && !geolocationStore.error) {
      geolocationStore.getLocation()
    }
  })

  const hasActiveFilters = computed(() => {
    return (
      filters.value.location.trim().length > 0 ||
      filters.value.type !== 'all' ||
      filters.value.date.length > 0 ||
      filters.value.categories.length > 0
    )
  })

  const userCoordinates = computed<Coordinates | null>(() => {
    if (!geolocationStore.coords) {
      return null
    }

    return {
      lat: geolocationStore.coords.latitude,
      lng: geolocationStore.coords.longitude,
    }
  })

  const nearestExperienceResults = computed(() => {
    const coords = userCoordinates.value

    if (!coords) {
      return []
    }

    return results.value
      .filter((item) => item.type !== 'city' && item.coordinates)
      .map((item) => ({
        item,
        distance: distanceKm(coords, item.coordinates!),
      }))
      .sort((first, second) => first.distance - second.distance)
      .slice(0, 6)
      .map(({ item }) => item)
  })

  const visibleResults = computed(() => {
    if (hasActiveFilters.value) {
      return results.value
    }

    if (userCoordinates.value) {
      return nearestExperienceResults.value
    }

    return largestCityResults.value
  })

  const isUsingLocationResults = computed(() => !hasActiveFilters.value && Boolean(userCoordinates.value))
  const isShowingLargestCities = computed(() => !hasActiveFilters.value && !userCoordinates.value)

  watch(
    () => geolocationStore.error,
    (error) => {
      if (error) {
        console.info('Search page falls back to largest cities because location was unavailable.')
      }
    },
  )

  const filteredResults = computed(() => {
    const query = filters.value.location.trim().toLowerCase()
    const hasQuery = query.length > 0

    return visibleResults.value.filter((item) => {
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
    cityCoordinates,
    locationOptions,
    categoryOptions,
    isUsingLocationResults,
    isShowingLargestCities,
    isLoading,
    errorMessage,
    fetchResults,
  }
}
