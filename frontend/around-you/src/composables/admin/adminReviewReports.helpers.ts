import type { AdminVisibility } from '@/types/admin'

export type AdminReviewReportTabKey = Extract<AdminVisibility, 'active' | 'hidden'>

export const adminReviewReportTabs: { key: AdminReviewReportTabKey; label: string }[] = [
  { key: 'active', label: 'Aktive rapporter' },
  { key: 'hidden', label: 'Skjulte' },
]

export function getReviewRemovalReason(): string {
  return (
    window
      .prompt('Hvilken regel brød anmeldelsen? Dette sendes til brugeren.', 'Upassende indhold')
      ?.trim() ?? ''
  )
}
