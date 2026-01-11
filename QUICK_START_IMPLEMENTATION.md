# Quick Start Implementation Guide

This guide provides ready-to-use code templates for the most critical components to get you started immediately.

## 🚀 Immediate Actions (Do These First)

### 1. Install Required Dependencies

```bash
cd be
npm install node-cron express-rate-limit
```

### 2. Create Configuration File

**File: `be/config/rewardConfig.js`**

```javascript
export const REWARD_CONFIG = {
    // Fees
    POST_FEE: 20,
    COMMENT_FEE: 10,
    LIKE_FEE: 1,
    
    // Fee Distribution (percentages)
    FEE_SPLIT: {
        PRIZE_POOL: 80,      // 80% to prize pool
        PLATFORM_FEE: 15,    // 15% to platform
        LIKER_RESERVE: 5     // 5% to liker rewards
    },
    
    // Winner Rewards
    TOP_POST_REWARD_PERCENT: 80,      // Winner gets 80% of post pool
    TOP_COMMENT_REWARD_PERCENT: 80,   // Winner gets 80% of comment pool
    
    // Liker Rewards
    LIKER_REWARD_POST: 3,    // Coins for liking winning post
    LIKER_REWARD_COMMENT: 2, // Coins for liking winning comment
    
    // Daily Cycle (in 24-hour format, adjust for your timezone)
    ACTIVE_START_HOUR: 8,    // 8 AM
    FREEZE_START_HOUR: 6,    // 6 AM
    EVALUATION_DURATION_HOURS: 2,
    
    // Limits
    MAX_POSTS_PER_DAY: 10,
    MAX_COMMENTS_PER_DAY: 50,
    MAX_LIKES_PER_DAY: 100
};
```

### 3. Update Fee Constants in Controllers

**File: `be/controllers/post.controller.js`** - Update these lines:

```javascript
// At the top, add:
import { REWARD_CONFIG } from '../config/rewardConfig.js';

// In createPost function, change:
const POSTING_FEE = REWARD_CONFIG.POST_FEE;

// In commentOnPost function, change:
const COMMENT_FEE = REWARD_CONFIG.COMMENT_FEE;

// In likeOrUnlikePost function, change:
const LIKE_FEE = REWARD_CONFIG.LIKE_FEE;
```

### 4. Create Transaction Model

**File: `be/models/transaction.model.js`** (NEW FILE)

```javascript
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["post", "comment", "like", "reward", "refund", "penalty"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    direction: {
        type: String,
        enum: ["debit", "credit"],
        required: true
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    relatedComment: {
        type: String // Comment ID as string (nested in post)
    },
    description: {
        type: String
    },
    balanceAfter: {
        type: Number // User balance after this transaction
    }
}, { timestamps: true });

// Index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
```

### 5. Create Time Utilities

**File: `be/lib/utils/timeUtils.js`** (NEW FILE)

```javascript
/**
 * Check if current time is within the freeze period (6 AM - 8 AM)
 * @returns {boolean} true if in freeze period
 */
export const isFreezePeriod = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 6 && currentHour < 8;
};

/**
 * Check if current time is within active period (8 AM - 6 AM next day)
 * @returns {boolean} true if in active period
 */
export const isActivePeriod = () => {
    return !isFreezePeriod();
};

/**
 * Get the current cycle date (YYYY-MM-DD)
 * If it's freeze period, return yesterday's date (evaluation day)
 * Otherwise, return today's date
 */
export const getCurrentCycleDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // If between 6 AM - 8 AM (freeze), this is evaluation for yesterday
    if (currentHour >= 6 && currentHour < 8) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
    
    // Otherwise, use today's date
    return now.toISOString().split('T')[0];
};

/**
 * Get time remaining until freeze period starts
 * @returns {object} {hours, minutes, seconds} until freeze
 */
export const getTimeUntilFreeze = () => {
    const now = new Date();
    const freezeStart = new Date(now);
    freezeStart.setHours(6, 0, 0, 0);
    
    // If freeze already started today, it's tomorrow's freeze
    if (now.getHours() >= 6) {
        freezeStart.setDate(freezeStart.getDate() + 1);
    }
    
    const diff = freezeStart - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
};

/**
 * Get time remaining until active period starts (end of freeze)
 * @returns {object} {hours, minutes, seconds} until active
 */
export const getTimeUntilActive = () => {
    const now = new Date();
    const activeStart = new Date(now);
    activeStart.setHours(8, 0, 0, 0);
    
    // If active already started today, return time until next active
    if (now.getHours() >= 8) {
        activeStart.setDate(activeStart.getDate() + 1);
    }
    
    const diff = activeStart - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
};
```

### 6. Add Time Validation Middleware

**File: `be/middleware/timeValidation.js`** (NEW FILE)

```javascript
import { isFreezePeriod } from "../lib/utils/timeUtils.js";

export const checkFreezePeriod = (req, res, next) => {
    if (isFreezePeriod()) {
        return res.status(403).json({
            error: "Actions are frozen during evaluation period (6 AM - 8 AM). Please try again after 8 AM."
        });
    }
    next();
};
```

### 7. Update Post Model with Evaluation Fields

**File: `be/models/post.model.js`** - Add these fields:

```javascript
const postSchema = new mongoose.Schema({
    // ... existing fields ...
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
    },
    content: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        // NEW: Comment evaluation fields
        score: {
            type: Number,
            default: 0
        },
        evaluated: {
            type: Boolean,
            default: false
        },
        isWinner: {
            type: Boolean,
            default: false
        },
        winnerReward: {
            type: Number,
            default: 0
        }
    }],
    total_coin_on_post: {
        type: Number,
        default: 0
    },
    // NEW: Post evaluation fields
    post_pool_coins: {
        type: Number,
        default: 0  // Prize pool for post winner
    },
    comment_pool_coins: {
        type: Number,
        default: 0  // Prize pool for comment winner
    },
    platform_fee_reserve: {
        type: Number,
        default: 0  // Platform fee collected
    },
    liker_reserve: {
        type: Number,
        default: 0  // Reserve for liker rewards
    },
    score: {
        type: Number,
        default: 0
    },
    evaluated: {
        type: Boolean,
        default: false
    },
    evaluationDate: {
        type: Date
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    winnerReward: {
        type: Number,
        default: 0
    },
    freezePeriod: {
        type: String  // YYYY-MM-DD format for the cycle
    }
}, { timestamps: true });
```

### 8. Update Balance Utils with Fee Splitting

**File: `be/lib/utils/balanceUtils.js`** - Add these functions:

```javascript
import { REWARD_CONFIG } from '../../config/rewardConfig.js';
import Transaction from '../../models/transaction.model.js';

// ... existing functions ...

/**
 * Split fee according to reward config and update post pools
 */
export const splitAndAddToPools = async (postId, totalFee, poolType = 'post') => {
    try {
        const Post = (await import("../../models/post.model.js")).default;
        const split = REWARD_CONFIG.FEE_SPLIT;
        
        const prizePoolAmount = (totalFee * split.PRIZE_POOL) / 100;
        const platformFeeAmount = (totalFee * split.PLATFORM_FEE) / 100;
        const likerReserveAmount = (totalFee * split.LIKER_RESERVE) / 100;
        
        const updateFields = {};
        
        if (poolType === 'post') {
            updateFields.post_pool_coins = prizePoolAmount;
        } else if (poolType === 'comment') {
            updateFields.comment_pool_coins = prizePoolAmount;
        }
        
        updateFields.platform_fee_reserve = platformFeeAmount;
        updateFields.liker_reserve = likerReserveAmount;
        updateFields.total_coin_on_post = totalFee;
        
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: updateFields },
            { new: true }
        );
        
        if (!post) {
            return { success: false, error: "Post not found" };
        }
        
        return { 
            success: true, 
            post,
            split: {
                prizePool: prizePoolAmount,
                platformFee: platformFeeAmount,
                likerReserve: likerReserveAmount
            }
        };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

/**
 * Create a transaction record
 */
export const createTransaction = async (userId, type, amount, direction, options = {}) => {
    try {
        const User = (await import("../../models/user.model.js")).default;
        const user = await User.findById(userId);
        
        if (!user) {
            return { success: false, error: "User not found" };
        }
        
        const transaction = new Transaction({
            user: userId,
            type,
            amount: Math.abs(amount),
            direction,
            relatedPost: options.relatedPost || null,
            relatedComment: options.relatedComment || null,
            description: options.description || `${direction === 'debit' ? 'Spent' : 'Earned'} ${Math.abs(amount)} coins for ${type}`,
            balanceAfter: user.balance + (direction === 'credit' ? amount : -amount)
        });
        
        await transaction.save();
        return { success: true, transaction };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

/**
 * Enhanced deduct balance with transaction logging
 */
export const deductUserBalanceWithTransaction = async (userId, amount, transactionType, options = {}) => {
    try {
        // Deduct balance
        const deductionResult = await deductUserBalance(userId, amount);
        if (!deductionResult.success) {
            return deductionResult;
        }
        
        // Create transaction record
        const transactionResult = await createTransaction(
            userId,
            transactionType,
            amount,
            'debit',
            {
                relatedPost: options.relatedPost,
                relatedComment: options.relatedComment,
                description: options.description
            }
        );
        
        return {
            success: true,
            updatedUser: deductionResult.updatedUser,
            transaction: transactionResult.transaction
        };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};
```

### 9. Update Post Controller to Use Fee Splitting

**File: `be/controllers/post.controller.js`** - Update `createPost` function:

```javascript
import { 
    checkUserBalance, 
    deductUserBalance, 
    addToDailyPool,
    splitAndAddToPools,
    deductUserBalanceWithTransaction,
    getCurrentCycleDate
} from "../lib/utils/balanceUtils.js";
import { checkFreezePeriod } from "../middleware/timeValidation.js";
import { REWARD_CONFIG } from '../config/rewardConfig.js';

export const createPost= async (req, res) => {
    try{
        const {content} = req.body;
        let {image} = req.body;
        const userId=req.user._id.toString();
        const POSTING_FEE = REWARD_CONFIG.POST_FEE;
        
        // Check freeze period
        if (isFreezePeriod()) {
            return res.status(403).json({
                error: "Posting is frozen during evaluation period (6 AM - 8 AM). Please try again after 8 AM."
            });
        }
        
        // Check if user has sufficient balance for posting
        const balanceCheck = await checkUserBalance(userId, POSTING_FEE);
        if (!balanceCheck.success) {
            return res.status(400).json({
                error: balanceCheck.error
            });
        }
        
        if(!content && !image){
            return res.status(400).json({
                error: "Please provide content or image"
            });
        }
      
        if(image){
            const uploadedResponse=await cloudinary.uploader.upload(image);
            image=uploadedResponse.secure_url;
        }
        
        // Deduct posting fee from user balance with transaction
        const deductionResult = await deductUserBalanceWithTransaction(
            userId, 
            POSTING_FEE, 
            'post',
            { description: `Posted content` }
        );
        
        if (!deductionResult.success) {
            return res.status(500).json({
                error: deductionResult.error
            });
        }
        
        // Add coins to daily pool
        const poolResult = await addToDailyPool(POSTING_FEE);
        if (!poolResult.success) {
            // If pool update fails, refund the user
            await deductUserBalance(userId, -POSTING_FEE);
            return res.status(500).json({
                error: poolResult.error
            });
        }
        
        const currentCycle = getCurrentCycleDate();
        
        const newPost=new Post({
            user: userId,
            content,
            image,
            freezePeriod: currentCycle  // Track which cycle this post belongs to
        });
        
        await newPost.save();
        
        // Split fees and add to post pools
        const splitResult = await splitAndAddToPools(newPost._id, POSTING_FEE, 'post');
        
        return res.status(201).json({
            message: "Post created successfully",
            post: newPost,
            balance: deductionResult.updatedUser.balance,
            dailyPool: poolResult.dailyPool
        });
    }catch(err){
        console.error("Error in createPost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}
```

Similarly update `commentOnPost` and `likeOrUnlikePost` functions.

### 10. Update Routes to Use Time Validation

**File: `be/routes/post.routes.js`** - Add middleware:

```javascript
import { checkFreezePeriod } from "../middleware/timeValidation.js";

// Apply freeze period check to actions
router.post("/create", protectRoute, checkFreezePeriod, createPost);
router.post("/commentOnPost/:id", protectRoute, checkFreezePeriod, commentOnPost);
router.post("/likeOrUnlike/:id", protectRoute, checkFreezePeriod, likeOrUnlikePost);
```

---

## 🎯 Next: Create Evaluation System

### 11. Create Scoring Utilities

**File: `be/lib/utils/scoringUtils.js`** (NEW FILE)

```javascript
import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";

/**
 * Calculate post score
 */
export const calculatePostScore = async (post) => {
    try {
        const postUser = await User.findById(post.user);
        if (!postUser) return 0;
        
        const accountAgeDays = (new Date() - postUser.createdAt) / (1000 * 60 * 60 * 24);
        
        const likesCount = post.likes.length;
        const commentsCount = post.comments.length;
        
        // Reputation bonus (0-10 points max)
        const reputationBonus = Math.min((postUser.reputation || 0) * 0.1, 10);
        
        // Base score: likes are worth 1, comments are worth 2
        let baseScore = (likesCount * 1) + (commentsCount * 2) + reputationBonus;
        
        // Account age multiplier (up to 10% boost for accounts older than 1 year)
        const ageMultiplier = 1 + (Math.min(accountAgeDays / 365, 1) * 0.1);
        
        return baseScore * ageMultiplier;
    } catch (error) {
        console.error("Error calculating post score:", error);
        return 0;
    }
};

/**
 * Calculate comment score
 */
export const calculateCommentScore = async (comment, postUser) => {
    try {
        const commentUser = await User.findById(comment.user);
        if (!commentUser) return 0;
        
        const accountAgeDays = (new Date() - commentUser.createdAt) / (1000 * 60 * 60 * 24);
        
        // For now, comments don't have likes yet, but structure is ready
        const likesCount = 0; // comment.likes ? comment.likes.length : 0;
        const repliesCount = 0; // comment.replies ? comment.replies.length : 0;
        
        // Reputation bonus
        const reputationBonus = Math.min((commentUser.reputation || 0) * 0.1, 10);
        
        // Base score
        let baseScore = (likesCount * 1) + (repliesCount * 2) + reputationBonus;
        
        // Account age multiplier
        const ageMultiplier = 1 + (Math.min(accountAgeDays / 365, 1) * 0.1);
        
        return baseScore * ageMultiplier;
    } catch (error) {
        console.error("Error calculating comment score:", error);
        return 0;
    }
};
```

### 12. Create Evaluation Controller

**File: `be/controllers/evaluation.controller.js`** (NEW FILE)

```javascript
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import { calculatePostScore, calculateCommentScore } from "../lib/utils/scoringUtils.js";
import { REWARD_CONFIG } from "../config/rewardConfig.js";
import { getCurrentCycleDate } from "../lib/utils/balanceUtils.js";
import { createTransaction, deductUserBalance } from "../lib/utils/balanceUtils.js";

/**
 * Run daily evaluation for a specific cycle date
 */
export const runDailyEvaluation = async (cycleDate = null) => {
    try {
        // Use provided date or get yesterday's date (for current freeze period)
        const evaluationDate = cycleDate || getCurrentCycleDate();
        
        console.log(`Starting evaluation for cycle: ${evaluationDate}`);
        
        // Get all posts from this cycle that haven't been evaluated
        const posts = await Post.find({
            freezePeriod: evaluationDate,
            evaluated: false
        }).populate('user', 'reputation createdAt').populate('comments.user', 'reputation createdAt');
        
        if (posts.length === 0) {
            console.log("No posts to evaluate for this cycle");
            return { success: true, message: "No posts to evaluate" };
        }
        
        // Calculate scores for all posts
        const postsWithScores = [];
        for (const post of posts) {
            const score = await calculatePostScore(post);
            post.score = score;
            await post.save();
            postsWithScores.push({ post, score });
        }
        
        // Sort by score descending
        postsWithScores.sort((a, b) => b.score - a.score);
        
        // Select top post winner
        if (postsWithScores.length > 0) {
            const winnerPost = postsWithScores[0].post;
            const winnerReward = (winnerPost.post_pool_coins * REWARD_CONFIG.TOP_POST_REWARD_PERCENT) / 100;
            
            // Distribute reward to post winner
            if (winnerReward > 0) {
                const winnerUser = await User.findById(winnerPost.user);
                if (winnerUser) {
                    await User.findByIdAndUpdate(winnerPost.user, {
                        $inc: { balance: winnerReward, totalEarnings: winnerReward }
                    });
                    
                    await createTransaction(
                        winnerPost.user,
                        'reward',
                        winnerReward,
                        'credit',
                        {
                            relatedPost: winnerPost._id,
                            description: `Won top post reward for cycle ${evaluationDate}`
                        }
                    );
                }
            }
            
            // Mark post as winner
            winnerPost.isWinner = true;
            winnerPost.winnerReward = winnerReward;
            winnerPost.evaluated = true;
            winnerPost.evaluationDate = new Date();
            await winnerPost.save();
            
            // Distribute liker rewards for winning post
            await distributeLikerRewards(winnerPost, 'post');
            
            console.log(`Post winner: ${winnerPost._id}, Reward: ${winnerReward}`);
        }
        
        // Evaluate comments for each post
        for (const { post } of postsWithScores) {
            await evaluatePostComments(post);
        }
        
        // Mark all posts as evaluated
        await Post.updateMany(
            { freezePeriod: evaluationDate, evaluated: false },
            { $set: { evaluated: true, evaluationDate: new Date() } }
        );
        
        console.log(`Evaluation completed for cycle: ${evaluationDate}`);
        return { success: true, postsEvaluated: posts.length };
        
    } catch (error) {
        console.error("Error in runDailyEvaluation:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Evaluate comments for a specific post
 */
const evaluatePostComments = async (post) => {
    if (post.comments.length === 0) return;
    
    // Calculate scores for all comments
    const commentsWithScores = [];
    for (const comment of post.comments) {
        if (!comment.evaluated) {
            const score = await calculateCommentScore(comment, post.user);
            comment.score = score;
            commentsWithScores.push({ comment, score });
        }
    }
    
    if (commentsWithScores.length === 0) return;
    
    // Sort by score
    commentsWithScores.sort((a, b) => b.score - a.score);
    
    // Select top comment winner
    const winnerComment = commentsWithScores[0].comment;
    const winnerReward = (post.comment_pool_coins * REWARD_CONFIG.TOP_COMMENT_REWARD_PERCENT) / 100;
    
    // Distribute reward
    if (winnerReward > 0) {
        const winnerUser = await User.findById(winnerComment.user);
        if (winnerUser) {
            await User.findByIdAndUpdate(winnerComment.user, {
                $inc: { balance: winnerReward, totalEarnings: winnerReward }
            });
            
            await createTransaction(
                winnerComment.user,
                'reward',
                winnerReward,
                'credit',
                {
                    relatedPost: post._id,
                    relatedComment: winnerComment._id?.toString(),
                    description: `Won top comment reward`
                }
            );
        }
    }
    
    // Mark comment as winner
    winnerComment.isWinner = true;
    winnerComment.winnerReward = winnerReward;
    winnerComment.evaluated = true;
    
    await post.save();
    
    // Distribute liker rewards for winning comment
    await distributeLikerRewards(winnerComment, 'comment', post);
};

/**
 * Distribute rewards to users who liked the winning post/comment
 */
const distributeLikerRewards = async (winnerItem, type, post = null) => {
    try {
        const rewardAmount = type === 'post' 
            ? REWARD_CONFIG.LIKER_REWARD_POST 
            : REWARD_CONFIG.LIKER_REWARD_COMMENT;
        
        // Get likers (for posts, use post.likes; for comments, we'd need comment.likes)
        const likers = type === 'post' ? winnerItem.likes : []; // Comments don't have likes yet
        
        if (likers.length === 0) return;
        
        // Get available reserve
        const availableReserve = winnerItem.liker_reserve || 0;
        const totalNeeded = likers.length * rewardAmount;
        
        // Calculate pro-rata if insufficient funds
        const actualRewardPerLiker = availableReserve >= totalNeeded 
            ? rewardAmount 
            : Math.floor(availableReserve / likers.length);
        
        if (actualRewardPerLiker <= 0) return;
        
        // Distribute to each liker
        for (const likerId of likers) {
            await User.findByIdAndUpdate(likerId, {
                $inc: { balance: actualRewardPerLiker, totalEarnings: actualRewardPerLiker }
            });
            
            await createTransaction(
                likerId,
                'reward',
                actualRewardPerLiker,
                'credit',
                {
                    relatedPost: type === 'post' ? winnerItem._id : post?._id,
                    description: `Liker reward for ${type}`
                }
            );
        }
        
        console.log(`Distributed ${actualRewardPerLiker} coins to ${likers.length} likers`);
    } catch (error) {
        console.error("Error distributing liker rewards:", error);
    }
};
```

### 13. Create Evaluation Job

**File: `be/jobs/evaluationJob.js`** (NEW FILE)

```javascript
import cron from "node-cron";
import { runDailyEvaluation } from "../controllers/evaluation.controller.js";

/**
 * Start the daily evaluation cron job
 * Runs at 6 AM every day
 */
export const startEvaluationJob = () => {
    // Schedule: "minute hour day month day-of-week"
    // "0 6 * * *" = 6:00 AM every day
    cron.schedule("0 6 * * *", async () => {
        console.log("=".repeat(50));
        console.log("Starting daily evaluation job at", new Date().toISOString());
        console.log("=".repeat(50));
        
        try {
            const result = await runDailyEvaluation();
            
            if (result.success) {
                console.log("✅ Daily evaluation completed successfully");
                console.log(`   Posts evaluated: ${result.postsEvaluated || 0}`);
            } else {
                console.error("❌ Daily evaluation failed:", result.error);
            }
        } catch (error) {
            console.error("❌ Error in daily evaluation job:", error);
        }
        
        console.log("=".repeat(50));
    });
    
    console.log("📅 Daily evaluation job scheduled (runs at 6 AM daily)");
};
```

### 14. Start Job in Server

**File: `be/server.js`** - Add at the end:

```javascript
// ... existing code ...

// Start evaluation job
if (process.env.NODE_ENV !== 'test') {
    const { startEvaluationJob } = await import('./jobs/evaluationJob.js');
    startEvaluationJob();
}
```

### 15. Create Manual Evaluation Endpoint (for testing)

**File: `be/routes/evaluation.routes.js`** (NEW FILE)

```javascript
import express from 'express';
import { protectRoute } from "../middleware/protectedRoute.js";
import { runDailyEvaluation } from '../controllers/evaluation.controller.js';

const router = express.Router();

// Manual trigger (admin only - add admin check later)
router.post("/run", protectRoute, async (req, res) => {
    try {
        const { cycleDate } = req.body; // Optional: specify date
        const result = await runDailyEvaluation(cycleDate);
        
        if (result.success) {
            res.status(200).json({
                message: "Evaluation completed successfully",
                ...result
            });
        } else {
            res.status(500).json({
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

export default router;
```

**File: `be/server.js`** - Add route:

```javascript
import evaluationRoutes from './routes/evaluation.routes.js';

// ... existing routes ...
app.use("/api/evaluation", evaluationRoutes);
```

---

## ✅ Testing the Implementation

### Test Checklist

1. ✅ Update fees (comment: 10, like: 1)
2. ✅ Create transaction model
3. ✅ Add time validation
4. ✅ Test freeze period blocking
5. ✅ Test fee splitting
6. ✅ Test evaluation job manually
7. ✅ Verify rewards distribution

### Manual Testing Commands

```bash
# Test creating a post
curl -X POST http://localhost:5001/api/post/create \
  -H "Cookie: AccessToken=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test post"}'

# Manually trigger evaluation (after 6 AM or test endpoint)
curl -X POST http://localhost:5001/api/evaluation/run \
  -H "Cookie: AccessToken=YOUR_TOKEN"
```

---

## 📝 Next Steps

1. ✅ Complete Phase 1 (Foundation)
2. ⏭️ Move to Phase 2 (Frontend updates)
3. ⏭️ Implement Phase 4 (Rate limiting)
4. ⏭️ Build Phase 5 (Anti-fraud)

Refer to `PROJECT_ROADMAP.md` for complete phase details!

---

**You're now ready to start implementing! 🚀**
