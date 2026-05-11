<template>
  <section ref="filterRef" class="w-full">
    <!-- Mobile toggle button -->
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-full bg-[#C1D2DE] px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm lg:hidden"
      @click="isMobileFilterOpen = !isMobileFilterOpen"
    >
      <span>Filtre</span>
      <span class="text-xs">{{ isMobileFilterOpen ? '▲' : '▼' }}</span>
    </button>

    <div :class="['rounded-[28px] bg-[#C1D2DE] px-4 py-2 shadow-sm mt-2 lg:mt-0', isMobileFilterOpen ? 'block' : 'hidden lg:block']">
      <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
        <div class="relative flex min-w-[180px] flex-1 items-center">
          <div
            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
            @click="toggleLocation"
          >
            <input
              v-model="draft.location"
              type="text"
              placeholder="Lokation"
              class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-700"
              @click.stop
              @focus="openLocation"
              @input="openLocation"
            />
            <span class="ml-2 shrink-0 text-xs text-slate-600">{{ isLocationOpen ? '▲' : '▼' }}</span>
          </div>

          <div
            v-if="isLocationOpen"
            class="absolute left-0 top-full z-20 mt-2.5 w-56 rounded-2xl border-[5px] border-[#C1D2DE] bg-white p-2 shadow-lg"
          >
            <div class="filter-scroll max-h-40 space-y-1 overflow-y-auto pr-1">
              <button
                v-for="location in filteredLocationOptions"
                :key="location"
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                @click="selectLocation(location)"
              >
                <span>{{ location }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="hidden h-6 w-px bg-slate-300/70 lg:block" />

        <div class="relative flex min-w-[200px] flex-1 items-center">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
            @click="toggleType"
          >
            <span>Event / Attraktion</span>
            <span class="text-xs text-slate-600">{{ isTypeOpen ? '▲' : '▼' }}</span>
          </button>

          <div
            v-if="isTypeOpen"
            class="absolute top-full z-20 mt-2.5 w-56 rounded-2xl bg-[#C1D2DE] p-3 shadow-lg"
          >
            <div class="flex items-center justify-between rounded-xl bg-[#C1D2DE] px-4 py-2">
              <button
                type="button"
                class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                @click="toggleTypeFilter('event')"
              >
                <span :class="typeDotClass('event')" />
                Event
              </button>
              <button
                type="button"
                class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                @click="toggleTypeFilter('attraction')"
              >
                <span :class="typeDotClass('attraction')" />
                Attraction
              </button>
            </div>
            <button
              type="button"
              class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500"
              @click="draft.types = []"
            >
              Ryd type
            </button>
          </div>
        </div>

        <div class="hidden h-6 w-px bg-slate-300/70 lg:block" />

        <div class="relative flex min-w-[140px] flex-1 items-center">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
            @click="toggleDate"
          >
            <span class="min-w-[40px]">Dato</span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-600">
                {{ displayDate }}
              </span>
              <span class="text-xs text-slate-600">{{ isDateOpen ? '▲' : '▼' }}</span>
            </div>
          </button>

          <div
            v-if="isDateOpen"
            class="absolute left-1/2 top-full z-20 mt-2.5 w-[230px] -translate-x-1/2 rounded-[28px] bg-[#C1D2DE] p-2 shadow-lg"
          >
            <div class="flex items-center justify-between rounded-[24px] bg-white px-3 py-2">
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-[#C1D2DE]/60"
                @click="goToPreviousMonth"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <span class="text-sm font-semibold text-slate-700">{{ monthLabel }}</span>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-[#C1D2DE]/60"
                @click="goToNextMonth"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
            <div class="mt-3 rounded-[22px] bg-white px-3 pb-3 pt-2">
              <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#1E5A88]">
                <span v-for="day in weekdayLabels" :key="day">{{ day }}</span>
              </div>
              <div class="mt-2 grid grid-cols-7 gap-1 text-center text-sm text-[#1E5A88]">
                <button
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  type="button"
                  class="h-7 w-7 rounded-full text-sm font-semibold"
                  :class="dayButtonClass(day)"
                  :disabled="!day"
                  @click="selectDate(day)"
                >
                  {{ day || "" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden h-6 w-px bg-slate-300/70 lg:block" />

        <div class="relative flex min-w-[200px] flex-1 items-center">
          <div
            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
            @click="toggleCategories"
          >
            <input
              v-model="categoryQuery"
              type="text"
              placeholder="Kategorier"
              class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-700"
              @click.stop
              @focus="openCategories"
              @input="openCategories"
              @keydown.enter.prevent="addCategoryFromQuery"
            />
            <span class="ml-2 shrink-0 text-xs text-slate-600">{{ isCategoriesOpen ? '▲' : '▼' }}</span>
          </div>

          <div
            v-if="isCategoriesOpen"
            class="absolute right-0 top-full z-20 mt-2.5 w-56 rounded-2xl border-[5px] border-[#C1D2DE] bg-white p-2 shadow-lg"
          >
            <div class="filter-scroll max-h-40 space-y-1 overflow-y-auto pr-1">
              <button
                v-for="category in filteredCategoryOptions"
                :key="category"
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                @click="toggleCategory(category)"
              >
                <span>{{ category }}</span>
              </button>
            </div>
            <div v-if="draft.categories.length" class="mt-3 -mb-2 -mx-2 rounded-b-1xl bg-[#C1D2DE] p-3">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="category in draft.categories"
                  :key="category"
                  type="button"
                  class="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1E5A88]"
                  @click="removeCategory(category)"
                >
                  <span>{{ category }}</span>
                  <span class="text-sm font-bold leading-none text-[#1E5A88]">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchFilter } from "@/composables/useSearchFilter"
import type { SearchFilters } from "@/types/search"

const props = withDefaults(
  defineProps<{
    modelValue: SearchFilters
    locationOptions?: string[]
    categoryOptions?: string[]
  }>(),
  {
    locationOptions: () => [],
    categoryOptions: () => [],
  },
)
const emit = defineEmits<{ (event: 'update:modelValue', value: SearchFilters): void }>()

const {
  addCategoryFromQuery,
  calendarDays,
  categoryQuery,
  dayButtonClass,
  displayDate,
  draft,
  filterRef,
  filteredCategoryOptions,
  filteredLocationOptions,
  goToNextMonth,
  goToPreviousMonth,
  isCategoriesOpen,
  isDateOpen,
  isLocationOpen,
  isTypeOpen,
  monthLabel,
  openCategories,
  openLocation,
  removeCategory,
  selectDate,
  selectLocation,
  toggleCategories,
  toggleCategory,
  toggleDate,
  toggleLocation,
  toggleType,
  toggleTypeFilter,
  typeDotClass,
  weekdayLabels,
} = useSearchFilter(props, emit)

const isMobileFilterOpen = ref(false)
</script>

<style scoped>
.filter-scroll {
  scrollbar-color: #074b7b transparent;
  scrollbar-width: thin;
}

.filter-scroll::-webkit-scrollbar {
  width: 10px;
}

.filter-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.filter-scroll::-webkit-scrollbar-thumb {
  background-color: #074b7b;
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.filter-scroll::-webkit-scrollbar-button {
  background-color: #074b7b;
  border-radius: 999px;
  height: 12px;
}
</style>
