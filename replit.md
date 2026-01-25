# PlayKnow

## Overview
PlayKnow is a paid comment app platform where meaningful user engagement is incentivized with financial rewards. Users earn money by creating high-quality discussions and problem-solving on various topics.

## Project Structure
- `be/` - Backend (Express.js with MongoDB)
  - `controllers/` - Request handlers
  - `db/` - Database connection
  - `middleware/` - Auth and other middleware
  - `models/` - Mongoose models
  - `routes/` - API routes
  - `server.js` - Main server entry point
- `fe/vite-project/` - Frontend (React + Vite + Tailwind CSS)

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, DaisyUI, Redux Toolkit, React Query
- **Backend**: Express.js, MongoDB (Mongoose), JWT authentication
- **Storage**: Cloudinary for image uploads

## UI Theme
The app features a **Classic 90s Vintage** design with earthy soil/mud colors:
- **Colors**: Soil (#5C4033), mud (#6B4423), clay (#8B5A2B), sand (#C4A77D), rust (#B7410E), moss (#556B2F), bark (#3D2914)
- **Fonts**: Times New Roman (classic), Arial (system)
- **Effects**: Beveled borders, inset inputs, ridge borders, 3D button shadows, double borders

## Environment Variables Required
The backend requires these environment variables:
- `MONGODB_URI` - MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `JWT_SECRET` - Secret for JWT token signing

## Running the Application
- **Frontend**: Runs on port 5000 (configured for Replit proxy)
- **Backend**: Runs on port 3001 (localhost only)
- The frontend proxies `/api` requests to the backend

## API Routes
- `/api/auth` - Authentication routes
- `/api/user` - User management
- `/api/post` - Post CRUD operations
- `/api/notifications` - User notifications
- `/api/pool` - Reward pool management

## Recent Changes
- **Jan 25, 2026**: Redesigned UI with classic 90s vintage earthy/soil/mud theme
