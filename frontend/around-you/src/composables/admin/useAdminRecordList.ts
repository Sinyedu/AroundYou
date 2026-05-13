import { computed, ref, watch } from 'vue'

import type { AdminRecord } from '@/types/admin'

export type AdminRecordTabKey = 'active' | 'hidden'

export const adminRecordTabs: { key: AdminRecordTabKey; label: string }[] = [
  { key: 'active', label: 'Aktive' },
  { key: 'hidden', label: 'Skjulte' },
]

export function useAdminRecordList(
  props: {
    activeRecords: AdminRecord[]
    hiddenRecords: AdminRecord[]
  },
  loadHiddenRecords: () => void,
) {
  const activeTab = ref<AdminRecordTabKey>('active')
  const displayedRecords = computed(() =>
    activeTab.value === 'hidden' ? props.hiddenRecords : props.activeRecords,
  )

  watch(activeTab, (tab) => {
    if (tab === 'hidden') {
      loadHiddenRecords()
    }
  })

  return {
    activeTab,
    displayedRecords,
    recordTabs: adminRecordTabs,
  }
}
