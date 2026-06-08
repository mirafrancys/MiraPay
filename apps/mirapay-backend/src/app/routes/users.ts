import { Router } from 'express';
import { usersController } from '../controllers/users.controller';

const router = Router();

// Get all users
router.get('/', usersController.getAll);

// Get one user by ID
router.get('/:id', usersController.getOne);

// Create a new user
router.post('/', usersController.create);

// Update user details
router.patch('/:id', usersController.update);

// Delete a user
router.delete('/:id', usersController.delete);

export default router;
