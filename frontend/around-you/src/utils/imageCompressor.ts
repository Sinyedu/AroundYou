const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const ALLOWED_IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp'])

type CompressImageOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const getFileExtension = (type: string) => {
  return type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
}

const getOutputType = (type: string) => {
  return type === 'image/jpg' ? 'image/jpeg' : type
}

const getCompressedFileName = (file: File, type: string) => {
  const extension = getFileExtension(type)
  const baseName = file.name.replace(/\.[^.]+$/, '')
  return `${baseName}-compressed.${extension}`
}

const loadImage = (file: File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Billedet kunne ikke indlæses.'))
    }

    image.src = objectUrl
  })
}

const getScaledDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) => {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1)

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Billedet kunne ikke komprimeres.'))
          return
        }

        resolve(blob)
      },
      type,
      type === 'image/jpeg' || type === 'image/webp' ? quality : undefined,
    )
  })
}

const getFileExtensionFromName = (fileName: string) => {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

const extensionMatchesMimeType = (extension: string, mimeType: string) => {
  if (mimeType === 'image/png') return extension === 'png'
  if (mimeType === 'image/webp') return extension === 'webp'
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return extension === 'jpg' || extension === 'jpeg'
  }

  return false
}

export const isAllowedImageType = (file: File) => {
  const extension = getFileExtensionFromName(file.name)

  return (
    ALLOWED_IMAGE_TYPES.has(file.type) &&
    ALLOWED_IMAGE_EXTENSIONS.has(extension) &&
    extensionMatchesMimeType(extension, file.type)
  )
}

export async function compressImageFile(file: File, options: CompressImageOptions = {}) {
  if (!isAllowedImageType(file)) {
    throw new Error('Kun PNG-, JPG- og WEBP-billeder er tilladt.')
  }

  const maxWidth = options.maxWidth ?? 1000
  const maxHeight = options.maxHeight ?? 1000
  const quality = options.quality ?? 0.78
  const image = await loadImage(file)
  const dimensions = getScaledDimensions(image.width, image.height, maxWidth, maxHeight)

  const canvas = document.createElement('canvas')
  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Billedet kunne ikke gøres klar til upload.')
  }

  context.drawImage(image, 0, 0, dimensions.width, dimensions.height)

  const outputType = getOutputType(file.type)
  const blob = await canvasToBlob(canvas, outputType, quality)

  if (blob.size >= file.size) {
    return file
  }

  return new File([blob], getCompressedFileName(file, outputType), {
    type: outputType,
    lastModified: Date.now(),
  })
}
