import express from 'express';
import ConnectMongoDb from './db/ConnectMongoDb.js'; 
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
ConnectMongoDb();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
