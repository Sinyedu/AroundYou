import { reactive, ref } from 'vue'

import {
  createAttraction,
  createCity,
  createEvent,
  uploadImageFile,
} from '@/api/contentApi'
import type { AttractionPayload, CityPayload, ContentType, EventPayload } from '@/types/content'

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const toOptionalNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

const getAuthToken = () => localStorage.getItem('token')

export const useCreateContent = () => {
  const selectedType = ref<ContentType>('event')
  const isSubmitting = ref(false)
  const isUploadingImage = ref(false)
  const message = ref('')

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
    rating: '',
    slugArrayText: '',
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
    rating: '',
    slugArrayText: '',
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
    rating: '',
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
      ...(toOptionalNumber(eventForm.rating) !== undefined
        ? { rating: toOptionalNumber(eventForm.rating) }
        : {}),
      slugArray: splitList(eventForm.slugArrayText),
      isAnnual: eventForm.isAnnual,
      startDate: eventForm.startDate,
      endDate: eventForm.endDate,
      openingHours: splitList(eventForm.openingHoursText),
    }

    await createEvent(payload, token)
  }

  const submitAttraction = async () => {
    if (!getAuthToken()) {
      throw new Error('You must be logged in to create an attraction.')
    }

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
      ...(toOptionalNumber(attractionForm.rating) !== undefined
        ? { rating: toOptionalNumber(attractionForm.rating) }
        : {}),
      slugArray: splitList(attractionForm.slugArrayText),
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
      ...(toOptionalNumber(cityForm.rating) !== undefined
        ? { rating: toOptionalNumber(cityForm.rating) }
        : {}),
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
    eventForm,
    attractionForm,
    cityForm,
    onHeroImageSelected,
    onImageArraySelected,
    submitSelected,
    typeButtonClass,
  }
}
