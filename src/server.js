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

// Database connection verification
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log(`Connected to PostgreSQL database (${process.env.DB_NAME || 'readtrack'}) successfully`);
  release();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
