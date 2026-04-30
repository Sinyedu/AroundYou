export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_PERMISSIONS = [
  "attraction:create",
  "attraction:update",
  "attraction:delete",
  "event:create",
  "event:update",
  "event:delete",
  "city:create",
  "city:update",
  "city:delete",
  "review:create",
  "review:update",
  "review:delete",
  "admin:access",
] as const;
export type UserPermission = (typeof USER_PERMISSIONS)[number];
