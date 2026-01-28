import Transaction from "../../models/transaction.model.js";
import FraudLog from "../../models/fraudLog.model.js";
import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";

export const detectFraudPatterns = async (userId, actionType, relatedPostId = null) => {
    const flags = [];
    
    try {
        const recentActions = await Transaction.find({
            user: userId,
            createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
        });
        
        if (recentActions.length > 10) {
            flags.push("RAPID_ACTIONS");
        }
        
        if (actionType === "like" && relatedPostId) {
            const post = await Post.findById(relatedPostId);
            if (post && post.likes.length >= 10) {
                const recentLikers = post.likes.slice(-10);
                
                const likerInteractions = await Post.find({
                    _id: { $ne: relatedPostId },
                    likes: { $all: recentLikers.slice(0, 3) }
                }).limit(5);
                
                if (likerInteractions.length >= 3) {
                    flags.push("COORDINATED_LIKES");
                }
            }
        }
        
        if (actionType === "comment" && relatedPostId) {
            const userRecentComments = await Post.find({
                "comments.user": userId,
                createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
            });
            
            if (userRecentComments.length > 10) {
                flags.push("SPAM_COMMENTS");
            }
        }
        
        return flags;
    } catch (error) {
        console.error("Error detecting fraud patterns:", error);
        return flags;
    }
};

export const logFraudAttempt = async (userId, type, severity, description, evidence = {}) => {
    try {
        const fraudLog = new FraudLog({
            user: userId,
            type,
            severity,
            description,
            evidence
        });
        
        await fraudLog.save();
        
        await User.findByIdAndUpdate(userId, {
            $push: { fraudFlags: type }
        });
        
        if (severity === "high" || severity === "critical") {
            const user = await User.findById(userId);
            const newReputation = Math.max(0, user.reputation - 10);
            await User.findByIdAndUpdate(userId, {
                reputation: newReputation
            });
        }
        
        return { success: true, fraudLog };
    } catch (error) {
        console.error("Error logging fraud attempt:", error);
        return { success: false, error: "Database error" };
    }
};

export const checkAndLogFraud = async (userId, actionType, relatedPostId = null) => {
    const flags = await detectFraudPatterns(userId, actionType, relatedPostId);
    
    if (flags.length > 0) {
        const severity = flags.length >= 3 ? "high" : flags.length >= 2 ? "medium" : "low";
        
        await logFraudAttempt(
            userId,
            flags[0].toLowerCase(),
            severity,
            `Detected fraud patterns: ${flags.join(", ")}`,
            { flags, actionType, relatedPostId }
        );
        
        return { flagged: true, flags, severity };
    }
    
    return { flagged: false, flags: [], severity: null };
};
