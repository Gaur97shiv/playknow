import express from 'express';
import { protectRoute } from "../middleware/protectedRoute.js";
import { getDailyPool, getAllDailyPools } from '../controllers/pool.controller.js';

const router = express.Router();

router.get("/daily", protectRoute, getDailyPool);
router.get("/history", protectRoute, getAllDailyPools);

export default router;
