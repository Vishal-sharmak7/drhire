# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DrHire is a full-stack job platform connecting doctors with hospitals. It features three user roles (Doctor, Hospital, Admin) with role-based access control and hospital verification workflows.

## Architecture

### Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS 4 (in `/client`)
- **Backend**: Express.js + MongoDB/Mongoose (in `/server`)
- **Authentication**: JWT-based (stored in cookies + localStorage)
- **File Uploads**: Multer for resume uploads (PDF/DOC/DOCX)

### Project Structure
```
├── client/              # React frontend (Vite dev server on port 5173)
│   ├── src/
│   │   ├── pages/       # Page components (Login, Dashboards, Jobs)
│   │   ├── components/  # Reusable UI (Navbar, Footer, JobCard, ProtectedRoute)
│   │   └── context/     # AuthContext for global auth state
│   └── vite.config.js   # Vite + Tailwind plugins
├── server/              # Express backend (port 5000)
│   ├── config/db.js     # MongoDB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Mongoose schemas (Doctor, Hospital, Job, Admin)
│   ├── routes/          # API route definitions
│   └── uploads/         # Resume file storage
└── seedAdmin.js         # Script to create initial admin user
```

### User Roles & Access Control
1. **Doctor**: Can apply to jobs, upload resume, view application history
2. **Hospital**: Can post jobs (only after admin approval), view applicants
3. **Admin**: Can approve/reject hospitals, view all users and jobs

### Key Workflows
- **Hospital Registration**: Hospital signs up → Status is "pending" → Admin approves → Can post jobs
- **Job Application**: Doctor applies → Job reference added to doctor.appliedJobs array
- **Resume Upload**: Stored in `/server/uploads/`, filename pattern: `resume-{timestamp}.{ext}`

## Environment Setup

The server requires a `.env` file in `/server/` with:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

## Common Commands

### Development
```bash
# Start frontend dev server (port 5173)
cd client && npm run dev

# Start backend dev server with hot reload (port 5000)
cd server && npm run dev

# Start backend (production)
cd server && npm start
```

### Build & Lint
```bash
# Build frontend for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Run ESLint
cd client && npm run lint
```

### Database
```bash
# Seed initial admin user (run from root)
node seedAdmin.js
# Default credentials: admin@drhire.com / adminpassword123
```

## API Structure

All API routes are prefixed with `/api`:

| Route | Purpose |
|-------|---------|
| POST /api/auth/register/doctor | Register new doctor |
| POST /api/auth/register/hospital | Register new hospital |
| POST /api/auth/login | Login (returns JWT) |
| GET /api/auth/me | Get current user |
| GET /api/jobs | List all jobs |
| POST /api/jobs | Create job (hospital only, must be approved) |
| GET /api/jobs/:id | Get job details |
| POST /api/applications/:jobId | Apply to job (doctor only) |
| GET /api/applications | Get user's applications |
| GET /api/doctors/profile | Get doctor profile |
| PUT /api/doctors/update | Update profile + resume |

## Auth Implementation Details

- JWT is dual-stored: HTTP-only cookie AND localStorage token
- Axios interceptor adds `Authorization: Bearer {token}` header automatically
- Protected routes use `ProtectedRoute` component with `allowedRoles` prop
- Backend middleware: `verifyToken`, `isDoctor`, `isHospital`, `isAdmin`, `checkHospitalVerification`

## File Uploads

- Resumes are uploaded to `/server/uploads/`
- Supported formats: PDF, DOC, DOCX
- Files are served statically at `/uploads/:filename`
- The `uploads/` directory must exist for uploads to work
