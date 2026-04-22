import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Coordinates } from '@/types/coordinates'

export const useGeolocationStore = defineStore('geolocation', () => {
  const coords = ref<Coordinates | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getLocation = () => {
    console.log('📡 getLocation called')

    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }

    loading.value = true

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Position received:', position.coords)

        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        loading.value = false
      },
      (err) => {
        console.error('❌ Geolocation error:', err)
        error.value = err.message
        loading.value = false
      }
    )
  }

  return {
    coords,
    error,
    loading,
    getLocation
  }
})
