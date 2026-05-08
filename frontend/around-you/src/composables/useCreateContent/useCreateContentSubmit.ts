import { ref } from 'vue'
import { createAttraction, createCity, createEvent, uploadImageFile } from '@/api/contentApi'
import { createContentSuggestion } from '@/api/contentSuggestions.api'
import { useAuthService } from '@/api/authService'
import { getGeocodedCoordinates } from '@/api/geocoding.api'
import type { AttractionPayload, CityPayload, EventPayload } from '@/types/content'
import type { ContentSuggestionPayload, ContentSuggestionType } from '@/types/content-suggestion'
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

type ContentSubmissionDestination = 'created' | 'suggested'

const resolveGpsPosition = async (address: string, city: string) => {
  if (!address.trim() || !city.trim()) {
    throw new Error('Please enter both address and city.')
  }

  const location = await getGeocodedCoordinates(address.trim(), city.trim())
  return `${location.latitude},${location.longitude}`
}

const resolveCityGpsPosition = async (city: string) => {
  if (!city.trim()) {
    throw new Error('Indtast en by.')
  }

  const location = await getGeocodedCoordinates(null, city.trim())
  return `${location.latitude},${location.longitude}`
}

export const validateCityForm = (cityForm: Pick<CreateCityForm, 'tagLine'>) => {
  const tagLine = cityForm.tagLine.trim()

  if (!tagLine) {
    throw new Error('Indtast en tagline til byen.')
  }

  if (tagLine.length < 20 || tagLine.length > 100) {
    throw new Error('Byens tagline skal være mellem 20 og 100 tegn.')
  }
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
  const isSubmitting = ref(false)
  const isUploadingImage = ref(false)
  const { currentUser, isAdmin } = useAuthService()

  const submitContentByRole = async (
    type: ContentSuggestionType,
    payload: ContentSuggestionPayload,
    token: string | null,
  ): Promise<ContentSubmissionDestination> => {
    if (currentUser.value?.role === 'admin' || isAdmin.value) {
      if (type === 'event') {
        await createEvent(payload as EventPayload, token)
      } else if (type === 'attraction') {
        await createAttraction(payload as AttractionPayload, token)
      } else {
        await createCity(payload as CityPayload, token)
      }

      return 'created'
    }

    await createContentSuggestion(type, payload)
    return 'suggested'
  }

  const submitEvent = async (): Promise<ContentSubmissionDestination> => {
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

    return submitContentByRole('event', payload, token)
  }

  const submitAttraction = async (): Promise<ContentSubmissionDestination> => {
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

    return submitContentByRole('attraction', payload, token)
  }

  const submitCity = async (): Promise<ContentSubmissionDestination> => {
    validateCityForm(cityForm)

    if (!cityHeroImageFile.value) {
      throw new Error('Upload et billede til denne by.')
    }

    const token = getAuthToken()
    const gpsPosition = await resolveCityGpsPosition(cityForm.name)

    isUploadingImage.value = true

    const compressedHeroImage = await compressImageFile(cityHeroImageFile.value)
    const heroImage = await uploadImageFile(compressedHeroImage, token)

    const payload: CityPayload = {
      name: cityForm.name,
      tagLine: cityForm.tagLine.trim(),
      description: cityForm.description,
      heroImage,
      commune: cityForm.commune,
      region: cityForm.region,
      country: cityForm.country,
      gpsPosition,
      population: Number(cityForm.population) || 0,
      visitorCenter: cityForm.visitorCenter,
    }

    return submitContentByRole('city', payload, token)
  }

  const submitSelected = async (setMessage: CreateContentMessageSetter) => {
    try {
      isSubmitting.value = true
      setMessage('')

      let destination: ContentSubmissionDestination

      if (selectedType.value === 'event') {
        destination = await submitEvent()
      } else if (selectedType.value === 'attraction') {
        destination = await submitAttraction()
      } else {
        destination = await submitCity()
      }

      setMessage(
        destination === 'created'
          ? 'Indholdet er oprettet.'
          : 'Dit forslag er sendt til admin og afventer godkendelse.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Kunne ikke sende forslaget.')
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
