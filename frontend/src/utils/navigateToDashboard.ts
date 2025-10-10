const navigateToDashboard = (role: string) => {
  return role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
};

export default navigateToDashboard;
