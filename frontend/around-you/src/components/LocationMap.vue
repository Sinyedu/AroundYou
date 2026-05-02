<template>
    <div class="space-y-3">
        <button v-if="showLocationButton" @click="geo.getLocation()" class="bg-indigo-600 text-white px-4 py-2 rounded">
            Enable Location
        </button>

        <div ref="mapEl" :class="mapClass"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'
import L from 'leaflet'

import { useGeolocationStore } from '@/stores/geolocation'
import type { Coordinates } from '@/types/coordinates'

type LocationMapMarker = {
    id: string
    latitude: number
    longitude: number
    title: string
    type: 'event' | 'attraction' | 'city'
}

const markerTypeLabels: Record<LocationMapMarker['type'], string> = {
    event: 'Event',
    attraction: 'Attraktion',
    city: 'By',
}

const props = withDefaults(
    defineProps<{
        showLocationButton?: boolean
        showUserMarker?: boolean
        mapClass?: string
        center?: Coordinates | null
        centerZoom?: number
        markers?: LocationMapMarker[]
    }>(),
    {
        showLocationButton: true,
        showUserMarker: true,
        mapClass: 'h-[500px] w-full rounded',
        center: null,
        centerZoom: 11,
        markers: () => [],
    },
)

const geo = useGeolocationStore()

const mapEl = ref<HTMLElement | null>(null)
let map: ReturnType<typeof L.map> | null = null
let marker: ReturnType<typeof L.marker> | null = null
let resultMarkersLayer: L.LayerGroup | null = null

const getAddress = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        )
        const data = await response.json()

        return data.display_name || 'Unknown location'
    } catch (error) {
        console.error('Reverse geocoding failed:', error)
        return 'Unknown location'
    }
}

const updateMap = async (coords: Coordinates) => {
    if (!map) {
        return
    }

    const { latitude, longitude } = coords
    map.setView([latitude, longitude], 13)

    const address = await getAddress(latitude, longitude)

    if (marker) {
        marker.setLatLng([latitude, longitude]).setPopupContent(address)
        return
    }

    marker = L.marker([latitude, longitude]).addTo(map).bindPopup(address).openPopup()
}

const renderResultMarkers = () => {
    if (!map) {
        return
    }

    if (!resultMarkersLayer) {
        resultMarkersLayer = L.layerGroup().addTo(map)
    }

    resultMarkersLayer.clearLayers()

    for (const item of props.markers) {
        const label = `${markerTypeLabels[item.type]}: ${item.title}`
        L.marker([item.latitude, item.longitude]).bindPopup(label).addTo(resultMarkersLayer)
    }
}

const updateMapViewFromProps = () => {
    if (!map) {
        return
    }

    renderResultMarkers()

    if (props.center) {
        map.setView([props.center.latitude, props.center.longitude], props.centerZoom)
        return
    }

    if (props.markers.length) {
        const bounds = L.latLngBounds(props.markers.map((item) => [item.latitude, item.longitude] as [number, number]))
        map.fitBounds(bounds, { padding: [20, 20] })
    }
}

onMounted(async () => {
    await nextTick()

    if (!mapEl.value) {
        return
    }

    map = L.map(mapEl.value).setView([56.1629, 10.2039], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    if (props.showUserMarker && !props.center && geo.coords) {
        await updateMap(geo.coords)
    }

    updateMapViewFromProps()
})

watch(
    () => geo.coords,
    async (coords) => {
        if (props.center || !props.showUserMarker) {
            return
        }

        if (!coords || !map) {
            return
        }

        await updateMap(coords)
    },
)

watch(
    () => [props.center, props.centerZoom, props.markers] as const,
    () => {
        updateMapViewFromProps()
    },
    { deep: true },
)
</script>
