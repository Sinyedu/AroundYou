import type { AdminEditableRecord } from '@/types/admin'
import { isAllowedImageType } from '@/utils/imageCompressor'

export function getAdminFormStringField(record: AdminEditableRecord, key: string): string {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

export function getAdminFormArrayField(record: AdminEditableRecord, key: string): string[] {
  const value = record[key]
  return Array.isArray(value) ? value : []
}

export function getAdminFormNumberField(record: AdminEditableRecord, key: string): number {
  const value = record[key]
  return typeof value === 'number' ? value : 0
}

export function getAdminFormBooleanField(record: AdminEditableRecord, key: string): boolean {
  const value = record[key]
  return typeof value === 'boolean' ? value : false
}

export function getAdminFormTagsField(record: AdminEditableRecord, key: string): string {
  return getAdminFormArrayField(record, key).join(', ')
}

export function getAdminFormDateField(record: AdminEditableRecord, key: string): string {
  const value = getAdminFormStringField(record, key)
  return value.includes('T') ? value.slice(0, 16) : value
}

export function toAdminTagsValue(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function getSelectedAdminFiles(event: Event): {
  files: File[]
  target: HTMLInputElement | null
} {
  const target = event.target as HTMLInputElement | null
  return {
    target,
    files: target?.files ? Array.from(target.files) : [],
  }
}

export function validateAdminImageFiles(files: File[]): void {
  const invalidFile = files.find((file) => !isAllowedImageType(file))

  if (invalidFile) {
    throw new Error('Kun PNG-, JPG- og WEBP-billeder er tilladt.')
  }
}
