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
              <div
                v-if="isLoading"
                class="rounded-2xl bg-white p-6 text-sm font-semibold text-slate-500"
              >
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
                      <CityCard v-if="item.type === 'city'" :card="toSearchResultCard(item)" />

                      <AttractionCard v-else :card="toSearchResultCard(item)" />
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
import AttractionCard from '@/components/AttractionCard.vue'
import CityCard from '@/components/CityCard.vue'
import LocationMap from '@/components/LocationMap.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import { useSearchView } from '@/composables/search/useSearchView'

const {
  categoryOptions,
  currentPage,
  errorMessage,
  filters,
  goToPage,
  handleMapMarkerSelected,
  isLoading,
  locationOptions,
  mapMarkers,
  pageNumbers,
  paginatedResults,
  resultCardClass,
  resultDescription,
  resultsGrid,
  selectedCityCenter,
  selectedResultId,
  toSearchResultCard,
  totalPages,
} = useSearchView()
</script>
