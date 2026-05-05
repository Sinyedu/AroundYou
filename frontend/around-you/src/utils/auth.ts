interface JwtPayload {
  userID?: string
}

function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

function getJwtPayload(): JwtPayload | null {
  const token = getStoredValue('token')
  const encodedPayload = token?.split('.')[1]

  if (!encodedPayload) return null

  try {
    const payload = JSON.parse(window.atob(encodedPayload)) as unknown
    return payload && typeof payload === 'object' ? (payload as JwtPayload) : null
  } catch {
    return null
  }
}

export function getStoredUserName(): string {
  return getStoredValue('userName') ?? 'Guest'
}

export function getStoredUserId(): string | null {
  const payload = getJwtPayload()
  return payload?.userID ?? null
}

export function getStoredUserAvatar(): string | null {
  return getStoredValue('userAvatar')
}

export function getUserInitials(userName: string): string {
  const clean = userName.trim()
  if (!clean) return 'AY'

  return clean.split(/\s+/).slice(0, 2).join('')
}
