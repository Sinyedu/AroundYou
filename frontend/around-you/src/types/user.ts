import type { UserPermission, UserRole } from './access-control'

export type User = {
  userName: string
  email: string
  firstName?: string
  lastName?: string
  userAvatar?: string
  role: UserRole
  permissions: UserPermission[]
}
