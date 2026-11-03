# ReadTrack API

Backend REST API for ReadTrack reading tracker application built with Node.js, Express, and PostgreSQL.

## Features & Tech Stack
- **Node.js** (ES Modules)
- **Express.js** for RESTful API routes
- **PostgreSQL** (`pg`) database connection pool
- **JWT** (`jsonwebtoken`) for route protection & authentication
- **Bcrypt** for password hashing
- **CORS** & **Dotenv** configuration
- **Nodemon** for live reload development

## Scripts

- `npm start`: Starts the API server using Node.
- `npm run dev`: Starts the API server in development mode with nodemon auto-restart.

## Environment Variables (.env)

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=readtrack_db
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=supersecret_readtrack_jwt_key_12345
```

