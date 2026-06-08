import { Router } from 'express';
import { bankHoursController } from '../controllers/bank-hours.controller';

const router = Router();

router.get('/', bankHoursController.getAll);
router.post('/', bankHoursController.create);

export default router;
