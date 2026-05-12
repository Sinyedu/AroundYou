<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-black text-[#094b7b]">Afventende forslag</h2>
        <p class="text-sm text-slate-500">
          {{ suggestions.length }} afventer godkendelse eller afvisning.
        </p>
      </div>
      <button
        class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold"
        @click="$emit('refresh')"
      >
        Opdater
      </button>
    </div>

    <div v-if="isLoading" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
      Henter...
    </div>
    <div
      v-else-if="!suggestions.length"
      class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600"
    >
      Der er ingen afventende forslag i denne samling.
    </div>
    <div v-else class="mt-4 grid gap-3">
      <article
        v-for="suggestion in suggestions"
        :key="suggestion._id"
        class="rounded-lg border border-slate-200 p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="font-black text-slate-900">
              {{ suggestion.payload.name || 'Unavngivet forslag' }}
            </h3>
            <p class="text-sm text-slate-500">
              {{ suggestion.submittedByName }} ·
              {{ new Date(suggestion.createdAt).toLocaleString('da-DK') }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white disabled:opacity-60"
              :disabled="activeSuggestionId === suggestion._id"
              @click="$emit('approve', suggestion._id)"
            >
              Godkend
            </button>
            <button
              class="rounded-md bg-rose-600 px-3 py-2 text-sm font-black text-white disabled:opacity-60"
              :disabled="activeSuggestionId === suggestion._id"
              @click="$emit('reject', suggestion._id)"
            >
              Afvis
            </button>
          </div>
        </div>
        <dl class="mt-3 grid gap-2 md:grid-cols-2">
          <div
            v-for="[key, value] in Object.entries(suggestion.payload)"
            :key="key"
            class="rounded-md bg-slate-50 p-3"
          >
            <dt class="text-xs font-black uppercase text-slate-400">{{ key }}</dt>
            <dd class="mt-1 break-words text-sm text-slate-700">{{ formatValue(value) }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatAdminSuggestionValue } from '@/composables/admin/adminSuggestionQueue.helpers'
import type { ContentSuggestion } from '@/types/content-suggestion'

defineProps<{
  suggestions: ContentSuggestion[]
  isLoading: boolean
  activeSuggestionId: string
}>()

defineEmits<{
  refresh: []
  approve: [id: string]
  reject: [id: string]
}>()

const formatValue = formatAdminSuggestionValue
</script>
