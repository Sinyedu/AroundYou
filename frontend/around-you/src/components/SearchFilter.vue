<template>
    <section class="w-full">
        <div class="rounded-full bg-[#C1D2DE] px-4 py-2 shadow-sm">
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex min-w-[180px] flex-1 items-center">
                    <div class="flex flex-col">
                        <span v-if="isLocationOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Lokation
                        </span>
                        <div
                            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <input v-model="draft.location" type="text" placeholder="Lokation"
                                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                @focus="openLocation" @input="openLocation" />
                            <span class="text-slate-400">▾</span>
                        </div>
                    </div>

                    <div v-if="isLocationOpen"
                        class="absolute left-0 top-full z-20 mt-2.5 w-56 rounded-2xl border border-slate-200 bg-[#C1D2DE] p-2 shadow-lg">
                        <div class="max-h-40 space-y-1 overflow-y-auto pr-1">
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
                        <span v-if="isTypeOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Event / Attraktion
                        </span>
                        <button type="button"
                            class="flex items-center gap-3 rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70"
                            @click="toggleType">
                            <span>Event / Attraktion</span>
                        </button>
                    </div>

                    <div v-if="isTypeOpen"
                        class="absolute top-full z-20 mt-2.5 w-56 rounded-2xl border border-slate-200 bg-[#C1D2DE] p-3 shadow-lg">
                        <div class="flex items-center justify-between rounded-xl bg-[#C1D2DE] px-4 py-2">
                            <button type="button" class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                                @click="draft.type = 'event'">
                                <span :class="typeDotClass('event')" />
                                Event
                            </button>
                            <button type="button" class="flex items-center gap-2 text-sm font-semibold text-slate-700"
                                @click="draft.type = 'attraction'">
                                <span :class="typeDotClass('attraction')" />
                                Attraction
                            </button>
                        </div>
                        <button type="button"
                            class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500"
                            @click="draft.type = 'all'">
                            Ryd type
                        </button>
                    </div>
                </div>

                <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

                <div class="flex min-w-[140px] flex-1 items-center">
                    <div class="flex flex-col">
                        <span v-if="isDateOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Dato
                        </span>
                        <label
                            class="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <span class="min-w-[40px]">Dato</span>
                            <input v-model="draft.date" type="date"
                                class="w-full bg-transparent text-sm text-slate-600 outline-none" @focus="openDate"
                                @blur="isDateOpen = false" />
                        </label>
                    </div>
                </div>

                <div class="hidden h-6 w-px bg-slate-300/70 sm:block" />

                <div class="relative flex min-w-[200px] flex-1 items-center">
                    <div class="flex flex-col">
                        <span v-if="isCategoriesOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Kategorier
                        </span>
                        <div
                            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <input v-model="categoryQuery" type="text" placeholder="Kategorier"
                                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                @focus="openCategories" @input="openCategories"
                                @keydown.enter.prevent="addCategoryFromQuery" />
                            <span class="text-slate-400">▾</span>
                        </div>
                    </div>

                    <div v-if="isCategoriesOpen"
                        class="absolute right-0 top-full z-20 mt-2.5 w-60 rounded-2xl border border-slate-200 bg-[#C1D2DE] p-2 shadow-lg">
                        <div class="max-h-40 space-y-1 overflow-y-auto pr-1">
                            <button v-for="category in filteredCategoryOptions" :key="category" type="button"
                                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                                @click="toggleCategory(category)">
                                <span>{{ category }}</span>
                                <span v-if="draft.categories.includes(category)"
                                    class="text-xs font-semibold text-slate-400">
                                    valgt
                                </span>
                            </button>
                        </div>
                        <div class="mt-2 flex flex-wrap gap-2">
                            <span v-for="category in draft.categories" :key="category"
                                class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                {{ category }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="ml-auto flex items-center gap-2">
                    <button type="button"
                        class="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow">
                        Sog
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"

type SearchFilters = {
    location: string
    type: "all" | "event" | "attraction"
    date: string
    categories: string[]
}

const props = defineProps<{ modelValue: SearchFilters }>()
const emit = defineEmits<{ (event: "update:modelValue", value: SearchFilters): void }>()

const locationOptions = [
    "Aalborg",
    "Aarhus",
    "Odense",
    "Esbjerg",
    "Ribe",
    "Kolding",
    "Skagen",
]

const categoryOptions = [
    "Music",
    "Food",
    "Art",
    "Nature",
    "Family",
    "Sport",
]

const isLocationOpen = ref(false)
const isTypeOpen = ref(false)
const isDateOpen = ref(false)
const isCategoriesOpen = ref(false)
const categoryQuery = ref("")

const draft = reactive<SearchFilters>({
    location: props.modelValue.location,
    type: props.modelValue.type,
    date: props.modelValue.date,
    categories: [...props.modelValue.categories],
})

let isSyncingFromParent = false

watch(
    () => props.modelValue,
    (value) => {
        isSyncingFromParent = true
        draft.location = value.location
        draft.type = value.type
        draft.date = value.date
        draft.categories = [...value.categories]
        isSyncingFromParent = false
    },
    { deep: true }
)

watch(
    draft,
    () => {
        if (isSyncingFromParent) {
            return
        }
        emit("update:modelValue", {
            location: draft.location,
            type: draft.type,
            date: draft.date,
            categories: [...draft.categories],
        })
    },
    { deep: true }
)

const toggleCategory = (category: string) => {
    if (draft.categories.includes(category)) {
        draft.categories = draft.categories.filter((item) => item !== category)
        return
    }

    draft.categories = [...draft.categories, category]
}

const clearFilters = () => {
    draft.location = ""
    draft.type = "all"
    draft.date = ""
    draft.categories = []
}

const closeAll = () => {
    isLocationOpen.value = false
    isTypeOpen.value = false
    isDateOpen.value = false
    isCategoriesOpen.value = false
}

const toggleLocation = () => {
    const next = !isLocationOpen.value
    closeAll()
    isLocationOpen.value = next
}

const toggleType = () => {
    const next = !isTypeOpen.value
    closeAll()
    isTypeOpen.value = next
}

const toggleCategories = () => {
    const next = !isCategoriesOpen.value
    closeAll()
    isCategoriesOpen.value = next
}

const openLocation = () => {
    closeAll()
    isLocationOpen.value = true
}

const openDate = () => {
    closeAll()
    isDateOpen.value = true
}

const openCategories = () => {
    closeAll()
    isCategoriesOpen.value = true
}

const selectLocation = (location: string) => {
    draft.location = location
    isLocationOpen.value = false
}

const filteredLocationOptions = computed(() => {
    const query = draft.location.trim().toLowerCase()
    if (!query.length) {
        return locationOptions
    }
    return locationOptions.filter((location) =>
        location.toLowerCase().includes(query)
    )
})

const filteredCategoryOptions = computed(() => {
    const query = categoryQuery.value.trim().toLowerCase()
    if (!query.length) {
        return categoryOptions
    }
    return categoryOptions.filter((category) =>
        category.toLowerCase().includes(query)
    )
})

const addCategoryFromQuery = () => {
    const query = categoryQuery.value.trim()
    if (!query.length) {
        return
    }
    if (!draft.categories.includes(query)) {
        draft.categories = [...draft.categories, query]
    }
    categoryQuery.value = ""
    isCategoriesOpen.value = false
}

const typeDotClass = (value: SearchFilters["type"]) => {
    const isActive = draft.type === value
    return [
        "h-3 w-3 rounded-sm border border-slate-400",
        isActive ? "bg-slate-700" : "bg-white",
    ].join(" ")
}
</script>
