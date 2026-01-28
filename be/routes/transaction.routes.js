import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { getTransactionHistory, getTransactionSummary } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getTransactionHistory);
router.get("/summary", protectRoute, getTransactionSummary);

export default router;
