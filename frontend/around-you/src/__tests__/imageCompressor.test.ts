import { describe, expect, it } from 'vitest'
import { isAllowedImageType } from '@/utils/imageCompressor'

const file = (name: string, type: string) => new File(['image'], name, { type })

describe('isAllowedImageType', () => {
  it.each([
    ['photo.png', 'image/png'],
    ['photo.jpg', 'image/jpeg'],
    ['photo.jpeg', 'image/jpeg'],
    ['photo.webp', 'image/webp'],
  ])('allows %s with %s', (name, type) => {
    expect(isAllowedImageType(file(name, type))).toBe(true)
  })

  it.each([
    ['photo.jfif', 'image/jpeg'],
    ['photo.gif', 'image/gif'],
    ['photo.svg', 'image/svg+xml'],
    ['photo.png', 'image/gif'],
    ['photo.png', 'image/jpeg'],
    ['photo.webp', 'image/png'],
  ])('rejects %s with %s', (name, type) => {
    expect(isAllowedImageType(file(name, type))).toBe(false)
  })
})
