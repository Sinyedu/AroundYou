import { describe, expect, it, vi } from 'vitest'
import { useAsyncData } from '@/composables/useAsyncData'

describe('useAsyncData', () => {
  it('starts with default data and stores fetched data', async () => {
    const fetcher = vi.fn().mockResolvedValue(['Kobenhavn'])
    const state = useAsyncData(fetcher, { defaultValue: [] as string[] })

    expect(state.data.value).toEqual([])
    expect(state.loading.value).toBe(false)
    expect(state.error.value).toBe(null)

    const result = await state.execute()

    expect(result).toEqual(['Kobenhavn'])
    expect(state.data.value).toEqual(['Kobenhavn'])
    expect(state.loading.value).toBe(false)
    expect(state.error.value).toBe(null)
  })

  it('resets to default data and exposes a friendly error when fetching fails', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('backend unavailable'))
    const state = useAsyncData(fetcher, {
      defaultValue: ['fallback'],
      getErrorMessage: () => 'Kunne ikke hente data.',
    })

    state.setData(['existing'])

    await expect(state.execute()).rejects.toThrow('backend unavailable')

    expect(state.data.value).toEqual(['fallback'])
    expect(state.loading.value).toBe(false)
    expect(state.error.value).toBe('Kunne ikke hente data.')
  })

  it('allows manual data and error updates for fallback UI states', () => {
    const state = useAsyncData(() => Promise.resolve('remote'), { defaultValue: 'empty' })

    state.setData('manual')
    state.setError('Manuel fejl')

    expect(state.data.value).toBe('manual')
    expect(state.error.value).toBe('Manuel fejl')
  })
})
