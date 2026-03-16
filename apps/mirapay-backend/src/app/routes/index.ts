import { Router } from 'express';
import usersRoutes from './users';
import transactionsRoutes from './transactions';
import authRoutes from './auth';
import clientsRoutes from './clients';
import projectsRoutes from './projects';
import tasksRoutes from './tasks';
import timeEntriesRoutes from './time-entries';
import invoicesRoutes from './invoices';
import bankHoursRoutes from './bank-hours';
import soumissionsRoutes from './soumissions';
import contratsRoutes from './contrats';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/clients', clientsRoutes);
router.use('/projects', projectsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/time-entries', timeEntriesRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/bank-hours', bankHoursRoutes);
router.use('/soumissions', soumissionsRoutes);
router.use('/contrats', contratsRoutes);

export default router;
