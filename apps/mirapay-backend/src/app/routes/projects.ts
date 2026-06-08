import { Router } from 'express';
import { projectsController } from '../controllers/projects.controller';

const router = Router();

// Get all projects
router.get('/', projectsController.getAll);

// Get one project by ID
router.get('/:id', projectsController.getOne);

// Create a new project
router.post('/', projectsController.create);

// Update project details
router.patch('/:id', projectsController.update);

// Delete a project
router.delete('/:id', projectsController.delete);

export default router;
