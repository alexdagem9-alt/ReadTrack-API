import pool from '../config/db.js';

// CREATE BOOK
export const createBook = async (req, res) => {
    try {
        const { title, author, total_pages } = req.body;

        // 2. Get the logged-in user's ID
        const userId = req.user.id;

        // 3. Validate input
        if (!title || !Number.isInteger(total_pages) || total_pages <= 0) {
            return res.status(400).json({
                message: 'Valid title and total_pages are required'
            });
        }

        // 4. Save the book in PostgreSQL
        const result = await pool.query(
            `INSERT INTO books (user_id, title, author, total_pages)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, title, author || null, total_pages]
        );

        // 5. Return the created book
        return res.status(201).json({
            message: 'Book created successfully',
            book: result.rows[0]
        });

    } catch (error) {
        console.error('Create book error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// GET ALL BOOKS
export const getBooks = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT *
             FROM books
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        return res.status(200).json({
            count: result.rows.length,
            books: result.rows
        });

    } catch (error) {
        console.error('Get books error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
    try {
        // Get book ID from URL
        const { id } = req.params;

        // Get updated information
        const { title, author, total_pages } = req.body;

        // Get logged-in user ID
        const userId = req.user.id;

        // Validate input
        if (
            !title ||
            !Number.isInteger(total_pages) ||
            total_pages <= 0
        ) {
            return res.status(400).json({
                message: 'Valid title and total_pages are required'
            });
        }

        // Update only if the book belongs to this user
        const result = await pool.query(
            `UPDATE books
             SET title = $1,
                 author = $2,
                 total_pages = $3
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [title, author || null, total_pages, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            message: 'Book updated successfully',
            book: result.rows[0]
        });

    } catch (error) {
        console.error('Update book error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
    try {
        // Get book ID from URL
        const { id } = req.params;

        // Get logged-in user ID
        const userId = req.user.id;

        // Delete only the user's own book
        const result = await pool.query(
            `DELETE FROM books
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [id, userId]
        );

        // Check if book exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            message: 'Book deleted successfully'
        });

    } catch (error) {
        console.error('Delete book error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
