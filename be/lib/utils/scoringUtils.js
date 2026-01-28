import User from "../../models/user.model.js";

export const calculatePostScore = async (post, postUser = null) => {
    try {
        if (!postUser) {
            postUser = await User.findById(post.user);
        }
        
        if (!postUser) {
            return 0;
        }
        
        const accountAgeDays = (new Date() - new Date(postUser.createdAt)) / (1000 * 60 * 60 * 24);
        
        const likesCount = post.likes?.length || 0;
        const commentsCount = post.comments?.length || 0;
        
        let commentLikesCount = 0;
        if (post.comments) {
            post.comments.forEach(comment => {
                commentLikesCount += comment.likes?.length || 0;
            });
        }
        
        const reputationBonus = (postUser.reputation || 50) * 0.1;
        
        let baseScore = (likesCount * 1) + (commentsCount * 2) + (commentLikesCount * 0.5) + reputationBonus;
        
        const ageMultiplier = 1 + (Math.min(accountAgeDays / 365, 1) * 0.1);
        
        return Math.round(baseScore * ageMultiplier * 100) / 100;
    } catch (error) {
        console.error("Error calculating post score:", error);
        return 0;
    }
};

export const calculateCommentScore = async (comment, commentUser = null) => {
    try {
        if (!commentUser) {
            commentUser = await User.findById(comment.user);
        }
        
        if (!commentUser) {
            return 0;
        }
        
        const accountAgeDays = (new Date() - new Date(commentUser.createdAt)) / (1000 * 60 * 60 * 24);
        
        const likesCount = comment.likes?.length || 0;
        const repliesCount = 0;
        const reputationBonus = (commentUser.reputation || 50) * 0.1;
        
        let baseScore = (likesCount * 1) + (repliesCount * 2) + reputationBonus;
        const ageMultiplier = 1 + (Math.min(accountAgeDays / 365, 1) * 0.1);
        
        return Math.round(baseScore * ageMultiplier * 100) / 100;
    } catch (error) {
        console.error("Error calculating comment score:", error);
        return 0;
    }
};

export const rankPosts = async (posts) => {
    const scoredPosts = await Promise.all(
        posts.map(async (post) => {
            const score = await calculatePostScore(post);
            return { post, score };
        })
    );
    
    scoredPosts.sort((a, b) => b.score - a.score);
    return scoredPosts;
};

export const rankComments = async (comments) => {
    const scoredComments = await Promise.all(
        comments.map(async (comment) => {
            const score = await calculateCommentScore(comment);
            return { comment, score };
        })
    );
    
    scoredComments.sort((a, b) => b.score - a.score);
    return scoredComments;
};
