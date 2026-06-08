import { Router } from 'express';
import { timeEntriesController } from '../controllers/time-entries.controller';

const router = Router();

// Get all/filtered
router.get('/', timeEntriesController.getAll);

// Create entry
router.post('/', timeEntriesController.create);

// Update entry
router.patch('/:id', timeEntriesController.update);

// Approve entry
router.patch('/:id/approve', timeEntriesController.approve);

// Delete entry
router.delete('/:id', timeEntriesController.delete);

export default router;
