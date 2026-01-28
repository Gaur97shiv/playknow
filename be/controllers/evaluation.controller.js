import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import DailyPool from "../models/dailyPool.model.js";
import EvaluationResult from "../models/evaluationResult.model.js";
import { REWARD_CONFIG } from "../config/rewardConfig.js";
import { calculatePostScore, calculateCommentScore, rankPosts, rankComments } from "../lib/utils/scoringUtils.js";
import { addUserBalance } from "../lib/utils/balanceUtils.js";
import { getActiveWindowStart, getActiveWindowEnd, getCurrentFreezePeriod } from "../lib/utils/timeUtils.js";

export const runDailyEvaluation = async () => {
    const freezePeriod = getCurrentFreezePeriod();
    
    const existingEvaluation = await EvaluationResult.findOne({ 
        freezePeriod,
        status: "completed"
    });
    
    if (existingEvaluation) {
        console.log(`Evaluation already completed for ${freezePeriod}`);
        return existingEvaluation;
    }
    
    const evaluationResult = new EvaluationResult({
        evaluationDate: new Date(),
        freezePeriod,
        status: "in_progress"
    });
    await evaluationResult.save();
    
    try {
        const windowStart = getActiveWindowStart();
        const windowEnd = getActiveWindowEnd();
        
        const posts = await Post.find({
            createdAt: { $gte: windowStart, $lt: windowEnd },
            evaluated: false
        }).populate("user", "-password");
        
        console.log(`Found ${posts.length} posts to evaluate`);
        
        if (posts.length === 0) {
            evaluationResult.status = "completed";
            evaluationResult.totalPostsEvaluated = 0;
            await evaluationResult.save();
            return evaluationResult;
        }
        
        const scoredPosts = await rankPosts(posts);
        
        for (const { post, score } of scoredPosts) {
            await Post.findByIdAndUpdate(post._id, { score });
        }
        
        const topPost = scoredPosts[0];
        if (topPost && topPost.post.post_pool_coins > 0) {
            const winnerReward = Math.floor(topPost.post.post_pool_coins * REWARD_CONFIG.TOP_POST_REWARD_PERCENT / 100);
            
            await addUserBalance(
                topPost.post.user._id,
                winnerReward,
                "reward",
                topPost.post._id,
                `Top post reward for ${freezePeriod}`
            );
            
            await Post.findByIdAndUpdate(topPost.post._id, {
                isWinner: true,
                winnerReward,
                evaluated: true,
                evaluationDate: new Date()
            });
            
            await User.findByIdAndUpdate(topPost.post.user._id, {
                $inc: { 
                    totalWins: 1,
                    reputation: REWARD_CONFIG.WIN_REPUTATION_BONUS
                }
            });
            
            evaluationResult.topPostWinner = {
                user: topPost.post.user._id,
                post: topPost.post._id,
                score: topPost.score,
                reward: winnerReward,
                type: "post"
            };
            
            evaluationResult.totalPoolDistributed = winnerReward;
            
            const likerRewards = [];
            for (const likerId of topPost.post.likes) {
                await addUserBalance(
                    likerId,
                    REWARD_CONFIG.LIKER_REWARD_POST,
                    "reward",
                    topPost.post._id,
                    `Liker reward for top post ${freezePeriod}`
                );
                
                likerRewards.push({
                    user: likerId,
                    reward: REWARD_CONFIG.LIKER_REWARD_POST,
                    forPost: topPost.post._id
                });
            }
            
            evaluationResult.likerRewards = likerRewards;
            evaluationResult.totalLikerRewardsDistributed = likerRewards.length * REWARD_CONFIG.LIKER_REWARD_POST;
        }
        
        const commentWinners = [];
        for (const { post } of scoredPosts) {
            if (post.comments && post.comments.length > 0 && post.comment_pool_coins > 0) {
                const scoredComments = await rankComments(post.comments);
                
                if (scoredComments.length > 0) {
                    const topComment = scoredComments[0];
                    const commentReward = Math.floor(post.comment_pool_coins * REWARD_CONFIG.TOP_COMMENT_REWARD_PERCENT / 100);
                    
                    await addUserBalance(
                        topComment.comment.user,
                        commentReward,
                        "reward",
                        post._id,
                        `Top comment reward for post`
                    );
                    
                    await User.findByIdAndUpdate(topComment.comment.user, {
                        $inc: { 
                            totalWins: 1,
                            reputation: Math.floor(REWARD_CONFIG.WIN_REPUTATION_BONUS / 2)
                        }
                    });
                    
                    commentWinners.push({
                        user: topComment.comment.user,
                        post: post._id,
                        commentId: topComment.comment._id.toString(),
                        score: topComment.score,
                        reward: commentReward,
                        type: "comment"
                    });
                    
                    evaluationResult.totalPoolDistributed += commentReward;
                }
            }
            
            await Post.findByIdAndUpdate(post._id, {
                evaluated: true,
                evaluationDate: new Date()
            });
        }
        
        evaluationResult.topCommentWinners = commentWinners;
        evaluationResult.totalPostsEvaluated = posts.length;
        evaluationResult.totalCommentsEvaluated = posts.reduce((sum, p) => sum + (p.post?.comments?.length || 0), 0);
        evaluationResult.status = "completed";
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        await DailyPool.findOneAndUpdate(
            { date: yesterdayStr },
            { 
                distributed: true,
                distributedAt: new Date(),
                winnerPostId: topPost?.post?._id,
                winnerUserId: topPost?.post?.user?._id,
                winnerReward: evaluationResult.topPostWinner?.reward || 0
            }
        );
        
        await evaluationResult.save();
        
        console.log(`Evaluation completed: ${posts.length} posts, ${evaluationResult.totalPoolDistributed} coins distributed`);
        
        return evaluationResult;
        
    } catch (error) {
        console.error("Evaluation error:", error);
        evaluationResult.status = "failed";
        evaluationResult.errorMessage = error.message;
        await evaluationResult.save();
        throw error;
    }
};

export const getLatestEvaluation = async (req, res) => {
    try {
        const evaluation = await EvaluationResult.findOne({ status: "completed" })
            .sort({ evaluationDate: -1 })
            .populate("topPostWinner.user", "name profileImg")
            .populate("topPostWinner.post", "content image")
            .populate("topCommentWinners.user", "name profileImg")
            .populate("likerRewards.user", "name profileImg");
        
        if (!evaluation) {
            return res.status(404).json({ error: "No evaluation results found" });
        }
        
        return res.status(200).json(evaluation);
    } catch (error) {
        console.error("Error fetching latest evaluation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getRecentWinners = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const evaluations = await EvaluationResult.find({ status: "completed" })
            .sort({ evaluationDate: -1 })
            .limit(parseInt(limit))
            .populate("topPostWinner.user", "name profileImg")
            .populate("topPostWinner.post", "content image")
            .lean();
        
        const winners = evaluations.map(evaluation => ({
            date: evaluation.evaluationDate,
            freezePeriod: evaluation.freezePeriod,
            topPost: evaluation.topPostWinner,
            totalDistributed: evaluation.totalPoolDistributed,
            totalLikerRewards: evaluation.totalLikerRewardsDistributed
        }));
        
        return res.status(200).json(winners);
    } catch (error) {
        console.error("Error fetching recent winners:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const triggerManualEvaluation = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Admin access required" });
        }
        
        const result = await runDailyEvaluation();
        return res.status(200).json({
            message: "Evaluation completed",
            result
        });
    } catch (error) {
        console.error("Error in manual evaluation:", error);
        return res.status(500).json({ error: "Evaluation failed" });
    }
};
