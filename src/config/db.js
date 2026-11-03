import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'readtrack_db',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
});
export default pool;




