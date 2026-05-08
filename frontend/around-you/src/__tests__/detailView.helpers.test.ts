import { describe, expect, it, vi } from 'vitest'

import {
  formatDate,
  formatOpeningHours,
  formatPopulation,
  formatPrice,
  getReverseGeocodedAddress,
  parseReverseGeocodePosition,
} from '@/composables/detail/detailView.helpers'

describe('detail view helpers', () => {
  it('formats dates, prices, opening hours, and populations for detail pages', () => {
    expect(formatDate('2026-06-15')).toBe('15. juni 2026')
    expect(formatDate('bad-date')).toBe('Ikke angivet')
    expect(formatPrice(0)).toBe('Gratis')
    expect(formatPrice(1250)).toBe('1.250 kr.')
    expect(formatOpeningHours(['Mandag 10-16', 'Tirsdag 10-16'])).toBe(
      'Mandag 10-16, Tirsdag 10-16',
    )
    expect(formatOpeningHours([])).toBe('Ikke angivet')
    expect(formatPopulation(602481)).toBe('602.481 indbyggere')
  })

  it('parses comma-separated gps positions used by event and attraction details', () => {
    expect(parseReverseGeocodePosition('55.6761, 12.5683')).toEqual({
      latitude: 55.6761,
      longitude: 12.5683,
    })
    expect(parseReverseGeocodePosition('not a coordinate')).toBeNull()
  })

  it('reverse geocodes valid gps positions and handles failed lookups quietly', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ display_name: 'Kobenhavn, Danmark' }),
    }) as unknown as typeof fetch

    await expect(getReverseGeocodedAddress('55.6761,12.5683', fetcher)).resolves.toBe(
      'Kobenhavn, Danmark',
    )
    expect(fetcher).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse?lat=55.6761&lon=12.5683&format=json',
      { headers: { 'Accept-Language': 'da' } },
    )

    const failingFetcher = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch
    await expect(getReverseGeocodedAddress('55.6761,12.5683', failingFetcher)).resolves.toBeNull()
    await expect(getReverseGeocodedAddress('', fetcher)).resolves.toBeNull()
  })
})
