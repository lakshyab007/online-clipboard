# Clipboard API - FastAPI Backend

This is the backend server for the Online Clipboard application built with FastAPI and PostgreSQL.

## Features

- User authentication (signup/login) with bcrypt password hashing
- Session-based authentication using cookies
- CRUD operations for clipboard items
- Share clipboard items via unique codes
- PostgreSQL database integration

## Prerequisites

- Python 3.8+
- PostgreSQL database running locally
- Database: `online_clipboard` at `postgresql://postgres:root@localhost:5432/online_clipboard`

## Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Ensure PostgreSQL is running:**

Make sure your PostgreSQL database is running and accessible at:
```
postgresql://postgres:root@localhost:5432/online_clipboard
```

3. **Run the server:**

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will automatically create the required database tables on startup.

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Create a new user account
- **POST** `/api/auth/login` - Login with email and password
- **POST** `/api/auth/logout` - Logout and clear session
- **GET** `/api/auth/me` - Get current user profile

### Clipboard Items

- **GET** `/api/clipboard` - Get all clipboard items for current user
- **POST** `/api/clipboard` - Create a new clipboard item
- **GET** `/api/clipboard/{item_id}` - Get a specific clipboard item
- **PUT** `/api/clipboard/{item_id}` - Update a clipboard item
- **DELETE** `/api/clipboard/{item_id}` - Delete a clipboard item

### Sharing

- **POST** `/api/clipboard/{item_id}/share` - Generate a share code for a clipboard item
- **DELETE** `/api/clipboard/{item_id}/share` - Remove share code from a clipboard item
- **POST** `/api/share/validate` - Validate a share code and get the associated content

## Database Schema

### Users Table
- `id` (Primary Key)
- `name`
- `email` (Unique)
- `linkedin`
- `password_hash`
- `created_at`

### Clipboard Items Table
- `id` (Primary Key)
- `content`
- `owner_id` (Foreign Key to Users)
- `share_code` (Unique, nullable)
- `is_shared`
- `created_at`
- `updated_at`

## Project Structure

```
server/
├── main.py           # FastAPI application and routes
├── database.py       # Database models and configuration
├── schemas.py        # Pydantic schemas for validation
├── auth.py           # Authentication utilities
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

## Development

The API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Notes

- Authentication is session-based using HTTP-only cookies
- Passwords are hashed using bcrypt
- CORS is enabled for `http://localhost:5173` and `http://localhost:3000`
- Sessions are stored in memory (not production-ready)