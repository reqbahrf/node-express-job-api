import { Router } from 'express';
import {
  registerCompany,
  updateCompanyStatus,
  getCompanies,
  getCompany,
} from '../controllers/company.js';
import employerMiddleware from '../middleware/role/employer.js';
import adminMiddleware from '../middleware/role/admin.js';
const router = Router();

//Employer Route
router.post('/register-company', employerMiddleware, registerCompany);
//Admin Route
router.patch('/update-status/:id', adminMiddleware, updateCompanyStatus);
router.get('/get-companies', getCompanies);

router.get('/get-company/:id', getCompany);

export default router;
