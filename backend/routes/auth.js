import { login, logout, register, refreshToken } from '../controllers/auth.js';
import express from 'express';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
