import {
  contactTicketCategoryOptions,
  type ContactTicket,
  type ContactTicketCategory,
  type ContactTicketStatus,
} from '@/types/contact-ticket'

export type AdminContactTicketSort = 'newest' | 'category' | 'status'

const categoryOrder = new Map<ContactTicketCategory, number>(
  contactTicketCategoryOptions.map((category, index) => [category.key, index]),
)

export function getAdminContactTicketCategorySummary(tickets: ContactTicket[]) {
  return contactTicketCategoryOptions.map((category) => ({
    ...category,
    count: tickets.filter((ticket) => ticket.category === category.key).length,
  }))
}

export function newestContactTicketFirst(first: ContactTicket, second: ContactTicket): number {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
}

export function sortAdminContactTickets(
  tickets: ContactTicket[],
  activeSort: AdminContactTicketSort,
): ContactTicket[] {
  const nextTickets = [...tickets]

  if (activeSort === 'category') {
    return nextTickets.sort((first, second) => {
      const firstIndex = categoryOrder.get(first.category) ?? 99
      const secondIndex = categoryOrder.get(second.category) ?? 99

      return firstIndex - secondIndex || newestContactTicketFirst(first, second)
    })
  }

  if (activeSort === 'status') {
    return nextTickets.sort((first, second) => {
      const statusOrder = { open: 0, in_progress: 1, completed: 2, rejected: 3 }
      const firstIndex = statusOrder[first.status]
      const secondIndex = statusOrder[second.status]

      return firstIndex - secondIndex || newestContactTicketFirst(first, second)
    })
  }

  return nextTickets.sort(newestContactTicketFirst)
}

export function formatAdminContactTicketDate(value: string): string {
  return new Date(value).toLocaleString('da-DK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function getContactTicketStatusLabel(status: ContactTicketStatus): string {
  if (status === 'completed') return 'Afsluttet'
  if (status === 'rejected') return 'Afvist'
  if (status === 'in_progress') return 'Behandles'
  return 'Åben'
}

export function getContactTicketStatusBadgeClass(status: ContactTicketStatus): string {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-800'
  if (status === 'rejected') return 'bg-rose-100 text-rose-800'
  if (status === 'in_progress') return 'bg-sky-100 text-sky-800'
  return 'bg-slate-100 text-slate-700'
}

export function getContactTicketRejectionReason(): string {
  return window.prompt('Hvorfor afvises henvendelsen? Dette sendes til brugeren.')?.trim() ?? ''
}
