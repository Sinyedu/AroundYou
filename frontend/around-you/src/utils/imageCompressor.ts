const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

type CompressImageOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const getFileExtension = (type: string) => {
  return type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
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
      reject(new Error('Could not load image.'))
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
          reject(new Error('Could not compress image.'))
          return
        }

        resolve(blob)
      },
      type,
      type === 'image/jpeg' ? quality : undefined,
    )
  })
}

export const isAllowedImageType = (file: File) => ALLOWED_IMAGE_TYPES.has(file.type)

export async function compressImageFile(file: File, options: CompressImageOptions = {}) {
  if (!isAllowedImageType(file)) {
    throw new Error('Only PNG, JPEG and WebP images are allowed.')
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
    throw new Error('Could not prepare image compression.')
  }

  context.drawImage(image, 0, 0, dimensions.width, dimensions.height)

  const blob = await canvasToBlob(canvas, file.type, quality)

  if (blob.size >= file.size) {
    return file
  }

  return new File([blob], getCompressedFileName(file, file.type), {
    type: file.type,
    lastModified: Date.now(),
  })
}
