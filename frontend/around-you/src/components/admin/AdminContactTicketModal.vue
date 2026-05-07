<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="ticket-modal-title"
    @click.self="$emit('close')"
  >
    <article class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#de5826]">
            Henvendelse
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <h3 id="ticket-modal-title" class="text-2xl font-black text-[#094b7b]">
              {{ ticket.subject }}
            </h3>
            <span class="rounded-full px-2 py-1 text-xs font-black" :class="category.badgeClass">
              {{ category.label }}
            </span>
            <span
              class="rounded-full px-2 py-1 text-xs font-black"
              :class="
                ticket.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              "
            >
              {{ ticket.status === 'completed' ? 'Afsluttet' : 'Åben' }}
            </span>
          </div>
        </div>
        <button
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
          @click="$emit('close')"
        >
          Luk
        </button>
      </div>

      <div class="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
        <p><span class="font-black text-slate-900">Bruger:</span> {{ ticket.submittedByName }}</p>
        <p><span class="font-black text-slate-900">Email:</span> {{ ticket.submittedByEmail }}</p>
        <p><span class="font-black text-slate-900">Oprettet:</span> {{ formatDate(ticket.createdAt) }}</p>
        <p><span class="font-black text-slate-900">Opdateret:</span> {{ formatDate(ticket.updatedAt) }}</p>
        <p v-if="ticket.completedAt">
          <span class="font-black text-slate-900">Afsluttet:</span>
          {{ formatDate(ticket.completedAt) }}
        </p>
      </div>

      <div class="mt-5 rounded-lg border border-slate-200 p-4">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Beskrivelse</p>
        <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-800">
          {{ ticket.message }}
        </p>
      </div>

      <div class="mt-5 flex flex-wrap justify-between gap-2">
        <a
          class="rounded-md bg-[#094b7b] px-3 py-2 text-sm font-black text-white transition hover:bg-[#0b5d98]"
          :href="`mailto:${ticket.submittedByEmail}?subject=${encodeMailSubject(ticket.subject)}`"
        >
          Skriv til bruger
        </a>
        <button
          v-if="ticket.status === 'open'"
          class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white"
          @click="$emit('complete', ticket._id)"
        >
          Afslut sag
        </button>
        <button
          v-else
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
          @click="$emit('reopen', ticket._id)"
        >
          Genåbn sag
        </button>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getContactTicketCategoryMeta, type ContactTicket } from '@/types/contact-ticket'

const props = defineProps<{
  ticket: ContactTicket
}>()

defineEmits<{
  close: []
  complete: [id: string]
  reopen: [id: string]
}>()

const category = computed(() => getContactTicketCategoryMeta(props.ticket.category))

function formatDate(value: string): string {
  return new Date(value).toLocaleString('da-DK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function encodeMailSubject(subject: string): string {
  return encodeURIComponent(`Vedrørende din henvendelse: ${subject}`)
}
</script>
