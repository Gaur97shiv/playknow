import express from 'express';
import { signup,login,logout,checkAuth} from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router = express.Router();
router.get('/checkAuth',protectedRoute,checkAuth)
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',logout)


export default router;