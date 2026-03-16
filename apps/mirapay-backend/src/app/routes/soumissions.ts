import { Router } from 'express';
import { soumissionsController } from '../soumissions/soumissions.controller';

const router = Router();

router.get('/', soumissionsController.getAll);
router.get('/:id', soumissionsController.getOne);
router.post('/', soumissionsController.create);
router.put('/:id', soumissionsController.update);

export default router;
