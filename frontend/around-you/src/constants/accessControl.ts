export const USER_ROLES = ['user', 'admin'] as const

export const USER_PERMISSIONS = [
  'attraction:read',
  'attraction:create',
  'attraction:update',
  'attraction:delete',
  'event:read',
  'event:create',
  'event:update',
  'event:delete',
  'city:read',
  'city:create',
  'city:update',
  'city:delete',
  'content:suggest',
  'review:read',
  'review:create',
  'review:update',
  'review:delete',
  'admin:access',
] as const
