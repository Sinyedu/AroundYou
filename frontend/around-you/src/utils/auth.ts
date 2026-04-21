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
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(key)
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
    const padding = normalizedValue.length % 4
    const paddedValue = padding === 0 ? normalizedValue : normalizedValue.padEnd(normalizedValue.length + (4 - padding), '=')
    return window.atob(paddedValue)
  } catch {
    return null
  }
}

export function getJwtPayload(token?: string | null): JwtPayload | null {
  const storedToken = token ?? getStoredValue('token')

  if (!storedToken) {
    return null
  }

  const tokenParts = storedToken.split('.')

  if (tokenParts.length !== 3) {
    return null
  }

  const payloadSegment = tokenParts[1]

  if (!payloadSegment) {
    return null
  }

  const decodedPayload = decodeBase64Url(payloadSegment)

  if (!decodedPayload) {
    return null
  }

  try {
    return JSON.parse(decodedPayload) as JwtPayload
  } catch {
    return null
  }
}

export function payloadHasAdminAccess(payload: JwtPayload | null): boolean {
  if (!payload) {
    return false
  }

  const hasAdminRole = payload.role?.toLowerCase() === 'admin'
  const hasAdminInRoles = payload.roles?.some((role) => role.toLowerCase() === 'admin') ?? false
  const hasAdminPermission = payload.permissions?.some((permission) => permission.toLowerCase() === 'admin') ?? false

  return Boolean(payload.isAdmin || payload.admin || hasAdminRole || hasAdminInRoles || hasAdminPermission)
}

export function hasAdminAccess(): boolean {
  const storedAdminFlag = getStoredValue('isAdmin')

  if (storedAdminFlag === 'true') {
    return true
  }

  return payloadHasAdminAccess(getJwtPayload())
}

export function getStoredUserName(): string {
  return getStoredValue('userName') ?? getJwtPayload()?.userName ?? 'Guest'
}

export function getStoredUserAvatar(): string | null {
  return getStoredValue('userAvatar') ?? getJwtPayload()?.userAvatar ?? getJwtPayload()?.avatar ?? null
}

export function getUserInitials(userName: string): string {
  const normalizedUserName = userName.trim()

  if (!normalizedUserName) {
    return 'AY'
  }

  const parts = normalizedUserName.split(/\s+/)
  const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')

  return initials || normalizedUserName.slice(0, 2).toUpperCase()
}