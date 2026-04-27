 export type SearchFilters = {
  location: string
  type: 'all' | 'event' | 'attraction'
  date: string
  categories: string[]
}

export type SearchResult = {
  id: string
  title: string
  description: string
  location: string
  type: 'event' | 'attraction'
  date: string
  rating: number
  reviews: number
  image: string
  categories: string[]
}

export type ApiEvent = {
  _id: string
  name: string
  description: string
  heroImage: string
  rating: number
  startDate: string
  gpsPosition?: string
  slugArray?: string[]
}

export type ApiAttraction = {
  _id: string
  name: string
  description: string
  heroImage: string
  rating: number
  updateAt?: string
  gpsPosition?: string
  slugArray?: string[]
}

export type City = {
  _id: string
  name?: string
  gpsPosition: string
}

export type Coordinates = {
  lat: number
  lng: number
}
