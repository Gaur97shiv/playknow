import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";
import { REWARD_CONFIG } from "../config/rewardConfig.js";
import { 
    checkUserBalance, 
    deductUserBalance, 
    addToDailyPool,
    addToPostPool
} from "../lib/utils/balanceUtils.js";
import { createTransaction } from "../lib/utils/transactionUtils.js";
import { checkAndLogFraud } from "../lib/utils/fraudDetection.js";
import { incrementDailyCount } from "../middleware/dailyLimitCheck.js";
import { getCurrentFreezePeriod } from "../lib/utils/timeUtils.js";

export const createPost = async (req, res) => {
    try {
        const {content} = req.body;
        let {image} = req.body;
        const userId = req.user._id.toString();
        const POSTING_FEE = REWARD_CONFIG.POST_FEE;
        
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
        
        const fraudCheck = await checkAndLogFraud(userId, "post");
        if (fraudCheck.flagged && fraudCheck.severity === "high") {
            return res.status(403).json({
                error: "Suspicious activity detected. Please try again later."
            });
        }
      
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }
        
        const deductionResult = await deductUserBalance(userId, POSTING_FEE, "post", null, "Post creation fee");
        if (!deductionResult.success) {
            return res.status(500).json({
                error: deductionResult.error
            });
        }
        
        const poolResult = await addToDailyPool(POSTING_FEE, true);
        if (!poolResult.success) {
            await deductUserBalance(userId, -POSTING_FEE);
            return res.status(500).json({
                error: poolResult.error
            });
        }
        
        await incrementDailyCount(userId, "post");
        
        const newPost = new Post({
            user: userId,
            content,
            image,
            freezePeriod: getCurrentFreezePeriod(),
            post_pool_coins: poolResult.split.prizePool,
            liker_reserve_coins: poolResult.split.likerReserve
        });
        await newPost.save();
        
        return res.status(201).json({
            message: "Post created successfully",
            post: newPost,
            balance: deductionResult.updatedUser.balance,
            dailyPool: poolResult.dailyPool
        });
    } catch(err) {
        console.error("Error in createPost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id.toString();
        const post = await Post.findById(id);
        
        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }
        
        if(post.user.toString() !== userId){
            return res.status(403).json({
                error: "You are not authorized to delete this post"
            });
        }
        
        if(post.image){
            const imageId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }
        
        await Post.findByIdAndDelete(id);
        
        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch(err) {
        console.error("Error in deletePost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const commentOnPost = async (req, res) => {
    try {
        const {id} = req.params;
        const {text} = req.body;
        const userId = req.user._id.toString();
        const COMMENT_FEE = REWARD_CONFIG.COMMENT_FEE;
        
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }
        
        if(!text){
            return res.status(400).json({
                error: "Please provide a comment"
            });
        }
        
        const balanceCheck = await checkUserBalance(userId, COMMENT_FEE);
        if (!balanceCheck.success) {
            return res.status(400).json({
                error: balanceCheck.error
            });
        }
        
        const fraudCheck = await checkAndLogFraud(userId, "comment", id);
        if (fraudCheck.flagged && fraudCheck.severity === "high") {
            return res.status(403).json({
                error: "Suspicious activity detected. Please try again later."
            });
        }
        
        const deductionResult = await deductUserBalance(userId, COMMENT_FEE, "comment", id, "Comment fee");
        if (!deductionResult.success) {
            return res.status(500).json({
                error: deductionResult.error
            });
        }
        
        const postPoolResult = await addToPostPool(id, COMMENT_FEE, true);
        if (!postPoolResult.success) {
            await deductUserBalance(userId, -COMMENT_FEE);
            return res.status(500).json({
                error: postPoolResult.error
            });
        }
        
        await incrementDailyCount(userId, "comment");
        
        post.comments.push({
            user: userId,
            text
        });
        await post.save();
        
        return res.status(200).json({
            message: "Comment added successfully",
            post: postPoolResult.post,
            balance: deductionResult.updatedUser.balance
        });
    } catch(err) {
        console.error("Error in commentOnPost controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const likeOrUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const LIKE_FEE = REWARD_CONFIG.LIKE_FEE;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
            return res.status(200).json(updatedLikes);
        } else {
            const balanceCheck = await checkUserBalance(userId, LIKE_FEE);
            if (!balanceCheck.success) {
                return res.status(400).json({
                    error: balanceCheck.error
                });
            }
            
            const fraudCheck = await checkAndLogFraud(userId, "like", postId);
            if (fraudCheck.flagged && fraudCheck.severity === "high") {
                return res.status(403).json({
                    error: "Suspicious activity detected. Please try again later."
                });
            }

            const deductionResult = await deductUserBalance(userId, LIKE_FEE, "like", postId, "Like fee");
            if (!deductionResult.success) {
                return res.status(500).json({
                    error: deductionResult.error
                });
            }

            const postPoolResult = await addToPostPool(postId, LIKE_FEE, false);
            if (!postPoolResult.success) {
                await deductUserBalance(userId, -LIKE_FEE);
                return res.status(500).json({
                    error: postPoolResult.error
                });
            }
            
            await incrementDailyCount(userId, "like");

            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();

            const updatedLikes = post.likes;
            return res.status(200).json({
                likes: updatedLikes,
                balance: deductionResult.updatedUser.balance,
                post: postPoolResult.post
            });
        }

    } catch (err) {
        console.error("Error in likeOrUnlikePost controller:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        const shuffledPosts = posts.sort(() => Math.random() - 0.5);

        res.status(200).json(shuffledPosts);
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllLikedPosts = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                error: "User not found"
            });
        }
        
        const likedPosts = await Post.find({_id: {$in: user.likedPost}})
            .populate({path:"user", select:"-password"})
            .populate({path:"comments.user", select:"-password"})
            .sort({createdAt: -1});
            
        return res.status(200).json({
            message: "Liked posts fetched successfully",
            likedPosts
        });
    } catch(err) {
        console.error("Error in getAllLikedPosts controller:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        const shuffledPosts = feedPosts.sort(() => Math.random() - 0.5);

        res.status(200).json(shuffledPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { name } = req.params;

        const user = await User.findOne({ name });
        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
