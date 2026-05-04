import { computed, onMounted, ref, type Ref } from 'vue'

import { fetchAttractions, fetchCities, fetchEvents } from '@/api/searchApi'
import { mapAttractionToSearchResult, mapEventToSearchResult } from '@/api/helpers/searchMappers'
import type { SearchFilters } from '@/types/search-filter'
import type { SearchResult } from '@/types/search-result'

export const useSearchResults = (filters: Ref<SearchFilters>) => {
  const results = ref<SearchResult[]>([])
  const isLoading = ref(true)
  const errorMessage = ref('')

  const fetchResults = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const [events, attractions, cities] = await Promise.all([
        fetchEvents(),
        fetchAttractions(),
        fetchCities(),
      ])

      results.value = [
        ...events.map((event) => mapEventToSearchResult(event, cities)),
        ...attractions.map((attraction) => mapAttractionToSearchResult(attraction, cities)),
      ]
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error.'
      errorMessage.value = message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchResults()
  })

  const filteredResults = computed(() => {
    const query = filters.value.location.trim().toLowerCase()
    const hasQuery = query.length > 0

    return results.value.filter((item) => {
      const matchesLocation = hasQuery ? item.location.toLowerCase().includes(query) : true
      const matchesType = filters.value.type === 'all' || item.type === filters.value.type
      const matchesDate = filters.value.date ? item.date === filters.value.date : true
      const matchesCategories = filters.value.categories.length
        ? filters.value.categories.some((category) => item.categories.includes(category))
        : true

      return matchesLocation && matchesType && matchesDate && matchesCategories
    })
  })

  const locationOptions = computed(() => {
    const unique = new Set(
      results.value
        .map((item) => item.location)
        .filter((location) => location && location !== 'Ukendt'),
    )
    return Array.from(unique).sort()
  })

  const categoryOptions = computed(() => {
    const unique = new Set(results.value.flatMap((item) => item.categories))
    return Array.from(unique).sort()
  })

  return {
    results,
    filteredResults,
    locationOptions,
    categoryOptions,
    isLoading,
    errorMessage,
    fetchResults,
  }
}
