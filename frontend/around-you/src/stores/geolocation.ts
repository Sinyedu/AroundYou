import { defineStore } from 'pinia'
import { ref } from 'vue'

type Coordinates = {
  latitude: number
  longitude: number
}

export const useGeolocationStore = defineStore('geolocation', () => {
  const coords = ref<Coordinates | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }

    loading.value = true

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        loading.value = false
      },
      (err) => {
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
