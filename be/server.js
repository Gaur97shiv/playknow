import express from 'express';
import ConnectMongoDb from './db/ConnectMongoDb.js'; 
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Changed port from 5000 to 5001
ConnectMongoDb();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
