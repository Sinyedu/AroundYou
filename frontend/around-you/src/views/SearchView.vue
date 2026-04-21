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

                    <SearchFilter v-model="filters" :location-options="locationOptions"
                        :category-options="categoryOptions" />

                    <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <div>
                            <div v-if="isLoading" class="rounded-2xl bg-white p-6 text-sm font-semibold text-slate-500">
                                Loading results...
                            </div>
                            <div v-else-if="errorMessage"
                                class="rounded-2xl bg-rose-50 p-6 text-sm font-semibold text-rose-700">
                                {{ errorMessage }}
                            </div>
                            <div v-else class="grid gap-6 sm:grid-cols-2">
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
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script setup lang="ts">
import { ref } from "vue"
import SearchFilter from "@/components/SearchFilter.vue"
import { useSearchResults } from "@/composables/useSearchResults"
import type { SearchFilters } from "@/api/types"

const filters = ref<SearchFilters>({
    location: "",
    type: "all",
    date: "",
    categories: [],
})

const {
    filteredResults,
    locationOptions,
    categoryOptions,
    isLoading,
    errorMessage,
} = useSearchResults(filters)
</script>
