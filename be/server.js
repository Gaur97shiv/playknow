import express from 'express';
import ConnectMongoDb from './db/ConnectMongoDb.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import poolRoutes from './routes/pool.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import cycleRoutes from './routes/cycle.routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors';
import { startEvaluationJob, startDailyResetJob } from './jobs/evaluationJob.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
ConnectMongoDb();

app.use(express.json({limit:'5mb'}));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL || 'https://playknow-frontend.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/pool", poolRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/cycle", cycleRoutes);

// Serve static frontend files in production (if they exist)
const frontendDistPath = path.join(__dirname, '../fe/vite-project/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Fallback route for SPA - serve index.html for any unmatched routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

startEvaluationJob();
startDailyResetJob();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (fs.existsSync(frontendDistPath)) {
    console.log('Frontend files are being served');
  }
});
