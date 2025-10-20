import { Router } from 'express';
import createUpload from '../middleware/upload.js';
import {
  registerCompany,
  updateCompanyStatus,
  getCompanies,
  getCompany,
} from '../controllers/company.js';
const router = Router();

router.post(
  '/register-company',
  createUpload('private', 'company', /\.(jpg|jpeg|png|pdf|doc|docx)$/).array(
    'registrationDocs',
    5
  ),
  registerCompany
);
router.put('/update-status/:id', updateCompanyStatus);
router.get('/get-companies', getCompanies);
router.get('/get-company/:id', getCompany);

export default router;
