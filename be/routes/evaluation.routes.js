import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { 
    getLatestEvaluation, 
    getRecentWinners, 
    triggerManualEvaluation 
} from "../controllers/evaluation.controller.js";

const router = express.Router();

router.get("/latest", protectRoute, getLatestEvaluation);
router.get("/winners", protectRoute, getRecentWinners);
router.post("/run", protectRoute, triggerManualEvaluation);

export default router;
