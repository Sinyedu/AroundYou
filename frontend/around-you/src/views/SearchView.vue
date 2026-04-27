<template>
    <main class="min-h-screen bg-slate-100">
        <section class="mx-auto max-w-6xl px-6 py-10">
            <div class="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/80">
                <div class="flex flex-col gap-8">
                    <header class="flex flex-wrap items-center justify-between gap-6">
                        <div class="space-y-2">
                            <h1 class="text-2xl font-semibold text-slate-900">
                                Find ting at lave omkring dig
                            </h1>
                            <p class="text-sm text-slate-500">
                                Der er over 1,000 ting at se og erkende omkring dig.
                            </p>
                        </div>

                    </header>

                    <SearchFilter v-model="filters" :location-options="locationOptions"
                        :category-options="categoryOptions" />

                    <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <div>
                            <div v-if="isLoading" class="rounded-2xl bg-white p-6 text-sm font-semibold text-slate-500">
                                Loader resultater...
                            </div>
                            <div v-else-if="errorMessage"
                                class="rounded-2xl bg-rose-50 p-6 text-sm font-semibold text-rose-700">
                                {{ errorMessage }}
                            </div>
                            <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                <AttractionCard v-for="card in searchCards" :key="card.id" :card="card" />
                            </div>
                        </div>
                        <aside class="hidden lg:block">
                            <div class="sticky top-24 rounded-2xl bg-white p-3 shadow-sm">
                                <LocationMap :show-location-button="false" :show-user-marker="false"
                                    :center="selectedCityCenter" :markers="mapMarkers"
                                    map-class="h-[520px] w-full rounded-xl" />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script setup lang="ts">
import { computed, ref } from "vue"
import AttractionCard from "@/components/AttractionCard.vue"
import LocationMap from "@/components/LocationMap.vue"
import SearchFilter from "@/components/SearchFilter.vue"
import { useSearchResults } from "@/composables/useSearchResults"
import type { ExperienceCard } from "@/types/attractions"
import type { Coordinates as MapCoordinates } from "@/types/coordinates"
import type { SearchFilters } from "@/types/search"

const filters = ref<SearchFilters>({
    location: "",
    type: "all",
    date: "",
    categories: [],
})

const {
    filteredResults,
    cityCoordinates,
    locationOptions,
    categoryOptions,
    isLoading,
    errorMessage,
} = useSearchResults(filters)

const selectedCityCenter = computed<MapCoordinates | null>(() => {
    const selectedLocation = filters.value.location.trim().toLowerCase()

    if (!selectedLocation) {
        return null
    }

    const city = cityCoordinates.value[selectedLocation]

    if (!city) {
        return null
    }

    return {
        latitude: city.lat,
        longitude: city.lng,
    }
})

const mapMarkers = computed(() => {
    return filteredResults.value
        .filter((item) => item.coordinates)
        .map((item) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            latitude: item.coordinates!.lat,
            longitude: item.coordinates!.lng,
        }))
})

const searchCards = computed<ExperienceCard[]>(() => {
    return filteredResults.value.map((item) => ({
        id: item.id,
        name: item.title,
        description: item.description,
        image: item.image,
        rating: item.rating,
        reviews: item.reviews,
        tags: [item.type, item.location, ...item.categories].filter(Boolean),
        metaText: item.date || item.location,
    }))
})
</script>
