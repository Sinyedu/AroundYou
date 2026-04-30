export type ExperienceCard = {
  id: string
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  tags: string[]
  metaText?: string
}

export type NearbyAttractionCard = ExperienceCard
export type LargestCityCard = ExperienceCard
export type NatureExperienceCard = ExperienceCard
export type FamilyExperienceCard = NatureExperienceCard
