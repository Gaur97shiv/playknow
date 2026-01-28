import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { getCycleInfo } from "../lib/utils/timeUtils.js";
import { getDailyPool } from "../lib/utils/balanceUtils.js";
import { REWARD_CONFIG } from "../config/rewardConfig.js";

const router = express.Router();

router.get("/status", protectRoute, async (req, res) => {
    try {
        const cycleInfo = getCycleInfo();
        const poolResult = await getDailyPool();
        
        return res.status(200).json({
            cycle: cycleInfo,
            pool: poolResult.dailyPool,
            config: {
                postFee: REWARD_CONFIG.POST_FEE,
                commentFee: REWARD_CONFIG.COMMENT_FEE,
                likeFee: REWARD_CONFIG.LIKE_FEE,
                maxPostsPerDay: REWARD_CONFIG.MAX_POSTS_PER_DAY,
                maxCommentsPerDay: REWARD_CONFIG.MAX_COMMENTS_PER_DAY,
                maxLikesPerDay: REWARD_CONFIG.MAX_LIKES_PER_DAY
            }
        });
    } catch (error) {
        console.error("Error fetching cycle status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/limits", protectRoute, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await (await import("../models/user.model.js")).default.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        return res.status(200).json({
            posts: {
                used: user.dailyPostCount,
                limit: REWARD_CONFIG.MAX_POSTS_PER_DAY,
                remaining: REWARD_CONFIG.MAX_POSTS_PER_DAY - user.dailyPostCount
            },
            comments: {
                used: user.dailyCommentCount,
                limit: REWARD_CONFIG.MAX_COMMENTS_PER_DAY,
                remaining: REWARD_CONFIG.MAX_COMMENTS_PER_DAY - user.dailyCommentCount
            },
            likes: {
                used: user.dailyLikeCount,
                limit: REWARD_CONFIG.MAX_LIKES_PER_DAY,
                remaining: REWARD_CONFIG.MAX_LIKES_PER_DAY - user.dailyLikeCount
            },
            lastReset: user.lastDailyReset
        });
    } catch (error) {
        console.error("Error fetching user limits:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
