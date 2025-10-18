const navigateToDashboard = (role: string) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'employer':
      return '/employer/dashboard';
    case 'applicant':
      return '/applicant/dashboard';
    default:
      return '/user/dashboard';
  }
};

export default navigateToDashboard;
