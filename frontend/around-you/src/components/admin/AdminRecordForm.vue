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
      <button
        class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold"
        @click="$emit('reset')"
      >
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
        <div v-if="field.type === 'image'" class="grid gap-2">
          <input
            class="rounded-md border border-slate-300 px-3 py-2 font-normal"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            :required="field.required && !stringField(field.key)"
            :disabled="isFieldUploading(field.key)"
            @change="uploadSingleImage(field.key, $event)"
          />
          <img
            v-if="stringField(field.key)"
            :src="resolveApiAssetUrl(stringField(field.key))"
            :alt="field.label"
            class="h-28 w-full rounded-md border border-slate-200 object-cover"
          />
          <button
            v-if="stringField(field.key)"
            type="button"
            class="justify-self-start text-xs font-bold text-rose-700"
            @click="setStringField(field.key, '')"
          >
            Fjern billede
          </button>
        </div>
        <div v-else-if="field.type === 'image-list'" class="grid gap-2">
          <input
            class="rounded-md border border-slate-300 px-3 py-2 font-normal"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            :disabled="isFieldUploading(field.key)"
            @change="uploadImageList(field.key, $event)"
          />
          <div v-if="arrayField(field.key).length" class="grid grid-cols-2 gap-2">
            <div
              v-for="(image, index) in arrayField(field.key)"
              :key="`${image}-${index}`"
              class="grid gap-1"
            >
              <img
                :src="resolveApiAssetUrl(image)"
                :alt="`${field.label} ${index + 1}`"
                class="h-20 w-full rounded-md border border-slate-200 object-cover"
              />
              <button
                type="button"
                class="justify-self-start text-xs font-bold text-rose-700"
                @click="removeImageFromList(field.key, index)"
              >
                Fjern
              </button>
            </div>
          </div>
        </div>
        <textarea
          v-else-if="field.type === 'textarea'"
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
          @input="
            setTextLikeField(field.key, field.type, ($event.target as HTMLInputElement).value)
          "
        />
        <span v-if="field.type === 'tags'" class="text-xs font-medium text-slate-500">
          Adskil værdier med komma.
        </span>
        <span v-if="isFieldUploading(field.key)" class="text-xs font-bold text-[#094b7b]">
          Uploader billede...
        </span>
      </label>

      <p
        v-if="displayErrorMessage"
        class="rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"
      >
        {{ displayErrorMessage }}
      </p>

      <button
        class="rounded-md bg-[#094b7b] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
        :disabled="isSaving || isUploading"
      >
        {{ isSaving || isUploading ? 'Gemmer...' : isEditing ? 'Opdater' : 'Opret' }}
      </button>
    </form>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { uploadImageFile } from '@/api/contentApi'
import { resolveApiAssetUrl } from '@/constants/config'
import type { AdminCollectionConfig, AdminEditableRecord, AdminFieldType } from '@/types/admin'
import { compressImageFile, isAllowedImageType } from '@/utils/imageCompressor'

const props = defineProps<{
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
const uploadError = ref('')
const uploadingFields = ref<string[]>([])

const isUploading = computed(() => uploadingFields.value.length > 0)
const displayErrorMessage = computed(() => uploadError.value || props.errorMessage)

function stringField(key: string): string {
  const value = form.value[key]
  return typeof value === 'string' ? value : ''
}

function arrayField(key: string): string[] {
  const value = form.value[key]
  return Array.isArray(value) ? value : []
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
  return arrayField(key).join(', ')
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

function isFieldUploading(key: string): boolean {
  return uploadingFields.value.includes(key)
}

function startUploading(key: string): void {
  if (!uploadingFields.value.includes(key)) {
    uploadingFields.value = [...uploadingFields.value, key]
  }
}

function stopUploading(key: string): void {
  uploadingFields.value = uploadingFields.value.filter((fieldKey) => fieldKey !== key)
}

function getSelectedFiles(event: Event): { files: File[]; target: HTMLInputElement | null } {
  const target = event.target as HTMLInputElement | null
  return {
    target,
    files: target?.files ? Array.from(target.files) : [],
  }
}

function validateImageFiles(files: File[]): void {
  const invalidFile = files.find((file) => !isAllowedImageType(file))

  if (invalidFile) {
    throw new Error('Kun PNG-, JPG- og WEBP-billeder er tilladt.')
  }
}

async function uploadFiles(files: File[]): Promise<string[]> {
  validateImageFiles(files)
  const token = localStorage.getItem('token')
  const compressedFiles = await Promise.all(files.map((file) => compressImageFile(file)))
  return Promise.all(compressedFiles.map((file) => uploadImageFile(file, token)))
}

async function uploadSingleImage(key: string, event: Event): Promise<void> {
  const { files, target } = getSelectedFiles(event)
  if (!files.length) return

  uploadError.value = ''
  startUploading(key)

  try {
    const file = files[0]
    if (!file) return

    const [imageUrl] = await uploadFiles([file])
    if (!imageUrl) return

    setStringField(key, imageUrl)
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Billedet kunne ikke uploades.'
  } finally {
    stopUploading(key)
    if (target) target.value = ''
  }
}

async function uploadImageList(key: string, event: Event): Promise<void> {
  const { files, target } = getSelectedFiles(event)
  if (!files.length) return

  uploadError.value = ''
  startUploading(key)

  try {
    const imageUrls = await uploadFiles(files)
    form.value[key] = [...arrayField(key), ...imageUrls]
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Billederne kunne ikke uploades.'
  } finally {
    stopUploading(key)
    if (target) target.value = ''
  }
}

function removeImageFromList(key: string, index: number): void {
  form.value[key] = arrayField(key).filter((_, imageIndex) => imageIndex !== index)
}
</script>
