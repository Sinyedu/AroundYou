import { computed, onMounted, ref, watch } from 'vue'

import {
  completeContactTicket,
  fetchAdminContactTickets,
  markContactTicketSeen,
  rejectContactTicket,
  reopenContactTicket,
  startContactTicketWork,
} from '@/api/contactTickets.api'
import {
  contactTicketCategoryOptions,
  getContactTicketCategoryMeta,
  type ContactTicket,
  type ContactTicketCategoryFilter,
  type ContactTicketStatusFilter,
} from '@/types/contact-ticket'
import {
  formatAdminContactTicketDate,
  getAdminContactTicketCategorySummary,
  getContactTicketRejectionReason,
  getContactTicketStatusBadgeClass,
  getContactTicketStatusLabel,
  sortAdminContactTickets,
  type AdminContactTicketSort,
} from './adminContactTickets.helpers'

export function useAdminContactTickets() {
  const tickets = ref<ContactTicket[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const activeStatus = ref<ContactTicketStatusFilter>('all')
  const activeCategory = ref<ContactTicketCategoryFilter>('all')
  const activeSort = ref<AdminContactTicketSort>('newest')
  const selectedTicket = ref<ContactTicket | null>(null)

  const categorySummary = computed(() => getAdminContactTicketCategorySummary(tickets.value))
  const sortedTickets = computed(() => sortAdminContactTickets(tickets.value, activeSort.value))

  function openTicket(ticket: ContactTicket): void {
    selectedTicket.value = ticket
    void markTicketSeen(ticket._id)
  }

  function closeTicket(): void {
    selectedTicket.value = null
  }

  function syncTicketForActiveFilter(updatedTicket: ContactTicket): void {
    const shouldKeep = activeStatus.value === 'all' || activeStatus.value === updatedTicket.status

    tickets.value = shouldKeep
      ? tickets.value.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket))
      : tickets.value.filter((ticket) => ticket._id !== updatedTicket._id)

    selectedTicket.value =
      selectedTicket.value?._id === updatedTicket._id ? updatedTicket : selectedTicket.value
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
      syncTicketForActiveFilter(updatedTicket)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke afslutte henvendelsen.'
    }
  }

  async function rejectTicket(id: string): Promise<void> {
    const reason = getContactTicketRejectionReason()
    if (!reason) return

    errorMessage.value = ''

    try {
      const updatedTicket = await rejectContactTicket(id, reason)
      syncTicketForActiveFilter(updatedTicket)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke afvise henvendelsen.'
    }
  }

  async function markTicketSeen(id: string): Promise<void> {
    errorMessage.value = ''

    try {
      const updatedTicket = await markContactTicketSeen(id)
      tickets.value = tickets.value.map((ticket) => (ticket._id === id ? updatedTicket : ticket))
      selectedTicket.value = selectedTicket.value?._id === id ? updatedTicket : selectedTicket.value
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke markere henvendelsen som set.'
    }
  }

  async function startWorkOnTicket(id: string): Promise<void> {
    errorMessage.value = ''

    try {
      const updatedTicket = await startContactTicketWork(id)
      syncTicketForActiveFilter(updatedTicket)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke starte arbejdet på henvendelsen.'
    }
  }

  async function reopenTicket(id: string): Promise<void> {
    errorMessage.value = ''

    try {
      const updatedTicket = await reopenContactTicket(id)
      syncTicketForActiveFilter(updatedTicket)
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

  return {
    activeCategory,
    activeSort,
    activeStatus,
    categorySummary,
    closeTicket,
    completeTicket,
    contactTicketCategoryOptions,
    errorMessage,
    formatDate: formatAdminContactTicketDate,
    getContactTicketCategoryMeta,
    getContactTicketStatusBadgeClass,
    getContactTicketStatusLabel,
    isLoading,
    loadTickets,
    openTicket,
    rejectTicket,
    reopenTicket,
    selectedTicket,
    startWorkOnTicket,
    sortedTickets,
  }
}
