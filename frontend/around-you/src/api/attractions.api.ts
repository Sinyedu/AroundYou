import type { AttractionApiItem } from '@/types/attraction-api-item'
import type { CityApiItem } from '@/types/city-api-item'
import type { Coordinates } from '@/types/coordinates'
import type { EventApiItem } from '@/types/event-api-item'
import type { FamilyExperienceCard } from '@/types/family-experience-card'
import type { LargestCityCard } from '@/types/largest-city-card'
import type { NatureExperienceCard } from '@/types/nature-experience-card'
import type { NatureExperienceSource } from '@/types/nature-experience-source'
import type { NearbyLocationContent } from '@/types/nearby-location-content'
import { apiRequest } from '@/api/http'
import { distanceKm, parseGpsPosition } from '@/utils/geo'

export const DEFAULT_NEARBY_LOCATION_DESCRIPTION =
  'Gå på opdagelse i spændende oplevelser tæt på din egen lokation, hvor natur, kultur, attraktioner og restauranter er lige inden for rækkevidde. Oplev alt fra populære seværdigheder og hyggelige udflugtsmål til lokale favoritter og skjulte perler lige i nærheden.'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`)
  }
  return response.json() as Promise<T>
}

function parseGpsPosition(value?: string): Coordinates | null {
  if (!value) {
    return null
  }

  const [latitudeRaw, longitudeRaw] = value.split(',').map((part) => part.trim())
  const latitude = Number(latitudeRaw)
  const longitude = Number(longitudeRaw)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return { latitude, longitude }
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180
}

function distanceKm(from: Coordinates, to: Coordinates): number {
  const earthRadius = 6371
  const dLatitude = toRadians(to.latitude - from.latitude)
  const dLongitude = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)

  const a =
    Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2)

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function normalizedRating(entry: NatureExperienceSource): number {
  return typeof entry.rating === 'number' ? entry.rating : 0
}

function normalizeEntitySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'a')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getEventByIdentifier(eventIdentifier: string): Promise<EventApiItem | null> {
  if (!eventIdentifier.trim()) {
    return null
  }

  const events = await fetchJson<EventApiItem[]>('/events')
  const normalizedIdentifier = normalizeEntitySlug(decodeURIComponent(eventIdentifier))

  return (
    events.find(
      (event) =>
        event._id === eventIdentifier || normalizeEntitySlug(event.name) === normalizedIdentifier,
    ) ?? null
  )
}

export async function getCityByName(cityName: string): Promise<CityApiItem | null> {
  if (!cityName.trim()) {
    return null
  }

  const cities = await fetchJson<CityApiItem[]>('/city')
  const normalizedInput = normalizeEntitySlug(decodeURIComponent(cityName))

  return (
    cities.find(
      (city) => city._id === cityName || normalizeEntitySlug(city.name) === normalizedInput,
    ) ?? null
  )
}

function normalizeEntitySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'a')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getEventByIdentifier(eventIdentifier: string): Promise<EventApiItem | null> {
  if (!eventIdentifier.trim()) {
    return null
  }

  const events = await fetchJson<EventApiItem[]>('/events')
  const normalizedIdentifier = normalizeEntitySlug(decodeURIComponent(eventIdentifier))

  return (
    events.find(
      (event) =>
        event._id === eventIdentifier || normalizeEntitySlug(event.name) === normalizedIdentifier,
    ) ?? null
  )
}

export async function getCityByName(cityName: string): Promise<CityApiItem | null> {
  if (!cityName.trim()) {
    return null
  }

  const cities = await fetchJson<CityApiItem[]>('/city')
  const normalizedInput = normalizeEntitySlug(decodeURIComponent(cityName))

  return (
    cities.find(
      (city) => city._id === cityName || normalizeEntitySlug(city.name) === normalizedInput,
    ) ?? null
  )
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
        distanceKm: distanceKm(coords, cityCoords),
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
        distanceKm: distanceKm(coords, attractionCoords),
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
      rating: attraction.rating ?? 0,
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
      rating: city.rating ?? 0,
      reviews: 0,
      tags: [city.region, city.commune, 'Storby'].filter(Boolean).slice(0, 3),
      metaText: `${city.population.toLocaleString('da-DK')} indbyggere`,
      href: `/city/${city._id}`,
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
    .filter((entry) =>
      entry.slugArray.some((entrySlug: string) => entrySlug.toLowerCase() === slug.toLowerCase()),
    )
    .sort((first, second) => normalizedRating(second) - normalizedRating(first))
    .slice(0, limit)
    .map((entry) => ({
      id: entry._id,
      name: entry.name,
      description: entry.description,
      image: entry.heroImage,
      rating: entry.rating ?? 0,
      reviews: 0,
      tags: entry.slugArray,
      metaText: entry.type,
      href: entry.type === 'Event' ? `/event/${entry._id}` : undefined,
    }))
}

export async function getNatureExperiences(limit = 4): Promise<NatureExperienceCard[]> {
  return getExperiencesBySlug('natur', limit)
}

export async function getFamilyExperiences(limit = 4): Promise<FamilyExperienceCard[]> {
  return getExperiencesBySlug('familie', limit)
}
