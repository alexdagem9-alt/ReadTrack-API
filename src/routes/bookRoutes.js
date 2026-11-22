
import express from 'express';

import {
    createBook,
    getBooks,
    updateBook,
    deleteBook
} from '../controllers/bookController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protect all book routes
router.use(authenticateToken);

// Create a book
router.post('/', createBook);

// Get all books
router.get('/', getBooks);

// Update a book
router.put('/:id', updateBook);

// Delete a book
router.delete('/:id', deleteBook);

export default router;
