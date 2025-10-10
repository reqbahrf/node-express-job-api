export const ROLES = {
  ADMIN: 'admin',
  APPLICANT: 'applicant',
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];
