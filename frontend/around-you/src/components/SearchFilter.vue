<template>
    <section ref="filterRef" class="w-full">
        <div class="rounded-full bg-[#C1D2DE] px-4 py-2 shadow-sm">
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex min-w-[180px] flex-1 items-center">
                    <div class="flex flex-col">

                        <div
                            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <input v-model="draft.location" type="text" placeholder="Lokation"
                                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-700"
                                @focus="openLocation" @input="openLocation" />

                        </div>
                    </div>

                    <div v-if="isLocationOpen"
                        class="absolute left-0 top-full z-20 mt-2.5 w-56 rounded-2xl border-[5px] border-[#C1D2DE] bg-white p-2 shadow-lg">
                        <div class="filter-scroll max-h-40 space-y-1 overflow-y-auto pr-1">
                            <button v-for="location in filteredLocationOptions" :key="location" type="button"
                                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                                @click="selectLocation(location)">
                                <span>{{ location }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

                <div class="relative flex min-w-[200px] flex-1 items-center">
                    <div class="flex flex-col">
                        <button type="button"
                            class="flex items-center gap-3 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
                            @click="toggleType">
                            <span>Event / Attraktion</span>
                        </button>
                    </div>

                    <div v-if="isTypeOpen"
                        class="absolute top-full z-20 mt-2.5 w-56 rounded-2xl  bg-[#C1D2DE] p-3 shadow-lg">
                        <div class="flex items-center justify-between rounded-xl bg-[#C1D2DE] px-4 py-2">
                            <button type="button" class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                                @click="toggleTypeFilter('event')">
                                <span :class="typeDotClass('event')" />
                                Event
                            </button>
                            <button type="button" class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                                @click="toggleTypeFilter('attraction')">
                                <span :class="typeDotClass('attraction')" />
                                Attraction
                            </button>
                        </div>
                        <button type="button"
                            class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500"
                            @click="draft.types = []">
                            Ryd type
                        </button>
                    </div>
                </div>

                <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

                <div class="relative flex min-w-[140px] flex-1 items-center">
                    <div class="flex flex-col">
                        <button type="button"
                            class="flex w-full items-center justify-between gap-2 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
                            @click="toggleDate">
                            <span class="min-w-[40px]">Dato</span>
                            <span class="text-sm text-slate-600">
                                {{ displayDate || "Vælg" }}
                            </span>
                        </button>
                    </div>

                    <div v-if="isDateOpen"
                        class="absolute left-1/2 top-full z-20 mt-2.5 w-[230px] -translate-x-1/2 rounded-[28px] bg-[#C1D2DE] p-2 shadow-lg">
                        <div class="flex items-center justify-between rounded-[24px] bg-white px-3 py-2">
                            <button type="button"
                                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-[#C1D2DE]/60"
                                @click="goToPreviousMonth">
                                <span aria-hidden="true">‹</span>
                            </button>
                            <span class="text-sm font-semibold text-slate-700">{{ monthLabel }}</span>
                            <button type="button"
                                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-[#C1D2DE]/60"
                                @click="goToNextMonth">
                                <span aria-hidden="true">›</span>
                            </button>
                        </div>
                        <div class="mt-3 rounded-[22px] bg-white px-3 pb-3 pt-2">
                            <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#1E5A88]">
                                <span v-for="day in weekdayLabels" :key="day">{{ day }}</span>
                            </div>
                            <div class="mt-2 grid grid-cols-7 gap-1 text-center text-sm text-[#1E5A88]">
                                <button v-for="(day, index) in calendarDays" :key="index" type="button"
                                    class="h-7 w-7 rounded-full text-sm font-semibold" :class="dayButtonClass(day)"
                                    :disabled="!day" @click="selectDate(day)">
                                    {{ day || "" }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

                <div class="relative flex min-w-[200px] flex-1 items-center">
                    <div class="flex flex-col">
                        <div
                            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <input v-model="categoryQuery" type="text" placeholder="Kategorier"
                                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-700"
                                @focus="openCategories" @input="openCategories"
                                @keydown.enter.prevent="addCategoryFromQuery" />

                        </div>
                    </div>

                    <div v-if="isCategoriesOpen"
                        class="absolute right-0 top-full z-20 mt-2.5 w-56 rounded-2xl border-[5px] border-[#C1D2DE] bg-white p-2 shadow-lg">
                        <div class="filter-scroll max-h-40 space-y-1 overflow-y-auto pr-1">
                            <button v-for="category in filteredCategoryOptions" :key="category" type="button"
                                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                                @click="toggleCategory(category)">
                                <span>{{ category }}</span>

                            </button>
                        </div>
                        <div v-if="draft.categories.length" class="mt-3 -mb-2 -mx-2 rounded-b-1xl bg-[#C1D2DE] p-3">
                            <div class="flex flex-wrap gap-2">
                                <button v-for="category in draft.categories" :key="category" type="button"
                                    class="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1E5A88]"
                                    @click="removeCategory(category)">
                                    <span>{{ category }}</span>
                                    <span class="text-sm font-bold leading-none text-[#1E5A88]">×</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

        <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

        <div class="relative flex min-w-[200px] flex-1 items-center">
          <div class="flex flex-col">
            <button
              type="button"
              class="flex items-center gap-3 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
              @click="toggleType"
            >
              <span>Event / Attraktion</span>
            </button>
          </div>

          <div
            v-if="isTypeOpen"
            class="absolute top-full z-20 mt-2.5 w-56 rounded-2xl bg-[#C1D2DE] p-3 shadow-lg"
          >
            <div class="flex items-center justify-between rounded-xl bg-[#C1D2DE] px-4 py-2">
              <button
                type="button"
                class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                @click="draft.type = 'event'"
              >
                <span :class="typeDotClass('event')" />
                Event
              </button>
              <button
                type="button"
                class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                @click="draft.type = 'attraction'"
              >
                <span :class="typeDotClass('attraction')" />
                Attraction
              </button>
            </div>
            <button
              type="button"
              class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500"
              @click="draft.type = 'all'"
            >
              Ryd type
            </button>
          </div>
        </div>

        <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

        <div class="relative flex min-w-[140px] flex-1 items-center">
          <div class="flex flex-col">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-2 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
              @click="toggleDate"
            >
              <span class="min-w-[40px]">Dato</span>
              <span class="text-sm text-slate-600">
                {{ displayDate || 'Vælg' }}
              </span>
            </button>
          </div>

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
              <div
                class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#1E5A88]"
              >
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
                  {{ day || '' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

        <div class="relative flex min-w-[200px] flex-1 items-center">
          <div class="flex flex-col">
            <div
              class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
            >
              <input
                v-model="categoryQuery"
                type="text"
                placeholder="Kategorier"
                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-700"
                @focus="openCategories"
                @input="openCategories"
                @keydown.enter.prevent="addCategoryFromQuery"
              />
            </div>
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
            <div
              v-if="draft.categories.length"
              class="mt-3 -mb-2 -mx-2 rounded-b-1xl bg-[#C1D2DE] p-3"
            >
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
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from "vue"
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
  toggleCategory,
  toggleDate,
  toggleType,
  typeDotClass,
  weekdayLabels,
} = useSearchFilter(props, emit)
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
