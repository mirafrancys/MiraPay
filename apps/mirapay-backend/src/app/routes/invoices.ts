import { Router } from 'express';
import { invoicesController } from '../controllers/invoices.controller';

const router = Router();

// Get all invoices
router.get('/', invoicesController.getAll);

// Get one by ID
router.get('/:id', invoicesController.getOne);

// Draft an invoice (Pre-calculate sums before creating)
router.post('/prepare-draft', invoicesController.prepareDraft);

// Create real invoice
router.post('/', invoicesController.create);

// Update Status
router.patch('/:id/status', invoicesController.updateStatus);

export default router;
