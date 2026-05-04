type JwtPayload = {
  userName?: string
  role?: string
  roles?: string[]
  isAdmin?: boolean
  admin?: boolean
  permissions?: string[]
  userAvatar?: string
  avatar?: string
}

function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padding = normalized.length % 4
    const padded =
      padding === 0 ? normalized : normalized.padEnd(normalized.length + (4 - padding), '=')

    return window.atob(padded)
  } catch {
    return null
  }
}

export function getJwtPayload(token?: string | null): JwtPayload | null {
  const storedToken = token ?? getStoredValue('token')
  if (!storedToken) return null

  const parts = storedToken.split('.')
  if (parts.length !== 3) return null

  const payload = parts[1]
  if (!payload) return null

  const decoded = decodeBase64Url(payload)
  if (!decoded) return null

  try {
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

export function payloadHasAdminAccess(payload: JwtPayload | null): boolean {
  if (!payload) return false

  const hasAdminRole = payload.role?.toLowerCase() === 'admin'
  const hasAdminInRoles = payload.roles?.some((r) => r.toLowerCase() === 'admin') ?? false
  const hasAdminPermission = payload.permissions?.some((p) => p.toLowerCase() === 'admin') ?? false

  return Boolean(
    payload.isAdmin || payload.admin || hasAdminRole || hasAdminInRoles || hasAdminPermission,
  )
}

export function hasAdminAccess(): boolean {
  return payloadHasAdminAccess(getJwtPayload())
}

export function getStoredUserName(): string {
  return getStoredValue('userName') ?? getJwtPayload()?.userName ?? 'Guest'
}

export function getStoredUserId(): string | null {
  const payload = getJwtPayload()
  return (payload as (JwtPayload & { userID?: string }) | null)?.userID ?? null
}

export function getStoredUserAvatar(): string | null {
  return (
    getStoredValue('userAvatar') ?? getJwtPayload()?.userAvatar ?? getJwtPayload()?.avatar ?? null
  )
}

export function getUserInitials(userName: string): string {
  const clean = userName.trim()
  if (!clean) return 'AY'

  return clean.split(/\s+/).slice(0, 2).join('')
}
