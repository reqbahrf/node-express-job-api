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
router.put('/update-status/:id', adminMiddleware, updateCompanyStatus);
router.get('/get-companies', adminMiddleware, getCompanies);

//Employer Route
router.get('/get-company/:id', employerMiddleware, getCompany);

export default router;
