import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.js';

const router = Router();

// Remove /auth from the front since app.use('/auth', ...) adds it automatically
router.post('/register', register);
router.post('/login', login);
router.get('/me', getProfile);

export default router;