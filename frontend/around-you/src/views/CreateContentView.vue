<template>
  <main class="min-h-screen bg-[#C1D2DE] px-4 py-12">
    <section class="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]">
      <div class="border-b border-[#094b7b]/10 bg-[#C1D2DE] px-8 py-8">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#de5826]">Around You</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-[#094b7b]">{{ title }}</h1>
        <p class="mt-2 text-sm text-slate-700">{{ description }}</p>
      </div>

      <div class="px-8 py-10">
        <div class="mb-6 flex flex-wrap items-center gap-3">
          <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="typeButtonClass('event')" @click="selectedType = 'event'">
            Event
          </button>
          <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="typeButtonClass('attraction')" @click="selectedType = 'attraction'">
            Attraction
          </button>
          <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="typeButtonClass('city')" @click="selectedType = 'city'">
            City
          </button>
        </div>

        <p v-if="message" class="mb-4 rounded-xl bg-[#C1D2DE] px-4 py-3 text-sm font-semibold text-[#094b7b]">
          {{ message }}
        </p>

        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submitSelected">
          <template v-if="selectedType === 'event'">
            <input v-model="eventForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero image file</label>
              <input type="file" accept="image/*" capture="environment"
                @change="(event) => onHeroImageSelected('event', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="eventHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Selected: {{
                eventHeroImageFile.name }}</p>
            </div>
            <input v-model="eventForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Price" />
            <input v-model="eventForm.link" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Link" />
            <input v-model="eventForm.gpsPosition" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="GPS (lat,lng)" />
            <input v-model="eventForm.rating" type="number" step="0.1"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Rating" />
            <input v-model="eventForm.startDate" type="date" class="rounded-xl border border-slate-200 px-4 py-3" />
            <input v-model="eventForm.endDate" type="date" class="rounded-xl border border-slate-200 px-4 py-3" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Additional image files</label>
              <input type="file" multiple accept="image/*" capture="environment"
                @change="(event) => onImageArraySelected('event', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p class="mt-2 text-xs text-slate-600">{{ eventImageArrayFiles.length }} image(s) selected</p>
            </div>
            <input v-model="eventForm.slugArrayText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Categories (comma separated)" />
            <input v-model="eventForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Opening hours (comma separated)" />
            <label class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
              <input v-model="eventForm.isAnnual" type="checkbox" class="h-4 w-4" />
              Annual event
            </label>
            <textarea v-model="eventForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Description"></textarea>
          </template>

          <template v-if="selectedType === 'attraction'">
            <input v-model="attractionForm.name" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Name" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero image file</label>
              <input type="file" accept="image/*" capture="environment"
                @change="(event) => onHeroImageSelected('attraction', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="attractionHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Selected: {{
                attractionHeroImageFile.name }}</p>
            </div>
            <input v-model="attractionForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Price" />
            <input v-model="attractionForm.link" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Link" />
            <input v-model="attractionForm.gpsPosition" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="GPS (lat,lng)" />
            <input v-model="attractionForm.rating" type="number" step="0.1"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Rating" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Additional image files</label>
              <input type="file" multiple accept="image/*" capture="environment"
                @change="(event) => onImageArraySelected('attraction', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p class="mt-2 text-xs text-slate-600">{{ attractionImageArrayFiles.length }} image(s) selected</p>
            </div>
            <input v-model="attractionForm.slugArrayText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Categories (comma separated)" />
            <input v-model="attractionForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Opening hours (comma separated)" />
            <textarea v-model="attractionForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Description"></textarea>
          </template>

          <template v-if="selectedType === 'city'">
            <input v-model="cityForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero image file</label>
              <input type="file" accept="image/*" capture="environment"
                @change="(event) => onHeroImageSelected('city', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="cityHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Selected: {{
                cityHeroImageFile.name }}</p>
            </div>
            <input v-model="cityForm.commune" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Commune" />
            <input v-model="cityForm.region" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Region" />
            <input v-model="cityForm.country" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Country" />
            <input v-model="cityForm.gpsPosition" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="GPS (lat,lng)" />
            <input v-model="cityForm.population" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Population" />
            <input v-model="cityForm.visitorCenter" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Visitor center" />
            <input v-model="cityForm.rating" type="number" step="0.1"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Rating" />
            <textarea v-model="cityForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Description"></textarea>
          </template>

          <button type="submit"
            class="rounded-full bg-[#094b7b] px-6 py-3 text-sm font-semibold text-white sm:col-span-2"
            :disabled="isSubmitting || isUploadingImage">
            {{ isUploadingImage ? "Uploading image..." : `Save ${selectedType}` }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"

type ContentType = "event" | "attraction" | "city"

type EventPayload = {
  name: string
  description: string
  heroImage: string
  imageArray: string[]
  price: number
  link: string
  gpsPosition: string
  rating: number
  slugArray: string[]
  isAnnual: boolean
  startDate: string
  endDate: string
  openingHours: string[]
}

type AttractionPayload = {
  name: string
  description: string
  heroImage: string
  imageArray: string[]
  price: number
  link: string
  gpsPosition: string
  rating: number
  slugArray: string[]
  openingHours: string[]
}

type CityPayload = {
  name: string
  description: string
  heroImage: string
  commune: string
  region: string
  country: string
  gpsPosition: string
  population: number
  visitorCenter: string
  rating: number
}

const API_BASE_URL = "http://localhost:4000/api"

const { title, description } = defineProps<{
  title: string
  description: string
}>()

const selectedType = ref<ContentType>("event")
const isSubmitting = ref(false)
const isUploadingImage = ref(false)
const message = ref("")

const eventHeroImageFile = ref<File | null>(null)
const attractionHeroImageFile = ref<File | null>(null)
const cityHeroImageFile = ref<File | null>(null)
const eventImageArrayFiles = ref<File[]>([])
const attractionImageArrayFiles = ref<File[]>([])

const eventForm = reactive({
  name: "",
  description: "",
  price: "",
  link: "",
  gpsPosition: "",
  rating: "",
  slugArrayText: "",
  isAnnual: false,
  startDate: "",
  endDate: "",
  openingHoursText: "",
})

const attractionForm = reactive({
  name: "",
  description: "",
  price: "",
  link: "",
  gpsPosition: "",
  rating: "",
  slugArrayText: "",
  openingHoursText: "",
})

const cityForm = reactive({
  name: "",
  description: "",
  commune: "",
  region: "",
  country: "",
  gpsPosition: "",
  population: "",
  visitorCenter: "",
  rating: "",
})

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const getAuthToken = () => localStorage.getItem("token")

const uploadImageFile = async (file: File) => {
  const token = getAuthToken()
  const formData = new FormData()

  formData.append("image", file)

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  if (!response.ok) {
    const fallbackMessage = `Image upload failed: ${response.status}`

    try {
      const errorBody = await response.json()
      const backendMessage =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : fallbackMessage
      throw new Error(backendMessage)
    } catch {
      throw new Error(fallbackMessage)
    }
  }

  const body = await response.json() as { imageUrl?: string }

  if (!body.imageUrl) {
    throw new Error("Image upload returned no image URL")
  }

  return body.imageUrl
}

const onHeroImageSelected = (contentType: ContentType, event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]

  if (!file) {
    return
  }

  if (contentType === "event") {
    eventHeroImageFile.value = file
  } else if (contentType === "attraction") {
    attractionHeroImageFile.value = file
  } else {
    cityHeroImageFile.value = file
  }

  message.value = ""
}

const onImageArraySelected = (contentType: "event" | "attraction", event: Event) => {
  const target = event.target as HTMLInputElement | null
  const files = target?.files ? Array.from(target.files) : []

  if (!files.length) {
    return
  }

  if (contentType === "event") {
    eventImageArrayFiles.value = files
  } else {
    attractionImageArrayFiles.value = files
  }

  message.value = ""
}

const postJson = async <T>(url: string, body: T) => {
  const token = getAuthToken()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const fallbackMessage = `Request failed: ${response.status}`

    try {
      const errorBody = await response.json()
      const backendMessage =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : fallbackMessage
      throw new Error(backendMessage)
    } catch {
      throw new Error(fallbackMessage)
    }
  }

  return response.json()
}

const submitEvent = async () => {
  if (!eventHeroImageFile.value) {
    throw new Error("Please upload an image for this event.")
  }

  isUploadingImage.value = true

  const heroImage = await uploadImageFile(eventHeroImageFile.value)
  const imageArray = await Promise.all(eventImageArrayFiles.value.map((file) => uploadImageFile(file)))

  const payload: EventPayload = {
    name: eventForm.name,
    description: eventForm.description,
    heroImage,
    imageArray,
    price: Number(eventForm.price) || 0,
    link: eventForm.link,
    gpsPosition: eventForm.gpsPosition,
    rating: Number(eventForm.rating) || 0,
    slugArray: splitList(eventForm.slugArrayText),
    isAnnual: eventForm.isAnnual,
    startDate: eventForm.startDate,
    endDate: eventForm.endDate,
    openingHours: splitList(eventForm.openingHoursText),
  }
  await postJson(`${API_BASE_URL}/events`, payload)
}

const submitAttraction = async () => {
  if (!getAuthToken()) {
    throw new Error("You must be logged in to create an attraction.")
  }

  if (!attractionHeroImageFile.value) {
    throw new Error("Please upload an image for this attraction.")
  }

  isUploadingImage.value = true

  const heroImage = await uploadImageFile(attractionHeroImageFile.value)
  const imageArray = await Promise.all(
    attractionImageArrayFiles.value.map((file) => uploadImageFile(file)),
  )

  const payload: AttractionPayload = {
    name: attractionForm.name,
    description: attractionForm.description,
    heroImage,
    imageArray,
    price: Number(attractionForm.price) || 0,
    link: attractionForm.link,
    gpsPosition: attractionForm.gpsPosition,
    rating: Number(attractionForm.rating) || 0,
    slugArray: splitList(attractionForm.slugArrayText),
    openingHours: splitList(attractionForm.openingHoursText),
  }
  await postJson(`${API_BASE_URL}/attractions`, payload)
}

const submitCity = async () => {
  if (!cityHeroImageFile.value) {
    throw new Error("Please upload an image for this city.")
  }

  isUploadingImage.value = true

  const heroImage = await uploadImageFile(cityHeroImageFile.value)

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
    rating: Number(cityForm.rating) || 0,
  }
  await postJson(`${API_BASE_URL}/city`, payload)
}

const submitSelected = async () => {
  try {
    isSubmitting.value = true
    message.value = ""

    if (selectedType.value === "event") {
      await submitEvent()
    } else if (selectedType.value === "attraction") {
      await submitAttraction()
    } else {
      await submitCity()
    }

    message.value = `${selectedType.value} saved successfully.`
  } catch (error) {
    message.value = error instanceof Error ? error.message : "Save failed."
  } finally {
    isUploadingImage.value = false
    isSubmitting.value = false
  }
}

const typeButtonClass = (value: ContentType) => {
  const isActive = selectedType.value === value
  return isActive
    ? "bg-[#094b7b] text-white"
    : "bg-white text-[#094b7b] border border-[#094b7b]/20"
}
</script>
