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
  return apiRequest<T>(path)
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
      entry.slugArray.some((entrySlug) => entrySlug.toLowerCase() === slug.toLowerCase()),
    )
    .sort((first, second) => second.rating - first.rating)
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
    }))
}

export async function getNatureExperiences(limit = 4): Promise<NatureExperienceCard[]> {
  return getExperiencesBySlug('natur', limit)
}

export async function getFamilyExperiences(limit = 4): Promise<FamilyExperienceCard[]> {
  return getExperiencesBySlug('familie', limit)
}
