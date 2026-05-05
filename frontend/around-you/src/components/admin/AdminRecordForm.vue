<template>
  <aside class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#de5826]">
          {{ config.label }}
        </p>
        <h2 class="mt-2 text-xl font-black text-[#094b7b]">
          {{ isEditing ? 'Rediger post' : 'Opret post' }}
        </h2>
      </div>
      <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="$emit('reset')">
        Ny
      </button>
    </div>

    <form class="mt-5 grid gap-4" @submit.prevent="$emit('save')">
      <label
        v-for="field in config.fields"
        :key="field.key"
        class="grid gap-1.5 text-sm font-bold text-slate-700"
      >
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
        {{ isSaving ? 'Gemmer...' : isEditing ? 'Opdater' : 'Opret' }}
      </button>
    </form>
  </aside>
</template>

<script setup lang="ts">
import type {
  AdminCollectionConfig,
  AdminEditableRecord,
  AdminFieldType,
} from '@/types/admin'

defineProps<{
  config: AdminCollectionConfig
  errorMessage: string
  isEditing: boolean
  isSaving: boolean
}>()

defineEmits<{
  reset: []
  save: []
}>()

const form = defineModel<AdminEditableRecord>({ required: true })

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
</script>
