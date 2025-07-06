import express from 'express';
import ConnectMongoDb from './db/ConnectMongoDb.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


const app = express();
const PORT = process.env.PORT || 5001;
ConnectMongoDb();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifictions",notificationsRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
