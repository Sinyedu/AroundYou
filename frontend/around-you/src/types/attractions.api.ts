export type AttractionApiItem = {
  _id: string
  name: string
  description: string
  heroImage: string
  gpsPosition: string
  rating: number
  slugArray: string[]
}

export type EventApiItem = {
  _id: string
  name: string
  description: string
  heroImage: string
  rating: number
  slugArray: string[]
}

export type CityApiItem = {
  _id: string
  name: string
  description: string
  heroImage: string
  commune: string
  region: string
  gpsPosition: string
  population: number
  rating: number
}
