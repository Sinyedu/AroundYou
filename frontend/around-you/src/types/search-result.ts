export type SearchResult = {
  id: string
  title: string
  location: string
  type: 'event' | 'attraction'
  date: string
  rating: number
  reviews: number
  image: string
  categories: string[]
}
