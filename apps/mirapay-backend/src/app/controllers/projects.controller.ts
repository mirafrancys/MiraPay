import { Request, Response } from 'express';
import { ProjectsService } from '../services/projects.service';

const projectsService = new ProjectsService();

export class ProjectsController {
  async getAll(req: Request, res: Response) {
    const projects = await projectsService.findAll();
    res.json(projects);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const project = await projectsService.findOne(id);
    if (!project) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }
    res.json(project);
  }

  async create(req: Request, res: Response) {
    const project = await projectsService.create(req.body);
    res.status(201).json(project);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const project = await projectsService.update(id, req.body);
    res.json(project);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await projectsService.remove(id);
    res.status(204).send();
  }
}

export const projectsController = new ProjectsController();

