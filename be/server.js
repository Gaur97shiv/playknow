import express from 'express';
import ConnectMongoDb from './db/ConnectMongoDb.js'; 
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;


app.use("/api/auth", authRoutes);
ConnectMongoDb();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
