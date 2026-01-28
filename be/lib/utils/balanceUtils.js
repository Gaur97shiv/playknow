import User from "../../models/user.model.js";
import DailyPool from "../../models/dailyPool.model.js";
import Post from "../../models/post.model.js";
import { REWARD_CONFIG } from "../../config/rewardConfig.js";
import { createTransaction } from "./transactionUtils.js";

export const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const checkUserBalance = async (userId, requiredAmount) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: "User not found" };
        }
        
        if (user.isSuspended) {
            return { success: false, error: "Account is suspended" };
        }
        
        if (user.balance < requiredAmount) {
            return { 
                success: false, 
                error: `Insufficient balance. Required: ${requiredAmount}, Available: ${user.balance}` 
            };
        }
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

export const deductUserBalance = async (userId, amount, transactionType = null, relatedPost = null, description = "") => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            { 
                $inc: { 
                    balance: -amount,
                    totalSpent: amount > 0 ? amount : 0
                } 
            },
            { new: true }
        );
        
        if (!result) {
            return { success: false, error: "User not found" };
        }
        
        if (transactionType) {
            await createTransaction({
                userId,
                type: transactionType,
                amount,
                direction: "debit",
                relatedPost,
                description: description || `${transactionType} fee`
            });
        }
        
        return { success: true, updatedUser: result };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

export const addUserBalance = async (userId, amount, transactionType = null, relatedPost = null, description = "") => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            { 
                $inc: { 
                    balance: amount,
                    totalEarnings: amount > 0 ? amount : 0
                } 
            },
            { new: true }
        );
        
        if (!result) {
            return { success: false, error: "User not found" };
        }
        
        if (transactionType) {
            await createTransaction({
                userId,
                type: transactionType,
                amount,
                direction: "credit",
                relatedPost,
                description: description || `${transactionType} reward`
            });
        }
        
        return { success: true, updatedUser: result };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

export const splitFee = (amount) => {
    const prizePool = Math.floor(amount * REWARD_CONFIG.FEE_SPLIT.PRIZE_POOL / 100);
    const platformFee = Math.floor(amount * REWARD_CONFIG.FEE_SPLIT.PLATFORM_FEE / 100);
    const likerReserve = amount - prizePool - platformFee;
    
    return {
        prizePool,
        platformFee,
        likerReserve,
        total: amount
    };
};

export const addToDailyPool = async (amount, isPost = true) => {
    try {
        const today = getTodayDateString();
        const split = splitFee(amount);
        
        const updateFields = { 
            $inc: { 
                total_pool_coins: split.prizePool,
                platform_fee_coins: split.platformFee,
                liker_reserve_coins: split.likerReserve
            }
        };
        
        if (isPost) {
            updateFields.$inc.posts_count = 1;
        }
        
        const dailyPool = await DailyPool.findOneAndUpdate(
            { date: today },
            updateFields,
            { upsert: true, new: true }
        );
        
        return { success: true, dailyPool, split };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

export const addToPostPool = async (postId, amount, isComment = false) => {
    try {
        const split = splitFee(amount);
        
        const updateFields = {
            $inc: { 
                total_coin_on_post: amount,
                post_pool_coins: split.prizePool,
                liker_reserve_coins: split.likerReserve
            }
        };
        
        if (isComment) {
            updateFields.$inc.comment_pool_coins = split.prizePool;
        }
        
        const post = await Post.findByIdAndUpdate(
            postId,
            updateFields,
            { new: true }
        );
        
        if (!post) {
            return { success: false, error: "Post not found" };
        }
        
        return { success: true, post, split };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

export const getDailyPool = async (date = null) => {
    try {
        const targetDate = date || getTodayDateString();
        
        let dailyPool = await DailyPool.findOne({ date: targetDate });
        
        if (!dailyPool) {
            dailyPool = {
                date: targetDate,
                total_pool_coins: 0,
                platform_fee_coins: 0,
                liker_reserve_coins: 0,
                posts_count: 0
            };
        }
        
        return { success: true, dailyPool };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};
