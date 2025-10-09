import { changePassword } from '../controllers/password.js';
import express from 'express';
const router = express.Router();
router.post('/change-password', changePassword);
export default router;
