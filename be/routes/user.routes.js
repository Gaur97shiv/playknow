import express from 'express';
import { protectRoute } from "../middleware/protectedRoute.js"
import { getUserProfile } from '../controllers/user.controller.js';
import { followUser } from '../controllers/user.controller.js';
import { updateProfile } from '../controllers/user.controller.js';
const router = express.Router();
router.get('/profile/:userName',protectRoute,getUserProfile)
router.post('/follow/:id',protectRoute,followUser)
router.post('/updateProfile',protectRoute,updateProfile)



export default router;