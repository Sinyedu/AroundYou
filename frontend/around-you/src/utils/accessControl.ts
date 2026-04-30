import type { UserPermission, UserRole } from '@/types/access-control'

export function hasRole(role: UserRole | undefined, expectedRole: UserRole): boolean {
  return role === expectedRole
}

export function hasPermission(
  permissions: UserPermission[] | undefined,
  requiredPermission: UserPermission,
): boolean {
  return permissions?.includes(requiredPermission) ?? false
}
