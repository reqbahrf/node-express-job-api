import User from '../models/User.js';

const getApplicantUserCount = async () => {
  const count = await User.countDocuments({ role: 'applicant' });
  return count;
};

export default getApplicantUserCount;
