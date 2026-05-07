import { describe, expect, it } from 'vitest'

import {
  getErrorMessage,
  getProfileAvatar,
  getProfileDisplayName,
  getProfileInitials,
} from '@/composables/profile/profileView.helpers'
import type { User } from '@/types/user'

const user: User = {
  userName: 'helena',
  email: 'helena@example.com',
  firstName: 'Helena',
  lastName: 'Nielsen',
  userAvatar: 'avatar.jpg',
  role: 'user',
  permissions: [],
}

describe('profile view helpers', () => {
  it('builds display name, avatar, and initials from the user profile', () => {
    expect(getProfileDisplayName(user)).toBe('helena')
    expect(getProfileAvatar('', user)).toBe('avatar.jpg')
    expect(getProfileAvatar('blob:preview', user)).toBe('blob:preview')
    expect(getProfileInitials(user)).toBe('HE')
  })

  it('falls back when profile fields are missing', () => {
    expect(getProfileDisplayName(null)).toBe('Din profil')
    expect(getProfileAvatar('', null)).toBe('')
    expect(getProfileInitials({ ...user, userName: '' })).toBe('HE')
    expect(getProfileInitials(null)).toBe('AY')
  })

  it('normalizes unknown errors to fallback copy', () => {
    expect(getErrorMessage(new Error('Request failed'), 'Fallback')).toBe('Request failed')
    expect(getErrorMessage('bad', 'Fallback')).toBe('Fallback')
  })
})
