import { computed, ref, type Ref } from 'vue'

import { uploadImageFile } from '@/api/contentApi'
import type { AdminEditableRecord, AdminFieldType } from '@/types/admin'
import { compressImageFile } from '@/utils/imageCompressor'
import {
  getAdminFormArrayField,
  getAdminFormBooleanField,
  getAdminFormDateField,
  getAdminFormNumberField,
  getAdminFormStringField,
  getAdminFormTagsField,
  getSelectedAdminFiles,
  toAdminTagsValue,
  validateAdminImageFiles,
} from './adminRecordForm.helpers'

export function useAdminRecordForm(form: Ref<AdminEditableRecord>, errorMessage: Ref<string>) {
  const uploadError = ref('')
  const uploadingFields = ref<string[]>([])

  const isUploading = computed(() => uploadingFields.value.length > 0)
  const displayErrorMessage = computed(() => uploadError.value || errorMessage.value)

  function stringField(key: string): string {
    return getAdminFormStringField(form.value, key)
  }

  function arrayField(key: string): string[] {
    return getAdminFormArrayField(form.value, key)
  }

  function numberField(key: string): number {
    return getAdminFormNumberField(form.value, key)
  }

  function booleanField(key: string): boolean {
    return getAdminFormBooleanField(form.value, key)
  }

  function tagsField(key: string): string {
    return getAdminFormTagsField(form.value, key)
  }

  function dateField(key: string): string {
    return getAdminFormDateField(form.value, key)
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
    form.value[key] = type === 'tags' ? toAdminTagsValue(value) : value
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

  async function uploadFiles(files: File[]): Promise<string[]> {
    validateAdminImageFiles(files)
    const token = localStorage.getItem('token')
    const compressedFiles = await Promise.all(files.map((file) => compressImageFile(file)))
    return Promise.all(compressedFiles.map((file) => uploadImageFile(file, token)))
  }

  async function uploadSingleImage(key: string, event: Event): Promise<void> {
    const { files, target } = getSelectedAdminFiles(event)
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
    const { files, target } = getSelectedAdminFiles(event)
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

  return {
    arrayField,
    booleanField,
    dateField,
    displayErrorMessage,
    isFieldUploading,
    isUploading,
    numberField,
    removeImageFromList,
    setBooleanField,
    setNumberField,
    setStringField,
    setTextLikeField,
    stringField,
    tagsField,
    uploadImageList,
    uploadSingleImage,
  }
}
