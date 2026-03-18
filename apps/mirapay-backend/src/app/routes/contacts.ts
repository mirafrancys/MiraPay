import { Router } from 'express';
import { contactsController } from '../contacts/contacts.controller';

const router = Router();

router.post('/', contactsController.create);
router.get('/client/:clientId', contactsController.getAllByClient);
router.delete('/:id', contactsController.delete);

export default router;
