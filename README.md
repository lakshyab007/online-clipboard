# Online Clipboard Application

A full-stack web application for saving, managing, and sharing text snippets online. Built with React (frontend) and FastAPI (backend) with PostgreSQL database.

## Features

- 🔐 **User Authentication** - Secure signup/login with bcrypt password hashing
- 📝 **Clipboard Management** - Create, read, update, and delete text snippets
- 🔗 **Share Functionality** - Generate unique codes to share content with others
- 👤 **User Profiles** - Manage profile information including LinkedIn
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🔒 **Session-based Auth** - Secure cookie-based authentication

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide React (icons)

### Backend
- Python 3.8+
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL
- Passlib (password hashing)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL

## Project Structure

```
plux-interview/
├── server/                 # Backend (FastAPI)
│   ├── main.py            # Main application and routes
│   ├── database.py        # Database models and configuration
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication utilities
│   ├── requirements.txt   # Python dependencies
│   └── README.md
├── web/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities (API client)
│   │   ├── App.jsx       # Main app with routing
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── README.md
└── README.md             # This file
```

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE online_clipboard;

# Exit psql
\q
```

The application expects the database to be accessible at:
```
postgresql://postgres:root@localhost:5432/online_clipboard
```

If your PostgreSQL credentials are different, update `DATABASE_URL` in `server/database.py`.

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The backend server will start on `http://localhost:8000`

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### 1. Create an Account

1. Navigate to `http://localhost:5173`
2. Click "Sign Up" in the navigation bar
3. Fill in your details:
   - Name
   - Email
   - LinkedIn (optional)
   - Password
4. Click "Sign Up"

### 2. Dashboard

After logging in, you'll be redirected to the dashboard where you can:

- **Create** new clipboard items using the textarea
- **View** all your saved items
- **Edit** any item by clicking the edit icon
- **Delete** items with the trash icon
- **Copy** content to clipboard with the copy icon
- **Share** items by clicking the share icon to generate a unique code
- **Unshare** items by clicking the X icon on shared items

### 3. Share Content

To share a clipboard item:

1. Go to your Dashboard
2. Click the share icon (🔗) on any item
3. A unique share code will be generated (e.g., `ABC123XY`)
4. Share this code with others

### 4. View Shared Content

To view content someone shared with you:

1. Go to the Home page
2. Scroll to "Access Shared Content" section
3. Enter the share code
4. Click "View"
5. The shared content will be displayed
6. You can copy it to your clipboard

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout and clear session |
| GET | `/api/auth/me` | Get current user profile |

### Clipboard Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clipboard` | Get all user's clipboard items |
| POST | `/api/clipboard` | Create new clipboard item |
| GET | `/api/clipboard/{id}` | Get specific clipboard item |
| PUT | `/api/clipboard/{id}` | Update clipboard item |
| DELETE | `/api/clipboard/{id}` | Delete clipboard item |

### Sharing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clipboard/{id}/share` | Generate share code |
| DELETE | `/api/clipboard/{id}/share` | Remove share code |
| POST | `/api/share/validate` | Validate code and get content |

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` - User's full name
- `email` - Unique email address
- `linkedin` - LinkedIn profile URL (optional)
- `password_hash` - Bcrypt hashed password
- `created_at` - Account creation timestamp

### Clipboard Items Table
- `id` (Primary Key)
- `content` - The text content
- `owner_id` (Foreign Key → Users)
- `share_code` - Unique share code (nullable)
- `is_shared` - Boolean flag for shared status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Session-based Auth**: HTTP-only cookies prevent XSS attacks
- **CORS Protection**: Configured to only allow specific origins
- **Input Validation**: Pydantic schemas validate all inputs
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection

## Development

### Backend Development

The FastAPI server uses Uvicorn with auto-reload enabled:

```bash
cd server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

Vite provides hot module replacement:

```bash
cd web
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd web
npm run build
```

**Backend:**
The FastAPI app can be deployed using:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

### Database Connection Issues

If you can't connect to PostgreSQL:

1. Verify PostgreSQL is running:
   ```bash
   # Check status
   sudo systemctl status postgresql  # Linux
   brew services list  # macOS
   ```

2. Check database exists:
   ```bash
   psql -U postgres -l
   ```

3. Update connection string in `server/database.py` if needed

### CORS Errors

If you see CORS errors:

1. Ensure the frontend URL is in the `allow_origins` list in `server/main.py`
2. Verify both frontend and backend are running
3. Check browser console for specific error messages

### Authentication Issues

If login/signup doesn't work:

1. Check that cookies are enabled in your browser
2. Ensure you're not using incognito/private mode (may block cookies)
3. Verify the backend session store is working (check console logs)

## Future Enhancements

- [ ] JWT token authentication for better scalability
- [ ] Rich text editor support
- [ ] File upload capability
- [ ] Search and filter clipboard items
- [ ] Categories/tags for organization
- [ ] Expiring share codes
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Rate limiting
- [ ] Persistent session storage (Redis)

## License

This project is created for demonstration purposes.

## Contact

For questions or issues, please check the project documentation or open an issue.
