
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());


// HOME ROUTE


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ReadTrack API!',
    status: 'Running'
  });
});

// HEALTH CHECK

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// DATABASE TEST

app.get('/db_test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.status(200).json({
      message: 'Database connected successfully',
      time: result.rows[0].now
    });

  } catch (error) {
    console.error('Database test error:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// USER ROUTES

app.use('/api/users', userRoutes);

// BOOK ROUTES

app.use('/api/books', bookRoutes);

// DATABASE CONNECTION CHECK

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }

  console.log(
    `Connected to PostgreSQL database (${process.env.DB_NAME || 'readtrack'}) successfully`
  );

  release();
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
