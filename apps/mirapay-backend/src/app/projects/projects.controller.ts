import { Request, Response } from 'express';
import { ProjectsService } from './projects.service';

const projectsService = new ProjectsService();

export class ProjectsController {
  async getAll(req: Request, res: Response) {
    try {
      const projects = await projectsService.findAll();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await projectsService.findOne(id);
      if (!project) {
        return res.status(404).json({ error: `Project with ID ${id} not found` });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const project = await projectsService.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await projectsService.update(id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await projectsService.remove(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const projectsController = new ProjectsController();
