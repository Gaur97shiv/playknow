import User from "../../models/user.model.js";
import DailyPool from "../../models/dailyPool.model.js";

// Helper function to get today's date string
export const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Helper function to check if user has sufficient balance
export const checkUserBalance = async (userId, requiredAmount) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: "User not found" };
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

// Helper function to deduct balance from user
export const deductUserBalance = async (userId, amount) => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            { $inc: { balance: -amount } },
            { new: true }
        );
        
        if (!result) {
            return { success: false, error: "User not found" };
        }
        
        return { success: true, updatedUser: result };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

// Helper function to add coins to daily pool
export const addToDailyPool = async (amount) => {
    try {
        const today = getTodayDateString();
        
        // Find or create today's pool
        const dailyPool = await DailyPool.findOneAndUpdate(
            { date: today },
            { 
                $inc: { 
                    total_pool_coins: amount,
                    posts_count: 1
                }
            },
            { 
                upsert: true, /*“If a document that matches the filter exists, update it.
                If it doesn’t exist, insert a new one using the provided data.”*/
                new: true 
            }
        );
        
        return { success: true, dailyPool };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};

// Helper function to add coins to post pool
export const addToPostPool = async (postId, amount) => {
    try {
        const Post = (await import("../../models/post.model.js")).default;
        //great example of lazy loading 
        
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { total_coin_on_post: amount } },
            { new: true }
        );
        
        if (!post) {
            return { success: false, error: "Post not found" };
        }
        
        return { success: true, post };
    } catch (error) {
        return { success: false, error: "Database error" };
    }
};
