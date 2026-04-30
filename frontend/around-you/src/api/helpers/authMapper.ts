import type { User } from '@/types/user'
import { USER_PERMISSIONS, USER_ROLES } from '@/types/access-control'

function isUserRole(value: unknown): value is User['role'] {
  return typeof value === 'string' && USER_ROLES.includes(value as User['role'])
}

function toUserPermissions(value: unknown): User['permissions'] {
  if (!Array.isArray(value)) return []

  return value.filter(
    (permission): permission is User['permissions'][number] =>
      typeof permission === 'string' &&
      USER_PERMISSIONS.includes(permission as User['permissions'][number]),
  )
}

export function toAuthenticatedUser(payload: unknown): User | null {
  if (!payload || typeof payload !== 'object') return null

  const rawUser = payload as Record<string, unknown>
  const userName = rawUser.userName
  const email = rawUser.email
  const role = rawUser.role

  if (typeof userName !== 'string' || typeof email !== 'string' || !isUserRole(role)) {
    return null
  }

  return {
    userName,
    email,
    firstName: typeof rawUser.firstName === 'string' ? rawUser.firstName : undefined,
    lastName: typeof rawUser.lastName === 'string' ? rawUser.lastName : undefined,
    userAvatar: typeof rawUser.userAvatar === 'string' ? rawUser.userAvatar : undefined,
    role,
    permissions: toUserPermissions(rawUser.permissions),
  }
}
