import { ref } from 'vue'
import { compressImageFile, isAllowedImageType } from '@/utils/imageCompressor'
import type { ContentType } from '@/types/content'
import type { CreateContentMessageSetter } from '@/types/content/useCreateContent'

export const useCreateContentImages = () => {
  const eventHeroImageFile = ref<File | null>(null)
  const attractionHeroImageFile = ref<File | null>(null)
  const cityHeroImageFile = ref<File | null>(null)
  const eventImageArrayFiles = ref<File[]>([])
  const attractionImageArrayFiles = ref<File[]>([])

  const onHeroImageSelected = (
    contentType: ContentType,
    event: Event,
    setMessage: CreateContentMessageSetter,
  ) => {
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0]

    if (!file) {
      return
    }

    if (!isAllowedImageType(file)) {
      setMessage('Only PNG, JPEG, and WebP images are allowed.')
      target.value = ''
      return
    }

    if (contentType === 'event') {
      eventHeroImageFile.value = file
    } else if (contentType === 'attraction') {
      attractionHeroImageFile.value = file
    } else {
      cityHeroImageFile.value = file
    }

    setMessage('')
  }

  const onImageArraySelected = (
    contentType: 'event' | 'attraction',
    event: Event,
    setMessage: CreateContentMessageSetter,
  ) => {
    const target = event.target as HTMLInputElement | null
    const files = target?.files ? Array.from(target.files) : []

    if (!files.length) {
      return
    }

    const invalidFile = files.find((file) => !isAllowedImageType(file))
    if (invalidFile) {
      setMessage('Only PNG, JPEG, and WebP images are allowed.')
      if (target) {
        target.value = ''
      }
      return
    }

    if (contentType === 'event') {
      eventImageArrayFiles.value = files
    } else {
      attractionImageArrayFiles.value = files
    }

    setMessage('')
  }

  const compressImageFiles = (files: File[]) => {
    return Promise.all(files.map((file) => compressImageFile(file)))
  }

  return {
    eventHeroImageFile,
    attractionHeroImageFile,
    cityHeroImageFile,
    eventImageArrayFiles,
    attractionImageArrayFiles,
    onHeroImageSelected,
    onImageArraySelected,
    compressImageFiles,
  }
}
