import { Request, Response } from 'express';
import getApplicantUserCount from '../service/getApplicantUserCount.js';
const getDashboardStats = async (req: Request, res: Response) => {
  const applicantUserCount = await getApplicantUserCount();
  const stats = {
    applicantUserCount,
  };
  res.status(200).json(stats);
};

export { getDashboardStats };
