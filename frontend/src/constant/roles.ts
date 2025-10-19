export const ROLES = {
  ADMIN: 'admin',
  APPLICANT: 'applicant',
  EMPLOYER: 'employer',
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];
