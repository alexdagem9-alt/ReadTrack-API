import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ReadTrack API!',
    status: 'Running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
app.get('/db_test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: "database connected successfully",
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Database connection verification
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log(`Connected to PostgreSQL database (${process.env.DB_NAME || 'readtrack'}) successfully`);
  release();
});
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM books ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch books'
    });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
