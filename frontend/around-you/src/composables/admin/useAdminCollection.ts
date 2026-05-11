import { computed, ref } from 'vue'
import {
  approveAdminSuggestion,
  createAdminRecord,
  deleteAdminRecord,
  fetchAdminCollection,
  fetchAdminSuggestions,
  rejectAdminSuggestion,
  restoreAdminRecord,
  updateAdminRecord,
} from '@/api/admin.api'
import { getGeocodedCoordinates } from '@/api/geocoding.api'
import type {
  AdminCollectionConfig,
  AdminCollectionKey,
  AdminEditableRecord,
  AdminFieldConfig,
  AdminFieldValue,
  AdminRecord,
} from '@/types/admin'
import type { ContentSuggestion } from '@/types/content-suggestion'

function cloneRecord(record: AdminEditableRecord): AdminEditableRecord {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]),
  ) as AdminEditableRecord
}

function toEditableRecord(
  record: AdminEditableRecord,
  fields: AdminFieldConfig[],
): AdminEditableRecord {
  return Object.fromEntries(fields.map((field) => [field.key, normalizeValue(record[field.key])]))
}

function normalizeValue(value: AdminFieldValue | undefined): AdminFieldValue {
  if (value === undefined) {
    return ''
  }

  return value
}

function getStringValue(record: AdminEditableRecord, key: string): string {
  const value = record[key]
  return typeof value === 'string' ? value.trim() : ''
}

function isAddressGeocodedCollection(collection: AdminCollectionKey): boolean {
  return collection === 'attractions' || collection === 'events'
}

async function withResolvedGpsPosition(
  collection: AdminCollectionKey,
  record: AdminEditableRecord,
): Promise<AdminEditableRecord> {
  const payload: AdminEditableRecord = { ...record }

  if (isAddressGeocodedCollection(collection)) {
    const address = getStringValue(payload, 'address')
    const city = getStringValue(payload, 'city')

    if (!address || !city) {
      throw new Error('Indtast både adresse og by.')
    }

    const location = await getGeocodedCoordinates(address, city)
    payload.gpsPosition = `${location.latitude},${location.longitude}`

    delete payload.address
    delete payload.city

    return payload
  }

  if (collection === 'city') {
    const name = getStringValue(payload, 'name')

    if (!name) {
      throw new Error('Indtast bynavn.')
    }

    const location = await getGeocodedCoordinates(null, name)
    payload.gpsPosition = `${location.latitude},${location.longitude}`
  }

  return payload
}

export function useAdminCollection(config: AdminCollectionConfig) {
  const activeRecords = ref<AdminRecord[]>([])
  const hiddenRecords = ref<AdminRecord[]>([])
  const suggestions = ref<ContentSuggestion[]>([])
  const form = ref<AdminEditableRecord>(cloneRecord(config.emptyRecord))
  const editingId = ref<string | null>(null)
  const isLoading = ref(false)
  const isHiddenLoading = ref(false)
  const isSaving = ref(false)
  const activeSuggestionId = ref('')
  const errorMessage = ref('')

  const selectedRecord = computed(() =>
    editingId.value
      ? [...activeRecords.value, ...hiddenRecords.value].find(
          (record) => record._id === editingId.value,
        )
      : null,
  )

  async function load(): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const [collectionRecords, pendingSuggestions] = await Promise.all([
        fetchAdminCollection(config.key, 'active'),
        fetchAdminSuggestions('pending'),
      ])
      activeRecords.value = collectionRecords
      suggestions.value = pendingSuggestions.filter(
        (suggestion) => suggestion.type === config.pendingType,
      )
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke hente admindata.'
    } finally {
      isLoading.value = false
    }
  }

  async function loadHiddenRecords(): Promise<void> {
    isHiddenLoading.value = true
    errorMessage.value = ''

    try {
      hiddenRecords.value = await fetchAdminCollection(config.key, 'hidden')
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke hente skjulte poster.'
    } finally {
      isHiddenLoading.value = false
    }
  }

  function resetForm(): void {
    editingId.value = null
    form.value = cloneRecord(config.emptyRecord)
  }

  function editRecord(record: AdminRecord): void {
    editingId.value = record._id
    form.value = toEditableRecord(record, config.fields)
  }

  async function saveRecord(): Promise<void> {
    isSaving.value = true
    errorMessage.value = ''

    try {
      if (editingId.value) {
        const payload = await withResolvedGpsPosition(config.key, form.value)
        const updated = await updateAdminRecord(config.key, editingId.value, payload)
        if (updated.isHidden) {
          hiddenRecords.value = hiddenRecords.value.map((record) =>
            record._id === updated._id ? updated : record,
          )
        } else {
          activeRecords.value = activeRecords.value.map((record) =>
            record._id === updated._id ? updated : record,
          )
        }
      } else {
        const payload = await withResolvedGpsPosition(config.key, form.value)
        const created = await createAdminRecord(config.key, payload)
        activeRecords.value = [created, ...activeRecords.value]
      }

      resetForm()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke gemme posten.'
    } finally {
      isSaving.value = false
    }
  }

  async function removeRecord(id: string): Promise<void> {
    const confirmed = window.confirm('Vil du skjule denne post? Handlingen afgøres af backend.')
    if (!confirmed) return

    errorMessage.value = ''

    try {
      const hidden = await deleteAdminRecord(config.key, id)
      activeRecords.value = activeRecords.value.filter((record) => record._id !== hidden._id)
      hiddenRecords.value = [
        hidden,
        ...hiddenRecords.value.filter((record) => record._id !== hidden._id),
      ]
      if (editingId.value === id) {
        resetForm()
      }
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke skjule posten.'
    }
  }

  async function restoreRecord(id: string): Promise<void> {
    errorMessage.value = ''

    try {
      const restored = await restoreAdminRecord(config.key, id)
      hiddenRecords.value = hiddenRecords.value.filter((record) => record._id !== restored._id)
      activeRecords.value = [
        restored,
        ...activeRecords.value.filter((record) => record._id !== restored._id),
      ]
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke gendanne posten.'
    }
  }

  async function approveSuggestion(id: string): Promise<void> {
    activeSuggestionId.value = id
    errorMessage.value = ''

    try {
      await approveAdminSuggestion(id)
      suggestions.value = suggestions.value.filter((suggestion) => suggestion._id !== id)
      activeRecords.value = await fetchAdminCollection(config.key, 'active')
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke godkende forslaget.'
    } finally {
      activeSuggestionId.value = ''
    }
  }

  async function rejectSuggestion(id: string): Promise<void> {
    const reason = window.prompt('Hvorfor afvises dette forslag?') ?? ''
    activeSuggestionId.value = id
    errorMessage.value = ''

    try {
      await rejectAdminSuggestion(id, reason)
      suggestions.value = suggestions.value.filter((suggestion) => suggestion._id !== id)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke afvise forslaget.'
    } finally {
      activeSuggestionId.value = ''
    }
  }

  return {
    activeRecords,
    hiddenRecords,
    suggestions,
    form,
    editingId,
    selectedRecord,
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
  }
}
