import express from 'express';
import { protectRoute } from "../middleware/protectedRoute.js";
import { 
    createPost,
    deletePost,
    commentOnPost,
    likeOrUnlikePost,
    getAllPosts,
    getAllLikedPosts,
    getFollowingPosts,
    getUserPosts,
    getLikedPosts
} from '../controllers/post.controller.js';
import { 
    checkFreezePeriod, 
    checkDailyPostLimit, 
    checkDailyCommentLimit,
    checkDailyLikeLimit,
    checkSuspension
} from '../middleware/dailyLimitCheck.js';

const router = express.Router();

router.post("/create", protectRoute, checkSuspension, checkFreezePeriod, checkDailyPostLimit, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/commentOnPost/:id", protectRoute, checkSuspension, checkFreezePeriod, checkDailyCommentLimit, commentOnPost);
router.post("/likeOrUnlike/:id", protectRoute, checkSuspension, checkFreezePeriod, checkDailyLikeLimit, likeOrUnlikePost);
router.get("/getAllPosts", protectRoute, getAllPosts);
router.get("/getAllLikedPosts", protectRoute, getAllLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:name", protectRoute, getUserPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);

export default router;
