import { Router } from 'express';
import createUpload from '../middleware/upload.js';
import {
  registerCompany,
  updateCompanyStatus,
  getCompanies,
  getCompany,
} from '../controllers/company.js';
const router = Router();

//Employer Route
router.post('/register-company', registerCompany);
//Admin Route
router.put('/update-status/:id', updateCompanyStatus);
router.get('/get-companies', getCompanies);

//Employer Route
router.get('/get-company/:id', getCompany);

export default router;
