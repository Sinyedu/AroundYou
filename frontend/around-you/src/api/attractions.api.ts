import type {
  AttractionApiItem,
  CityApiItem,
  EventApiItem,
  FamilyExperienceCard,
  LargestCityCard,
  NatureExperienceCard,
  NatureExperienceSource,
  NearbyLocationContent,
} from '@/types/attractions'
import type { Coordinates } from '@/types/coordinates'

const API_BASE_URL = 'http://localhost:4000/api'

export const DEFAULT_NEARBY_LOCATION_DESCRIPTION =
  'Gå på opdagelse i spændende oplevelser tæt på din egen lokation, hvor natur, kultur, attraktioner og restauranter er lige inden for rækkevidde. Oplev alt fra populære seværdigheder og hyggelige udflugtsmål til lokale favoritter og skjulte perler lige i nærheden.'

type AxisDirection = 'N' | 'S' | 'E' | 'W'

function toSignedCoordinate(value: number, direction?: AxisDirection): number {
  if (!direction) {
    return value
  }

  return direction === 'S' || direction === 'W' ? -Math.abs(value) : Math.abs(value)
}

function convertDmsToDecimal(
  degrees: number,
  minutes = 0,
  seconds = 0,
  direction?: AxisDirection,
): number {
  const decimal = Math.abs(degrees) + minutes / 60 + seconds / 3600

  if (degrees < 0 && !direction) {
    return -decimal
  }

  return toSignedCoordinate(decimal, direction)
}

function isValidCoordinates(latitude: number, longitude: number): boolean {
  return !Number.isNaN(latitude) && !Number.isNaN(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
}

function parseDecimalCoordinates(normalizedGpsPosition: string): Coordinates | null {
  const matches = normalizedGpsPosition.match(/-?\d+(?:\.\d+)?/g)

  if (!matches || matches.length < 2) {
    return null
  }

  const latitude = Number(matches[0])
  const longitude = Number(matches[1])

  if (!isValidCoordinates(latitude, longitude)) {
    return null
  }

  return { latitude, longitude }
}

function parseDirectionalCoordinates(normalizedGpsPosition: string): Coordinates | null {
  const matches = [...normalizedGpsPosition.matchAll(/(\d+(?:\.\d+)?)\s*([NSEW])/gi)]

  if (matches.length < 2) {
    return null
  }

  let latitude: number | null = null
  let longitude: number | null = null

  for (const match of matches) {
    const value = Number(match[1])
    const directionValue = match[2]

    if (!directionValue) {
      continue
    }

    const direction = directionValue.toUpperCase() as AxisDirection

    if (direction === 'N' || direction === 'S') {
      latitude = toSignedCoordinate(value, direction)
    }

    if (direction === 'E' || direction === 'W') {
      longitude = toSignedCoordinate(value, direction)
    }
  }

  if (latitude === null || longitude === null || !isValidCoordinates(latitude, longitude)) {
    return null
  }

  return { latitude, longitude }
}

function parseDmsCoordinates(normalizedGpsPosition: string): Coordinates | null {
  const matches = [...normalizedGpsPosition.matchAll(/(\d{1,3})[^\dA-Z]+(\d{1,2})(?:[^\dA-Z]+(\d{1,2}(?:\.\d+)?))?[^A-Z\d]*([NSEW])/gi)]

  if (matches.length < 2) {
    return null
  }

  let latitude: number | null = null
  let longitude: number | null = null

  for (const match of matches) {
    const degrees = Number(match[1])
    const minutes = Number(match[2])
    const seconds = match[3] ? Number(match[3]) : 0
    const directionValue = match[4]

    if (!directionValue) {
      continue
    }

    const direction = directionValue.toUpperCase() as AxisDirection
    const decimal = convertDmsToDecimal(degrees, minutes, seconds, direction)

    if (direction === 'N' || direction === 'S') {
      latitude = decimal
    }

    if (direction === 'E' || direction === 'W') {
      longitude = decimal
    }
  }

  if (latitude === null || longitude === null || !isValidCoordinates(latitude, longitude)) {
    return null
  }

  return { latitude, longitude }
}

function parseGpsPosition(gpsPosition: string): Coordinates | null {
  const normalizedGpsPosition = gpsPosition
    .trim()
    .replace(/,/g, '.')
    .replace(/[º°]/g, ' ')
    .replace(/[′']/g, ' ')
    .replace(/[″"]/g, ' ')
    .replace(/\s+/g, ' ')

  return (
    parseDmsCoordinates(normalizedGpsPosition) ??
    parseDirectionalCoordinates(normalizedGpsPosition) ??
    parseDecimalCoordinates(normalizedGpsPosition)
  )
}

function yourDistanceInKm(from: Coordinates, to: Coordinates): number {
  const earthRadiusKm = 6371
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180
  const fromLatitudeRadians = (from.latitude * Math.PI) / 180
  const toLatitudeRadians = (to.latitude * Math.PI) / 180

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLatitudeRadians) *
      Math.cos(toLatitudeRadians) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`)
  }

  return response.json() as Promise<T>
}

function normalizeCitySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/æ/g, 'a')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function getCityByName(cityName: string): Promise<CityApiItem | null> {
  const response = await fetch(`${API_BASE_URL}/city/name/${encodeURIComponent(cityName)}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Request failed for /city/name/${cityName}`)
  }

  return response.json() as Promise<CityApiItem>
}

export async function getNearbyLocationContent(
  coords: Coordinates,
  limit = 4,
): Promise<NearbyLocationContent> {
  const [attractions, cities] = await Promise.all([
    fetchJson<AttractionApiItem[]>('/attractions'),
    fetchJson<CityApiItem[]>('/city'),
  ])

  const nearestCity = cities
    .map((city) => {
      const cityCoords = parseGpsPosition(city.gpsPosition)

      if (!cityCoords) {
        return null
      }

      return {
        city,
        distanceKm: yourDistanceInKm(coords, cityCoords),
      }
    })
    .filter((entry): entry is { city: CityApiItem; distanceKm: number } => entry !== null)
    .sort((first, second) => first.distanceKm - second.distanceKm)[0]

  const nearbyAttractions = attractions
    .map((attraction) => {
      const attractionCoords = parseGpsPosition(attraction.gpsPosition)

      if (!attractionCoords) {
        return null
      }

      return {
        attraction,
        distanceKm: yourDistanceInKm(coords, attractionCoords),
      }
    })
    .filter(
      (entry): entry is { attraction: AttractionApiItem; distanceKm: number } => entry !== null,
    )
    .sort((first, second) => first.distanceKm - second.distanceKm)
    .slice(0, limit)
    .map(({ attraction, distanceKm }) => ({
      id: attraction._id,
      name: attraction.name,
      description: attraction.description,
      image: attraction.heroImage,
      rating: attraction.rating,
      reviews: 0,
      tags: attraction.slugArray.slice(0, 3),
      metaText: `${distanceKm.toFixed(1)} km væk`,
    }))

  return {
    locationName: nearestCity?.city.name ?? 'din lokation',
    locationDescription: nearestCity?.city.description ?? DEFAULT_NEARBY_LOCATION_DESCRIPTION,
    attractions: nearbyAttractions,
  }
}

export async function getLargestCities(limit = 4): Promise<LargestCityCard[]> {
  const cities = await fetchJson<CityApiItem[]>('/city')

  return cities
    .sort((first, second) => second.population - first.population)
    .slice(0, limit)
    .map((city) => ({
      id: city._id,
      name: city.name,
      description: city.description,
      image: city.heroImage,
      rating: city.rating,
      reviews: 0,
      tags: [city.region, city.commune, 'Storby'].filter(Boolean).slice(0, 3),
      metaText: `${city.population.toLocaleString('da-DK')} indbyggere`,
      href: `/city/${normalizeCitySlug(city.name)}`,
    }))
}

async function getExperiencesBySlug(slug: string, limit = 4): Promise<NatureExperienceCard[]> {
  const [attractions, events] = await Promise.all([
    fetchJson<AttractionApiItem[]>('/attractions'),
    fetchJson<EventApiItem[]>('/events'),
  ])

  const entries: NatureExperienceSource[] = [
    ...attractions.map((attraction) => ({ ...attraction, type: 'Seværdighed' as const })),
    ...events.map((event) => ({ ...event, type: 'Event' as const })),
  ]

  return entries
    .filter((entry) => entry.slugArray.some((entrySlug) => entrySlug.toLowerCase() === slug.toLowerCase()))
    .sort((first, second) => second.rating - first.rating)
    .slice(0, limit)
    .map((entry) => ({
      id: entry._id,
      name: entry.name,
      description: entry.description,
      image: entry.heroImage,
      rating: entry.rating,
      reviews: 0,
      tags: entry.slugArray,
      metaText: entry.type,
    }))
}

export async function getNatureExperiences(limit = 4): Promise<NatureExperienceCard[]> {
  return getExperiencesBySlug('natur', limit)
}

export async function getFamilyExperiences(limit = 4): Promise<FamilyExperienceCard[]> {
  return getExperiencesBySlug('familie', limit)
}