import { describe, expect, it } from 'vitest'

import { validateCityForm } from '@/composables/useCreateContent/useCreateContentSubmit'

describe('useCreateContentSubmit', () => {
  it('requires city taglines that satisfy the backend city schema', () => {
    expect(() => validateCityForm({ tagLine: '' })).toThrow('Indtast en tagline til byen.')
    expect(() => validateCityForm({ tagLine: 'For kort' })).toThrow(
      'Byens tagline skal være mellem 20 og 100 tegn.',
    )
    expect(() =>
      validateCityForm({
        tagLine:
          'Dette er en alt for lang tagline til en by, som overskrider backendens maksimum på et hundrede tegn i alt.',
      }),
    ).toThrow('Byens tagline skal være mellem 20 og 100 tegn.')
    expect(() => validateCityForm({ tagLine: 'En levende by tæt på natur og kultur' })).not.toThrow()
  })
})
