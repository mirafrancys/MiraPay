import { Router } from 'express';
import { bankHoursController } from '../bank-hours/bank-hours.controller';

const router = Router();

router.get('/', bankHoursController.getAll);
router.post('/', bankHoursController.create);

export default router;
