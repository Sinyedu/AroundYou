import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getAttractionByIdentifier } from '@/api/attractions.api'
import { useAsyncData } from '@/composables/useAsyncData'
import type { AttractionApiItem } from '@/types/attraction-api-item'
import {
  DEFAULT_ATTRACTION_HERO_IMAGE,
  formatOpeningHours,
  formatPrice,
  type DetailFact,
} from './detailView.helpers'
import { useReverseGeocodedAddress } from './useReverseGeocodedAddress'

export function useSingleAttractionView() {
  const route = useRoute()
  const reviewRating = ref<number | null>(null)

  const attractionParam = computed(() => {
    const routeAttraction = route.params.attractionId
    return typeof routeAttraction === 'string' ? routeAttraction.trim() : ''
  })

  const attractionSection = useAsyncData<AttractionApiItem | null>(
    () => getAttractionByIdentifier(attractionParam.value),
    {
      defaultValue: null,
      getErrorMessage: () => 'Vi kunne ikke hente attraktionen fra databasen.',
    },
  )

  watch(
    attractionParam,
    () => {
      void attractionSection.execute().catch((error) => {
        console.error('Fejl ved hentning af attraktion:', error)
      })
    },
    { immediate: true },
  )

  const attraction = computed(() => attractionSection.data.value)
  const attractionLoading = computed(() => attractionSection.loading.value)
  const attractionError = computed(() => attractionSection.error.value)
  const displayAttractionName = computed(() => attraction.value?.name ?? '')
  const heroImage = computed(() => attraction.value?.heroImage ?? DEFAULT_ATTRACTION_HERO_IMAGE)
  const gpsPosition = computed(() => attraction.value?.gpsPosition)
  const { address: attractionAddress } = useReverseGeocodedAddress(gpsPosition)

  const attractionFacts = computed<DetailFact[]>(() => {
    if (!attraction.value) return []

    return [
      { label: 'Pris', value: formatPrice(attraction.value.price) },
      {
        label: 'Åbningstider',
        value: formatOpeningHours(attraction.value.openingHours),
      },
      attractionAddress.value ? { label: 'Adresse', value: attractionAddress.value } : null,
      attraction.value.link
        ? {
            label: 'Website',
            value: attraction.value.link,
            href: attraction.value.link,
          }
        : null,
    ].filter((fact): fact is DetailFact => fact !== null)
  })

  const handleAverageRating = (rating: number | null) => {
    reviewRating.value = rating
  }

  return {
    attraction,
    attractionError,
    attractionFacts,
    attractionLoading,
    displayAttractionName,
    handleAverageRating,
    heroImage,
    reviewRating,
  }
}
