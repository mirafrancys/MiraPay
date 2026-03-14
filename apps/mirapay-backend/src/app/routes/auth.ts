import { Router } from 'express';
import { authController } from '../auth/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.get('/roles', authController.getRoles);

export default router;
