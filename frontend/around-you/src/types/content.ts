export type ContentType = 'event' | 'attraction' | 'city'

export type EventPayload = {
  name: string
  description: string
  heroImage: string
  imageArray: string[]
  price: number
  link: string
  gpsPosition: string
  rating?: number
  slugArray: string[]
  isAnnual: boolean
  startDate: string
  endDate: string
  openingHours: string[]
}

export type AttractionPayload = {
  name: string
  description: string
  heroImage: string
  imageArray: string[]
  price: number
  link: string
  gpsPosition: string
  rating?: number
  slugArray: string[]
  openingHours: string[]
}

export type CityPayload = {
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

export type UploadedImageResponse = {
  imageUrl?: string
}
