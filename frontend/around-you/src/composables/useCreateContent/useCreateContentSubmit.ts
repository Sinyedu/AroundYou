import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createAttraction, createCity, createEvent, uploadImageFile } from '@/api/contentApi'
import { getGeocodedCoordinates } from '@/api/geocoding.api'
import type { AttractionPayload, CityPayload, ContentType, EventPayload } from '@/types/content'
import type {
  CreateAttractionForm,
  CreateCityForm,
  CreateContentFileArrayRef,
  CreateContentFileRef,
  CreateContentFormType,
  CreateContentMessageSetter,
  CreateEventForm,
} from '@/types/content/useCreateContent'
import { compressImageFile } from '@/utils/imageCompressor'

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const getAuthToken = () => localStorage.getItem('token')

const resolveGpsPosition = async (address: string, city: string) => {
  if (!address.trim() || !city.trim()) {
    throw new Error('Please enter both address and city.')
  }

  const location = await getGeocodedCoordinates(address.trim(), city.trim())
  return `${location.latitude},${location.longitude}`
}

export const useCreateContentSubmit = (
  selectedType: CreateContentFormType,
  eventForm: CreateEventForm,
  attractionForm: CreateAttractionForm,
  cityForm: CreateCityForm,
  eventHeroImageFile: CreateContentFileRef,
  attractionHeroImageFile: CreateContentFileRef,
  cityHeroImageFile: CreateContentFileRef,
  eventImageArrayFiles: CreateContentFileArrayRef,
  attractionImageArrayFiles: CreateContentFileArrayRef,
  compressImageFiles: (files: File[]) => Promise<File[]>,
) => {
  const router = useRouter()
  const isSubmitting = ref(false)
  const isUploadingImage = ref(false)

  const submitEvent = async () => {
    if (!eventHeroImageFile.value) {
      throw new Error('Upload et billede til dette event.')
    }

    const token = getAuthToken()
    const gpsPosition = await resolveGpsPosition(eventForm.address, eventForm.city)

    isUploadingImage.value = true

    const compressedHeroImage = await compressImageFile(eventHeroImageFile.value)
    const compressedImageArray = await compressImageFiles(eventImageArrayFiles.value)
    const heroImage = await uploadImageFile(compressedHeroImage, token)
    const imageArray = await Promise.all(
      compressedImageArray.map((file) => uploadImageFile(file, token)),
    )

    const payload: EventPayload = {
      name: eventForm.name,
      description: eventForm.description,
      heroImage,
      imageArray,
      price: Number(eventForm.price) || 0,
      link: eventForm.link,
      gpsPosition,
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
      throw new Error('Upload et billede til denne attraktion.')
    }

    const token = getAuthToken()
    const gpsPosition = await resolveGpsPosition(attractionForm.address, attractionForm.city)

    isUploadingImage.value = true

    const compressedHeroImage = await compressImageFile(attractionHeroImageFile.value)
    const compressedImageArray = await compressImageFiles(attractionImageArrayFiles.value)
    const heroImage = await uploadImageFile(compressedHeroImage, token)
    const imageArray = await Promise.all(
      compressedImageArray.map((file) => uploadImageFile(file, token)),
    )

    const payload: AttractionPayload = {
      name: attractionForm.name,
      description: attractionForm.description,
      heroImage,
      imageArray,
      price: Number(attractionForm.price) || 0,
      link: attractionForm.link,
      gpsPosition,
      slugArray: attractionForm.slugArray,
      openingHours: splitList(attractionForm.openingHoursText),
    }

    await createAttraction(payload, token)
  }

  const submitCity = async () => {
    if (!cityHeroImageFile.value) {
      throw new Error('Upload et billede til denne by.')
    }

    const token = getAuthToken()
    const gpsPosition = await resolveGpsPosition(cityForm.address, cityForm.name)

    isUploadingImage.value = true

    const compressedHeroImage = await compressImageFile(cityHeroImageFile.value)
    const heroImage = await uploadImageFile(compressedHeroImage, token)

    const payload: CityPayload = {
      name: cityForm.name,
      description: cityForm.description,
      heroImage,
      commune: cityForm.commune,
      region: cityForm.region,
      country: cityForm.country,
      gpsPosition,
      population: Number(cityForm.population) || 0,
      visitorCenter: cityForm.visitorCenter,
    }

    await createCity(payload, token)
  }

  const submitSelected = async (setMessage: CreateContentMessageSetter) => {
    try {
      isSubmitting.value = true
      setMessage('')

      if (selectedType.value === 'event') {
        await submitEvent()
      } else if (selectedType.value === 'attraction') {
        await submitAttraction()
      } else {
        await submitCity()
      }

      setMessage(`${selectedType.value} saved successfully.`)

      if (selectedType.value === 'attraction') {
        await router.push({ name: 'search', query: { type: 'attraction' } })
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      isUploadingImage.value = false
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    isUploadingImage,
    submitEvent,
    submitAttraction,
    submitCity,
    submitSelected,
  }
}
