<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-black text-[#094b7b]">Poster i samlingen</h2>
        <p class="text-sm text-slate-500">
          {{ activeRecords.length }} aktive · {{ hiddenRecords.length }} skjulte
        </p>
      </div>

      <AdminSegmentedTabs v-model="activeTab" :tabs="recordTabs" />
    </div>

    <div
      v-if="activeTab === 'hidden' && isHiddenLoading"
      class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600"
    >
      Henter skjulte poster...
    </div>

    <div
      v-else-if="!displayedRecords.length"
      class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600"
    >
      {{ activeTab === 'hidden' ? 'Der er ingen skjulte poster.' : 'Der er ingen aktive poster.' }}
    </div>

    <div v-else class="mt-4 grid gap-3">
      <article
        v-for="record in displayedRecords"
        :key="record._id"
        class="rounded-lg border border-slate-200 p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-black text-slate-900">{{ record.name || record._id }}</h3>
              <span
                v-if="record.isHidden"
                class="rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-800"
              >
                Skjult
              </span>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ record.description }}</p>
          </div>
          <div class="flex gap-2">
            <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="$emit('edit', record)">
              Rediger
            </button>
            <button
              v-if="record.isHidden"
              class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white"
              @click="$emit('restore', record._id)"
            >
              Gendan
            </button>
            <button
              v-else
              class="rounded-md bg-rose-600 px-3 py-2 text-sm font-black text-white"
              @click="$emit('hide', record._id)"
            >
              Skjul
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminSegmentedTabs from '@/components/admin/AdminSegmentedTabs.vue'
import type { AdminRecord } from '@/types/admin'

type RecordTabKey = 'active' | 'hidden'

const props = defineProps<{
  activeRecords: AdminRecord[]
  hiddenRecords: AdminRecord[]
  isHiddenLoading: boolean
}>()

const emit = defineEmits<{
  edit: [record: AdminRecord]
  hide: [id: string]
  restore: [id: string]
  loadHidden: []
}>()

const activeTab = ref<RecordTabKey>('active')
const recordTabs: { key: RecordTabKey; label: string }[] = [
  { key: 'active', label: 'Aktive' },
  { key: 'hidden', label: 'Skjulte' },
]

const displayedRecords = computed(() =>
  activeTab.value === 'hidden' ? props.hiddenRecords : props.activeRecords,
)

watch(activeTab, (tab) => {
  if (tab === 'hidden') {
    emit('loadHidden')
  }
})
</script>
