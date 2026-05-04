<template>
  <main class="min-h-screen bg-[#C1D2DE] px-4 py-12">
    <section
      class="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]"
    >
      <div class="border-b border-[#094b7b]/10 bg-[#C1D2DE] px-8 py-8">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#de5826]">Admin panel</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-[#094b7b]">
          Indhold til godkendelse
        </h1>
        <p class="mt-3 max-w-2xl text-slate-700">
          Brugere kan foreslå byer, events og attraktioner. Backend opretter først rigtigt indhold,
          når en admin godkender forslaget.
        </p>
      </div>

      <div class="px-8 py-10">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-[#094b7b]">Afventer review</h2>
            <p class="text-sm text-slate-500">{{ suggestions.length }} forslag i køen</p>
          </div>
          <button
            class="rounded-full bg-[#094b7b] px-5 py-2 font-bold text-white disabled:opacity-60"
            :disabled="isLoading"
            @click="loadSuggestions"
          >
            Opdater
          </button>
        </div>

        <p v-if="errorMessage" class="rounded-2xl bg-rose-50 px-4 py-3 font-semibold text-rose-700">
          {{ errorMessage }}
        </p>

        <div v-if="isLoading" class="rounded-3xl bg-[#f8fbfd] p-8 font-semibold text-slate-600">
          Henter forslag...
        </div>

        <div
          v-else-if="!suggestions.length"
          class="rounded-3xl bg-[#f8fbfd] p-8 font-semibold text-slate-600"
        >
          Der er ingen forslag, der afventer godkendelse.
        </div>

        <div v-else class="grid gap-5">
          <article
            v-for="suggestion in suggestions"
            :key="suggestion._id"
            class="rounded-[28px] border border-[#094b7b]/10 bg-[#f8fbfd] p-6"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.24em] text-[#de5826]">
                  {{ suggestion.type }}
                </p>
                <h3 class="mt-2 text-2xl font-black text-[#094b7b]">
                  {{ suggestion.payload.name || 'Unavngivet forslag' }}
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                  Indsendt af {{ suggestion.submittedByName }} ·
                  {{ new Date(suggestion.createdAt).toLocaleString('da-DK') }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                  :disabled="activeId === suggestion._id"
                  @click="approve(suggestion._id)"
                >
                  Godkend
                </button>
                <button
                  class="rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                  :disabled="activeId === suggestion._id"
                  @click="reject(suggestion._id)"
                >
                  Afvis
                </button>
              </div>
            </div>

            <dl class="mt-5 grid gap-3 md:grid-cols-2">
              <div
                v-for="[key, value] in Object.entries(suggestion.payload)"
                :key="key"
                class="rounded-2xl bg-white p-4"
              >
                <dt class="text-xs font-black uppercase tracking-wide text-slate-400">{{ key }}</dt>
                <dd class="mt-1 break-words text-sm font-semibold text-slate-700">{{ value }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  approveContentSuggestion,
  fetchPendingContentSuggestions,
  rejectContentSuggestion,
} from '@/api/contentSuggestions.api'
import type { ContentSuggestion } from '@/types/content-suggestion'

const suggestions = ref<ContentSuggestion[]>([])
const isLoading = ref(false)
const activeId = ref('')
const errorMessage = ref('')

async function loadSuggestions() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    suggestions.value = await fetchPendingContentSuggestions()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke hente forslag.'
  } finally {
    isLoading.value = false
  }
}

async function approve(id: string) {
  activeId.value = id
  errorMessage.value = ''

  try {
    await approveContentSuggestion(id)
    suggestions.value = suggestions.value.filter((suggestion) => suggestion._id !== id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke godkende forslaget.'
  } finally {
    activeId.value = ''
  }
}

async function reject(id: string) {
  const reason = window.prompt('Hvorfor afvises forslaget?') ?? ''
  activeId.value = id
  errorMessage.value = ''

  try {
    await rejectContentSuggestion(id, reason)
    suggestions.value = suggestions.value.filter((suggestion) => suggestion._id !== id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke afvise forslaget.'
  } finally {
    activeId.value = ''
  }
}

onMounted(() => {
  void loadSuggestions()
})
</script>
