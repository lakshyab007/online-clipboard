# Clipboard Web App

A modern online clipboard application built with React, Vite, and Tailwind CSS.

## Features

- User authentication (signup/login)
- Create, read, update, and delete clipboard items
- Share clipboard items via unique codes
- View shared content from others
- Responsive design with Tailwind CSS
- Session-based authentication

## Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:8000`

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
web/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── Navbar.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── lib/              # Utilities
│   │   └── api.js        # API client
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Pages

### Home (/)
- Display user profile information (name, email, LinkedIn)
- Link to dashboard
- Share code validation section to view shared content
- Features overview

### Login (/login)
- Email and password authentication
- Redirect to dashboard after successful login

### Signup (/signup)
- Create new account with name, email, LinkedIn (optional), and password
- Automatic login after signup

### Dashboard (/dashboard)
- Protected route (requires authentication)
- Create new clipboard items
- View all saved clipboard items
- Edit existing items
- Delete items
- Share items (generate share codes)
- Copy content to clipboard
- View share codes for shared items

## API Integration

The app communicates with the FastAPI backend at `http://localhost:8000`. All requests include credentials (cookies) for session-based authentication.

### API Endpoints Used

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/clipboard` - Get all clipboard items
- `POST /api/clipboard` - Create clipboard item
- `PUT /api/clipboard/{id}` - Update clipboard item
- `DELETE /api/clipboard/{id}` - Delete clipboard item
- `POST /api/clipboard/{id}/share` - Generate share code
- `DELETE /api/clipboard/{id}/share` - Remove share code
- `POST /api/share/validate` - Validate and view shared content

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Development

The app uses Vite's hot module replacement (HMR) for fast development. Changes to the code will automatically reload in the browser.

## Notes

- The app uses session-based authentication with HTTP-only cookies
- Make sure the backend server is running before starting the frontend
- CORS is configured in the backend to allow requests from `http://localhost:5173`
