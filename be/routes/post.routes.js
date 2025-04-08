import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { createPost } from '../controllers/post.controller.js';
import { deletePost } from '../controllers/post.controller.js';
import { commentOnPost } from '../controllers/post.controller.js';
import { likeOrUnlikePost } from '../controllers/post.controller.js';
import { getAllPosts } from '../controllers/post.controller.js';
const router = express.Router();

router.post("/create",protectedRoute,createPost);
router.delete("/:id",protectedRoute,deletePost);
router.post("/commentOnPost/:id",protectedRoute,commentOnPost);
router.post("/likeOrUnlike/:id",protectedRoute,likeOrUnlikePost);
router.get("/getAllPosts",protectedRoute,getAllPosts);
router.get("/getAllLikedPosts",protectedRoute,getAllLikedPosts);
export default router;