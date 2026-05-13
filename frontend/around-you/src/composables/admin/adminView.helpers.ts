import type { AdminCollectionConfig, AdminCollectionKey } from '@/types/admin'

export type AdminTabKey = AdminCollectionKey | 'reviews' | 'contact'

export type AdminTab = {
  key: AdminTabKey
  label: string
}

export function getAdminTabs(collections: AdminCollectionConfig[]): AdminTab[] {
  return [
    ...collections.map((collection) => ({
      key: collection.key,
      label: collection.label,
    })),
    { key: 'contact', label: 'Henvendelser' },
    { key: 'reviews', label: 'Anmeldelsesrapporter' },
  ]
}

export function getActiveAdminCollection(
  collections: AdminCollectionConfig[],
  activeTab: AdminTabKey,
) {
  return collections.find((collection) => collection.key === activeTab)
}
