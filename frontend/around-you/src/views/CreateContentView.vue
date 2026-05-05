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
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onHeroImageSelected('event', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="eventHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Selected: {{
                eventHeroImageFile.name }}</p>
            </div>
            <input v-model="eventForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Price" />
            <input v-model="eventForm.link" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Link" />
            <input v-model="eventForm.address" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Address" />
            <input v-model="eventForm.city" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="City" />
            <input v-model="eventForm.startDate" type="date" class="rounded-xl border border-slate-200 px-4 py-3" />
            <input v-model="eventForm.endDate" type="date" class="rounded-xl border border-slate-200 px-4 py-3" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Additional image files</label>
              <input type="file" multiple accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onImageArraySelected('event', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p class="mt-2 text-xs text-slate-600">{{ eventImageArrayFiles.length }} image(s) selected</p>
            </div>
            <CategorySlugPicker v-model="eventForm.slugArray" :options="categoryOptions" label="Categories"
              placeholder="Search or create category" />
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
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onHeroImageSelected('attraction', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="attractionHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Selected: {{
                attractionHeroImageFile.name }}</p>
            </div>
            <input v-model="attractionForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Price" />
            <input v-model="attractionForm.link" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Link" />
            <input v-model="attractionForm.address" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Address" />
            <input v-model="attractionForm.city" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="City" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Additional image files</label>
              <input type="file" multiple accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onImageArraySelected('attraction', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p class="mt-2 text-xs text-slate-600">{{ attractionImageArrayFiles.length }} image(s) selected</p>
            </div>
            <CategorySlugPicker v-model="attractionForm.slugArray" :options="categoryOptions" label="Categories"
              placeholder="Search or create category" />
            <input v-model="attractionForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Opening hours (comma separated)" />
            <textarea v-model="attractionForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Description"></textarea>
          </template>

          <template v-if="selectedType === 'city'">
            <input v-model="cityForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="City" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero image file</label>
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
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
            <input v-model="cityForm.address" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Address" />
            <input v-model="cityForm.population" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Population" />
            <input v-model="cityForm.visitorCenter" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Visitor center" />
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
import CategorySlugPicker from '@/components/CategorySlugPicker.vue'
import { useCreateContent } from '@/composables/useCreateContent'

const { title, description } = defineProps<{
  title: string
  description: string
}>()

const {
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
} = useCreateContent()
</script>
