import { Router } from 'express';
import usersRoutes from './users';
import transactionsRoutes from './transactions';

const router = Router();

router.use('/users', usersRoutes);
router.use('/transactions', transactionsRoutes);

export default router;
