<template>
  <main class="min-h-screen bg-[#C1D2DE] px-4 py-12">
    <section
      class="mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]"
    >
      <div class="border-b border-[#094b7b]/10 bg-[#f8fbfd] px-8 py-8">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#de5826]">Forslag</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-[#094b7b]">Tilføj en oplevelse</h1>
        <p class="mt-3 max-w-2xl text-slate-600">
          Dit forslag sendes til admin-gennemgang. Når det bliver godkendt, bliver det oprettet som
          rigtigt indhold.
        </p>
      </div>

      <form class="space-y-6 px-8 py-10" @submit.prevent="submitSuggestion">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            class="rounded-full px-5 py-2 text-sm font-bold"
            :class="
              form.type === option.value ? 'bg-[#094b7b] text-white' : 'bg-[#C1D2DE] text-[#094b7b]'
            "
            @click="form.type = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label v-for="field in visibleFields" :key="field.key" class="block">
            <span class="text-sm font-bold text-[#094b7b]">{{ field.label }}</span>
            <textarea
              v-if="field.kind === 'textarea'"
              v-model="form.values[field.key]"
              class="mt-2 min-h-28 w-full rounded-2xl border border-[#094b7b]/20 px-4 py-3 outline-none focus:border-[#de5826]"
              required
            />
            <input
              v-else
              v-model="form.values[field.key]"
              :type="field.kind"
              class="mt-2 w-full rounded-2xl border border-[#094b7b]/20 px-4 py-3 outline-none focus:border-[#de5826]"
              required
            />
          </label>
        </div>

        <p v-if="errorMessage" class="rounded-2xl bg-rose-50 px-4 py-3 font-semibold text-rose-700">
          {{ errorMessage }}
        </p>
        <p
          v-if="successMessage"
          class="rounded-2xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-700"
        >
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="rounded-full bg-[#de5826] px-7 py-3 font-black text-white disabled:opacity-60"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Sender...' : 'Send til godkendelse' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { createContentSuggestion } from '@/api/contentSuggestions.api'
import type { ContentSuggestionPayload, ContentSuggestionType } from '@/types/content-suggestion'

type FieldConfig = {
  key: string
  label: string
  kind: 'text' | 'number' | 'date' | 'textarea'
}

const typeOptions: { value: ContentSuggestionType; label: string }[] = [
  { value: 'attraction', label: 'Attraktion' },
  { value: 'event', label: 'Event' },
  { value: 'city', label: 'By' },
]

const commonFields: FieldConfig[] = [
  { key: 'name', label: 'Navn', kind: 'text' },
  { key: 'description', label: 'Beskrivelse', kind: 'textarea' },
  { key: 'heroImage', label: 'Billede URL', kind: 'text' },
  { key: 'gpsPosition', label: 'GPS-position', kind: 'text' },
]

const typeFields: Record<ContentSuggestionType, FieldConfig[]> = {
  attraction: [
    ...commonFields,
    { key: 'price', label: 'Pris', kind: 'number' },
    { key: 'link', label: 'Link', kind: 'text' },
  ],
  event: [
    ...commonFields,
    { key: 'price', label: 'Pris', kind: 'number' },
    { key: 'link', label: 'Link', kind: 'text' },
    { key: 'startDate', label: 'Startdato', kind: 'date' },
    { key: 'endDate', label: 'Slutdato', kind: 'date' },
  ],
  city: [
    ...commonFields,
    { key: 'commune', label: 'Kommune', kind: 'text' },
    { key: 'region', label: 'Region', kind: 'text' },
    { key: 'country', label: 'Land', kind: 'text' },
    { key: 'population', label: 'Indbyggertal', kind: 'number' },
    { key: 'visitorCenter', label: 'Turistinformation', kind: 'text' },
  ],
}

const form = reactive({
  type: 'attraction' as ContentSuggestionType,
  values: {} as Record<string, string>,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const visibleFields = computed(() => typeFields[form.type])

watch(
  () => form.type,
  () => {
    form.values = {}
    errorMessage.value = ''
    successMessage.value = ''
  },
)

function buildPayload(): ContentSuggestionPayload {
  return visibleFields.value.reduce<ContentSuggestionPayload>((payload, field) => {
    const value = form.values[field.key] ?? ''
    payload[field.key] = field.kind === 'number' ? Number(value) : value
    return payload
  }, {})
}

async function submitSuggestion() {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await createContentSuggestion(form.type, buildPayload())
    form.values = {}
    successMessage.value = 'Dit forslag er sendt til godkendelse.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Forslaget kunne ikke sendes.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
