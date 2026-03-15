import { Router } from 'express';
import { tasksController } from '../tasks/tasks.controller';

const router = Router();

// Get tasks by project
router.get('/project/:projectId', tasksController.getByProject);

// Get one by ID
router.get('/:id', tasksController.getOne);

// Create task
router.post('/', tasksController.create);

// Update task
router.patch('/:id', tasksController.update);

// Delete task
router.delete('/:id', tasksController.delete);

export default router;
