<template>
    <section ref="filterRef" class="w-full">
        <div class="rounded-full bg-[#C1D2DE] px-4 py-2 shadow-sm">
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex min-w-[180px] flex-1 items-center">
                    <div class="flex flex-col">
                        <!-- <span v-if="isLocationOpen"
                            class="mb-1 text-[11px] font-semibold uppercase pl-4 tracking-wide text-slate-500">
                            Lokation
                        </span> -->
                        <div
                            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <input v-model="draft.location" type="text" placeholder="Lokation"
                                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                @focus="openLocation" @input="openLocation" />
                            
                        </div>
                    </div>

                    <div v-if="isLocationOpen"
                        class="absolute left-0 top-full z-20 mt-2.5 w-56 rounded-2xl border-[5px] border-[#C1D2DE] bg-white p-2 shadow-lg">
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
                        <!-- <span v-if="isTypeOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Event / Attraktion
                        </span> -->
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

                <div class="relative flex min-w-[140px] flex-1 items-center">
                    <div class="flex flex-col">
                        <!-- <span v-if="isDateOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Dato
                        </span> -->
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
                        class="absolute left-1/2 top-full z-20 mt-2.5 w-[230px] -translate-x-1/2 rounded-[28px] bg-[#B8C7D4] p-2 shadow-lg">
                        <div class="flex items-center justify-between rounded-[24px] bg-[#C1D2DE] px-3 py-2">
                            <button type="button"
                                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-white/60"
                                @click="goToPreviousMonth">
                                <span aria-hidden="true">‹</span>
                            </button>
                            <span class="text-sm font-semibold text-slate-700">{{ monthLabel }}</span>
                            <button type="button"
                                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-white/60"
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
                        <!-- <span v-if="isCategoriesOpen"
                            class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Kategorier
                        </span> -->
                        <div
                            class="flex w-full items-center justify-between rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/70">
                            <input v-model="categoryQuery" type="text" placeholder="Kategorier"
                                class="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                @focus="openCategories" @input="openCategories"
                                @keydown.enter.prevent="addCategoryFromQuery" />

                        </div>
                    </div>

                    <div v-if="isCategoriesOpen"
                        class="absolute right-0 top-full z-20 mt-2.5 w-56 rounded-2xl border-[5px] border-[#C1D2DE] bg-white p-2 shadow-lg">
                        <div class="max-h-40 space-y-1 overflow-y-auto pr-1">
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

                <!-- <div class="ml-auto flex items-center gap-2">
                    <button type="button"
                        class="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow">
                        Sog
                    </button>
                </div> -->
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"

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
const filterRef = ref<HTMLElement | null>(null)
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

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

const removeCategory = (category: string) => {
    draft.categories = draft.categories.filter((item) => item !== category)
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

const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as Node | null
    if (!filterRef.value || !target) {
        return
    }
    if (!filterRef.value.contains(target)) {
        closeAll()
    }
}

onMounted(() => {
    document.addEventListener("mousedown", handleOutsideClick)
})

onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleOutsideClick)
})

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

const toggleDate = () => {
    const next = !isDateOpen.value
    closeAll()
    isDateOpen.value = next
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

const monthLabel = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1)
    return date.toLocaleDateString("da-DK", {
        month: "long",
        year: "numeric",
    })
})

const weekdayLabels = ["M", "T", "O", "T", "F", "L", "S"]

const calendarDays = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value
    const firstDay = new Date(year, month, 1).getDay()
    const offset = (firstDay + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = Array.from({ length: 42 }, (_, index) => {
        const dayNumber = index - offset + 1
        return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null
    })
    return cells
})

const displayDate = computed(() => {
    if (!draft.date) {
        return ""
    }
    const date = new Date(draft.date)
    if (Number.isNaN(date.getTime())) {
        return draft.date
    }
    return date.toLocaleDateString("da-DK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
})

const dayButtonClass = (day: number | null) => {
    if (!day) {
        return "text-transparent"
    }
    const isSelected = isSelectedDay(day)
    return [
        "text-[#1E5A88] hover:bg-[#C1D2DE]",
        isSelected ? "bg-[#C1D2DE]" : "bg-transparent",
    ].join(" ")
}

const isSelectedDay = (day: number) => {
    if (!draft.date) {
        return false
    }
    const selected = new Date(draft.date)
    return (
        selected.getFullYear() === currentYear.value &&
        selected.getMonth() === currentMonth.value &&
        selected.getDate() === day
    )
}

const selectDate = (day: number | null) => {
    if (!day) {
        return
    }
    const selected = new Date(currentYear.value, currentMonth.value, day)
    const year = selected.getFullYear()
    const month = String(selected.getMonth() + 1).padStart(2, "0")
    const date = String(selected.getDate()).padStart(2, "0")
    draft.date = `${year}-${month}-${date}`
    isDateOpen.value = false
}

const goToPreviousMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value -= 1
        return
    }
    currentMonth.value -= 1
}

const goToNextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value += 1
        return
    }
    currentMonth.value += 1
}
</script>
