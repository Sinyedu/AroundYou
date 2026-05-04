import type { USER_PERMISSIONS } from '@/constants/accessControl'

export type UserPermission = (typeof USER_PERMISSIONS)[number]
