import { ref, watch, type Ref } from 'vue'

import { getReverseGeocodedAddress } from './detailView.helpers'

export function useReverseGeocodedAddress(gpsPosition: Readonly<Ref<string | null | undefined>>) {
  const address = ref<string | null>(null)
  let requestId = 0

  watch(
    gpsPosition,
    async (nextGpsPosition) => {
      const currentRequestId = ++requestId
      address.value = null

      const nextAddress = await getReverseGeocodedAddress(nextGpsPosition)

      if (currentRequestId === requestId) {
        address.value = nextAddress
      }
    },
    { immediate: true },
  )

  return {
    address,
  }
}
