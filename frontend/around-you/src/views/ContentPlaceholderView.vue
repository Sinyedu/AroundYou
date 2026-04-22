<template>
  <main class="min-h-screen bg-[#C1D2DE] px-4 py-12">
    <section
      class="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]">
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
            <input v-model="eventForm.heroImage" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Hero image URL" />
            <input v-model="eventForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Price" />
            <input v-model="eventForm.link" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Link" />
            <input v-model="eventForm.gpsPosition" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="GPS (lat,lng)" />
            <input v-model="eventForm.rating" type="number" step="0.1"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Rating" />
            <input v-model="eventForm.startDate" type="date" class="rounded-xl border border-slate-200 px-4 py-3" />
            <input v-model="eventForm.endDate" type="date" class="rounded-xl border border-slate-200 px-4 py-3" />
            <input v-model="eventForm.imageArrayText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Image URLs (comma separated)" />
            <input v-model="eventForm.slugArrayText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Categories (comma separated)" />
            <input v-model="eventForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Opening hours (comma separated)" />
            <label class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
              <input v-model="eventForm.isAnnual" type="checkbox" class="h-4 w-4" />
              Annual event
            </label>
            <textarea v-model="eventForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2"
              placeholder="Description"></textarea>
          </template>

          <template v-if="selectedType === 'attraction'">
            <input v-model="attractionForm.name" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Name" />
            <input v-model="attractionForm.heroImage" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Hero image URL" />
            <input v-model="attractionForm.price" type="number"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Price" />
            <input v-model="attractionForm.link" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Link" />
            <input v-model="attractionForm.gpsPosition" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="GPS (lat,lng)" />
            <input v-model="attractionForm.rating" type="number" step="0.1"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Rating" />
            <input v-model="attractionForm.imageArrayText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Image URLs (comma separated)" />
            <input v-model="attractionForm.slugArrayText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Categories (comma separated)" />
            <input v-model="attractionForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Opening hours (comma separated)" />
            <textarea v-model="attractionForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2"
              placeholder="Description"></textarea>
          </template>

          <template v-if="selectedType === 'city'">
            <input v-model="cityForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" />
            <input v-model="cityForm.heroImage" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Hero image URL" />
            <input v-model="cityForm.commune" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Commune" />
            <input v-model="cityForm.region" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Region" />
            <input v-model="cityForm.country" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Country" />
            <input v-model="cityForm.gpsPosition" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="GPS (lat,lng)" />
            <input v-model="cityForm.population" type="number"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Population" />
            <input v-model="cityForm.visitorCenter" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Visitor center" />
            <input v-model="cityForm.rating" type="number" step="0.1"
              class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Rating" />
            <textarea v-model="cityForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2"
              placeholder="Description"></textarea>
          </template>

          <button type="submit"
            class="rounded-full bg-[#094b7b] px-6 py-3 text-sm font-semibold text-white sm:col-span-2"
            :disabled="isSubmitting">
            Save {{ selectedType }}
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
const message = ref("")

const eventForm = reactive({
  name: "",
  description: "",
  heroImage: "",
  imageArrayText: "",
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
  heroImage: "",
  imageArrayText: "",
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
  heroImage: "",
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

const postJson = async <T>(url: string, body: T) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

const submitEvent = async () => {
  const payload: EventPayload = {
    name: eventForm.name,
    description: eventForm.description,
    heroImage: eventForm.heroImage,
    imageArray: splitList(eventForm.imageArrayText),
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
  const payload: AttractionPayload = {
    name: attractionForm.name,
    description: attractionForm.description,
    heroImage: attractionForm.heroImage,
    imageArray: splitList(attractionForm.imageArrayText),
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
  const payload: CityPayload = {
    name: cityForm.name,
    description: cityForm.description,
    heroImage: cityForm.heroImage,
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
