import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  createAttraction,
  createCity,
  createEvent,
  uploadImageFile,
} from '@/api/contentApi'
import { fetchAttractions, fetchEvents } from '@/api/searchApi'
import type { AttractionPayload, CityPayload, ContentType, EventPayload } from '@/types/content'

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const getAuthToken = () => localStorage.getItem('token')

export const useCreateContent = () => {
  const router = useRouter()
  const selectedType = ref<ContentType>('event')
  const isSubmitting = ref(false)
  const isUploadingImage = ref(false)
  const message = ref('')
  const categoryOptions = ref<string[]>([])

  const eventHeroImageFile = ref<File | null>(null)
  const attractionHeroImageFile = ref<File | null>(null)
  const cityHeroImageFile = ref<File | null>(null)
  const eventImageArrayFiles = ref<File[]>([])
  const attractionImageArrayFiles = ref<File[]>([])

  const eventForm = reactive({
    name: '',
    description: '',
    price: '',
    link: '',
    gpsPosition: '',
    slugArray: [] as string[],
    isAnnual: false,
    startDate: '',
    endDate: '',
    openingHoursText: '',
  })

  const attractionForm = reactive({
    name: '',
    description: '',
    price: '',
    link: '',
    gpsPosition: '',
    slugArray: [] as string[],
    openingHoursText: '',
  })

  const cityForm = reactive({
    name: '',
    description: '',
    commune: '',
    region: '',
    country: '',
    gpsPosition: '',
    population: '',
    visitorCenter: '',
  })

  const onHeroImageSelected = (contentType: ContentType, event: Event) => {
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0]

    if (!file) {
      return
    }

    if (contentType === 'event') {
      eventHeroImageFile.value = file
    } else if (contentType === 'attraction') {
      attractionHeroImageFile.value = file
    } else {
      cityHeroImageFile.value = file
    }

    message.value = ''
  }

  const onImageArraySelected = (contentType: 'event' | 'attraction', event: Event) => {
    const target = event.target as HTMLInputElement | null
    const files = target?.files ? Array.from(target.files) : []

    if (!files.length) {
      return
    }

    if (contentType === 'event') {
      eventImageArrayFiles.value = files
    } else {
      attractionImageArrayFiles.value = files
    }

    message.value = ''
  }

  const submitEvent = async () => {
    if (!eventHeroImageFile.value) {
      throw new Error('Please upload an image for this event.')
    }

    isUploadingImage.value = true

    const token = getAuthToken()
    const heroImage = await uploadImageFile(eventHeroImageFile.value, token)
    const imageArray = await Promise.all(
      eventImageArrayFiles.value.map((file) => uploadImageFile(file, token)),
    )

    const payload: EventPayload = {
      name: eventForm.name,
      description: eventForm.description,
      heroImage,
      imageArray,
      price: Number(eventForm.price) || 0,
      link: eventForm.link,
      gpsPosition: eventForm.gpsPosition,
      slugArray: eventForm.slugArray,
      isAnnual: eventForm.isAnnual,
      startDate: eventForm.startDate,
      endDate: eventForm.endDate,
      openingHours: splitList(eventForm.openingHoursText),
    }

    await createEvent(payload, token)
  }

  const submitAttraction = async () => {
    if (!attractionHeroImageFile.value) {
      throw new Error('Please upload an image for this attraction.')
    }

    isUploadingImage.value = true

    const token = getAuthToken()
    const heroImage = await uploadImageFile(attractionHeroImageFile.value, token)
    const imageArray = await Promise.all(
      attractionImageArrayFiles.value.map((file) => uploadImageFile(file, token)),
    )

    const payload: AttractionPayload = {
      name: attractionForm.name,
      description: attractionForm.description,
      heroImage,
      imageArray,
      price: Number(attractionForm.price) || 0,
      link: attractionForm.link,
      gpsPosition: attractionForm.gpsPosition,
      slugArray: attractionForm.slugArray,
      openingHours: splitList(attractionForm.openingHoursText),
    }

    await createAttraction(payload, token)
  }

  const submitCity = async () => {
    if (!cityHeroImageFile.value) {
      throw new Error('Please upload an image for this city.')
    }

    isUploadingImage.value = true

    const token = getAuthToken()
    const heroImage = await uploadImageFile(cityHeroImageFile.value, token)

    const payload: CityPayload = {
      name: cityForm.name,
      description: cityForm.description,
      heroImage,
      commune: cityForm.commune,
      region: cityForm.region,
      country: cityForm.country,
      gpsPosition: cityForm.gpsPosition,
      population: Number(cityForm.population) || 0,
      visitorCenter: cityForm.visitorCenter,
    }

    await createCity(payload, token)
  }

  const submitSelected = async () => {
    try {
      isSubmitting.value = true
      message.value = ''

      if (selectedType.value === 'event') {
        await submitEvent()
      } else if (selectedType.value === 'attraction') {
        await submitAttraction()
      } else {
        await submitCity()
      }

      message.value = `${selectedType.value} saved successfully.`

      if (selectedType.value === 'attraction') {
        await router.push({ name: 'search', query: { type: 'attraction' } })
      }
    } catch (error) {
      message.value = error instanceof Error ? error.message : 'Save failed.'
    } finally {
      isUploadingImage.value = false
      isSubmitting.value = false
    }
  }

  const typeButtonClass = (value: ContentType) => {
    const isActive = selectedType.value === value
    return isActive
      ? 'bg-[#094b7b] text-white'
      : 'bg-white text-[#094b7b] border border-[#094b7b]/20'
  }

  const fetchCategoryOptions = async () => {
    try {
      const [events, attractions] = await Promise.all([fetchEvents(), fetchAttractions()])
      const unique = new Set(
        [...events, ...attractions]
          .flatMap((item) => item.slugArray ?? [])
          .map((slug) => slug.trim().toLowerCase())
          .filter(Boolean),
      )
      categoryOptions.value = Array.from(unique).sort()
    } catch (error) {
      console.error('Could not fetch category options:', error)
    }
  }

  onMounted(() => {
    void fetchCategoryOptions()
  })

  return {
    selectedType,
    isSubmitting,
    isUploadingImage,
    message,
    eventHeroImageFile,
    attractionHeroImageFile,
    cityHeroImageFile,
    eventImageArrayFiles,
    attractionImageArrayFiles,
    categoryOptions,
    eventForm,
    attractionForm,
    cityForm,
    onHeroImageSelected,
    onImageArraySelected,
    submitSelected,
    typeButtonClass,
  }
}
