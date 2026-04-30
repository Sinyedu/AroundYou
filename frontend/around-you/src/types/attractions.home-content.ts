import type { NearbyAttractionCard } from './attractions.cards'

export type NearbyLocationContent = {
  locationName: string
  locationDescription: string
  attractions: NearbyAttractionCard[]
}

export type NatureExperienceSource = {
  _id: string
  name: string
  description: string
  heroImage: string
  rating: number
  slugArray: string[]
  type: 'Seværdighed' | 'Event'
}
