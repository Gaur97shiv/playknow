# PlayKnow

## Overview
PlayKnow is a reward-based social media platform where users are incentivized with financial rewards for quality engagement. The platform uses a scoring algorithm based on likes, comments, and posts, with daily evaluation cycles and fraud detection.

## Project Structure
- `be/` - Backend (Express.js with MongoDB)
  - `config/` - Configuration files (rewardConfig.js)
  - `controllers/` - Request handlers (auth, post, user, evaluation, transaction, etc.)
  - `db/` - Database connection
  - `jobs/` - Cron jobs (daily evaluation)
  - `lib/utils/` - Utilities (balance, scoring, time, fraud detection, transactions)
  - `middleware/` - Auth and daily limit middleware
  - `models/` - Mongoose models (User, Post, Transaction, FraudLog, EvaluationResult, DailyPool)
  - `routes/` - API routes
  - `server.js` - Main server entry point
- `fe/vite-project/` - Frontend (React + Vite + Tailwind CSS)
  - `src/hooks/` - Custom React Query hooks
  - `src/pages/` - Page components
  - `src/components/` - Reusable components

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, DaisyUI, Redux Toolkit, React Query
- **Backend**: Express.js, MongoDB (Mongoose), JWT authentication, node-cron
- **Storage**: Cloudinary for image uploads

## Core Features
- **Posting System**: Users pay 20 coins to post
- **Commenting System**: Users pay 10 coins to comment
- **Liking System**: Users pay 1 coin to like
- **Daily Evaluation Cycle**:
  - Active period: 8 AM - 6 AM (next day) = 22 hours
  - Freeze period: 6 AM - 8 AM = 2 hours (evaluation happens)
- **Reward Distribution**: Top posts/comments receive prize pool rewards (80%)
- **Liker Rewards**: Users who liked winning posts get 3 coins, comments get 2 coins
- **Fee Splitting**: 80% to prize pool, 15% to platform, 5% to liker reserve
- **Fraud Detection**: Pattern detection for coordinated activities

## UI Theme
The app features a **Classic 90s Vintage** design with earthy soil/mud colors:
- **Colors**: Soil (#5C4033), mud (#6B4423), clay (#8B5A2B), sand (#C4A77D), rust (#B7410E), moss (#556B2F), bark (#3D2914)
- **Fonts**: Times New Roman (classic), Arial (system)
- **Effects**: Beveled borders, inset inputs, ridge borders, 3D button shadows, double borders

## Environment Variables Required
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
- `/api/post` - Post CRUD operations (with daily limits and freeze period checks)
- `/api/notifications` - User notifications
- `/api/pool` - Reward pool management
- `/api/transactions` - Transaction history
- `/api/evaluation` - Daily evaluation results and winners
- `/api/cycle` - Cycle status and daily limits

## Daily Limits
- Posts: 10 per day
- Comments: 50 per day
- Likes: 100 per day

## Recent Changes
- **Jan 28, 2026**: Implemented complete reward system
  - Transaction model for tracking all coin movements
  - Fee splitting (80% prize pool, 15% platform, 5% liker reserve)
  - Updated fees: comment (10 coins), like (1 coin)
  - Daily evaluation cron job at 6 AM
  - Scoring algorithm for posts and comments
  - Freeze period validation (6 AM - 8 AM)
  - Daily limits middleware
  - Fraud detection utilities
  - Frontend: Transaction history page, daily pool card with countdown, winner announcements
- **Jan 25, 2026**: Redesigned UI with classic 90s vintage earthy/soil/mud theme
