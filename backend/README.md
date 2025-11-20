# Jharkhand Civic Track - Backend API

Backend API for the Jharkhand Civic Track application with JWT authentication and PostgreSQL database.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- A PostgreSQL database named `jharkhand_civic_track`

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE jharkhand_civic_track;

# Exit psql
\q
```

Then run the schema to create tables:

```bash
npm run db:setup
# Or manually:
# psql -U postgres -d jharkhand_civic_track -f src/db/schema.sql
```

### 3. Environment Configuration

The `.env` file is already created with default values. Update if needed:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jharkhand_civic_track
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_key
```

### 4. Start the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new authority user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Issues (All require authentication)

- `GET /api/issues` - List all issues (with optional filters)
- `GET /api/issues/:id` - Get issue details
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id/status` - Update issue status
- `GET /api/issues/analytics` - Get analytics data

### Health Check

- `GET /api/health` - Server health check

## Testing with curl

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@ranchi.gov.in",
    "password": "admin123",
    "phone": "+91-9876543210",
    "city": "Ranchi",
    "municipalityType": "Municipal Corporation"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ranchi.gov.in",
    "password": "admin123"
  }'
```

### Get Issues (with token)

```bash
curl -X GET http://localhost:5000/api/issues \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Tables

- `authorities` - User accounts with authentication
- `issues` - Civic issues/complaints
- `issue_history` - Issue status change history

See `src/db/schema.sql` for complete schema definition.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **CORS**: cors

## Development

The server uses `tsx watch` for hot-reloading during development. Any changes to TypeScript files will automatically restart the server.
