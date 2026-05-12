export type ContactTicketCategory = 'bug' | 'report' | 'account' | 'content' | 'other'
export type ContactTicketStatus = 'open' | 'in_progress' | 'completed' | 'rejected'
export type ContactTicketStatusFilter = ContactTicketStatus | 'all'
export type ContactTicketCategoryFilter = ContactTicketCategory | 'all'

export type ContactTicket = {
  _id: string
  category: ContactTicketCategory
  status: ContactTicketStatus
  subject: string
  message: string
  submittedBy: string
  submittedByName: string
  submittedByEmail: string
  seenBy?: string
  seenAt?: string
  inProgressBy?: string
  inProgressAt?: string
  completedBy?: string
  completedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export type CreateContactTicketPayload = {
  category: ContactTicketCategory
  subject: string
  message: string
}

export const contactTicketCategoryOptions: {
  key: ContactTicketCategory
  label: string
  description: string
  badgeClass: string
  borderClass: string
}[] = [
  {
    key: 'bug',
    label: 'Fejl',
    description: 'Noget virker ikke som forventet.',
    badgeClass: 'bg-rose-100 text-rose-800',
    borderClass: 'border-l-rose-500',
  },
  {
    key: 'report',
    label: 'Rapport',
    description: 'Rapportér indhold, adfærd eller sikkerhedsproblemer.',
    badgeClass: 'bg-amber-100 text-amber-800',
    borderClass: 'border-l-amber-500',
  },
  {
    key: 'account',
    label: 'Konto',
    description: 'Hjælp til login, profil eller kontoindstillinger.',
    badgeClass: 'bg-sky-100 text-sky-800',
    borderClass: 'border-l-sky-500',
  },
  {
    key: 'content',
    label: 'Indhold',
    description: 'Rettelser eller spørgsmål til steder, events og oplevelser.',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    borderClass: 'border-l-emerald-500',
  },
  {
    key: 'other',
    label: 'Andet',
    description: 'Alt andet, som admin bør se på.',
    badgeClass: 'bg-violet-100 text-violet-800',
    borderClass: 'border-l-violet-500',
  },
]

export function getContactTicketCategoryMeta(
  category: ContactTicketCategory,
): (typeof contactTicketCategoryOptions)[number] {
  return (
    contactTicketCategoryOptions.find((option) => option.key === category) ??
    contactTicketCategoryOptions[contactTicketCategoryOptions.length - 1]!
  )
}
