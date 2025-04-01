import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { getUserProfile } from '../controllers/user.controller.js';
import { followUser } from '../controllers/user.controller.js';
import { updateProfile } from '../controllers/user.controller.js';
const router = express.Router();
router.get('/profile/:userName',protectedRoute,getUserProfile)
router.post('/follow/:id',protectedRoute,followUser)
router.post('/updateProfile',protectedRoute,updateProfile)



export default router;