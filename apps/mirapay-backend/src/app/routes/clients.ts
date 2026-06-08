import { Router } from 'express';
import { clientsController } from '../controllers/clients.controller';

const router = Router();

// Get all clients
router.get('/', clientsController.getAll);

// Get one client by ID
router.get('/:id', clientsController.getOne);

// Create a new client
router.post('/', clientsController.create);

// Update client details
router.patch('/:id', clientsController.update);

// Archive a client
router.patch('/:id/archive', clientsController.archive);

// Delete a client
router.delete('/:id', clientsController.delete);

export default router;
