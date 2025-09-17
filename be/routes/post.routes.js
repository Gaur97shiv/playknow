import express from 'express';
import { protectRoute } from "../middleware/protectedRoute.js"
import { createPost } from '../controllers/post.controller.js';
import { deletePost } from '../controllers/post.controller.js';
import { commentOnPost } from '../controllers/post.controller.js';
import { likeOrUnlikePost } from '../controllers/post.controller.js';
import { getAllPosts } from '../controllers/post.controller.js';
import { getAllLikedPosts } from '../controllers/post.controller.js';
import { getFollowingPosts } from '../controllers/post.controller.js';
import { getUserPosts } from '../controllers/post.controller.js';
import { getLikedPosts } from '../controllers/post.controller.js';
const router = express.Router();

router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.post("/commentOnPost/:id",protectRoute,commentOnPost);
router.post("/likeOrUnlike/:id",protectRoute,likeOrUnlikePost);
router.get("/getAllPosts",protectRoute,getAllPosts);
router.get("/getAllLikedPosts",protectRoute,getAllLikedPosts);
router.get("/following",protectRoute,getFollowingPosts);
router.get("/user/:name",protectRoute,getUserPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
export default router;