import type { UserPermission } from './user-permission'
import type { UserRole } from './user-role'

export type User = {
  userName: string
  email: string
  firstName?: string
  lastName?: string
  userAvatar?: string
  role: UserRole
  permissions: UserPermission[]
  isRestricted?: boolean
}
