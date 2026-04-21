<template>
  <div>
    <button @click="geo.getLocation()" class="mb-3 bg-indigo-600 text-white px-4 py-2 rounded">
      Enable Location
    </button>

    <div ref="mapEl" class="h-[500px] w-full rounded"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'
import L from 'leaflet'
import { useGeolocationStore } from '@/stores/geolocation'

type Coordinates = {
  latitude: number
  longitude: number
}

const geo = useGeolocationStore()

const mapEl = ref<HTMLElement | null>(null)
let map: ReturnType<typeof L.map> | null = null
let marker: ReturnType<typeof L.marker> | null = null

// Instead of displaying X and Y coords, it reverses and prints out the address for better UX
const getAddress = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    )

    const data = await res.json()

    return data.display_name || 'Unknown location'
  } catch (err) {
    console.error('Reverse geocoding failed:', err)
    return 'Unknown location'
  }
}

const updateMap = async (coords: Coordinates) => {
  if (!map) return

  const { latitude, longitude } = coords

  map.setView([latitude, longitude], 13)

  const address = await getAddress(latitude, longitude)

  if (marker) {
    marker.setLatLng([latitude, longitude]).setPopupContent(address)
  } else {
    marker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(address)
      .openPopup()
  }
}

onMounted(async () => {
  await nextTick()

  if (!mapEl.value) return

  map = L.map(mapEl.value).setView([56.1629, 10.2039], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  if (geo.coords) {
    await updateMap(geo.coords)
  }
})

watch(
  () => geo.coords,
  async (coords) => {
    console.log('📍 Geo coords from Pinia:', coords)

    if (!coords || !map) return

    await updateMap(coords)
  }
)
</script>

<style scoped>
div {
  min-height: 500px;
}
</style>
