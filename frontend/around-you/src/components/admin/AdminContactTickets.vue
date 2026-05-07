<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#de5826]">Kontakt</p>
        <h2 class="mt-2 text-xl font-black text-[#094b7b]">Henvendelser</h2>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="activeStatus"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
        >
          <option value="all">Alle sager</option>
          <option value="open">Åbne</option>
          <option value="completed">Afsluttede</option>
        </select>
        <select
          v-model="activeCategory"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
        >
          <option value="all">Alle kategorier</option>
          <option
            v-for="category in contactTicketCategoryOptions"
            :key="category.key"
            :value="category.key"
          >
            {{ category.label }}
          </option>
        </select>
        <select
          v-model="activeSort"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
        >
          <option value="newest">Nyeste først</option>
          <option value="category">Kategori</option>
          <option value="status">Status</option>
        </select>
        <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="loadTickets">
          Opdater
        </button>
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div
        v-for="summary in categorySummary"
        :key="summary.key"
        class="rounded-lg border border-slate-200 p-3"
      >
        <span class="rounded-full px-2 py-1 text-xs font-black" :class="summary.badgeClass">
          {{ summary.label }}
        </span>
        <p class="mt-2 text-2xl font-black text-slate-900">{{ summary.count }}</p>
      </div>
    </div>

    <p v-if="errorMessage" class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
      {{ errorMessage }}
    </p>

    <div v-if="isLoading" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
      Henter henvendelser...
    </div>
    <div v-else-if="!sortedTickets.length" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
      Der er ingen henvendelser i dette filter.
    </div>
    <div v-else class="mt-4 grid gap-3">
      <article
        v-for="ticket in sortedTickets"
        :key="ticket._id"
        class="cursor-pointer rounded-lg border border-l-4 border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
        :class="[
          getContactTicketCategoryMeta(ticket.category).borderClass,
          ticket.status === 'completed' ? 'bg-slate-50' : 'bg-white',
        ]"
        role="button"
        tabindex="0"
        @click="openTicket(ticket)"
        @keydown.enter.prevent="openTicket(ticket)"
        @keydown.space.prevent="openTicket(ticket)"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-black text-slate-900">{{ ticket.subject }}</h3>
              <span
                class="rounded-full px-2 py-1 text-xs font-black"
                :class="getContactTicketCategoryMeta(ticket.category).badgeClass"
              >
                {{ getContactTicketCategoryMeta(ticket.category).label }}
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
            <p class="mt-1 text-sm text-slate-600">
              {{ ticket.submittedByName }} · {{ formatDate(ticket.createdAt) }}
            </p>
            <p class="mt-1 text-sm font-bold text-[#094b7b]">Klik for at åbne hele sagen</p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="ticket.status === 'open'"
              class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white"
              @click.stop="completeTicket(ticket._id)"
            >
              Afslut
            </button>
            <button
              v-else
              class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
              @click.stop="reopenTicket(ticket._id)"
            >
              Genåbn
            </button>
          </div>
        </div>
        <p class="mt-3 whitespace-pre-line text-sm text-slate-700">{{ ticket.message }}</p>
        <p v-if="ticket.completedAt" class="mt-3 text-xs font-bold text-slate-500">
          Afsluttet {{ formatDate(ticket.completedAt) }}
        </p>
      </article>
    </div>

    <AdminContactTicketModal
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="closeTicket"
      @complete="completeTicket"
      @reopen="reopenTicket"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  completeContactTicket,
  fetchAdminContactTickets,
  reopenContactTicket,
} from '@/api/contactTickets.api'
import AdminContactTicketModal from '@/components/admin/AdminContactTicketModal.vue'
import {
  contactTicketCategoryOptions,
  getContactTicketCategoryMeta,
  type ContactTicket,
  type ContactTicketCategoryFilter,
  type ContactTicketStatusFilter,
} from '@/types/contact-ticket'

const tickets = ref<ContactTicket[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const activeStatus = ref<ContactTicketStatusFilter>('all')
const activeCategory = ref<ContactTicketCategoryFilter>('all')
const activeSort = ref<'newest' | 'category' | 'status'>('newest')
const selectedTicket = ref<ContactTicket | null>(null)

const categorySummary = computed(() =>
  contactTicketCategoryOptions.map((category) => ({
    ...category,
    count: tickets.value.filter((ticket) => ticket.category === category.key).length,
  })),
)

const categoryOrder = new Map(
  contactTicketCategoryOptions.map((category, index) => [category.key, index]),
)

const sortedTickets = computed(() => {
  const nextTickets = [...tickets.value]

  if (activeSort.value === 'category') {
    return nextTickets.sort((first, second) => {
      const firstIndex = categoryOrder.get(first.category) ?? 99
      const secondIndex = categoryOrder.get(second.category) ?? 99

      return firstIndex - secondIndex || newestFirst(first, second)
    })
  }

  if (activeSort.value === 'status') {
    return nextTickets.sort((first, second) => {
      const firstIndex = first.status === 'open' ? 0 : 1
      const secondIndex = second.status === 'open' ? 0 : 1

      return firstIndex - secondIndex || newestFirst(first, second)
    })
  }

  return nextTickets.sort(newestFirst)
})

function newestFirst(first: ContactTicket, second: ContactTicket): number {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('da-DK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function openTicket(ticket: ContactTicket): void {
  selectedTicket.value = ticket
}

function closeTicket(): void {
  selectedTicket.value = null
}

async function loadTickets(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    tickets.value = await fetchAdminContactTickets(activeStatus.value, activeCategory.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke hente henvendelser.'
  } finally {
    isLoading.value = false
  }
}

async function completeTicket(id: string): Promise<void> {
  errorMessage.value = ''

  try {
    const updatedTicket = await completeContactTicket(id)
    tickets.value =
      activeStatus.value === 'open'
        ? tickets.value.filter((ticket) => ticket._id !== id)
        : tickets.value.map((ticket) => (ticket._id === id ? updatedTicket : ticket))
    selectedTicket.value = selectedTicket.value?._id === id ? updatedTicket : selectedTicket.value
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Kunne ikke afslutte henvendelsen.'
  }
}

async function reopenTicket(id: string): Promise<void> {
  errorMessage.value = ''

  try {
    const updatedTicket = await reopenContactTicket(id)
    tickets.value =
      activeStatus.value === 'completed'
        ? tickets.value.filter((ticket) => ticket._id !== id)
        : tickets.value.map((ticket) => (ticket._id === id ? updatedTicket : ticket))
    selectedTicket.value = selectedTicket.value?._id === id ? updatedTicket : selectedTicket.value
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Kunne ikke genåbne henvendelsen.'
  }
}

watch([activeStatus, activeCategory], () => {
  void loadTickets()
})

onMounted(() => {
  void loadTickets()
})
</script>
