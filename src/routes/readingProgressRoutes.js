
import express from 'express';

import {
    createReadingProgress,
    getReadingProgress,
    getBookProgress
} from '../controllers/readingProgressController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createReadingProgress);
router.get('/', authenticateToken, getReadingProgress);
router.get('/book/:id', authenticateToken, getBookProgress);
export default router;

