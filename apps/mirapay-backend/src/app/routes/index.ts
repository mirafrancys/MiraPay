import { Router } from 'express';
import usersRoutes from './users';
import transactionsRoutes from './transactions';
import authRoutes from './auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/transactions', transactionsRoutes);

export default router;
