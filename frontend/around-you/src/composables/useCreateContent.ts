import { useCreateContentForm } from './useCreateContentForm'
import { useCreateContentImages } from './useCreateContentImages'
import { useCreateContentSubmit } from './useCreateContentSubmit'

export const useCreateContent = () => {
  const {
    selectedType,
    message,
    categoryOptions,
    eventForm,
    attractionForm,
    cityForm,
    typeButtonClass,
  } = useCreateContentForm()

  const {
    eventHeroImageFile,
    attractionHeroImageFile,
    cityHeroImageFile,
    eventImageArrayFiles,
    attractionImageArrayFiles,
    onHeroImageSelected: _onHeroImageSelected,
    onImageArraySelected: _onImageArraySelected,
    compressImageFiles,
  } = useCreateContentImages()

  const {
    isSubmitting,
    isUploadingImage,
    submitSelected: _submitSelected,
  } = useCreateContentSubmit(
    selectedType,
    eventForm,
    attractionForm,
    cityForm,
    eventHeroImageFile,
    attractionHeroImageFile,
    cityHeroImageFile,
    eventImageArrayFiles,
    attractionImageArrayFiles,
    compressImageFiles,
  )

  const setMessage = (msg: string) => {
    message.value = msg
  }

  const onHeroImageSelected = (contentType: any, event: Event) => {
    _onHeroImageSelected(contentType, event, setMessage)
  }

  const onImageArraySelected = (contentType: any, event: Event) => {
    _onImageArraySelected(contentType, event, setMessage)
  }

  const submitSelected = async () => {
    await _submitSelected(setMessage)
  }

  return {
    selectedType,
    isSubmitting,
    isUploadingImage,
    message,
    eventHeroImageFile,
    attractionHeroImageFile,
    cityHeroImageFile,
    eventImageArrayFiles,
    attractionImageArrayFiles,
    categoryOptions,
    eventForm,
    attractionForm,
    cityForm,
    onHeroImageSelected,
    onImageArraySelected,
    submitSelected,
    typeButtonClass,
  }
}
