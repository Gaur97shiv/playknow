import express from 'express';
import { signup, login, signout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', login);
router.get('/signout', signout);

export default router; 