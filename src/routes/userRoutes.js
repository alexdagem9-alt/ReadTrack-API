import express from 'express';
import {
    registerUser,
    loginUser,
    getMe
} from '../controllers/userController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getMe);

export default router;