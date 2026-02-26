# Life Dashboard 🌟

A full-stack personal productivity dashboard with a complete authentication system and three functional trackers:
1. **Habits Tracker**
2. **Workouts Log**
3. **Finance Manager**

## Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (v14+)

## Setup Instructions

### 1. Database Connection Requirements
Ensure you have a running PostgreSQL instance locally or remotely (e.g., Supabase). 

### 2. Backend Initialization
1. Navigate to `backend`: `cd backend`
2. Install dependencies: `npm install`
3. Make a copy of environment config: `cp .env.example .env`
4. Fill out the `.env` fully (Use a Gmail App Password for SMTP!).
5. Execute the database schema initialization using PostgreSQL CLI or any client:
   `psql -d lifedashboard -f schema.sql`  *(adjust connect string appropriately)*
6. Start the server: `npm run dev`

### 3. Frontend Initialization
1. Navigate to `frontend`: `cd frontend`
2. Install dependencies: `npm install`
3. Setup env: `cp .env.example .env`
4. Ensure `REACT_APP_API_URL` points to your backend.
5. Start dev server: `npm run dev`

### Getting a Gmail App Password
1. Go to your Google Account > Security.
2. Ensure 2-Step Verification is ON.
3. Search for "App Passwords".
4. Create a new one named "Life Dashboard".
5. Paste that 16-character string into `SMTP_PASS` in backend `.env`.

### Local Testing with Mailtrap
Instead of real emails in local dev, create a free Mailtrap account, grab the SMTP credentials provided for Node.js, and set your `SMTP_HOST`, `PORT`, `USER`, and `PASS` to Mailtrap details.

## Deployment Guide

### Database (Supabase)
1. Create a project on Supabase.
2. Go to SQL Editor and run all code from `backend/schema.sql`.
3. Get your connection string (under Database Settings) and save it for Render.

### Backend (Render Web Service)
1. Connect your GitHub repository to Render.
2. Select the repository and Render will automatically use the `render.yaml` blueprint.
3. Supply the environment variables it requests (`DATABASE_URL`, `JWT_SECRET`, etc.).
4. For `FRONTEND_URL`, enter your future Vercel domain.

### Frontend (Vercel)
1. Import your repository into Vercel.
2. The root directory is `frontend/`. 
3. Framework Preset: Vite.
4. Set Environment Variable: `REACT_APP_API_URL` = `https://your-render-app-name.onrender.com/api`.
5. Deploy! Vercel will use the provided `vercel.json` config.
