
import pool from '../config/db.js';

// RECORD READING PROGRESS
export const createReadingProgress = async (req, res) => {
    try {
        const { book_id, pages_read } = req.body;
        const userId = req.user.id;

        if (!book_id || !Number.isInteger(pages_read) || pages_read <= 0) {
            return res.status(400).json({
                message: 'Valid book_id and pages_read are required'
            });
        }

        // Check that the book belongs to the logged-in user
        const book = await pool.query(
            'SELECT id, total_pages FROM books WHERE id = $1 AND user_id = $2',
            [book_id, userId]
        );

        if (book.rows.length === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        if (pages_read > book.rows[0].total_pages) {
            return res.status(400).json({
                message: 'Pages read cannot exceed total book pages'
            });
        }

        const result = await pool.query(
            `INSERT INTO reading_progress (book_id, pages_read)
             VALUES ($1, $2)
             RETURNING *`,
            [book_id, pages_read]
        );

        return res.status(201).json({
            message: 'Reading progress recorded successfully',
            progress: result.rows[0]
        });

    } catch (error) {
        console.error('Create reading progress error:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// GET READING HISTORY
export const getReadingProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                rp.id,
                rp.book_id,
                b.title,
                rp.pages_read,
                rp.reading_date,
                rp.created_at
             FROM reading_progress rp
             JOIN books b ON rp.book_id = b.id
             WHERE b.user_id = $1
             ORDER BY rp.reading_date DESC`,
            [userId]
        );

        return res.status(200).json({
            count: result.rows.length,
            progress: result.rows
        });

    } catch (error) {
        console.error('Get reading progress error:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// GET PROGRESS FOR ONE BOOK
export const getBookProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                rp.id,
                rp.book_id,
                b.title,
                b.total_pages,
                rp.pages_read,
                rp.reading_date,
                rp.created_at
             FROM reading_progress rp
             JOIN books b ON rp.book_id = b.id
             WHERE rp.book_id = $1 AND b.user_id = $2
             ORDER BY rp.reading_date DESC`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No reading progress found for this book'
            });
        }

        return res.status(200).json({
            count: result.rows.length,
            progress: result.rows
        });

    } catch (error) {
        console.error('Get book progress error:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

