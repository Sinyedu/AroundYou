export const USER_ROLES = ['user', 'admin'] as const

export const USER_PERMISSIONS = [
  'attraction:create',
  'attraction:update',
  'attraction:delete',
  'event:create',
  'event:update',
  'event:delete',
  'city:create',
  'city:update',
  'city:delete',
  'review:create',
  'review:update',
  'review:delete',
  'admin:access',
] as const
