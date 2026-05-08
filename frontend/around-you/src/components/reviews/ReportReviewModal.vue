<template>
  <div
    v-if="open && review"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
    role="dialog"
    aria-modal="true"
  >
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 class="text-base font-semibold text-[#094b7b]">Anmeld review</h3>
          <p class="mt-1 text-xs text-slate-500">
            Du anmelder: <span class="font-medium text-slate-700">{{ review.title }}</span>
          </p>
        </div>
        <button
          type="button"
          class="text-sm text-slate-400 transition hover:text-slate-600"
          aria-label="Luk"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="emit('submit')" class="space-y-4">
        <div>
          <label for="report-reason" class="mb-1 block text-sm font-medium text-slate-700">Årsag</label>
          <select
            id="report-reason"
            :value="modelValue.reason"
            required
            class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
            @change="updateField('reason', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Vælg en årsag</option>
            <option value="upassende-sprog">Upassende sprog</option>
            <option value="chikane">Chikane eller hadefuldt indhold</option>
            <option value="spam">Spam eller reklame</option>
            <option value="andet">Andet</option>
          </select>
        </div>

        <div>
          <label for="report-details" class="mb-1 block text-sm font-medium text-slate-700">
            Beskriv kort problemet <span class="font-normal text-slate-400">(valgfrit)</span>
          </label>
          <textarea
            id="report-details"
            :value="modelValue.details"
            maxlength="500"
            rows="4"
            placeholder="Skriv evt. hvorfor reviewet er upassende..."
            class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
            @input="updateField('details', ($event.target as HTMLTextAreaElement).value)"
          ></textarea>
        </div>

        <p v-if="error" class="text-sm text-[#de5826]">{{ error }}</p>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300"
            @click="emit('close')"
          >
            Annuller
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-full bg-[#094b7b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#094b7b]/85"
          >
            {{ submitting ? 'Sender...' : 'Send anmeldelse' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReviewItem } from '@/api/reviews.api'

export type ReportFormModel = {
  reason: string
  details: string
}

const props = defineProps<{
  open: boolean
  review: ReviewItem | null
  modelValue: ReportFormModel
  error: string | null
  submitting: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'update:modelValue', value: ReportFormModel): void
}>()

function updateField<K extends keyof ReportFormModel>(key: K, value: ReportFormModel[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}
</script>
