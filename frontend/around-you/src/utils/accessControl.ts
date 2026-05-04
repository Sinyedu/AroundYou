import type { UserPermission } from '@/types/user-permission'
import type { UserRole } from '@/types/user-role'

export function hasRole(role: UserRole | undefined, expectedRole: UserRole): boolean {
  return role === expectedRole
}

export function hasPermission(
  permissions: UserPermission[] | undefined,
  requiredPermission: UserPermission,
): boolean {
  return permissions?.includes(requiredPermission) ?? false
}
