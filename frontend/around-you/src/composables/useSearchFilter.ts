import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { SearchFilterType, SearchFilters } from '@/types/search'

type SearchFilterProps = {
  modelValue: SearchFilters
  locationOptions?: string[]
  categoryOptions?: string[]
}

type SearchFilterEmit = (event: 'update:modelValue', value: SearchFilters) => void

export function useSearchFilter(props: SearchFilterProps, emit: SearchFilterEmit) {
  const isLocationOpen = ref(false)
  const isTypeOpen = ref(false)
  const isDateOpen = ref(false)
  const isCategoriesOpen = ref(false)
  const categoryQuery = ref('')
  const filterRef = ref<HTMLElement | null>(null)
  const today = new Date()
  const currentMonth = ref(today.getMonth())
  const currentYear = ref(today.getFullYear())
  const locationOptionValues = computed(() => props.locationOptions ?? [])
  const categoryOptionValues = computed(() => props.categoryOptions ?? [])

  const draft = reactive<SearchFilters>({
    location: props.modelValue.location,
    types: [...props.modelValue.types],
    date: props.modelValue.date,
    categories: [...props.modelValue.categories],
  })

  let isSyncingFromParent = false

  watch(
    () => props.modelValue,
    (value) => {
      isSyncingFromParent = true
      draft.location = value.location
      draft.types = [...value.types]
      draft.date = value.date
      draft.categories = [...value.categories]
      isSyncingFromParent = false
    },
    { deep: true },
  )

  watch(
    draft,
    () => {
      if (isSyncingFromParent) {
        return
      }

      emit('update:modelValue', {
        location: draft.location,
        types: [...draft.types],
        date: draft.date,
        categories: [...draft.categories],
      })
    },
    { deep: true },
  )

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
    document.addEventListener('mousedown', handleOutsideClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleOutsideClick)
  })

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

  const openLocation = () => {
    closeAll()
    isLocationOpen.value = true
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
    const options = locationOptionValues.value

    if (!query.length) {
      return options
    }

    return options.filter((location) => location.toLowerCase().includes(query))
  })

  const filteredCategoryOptions = computed(() => {
    const query = categoryQuery.value.trim().toLowerCase()
    const options = categoryOptionValues.value

    if (!query.length) {
      return options
    }

    return options.filter((category) => category.toLowerCase().includes(query))
  })

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

  const addCategoryFromQuery = () => {
    const query = categoryQuery.value.trim()

    if (!query.length) {
      return
    }

    if (!draft.categories.includes(query)) {
      draft.categories = [...draft.categories, query]
    }

    categoryQuery.value = ''
    isCategoriesOpen.value = false
  }

  const toggleTypeFilter = (type: SearchFilterType) => {
    if (draft.types.includes(type)) {
      draft.types = draft.types.filter((item) => item !== type)
      return
    }

    draft.types = [...draft.types, type]
  }

  const typeDotClass = (value: SearchFilterType) => {
    const isActive = draft.types.includes(value)

    return [
      'h-3 w-3 rounded-sm border border-slate-400',
      isActive ? 'bg-slate-700' : 'bg-white',
    ].join(' ')
  }

  const monthLabel = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1)

    return date.toLocaleDateString('da-DK', {
      month: 'long',
      year: 'numeric',
    })
  })

  const weekdayLabels = ['M', 'T', 'O', 'T', 'F', 'L', 'S']

  const calendarDays = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value
    const firstDay = new Date(year, month, 1).getDay()
    const offset = (firstDay + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - offset + 1
      return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null
    })
  })

  const displayDate = computed(() => {
    if (!draft.date) {
      return ''
    }

    const date = new Date(draft.date)

    if (Number.isNaN(date.getTime())) {
      return draft.date
    }

    return date.toLocaleDateString('da-DK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  })

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

  const dayButtonClass = (day: number | null) => {
    if (!day) {
      return 'text-transparent'
    }

    const isSelected = isSelectedDay(day)

    return [
      'text-[#1E5A88] hover:bg-[#C1D2DE]',
      isSelected ? 'bg-[#C1D2DE]' : 'bg-transparent',
    ].join(' ')
  }

  const selectDate = (day: number | null) => {
    if (!day) {
      return
    }

    const selected = new Date(currentYear.value, currentMonth.value, day)
    const year = selected.getFullYear()
    const month = String(selected.getMonth() + 1).padStart(2, '0')
    const date = String(selected.getDate()).padStart(2, '0')

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

  return {
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
    toggleTypeFilter,
    typeDotClass,
    weekdayLabels,
  }
}
