function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

export function getStoredUserName(): string {
  return getStoredValue('userName') ?? 'Guest'
}

export function getStoredUserAvatar(): string | null {
  return getStoredValue('userAvatar')
}

export function getUserInitials(userName: string): string {
  const clean = userName.trim()
  if (!clean) return 'AY'

  return clean.split(/\s+/).slice(0, 2).join('')
}
