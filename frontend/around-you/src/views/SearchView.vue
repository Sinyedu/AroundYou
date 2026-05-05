<template>
    <main class="min-h-screen bg-slate-100">
        <section class="mx-auto max-w-6xl px-6 py-10">
            <div class="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/80">
                <div class="flex flex-col gap-8">
                    <header class="flex flex-wrap items-center justify-between gap-6">
                        <div class="space-y-2">
                            <h1 class="text-2xl font-semibold text-slate-900">Find ting at lave omkring dig</h1>
                            <p class="text-sm text-slate-500">{{ resultDescription }}</p>
                        </div>
                    </header>

                    <SearchFilter
                        v-model="filters"
                        :location-options="locationOptions"
                        :category-options="categoryOptions"
                    />

                    <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <div>
                            <div v-if="isLoading" class="rounded-2xl bg-white p-6 text-sm font-semibold text-slate-500">
                                Loader resultater...
                            </div>

                            <div
                                v-else-if="errorMessage"
                                class="rounded-2xl bg-rose-50 p-6 text-sm font-semibold text-rose-700"
                            >
                                {{ errorMessage }}
                            </div>

                            <div v-else class="space-y-5">
                                <div ref="resultsGrid" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                    <template v-for="item in paginatedResults" :key="item.id">
                                        <div :data-result-id="item.id" :class="resultCardClass(item.id)">
                                            <CityCard
                                                v-if="item.type === 'city'"
                                                :card="{
                                                    id: item.id,
                                                    name: item.title,
                                                    description: item.description,
                                                    image: item.image,
                                                    rating: item.rating,
                                                    reviews: item.reviews,
                                                    tags: [item.type, item.location, ...item.categories].filter(Boolean),
                                                    metaText: item.date || item.location,
                                                    href: `/city/${item.id}`,
                                                }"
                                            />

                                            <AttractionCard
                                                v-else
                                                :card="{
                                                    id: item.id,
                                                    name: item.title,
                                                    description: item.description,
                                                    image: item.image,
                                                    rating: item.rating,
                                                    reviews: item.reviews,
                                                    tags: [item.type, item.location, ...item.categories].filter(Boolean),
                                                    metaText: item.date || item.location,
                                                    href: item.type === 'event' ? `/event/${item.id}` : item.type === 'attraction' ? `/attraction/${item.id}` : undefined,
                                                }"
                                            />
                                        </div>
                                    </template>
                                </div>

                                <nav
                                    v-if="totalPages > 1"
                                    class="flex flex-wrap items-center justify-center gap-2"
                                    aria-label="Resultatsider"
                                >
                                    <button
                                        type="button"
                                        class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        :disabled="currentPage === 1"
                                        @click="goToPage(currentPage - 1)"
                                    >
                                        Forrige
                                    </button>

                                    <button
                                        v-for="page in pageNumbers"
                                        :key="page"
                                        type="button"
                                        class="h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition"
                                        :class="
                                            page === currentPage
                                                ? 'border-[#1E5A88] bg-[#1E5A88] text-white'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                        "
                                        @click="goToPage(page)"
                                    >
                                        {{ page }}
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        :disabled="currentPage === totalPages"
                                        @click="goToPage(currentPage + 1)"
                                    >
                                        Næste
                                    </button>
                                </nav>
                            </div>
                        </div>

                        <aside class="hidden lg:block">
                            <div class="sticky top-24 rounded-2xl bg-white p-3 shadow-sm">
                                <LocationMap
                                    :show-location-button="false"
                                    :show-user-marker="false"
                                    :center="selectedCityCenter"
                                    :center-zoom="selectedCityCenter ? 13 : 11"
                                    v-model:selected-marker-id="selectedResultId"
                                    :markers="mapMarkers"
                                    map-class="h-[520px] w-full rounded-xl"
                                    @marker-selected="handleMapMarkerSelected"
                                />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import { useRoute } from "vue-router"
import AttractionCard from "@/components/AttractionCard.vue"
import CityCard from "@/components/CityCard.vue"
import LocationMap from "@/components/LocationMap.vue"
import SearchFilter from "@/components/SearchFilter.vue"
import { useSearchResults } from "@/composables/useSearchResults"
import type { Coordinates as MapCoordinates } from "@/types/coordinates"
import type { SearchFilters } from "@/types/search"

const RESULTS_PER_PAGE = 8
const route = useRoute()

const routeType = Array.isArray(route.query.type) ? route.query.type[0] : route.query.type
const initialTypes: SearchFilters["types"] =
    routeType === "event" || routeType === "attraction" ? [routeType] : []

const filters = ref<SearchFilters>({
    location: "",
    types: initialTypes,
    date: "",
    categories: [],
})

type SelectedMapMarker = {
    id: string
    title: string
    type: "event" | "attraction" | "city"
}

const {
    filteredResults,
    cityCoordinates,
    locationOptions,
    categoryOptions,
    isUsingLocationResults,
    isShowingLargestCities,
    isLoading,
    errorMessage,
} = useSearchResults(filters)

const currentPage = ref(1)
const selectedResultId = ref<string | null>(null)
const citySelectedFromMap = ref('')
const resultsGrid = ref<HTMLElement | null>(null)

const resultItems = computed(() => {
    if (!citySelectedFromMap.value) {
        return filteredResults.value
    }

    return filteredResults.value.filter((item) => item.type !== "city")
})

const totalPages = computed(() => Math.ceil(resultItems.value.length / RESULTS_PER_PAGE))

const pageNumbers = computed(() => {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1)
})

const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * RESULTS_PER_PAGE
    return resultItems.value.slice(start, start + RESULTS_PER_PAGE)
})

const goToPage = (page: number) => {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

const resultCardClass = (id: string) => {
    return selectedResultId.value === id
        ? "ring-4 ring-[#de5826]/70 shadow-[0_0_0_6px_rgba(222,88,38,0.12)]"
        : "ring-0"
}

const scrollToResult = async (id: string) => {
    await nextTick()

    requestAnimationFrame(() => {
        const selectedCard = resultsGrid.value?.querySelector<HTMLElement>(`[data-result-id="${CSS.escape(id)}"]`)

        if (!selectedCard || !document.body.contains(selectedCard)) {
            return
        }

        const stickyHeaderOffset = 120
        const targetTop = selectedCard.getBoundingClientRect().top + window.scrollY - stickyHeaderOffset

        window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: "smooth",
        })
    })
}

const handleMapMarkerSelected = (marker: SelectedMapMarker) => {
    if (marker.type !== "city") {
        return
    }

    citySelectedFromMap.value = marker.title
    filters.value.location = marker.title
    selectedResultId.value = null
}

watch(
    filters,
    () => {
        currentPage.value = 1

        if (filters.value.location !== citySelectedFromMap.value) {
            citySelectedFromMap.value = ""
        }
    },
    { deep: true },
)

watch(totalPages, (pages) => {
    if (pages > 0 && currentPage.value > pages) {
        currentPage.value = pages
    }
})

watch(selectedResultId, async (id) => {
    if (!id) {
        return
    }

    await nextTick()
    await scrollToResult(id)
})

const resultDescription = computed(() => {
    if (filters.value.location || filters.value.types.length || filters.value.date || filters.value.categories.length) {
        return "Søg blandt byer, events og attraktioner i hele Danmark."
    }

    if (isUsingLocationResults.value) {
        return "Vi viser de nærmeste events og attraktioner ud fra din lokation."
    }

    if (isShowingLargestCities.value) {
        return "Del din lokation for at se oplevelser tæt på dig, eller udforsk Danmarks seks største byer her."
    }

    return "Der er over 1.000 ting at se og opleve omkring dig."
})

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
    return paginatedResults.value
        .filter((item) => item.coordinates)
        .map((item) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            latitude: item.coordinates!.lat,
            longitude: item.coordinates!.lng,
        }))
})
</script>
