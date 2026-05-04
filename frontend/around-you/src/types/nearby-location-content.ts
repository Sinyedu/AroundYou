import type { NearbyAttractionCard } from './nearby-attraction-card'

export type NearbyLocationContent = {
  locationName: string
  locationDescription: string
  attractions: NearbyAttractionCard[]
}
