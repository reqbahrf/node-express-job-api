import { Router } from 'express';
import {
  registerCompany,
  updateCompanyStatus,
  getCompanies,
  getCompany,
} from '../controllers/company.js';
const router = Router();

router.post('/register-company', registerCompany);
router.put('/update-status/:id', updateCompanyStatus);
router.get('/get-companies', getCompanies);
router.get('/get-company/:id', getCompany);

export default router;
