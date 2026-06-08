import { Router } from 'express';
import { contratsController } from '../controllers/contrats.controller';

const router = Router();

router.get('/', contratsController.getAll);
router.get('/:id', contratsController.getOne);
router.post('/', contratsController.create);
router.put('/:id', contratsController.update);

export default router;
