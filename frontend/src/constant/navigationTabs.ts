export const NAVIGATION_TABS = {
  admin: [
    { label: 'Dashboard', link: '/admin/dashboard' },
    { label: 'Companies', link: '/admin/companies' },
    { label: 'Jobs', link: '/admin/jobs' },
    { label: 'Users', link: '/admin/users' },
  ],
  applicant: [
    { label: 'Dashboard', link: '/applicant/dashboard' },
    { label: 'Find Jobs', link: '/applicant/jobs' },
    { label: 'My Jobs', link: '/applicant/my-jobs' },
  ],
  employer: [
    { label: 'Dashboard', link: '/employer/dashboard' },
    { label: 'Post Job', link: '/employer/jobs' },
  ],
} as const;
