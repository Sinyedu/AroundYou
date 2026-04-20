<template>
    <main class="min-h-screen bg-slate-100">
        <section class="mx-auto max-w-6xl px-6 py-10">
            <div class="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/80">
                <div class="flex flex-col gap-8">
                    <header class="flex flex-wrap items-center justify-between gap-6">
                        <div class="space-y-2">
                            <h1 class="text-2xl font-semibold text-slate-900">
                                Find something to do today
                            </h1>
                            <p class="text-sm text-slate-500">
                                Over 1,000 things to see and explore around you.
                            </p>
                        </div>
                    </header>

                    <SearchFilter v-model="filters" />

                    <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <div class="grid gap-6 sm:grid-cols-2">
                            <article v-for="item in filteredResults" :key="item.id"
                                class="rounded-3xl bg-slate-50 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div class="h-40 rounded-2xl bg-cover bg-center"
                                    :style="{ backgroundImage: `url(${item.image})` }" />
                                <div class="mt-4 space-y-2">
                                    <div
                                        class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <span>{{ item.type }}</span>
                                        <span>{{ item.location }}</span>
                                    </div>
                                    <h3 class="text-base font-semibold text-slate-900">
                                        {{ item.title }}
                                    </h3>
                                    <div class="flex items-center gap-2 text-sm text-slate-600">
                                        <span class="text-amber-500">{{ item.rating.toFixed(1) }}</span>
                                        <span>•</span>
                                        <span>{{ item.reviews }} reviews</span>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="category in item.categories" :key="category"
                                            class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                            {{ category }}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <aside class="rounded-3xl bg-slate-50 p-4 shadow-sm">
                            <div class="flex items-center justify-between pb-3">
                                <h2 class="text-sm font-semibold text-slate-700">Map view</h2>
                                <span class="text-xs font-semibold uppercase text-slate-400">
                                    {{ filteredResults.length }} results
                                </span>
                            </div>
                            <div
                                class="flex h-[420px] items-center justify-center rounded-2xl bg-gradient-to-br from-sky-200 via-slate-100 to-emerald-200 text-sm font-semibold text-slate-600">
                                Map preview
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
import SearchFilter from "@/components/SearchFilter.vue"

type SearchFilters = {
    location: string
    type: "all" | "event" | "attraction"
    date: string
    categories: string[]
}

type SearchResult = {
    id: number
    title: string
    location: string
    type: "event" | "attraction"
    date: string
    rating: number
    reviews: number
    image: string
    categories: string[]
}

const filters = ref<SearchFilters>({
    location: "",
    type: "all",
    date: "",
    categories: [],
})

const results = ref<SearchResult[]>([
    {
        id: 1,
        title: "Sculpture Park Walk",
        location: "Aalborg",
        type: "attraction",
        date: "2026-04-17",
        rating: 4.6,
        reviews: 258,
        image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        categories: ["Nature", "Art"],
    },
    {
        id: 2,
        title: "Harbor Food Market",
        location: "Aarhus",
        type: "event",
        date: "2026-04-19",
        rating: 4.4,
        reviews: 190,
        image:
            "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
        categories: ["Food", "Family"],
    },
    {
        id: 3,
        title: "City Jazz Night",
        location: "Odense",
        type: "event",
        date: "2026-04-22",
        rating: 4.8,
        reviews: 412,
        image:
            "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80",
        categories: ["Music"],
    },
    {
        id: 4,
        title: "Family Science Lab",
        location: "Esbjerg",
        type: "attraction",
        date: "2026-04-25",
        rating: 4.5,
        reviews: 140,
        image:
            "https://images.unsplash.com/photo-1531265726475-52ad60219627?auto=format&fit=crop&w=900&q=80",
        categories: ["Family", "Art"],
    },
    {
        id: 5,
        title: "Coastal Cycling Route",
        location: "Ribe",
        type: "attraction",
        date: "2026-04-18",
        rating: 4.7,
        reviews: 98,
        image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
        categories: ["Nature", "Sport"],
    },
    {
        id: 6,
        title: "Open Air Art Market",
        location: "Kolding",
        type: "event",
        date: "2026-04-21",
        rating: 4.3,
        reviews: 165,
        image:
            "https://images.unsplash.com/photo-1457332813143-5b58788b97b0?auto=format&fit=crop&w=900&q=80",
        categories: ["Art", "Food"],
    },
])

const filteredResults = computed(() => {
    const query = filters.value.location.trim().toLowerCase()
    const hasQuery = query.length > 0

    return results.value.filter((item) => {
        const matchesLocation = hasQuery
            ? item.location.toLowerCase().includes(query)
            : true
        const matchesType =
            filters.value.type === "all" || item.type === filters.value.type
        const matchesDate = filters.value.date
            ? item.date === filters.value.date
            : true
        const matchesCategories = filters.value.categories.length
            ? filters.value.categories.some((category) =>
                item.categories.includes(category)
            )
            : true

        return matchesLocation && matchesType && matchesDate && matchesCategories
    })
})
</script>
