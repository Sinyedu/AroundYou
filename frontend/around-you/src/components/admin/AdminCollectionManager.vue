<template>
  <section class="grid gap-6 xl:grid-cols-[360px_1fr]">
    <AdminRecordForm
      v-model="form"
      :config="config"
      :error-message="errorMessage"
      :is-editing="editingId !== null"
      :is-saving="isSaving"
      @reset="resetForm"
      @save="saveRecord"
    />

    <div class="grid gap-6">
      <AdminSuggestionQueue
        :suggestions="suggestions"
        :is-loading="isLoading"
        :active-suggestion-id="activeSuggestionId"
        @refresh="load"
        @approve="approveSuggestion"
        @reject="rejectSuggestion"
      />

      <AdminRecordList
        :active-records="activeRecords"
        :hidden-records="hiddenRecords"
        :is-hidden-loading="isHiddenLoading"
        @edit="editRecord"
        @hide="removeRecord"
        @restore="restoreRecord"
        @load-hidden="loadHiddenRecords"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminRecordForm from '@/components/admin/AdminRecordForm.vue'
import AdminRecordList from '@/components/admin/AdminRecordList.vue'
import AdminSuggestionQueue from '@/components/admin/AdminSuggestionQueue.vue'
import { useAdminCollection } from '@/composables/admin/useAdminCollection'
import type { AdminCollectionConfig } from '@/types/admin'

const props = defineProps<{
  config: AdminCollectionConfig
}>()

const {
  activeRecords,
  hiddenRecords,
  suggestions,
  form,
  editingId,
  isLoading,
  isHiddenLoading,
  isSaving,
  activeSuggestionId,
  errorMessage,
  load,
  loadHiddenRecords,
  resetForm,
  editRecord,
  saveRecord,
  removeRecord,
  restoreRecord,
  approveSuggestion,
  rejectSuggestion,
} = useAdminCollection(props.config)

onMounted(() => {
  void load()
})
</script>
