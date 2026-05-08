import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getCityByName } from '@/api/attractions.api'
import { useAsyncData } from '@/composables/useAsyncData'
import type { CityApiItem } from '@/types/city-api-item'
import {
  DEFAULT_ATTRACTION_HERO_IMAGE,
  formatPopulation,
  type DetailFact,
} from './detailView.helpers'

export function useSingleCityView() {
  const route = useRoute()
  const reviewRating = ref<number | null>(null)

  const cityParam = computed(() => {
    const routeCity = route.params.cityName
    return typeof routeCity === 'string' ? routeCity.trim() : ''
  })

  const citySection = useAsyncData<CityApiItem | null>(() => getCityByName(cityParam.value), {
    defaultValue: null,
    getErrorMessage: () => 'Vi kunne ikke hente byen fra databasen.',
  })

  watch(
    cityParam,
    () => {
      void citySection.execute().catch((error) => {
        console.error('Fejl ved hentning af bydata:', error)
      })
    },
    { immediate: true },
  )

  const city = computed(() => citySection.data.value)
  const cityLoading = computed(() => citySection.loading.value)
  const cityError = computed(() => citySection.error.value)
  const displayCityName = computed(() => city.value?.name ?? '')
  const heroImage = computed(() => city.value?.heroImage ?? DEFAULT_ATTRACTION_HERO_IMAGE)

  const cityFacts = computed<DetailFact[]>(() => {
    if (!city.value) return []

    return [
      { label: 'Kommune', value: city.value.commune },
      { label: 'Region', value: city.value.region },
      { label: 'Land', value: city.value.country },
      { label: 'Befolkning', value: formatPopulation(city.value.population) },
      { label: 'Visitor Center', value: city.value.visitorCenter },
    ]
  })

  const handleAverageRating = (rating: number | null) => {
    reviewRating.value = rating
  }

  return {
    city,
    cityError,
    cityFacts,
    cityLoading,
    displayCityName,
    handleAverageRating,
    heroImage,
    reviewRating,
  }
}
