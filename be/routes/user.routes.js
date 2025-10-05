import express from 'express';
import { protectRoute } from "../middleware/protectedRoute.js"
import { getUserProfile } from '../controllers/user.controller.js';
import { followUser } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { getSuggestedUsers } from '../controllers/user.controller.js';
import { getUserBalance } from '../controllers/user.controller.js';
const router = express.Router();
router.get('/profile/:userName',protectRoute,getUserProfile)
router.post('/follow/:id',protectRoute,followUser)
router.post("/update", protectRoute, updateUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/balance", protectRoute, getUserBalance);



export default router;