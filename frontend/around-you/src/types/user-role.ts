import type { USER_ROLES } from '@/constants/accessControl'

export type UserRole = (typeof USER_ROLES)[number]
