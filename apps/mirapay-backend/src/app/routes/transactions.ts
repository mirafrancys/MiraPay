import { Router } from 'express';
import { transactionsController } from '../transactions/transactions.controller';

const router = Router();

// Get all transactions
router.get('/', transactionsController.getAll);

// Get a single transaction by ID
router.get('/:id', transactionsController.getOne);

// Create a new transaction
router.post('/', transactionsController.create);

// Update transaction status
router.patch('/:id/status', transactionsController.updateStatus);

// Delete a transaction
router.delete('/:id', transactionsController.delete);

export default router;
