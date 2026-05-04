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

import { getReverseGeocodedAddress } from '@/api/geocoding.api'
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
        selectedZoom?: number
        selectedMarkerId?: string | null
        markers?: LocationMapMarker[]
    }>(),
    {
        showLocationButton: true,
        showUserMarker: true,
        mapClass: 'h-[500px] w-full rounded',
        center: null,
        centerZoom: 11,
        selectedZoom: 16,
        selectedMarkerId: null,
        markers: () => [],
    },
)

const emit = defineEmits<{
    'update:selectedMarkerId': [id: string | null]
    'marker-selected': [marker: LocationMapMarker]
}>()

const geo = useGeolocationStore()

const mapEl = ref<HTMLElement | null>(null)
let map: ReturnType<typeof L.map> | null = null
let marker: ReturnType<typeof L.marker> | null = null
let resultMarkersLayer: L.LayerGroup | null = null
const activeMarkerId = ref<string | null>(props.selectedMarkerId)
const markerAddressCache = new Map<string, string>()
const resultMarkerInstances = new Map<string, L.Marker>()

const getMarkerIcon = (isSelected: boolean) =>
    L.divIcon({
        className: '',
        html: `<div class="location-map-pin${isSelected ? ' location-map-pin--selected' : ''}"></div>`,
        iconSize: isSelected ? [34, 44] : [24, 32],
        iconAnchor: isSelected ? [17, 44] : [12, 32],
        popupAnchor: [0, isSelected ? -42 : -30],
    })

const getAddress = async (latitude: number, longitude: number): Promise<string> => {
    try {
        return await getReverseGeocodedAddress(latitude, longitude)
    } catch (error) {
        console.error('Reverse geocoding failed:', error)
        return 'Unknown location'
    }
}

const createPopupContent = (item: LocationMapMarker, address?: string) => {
    const container = document.createElement('div')
    container.className = 'location-map-popup'

    const meta = document.createElement('p')
    meta.className = 'location-map-popup__meta'
    meta.textContent = markerTypeLabels[item.type]

    const title = document.createElement('strong')
    title.className = 'location-map-popup__title'
    title.textContent = item.title

    container.append(meta, title)

    if (item.type === 'event' || item.type === 'attraction') {
        const addressElement = document.createElement('p')
        addressElement.className = 'location-map-popup__address'
        addressElement.textContent = address ? `Address: ${address}` : 'Finding address...'
        container.append(addressElement)
    }

    return container
}

const focusResultMarker = async (item: LocationMapMarker, shouldEmit = false) => {
    if (!map) {
        return
    }

    activeMarkerId.value = item.id

    if (shouldEmit) {
        emit('update:selectedMarkerId', item.id)
        emit('marker-selected', item)
    }

    renderResultMarkers()
    const selectedMarker = resultMarkerInstances.get(item.id)

    map.flyTo([item.latitude, item.longitude], props.selectedZoom, {
        animate: true,
        duration: 0.45,
    })

    selectedMarker?.openPopup()

    if (item.type !== 'event' && item.type !== 'attraction') {
        return
    }

    const cachedAddress = markerAddressCache.get(item.id)
    if (cachedAddress) {
        selectedMarker?.setPopupContent(createPopupContent(item, cachedAddress)).openPopup()
        return
    }

    const address = await getAddress(item.latitude, item.longitude)
    markerAddressCache.set(item.id, address)

    if (activeMarkerId.value === item.id) {
        resultMarkerInstances
            .get(item.id)
            ?.setPopupContent(createPopupContent(item, address))
            .openPopup()
    }
}

const selectResultMarker = (item: LocationMapMarker) => {
    void focusResultMarker(item, true)
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
    resultMarkerInstances.clear()

    for (const item of props.markers) {
        const isSelected = activeMarkerId.value === item.id
        const markerInstance = L.marker([item.latitude, item.longitude], {
            icon: getMarkerIcon(isSelected),
            zIndexOffset: isSelected ? 1000 : 0,
        })
            .bindPopup(createPopupContent(item, markerAddressCache.get(item.id)))
            .on('click', () => {
                selectResultMarker(item)
            })

        markerInstance.addTo(resultMarkersLayer)
        resultMarkerInstances.set(item.id, markerInstance)

        if (isSelected) {
            markerInstance.openPopup()
        }
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
        if (activeMarkerId.value && !props.markers.some((markerItem) => markerItem.id === activeMarkerId.value)) {
            activeMarkerId.value = null
            emit('update:selectedMarkerId', null)
        }

        updateMapViewFromProps()
    },
    { deep: true },
)

watch(
    () => props.selectedMarkerId,
    (selectedId) => {
        if (selectedId === activeMarkerId.value) {
            return
        }

        activeMarkerId.value = selectedId

        if (!selectedId) {
            renderResultMarkers()
            return
        }

        const selectedMarker = props.markers.find((markerItem) => markerItem.id === selectedId)

        if (selectedMarker) {
            void focusResultMarker(selectedMarker)
            return
        }

        renderResultMarkers()
    },
)
</script>

<style scoped>
:global(.location-map-pin) {
    position: relative;
    width: 24px;
    height: 24px;
    border: 3px solid #ffffff;
    border-radius: 9999px 9999px 9999px 0;
    background: #de5826;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.28);
    transform: rotate(-45deg);
    transition:
        width 0.2s ease,
        height 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;
}

:global(.location-map-pin::after) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: #ffffff;
    content: '';
    transform: translate(-50%, -50%);
}

:global(.location-map-pin--selected) {
    width: 34px;
    height: 34px;
    background: #094b7b;
    box-shadow:
        0 0 0 8px rgba(9, 75, 123, 0.18),
        0 14px 30px rgba(15, 23, 42, 0.35);
}

:global(.location-map-pin--selected::after) {
    width: 11px;
    height: 11px;
}

:global(.location-map-popup) {
    min-width: 180px;
    max-width: 260px;
}

:global(.location-map-popup__meta) {
    margin: 0 0 4px;
    color: #de5826;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

:global(.location-map-popup__title) {
    display: block;
    color: #0f172a;
    font-size: 14px;
    line-height: 1.25;
}

:global(.location-map-popup__address) {
    margin: 8px 0 0;
    color: #475569;
    font-size: 12px;
    line-height: 1.35;
}
</style>
