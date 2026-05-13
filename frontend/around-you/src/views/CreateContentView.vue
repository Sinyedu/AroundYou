<template>
  <main
    class="min-h-screen relative bg-cover bg-center bg-no-repeat py-4 sm:py-[50px]"
    style="background-image: url('/danmarkskort_1800x1280.jpg')"
  >
    <div class="pointer-events-none absolute inset-0 bg-[#e8c7aa]/55"></div>

    <div class="relative z-10 mx-4 sm:mx-[50px] bg-white shadow-2xl rounded-xl overflow-hidden">
      <section class="bg-[#094b7b] px-8 py-8">
        <h1 class="text-4xl font-black tracking-tight text-white">Del din oplevelse med andre</h1>
        <p class="mt-2 text-base text-white">Tilføj nye byer, events eller attraktioner og vær med til at inspirere andre brugere</p>
      </section>

      <div class="px-8 py-10">
        <div class="mb-6 flex flex-wrap items-center gap-3">
          <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="typeButtonClass('event')" @click="selectedType = 'event'">
            Event
          </button>
          <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="typeButtonClass('attraction')" @click="selectedType = 'attraction'">
            Attraktion
          </button>
          <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="typeButtonClass('city')" @click="selectedType = 'city'">
            By
          </button>
        </div>

        <p v-if="message" class="mb-4 rounded-xl bg-[#C1D2DE] px-4 py-3 text-sm font-semibold text-[#094b7b]">
          {{ message }}
        </p>

        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submitSelected">
          <template v-if="selectedType === 'event'">
            <input v-model="eventForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Navn" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero-billede</label>
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onHeroImageSelected('event', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="eventHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Valgt: {{
                eventHeroImageFile.name }}</p>
            </div>
            <input v-model="eventForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Pris" />
            <input v-model="eventForm.link" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Link" />
            <input v-model="eventForm.address" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Adresse" />
            <input v-model="eventForm.city" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="By" />
            <div class="grid gap-1.5">
              <label class="text-sm font-semibold text-slate-700">Startdato</label>
              <input v-model="eventForm.startDate" type="datetime-local" class="rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div class="grid gap-1.5">
              <label class="text-sm font-semibold text-slate-700">Slutdato</label>
              <input v-model="eventForm.endDate" type="datetime-local" class="rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Yderligere billedfiler</label>
              <input id="event-additional-images" type="file" multiple accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onImageArraySelected('event', event)"
                class="sr-only" />
              <label
                for="event-additional-images"
                class="inline-flex cursor-pointer rounded-lg bg-[#094b7b] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5d98]"
              >
                Vælg filer
              </label>
              <p class="mt-2 text-xs text-slate-600">{{ eventImageArrayFiles.length }} billede(r) valgt</p>
              <div v-if="eventImageArrayFiles.length" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="(file, index) in eventImageArrayFiles"
                  :key="`${file.name}-${file.lastModified}`"
                  class="inline-flex max-w-full items-center gap-2 rounded-full border border-[#C1D2DE] bg-[#C1D2DE]/35 px-3 py-1 text-xs font-semibold text-[#094b7b]"
                >
                  <span class="truncate">{{ file.name }}</span>
                  <button
                    type="button"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm leading-none transition hover:bg-white/70"
                    :aria-label="`Fjern ${file.name}`"
                    @click="removeImageArrayFile('event', index)"
                  >
                    x
                  </button>
                </span>
              </div>
            </div>
            <CategorySlugPicker v-model="eventForm.slugArray" :options="categoryOptions" label="Kategorier"
              placeholder="Søg eller opret kategori" />
            <input v-model="eventForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Åbningstider" />
            <label class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
              <input v-model="eventForm.isAnnual" type="checkbox" class="h-4 w-4" />
              Årlig begivenhed
            </label>
            <textarea v-model="eventForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Beskrivelse"></textarea>
          </template>

          <template v-if="selectedType === 'attraction'">
            <input v-model="attractionForm.name" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Navn" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero-billede</label>
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onHeroImageSelected('attraction', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="attractionHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Valgt: {{
                attractionHeroImageFile.name }}</p>
            </div>
            <input v-model="attractionForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Pris" />
            <input v-model="attractionForm.link" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Link" />
            <input v-model="attractionForm.address" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Adresse" />
            <input v-model="attractionForm.city" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="By" />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Yderligere billedfiler</label>
              <input id="attraction-additional-images" type="file" multiple accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onImageArraySelected('attraction', event)"
                class="sr-only" />
              <label
                for="attraction-additional-images"
                class="inline-flex cursor-pointer rounded-lg bg-[#094b7b] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5d98]"
              >
                Vælg filer
              </label>
              <p class="mt-2 text-xs text-slate-600">{{ attractionImageArrayFiles.length }} billede(r) valgt</p>
              <div v-if="attractionImageArrayFiles.length" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="(file, index) in attractionImageArrayFiles"
                  :key="`${file.name}-${file.lastModified}`"
                  class="inline-flex max-w-full items-center gap-2 rounded-full border border-[#C1D2DE] bg-[#C1D2DE]/35 px-3 py-1 text-xs font-semibold text-[#094b7b]"
                >
                  <span class="truncate">{{ file.name }}</span>
                  <button
                    type="button"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm leading-none transition hover:bg-white/70"
                    :aria-label="`Fjern ${file.name}`"
                    @click="removeImageArrayFile('attraction', index)"
                  >
                    x
                  </button>
                </span>
              </div>
            </div>
            <CategorySlugPicker v-model="attractionForm.slugArray" :options="categoryOptions" label="Kategorier"
              placeholder="Søg eller opret kategori" />
            <input v-model="attractionForm.openingHoursText" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Åbningstider" />
            <textarea v-model="attractionForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Beskrivelse"></textarea>
          </template>

          <template v-if="selectedType === 'city'">
            <input v-model="cityForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="By" />
            <input
              v-model="cityForm.tagLine"
              class="rounded-xl border border-slate-200 px-4 py-3"
              minlength="20"
              maxlength="100"
              placeholder="Tagline (20-100 tegn)"
            />
            <div class="rounded-xl border border-slate-200 px-4 py-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hero-billede</label>
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" capture="environment"
                @change="(event) => onHeroImageSelected('city', event)"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white" />
              <p v-if="cityHeroImageFile" class="mt-2 text-xs text-slate-600 break-all">Valgt: {{
                cityHeroImageFile.name }}</p>
            </div>
            <input v-model="cityForm.commune" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Kommune" />
            <input v-model="cityForm.region" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Region" />
            <input v-model="cityForm.country" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Land" />
            <input v-model="cityForm.population" type="number" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Befolkningstal" />
            <input v-model="cityForm.visitorCenter" class="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Visitor Center" />
            <textarea v-model="cityForm.description" rows="4"
              class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2" placeholder="Beskrivelse"></textarea>
          </template>

          <button type="submit"
            class="rounded-full bg-[#094b7b] px-6 py-3 text-sm font-semibold text-white sm:col-span-2"
            :disabled="isSubmitting || isUploadingImage">
            {{ isUploadingImage ? "Uploader billede..." : `Gem ${selectedTypeLabel(selectedType)}` }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import CategorySlugPicker from '@/components/CategorySlugPicker.vue'
import { useCreateContent } from '@/composables/useCreateContent'

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
  removeImageArrayFile,
  submitSelected,
  typeButtonClass,
} = useCreateContent()

const selectedTypeLabel = (type: string): string => {
  if (type === 'event') return 'begivenhed'
  if (type === 'attraction') return 'attraktion'
  if (type === 'city') return 'by'
  return type
}
</script>
