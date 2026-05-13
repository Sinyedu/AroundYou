import { computed, ref } from 'vue'

import { adminCollections } from '@/admin/adminCollections'
import { getActiveAdminCollection, getAdminTabs, type AdminTabKey } from './adminView.helpers'

export function useAdminView() {
  const activeTab = ref<AdminTabKey>('city')
  const tabs = getAdminTabs(adminCollections)
  const activeCollection = computed(() =>
    getActiveAdminCollection(adminCollections, activeTab.value),
  )

  return {
    activeCollection,
    activeTab,
    tabs,
  }
}
