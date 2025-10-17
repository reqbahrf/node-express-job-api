import { Router } from 'express';
import {
  registerCompany,
  updateCompanyStatus,
  getCompanies,
} from '../controllers/company.js';
const router = Router();

router.post('/register-company', registerCompany);
router.put('/update-status/:id', updateCompanyStatus);
router.get('/get-companies', getCompanies);

export default router;
