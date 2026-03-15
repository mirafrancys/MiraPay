import { Router } from 'express';
import usersRoutes from './users';
import transactionsRoutes from './transactions';
import authRoutes from './auth';
import clientsRoutes from './clients';
import projectsRoutes from './projects';
import tasksRoutes from './tasks';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/clients', clientsRoutes);
router.use('/projects', projectsRoutes);
router.use('/tasks', tasksRoutes);

export default router;
