<template>
  <section class="grid gap-6 xl:grid-cols-[360px_1fr]">
    <aside class="rounded-lg border border-slate-200 bg-white p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#de5826]">
            {{ config.label }}
          </p>
          <h2 class="mt-2 text-xl font-black text-[#094b7b]">
            {{ editingId ? 'Rediger post' : 'Opret post' }}
          </h2>
        </div>
        <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="resetForm">
          Ny
        </button>
      </div>

      <form class="mt-5 grid gap-4" @submit.prevent="saveRecord">
        <label v-for="field in config.fields" :key="field.key" class="grid gap-1.5 text-sm font-bold text-slate-700">
          {{ field.label }}
          <textarea
            v-if="field.type === 'textarea'"
            class="min-h-28 rounded-md border border-slate-300 px-3 py-2 font-normal"
            :required="field.required"
            :value="stringField(field.key)"
            @input="setStringField(field.key, ($event.target as HTMLTextAreaElement).value)"
          />
          <input
            v-else-if="field.type === 'number'"
            class="rounded-md border border-slate-300 px-3 py-2 font-normal"
            type="number"
            :required="field.required"
            :value="numberField(field.key)"
            @input="setNumberField(field.key, ($event.target as HTMLInputElement).value)"
          />
          <input
            v-else-if="field.type === 'checkbox'"
            class="h-5 w-5 rounded border-slate-300"
            type="checkbox"
            :checked="booleanField(field.key)"
            @change="setBooleanField(field.key, ($event.target as HTMLInputElement).checked)"
          />
          <input
            v-else-if="field.type === 'date'"
            class="rounded-md border border-slate-300 px-3 py-2 font-normal"
            type="datetime-local"
            :required="field.required"
            :value="dateField(field.key)"
            @input="setStringField(field.key, ($event.target as HTMLInputElement).value)"
          />
          <input
            v-else
            class="rounded-md border border-slate-300 px-3 py-2 font-normal"
            :required="field.required"
            :value="field.type === 'tags' ? tagsField(field.key) : stringField(field.key)"
            @input="setTextLikeField(field.key, field.type, ($event.target as HTMLInputElement).value)"
          />
          <span v-if="field.type === 'tags'" class="text-xs font-medium text-slate-500">
            Adskil værdier med komma.
          </span>
        </label>

        <p v-if="errorMessage" class="rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
          {{ errorMessage }}
        </p>

        <button
          class="rounded-md bg-[#094b7b] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Gemmer...' : editingId ? 'Opdater' : 'Opret' }}
        </button>
      </form>
    </aside>

    <div class="grid gap-6">
      <section class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-[#094b7b]">Afventende forslag</h2>
            <p class="text-sm text-slate-500">
              {{ suggestions.length }} afventer godkendelse eller afvisning.
            </p>
          </div>
          <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="load">
            Opdater
          </button>
        </div>

        <div v-if="isLoading" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
          Henter...
        </div>
        <div v-else-if="!suggestions.length" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
          Der er ingen afventende forslag i denne samling.
        </div>
        <div v-else class="mt-4 grid gap-3">
          <article v-for="suggestion in suggestions" :key="suggestion._id" class="rounded-lg border border-slate-200 p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="font-black text-slate-900">
                  {{ suggestion.payload.name || 'Unavngivet forslag' }}
                </h3>
                <p class="text-sm text-slate-500">
                  {{ suggestion.submittedByName }} ·
                  {{ new Date(suggestion.createdAt).toLocaleString('da-DK') }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white disabled:opacity-60"
                  :disabled="activeSuggestionId === suggestion._id"
                  @click="approveSuggestion(suggestion._id)"
                >
                  Godkend
                </button>
                <button
                  class="rounded-md bg-rose-600 px-3 py-2 text-sm font-black text-white disabled:opacity-60"
                  :disabled="activeSuggestionId === suggestion._id"
                  @click="rejectSuggestion(suggestion._id)"
                >
                  Afvis
                </button>
              </div>
            </div>
            <dl class="mt-3 grid gap-2 md:grid-cols-2">
              <div v-for="[key, value] in Object.entries(suggestion.payload)" :key="key" class="rounded-md bg-slate-50 p-3">
                <dt class="text-xs font-black uppercase text-slate-400">{{ key }}</dt>
                <dd class="mt-1 break-words text-sm text-slate-700">{{ formatValue(value) }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-[#094b7b]">Poster i samlingen</h2>
            <p class="text-sm text-slate-500">
              {{ activeRecords.length }} aktive · {{ hiddenRecords.length }} skjulte
            </p>
          </div>

          <div class="flex rounded-md border border-slate-200 bg-slate-50 p-1">
            <button
              v-for="tab in recordTabs"
              :key="tab.key"
              class="rounded px-3 py-1.5 text-sm font-black"
              :class="
                activeRecordTab === tab.key
                  ? 'bg-white text-[#094b7b] shadow-sm'
                  : 'text-slate-500'
              "
              @click="setRecordTab(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div
          v-if="activeRecordTab === 'hidden' && isHiddenLoading"
          class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600"
        >
          Henter skjulte poster...
        </div>

        <div
          v-else-if="!displayedRecords.length"
          class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600"
        >
          {{ activeRecordTab === 'hidden' ? 'Der er ingen skjulte poster.' : 'Der er ingen aktive poster.' }}
        </div>

        <div v-else class="mt-4 grid gap-3">
          <article v-for="record in displayedRecords" :key="record._id" class="rounded-lg border border-slate-200 p-4">
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
                <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="editRecord(record)">
                  Rediger
                </button>
                <button
                  v-if="record.isHidden"
                  class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white"
                  @click="restoreRecord(record._id)"
                >
                  Gendan
                </button>
                <button
                  v-else
                  class="rounded-md bg-rose-600 px-3 py-2 text-sm font-black text-white"
                  @click="removeRecord(record._id)"
                >
                  Skjul
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminCollection } from '@/composables/admin/useAdminCollection'
import type { AdminCollectionConfig, AdminFieldType, AdminFieldValue } from '@/types/admin'

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

type RecordTabKey = 'active' | 'hidden'

const activeRecordTab = ref<RecordTabKey>('active')
const recordTabs: { key: RecordTabKey; label: string }[] = [
  { key: 'active', label: 'Aktive' },
  { key: 'hidden', label: 'Skjulte' },
]
const displayedRecords = computed(() =>
  activeRecordTab.value === 'hidden' ? hiddenRecords.value : activeRecords.value,
)

async function setRecordTab(tab: RecordTabKey): Promise<void> {
  activeRecordTab.value = tab

  if (tab === 'hidden') {
    await loadHiddenRecords()
  }
}

function stringField(key: string): string {
  const value = form.value[key]
  return typeof value === 'string' ? value : ''
}

function numberField(key: string): number {
  const value = form.value[key]
  return typeof value === 'number' ? value : 0
}

function booleanField(key: string): boolean {
  const value = form.value[key]
  return typeof value === 'boolean' ? value : false
}

function tagsField(key: string): string {
  const value = form.value[key]
  return Array.isArray(value) ? value.join(', ') : ''
}

function dateField(key: string): string {
  const value = stringField(key)
  return value.includes('T') ? value.slice(0, 16) : value
}

function setStringField(key: string, value: string): void {
  form.value[key] = value
}

function setNumberField(key: string, value: string): void {
  form.value[key] = Number(value)
}

function setBooleanField(key: string, value: boolean): void {
  form.value[key] = value
}

function setTextLikeField(key: string, type: AdminFieldType, value: string): void {
  form.value[key] =
    type === 'tags'
      ? value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      : value
}

function formatValue(value: AdminFieldValue): string {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Ja' : 'Nej'
  return String(value)
}

onMounted(() => {
  void load()
})
</script>
