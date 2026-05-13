import { apiRequest, jsonHeaders } from '@/api/http'
import type {
  ContactTicket,
  ContactTicketCategoryFilter,
  ContactTicketStatusFilter,
  CreateContactTicketPayload,
} from '@/types/contact-ticket'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function createContactTicket(payload: CreateContactTicketPayload): Promise<ContactTicket> {
  return apiRequest<ContactTicket>('/contact/tickets', {
    method: 'POST',
    token: getToken(),
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
}

export function fetchAdminContactTickets(
  status: ContactTicketStatusFilter = 'open',
  category: ContactTicketCategoryFilter = 'all',
): Promise<ContactTicket[]> {
  const params = new URLSearchParams({ status })

  if (category !== 'all') {
    params.set('category', category)
  }

  return apiRequest<ContactTicket[]>(`/admin/contact/tickets?${params.toString()}`, {
    token: getToken(),
  })
}

export function completeContactTicket(id: string): Promise<ContactTicket> {
  return apiRequest<ContactTicket>(`/admin/contact/tickets/${encodeURIComponent(id)}/complete`, {
    method: 'PATCH',
    token: getToken(),
  })
}

export function rejectContactTicket(id: string, reason: string): Promise<ContactTicket> {
  return apiRequest<ContactTicket>(`/admin/contact/tickets/${encodeURIComponent(id)}/reject`, {
    method: 'PATCH',
    token: getToken(),
    headers: jsonHeaders(),
    body: JSON.stringify({ reason }),
  })
}

export function markContactTicketSeen(id: string): Promise<ContactTicket> {
  return apiRequest<ContactTicket>(`/admin/contact/tickets/${encodeURIComponent(id)}/seen`, {
    method: 'PATCH',
    token: getToken(),
  })
}

export function startContactTicketWork(id: string): Promise<ContactTicket> {
  return apiRequest<ContactTicket>(`/admin/contact/tickets/${encodeURIComponent(id)}/start`, {
    method: 'PATCH',
    token: getToken(),
  })
}

export function reopenContactTicket(id: string): Promise<ContactTicket> {
  return apiRequest<ContactTicket>(`/admin/contact/tickets/${encodeURIComponent(id)}/reopen`, {
    method: 'PATCH',
    token: getToken(),
  })
}
