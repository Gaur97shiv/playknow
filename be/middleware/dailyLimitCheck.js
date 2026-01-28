import User from "../models/user.model.js";
import { REWARD_CONFIG } from "../config/rewardConfig.js";
import { isFreezePeriod, getCycleInfo } from "../lib/utils/timeUtils.js";

export const checkFreezePeriod = async (req, res, next) => {
    if (isFreezePeriod()) {
        const cycleInfo = getCycleInfo();
        return res.status(403).json({
            error: "Platform is in freeze period. Evaluation is in progress.",
            freezeInfo: {
                isFreezePeriod: true,
                timeUntilActive: cycleInfo.timeUntilNextPhaseFormatted
            }
        });
    }
    next();
};

export const checkDailyPostLimit = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await resetDailyCountsIfNeeded(user);
        
        if (user.dailyPostCount >= REWARD_CONFIG.MAX_POSTS_PER_DAY) {
            return res.status(429).json({
                error: `Daily post limit reached. Maximum ${REWARD_CONFIG.MAX_POSTS_PER_DAY} posts per day.`,
                limit: REWARD_CONFIG.MAX_POSTS_PER_DAY,
                current: user.dailyPostCount
            });
        }
        
        next();
    } catch (error) {
        console.error("Error checking daily post limit:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const checkDailyCommentLimit = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await resetDailyCountsIfNeeded(user);
        
        if (user.dailyCommentCount >= REWARD_CONFIG.MAX_COMMENTS_PER_DAY) {
            return res.status(429).json({
                error: `Daily comment limit reached. Maximum ${REWARD_CONFIG.MAX_COMMENTS_PER_DAY} comments per day.`,
                limit: REWARD_CONFIG.MAX_COMMENTS_PER_DAY,
                current: user.dailyCommentCount
            });
        }
        
        next();
    } catch (error) {
        console.error("Error checking daily comment limit:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const checkDailyLikeLimit = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await resetDailyCountsIfNeeded(user);
        
        if (user.dailyLikeCount >= REWARD_CONFIG.MAX_LIKES_PER_DAY) {
            return res.status(429).json({
                error: `Daily like limit reached. Maximum ${REWARD_CONFIG.MAX_LIKES_PER_DAY} likes per day.`,
                limit: REWARD_CONFIG.MAX_LIKES_PER_DAY,
                current: user.dailyLikeCount
            });
        }
        
        next();
    } catch (error) {
        console.error("Error checking daily like limit:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const incrementDailyCount = async (userId, actionType) => {
    try {
        const updateField = {};
        
        switch (actionType) {
            case "post":
                updateField.dailyPostCount = 1;
                break;
            case "comment":
                updateField.dailyCommentCount = 1;
                break;
            case "like":
                updateField.dailyLikeCount = 1;
                break;
            default:
                return { success: false, error: "Invalid action type" };
        }
        
        await User.findByIdAndUpdate(userId, { $inc: updateField });
        return { success: true };
    } catch (error) {
        console.error("Error incrementing daily count:", error);
        return { success: false, error: "Database error" };
    }
};

const resetDailyCountsIfNeeded = async (user) => {
    const now = new Date();
    const lastReset = new Date(user.lastDailyReset);
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastResetDay = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());
    
    if (today > lastResetDay) {
        await User.findByIdAndUpdate(user._id, {
            dailyPostCount: 0,
            dailyCommentCount: 0,
            dailyLikeCount: 0,
            lastDailyReset: now
        });
        
        user.dailyPostCount = 0;
        user.dailyCommentCount = 0;
        user.dailyLikeCount = 0;
        user.lastDailyReset = now;
    }
};

export const checkSuspension = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if (user.isSuspended) {
            if (user.suspendedUntil && new Date() > user.suspendedUntil) {
                await User.findByIdAndUpdate(userId, {
                    isSuspended: false,
                    suspendedUntil: null,
                    suspensionReason: null
                });
            } else {
                return res.status(403).json({
                    error: "Account is suspended",
                    reason: user.suspensionReason,
                    until: user.suspendedUntil
                });
            }
        }
        
        next();
    } catch (error) {
        console.error("Error checking suspension:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
