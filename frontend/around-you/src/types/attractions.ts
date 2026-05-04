export type AttractionApiItem = {
  _id: string
  name: string
  description: string
  heroImage: string
  gpsPosition: string
  rating?: number
  slugArray: string[]
}

export type EventApiItem = {
  _id: string
  name: string
  description: string
  heroImage: string
  rating?: number
  slugArray: string[]
}

export type CityApiItem = {
  _id: string
  name: string
  description: string
  heroImage: string
  commune: string
  region: string
  country: string
  gpsPosition: string
  population: number
  visitorCenter: string
  rating?: number
}

export type ExperienceCard = {
  id: string
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  tags: string[]
  metaText?: string
  href?: string
}

export type NearbyAttractionCard = ExperienceCard

export type NearbyLocationContent = {
  locationName: string
  locationDescription: string
  attractions: NearbyAttractionCard[]
}

export type LargestCityCard = ExperienceCard

export type NatureExperienceCard = ExperienceCard

export type NatureExperienceSource = {
  _id: string
  name: string
  description: string
  heroImage: string
  rating?: number
  slugArray: string[]
  type: 'Seværdighed' | 'Event'
}

export type FamilyExperienceCard = NatureExperienceCard
